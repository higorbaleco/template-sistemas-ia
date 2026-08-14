"""Ferramenta de Consulta - Scraper de Grupos WhatsApp & Telegram."""
from __future__ import annotations

import csv
import io
import json
import logging
import os
import sys
import time
from threading import Lock, Thread
from uuid import uuid4

from flask import (
    Flask,
    Response,
    jsonify,
    request,
    stream_with_context,
)

# Adicionar o diretório do projeto ao path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from config import (  # noqa: E402
    ADULT_DIRECTORY_SITES,
    DEFAULT_EXECUTION_MODE,
    DEFAULT_PAGES,
    DIRECTORY_SITES,
    EXECUTION_MODES,
    PAGES_STEP,
    SOCIAL_MEDIA_LABELS,
)
from services.search_service import SearchService  # noqa: E402

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# ── Estado global ────────────────────────────────────────────────
tasks: dict[str, dict] = {}

session_stats = {"searches": 0, "links_found": 0, "valid": 0, "invalid": 0}
stats_lock = Lock()

source_states: dict[str, bool] = {
    **{
        key: bool(site.get("default_enabled", True)) and key not in ADULT_DIRECTORY_SITES
        for key, site in DIRECTORY_SITES.items()
    },
    **{key: True for key in SOCIAL_MEDIA_LABELS},
}
sources_lock = Lock()

runtime_rules = {"adult_mode": False}
rules_lock = Lock()

search_queue: list[dict] = []
queue_lock = Lock()
queue_processor_running = False


# ── Normalização de inputs ───────────────────────────────────────
def _sanitize_max_pages(raw_value) -> int:
    """Normaliza max_pages para faixa válida e passo em lotes."""
    try:
        pages = int(raw_value)
    except (TypeError, ValueError):
        pages = DEFAULT_PAGES

    pages = max(PAGES_STEP, min(pages, MAX_PAGES))
    remainder = pages % PAGES_STEP
    if remainder:
        pages -= remainder
    return max(PAGES_STEP, pages)


def _sanitize_start_page(raw_value) -> int:
    """Normaliza start_page para inteiro >= 1."""
    try:
        page = int(raw_value)
    except (TypeError, ValueError):
        page = 1
    return max(1, page)


def _normalize_link_types(raw_types) -> list[str]:
    """Normaliza link_types garantindo somente whatsapp/telegram."""
    allowed = {"whatsapp", "telegram"}
    if isinstance(raw_types, str):
        values = [raw_types]
    elif isinstance(raw_types, list):
        values = raw_types
    else:
        values = ["whatsapp", "telegram"]

    normalized: list[str] = []
    for value in values:
        if value in allowed and value not in normalized:
            normalized.append(value)
    return normalized


def _normalize_execution_mode(raw_mode) -> str:
    """Normaliza execution_mode garantindo valor suportado."""
    mode = str(raw_mode or "").strip().lower()
    if mode in EXECUTION_MODES:
        return mode
    return DEFAULT_EXECUTION_MODE


def _is_adult_mode_enabled() -> bool:
    with rules_lock:
        return bool(runtime_rules.get("adult_mode"))


def _filter_selected_sources(
    social_media: list[str],
    directory_sites: list[str],
) -> tuple[list[str], list[str]]:
    """Filtra fontes selecionadas conforme regras globais e estados ativos."""
    adult_mode = _is_adult_mode_enabled()
    with sources_lock:
        states_snapshot = dict(source_states)

    filtered_social = [
        key for key in social_media
        if key in SOCIAL_MEDIA_LABELS and states_snapshot.get(key, False)
    ]

    filtered_directory: list[str] = []
    for key in directory_sites:
        if key not in DIRECTORY_SITES:
            continue
        if not states_snapshot.get(key, False):
            continue
        if key in ADULT_DIRECTORY_SITES and not adult_mode:
            continue
        filtered_directory.append(key)

    return filtered_social, filtered_directory


