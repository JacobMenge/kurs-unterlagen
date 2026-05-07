"""Tests für app.py – werden im CI-Job automatisch ausgeführt."""

import pytest

from app import app


@pytest.fixture
def client():
    app.config["TESTING"] = True
    with app.test_client() as c:
        yield c


def test_index_status(client):
    res = client.get("/")
    assert res.status_code == 200
    assert b"CI/CD-Demo" in res.data


def test_sum_basic(client):
    res = client.get("/api/sum?a=2&b=3")
    assert res.status_code == 200
    assert res.get_json() == {"a": 2, "b": 3, "sum": 5}


def test_sum_default_zero(client):
    res = client.get("/api/sum")
    assert res.status_code == 200
    assert res.get_json()["sum"] == 0


def test_sum_invalid_input(client):
    res = client.get("/api/sum?a=foo&b=3")
    assert res.status_code == 400
    assert "error" in res.get_json()
