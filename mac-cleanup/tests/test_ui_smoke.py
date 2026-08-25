from pathlib import Path


def test_ui_assets_exist():
    root = Path(__file__).resolve().parents[1]
    assert (root / "ui" / "panel.html").exists()
    assert (root / "ui" / "panel.css").exists()
    assert (root / "ui" / "panel.js").exists()
