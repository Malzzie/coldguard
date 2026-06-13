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
# Returns total inventory items, total quantity, and inventory details
@router.get("/inventory")
def inventory_summary_report(
    db: Session = Depends(get_db)
):
    # Retrieve all inventory items
    items = db.query(models.InventoryItem).all()

    # Count total inventory records
    total_items = len(items)

    # Calculate total stock quantity across all inventory items
    total_quantity = db.query(
        func.sum(models.InventoryItem.quantity)
    ).scalar() or 0

    return {
        "total_items": total_items,
        "total_quantity": total_quantity,
        "inventory": items
    }


# Low stock report
# Returns inventory items below a specified threshold
@router.get("/low-stock")
def low_stock_report(
    threshold: int = 20,
    db: Session = Depends(get_db)
):
    # Find inventory items at or below the threshold
    low_stock_items = db.query(
        models.InventoryItem
    ).filter(
        models.InventoryItem.quantity <= threshold
    ).all()

    return {
        "threshold": threshold,
        "items_found": len(low_stock_items),
        "inventory": low_stock_items
    }


# Temperature compliance report
# Summarizes temperature monitoring compliance statistics
@router.get("/temperature-compliance")
def temperature_compliance_report(
    db: Session = Depends(get_db)
):
    # Retrieve all temperature logs
    logs = db.query(models.TemperatureLog).all()

    # Count total readings
    total_readings = len(logs)

    # Count compliant readings
    normal_count = len(
        [log for log in logs if log.status == "normal"]
    )

    # Count high temperature violations
    high_count = len(
        [log for log in logs if log.status == "high"]
    )

    # Count low temperature violations
    low_count = len(
        [log for log in logs if log.status == "low"]
    )

    # Calculate compliance percentage
    compliance_percentage = 0

    if total_readings > 0:
        compliance_percentage = round(
            (normal_count / total_readings) * 100,
            2
        )

    return {
        "total_readings": total_readings,
        "normal_readings": normal_count,
        "high_violations": high_count,
        "low_violations": low_count,
        "compliance_percentage": compliance_percentage
    }

# Inventory movement audit report
# Summarizes stock movement activity across the warehouse
@router.get("/movement-audit")
def movement_audit_report(
    db: Session = Depends(get_db)
):
    movements = db.query(models.InventoryMovement).all()

    stock_in_count = len(
        [movement for movement in movements
         if movement.movement_type == "STOCK_IN"]
    )

    stock_out_count = len(
        [movement for movement in movements
         if movement.movement_type == "STOCK_OUT"]
    )

    return {
        "total_movements": len(movements),
        "stock_in_transactions": stock_in_count,
        "stock_out_transactions": stock_out_count,
        "movements": movements
    }

# Alert activity report
# Summarizes alert lifecycle activity across the warehouse
@router.get("/alert-activity")
def alert_activity_report(
    db: Session = Depends(get_db)
):
    alerts = db.query(models.Alert).all()

    open_alerts = len(
        [alert for alert in alerts
         if alert.status == "OPEN"]
    )

    acknowledged_alerts = len(
        [alert for alert in alerts
         if alert.status == "ACKNOWLEDGED"]
    )

    resolved_alerts = len(
        [alert for alert in alerts
         if alert.status == "RESOLVED"]
    )

    return {
        "total_alerts": len(alerts),
        "open_alerts": open_alerts,
        "acknowledged_alerts": acknowledged_alerts,
        "resolved_alerts": resolved_alerts,
        "alerts": alerts
    }

# Reporting dashboard
# Provides a high-level summary of warehouse operations
@router.get("/dashboard")
def reporting_dashboard(
    db: Session = Depends(get_db)
):
    total_inventory_items = db.query(
        models.InventoryItem
    ).count()

    total_movements = db.query(
        models.InventoryMovement
    ).count()

    total_temperature_logs = db.query(
        models.TemperatureLog
    ).count()

    total_alerts = db.query(
        models.Alert
    ).count()

    open_alerts = db.query(
        models.Alert
    ).filter(
        models.Alert.status == "OPEN"
    ).count()

    return {
        "inventory_items": total_inventory_items,
        "inventory_movements": total_movements,
        "temperature_logs": total_temperature_logs,
        "total_alerts": total_alerts,
        "open_alerts": open_alerts
    }