// Temperature Trend Insights page
// This page provides executive-level analytics for warehouse temperature performance.

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getTemperatureInsights } from "../services/temperatureInsightService";

function TemperatureInsights() {
  // Stores temperature insight data returned from the backend.
  const [insights, setInsights] = useState(null);

  // Stores loading and error state.
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load temperature insight data when the page opens.
  useEffect(() => {
    loadInsights();
  }, []);

  // Retrieve calculated insight data from the backend.
  const loadInsights = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getTemperatureInsights();

      setInsights(data);
    } catch (err) {
      setError(err.message || "Unable to load temperature insights.");
    } finally {
      setLoading(false);
    }
  };

  // Return badge styling based on trend status.
  const getTrendBadgeClass = (trendStatus) => {
    if (trendStatus === "Attention Required") {
      return "badge bg-danger px-3 py-2";
    }

    if (
      trendStatus === "High Temperature Risk" ||
      trendStatus === "Monitor Closely"
    ) {
      return "badge bg-warning text-dark px-3 py-2";
    }

    if (trendStatus === "Stable") {
      return "badge bg-success px-3 py-2";
    }

    return "badge bg-secondary px-3 py-2";
  };

  // Calculate alert pressure as a simple visual indicator.
  // This is not a predictive model; it is a management-friendly risk indicator.
  const getAlertPressurePercentage = () => {
    if (!insights || insights.total_readings === 0) {
      return 0;
    }

    return Math.min(
      100,
      Math.round((insights.alert_count / insights.total_readings) * 100)
    );
  };

  // Show loading spinner while insight data is loading.
  if (loading) {
    return (
      <div className="container-fluid px-2 px-xl-4 mt-3">
        <Navbar />

        <div className="d-flex justify-content-center align-items-center mt-5">
          <div className="spinner-border me-3" role="status"></div>
          <span>Loading temperature insights...</span>
        </div>
      </div>
    );
  }

  // Show error message if insight data cannot be loaded.
  if (error) {
    return (
      <div className="container-fluid px-2 px-xl-4 mt-3">
        <Navbar />

        <div className="alert alert-danger mt-4">{error}</div>
      </div>
    );
  }

  const alertPressure = getAlertPressurePercentage();

  // Calculate a simple warehouse temperature stability score.
  // This combines alert pressure into an easy-to-understand KPI.
  const getStabilityScore = () => {
  const score = Math.max(0, 100 - alertPressure);

  if (score >= 90) {
    return {
      score,
      label: "Excellent",
      badge: "success",
    };
  }

  if (score >= 70) {
    return {
      score,
      label: "Good",
      badge: "primary",
    };
  }

  if (score >= 50) {
    return {
      score,
      label: "Needs Attention",
      badge: "warning",
    };
  }

  return {
    score,
    label: "Critical",
    badge: "danger",
  };
};

const stability = getStabilityScore();

  return (
    <div className="container-fluid px-2 px-xl-4 mt-3">
      <Navbar />

      <div className="text-center mb-4">
        <h1 className="mb-1">Temperature Trend Insights</h1>
        <p className="text-muted mb-0">
          Executive analytics for warehouse temperature stability, risk and
          operational performance.
        </p>
      </div>

      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <h6>Average Temperature</h6>
              <h2>{insights.average_temperature}°C</h2>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <h6>Lowest Temperature</h6>
              <h2>{insights.lowest_temperature}°C</h2>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <h6>Highest Temperature</h6>
              <h2>{insights.highest_temperature}°C</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <h6>Total Readings</h6>
              <h2>{insights.total_readings}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <h6>Active Alerts</h6>
              <h2>{insights.alert_count}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <h6>Trend Status</h6>
              <h2>
                <span className={getTrendBadgeClass(insights.trend_status)}>
                  {insights.trend_status}
                </span>
              </h2>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h4 className="mb-3">Temperature Risk Indicator</h4>

          <p className="text-muted">
            This indicator estimates operational alert pressure by comparing
            active alerts against total readings.
          </p>

          <div className="progress mb-2" style={{ height: "26px" }}>
            <div
              className={
                alertPressure >= 50
                  ? "progress-bar bg-danger"
                  : alertPressure >= 20
                  ? "progress-bar bg-warning text-dark"
                  : "progress-bar bg-success"
              }
              style={{ width: `${alertPressure}%` }}
            >
              {alertPressure}%
            </div>
          </div>

          <div className="card shadow-sm mb-4">
            <div className="card-body">

            <h4 className="mb-3">
             Temperature Stability Score
            </h4>

            <div className="row align-items-center">

             <div className="col-md-3 text-center">

              <h1 className="display-4">
                {stability.score}
              </h1>

              <span className={`badge bg-${stability.badge} fs-6`}>
               {stability.label}
              </span>

            </div>

            <div className="col-md-9">

             <div
              className="progress"
              style={{ height: "28px" }}
             >

             <div
               className={`progress-bar bg-${stability.badge}`}
               style={{
                 width: `${stability.score}%`,
                }}
             >
              {stability.score}%
             </div> 

           </div>

           <small className="text-muted">

              This score estimates overall warehouse temperature
              stability based on active alerts and sensor readings.

           </small>

         </div>

        </div>

      </div>
    </div>

          <small className="text-muted">
            Lower alert pressure indicates stronger temperature stability.
          </small>
        </div>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h4 className="mb-3">Operational Insight</h4>

          <div className="alert alert-info mb-0">
            {insights.insight}
          </div>
        </div>
      </div>

      <div className="card shadow-sm">

        <div className="card-body">

         <h4 className="mb-3">
            Recommended Actions
         </h4>

         <ul className="list-group">

          {insights.alert_count > 0 ? (
           <>
             <li className="list-group-item">
              ✅ Inspect refrigeration equipment in affected storage zones.
           </li>

           <li className="list-group-item">
              ✅ Verify temperature sensor calibration.
           </li>

           <li className="list-group-item">
              ✅ Review recent alert history for recurring issues.
           </li>

           <li className="list-group-item">
              ✅ Prioritize inspection of high-value inventory.
           </li>
         </>
       ) : (
         <>
           <li className="list-group-item">
              ✅ Continue routine monitoring.
           </li>

           <li className="list-group-item">
              ✅ Perform preventative maintenance as scheduled.
           </li>

           <li className="list-group-item">
              ✅ Review historical trends weekly.
           </li>
          </>
         )}

       </ul>

      </div>

     </div>

    </div>
  );
}

export default TemperatureInsights;