from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
import app.models as models
import app.schemas as schemas

router = APIRouter(
    prefix="/movements",
    tags=["Inventory Movements"]
)


@router.post("/", response_model=schemas.InventoryMovementResponse)
def create_inventory_movement(
    movement: schemas.InventoryMovementCreate,
    db: Session = Depends(get_db)
):
    item = db.query(models.InventoryItem).filter(
        models.InventoryItem.id == movement.inventory_item_id
    ).first()

    if item is None:
        raise HTTPException(status_code=404, detail="Inventory item not found")

    if movement.quantity <= 0:
        raise HTTPException(status_code=400, detail="Quantity must be greater than zero")

    if movement.movement_type not in ["STOCK_IN", "STOCK_OUT"]:
        raise HTTPException(status_code=400, detail="Movement type must be STOCK_IN or STOCK_OUT")

    if movement.movement_type == "STOCK_OUT" and item.quantity - movement.quantity < 0:
        raise HTTPException(status_code=400, detail="Insufficient stock available")

    if movement.movement_type == "STOCK_IN":
        item.quantity += movement.quantity

    if movement.movement_type == "STOCK_OUT":
        item.quantity -= movement.quantity

    new_movement = models.InventoryMovement(**movement.model_dump())

    db.add(new_movement)
    db.commit()
    db.refresh(new_movement)

    return new_movement


@router.get("/", response_model=list[schemas.InventoryMovementResponse])
def get_inventory_movements(db: Session = Depends(get_db)):
    return db.query(models.InventoryMovement).all()


@router.get("/{movement_id}", response_model=schemas.InventoryMovementResponse)
def get_inventory_movement(movement_id: int, db: Session = Depends(get_db)):
    movement = db.query(models.InventoryMovement).filter(
        models.InventoryMovement.id == movement_id
    ).first()

    if movement is None:
        raise HTTPException(status_code=404, detail="Inventory movement not found")

    return movement