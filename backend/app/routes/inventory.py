# FastAPI tools for routes and database dependencies
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

# Datetime tools used to calculate expired and expiring-soon inventory
from datetime import datetime, timedelta

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
    # Check whether another inventory item already uses the same SKU.
    # SKU values must remain unique because they identify products operationally.
    existing_item = db.query(models.InventoryItem).filter(
        models.InventoryItem.sku == item.sku
    ).first()

    if existing_item:
        raise HTTPException(
            status_code=400,
            detail="SKU already exists"
        )

    # Create the inventory item using the validated request data.
    new_item = models.InventoryItem(**item.model_dump())

    db.add(new_item)
    db.commit()
    db.refresh(new_item)

    return new_item


# Get all inventory items
@router.get("/", response_model=list[schemas.InventoryResponse])
def get_inventory_items(db: Session = Depends(get_db)):
    # Return all inventory items so the frontend dashboard can display them.
    return db.query(models.InventoryItem).all()


# Search inventory items by SKU, name, or category
@router.get("/search/", response_model=list[schemas.InventoryResponse])
def search_inventory_items(
    query: str,
    db: Session = Depends(get_db)
):
    # Search across the most important operational product fields.
    results = db.query(models.InventoryItem).filter(
        (models.InventoryItem.sku.ilike(f"%{query}%")) |
        (models.InventoryItem.item_name.ilike(f"%{query}%")) |
        (models.InventoryItem.category.ilike(f"%{query}%"))
    ).all()

    return results


# Get inventory dashboard summary data
@router.get("/dashboard/summary")
def get_inventory_dashboard_summary(db: Session = Depends(get_db)):
    # Load all inventory records so dashboard totals can be calculated.
    inventory_items = db.query(models.InventoryItem).all()

    # Current date used for product lifecycle calculations.
    today = datetime.utcnow()

    # Date used to identify products that will expire soon.
    # A 30-day window is useful for warehouse planning and stock rotation.
    expiring_soon_limit = today + timedelta(days=30)

    # Basic inventory summary values.
    total_products = len(inventory_items)
    total_stock = sum(item.quantity for item in inventory_items)
    low_stock_count = sum(1 for item in inventory_items if item.quantity <= 10)

    # Count products where the expiry date has already passed.
    expired_product_count = sum(
        1
        for item in inventory_items
        if item.expiry_date is not None and item.expiry_date < today
    )

    # Count products that are not expired yet but will expire within 30 days.
    expiring_soon_count = sum(
        1
        for item in inventory_items
        if item.expiry_date is not None
        and today <= item.expiry_date <= expiring_soon_limit
    )

    return {
        "total_products": total_products,
        "total_stock": total_stock,
        "low_stock_count": low_stock_count,
        "expired_product_count": expired_product_count,
        "expiring_soon_count": expiring_soon_count
    }


# Get one inventory item by ID
@router.get("/{item_id}", response_model=schemas.InventoryResponse)
def get_inventory_item(item_id: int, db: Session = Depends(get_db)):
    # Find the selected inventory item using its database ID.
    item = db.query(models.InventoryItem).filter(
        models.InventoryItem.id == item_id
    ).first()

    if item is None:
        raise HTTPException(status_code=404, detail="Inventory item not found")

    return item


# Update an inventory item by ID
@router.put("/{item_id}", response_model=schemas.InventoryResponse)
def update_inventory_item(
    item_id: int,
    updated_item: schemas.InventoryCreate,
    db: Session = Depends(get_db)
):
    # Find the inventory item that needs to be updated.
    item = db.query(models.InventoryItem).filter(
        models.InventoryItem.id == item_id
    ).first()

    if item is None:
        raise HTTPException(status_code=404, detail="Inventory item not found")

    # Prevent duplicate SKUs when updating an item.
    existing_sku = db.query(models.InventoryItem).filter(
        models.InventoryItem.sku == updated_item.sku,
        models.InventoryItem.id != item_id
    ).first()

    if existing_sku:
        raise HTTPException(status_code=400, detail="SKU already exists")

    # Update every field from the validated request model.
    for key, value in updated_item.model_dump().items():
        setattr(item, key, value)

    db.commit()
    db.refresh(item)

    return item


# Delete an inventory item by ID
@router.delete("/{item_id}")
def delete_inventory_item(
    item_id: int,
    db: Session = Depends(get_db)
):
    # Find the item before attempting deletion.
    item = db.query(models.InventoryItem).filter(
        models.InventoryItem.id == item_id
    ).first()

    if item is None:
        raise HTTPException(status_code=404, detail="Inventory item not found")

    db.delete(item)
    db.commit()

    return {"message": "Inventory item deleted successfully"}


# Increase stock quantity for an inventory item
@router.post("/{item_id}/increase-stock", response_model=schemas.InventoryResponse)
def increase_stock(
    item_id: int,
    stock: schemas.StockAdjustment,
    db: Session = Depends(get_db)
):
    # Find the inventory item that will receive additional stock.
    item = db.query(models.InventoryItem).filter(
        models.InventoryItem.id == item_id
    ).first()

    if item is None:
        raise HTTPException(status_code=404, detail="Inventory item not found")

    if stock.quantity <= 0:
        raise HTTPException(status_code=400, detail="Quantity must be greater than zero")

    item.quantity += stock.quantity

    # Record the stock increase in the inventory movement audit trail.
    movement = models.InventoryMovement(
        inventory_item_id=item.id,
        movement_type="STOCK_IN",
        quantity=stock.quantity,
        reference="Inventory Dashboard - Stock Increase"
    )

    db.add(movement)
    db.commit()
    db.refresh(item)

    return item


# Decrease stock quantity for an inventory item
@router.post("/{item_id}/decrease-stock", response_model=schemas.InventoryResponse)
def decrease_stock(
    item_id: int,
    stock: schemas.StockAdjustment,
    db: Session = Depends(get_db)
):
    # Find the inventory item that will have stock removed.
    item = db.query(models.InventoryItem).filter(
        models.InventoryItem.id == item_id
    ).first()

    if item is None:
        raise HTTPException(status_code=404, detail="Inventory item not found")

    if stock.quantity <= 0:
        raise HTTPException(status_code=400, detail="Quantity must be greater than zero")

    if item.quantity - stock.quantity < 0:
        raise HTTPException(status_code=400, detail="Insufficient stock available")

    item.quantity -= stock.quantity

        # Record the stock decrease in the inventory movement audit trail.
    movement = models.InventoryMovement(
        inventory_item_id=item.id,
        movement_type="STOCK_OUT",
        quantity=stock.quantity,
        reference="Inventory Dashboard - Stock Decrease"
    )

    db.add(movement)
    db.commit()
    db.refresh(item)

    return item