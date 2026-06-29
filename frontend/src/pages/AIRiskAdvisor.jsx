// Page for displaying AI-generated cold storage risk recommendations

import { useEffect, useState } from "react";
import { getAIRiskAdvisor } from "../services/aiService";
import Navbar from "../components/Navbar";

function AIRiskAdvisor() {
  const [riskData, setRiskData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load AI recommendation when the page opens
  useEffect(() => {
    async function loadAIRiskAdvisor() {
      try {
        const data = await getAIRiskAdvisor();
        setRiskData(data);
      } catch (err) {
        setError("Unable to load AI Risk Advisor data.");
      } finally {
        setLoading(false);
      }
    }

    loadAIRiskAdvisor();
  }, []);

  if (loading) {
    return <p>Loading AI Risk Advisor...</p>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="container mt-4">

         <Navbar />

      <h2>AI Warehouse Risk Advisor</h2>
      <p className="text-muted">
        AI-powered decision support for cold storage monitoring.
      </p>

      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title">Current Warehouse Risk Level</h5>

          <h3 className="mb-3">
            {riskData.risk_level}
          </h3>

          <p>
            <strong>Summary:</strong> {riskData.summary}
          </p>

          <p>
            <strong>Recommendation:</strong> {riskData.recommendation}
          </p>

          <hr />

          <p>
            <strong>Average Temperature:</strong>{" "}
            {riskData.average_temperature}°C
          </p>

          <p>
            <strong>Highest Temperature:</strong>{" "}
            {riskData.highest_temperature}°C
          </p>

          <p>
            <strong>Active Alerts:</strong> {riskData.alert_count}
          </p>
        </div>
      </div>
    </div>
  );
}

export default AIRiskAdvisor;