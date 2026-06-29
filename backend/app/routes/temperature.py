from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
import app.models as models
import app.schemas as schemas

router = APIRouter(
    prefix="/temperature",
    tags=["Temperature Monitoring"]
)


@router.post("/", response_model=schemas.TemperatureResponse)
def create_temperature_log(
    log: schemas.TemperatureCreate,
    db: Session = Depends(get_db)
):
    # Get threshold for this storage zone
    threshold = db.query(models.TemperatureThreshold).filter(
        models.TemperatureThreshold.storage_zone == log.storage_zone
    ).first()

    if not threshold:
         raise HTTPException(
             status_code=404,
             detail=f"No threshold configured for zone '{log.storage_zone}'"
    )

    status = "normal"

    if log.temperature > threshold.maximum_temperature:
        status = "high"

    elif log.temperature < threshold.minimum_temperature:
        status = "low"

    new_log = models.TemperatureLog(
        storage_zone=log.storage_zone,
        temperature=log.temperature,
        status=status
    )

    db.add(new_log)
    db.commit()
    db.refresh(new_log)

    # Create alert automatically
    if status in ["high", "low"]:

        new_alert = models.Alert(
        storage_zone=log.storage_zone,
        temperature=log.temperature,
        severity=status.upper()
       )

        db.add(new_alert)
        db.commit()
        db.refresh(new_alert)

        audit_record = models.AlertAudit(
          alert_id=new_alert.id,
          action="ALERT_CREATED",
          performed_by="System",
          notes=f"Automatic alert created for {status.upper()} temperature violation."
       )

        db.add(audit_record)
        db.commit()

    return new_log


@router.get("/", response_model=list[schemas.TemperatureResponse])
def get_temperature_logs(
    db: Session = Depends(get_db)
):
    return db.query(models.TemperatureLog).all()

@router.get(
    "/insights",
    response_model=schemas.TemperatureTrendResponse
)
def get_temperature_insights(
    db: Session = Depends(get_db)
):
    """
    Generate temperature trend insights from stored readings.

    This supports smart monitoring by summarising
    warehouse temperature performance and alert activity.
    """

    # Get all recorded temperature logs
    temperature_logs = db.query(
        models.TemperatureLog
    ).all()

    # Get all active alerts
    open_alerts = db.query(
        models.Alert
    ).filter(
        models.Alert.status == "OPEN"
    ).all()

    # Handle scenario where no temperature data exists yet
    if not temperature_logs:

        return schemas.TemperatureTrendResponse(
            average_temperature=0.0,
            lowest_temperature=0.0,
            highest_temperature=0.0,
            total_readings=0,
            alert_count=0,
            trend_status="No Data",
            insight="No temperature readings are available yet."
        )

    # Extract only the temperature values from each log
    temperatures = [
        log.temperature
        for log in temperature_logs
    ]

    # Calculate key temperature metrics
    average_temperature = round(
        sum(temperatures) / len(temperatures),
        2
    )

    lowest_temperature = min(temperatures)
    highest_temperature = max(temperatures)
    total_readings = len(temperature_logs)
    alert_count = len(open_alerts)

    # Determine trend status using simple decision rules
    if alert_count >= 3:
        trend_status = "Attention Required"
        insight = (
            "Multiple active alerts exist. Review affected "
            "storage zones and investigate alert history."
        )

    elif highest_temperature > 7:
        trend_status = "High Temperature Risk"
        insight = (
            "A high temperature reading has been recorded. "
            "Inspect cooling equipment and verify stock safety."
        )

    elif alert_count >= 1:
        trend_status = "Monitor Closely"
        insight = (
            "There are active alerts. Continue monitoring "
            "and inspect affected storage zones."
        )

    else:
        trend_status = "Stable"
        insight = (
            "Temperature readings are currently stable "
            "with no active alerts."
        )

    # Return calculated insight data
    return schemas.TemperatureTrendResponse(
        average_temperature=average_temperature,
        lowest_temperature=lowest_temperature,
        highest_temperature=highest_temperature,
        total_readings=total_readings,
        alert_count=alert_count,
        trend_status=trend_status,
        insight=insight
    )