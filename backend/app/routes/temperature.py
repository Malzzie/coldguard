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