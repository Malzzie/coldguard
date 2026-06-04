from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime
from sqlalchemy.orm import Session

from app.database import get_db
import app.models as models
import app.schemas as schemas

router = APIRouter(
    prefix="/alerts",
    tags=["Alerts"]
)


@router.get("/", response_model=list[schemas.AlertResponse])
def get_alerts(
    db: Session = Depends(get_db)
):
    return db.query(models.Alert).all()

@router.put("/{alert_id}/acknowledge",
            response_model=schemas.AlertResponse)
def acknowledge_alert(
    alert_id: int,
    request: schemas.AlertAcknowledge,
    db: Session = Depends(get_db)
):

    alert = db.query(models.Alert).filter(
        models.Alert.id == alert_id
    ).first()

    if not alert:
        raise HTTPException(
            status_code=404,
            detail="Alert not found"
        )

    alert.status = "ACKNOWLEDGED"
    alert.acknowledged_at = datetime.utcnow()
    alert.acknowledged_by = request.acknowledged_by

    audit_record = models.AlertAudit(
       alert_id=alert.id,
       action="ALERT_ACKNOWLEDGED",
       performed_by=request.acknowledged_by,
       notes="Alert acknowledged for investigation."
    )

    db.add(audit_record)

    db.commit()
    db.refresh(alert)

    return alert


@router.put("/{alert_id}/resolve",
            response_model=schemas.AlertResponse)
def resolve_alert(
    alert_id: int,
    request: schemas.AlertResolve,
    db: Session = Depends(get_db)
):

    alert = db.query(models.Alert).filter(
        models.Alert.id == alert_id
    ).first()

    if not alert:
        raise HTTPException(
            status_code=404,
            detail="Alert not found"
        )

    alert.status = "RESOLVED"
    alert.resolved_at = datetime.utcnow()
    alert.resolution_notes = request.resolution_notes

    audit_record = models.AlertAudit(
       alert_id=alert.id,
       action="ALERT_RESOLVED",
       performed_by="Warehouse Manager",
       notes=request.resolution_notes
    )

    db.add(audit_record)

    db.commit()
    db.refresh(alert)

    return alert

@router.get("/{alert_id}/audit",
            response_model=list[schemas.AlertAuditResponse])
def get_alert_audit_trail(
    alert_id: int,
    db: Session = Depends(get_db)
):

    return db.query(models.AlertAudit).filter(
        models.AlertAudit.alert_id == alert_id
    ).all()