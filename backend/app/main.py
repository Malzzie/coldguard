# Import FastAPI so we can create our backend API application
from fastapi import FastAPI

# Import database engine and Base model class
from app.database import engine, Base

# Import models so SQLAlchemy knows which tables to create
from app import models

# Import CORS middleware to allow cross-origin requests from the frontend
from fastapi.middleware.cors import CORSMiddleware

# Import password hashing utility
from app.security import hash_password

# Import datetime tools for realistic seeded expiry dates
from datetime import datetime, timedelta

# Import route files
from app.routes import inventory
from app.routes import temperature
from app.routes import auth
from app.routes import locations
from app.routes import movements
from app.routes import thresholds
from app.routes import alerts
from app.routes import reports
from app.routes import ai

# Create database tables automatically
Base.metadata.create_all(bind=engine)


# Create demo admin user for deployed capstone demonstration
def create_demo_admin_user():
    """
    Creates or updates the default demo admin user.

    This ensures the deployed application always has a reliable
    login account for the capstone demonstration.
    """

    from app.database import SessionLocal

    db = SessionLocal()

    try:
        existing_user = db.query(models.User).filter(
            models.User.email == "admin@coldguard.com"
        ).first()

        if existing_user:
            # Reset demo admin details in case the password was changed
            existing_user.full_name = "ColdGuard Admin"
            existing_user.role = "admin"
            existing_user.hashed_password = hash_password("Password123")
            existing_user.is_active = True

        else:
            # Create demo admin if it does not exist
            demo_admin = models.User(
                full_name="ColdGuard Admin",
                email="admin@coldguard.com",
                role="admin",
                hashed_password=hash_password("Password123"),
                is_active=True
            )

            db.add(demo_admin)

        db.commit()

        print("Demo admin user is ready.")

    finally:
        db.close()


