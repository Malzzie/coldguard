// Temperature Trend Insights page
// Displays warehouse temperature analytics and trend information.

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getTemperatureInsights } from "../services/temperatureInsightService";

function TemperatureInsights() {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load temperature insight data
  useEffect(() => {
    async function loadInsights() {
      try {
        const data = await getTemperatureInsights();
        setInsights(data);
      } catch (err) {
        setError("Unable to load temperature insights.");
      } finally {
        setLoading(false);
      }
    }

    loadInsights();
  }, []);

  if (loading) {
    return <p className="text-center mt-5">Loading Temperature Insights...</p>;
  }

  if (error) {
    return (
      <div className="container mt-4">
        <Navbar />
        <div className="alert alert-danger mt-4">
          {error}
        </div>
      </div>
    );
  }

  return (
  <div className="container mt-4">

    <Navbar />

    <h1 className="text-center mt-4">
      Temperature Trend Insights
    </h1>

    <p className="text-center text-muted">
      Warehouse temperature analytics and operational trends.
    </p>

        {/* Metric Cards */}

        <div className="row mt-4">

          <div className="col-md-4 mb-3">
            <div className="card text-center shadow-sm">
              <div className="card-body">
                <h5>Average Temperature</h5>
                <h2>{insights.average_temperature}°C</h2>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="card text-center shadow-sm">
              <div className="card-body">
                <h5>Lowest Temperature</h5>
                <h2>{insights.lowest_temperature}°C</h2>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="card text-center shadow-sm">
              <div className="card-body">
                <h5>Highest Temperature</h5>
                <h2>{insights.highest_temperature}°C</h2>
              </div>
            </div>
          </div>

        </div>

        <div className="row">

          <div className="col-md-4 mb-3">
            <div className="card text-center shadow-sm">
              <div className="card-body">
                <h5>Total Readings</h5>
                <h2>{insights.total_readings}</h2>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="card text-center shadow-sm">
              <div className="card-body">
                <h5>Active Alerts</h5>
                <h2>{insights.alert_count}</h2>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="card text-center shadow-sm">
              <div className="card-body">
                <h5>Trend Status</h5>
                <h2>{insights.trend_status}</h2>
              </div>
            </div>
          </div>

        </div>

        {/* Operational Insight */}

        <div className="card shadow-sm mt-4">

          <div className="card-body">

            <h4>Operational Insight</h4>

            <p className="mb-0">
              {insights.insight}
            </p>

          </div>

        </div>

      </div>
  );
}

export default TemperatureInsights;