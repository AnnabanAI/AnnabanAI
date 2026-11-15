from fastapi.testclient import TestClient

import annaban_startup_api


def test_health_is_process_health_only():
    response = TestClient(annaban_startup_api.app).get("/health")
    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "ok"
    assert body["external_dependencies_checked"] is False


def test_defaults_mark_nfl_as_simulated():
    response = TestClient(annaban_startup_api.app).get("/defaults")
    assert response.status_code == 200
    body = response.json()
    assert body["mode"] == "read_only"
    assert "nfl_broadcast_overlay" in body["simulated_streams"]


def test_protected_endpoint_rejects_missing_server_key(monkeypatch):
    monkeypatch.delenv("ANNABAN_API_KEY", raising=False)
    response = TestClient(annaban_startup_api.app).get("/v1/streams/status")
    assert response.status_code == 503
