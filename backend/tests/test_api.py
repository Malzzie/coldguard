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

# -----------------------------
# Sprint 4 - Product Management
# -----------------------------

def test_create_inventory_item():
    response = client.post(
        "/inventory/",
        json={
            "item_name": "Frozen Chicken",
            "sku": "TEST-001",
            "category": "Frozen Meat",
            "description": "Test product",
            "quantity": 100,
            "storage_zone": "Zone A",
            "minimum_temperature": -18,
            "maximum_temperature": -12,
            "expiry_date": "2026-12-31T00:00:00"
        }
    )

    assert response.status_code == 200
    assert response.json()["sku"] == "TEST-001"


def test_duplicate_sku_rejected():
    response = client.post(
        "/inventory/",
        json={
            "item_name": "Duplicate Product",
            "sku": "TEST-001",
            "category": "Frozen Meat",
            "description": "Duplicate SKU",
            "quantity": 50,
            "storage_zone": "Zone A",
            "minimum_temperature": -18,
            "maximum_temperature": -12,
            "expiry_date": "2026-12-31T00:00:00"
        }
    )

    assert response.status_code == 400


# -----------------------------
# Sprint 4 - Storage Locations
# -----------------------------

def test_create_storage_location():
    response = client.post(
        "/locations/",
        json={
            "location_code": "LOC-001",
            "cold_room": "Freezer A",
            "zone": "Zone A",
            "shelf": "Shelf 1"
        }
    )

    assert response.status_code == 200
    assert response.json()["location_code"] == "LOC-001"


# -----------------------------
# Sprint 4 - Stock Tracking
# -----------------------------

def test_increase_stock():
    response = client.post(
        "/inventory/1/increase-stock",
        json={"quantity": 10}
    )

    assert response.status_code == 200


def test_decrease_stock():
    response = client.post(
        "/inventory/1/decrease-stock",
        json={"quantity": 5}
    )

    assert response.status_code == 200


# -----------------------------
# Sprint 4 - Inventory Movement
# -----------------------------

def test_create_inventory_movement():
    response = client.post(
        "/movements/",
        json={
            "inventory_item_id": 1,
            "movement_type": "STOCK_IN",
            "quantity": 20,
            "reference": "Automated Test"
        }
    )

    assert response.status_code == 200


# -----------------------------
# Sprint 4 - Search
# -----------------------------

def test_inventory_search():
    response = client.get(
        "/inventory/search/?query=TEST"
    )

    assert response.status_code == 200
    assert isinstance(response.json(), list)


# -----------------------------
# Sprint 4 - Dashboard
# -----------------------------

def test_dashboard_summary():
    response = client.get(
        "/inventory/dashboard/summary"
    )

    assert response.status_code == 200