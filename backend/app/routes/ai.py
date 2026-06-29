"""
AI Risk Advisor Routes

Provides lightweight AI-based decision support for
ColdGuard warehouse monitoring.
"""

# FastAPI imports
from fastapi import APIRouter, Depends

# SQLAlchemy database session
from sqlalchemy.orm import Session

# Database dependency
from app.database import get_db

# Response schema
from app.schemas import AIRiskResponse

# Database models
import app.models as models


# Router configuration
router = APIRouter(
    prefix="/ai",
    tags=["AI Risk Advisor"]
)


@router.get(
    "/risk-advisor",
    response_model=AIRiskResponse
)
def get_risk_advisor(
    db: Session = Depends(get_db)
):
    """
    AI Recommendation Engine

    Analyses warehouse temperature logs and active alerts
    to determine operational risk levels and provide
    recommendations to warehouse managers.
    """

    # --------------------------------------------
    # Retrieve warehouse monitoring data
    # --------------------------------------------

    # Get all recorded temperature logs
    temperature_logs = db.query(
        models.TemperatureLog
    ).all()

    # Get all active/open alerts
    open_alerts = db.query(
        models.Alert
    ).filter(
        models.Alert.status == "OPEN"
    ).all()

    # --------------------------------------------
    # Handle empty database scenario
    # --------------------------------------------

    if not temperature_logs:

        return AIRiskResponse(
            risk_level="Low",
            summary="No temperature data available.",
            recommendation=(
                "Continue monitoring and record "
                "temperature readings."
            ),
            average_temperature=0.0,
            highest_temperature=0.0,
            alert_count=0
        )

    # --------------------------------------------
    # Calculate temperature insights
    # --------------------------------------------

    temperatures = [
        log.temperature
        for log in temperature_logs
    ]

    # Average recorded temperature
    average_temperature = round(
        sum(temperatures) / len(temperatures),
        2
    )

    # Highest recorded temperature
    highest_temperature = max(temperatures)

    # Number of currently open alerts
    alert_count = len(open_alerts)

    # --------------------------------------------
    # AI Risk Assessment Logic
    # --------------------------------------------

    # High risk conditions
    if (
    average_temperature > 5
    or highest_temperature > 7
    ):

     risk_level = "High"

     summary = (
        "Cold storage conditions require "
        "immediate attention."
     )

     recommendation = (
        "Inspect refrigeration equipment, "
        "verify stock safety, and investigate "
        "temperature violations."
     )

    # Medium risk conditions
    elif (
    alert_count >= 3
    or average_temperature > 3
    ):

     risk_level = "Medium"

     summary = (
        f"Average temperature is {average_temperature}°C "
        f"with {alert_count} active alerts."
     )

     recommendation = (
        "Review alert history and inspect "
        "affected storage zones."
     )

    # Low risk conditions
    else:

     risk_level = "Low"

     summary = (
        "Cold storage conditions are stable."
     )

     recommendation = (
        "Continue routine monitoring."
     )

     summary = (
        f"Average temperature is {average_temperature}°C "
        f"with {alert_count} active alerts."
     )

    # --------------------------------------------
    # Return AI recommendation
    # --------------------------------------------

    return AIRiskResponse(
        risk_level=risk_level,
        summary=summary,
        recommendation=recommendation,
        average_temperature=average_temperature,
        highest_temperature=highest_temperature,
        alert_count=alert_count
    )