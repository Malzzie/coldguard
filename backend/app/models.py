# Import SQLAlchemy column types
from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean
from datetime import datetime

# Import Base from our database connection file
from app.database import Base


# User table for staff/admin login proof
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    role = Column(String, default="staff")
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)


# Inventory table for cold store stock items
class InventoryItem(Base):
    __tablename__ = "inventory_items"

    id = Column(Integer, primary_key=True, index=True)
    item_name = Column(String, nullable=False)
    category = Column(String, nullable=False)
    quantity = Column(Integer, nullable=False)
    storage_zone = Column(String, nullable=False)
    minimum_temperature = Column(Float, nullable=False)
    maximum_temperature = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


# Temperature log table for cold room readings
class TemperatureLog(Base):
    __tablename__ = "temperature_logs"

    id = Column(Integer, primary_key=True, index=True)
    storage_zone = Column(String, nullable=False)
    temperature = Column(Float, nullable=False)
    status = Column(String, default="normal")
    recorded_at = Column(DateTime, default=datetime.utcnow)