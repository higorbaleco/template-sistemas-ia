#!/usr/bin/env python3
"""Local app server for the Mac Curator interface."""

from __future__ import annotations

import json
import mimetypes
import os
import subprocess
import sys
import threading
import time
import uuid
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse

if __package__ in (None, ""):
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from scripts.common import open_in_browser, project_path

HOST = "127.0.0.1"
PORT = 8765
BASE_DIR = project_path()
UI_DIR = BASE_DIR / "ui"
CATALOG_DIR = BASE_DIR / "catalog"

JOB_SCRIPTS = {
    "check": project_path("scripts", "check_environment.py"),
    "inventory": project_path("scripts", "scan_inventory.py"),
    "applications": project_path("scripts", "scan_applications.py"),
    "system_data": project_path("scripts", "scan_system_data.py"),
    "git": project_path("scripts", "scan_git_repos.py"),
    "regenerable": project_path("scripts", "scan_regenerable.py"),
    "duplicates": project_path("scripts", "scan_duplicates.py"),
    "build": project_path("scripts", "build_catalog.py"),
    "pipeline": project_path("scripts", "run_pipeline.py"),
}

JOBS: dict[str, dict] = {}
JOBS_LOCK = threading.Lock()


def load_state() -> dict:
    data_file = CATALOG_DIR / "dashboard_data.json"
    if not data_file.exists():
        return {
            "timestamp": time.time(),
            "summary": {
                "total_items": 0,
                "total_size_gb": 0,
                "total_regenerable_gb": 0,
                "total_duplicable_gb": 0,
            },
            "acoes": {},
            "items": [],
        }

    try:
        with data_file.open("r", encoding="utf-8") as handle:
            data = json.load(handle)
    except json.JSONDecodeError:
        return {
            "timestamp": time.time(),
            "summary": {
                "total_items": 0,
                "total_size_gb": 0,
                "total_regenerable_gb": 0,
                "total_duplicable_gb": 0,
            },
            "acoes": {},
            "items": [],
        }

    items = data.get("items", [])
    summary = dict(data.get("summary", {}))

    selected = [item for item in items if item.get("acao_recomendada") == "apagar-depois"]
    drive_candidates = [item for item in items if should_suggest_drive(item)]
    git_candidates = [item for item in items if should_suggest_git(item)]
    protected = [item for item in items if should_suggest_protected(item)]

    summary.update({
        "total_items": len(items),
        "total_size_gb": round(sum(float(item.get("size_gb", 0)) for item in items), 2),
        "total_regenerable_gb": round(sum(float(item.get("size_gb", 0)) for item in items if item.get("regenerable_type")), 2),
        "total_duplicable_gb": round(sum(float(item.get("size_gb", 0)) for item in items if item.get("duplicate_group")), 2),
        "estimated_drive_gb": round(sum(float(item.get("size_gb", 0)) for item in drive_candidates), 2),
        "estimated_git_gb": round(sum(float(item.get("size_gb", 0)) for item in git_candidates), 2),
        "estimated_protected_gb": round(sum(float(item.get("size_gb", 0)) for item in protected), 2),
        "estimated_delete_gb": round(sum(float(item.get("size_gb", 0)) for item in selected), 2),
    })

    data["summary"] = summary
    data["automation"] = build_automation_status()
    data["derived"] = {
        "drive_candidates": len(drive_candidates),
        "git_candidates": len(git_candidates),
        "protected_candidates": len(protected),
        "delete_candidates": len(selected),
    }
    return data


def build_automation_status() -> list[dict]:
    modules = [
        ("Inventory Agent", "inventory", CATALOG_DIR / "inventory.jsonl"),
        ("Applications Agent", "applications", CATALOG_DIR / "applications.json"),
        ("System Data Agent", "system_data", CATALOG_DIR / "system_data.json"),
        ("Git Agent", "git", CATALOG_DIR / "git_repos.json"),
        ("Regenerable Agent", "regenerable", CATALOG_DIR / "regenerable.json"),
        ("Duplicate Agent", "duplicates", CATALOG_DIR / "duplicates.json"),
        ("Report Agent", "build", CATALOG_DIR / "RELATORIO.md"),
    ]
    result = []
    for label, key, path in modules:
        result.append(
            {
                "label": label,
                "key": key,
                "status": "done" if path.exists() else "pending",
                "path": str(path),
            }
        )
    return result


def normalize_path(path_value: str) -> str:
    return os.path.expanduser(path_value or "")


def should_suggest_drive(item: dict) -> bool:
    path_value = str(item.get("path", ""))
    ext = str(item.get("ext", "")).lower()
    if item.get("duplicate_group") or item.get("regenerable_type"):
        return False
    if item.get("git_status"):
        return False
    if any(token in path_value for token in ("/Documents/", "/Downloads/", "/Desktop/")):
        return ext in {
            ".pdf",
            ".ppt",
            ".pptx",
            ".doc",
            ".docx",
            ".key",
            ".zip",
            ".rar",
            ".7z",
            ".mp4",
            ".mov",
            ".png",
            ".jpg",
            ".jpeg",
            ".svg",
            ".fig",
            ".xd",
            ".csv",
            ".xlsx",
        } or float(item.get("size_gb", 0)) >= 0.05
    return False


