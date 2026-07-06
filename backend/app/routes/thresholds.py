# FastAPI tools for routes and database dependencies
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

# Import database, models, and schemas
from app.database import get_db
import app.models as models
import app.schemas as schemas

# Create a router for temperature-threshold-related endpoints
router = APIRouter(
    prefix="/thresholds",
    tags=["Temperature Thresholds"]
)


# Create a new temperature threshold
@router.post("/", response_model=schemas.TemperatureThresholdResponse)
def create_temperature_threshold(
    threshold: schemas.TemperatureThresholdCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new temperature threshold for a storage zone.

    Each storage zone can only have one threshold record.
    These thresholds are used by the Temperature Monitoring module
    to determine whether a sensor reading is normal, high, or low.
    """

    # Check if this storage zone already has a configured threshold.
    existing_threshold = db.query(models.TemperatureThreshold).filter(
        models.TemperatureThreshold.storage_zone == threshold.storage_zone
    ).first()

    if existing_threshold:
        raise HTTPException(
            status_code=400,
            detail="A threshold already exists for this storage zone"
        )

    # Make sure the maximum temperature is greater than the minimum temperature.
    if threshold.maximum_temperature <= threshold.minimum_temperature:
        raise HTTPException(
            status_code=400,
            detail="Maximum temperature must be greater than minimum temperature"
        )

    # Create the new threshold record.
    new_threshold = models.TemperatureThreshold(
        storage_zone=threshold.storage_zone,
        minimum_temperature=threshold.minimum_temperature,
        maximum_temperature=threshold.maximum_temperature
    )

    db.add(new_threshold)
    db.commit()
    db.refresh(new_threshold)

    return new_threshold


# Get all configured temperature thresholds
@router.get("/", response_model=list[schemas.TemperatureThresholdResponse])
def get_temperature_thresholds(
    db: Session = Depends(get_db)
):
    """
    Return all configured temperature thresholds.

    The frontend uses this endpoint to display threshold settings
    and to populate the storage-zone dropdown on the Temperature page.
    """

    return db.query(models.TemperatureThreshold).all()


# Get one temperature threshold by ID
@router.get("/{threshold_id}", response_model=schemas.TemperatureThresholdResponse)
def get_temperature_threshold(
    threshold_id: int,
    db: Session = Depends(get_db)
):
    """
    Return a single temperature threshold by ID.

    This endpoint supports detailed lookup and future edit workflows.
    """

    threshold = db.query(models.TemperatureThreshold).filter(
        models.TemperatureThreshold.id == threshold_id
    ).first()

    if threshold is None:
        raise HTTPException(
            status_code=404,
            detail="Temperature threshold not found"
        )

    return threshold


# Update a temperature threshold by ID
@router.put("/{threshold_id}", response_model=schemas.TemperatureThresholdResponse)
def update_temperature_threshold(
    threshold_id: int,
    updated_threshold: schemas.TemperatureThresholdCreate,
    db: Session = Depends(get_db)
):
    """
    Update an existing temperature threshold.

    This allows warehouse administrators to adjust acceptable
    temperature ranges for each configured storage zone.
    """

    # Find the threshold that should be updated.
    threshold = db.query(models.TemperatureThreshold).filter(
        models.TemperatureThreshold.id == threshold_id
    ).first()

    if threshold is None:
        raise HTTPException(
            status_code=404,
            detail="Temperature threshold not found"
        )

    # Prevent duplicate storage-zone threshold records.
    existing_zone = db.query(models.TemperatureThreshold).filter(
        models.TemperatureThreshold.storage_zone == updated_threshold.storage_zone,
        models.TemperatureThreshold.id != threshold_id
    ).first()

    if existing_zone:
        raise HTTPException(
            status_code=400,
            detail="A threshold already exists for this storage zone"
        )

    # Validate temperature range before saving.
    if updated_threshold.maximum_temperature <= updated_threshold.minimum_temperature:
        raise HTTPException(
            status_code=400,
            detail="Maximum temperature must be greater than minimum temperature"
        )

    # Update threshold fields.
    threshold.storage_zone = updated_threshold.storage_zone
    threshold.minimum_temperature = updated_threshold.minimum_temperature
    threshold.maximum_temperature = updated_threshold.maximum_temperature

    db.commit()
    db.refresh(threshold)

    return threshold


# Delete a temperature threshold by ID
@router.delete("/{threshold_id}")
def delete_temperature_threshold(
    threshold_id: int,
    db: Session = Depends(get_db)
):
    """
    Delete a temperature threshold.

    This supports removing obsolete storage zones or incorrect
    threshold configuration records.
    """

    # Find the threshold before attempting deletion.
    threshold = db.query(models.TemperatureThreshold).filter(
        models.TemperatureThreshold.id == threshold_id
    ).first()

    if threshold is None:
        raise HTTPException(
            status_code=404,
            detail="Temperature threshold not found"
        )

    db.delete(threshold)
    db.commit()

    return {
        "message": "Temperature threshold deleted successfully",
        "deleted_threshold_id": threshold_id
    }