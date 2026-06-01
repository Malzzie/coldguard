# Pydantic models validate data sent into and returned from the API
from pydantic import BaseModel
from datetime import datetime


# Shared inventory fields
class InventoryBase(BaseModel):
    item_name: str
    category: str
    quantity: int
    storage_zone: str
    minimum_temperature: float
    maximum_temperature: float


# Used when creating a new inventory item
class InventoryCreate(InventoryBase):
    pass


# Used when returning inventory data from the database
class InventoryResponse(InventoryBase):
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