# Create demo operational data for deployed capstone demonstration
def seed_demo_data():
    """
    Creates demo warehouse data if the deployed database is empty.

    This ensures the live application always has meaningful data
    after Render restarts or recreates the SQLite database.
    """

    from app.database import SessionLocal

    db = SessionLocal()

    try:
        # Only seed data if no temperature logs exist.
        # This prevents duplicate demo records from being created on every restart.
        existing_logs = db.query(models.TemperatureLog).first()

        if existing_logs:
            return

        # Demo temperature thresholds
        thresholds = [
            models.TemperatureThreshold(
                storage_zone="Frozen Storage",
                minimum_temperature=-25,
                maximum_temperature=-18
            ),
            models.TemperatureThreshold(
                storage_zone="Chilled Storage",
                minimum_temperature=2,
                maximum_temperature=8
            ),
            models.TemperatureThreshold(
                storage_zone="Fresh Produce",
                minimum_temperature=4,
                maximum_temperature=10
            ),
            models.TemperatureThreshold(
                storage_zone="Pharmaceutical Storage",
                minimum_temperature=2,
                maximum_temperature=8
            ),
        ]

        db.add_all(thresholds)
        db.commit()

        # Current datetime used to create realistic expiry scenarios.
        today = datetime.utcnow()

        # Demo inventory items.
        # This dataset is intentionally designed for the capstone demonstration.
        # It provides a balanced warehouse with a few manageable operational
        # risks so that all ColdGuard features can be demonstrated live.
        inventory_items = [
            models.InventoryItem(
                item_name="Frozen Chicken",
                sku="FRZ-001",
                category="Frozen Goods",
                description="Healthy frozen poultry stock",
                quantity=120,
                storage_zone="Frozen Storage",
                minimum_temperature=-25,
                maximum_temperature=-18,
                expiry_date=today + timedelta(days=90)
            ),
            models.InventoryItem(
                item_name="Frozen Beef",
                sku="FRZ-002",
                category="Frozen Goods",
                description="Healthy frozen beef stock",
                quantity=85,
                storage_zone="Frozen Storage",
                minimum_temperature=-25,
                maximum_temperature=-18,
                expiry_date=today + timedelta(days=120)
            ),
            models.InventoryItem(
                item_name="Frozen Fish",
                sku="FRZ-003",
                category="Frozen Goods",
                description="Product approaching expiry",
                quantity=18,
                storage_zone="Frozen Storage",
                minimum_temperature=-25,
                maximum_temperature=-18,
                expiry_date=today + timedelta(days=25)
            ),
            models.InventoryItem(
                item_name="Ice Cream",
                sku="FRZ-004",
                category="Frozen Goods",
                description="Low stock frozen dessert",
                quantity=9,
                storage_zone="Frozen Storage",
                minimum_temperature=-25,
                maximum_temperature=-18,
                expiry_date=today + timedelta(days=75)
            ),
            models.InventoryItem(
                item_name="Frozen Chips",
                sku="FRZ-005",
                category="Frozen Goods",
                description="Healthy long-life frozen product",
                quantity=160,
                storage_zone="Frozen Storage",
                minimum_temperature=-25,
                maximum_temperature=-18,
                expiry_date=today + timedelta(days=180)
            ),

            models.InventoryItem(
                item_name="Milk",
                sku="CHL-001",
                category="Chilled Goods",
                description="Healthy chilled dairy stock",
                quantity=35,
                storage_zone="Chilled Storage",
                minimum_temperature=2,
                maximum_temperature=8,
                expiry_date=today + timedelta(days=45)
            ),
            models.InventoryItem(
                item_name="Cheese",
                sku="CHL-002",
                category="Chilled Goods",
                description="Healthy chilled cheese stock",
                quantity=60,
                storage_zone="Chilled Storage",
                minimum_temperature=2,
                maximum_temperature=8,
                expiry_date=today + timedelta(days=60)
            ),
            models.InventoryItem(
                item_name="Yoghurt",
                sku="CHL-003",
                category="Chilled Goods",
                description="Urgent chilled dairy item",
                quantity=15,
                storage_zone="Chilled Storage",
                minimum_temperature=2,
                maximum_temperature=8,
                expiry_date=today + timedelta(days=6)
            ),

            models.InventoryItem(
                item_name="Fresh Lettuce",
                sku="FRS-001",
                category="Fresh Produce",
                description="Healthy leafy vegetables",
                quantity=80,
                storage_zone="Fresh Produce",
                minimum_temperature=4,
                maximum_temperature=10,
                expiry_date=today + timedelta(days=45)
            ),
            models.InventoryItem(
                item_name="Tomatoes",
                sku="FRS-002",
                category="Fresh Produce",
                description="Healthy tomato stock",
                quantity=12,
                storage_zone="Fresh Produce",
                minimum_temperature=4,
                maximum_temperature=10,
                expiry_date=today + timedelta(days=45)
            ),
            models.InventoryItem(
                item_name="Spinach",
                sku="FRS-003",
                category="Fresh Produce",
                description="Low stock product nearing expiry",
                quantity=6,
                storage_zone="Fresh Produce",
                minimum_temperature=4,
                maximum_temperature=10,
                expiry_date=today + timedelta(days=2)
            ),
            models.InventoryItem(
                item_name="Apples",
                sku="FRS-004",
                category="Fresh Produce",
                description="Healthy fresh fruit stock",
                quantity=200,
                storage_zone="Fresh Produce",
                minimum_temperature=4,
                maximum_temperature=10,
                expiry_date=today + timedelta(days=90)
            ),

            models.InventoryItem(
                item_name="Insulin Packs",
                sku="MED-001",
                category="Pharmaceuticals",
                description="Expired temperature-sensitive medicine",
                quantity=40,
                storage_zone="Pharmaceutical Storage",
                minimum_temperature=2,
                maximum_temperature=8,
                expiry_date=today - timedelta(days=5)
            ),
            models.InventoryItem(
                item_name="Vaccines",
                sku="MED-002",
                category="Pharmaceuticals",
                description="Healthy vaccine stock",
                quantity=25,
                storage_zone="Pharmaceutical Storage",
                minimum_temperature=2,
                maximum_temperature=8,
                expiry_date=today + timedelta(days=90)
            ),
            models.InventoryItem(
                item_name="Blood Plasma",
                sku="MED-003",
                category="Pharmaceuticals",
                description="Low stock medical product approaching expiry",
                quantity=5,
                storage_zone="Pharmaceutical Storage",
                minimum_temperature=2,
                maximum_temperature=8,
                expiry_date=today + timedelta(days=28)
            ),
        ]

        db.add_all(inventory_items)
        db.commit()

        # Demo inventory movement history.
        # These records simulate normal warehouse operations and provide
        # realistic audit history for the Reports Dashboard demonstration.
        movements = [
            models.InventoryMovement(
                inventory_item_id=inventory_items[0].id,
                movement_type="Stock Added",
                quantity=50,
                reference="Supplier Delivery"
            ),
            models.InventoryMovement(
                inventory_item_id=inventory_items[2].id,
                movement_type="Stock Removed",
                quantity=12,
                reference="Customer Dispatch"
            ),
            models.InventoryMovement(
                inventory_item_id=inventory_items[5].id,
                movement_type="Stock Removed",
                quantity=15,
                reference="Retail Distribution"
            ),
            models.InventoryMovement(
                inventory_item_id=inventory_items[6].id,
                movement_type="Stock Added",
                quantity=25,
                reference="Weekly Restock"
            ),
            models.InventoryMovement(
                inventory_item_id=inventory_items[10].id,
                movement_type="Stock Removed",
                quantity=8,
                reference="Expired Product Disposal"
            ),
            models.InventoryMovement(
                inventory_item_id=inventory_items[14].id,
                movement_type="Stock Added",
                quantity=5,
                reference="Medical Shipment Received"
            ),
            models.InventoryMovement(
                inventory_item_id=inventory_items[13].id,
                movement_type="Stock Added",
                quantity=15,
                reference="Emergency Restock"
            ),
            models.InventoryMovement(
                inventory_item_id=inventory_items[3].id,
                movement_type="Stock Removed",
                quantity=10,
                reference="Customer Dispatch"
            ),
        ]

        db.add_all(movements)
        db.commit()

        # Demo temperature readings.
        # This dataset starts the system in a manageable-risk state.
        # It includes mostly normal readings with a few abnormal readings
        # so the Temperature, Reports, Insights, and Operational Advisor
        # pages demonstrate meaningful behaviour without starting in crisis mode.
        temperature_logs = [
            models.TemperatureLog(storage_zone="Frozen Storage", temperature=-22, status="normal"),
            models.TemperatureLog(storage_zone="Frozen Storage", temperature=-21, status="normal"),
            models.TemperatureLog(storage_zone="Frozen Storage", temperature=-20, status="normal"),
            models.TemperatureLog(storage_zone="Frozen Storage", temperature=-19, status="normal"),
            models.TemperatureLog(storage_zone="Frozen Storage", temperature=-18, status="normal"),
            models.TemperatureLog(storage_zone="Frozen Storage", temperature=-16, status="high"),

            models.TemperatureLog(storage_zone="Chilled Storage", temperature=4, status="normal"),
            models.TemperatureLog(storage_zone="Chilled Storage", temperature=5, status="normal"),
            models.TemperatureLog(storage_zone="Chilled Storage", temperature=6, status="normal"),
            models.TemperatureLog(storage_zone="Chilled Storage", temperature=7, status="normal"),
            models.TemperatureLog(storage_zone="Chilled Storage", temperature=8, status="normal"),
            models.TemperatureLog(storage_zone="Chilled Storage", temperature=9, status="high"),

            models.TemperatureLog(storage_zone="Fresh Produce", temperature=5, status="normal"),
            models.TemperatureLog(storage_zone="Fresh Produce", temperature=6, status="normal"),
            models.TemperatureLog(storage_zone="Fresh Produce", temperature=7, status="normal"),
            models.TemperatureLog(storage_zone="Fresh Produce", temperature=8, status="normal"),

            models.TemperatureLog(storage_zone="Pharmaceutical Storage", temperature=2, status="normal"),
            models.TemperatureLog(storage_zone="Pharmaceutical Storage", temperature=4, status="normal"),
            models.TemperatureLog(storage_zone="Pharmaceutical Storage", temperature=5, status="normal"),
            models.TemperatureLog(storage_zone="Pharmaceutical Storage", temperature=0, status="low"),
        ]

        db.add_all(temperature_logs)
        db.commit()

        # Demo alerts linked to abnormal readings.
        # These start as OPEN so the live demo can show the full lifecycle:
        # acknowledge, resolve, and remove/archive.
        alerts = [
            models.Alert(
                storage_zone="Frozen Storage",
                temperature=-16,
                severity="HIGH",
                status="OPEN"
            ),
            models.Alert(
                storage_zone="Chilled Storage",
                temperature=9,
                severity="HIGH",
                status="OPEN"
            ),
        ]

        db.add_all(alerts)
        db.commit()

        print("Demo warehouse data created successfully.")

    finally:
        db.close()


# Create the FastAPI app
app = FastAPI(
    title="ColdGuard Backend API",
    description="Backend infrastructure for the ColdGuard smart cold store warehouse system",
    version="1.0.0"
)


@app.on_event("startup")
def startup_event():
    """
    Runs automatically whenever the API starts.
    Ensures the deployed application always contains
    demo data for the capstone demonstration.
    """
    create_demo_admin_user()
    seed_demo_data()


# Allow the React frontend to communicate with the FastAPI backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routes
app.include_router(inventory.router)
app.include_router(temperature.router)
app.include_router(auth.router)
app.include_router(locations.router)
app.include_router(movements.router)
app.include_router(thresholds.router)
app.include_router(alerts.router)
app.include_router(reports.router)
app.include_router(ai.router)


# Basic home route to confirm the API is running
@app.get("/")
def home():
    return {"message": "ColdGuard Backend API is running"}


# Health check route for testing and deployment proof
@app.get("/health")
def health_check():
    return {"status": "healthy"}