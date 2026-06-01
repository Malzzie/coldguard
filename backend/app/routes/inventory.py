# FastAPI tools for routes and database dependencies
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

# Import database, models, and schemas
from app.database import get_db
import app.models as models
import app.schemas as schemas

# Create a router for inventory-related endpoints
router = APIRouter(
    prefix="/inventory",
    tags=["Inventory"]
)


# Create a new inventory item
@router.post("/", response_model=schemas.InventoryResponse)
def create_inventory_item(
    item: schemas.InventoryCreate,
    db: Session = Depends(get_db)
):
    # Convert incoming Pydantic data into a SQLAlchemy database object
    new_item = models.InventoryItem(**item.model_dump())

    # Save the item to the database
    db.add(new_item)
    db.commit()
    db.refresh(new_item)

    return new_item


# Get all inventory items
@router.get("/", response_model=list[schemas.InventoryResponse])
def get_inventory_items(db: Session = Depends(get_db)):
    return db.query(models.InventoryItem).all()


# Get one inventory item by ID
@router.get("/{item_id}", response_model=schemas.InventoryResponse)
def get_inventory_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(models.InventoryItem).filter(
        models.InventoryItem.id == item_id
    ).first()

    if item is None:
        raise HTTPException(status_code=404, detail="Inventory item not found")

    return item