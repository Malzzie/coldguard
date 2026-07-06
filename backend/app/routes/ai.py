"""
AI Risk Advisor Routes

Provides lightweight AI-based decision support for
ColdGuard warehouse monitoring.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas import AIRiskResponse
import app.models as models


router = APIRouter(
    prefix="/ai",
    tags=["AI Risk Advisor"]
)


@router.get("/risk-advisor", response_model=AIRiskResponse)
def get_risk_advisor(db: Session = Depends(get_db)):
    """
    Analyse warehouse temperature logs and open alerts.

    The endpoint returns a simple AI-style risk assessment that
    supports warehouse decision-making during the capstone demo.
    """

    temperature_logs = (
    db.query(models.TemperatureLog)
    .order_by(models.TemperatureLog.recorded_at.desc())
    .limit(20)
    .all()
    )

    open_alerts = db.query(models.Alert).filter(
        models.Alert.status == "OPEN"
    ).all()

    if not temperature_logs:
        return AIRiskResponse(
            risk_level="Low",
            summary="No temperature data is currently available.",
            recommendation=(
                "Continue monitoring and record temperature readings "
                "so ColdGuard can evaluate warehouse risk."
            ),
            average_temperature=0.0,
            highest_temperature=0.0,
            alert_count=0
        )

    temperatures = [log.temperature for log in temperature_logs]

    average_temperature = round(sum(temperatures) / len(temperatures), 2)
    highest_temperature = max(temperatures)
    alert_count = len(open_alerts)

    if alert_count >= 3 or average_temperature > 5:
        risk_level = "High"
        summary = (
            "Cold storage conditions require immediate attention. "
            f"The highest recorded temperature is {highest_temperature}°C "
            f"and there are {alert_count} open alerts."
        )
        recommendation = (
            "Inspect refrigeration equipment, verify stock safety, "
            "review affected storage zones, and escalate to warehouse "
            "management if temperatures do not stabilise."
        )

    elif alert_count >= 1 or average_temperature > 3:
        risk_level = "Medium"
        summary = (
            f"Average temperature is {average_temperature}°C with "
            f"{alert_count} open alerts. The warehouse should be monitored closely."
        )
        recommendation = (
            "Review alert history, inspect affected zones, verify sensor "
            "calibration, and monitor whether new alerts continue to appear."
        )

    else:
        risk_level = "Low"
        summary = (
            f"Cold storage conditions are currently stable. "
            f"Average temperature is {average_temperature}°C with "
            f"{alert_count} open alerts."
        )
        recommendation = (
            "Continue routine monitoring and maintain scheduled cold-room "
            "inspection procedures."
        )

    return AIRiskResponse(
        risk_level=risk_level,
        summary=summary,
        recommendation=recommendation,
        average_temperature=average_temperature,
        highest_temperature=highest_temperature,
        alert_count=alert_count
    )