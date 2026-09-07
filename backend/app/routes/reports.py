from datetime import date

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
import app.models as models

# Reports router for warehouse analytics and management reporting
router = APIRouter(
    prefix="/reports",
    tags=["Reports"]
)


# Inventory summary report
@router.get("/inventory")
def inventory_summary_report(db: Session = Depends(get_db)):
    items = db.query(models.InventoryItem).all()
    total_items = len(items)

    total_quantity = db.query(
        func.sum(models.InventoryItem.quantity)
    ).scalar() or 0

    return {
        "total_items": total_items,
        "total_quantity": total_quantity,
        "inventory": items
    }


# Low stock report
@router.get("/low-stock")
def low_stock_report(threshold: int = 20, db: Session = Depends(get_db)):
    low_stock_items = db.query(models.InventoryItem).filter(
        models.InventoryItem.quantity <= threshold
    ).all()

    return {
        "threshold": threshold,
        "items_found": len(low_stock_items),
        "inventory": low_stock_items
    }


# Expiry management report
# Identifies expired, urgent, expiring soon, and healthy inventory items
@router.get("/expiry-management")
def expiry_management_report(
    days: int = 30,
    db: Session = Depends(get_db)
):
    # Retrieve inventory items that have an expiry date
    items = db.query(models.InventoryItem).filter(
        models.InventoryItem.expiry_date.isnot(None)
    ).all()

    today = date.today()
    expiry_results = []

    expired_count = 0
    urgent_count = 0
    expiring_soon_count = 0
    healthy_count = 0

    for item in items:
        # Convert datetime/date value into a date object
        expiry_date = item.expiry_date

        if hasattr(expiry_date, "date"):
            expiry_date = expiry_date.date()

        days_remaining = (expiry_date - today).days

        # Classify expiry risk
        if days_remaining < 0:
            status = "Expired"
            expired_count += 1
        elif days_remaining <= 10:
            status = "Urgent"
            urgent_count += 1
        elif days_remaining <= 30:
            status = "Expiring Soon"
            expiring_soon_count += 1
        else:
            status = "Healthy"
            healthy_count += 1

       # Only include expired products or products within the selected expiry window.
        if 0 <= days_remaining <= days:
            expiry_results.append({
                "id": item.id,
                "sku": getattr(item, "sku", None),
                "item_name": item.item_name,
                "category": item.category,
                "storage_zone": item.storage_zone,
                "quantity": item.quantity,
                "expiry_date": expiry_date.isoformat(),
                "days_remaining": days_remaining,
                "status": status
            })

    return {
        "days": days,
        "products_checked": len(items),
        "expired": expired_count,
        "urgent": urgent_count,
        "expiring_soon": expiring_soon_count,
        "healthy": healthy_count,
        "inventory": expiry_results
    }


# Temperature compliance report
@router.get("/temperature-compliance")
def temperature_compliance_report(db: Session = Depends(get_db)):
    logs = db.query(models.TemperatureLog).all()
    total_readings = len(logs)

    normal_count = len([log for log in logs if log.status == "normal"])
    high_count = len([log for log in logs if log.status == "high"])
    low_count = len([log for log in logs if log.status == "low"])

    compliance_percentage = 0

    if total_readings > 0:
        compliance_percentage = round((normal_count / total_readings) * 100, 2)

    return {
        "total_readings": total_readings,
        "normal_readings": normal_count,
        "high_violations": high_count,
        "low_violations": low_count,
        "compliance_percentage": compliance_percentage
    }


# Inventory movement audit report
@router.get("/movement-audit")
def movement_audit_report(db: Session = Depends(get_db)):
    movements = db.query(models.InventoryMovement).all()

    stock_in_count = len([
        movement for movement in movements
        if movement.movement_type == "STOCK_IN"
    ])

    stock_out_count = len([
        movement for movement in movements
        if movement.movement_type == "STOCK_OUT"
    ])

    return {
        "total_movements": len(movements),
        "stock_in_transactions": stock_in_count,
        "stock_out_transactions": stock_out_count,
        "movements": movements
    }


# Alert activity report
@router.get("/alert-activity")
def alert_activity_report(db: Session = Depends(get_db)):
    alerts = db.query(models.Alert).all()

    open_alerts = len([
        alert for alert in alerts
        if alert.status == "OPEN"
    ])

    acknowledged_alerts = len([
        alert for alert in alerts
        if alert.status == "ACKNOWLEDGED"
    ])

    resolved_alerts = len([
        alert for alert in alerts
        if alert.status == "RESOLVED"
    ])

    return {
        "total_alerts": len(alerts),
        "open_alerts": open_alerts,
        "acknowledged_alerts": acknowledged_alerts,
        "resolved_alerts": resolved_alerts,
        "alerts": alerts
    }


# Reporting dashboard
@router.get("/dashboard")
def reporting_dashboard(db: Session = Depends(get_db)):
    total_inventory_items = db.query(models.InventoryItem).count()

    total_movements = db.query(models.InventoryMovement).count()
    total_temperature_logs = db.query(models.TemperatureLog).count()
    total_alerts = db.query(models.Alert).count()

    open_alerts = db.query(models.Alert).filter(
        models.Alert.status == "OPEN"
    ).count()

    return {
        "inventory_items": total_inventory_items,
        "inventory_movements": total_movements,
        "temperature_logs": total_temperature_logs,
        "total_alerts": total_alerts,
        "open_alerts": open_alerts
    }