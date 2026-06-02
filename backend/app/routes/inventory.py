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
    existing_item = db.query(models.InventoryItem).filter(
        models.InventoryItem.sku == item.sku
    ).first()

    if existing_item:
        raise HTTPException(
            status_code=400,
            detail="SKU already exists"
        )

    new_item = models.InventoryItem(**item.model_dump())

    db.add(new_item)
    db.commit()
    db.refresh(new_item)

    return new_item


# Get all inventory items
@router.get("/", response_model=list[schemas.InventoryResponse])
def get_inventory_items(db: Session = Depends(get_db)):
    return db.query(models.InventoryItem).all()

# Search inventory items by SKU, name, or category
@router.get("/search/", response_model=list[schemas.InventoryResponse])
def search_inventory_items(
    query: str,
    db: Session = Depends(get_db)
):
    results = db.query(models.InventoryItem).filter(
        (models.InventoryItem.sku.ilike(f"%{query}%")) |
        (models.InventoryItem.item_name.ilike(f"%{query}%")) |
        (models.InventoryItem.category.ilike(f"%{query}%"))
    ).all()

    return results

# Get inventory dashboard summary data
@router.get("/dashboard/summary")
def get_inventory_dashboard_summary(db: Session = Depends(get_db)):
    inventory_items = db.query(models.InventoryItem).all()

    total_products = len(inventory_items)
    total_stock = sum(item.quantity for item in inventory_items)
    low_stock_count = sum(1 for item in inventory_items if item.quantity <= 10)
    expired_product_count = 0

    return {
        "total_products": total_products,
        "total_stock": total_stock,
        "low_stock_count": low_stock_count,
        "expired_product_count": expired_product_count
    }

# Get one inventory item by ID
@router.get("/{item_id}", response_model=schemas.InventoryResponse)
def get_inventory_item(item_id: int, db: Session = Depends(get_db)):
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
    item = db.query(models.InventoryItem).filter(
        models.InventoryItem.id == item_id
    ).first()

    if item is None:
        raise HTTPException(status_code=404, detail="Inventory item not found")

    existing_sku = db.query(models.InventoryItem).filter(
        models.InventoryItem.sku == updated_item.sku,
        models.InventoryItem.id != item_id
    ).first()

    if existing_sku:
        raise HTTPException(status_code=400, detail="SKU already exists")

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
    item = db.query(models.InventoryItem).filter(
        models.InventoryItem.id == item_id
    ).first()

    if item is None:
        raise HTTPException(status_code=404, detail="Inventory item not found")

    if stock.quantity <= 0:
        raise HTTPException(status_code=400, detail="Quantity must be greater than zero")

    item.quantity += stock.quantity

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

    db.commit()
    db.refresh(item)

    return item