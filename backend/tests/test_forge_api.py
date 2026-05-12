"""Backend API tests for The Author's Forge — leads, applications, PDFs."""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://elite-visual-refresh.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ─── Health ─────────────────────────────────────────────────────────────────
class TestHealth:
    def test_root(self, client):
        r = client.get(f"{API}/")
        assert r.status_code == 200
        assert "message" in r.json()


# ─── Leads ──────────────────────────────────────────────────────────────────
class TestLeads:
    def test_create_lead_curriculum(self, client):
        r = client.post(f"{API}/leads", json={"source": "curriculum-brief", "email": "TEST_curr@example.com"})
        assert r.status_code == 200
        d = r.json()
        assert d["source"] == "curriculum-brief"
        assert isinstance(d["id"], str) and len(d["id"]) > 0
        assert d["download_url"] == "/api/leads/curriculum-brief.pdf"
        assert "message" in d

    def test_create_lead_specimen(self, client):
        r = client.post(f"{API}/leads", json={"source": "specimen-page", "email": "TEST_spec@example.com"})
        assert r.status_code == 200
        d = r.json()
        assert d["source"] == "specimen-page"
        assert d["download_url"] == "/api/leads/specimen-page.pdf"

    def test_create_lead_quiet(self, client):
        r = client.post(f"{API}/leads", json={"source": "quiet-list", "email": "TEST_quiet@example.com"})
        assert r.status_code == 200
        d = r.json()
        assert d["source"] == "quiet-list"
        # quiet list should have null/None download_url
        assert d.get("download_url") in (None, "")

    def test_create_lead_invalid_email(self, client):
        r = client.post(f"{API}/leads", json={"source": "curriculum-brief", "email": "not-an-email"})
        assert r.status_code == 422

    def test_create_lead_invalid_source(self, client):
        r = client.post(f"{API}/leads", json={"source": "bogus-source", "email": "TEST_x@example.com"})
        assert r.status_code == 422

    def test_list_leads(self, client):
        r = client.get(f"{API}/leads")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        # ensure _id not exposed
        for item in data:
            assert "_id" not in item
        # at least our previously created leads should be there
        assert len(data) >= 1


# ─── Applications ───────────────────────────────────────────────────────────
class TestApplications:
    def test_create_application(self, client):
        payload = {
            "name": "TEST_Jane Smith",
            "email": "TEST_jane@example.com",
            "expertise": "Healthcare",
            "concept": "A book about systemic transformation in regional hospitals.",
            "stage": "outline",
        }
        r = client.post(f"{API}/applications", json=payload)
        assert r.status_code == 200
        d = r.json()
        assert isinstance(d["id"], str) and len(d["id"]) > 0
        assert "message" in d

    def test_create_application_missing_required(self, client):
        # missing concept
        r = client.post(f"{API}/applications", json={
            "name": "X", "email": "TEST_x2@example.com", "expertise": "y"
        })
        assert r.status_code == 422

    def test_create_application_invalid_email(self, client):
        r = client.post(f"{API}/applications", json={
            "name": "X", "email": "bad", "expertise": "y",
            "concept": "A solid book concept that is long enough."
        })
        assert r.status_code == 422

    def test_create_application_short_concept(self, client):
        r = client.post(f"{API}/applications", json={
            "name": "X", "email": "TEST_x3@example.com", "expertise": "y", "concept": "tiny"
        })
        assert r.status_code == 422

    def test_list_applications(self, client):
        r = client.get(f"{API}/applications")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        for item in data:
            assert "_id" not in item


# ─── PDFs ───────────────────────────────────────────────────────────────────
class TestPDFs:
    def test_curriculum_pdf(self, client):
        r = client.get(f"{API}/leads/curriculum-brief.pdf")
        assert r.status_code == 200
        assert r.headers["content-type"].startswith("application/pdf")
        assert "inline" in r.headers.get("content-disposition", "").lower()
        body = r.content
        assert body[:4] == b"%PDF"
        assert len(body) >= 30 * 1024, f"PDF too small: {len(body)} bytes"

    def test_specimen_pdf(self, client):
        r = client.get(f"{API}/leads/specimen-page.pdf")
        assert r.status_code == 200
        assert r.headers["content-type"].startswith("application/pdf")
        body = r.content
        assert body[:4] == b"%PDF"
        assert len(body) > 1000
