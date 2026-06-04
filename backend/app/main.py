# Import FastAPI so we can create our backend API application
from fastapi import FastAPI

# Import database engine and Base model class
from app.database import engine, Base

# Import models so SQLAlchemy knows which tables to create
from app import models

# Import route files
from app.routes import inventory
from app.routes import temperature
from app.routes import auth
from app.routes import locations
from app.routes import movements
from app.routes import thresholds
from app.routes import alerts

# Create database tables automatically
Base.metadata.create_all(bind=engine)

# Create the FastAPI app
app = FastAPI(
    title="ColdGuard Backend API",
    description="Backend infrastructure for the ColdGuard smart cold store warehouse system",
    version="1.0.0"
)

# Register API routes
app.include_router(inventory.router)
app.include_router(temperature.router)
app.include_router(auth.router)
app.include_router(locations.router)
app.include_router(movements.router)
app.include_router(thresholds.router)
app.include_router(alerts.router)

# Basic home route to confirm the API is running
@app.get("/")
def home():
    return {"message": "ColdGuard Backend API is running"}


# Health check route for testing and deployment proof
@app.get("/health")
def health_check():
    return {"status": "healthy"}