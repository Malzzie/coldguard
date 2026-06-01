from fastapi import APIRouter, Depends
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
    status = "normal"

    if log.temperature > 8:
        status = "high"

    elif log.temperature < -25:
        status = "low"

    new_log = models.TemperatureLog(
        storage_zone=log.storage_zone,
        temperature=log.temperature,
        status=status
    )

    db.add(new_log)
    db.commit()
    db.refresh(new_log)

    return new_log


@router.get("/", response_model=list[schemas.TemperatureResponse])
def get_temperature_logs(
    db: Session = Depends(get_db)
):
    return db.query(models.TemperatureLog).all()