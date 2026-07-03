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
        # Only seed data if no temperature logs exist
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

        # Demo inventory items
        inventory_items = [
            models.InventoryItem(
                item_name="Frozen Chicken",
                sku="FRZ-001",
                category="Frozen Goods",
                description="Frozen poultry stock",
                quantity=120,
                storage_zone="Frozen Storage",
                minimum_temperature=-25,
                maximum_temperature=-18
            ),
            models.InventoryItem(
                item_name="Fresh Lettuce",
                sku="FRS-001",
                category="Fresh Produce",
                description="Fresh produce stock",
                quantity=80,
                storage_zone="Fresh Produce",
                minimum_temperature=4,
                maximum_temperature=10
            ),
            models.InventoryItem(
                item_name="Insulin Packs",
                sku="MED-001",
                category="Pharmaceuticals",
                description="Temperature-sensitive medicine",
                quantity=40,
                storage_zone="Pharmaceutical Storage",
                minimum_temperature=2,
                maximum_temperature=8
            ),
        ]

        db.add_all(inventory_items)
        db.commit()

        # Demo temperature readings
        temperature_logs = [
            models.TemperatureLog(
                storage_zone="Frozen Storage",
                temperature=-20,
                status="normal"
            ),
            models.TemperatureLog(
                storage_zone="Frozen Storage",
                temperature=-15,
                status="high"
            ),
            models.TemperatureLog(
                storage_zone="Chilled Storage",
                temperature=5,
                status="normal"
            ),
            models.TemperatureLog(
                storage_zone="Chilled Storage",
                temperature=10,
                status="high"
            ),
            models.TemperatureLog(
                storage_zone="Fresh Produce",
                temperature=6,
                status="normal"
            ),
            models.TemperatureLog(
                storage_zone="Pharmaceutical Storage",
                temperature=0,
                status="low"
            ),
        ]

        db.add_all(temperature_logs)
        db.commit()

        # Demo alerts linked to abnormal readings
        alerts = [
            models.Alert(
                storage_zone="Frozen Storage",
                temperature=-15,
                severity="HIGH",
                status="OPEN"
            ),
            models.Alert(
                storage_zone="Chilled Storage",
                temperature=10,
                severity="HIGH",
                status="OPEN"
            ),
            models.Alert(
                storage_zone="Pharmaceutical Storage",
                temperature=0,
                severity="LOW",
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