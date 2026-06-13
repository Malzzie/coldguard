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
            "item_name": "Frozen Fish",
            "sku": "TEST-006",
            "category": "Frozen Seafood",
            "description": "Sprint 6 test product",
            "quantity": 100,
            "storage_zone": "Zone B",
            "minimum_temperature": -18,
            "maximum_temperature": -12,
            "expiry_date": "2026-12-31T00:00:00"
        }
    )

    assert response.status_code == 200
    assert response.json()["sku"] == "TEST-006"


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
            "location_code": "LOC-006",
            "cold_room": "Freezer B",
            "zone": "Zone B",
            "shelf": "Shelf 2"
        }
    )

    assert response.status_code == 200
    assert response.json()["location_code"] == "LOC-006"

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

# -----------------------------
# Sprint 5 - Temperature Thresholds
# -----------------------------

def test_create_temperature_threshold():
    response = client.post(
        "/thresholds/",
        json={
            "storage_zone": "Sprint 6 Frozen Zone",
            "minimum_temperature": -25,
            "maximum_temperature": -18
        }
    )

    assert response.status_code == 200
    assert response.json()["storage_zone"] == "Sprint 6 Frozen Zone"


# -----------------------------
# Sprint 5 - Temperature Monitoring
# -----------------------------

def test_create_temperature_log():
    response = client.post(
        "/temperature/",
        json={
            "storage_zone": "Test Frozen Zone",
            "temperature": -20
        }
    )

    assert response.status_code == 200
    assert response.json()["status"] == "normal"


def test_temperature_violation_detected():
    response = client.post(
        "/temperature/",
        json={
            "storage_zone": "Test Frozen Zone",
            "temperature": -10
        }
    )

    assert response.status_code == 200
    assert response.json()["status"] == "high"


# -----------------------------
# Sprint 5 - Alert Management
# -----------------------------

def test_alert_generation():
    response = client.get("/alerts/")

    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_alert_acknowledgement():
    response = client.put(
        "/alerts/1/acknowledge",
        json={
            "acknowledged_by": "Pytest User"
        }
    )

    assert response.status_code == 200
    assert response.json()["status"] == "ACKNOWLEDGED"


def test_alert_resolution():
    response = client.put(
        "/alerts/1/resolve",
        json={
            "resolution_notes": "Resolved by automated test"
        }
    )

    assert response.status_code == 200
    assert response.json()["status"] == "RESOLVED"


# -----------------------------
# Sprint 5 - Audit Trail
# -----------------------------

def test_alert_audit_trail():
    response = client.get("/alerts/1/audit")

    assert response.status_code == 200
    assert isinstance(response.json(), list)