def _build_search_params(data: dict) -> tuple[dict, str | None]:
    """Valida e sanitiza parâmetros de busca."""
    keyword = str(data.get("keyword", "")).strip()
    category = str(data.get("category", "")).strip()
    max_pages = _sanitize_max_pages(data.get("max_pages", DEFAULT_PAGES))
    start_page = _sanitize_start_page(data.get("start_page", 1))
    link_types = _normalize_link_types(data.get("link_types", ["whatsapp", "telegram"]))
    execution_mode = _normalize_execution_mode(data.get("execution_mode"))
    social_media = data.get("social_media", []) or []
    directory_sites = data.get("directory_sites", []) or []

    if not keyword and not category:
        return {}, "Informe uma palavra-chave ou categoria."
    if not link_types:
        return {}, "Selecione pelo menos um canal (WhatsApp ou Telegram)."

    if not isinstance(social_media, list):
        social_media = []
    if not isinstance(directory_sites, list):
        directory_sites = []

    # Se cliente não enviar fontes explícitas (ex.: extensão), usa fontes ativas.
    if not social_media and not directory_sites:
        with sources_lock:
            states_snapshot = dict(source_states)
        social_media = [
            key for key in SOCIAL_MEDIA_LABELS
            if states_snapshot.get(key, False)
        ]
        directory_sites = [
            key for key in DIRECTORY_SITES
            if states_snapshot.get(key, False)
        ]

    social_media, directory_sites = _filter_selected_sources(
        social_media=social_media,
        directory_sites=directory_sites,
    )

    if not social_media and not directory_sites:
        if _is_adult_mode_enabled():
            return {}, "Selecione pelo menos uma fonte ativa para a busca."
        return {}, "Selecione pelo menos uma fonte ativa para a busca. Fontes +18 exigem modo +18."

    return {
        "keyword": keyword,
        "category": category,
        "max_pages": max_pages,
        "start_page": start_page,
        "link_types": link_types,
        "execution_mode": execution_mode,
        "social_media": social_media,
        "directory_sites": directory_sites,
    }, None


# ── Rotas: API ───────────────────────────────────────────────────
@app.route("/")
def index():
    """Raiz da API usada pela extensão Chrome."""
    return jsonify({
        "name": "Ferramenta Consulta API",
        "mode": "extension-only",
        "message": "Use a extensao Chrome para iniciar buscas.",
        "status_url": "/stats",
        "search_url": "/buscar",
    })


# ── Rotas: Busca ─────────────────────────────────────────────────
@app.route("/buscar", methods=["POST"])
def buscar():
    """Inicia uma busca em background e retorna o task_id."""
    data = request.get_json(silent=True) or {}
    params, error = _build_search_params(data)
    if error:
        return jsonify({"error": error}), 400

    task_id = str(uuid4())
    tasks[task_id] = {
        "status": "running",
        "events": [],
        "results": None,
        "params": params,
    }

    thread = Thread(
        target=_run_search,
        args=(
            task_id,
            params["keyword"],
            params["category"],
            params["max_pages"],
            params["start_page"],
            params["social_media"],
            params["directory_sites"],
            params["link_types"],
            params["execution_mode"],
        ),
        daemon=True,
    )
    thread.start()

    return jsonify({"task_id": task_id})


@app.route("/status/<task_id>")
def status(task_id):
    """Retorna o status atual da tarefa via SSE."""
    if task_id not in tasks:
        return jsonify({"error": "Tarefa não encontrada."}), 404

    def generate():
        last_event_count = 0
        while True:
            task = tasks.get(task_id)
            if not task:
                break

            events = task.get("events", [])
            if len(events) > last_event_count:
                for event in events[last_event_count:]:
                    if isinstance(event, dict):
                        payload = event
                    else:
                        payload = {"type": "progress", "message": str(event)}
                    yield f"data: {json.dumps(payload)}\n\n"
                last_event_count = len(events)

            if task["status"] == "completed":
                payload = {"type": "completed", "results": task["results"]}
                yield f"data: {json.dumps(payload)}\n\n"
                break
            if task["status"] == "error":
                payload = {"type": "error", "message": task.get("error", "Erro desconhecido")}
                yield f"data: {json.dumps(payload)}\n\n"
                break

            time.sleep(0.5)

    return Response(
        stream_with_context(generate()),
        mimetype="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


@app.route("/resultado/<task_id>")
def resultado(task_id):
    """Retorna o resultado bruto da tarefa concluída."""
    task = tasks.get(task_id)
    if not task or task.get("status") != "completed" or not task.get("results"):
        return jsonify({"error": "Resultado não encontrado."}), 404
    return jsonify({
        "task_id": task_id,
        "results": task["results"],
        "params": task.get("params", {}),
    })


@app.route("/exportar/<task_id>")
def exportar(task_id):
    """Exporta resultados como CSV."""
    task = tasks.get(task_id)
    if not task or not task.get("results"):
        return jsonify({"error": "Resultados não encontrados."}), 404

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["URL", "Canal", "Status", "Nome do Grupo"])

    status_labels = {
        "valido": "Valido",
        "invalido": "Invalido",
        "lotado": "Lotado",
        "desconhecido": "Desconhecido",
        "timeout": "Timeout",
        "erro": "Erro",
        "erro_conexao": "Erro de Conexao",
    }

    for result in task["results"]["results"]:
        writer.writerow([
            result["url"],
            "WhatsApp" if result["type"] == "whatsapp" else "Telegram",
            status_labels.get(result["status"], result["status"]),
            result.get("name", ""),
        ])

    output.seek(0)
    return Response(
        output.getvalue(),
        mimetype="text/csv",
        headers={"Content-Disposition": "attachment; filename=grupos_encontrados.csv"},
    )


