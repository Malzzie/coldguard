// AI Risk Advisor page
// This page presents ColdGuard's AI-style warehouse decision support.

import { useEffect, useState } from "react";
import { getAIRiskAdvisor } from "../services/aiService";
import Navbar from "../components/Navbar";

function AIRiskAdvisor() {
  // Stores the AI risk assessment returned from the backend.
  const [riskData, setRiskData] = useState(null);

  // Stores loading and error state.
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load AI risk data when the page opens.
  useEffect(() => {
    loadAIRiskAdvisor();
  }, []);

  // Retrieve AI-style warehouse risk assessment from the backend.
  const loadAIRiskAdvisor = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAIRiskAdvisor();

      setRiskData(data);
    } catch (err) {
      setError(err.message || "Unable to load AI Risk Advisor data.");
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

  // Calculate a simple warehouse health score.
  // This gives managers a single KPI for overall risk condition.
  const getWarehouseHealthScore = () => {
    if (!riskData) {
      return 0;
    }

    if (riskData.risk_level === "High") {
      return 45;
    }

    if (riskData.risk_level === "Medium") {
      return 70;
    }

    return 92;
  };
  // Calculate AI confidence percentage based on risk level.
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

  // Create operational actions based on AI risk level.
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

  // Show loading spinner while AI data is loading.
  if (loading) {
    return (
      <div className="container-fluid px-2 px-xl-4 mt-3">
        <Navbar />

        <div className="d-flex justify-content-center align-items-center mt-5">
          <div className="spinner-border me-3" role="status"></div>
          <span>Loading AI Risk Advisor...</span>
        </div>
      </div>
    );
  }

  // Show error message if AI data cannot be loaded.
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
  const recommendedActions = getRecommendedActions();
  const businessImpact = getBusinessImpact();

  return (
    <div className="container-fluid px-2 px-xl-4 mt-3">
      <Navbar />

      <div className="text-center mb-4">
        <h1 className="mb-1">AI Warehouse Risk Advisor</h1>
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
              <h6>Warehouse Health</h6>
              <h2>{warehouseHealthScore}/100</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <h6>AI Confidence</h6>
              <h2>{aiConfidence}%</h2>
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
          <h4 className="mb-3">Warehouse Health Score</h4>

          <div className="progress mb-2" style={{ height: "28px" }}>
            <div
              className={getHealthProgressClass(warehouseHealthScore)}
              style={{ width: `${warehouseHealthScore}%` }}
            >
              {warehouseHealthScore}%
            </div>
          </div>

          <small className="text-muted">
            The health score summarises current warehouse temperature risk and
            unresolved alert pressure.
          </small>
        </div>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h4 className="mb-3">AI Assessment Summary</h4>

          <div className="alert alert-info mb-0">{riskData.summary}</div>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-lg-6 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h4 className="mb-3">Recommended Actions</h4>

              <ul className="list-group">
                {recommendedActions.map((action) => (
                  <li className="list-group-item" key={action}>
                    ✅ {action}
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
          <h4 className="mb-3">AI Recommendation</h4>

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