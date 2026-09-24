from pathlib import Path


def test_project_core_files_exist():
    root = Path(__file__).resolve().parents[1]
    assert (root / "scripts" / "cli.py").exists()
    assert (root / "scripts" / "run_pipeline.py").exists()
    assert (root / "README.md").exists()
