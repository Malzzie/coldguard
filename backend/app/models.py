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

    # Product information
    item_name = Column(String, nullable=False)
    sku = Column(String, unique=True, nullable=False)
    category = Column(String, nullable=False)
    description = Column(String, nullable=True)

    # Inventory information
    quantity = Column(Integer, nullable=False)

    # Storage information
    storage_zone = Column(String, nullable=False)

    # Temperature requirements
    minimum_temperature = Column(Float, nullable=False)
    maximum_temperature = Column(Float, nullable=False)

    # Product lifecycle
    expiry_date = Column(DateTime, nullable=True)

    # Audit information
    created_at = Column(DateTime, default=datetime.utcnow)

# Storage location table for warehouse/cold room locations
class StorageLocation(Base):
    __tablename__ = "storage_locations"

    id = Column(Integer, primary_key=True, index=True)
    location_code = Column(String, unique=True, nullable=False)
    cold_room = Column(String, nullable=False)
    zone = Column(String, nullable=False)
    shelf = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

# Inventory movement history table
class InventoryMovement(Base):
    __tablename__ = "inventory_movements"

    id = Column(Integer, primary_key=True, index=True)

    inventory_item_id = Column(Integer, nullable=False)

    movement_type = Column(String, nullable=False)
    quantity = Column(Integer, nullable=False)

    reference = Column(String, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)

# Temperature log table for cold room readings
class TemperatureLog(Base):
    __tablename__ = "temperature_logs"

    id = Column(Integer, primary_key=True, index=True)
    storage_zone = Column(String, nullable=False)
    temperature = Column(Float, nullable=False)
    status = Column(String, default="normal")
    recorded_at = Column(DateTime, default=datetime.utcnow)

# Temperature threshold table for configurable zone limits
class TemperatureThreshold(Base):
    __tablename__ = "temperature_thresholds"

    id = Column(Integer, primary_key=True, index=True)
    storage_zone = Column(String, unique=True, nullable=False)
    minimum_temperature = Column(Float, nullable=False)
    maximum_temperature = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

# Alert table for temperature violations
class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)

    storage_zone = Column(String, nullable=False)

    temperature = Column(Float, nullable=False)

    severity = Column(String, nullable=False)

    status = Column(String, default="OPEN")

    acknowledged_at = Column(DateTime, nullable=True)
    acknowledged_by = Column(String, nullable=True)

    resolved_at = Column(DateTime, nullable=True)
    resolution_notes = Column(String, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)

# Alert audit table for tracking alert lifecycle events
class AlertAudit(Base):
    __tablename__ = "alert_audits"

    id = Column(Integer, primary_key=True, index=True)

    alert_id = Column(Integer, nullable=False)

    action = Column(String, nullable=False)

    performed_by = Column(String, nullable=True)

    notes = Column(String, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)