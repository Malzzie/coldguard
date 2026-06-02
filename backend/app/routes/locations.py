# FastAPI tools for routes and database dependencies
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

# Import database, models, and schemas
from app.database import get_db
import app.models as models
import app.schemas as schemas

# Create a router for storage location endpoints
router = APIRouter(
    prefix="/locations",
    tags=["Storage Locations"]
)


# Create a new storage location
@router.post("/", response_model=schemas.StorageLocationResponse)
def create_storage_location(
    location: schemas.StorageLocationCreate,
    db: Session = Depends(get_db)
):
    existing_location = db.query(models.StorageLocation).filter(
        models.StorageLocation.location_code == location.location_code
    ).first()

    if existing_location:
        raise HTTPException(
            status_code=400,
            detail="Location code already exists"
        )

    new_location = models.StorageLocation(**location.model_dump())

    db.add(new_location)
    db.commit()
    db.refresh(new_location)

    return new_location


# Get all storage locations
@router.get("/", response_model=list[schemas.StorageLocationResponse])
def get_storage_locations(db: Session = Depends(get_db)):
    return db.query(models.StorageLocation).all()


# Get one storage location by ID
@router.get("/{location_id}", response_model=schemas.StorageLocationResponse)
def get_storage_location(location_id: int, db: Session = Depends(get_db)):
    location = db.query(models.StorageLocation).filter(
        models.StorageLocation.id == location_id
    ).first()

    if location is None:
        raise HTTPException(status_code=404, detail="Storage location not found")

    return location


# Update a storage location by ID
@router.put("/{location_id}", response_model=schemas.StorageLocationResponse)
def update_storage_location(
    location_id: int,
    updated_location: schemas.StorageLocationCreate,
    db: Session = Depends(get_db)
):
    location = db.query(models.StorageLocation).filter(
        models.StorageLocation.id == location_id
    ).first()

    if location is None:
        raise HTTPException(status_code=404, detail="Storage location not found")

    existing_code = db.query(models.StorageLocation).filter(
        models.StorageLocation.location_code == updated_location.location_code,
        models.StorageLocation.id != location_id
    ).first()

    if existing_code:
        raise HTTPException(
            status_code=400,
            detail="Location code already exists"
        )

    for key, value in updated_location.model_dump().items():
        setattr(location, key, value)

    db.commit()
    db.refresh(location)

    return location


# Delete a storage location by ID
@router.delete("/{location_id}")
def delete_storage_location(
    location_id: int,
    db: Session = Depends(get_db)
):
    location = db.query(models.StorageLocation).filter(
        models.StorageLocation.id == location_id
    ).first()

    if location is None:
        raise HTTPException(status_code=404, detail="Storage location not found")

    db.delete(location)
    db.commit()

    return {"message": "Storage location deleted successfully"}