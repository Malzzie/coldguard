# FastAPI TestClient lets us test API endpoints without opening the browser
from fastapi.testclient import TestClient

# Import the ColdGuard FastAPI application
from app.main import app

# Create a test client for the API
client = TestClient(app)


def test_health_endpoint():
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}


def test_auth_health_endpoint():
    response = client.get("/auth/health")

    assert response.status_code == 200
    assert response.json() == {"message": "Authentication service running"}


def test_get_inventory_items():
    response = client.get("/inventory/")

    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_get_temperature_logs():
    response = client.get("/temperature/")

    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_protected_route_blocks_unauthorized_access():
    response = client.get("/auth/protected")

    assert response.status_code == 401