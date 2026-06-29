# Pydantic models validate data sent into and returned from the API
from pydantic import BaseModel, field_validator
from datetime import datetime


# Shared inventory fields
class InventoryBase(BaseModel):
    item_name: str
    sku: str
    category: str
    description: str | None = None
    quantity: int
    storage_zone: str
    minimum_temperature: float
    maximum_temperature: float
    expiry_date: datetime | None = None

    @field_validator("item_name", "sku", "category", "storage_zone")
    @classmethod
    def required_text_fields_must_not_be_empty(cls, value):
        if not value or not value.strip():
            raise ValueError("Required text fields cannot be empty")
        return value

    @field_validator("quantity")
    @classmethod
    def quantity_must_not_be_negative(cls, value):
        if value < 0:
            raise ValueError("Quantity cannot be negative")
        return value

    @field_validator("maximum_temperature")
    @classmethod
    def maximum_temperature_must_be_greater_than_minimum(cls, value, info):
        minimum_temperature = info.data.get("minimum_temperature")
        if minimum_temperature is not None and value <= minimum_temperature:
            raise ValueError("Maximum temperature must be greater than minimum temperature")
        return value


# Used when creating a new inventory item
class InventoryCreate(InventoryBase):
    pass


# Used when returning inventory data from the database
class InventoryResponse(InventoryBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Used when increasing or decreasing stock quantity
class StockAdjustment(BaseModel):
    quantity: int

# Shared inventory movement fields
class InventoryMovementBase(BaseModel):
    inventory_item_id: int
    movement_type: str
    quantity: int
    reference: str | None = None


# Used when creating a movement record
class InventoryMovementCreate(InventoryMovementBase):
    pass


# Used when returning movement records
class InventoryMovementResponse(InventoryMovementBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Shared storage location fields
class StorageLocationBase(BaseModel):
    location_code: str
    cold_room: str
    zone: str
    shelf: str


# Used when creating a new storage location
class StorageLocationCreate(StorageLocationBase):
    pass


# Used when returning storage location data from the database
class StorageLocationResponse(StorageLocationBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# Shared temperature fields
class TemperatureBase(BaseModel):
    storage_zone: str
    temperature: float


# Used when creating a new temperature log
class TemperatureCreate(TemperatureBase):
    pass


# Used when returning temperature data from the database
class TemperatureResponse(TemperatureBase):
    id: int
    status: str
    recorded_at: datetime

    class Config:
        from_attributes = True

# Shared temperature threshold fields
class TemperatureThresholdBase(BaseModel):
    storage_zone: str
    minimum_temperature: float
    maximum_temperature: float


# Used when creating a new temperature threshold
class TemperatureThresholdCreate(TemperatureThresholdBase):
    pass


# Used when returning temperature threshold data from the database
class TemperatureThresholdResponse(TemperatureThresholdBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Used when registering a new user
class UserCreate(BaseModel):
    full_name: str
    email: str
    password: str
    role: str = "staff"


# Used when returning user details from the database
class UserResponse(BaseModel):
    id: int
    full_name: str
    email: str
    role: str
    is_active: bool

    class Config:
        from_attributes = True

# Used when a user logs in
class UserLogin(BaseModel):
    email: str
    password: str


# Returned after successful login
class LoginResponse(BaseModel):
    message: str
    access_token: str
    token_type: str
    user_id: int
    email: str
    role: str

# Shared alert fields
class AlertBase(BaseModel):
    storage_zone: str
    temperature: float
    severity: str


# Returned alert data
class AlertResponse(AlertBase):
    id: int
    status: str

    acknowledged_at: datetime | None
    acknowledged_by: str | None

    resolved_at: datetime | None = None
    resolution_notes: str | None = None

    created_at: datetime

    class Config:
        from_attributes = True

class AlertAcknowledge(BaseModel):
    acknowledged_by: str

class AlertResolve(BaseModel):
    resolution_notes: str

# Returned alert audit data
class AlertAuditResponse(BaseModel):
    id: int
    alert_id: int
    action: str
    performed_by: str | None = None
    notes: str | None = None
    created_at: datetime

    class Config:
        from_attributes = True

#---------------------------------------
# AI Risk Advisor Schemas
#---------------------------------------

from pydantic import BaseModel


class AIRiskResponse(BaseModel):
    """
    Response model returned by the AI Risk Advisor.
    """

    risk_level: str
    summary: str
    recommendation: str
    average_temperature: float
    highest_temperature: float
    alert_count: int

# --------------------------------------------------
# Temperature Trend Insight Schemas
# --------------------------------------------------

class TemperatureTrendResponse(BaseModel):
    """
    Response model for temperature trend insights.
    """

    average_temperature: float
    lowest_temperature: float
    highest_temperature: float
    total_readings: int
    alert_count: int
    trend_status: str
    insight: str