# ── Rotas: Estatísticas ──────────────────────────────────────────
@app.route("/stats")
def get_stats():
    """Retorna estatísticas acumuladas da sessão."""
    with stats_lock:
        return jsonify(dict(session_stats))


# ── Rotas: Regras (+18) ─────────────────────────────────────────
@app.route("/regras", methods=["GET"])
def get_regras():
    """Retorna regras globais de execução."""
    with rules_lock:
        return jsonify(dict(runtime_rules))


@app.route("/regras", methods=["POST"])
def update_regras():
    """Atualiza regras globais, incluindo modo +18."""
    data = request.get_json(silent=True) or {}
    requested_adult = bool(data.get("adult_mode", False))

    with rules_lock:
        runtime_rules["adult_mode"] = requested_adult

    # Ao desligar +18, desativa fontes adultas automaticamente.
    if not requested_adult:
        with sources_lock:
            for key in ADULT_DIRECTORY_SITES:
                source_states[key] = False

    return get_regras()


# ── Rotas: Fontes ────────────────────────────────────────────────
@app.route("/fontes", methods=["GET"])
def get_fontes():
    """Retorna estado de ativação de cada fonte."""
    with sources_lock:
        states = dict(source_states)

    if not _is_adult_mode_enabled():
        for key in ADULT_DIRECTORY_SITES:
            states[key] = False

    return jsonify(states)


@app.route("/fontes", methods=["POST"])
def update_fontes():
    """Atualiza estado de ativação das fontes."""
    data = request.get_json(silent=True) or {}
    new_states = data.get("states", {})
    if not isinstance(new_states, dict):
        return jsonify({"error": "Payload inválido."}), 400

    adult_mode = _is_adult_mode_enabled()

    with sources_lock:
        for key, value in new_states.items():
            if key not in source_states:
                continue
            if key in ADULT_DIRECTORY_SITES and not adult_mode:
                source_states[key] = False
                continue
            source_states[key] = bool(value)
        states = dict(source_states)

    if not adult_mode:
        for key in ADULT_DIRECTORY_SITES:
            states[key] = False

    logger.info("Fontes atualizadas: %d ativas", sum(states.values()))
    return jsonify(states)


@app.route("/fontes/saude", methods=["GET"])
def get_fontes_saude():
    """Retorna score e status de saúde por fonte."""
    service = SearchService()
    health = service.get_source_health()
    enriched = {}
    for key, entry in health.items():
        item = dict(entry)
        if key in DIRECTORY_SITES:
            item["label"] = DIRECTORY_SITES[key].get("name", key)
            item["kind"] = "directory"
        elif key in SOCIAL_MEDIA_LABELS:
            item["label"] = SOCIAL_MEDIA_LABELS[key]
            item["kind"] = "social"
        else:
            item["label"] = key
        enriched[key] = item
    return jsonify({
        "execution_modes": EXECUTION_MODES,
        "default_execution_mode": DEFAULT_EXECUTION_MODE,
        "sources": enriched,
    })


@app.route("/fontes/recalcular", methods=["POST"])
def reset_fontes_saude():
    """Reseta saúde de fontes (todas ou lista específica)."""
    data = request.get_json(silent=True) or {}
    sources = data.get("sources")
    if sources is not None and not isinstance(sources, list):
        return jsonify({"error": "Campo 'sources' deve ser uma lista."}), 400

    service = SearchService()
    health = service.reset_source_health(sources)
    return jsonify({
        "ok": True,
        "sources": health,
    })


# ── Rotas: Fila ──────────────────────────────────────────────────
@app.route("/fila", methods=["GET"])
def get_fila():
    """Retorna a fila de buscas."""
    with queue_lock:
        return jsonify(list(search_queue))


@app.route("/fila", methods=["POST"])
def add_to_fila():
    """Adiciona uma busca à fila."""
    data = request.get_json(silent=True) or {}
    params, error = _build_search_params(data)
    if error:
        return jsonify({"error": error}), 400

    queue_id = str(uuid4())
    display_label = (
        params["keyword"]
        if params["keyword"]
        else params["category"].capitalize()
        if params["category"]
        else "(sem keyword)"
    )
    item = {
        "id": queue_id,
        "keyword": display_label,
        "params": params,
        "status": "pending",
        "task_id": None,
        "result_summary": None,
        "added_at": time.strftime("%H:%M:%S"),
    }

    with queue_lock:
        search_queue.append(item)

    _ensure_queue_processor()
    return jsonify({"queue_id": queue_id, "item": item})