def should_suggest_git(item: dict) -> bool:
    path_value = str(item.get("path", ""))
    git_status = item.get("git_status")
    if git_status:
        return True
    return any(
        token in path_value.lower()
        for token in (
            "projeto",
            "project",
            "repo",
            "code",
            "src",
            "scripts",
            "design system",
        )
    ) and str(item.get("ext", "")).lower() in {".md", ".py", ".ts", ".tsx", ".js", ".jsx", ".json", ".css", ".html"}


def should_suggest_protected(item: dict) -> bool:
    path_value = str(item.get("path", ""))
    return any(
        token in path_value
        for token in (
            "/.ssh",
            "/.gnupg",
            "/Library/Keychains",
            "/Library/Mail",
            "/Library/Messages",
            "Photos Library.photoslibrary",
        )
    )


def run_job(name: str, command: list[str]) -> str:
    job_id = str(uuid.uuid4())
    with JOBS_LOCK:
        JOBS[job_id] = {
            "id": job_id,
            "name": name,
            "status": "running",
            "started_at": time.time(),
            "finished_at": None,
            "command": command,
            "output": "",
        }

    def worker() -> None:
        try:
            process = subprocess.run(command, cwd=str(BASE_DIR), capture_output=True, text=True)
            output = "\n".join(filter(None, [process.stdout.strip(), process.stderr.strip()]))
            with JOBS_LOCK:
                JOBS[job_id]["status"] = "done" if process.returncode == 0 else "failed"
                JOBS[job_id]["returncode"] = process.returncode
                JOBS[job_id]["output"] = output[-4000:]
                JOBS[job_id]["finished_at"] = time.time()
        except Exception as exc:
            with JOBS_LOCK:
                JOBS[job_id]["status"] = "failed"
                JOBS[job_id]["output"] = str(exc)
                JOBS[job_id]["finished_at"] = time.time()

    threading.Thread(target=worker, daemon=True).start()
    return job_id


def open_target(target: str) -> None:
    target_path = project_path(target)
    if target_path.exists():
        subprocess.Popen(["open", str(target_path)])
    elif target == "app":
        bundle_path = project_path("dist", "Mac Curator.app")
        if bundle_path.exists():
            subprocess.Popen(["open", str(bundle_path)])


class AppHandler(SimpleHTTPRequestHandler):
    def translate_path(self, path: str) -> str:
        parsed = urlparse(path)
        clean_path = parsed.path
        if clean_path in {"/", ""}:
            return str(UI_DIR / "panel.html")
        if clean_path.startswith("/ui/"):
            return str(UI_DIR / clean_path.removeprefix("/ui/"))
        if clean_path.startswith("/catalog/"):
            return str(CATALOG_DIR / clean_path.removeprefix("/catalog/"))
        return super().translate_path(path)

    def end_headers(self) -> None:
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        super().end_headers()

    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        if parsed.path == "/api/state":
            self.respond_json(load_state())
            return
        if parsed.path == "/api/jobs":
            with JOBS_LOCK:
                self.respond_json({"jobs": list(JOBS.values())})
            return
        if parsed.path.startswith("/api/jobs/"):
            job_id = parsed.path.rsplit("/", 1)[-1]
            with JOBS_LOCK:
                payload = JOBS.get(job_id)
            if payload is None:
                self.respond_json({"error": "job not found"}, status=404)
            else:
                self.respond_json(payload)
            return
        if parsed.path == "/api/open/report":
            open_target("catalog/RELATORIO.md")
            self.respond_json({"ok": True})
            return
        if parsed.path == "/api/open/catalog":
            open_target("catalog")
            self.respond_json({"ok": True})
            return
        if parsed.path == "/api/open/app":
            open_target("app")
            self.respond_json({"ok": True})
            return
        super().do_GET()

    def do_POST(self) -> None:
        parsed = urlparse(self.path)
        if parsed.path == "/api/run":
            length = int(self.headers.get("Content-Length", "0"))
            body = self.rfile.read(length).decode("utf-8") if length else ""
            payload = parse_qs(body)
            action = (payload.get("action", [""])[0] or "").strip()
            if action not in JOB_SCRIPTS:
                self.respond_json({"error": "invalid action"}, status=400)
                return
            job_id = run_job(action, [sys.executable, str(JOB_SCRIPTS[action])])
            self.respond_json({"ok": True, "job_id": job_id})
            return
        self.respond_json({"error": "not found"}, status=404)

    def log_message(self, format: str, *args) -> None:
        return

    def respond_json(self, payload: dict, status: int = 200) -> None:
        data = json.dumps(payload, ensure_ascii=True).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)


def main() -> int:
    server = ThreadingHTTPServer((HOST, PORT), AppHandler)
    url = f"http://{HOST}:{PORT}"
    print(f"Mac Curator running at {url}")
    open_in_browser(url)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
