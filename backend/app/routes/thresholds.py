from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
import app.models as models
import app.schemas as schemas

router = APIRouter(
    prefix="/thresholds",
    tags=["Temperature Thresholds"]
)


@router.post("/", response_model=schemas.TemperatureThresholdResponse)
def create_temperature_threshold(
    threshold: schemas.TemperatureThresholdCreate,
    db: Session = Depends(get_db)
):
    # Check if this storage zone already has a threshold
    existing_threshold = db.query(models.TemperatureThreshold).filter(
        models.TemperatureThreshold.storage_zone == threshold.storage_zone
    ).first()

    if existing_threshold:
        raise HTTPException(
            status_code=400,
            detail="A threshold already exists for this storage zone"
        )

    # Make sure the max temperature is greater than the min temperature
    if threshold.maximum_temperature <= threshold.minimum_temperature:
        raise HTTPException(
            status_code=400,
            detail="Maximum temperature must be greater than minimum temperature"
        )

    new_threshold = models.TemperatureThreshold(
        storage_zone=threshold.storage_zone,
        minimum_temperature=threshold.minimum_temperature,
        maximum_temperature=threshold.maximum_temperature
    )

    db.add(new_threshold)
    db.commit()
    db.refresh(new_threshold)

    return new_threshold


@router.get("/", response_model=list[schemas.TemperatureThresholdResponse])
def get_temperature_thresholds(
    db: Session = Depends(get_db)
):
    return db.query(models.TemperatureThreshold).all()