@app.route("/fila/<queue_id>", methods=["DELETE"])
def remove_from_fila(queue_id):
    """Remove um item pendente da fila."""
    with queue_lock:
        item = next((entry for entry in search_queue if entry["id"] == queue_id), None)
        if not item:
            return jsonify({"error": "Item não encontrado."}), 404
        if item["status"] != "pending":
            return jsonify({"error": "Só é possível remover itens pendentes."}), 400
        search_queue.remove(item)

    return jsonify({"ok": True})


@app.route("/fila/historico", methods=["DELETE"])
def clear_fila_historico():
    """Remove itens históricos da fila (concluídos/erro)."""
    removed_items: list[dict] = []
    with queue_lock:
        keep_items = []
        for item in search_queue:
            if item.get("status") in ("completed", "error"):
                removed_items.append(item)
            else:
                keep_items.append(item)
        search_queue[:] = keep_items

    for item in removed_items:
        task_id = item.get("task_id")
        if task_id:
            tasks.pop(task_id, None)

    return jsonify({"ok": True, "removed": len(removed_items)})


# ── Helpers internos ─────────────────────────────────────────────
def _run_search(
    task_id: str,
    keyword: str,
    category: str,
    max_pages: int,
    start_page: int,
    social_media: list[str],
    directory_sites: list[str],
    link_types: list[str],
    execution_mode: str,
):
    """Executa a busca em background."""
    task = tasks[task_id]

    def progress_callback(event_or_message):
        if isinstance(event_or_message, dict):
            event = dict(event_or_message)
            event.setdefault("type", "progress")
            if event.get("type") == "progress" and "message" not in event:
                event["message"] = ""
        else:
            event = {"type": "progress", "message": str(event_or_message)}
        task["events"].append(event)

    try:
        service = SearchService()
        results = service.search(
            keyword=keyword,
            category=category,
            max_pages=max_pages,
            start_page=start_page,
            social_media=social_media if social_media else None,
            directory_sites=directory_sites if directory_sites else None,
            link_types=link_types,
            execution_mode=execution_mode,
            progress_callback=progress_callback,
        )
        task["results"] = results
        task["status"] = "completed"

        progress_callback(
            f"Lote finalizado: {results['total_found']} links, "
            f"{results['total_valid']} válidos."
        )

        with stats_lock:
            session_stats["searches"] += 1
            session_stats["links_found"] += results["total_found"]
            session_stats["valid"] += results["total_valid"]
            session_stats["invalid"] += results["total_invalid"]
    except Exception as exc:
        logger.error("Erro na busca %s: %s", task_id, exc, exc_info=True)
        task["status"] = "error"
        task["error"] = str(exc)


def _ensure_queue_processor():
    """Garante que a thread de processamento da fila está rodando."""
    global queue_processor_running
    if not queue_processor_running:
        thread = Thread(target=_process_queue, daemon=True)
        thread.start()


def _process_queue():
    """Thread que processa itens da fila sequencialmente."""
    global queue_processor_running
    queue_processor_running = True

    try:
        while True:
            next_item = None
            with queue_lock:
                for item in search_queue:
                    if item["status"] == "pending":
                        next_item = item
                        break

            if not next_item:
                break

            task_id = str(uuid4())
            tasks[task_id] = {
                "status": "running",
                "events": [],
                "results": None,
                "params": next_item["params"],
            }

            with queue_lock:
                next_item["status"] = "running"
                next_item["task_id"] = task_id

            params = next_item["params"]
            _run_search(
                task_id=task_id,
                keyword=params["keyword"],
                category=params["category"],
                max_pages=params["max_pages"],
                start_page=params["start_page"],
                social_media=params["social_media"],
                directory_sites=params["directory_sites"],
                link_types=params["link_types"],
                execution_mode=params.get("execution_mode", DEFAULT_EXECUTION_MODE),
            )

            task = tasks[task_id]
            with queue_lock:
                if task["status"] == "completed" and task["results"]:
                    result = task["results"]
                    next_item["result_summary"] = {
                        "total_found": result["total_found"],
                        "total_valid": result["total_valid"],
                        "total_invalid": result["total_invalid"],
                        "total_unknown": result["total_unknown"],
                    }
                    next_item["status"] = "completed"
                else:
                    next_item["status"] = "error"
                    next_item["error"] = task.get("error", "Erro desconhecido")
    finally:
        queue_processor_running = False


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5050))
    debug = os.environ.get("FLASK_DEBUG", "true").lower() == "true"
    app.run(debug=debug, host="0.0.0.0", port=port, threaded=True)
