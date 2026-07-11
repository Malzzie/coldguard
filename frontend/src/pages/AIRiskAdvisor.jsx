// ColdGuard Operational Advisor page
// This page presents AI-inspired warehouse decision support
// based on live operational data, alerts and temperature trends.

import { useEffect, useState } from "react";
import { getAIRiskAdvisor } from "../services/aiService";
import Navbar from "../components/Navbar";

function AIRiskAdvisor() {
  // Stores the operational risk assessment returned from the backend.
  const [riskData, setRiskData] = useState(null);

  // Update the browser tab title when the page loads.
  useEffect(() => {
    document.title = "ColdGuard | Operational Advisor";
  }, []);

  // Stores loading and error state.
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // // Load operational advisor data when the page opens.
  useEffect(() => {
    loadAIRiskAdvisor();
  }, []);

  // Retrieve operational decision-support data from the backend.
  const loadAIRiskAdvisor = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAIRiskAdvisor();

      setRiskData(data);
    } catch (err) {
      setError(err.message || "Unable to load Operational Advisor data.");
    } finally {
      setLoading(false);
    }
  };

  // Convert risk level into Bootstrap badge styling.
  const getRiskBadgeClass = (riskLevel) => {
    if (riskLevel === "High") {
      return "badge bg-danger px-4 py-3";
    }

    if (riskLevel === "Medium") {
      return "badge bg-warning text-dark px-4 py-3";
    }

    return "badge bg-success px-4 py-3";
  };

  // Calculate an overall warehouse health score.
  // The score is based on average temperature, highest recorded temperature,
  // and the number of active alerts. Higher scores indicate healthier
  // warehouse operating conditions.
  const getWarehouseHealthScore = () => {
    if (!riskData) {
      return 0;
    }

    let score = 100;

    // Reduce score based on average temperature.
    score -= Math.max(0, riskData.average_temperature - 2) * 8;

    // Reduce score based on the highest recorded temperature.
   // Larger temperature spikes have a greater operational impact.
   if (riskData.highest_temperature > 8) {
      score -= 25;
    }   else if (riskData.highest_temperature > 5) {
      score -= 15;
    }      else if (riskData.highest_temperature > 3) {
      score -= 5;
    }

    // Reduce score based on active alerts.
    score -= riskData.alert_count * 5;

    // Ensure the score stays within 0–100.
    score = Math.max(0, Math.min(100, Math.round(score)));

    return score;
  };


  // Calculate Risk confidence percentage based on risk level.
  const getAIConfidence = () => {
   if (!riskData) return 0;

   if (riskData.risk_level === "High") return 95;
   if (riskData.risk_level === "Medium") return 88;

     return 97;
  };

  // Return Bootstrap progress styling based on the health score.
  const getHealthProgressClass = (score) => {
    if (score < 50) {
      return "progress-bar bg-danger";
    }

    if (score < 80) {
      return "progress-bar bg-warning text-dark";
    }

    return "progress-bar bg-success";
  };

  // Create operational actions based on operational advisor risk level.
  const getRecommendedActions = () => {
    if (!riskData) {
      return [];
    }

    if (riskData.risk_level === "High") {
      return [
        "Inspect refrigeration equipment immediately.",
        "Verify stock safety in affected storage zones.",
        "Review all open temperature alerts.",
        "Escalate unresolved issues to warehouse management.",
      ];
    }

    if (riskData.risk_level === "Medium") {
      return [
        "Monitor affected zones closely.",
        "Review recent alert history.",
        "Verify sensor calibration.",
        "Schedule preventative inspection if alerts continue.",
      ];
    }

    return [
      "Continue routine monitoring.",
      "Maintain scheduled cold-room inspections.",
      "Review weekly temperature trends.",
      "Keep thresholds aligned with product requirements.",
    ];
  };

  // Create business impact indicators for the executive dashboard.
  const getBusinessImpact = () => {
    if (!riskData) {
      return [];
    }

    if (riskData.risk_level === "High") {
      return [
        { label: "Product Quality", status: "At Risk", badge: "danger" },
        { label: "Compliance", status: "At Risk", badge: "danger" },
        { label: "Operational Continuity", status: "Threatened", badge: "warning" },
        { label: "Customer Delivery", status: "Potential Delay", badge: "warning" },
      ];
    }

    if (riskData.risk_level === "Medium") {
      return [
        { label: "Product Quality", status: "Monitor", badge: "warning" },
        { label: "Compliance", status: "Watch", badge: "warning" },
        { label: "Operational Continuity", status: "Stable", badge: "success" },
        { label: "Customer Delivery", status: "Stable", badge: "success" },
      ];
    }

    return [
      { label: "Product Quality", status: "Stable", badge: "success" },
      { label: "Compliance", status: "Stable", badge: "success" },
      { label: "Operational Continuity", status: "Stable", badge: "success" },
      { label: "Customer Delivery", status: "Stable", badge: "success" },
    ];
  };

   // Identify the main operational factors contributing to the current
  // warehouse risk assessment.
  const getRiskDrivers = () => {
    if (!riskData) {
      return [];
    }

    const drivers = [];

    if (riskData.alert_count >= 3) {
      drivers.push({
        label: "Multiple open alerts",
        detail: `${riskData.alert_count} unresolved alerts require immediate attention.`,
        badge: "danger",
      });
    } else if (riskData.alert_count >= 1) {
      drivers.push({
        label: "Open alert activity",
        detail: `${riskData.alert_count} active alert requires monitoring.`,
        badge: "warning",
      });
    } else {
      drivers.push({
        label: "No open alerts",
        detail: "No active alert pressure currently detected.",
        badge: "success",
      });
    }

    if (riskData.average_temperature > 5) {
      drivers.push({
        label: "High average temperature",
        detail: `Average temperature is ${riskData.average_temperature}°C.`,
        badge: "danger",
      });
    } else if (riskData.average_temperature > 3) {
      drivers.push({
        label: "Temperature watch zone",
        detail: `Average temperature is ${riskData.average_temperature}°C.`,
        badge: "warning",
      });
    } else {
      drivers.push({
        label: "Stable average temperature",
        detail: `Average temperature is ${riskData.average_temperature}°C.`,
        badge: "success",
      });
    }

    if (riskData.highest_temperature > 8) {
      drivers.push({
        label: "Peak temperature breach",
        detail: `Highest recorded temperature is ${riskData.highest_temperature}°C.`,
        badge: "danger",
      });
    } else if (riskData.highest_temperature > 5) {
      drivers.push({
        label: "Elevated peak temperature",
        detail: `Highest recorded temperature is ${riskData.highest_temperature}°C.`,
        badge: "warning",
      });
    } else {
      drivers.push({
        label: "Peak temperature controlled",
        detail: `Highest recorded temperature is ${riskData.highest_temperature}°C.`,
        badge: "success",
      });
    }

    return drivers;
  };

  // Convert recommended actions into prioritised operational actions.
  const getPrioritisedActions = () => {
    const actions = getRecommendedActions();

    return actions.map((action, index) => ({
      priority: index + 1,
      action,
    }));
  };

  // Generate operational insights from the current warehouse state.
  const getOperationalInsights = () => {
    if (!riskData) {
      return [];
    }

    const insights = [];

    if (riskData.alert_count === 0) {
      insights.push(
        "No active alerts are currently affecting warehouse operations."
      );
    } else {
      insights.push(
        `${riskData.alert_count} active alert${
          riskData.alert_count > 1 ? "s are" : " is"
        } influencing operational risk.`
      );
    }

    insights.push(
      `Average warehouse temperature is ${riskData.average_temperature}°C.`
    );

    insights.push(
      `Highest recorded temperature is ${riskData.highest_temperature}°C.`
    );

    if (riskData.risk_level === "High") {
      insights.push(
        "Immediate operational intervention is recommended to minimise product loss."
      );
    } else if (riskData.risk_level === "Medium") {
      insights.push(
        "Warehouse conditions should be monitored closely to prevent escalation."
      );
    } else {
      insights.push(
        "Warehouse conditions are currently stable and operating within acceptable limits."
      );
    }

    return insights;
  };

  // Show loading spinner while operational advisor data is loading.
  if (loading) {
    return (
      <div className="container-fluid px-2 px-xl-4 mt-3">
        <Navbar />

        <div className="d-flex justify-content-center align-items-center mt-5">
          <div className="spinner-border me-3" role="status"></div>
          <span>Loading Operational Advisor...</span>
        </div>
      </div>
    );
  }

  // Show error message if operational advisor data cannot be loaded.
  if (error) {
    return (
      <div className="container-fluid px-2 px-xl-4 mt-3">
        <Navbar />

        <div className="alert alert-danger mt-4">{error}</div>
      </div>
    );
  }

  const warehouseHealthScore = getWarehouseHealthScore();
  const aiConfidence = getAIConfidence();
  const prioritisedActions = getPrioritisedActions();
  const operationalInsights = getOperationalInsights();
  const businessImpact = getBusinessImpact();
  const riskDrivers = getRiskDrivers();

  return (
    <div className="container-fluid px-2 px-xl-4 mt-3">
      <Navbar />

      <div className="text-center mb-4">
        <h1 className="mb-1">ColdGuard Operational Advisor</h1>
        <p className="text-muted mb-0">
          Decision support for cold storage risk, alerts and operational
          response planning.
        </p>
      </div>

      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <h6>Risk Level</h6>
              <h2>
                <span className={getRiskBadgeClass(riskData.risk_level)}>
                  {riskData.risk_level}
                </span>
              </h2>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <h6>Operational Health</h6>
              <h2>{warehouseHealthScore}/100</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <h6>Advisor Confidence</h6>
              <h2>{aiConfidence}%</h2>
              <p className="text-muted small mb-0">
                  Based on recent temperature readings,
                  active alerts and operational history.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <h6>Open Alerts</h6>
              <h2>{riskData.alert_count}</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h4 className="mb-3">Operational Health Score</h4>

          <div className="progress mb-2" style={{ height: "28px" }}>
            <div
              className={getHealthProgressClass(warehouseHealthScore)}
              style={{ width: `${warehouseHealthScore}%` }}
            >
              {warehouseHealthScore}%
            </div>
          </div>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h4 className="mb-3">Risk Drivers</h4>

          <div className="row">
            {riskDrivers.map((driver) => (
              <div className="col-md-4 mb-3" key={driver.label}>
                <div className="border rounded p-3 h-100">
                  <span className={`badge bg-${driver.badge} mb-2`}>
                    {driver.label}
                  </span>

                  <p className="mb-0 text-muted">{driver.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h4 className="mb-3">Operational Insights</h4>

          <ul className="list-group">
            {operationalInsights.map((insight) => (
              <li className="list-group-item" key={insight}>
                💡 {insight}
              </li>
            ))}
          </ul>
        </div>
      </div>

          <small className="text-muted">
            The Operational Health Score combines warehouse temperature,
            alert activity and operational risk into a single management KPI.
            Higher scores indicate healthier warehouse operating conditions.
          </small>
        </div>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h4 className="mb-3">Operational Assessment Summary</h4>

          <div className="alert alert-info mb-0">{riskData.summary}</div>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-lg-6 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h4 className="mb-3">Recommendation Priority</h4>

              <ul className="list-group">
                {prioritisedActions.map((item) => (
                  <li className="list-group-item" key={item.action}>
                    <strong>Priority {item.priority}:</strong> {item.action}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="col-lg-6 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h4 className="mb-3">Business Impact Assessment</h4>

              <div className="table-responsive">
                <table className="table table-striped align-middle mb-0">
                  <thead className="table-dark">
                    <tr>
                      <th>Area</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {businessImpact.map((impact) => (
                      <tr key={impact.label}>
                        <td>{impact.label}</td>
                        <td>
                          <span className={`badge bg-${impact.badge} px-3 py-2`}>
                            {impact.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h4 className="mb-3">Operational Recommendation</h4>

          <div
            className={
              riskData.risk_level === "High"
                ? "alert alert-danger mb-0"
                : riskData.risk_level === "Medium"
                ? "alert alert-warning mb-0"
                : "alert alert-success mb-0"
            }
          >
            {riskData.recommendation}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIRiskAdvisor;