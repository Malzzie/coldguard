// Alerts Dashboard page
// Displays alert statistics and alert records.

import { useEffect, useState } from "react";
import { getAlerts } from "../services/alertService";

import Navbar from "../components/Navbar";

function Alerts() {

  // Stores alert records
  const [alerts, setAlerts] = useState([]);

  // Stores loading state
  const [loading, setLoading] = useState(true);

  // Stores error messages
  const [error, setError] = useState("");

  useEffect(() => {
    loadAlerts();
  }, []);

  // Load alerts from backend
  const loadAlerts = async () => {

    try {

      setLoading(true);

      const data = await getAlerts();

      setAlerts(data);

    } catch (err) {

      setError(err.message);

    } finally {

      setLoading(false);
    }
  };

  // Dashboard calculations
  const totalAlerts = alerts.length;

  const activeAlerts =
  alerts.filter(
    (alert) => alert.status === "OPEN"
  ).length;

  const acknowledgedAlerts =
    alerts.filter(
      (alert) => alert.status === "ACKNOWLEDGED"
    ).length;

  const resolvedAlerts =
    alerts.filter(
      (alert) => alert.status === "RESOLVED"
    ).length;

  if (loading) {
    return (
      <div className="container mt-4">
        Loading alerts...
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">

         <Navbar />

      <h1 className="mb-4">
        Alerts Dashboard
      </h1>

      <div className="row mb-4">

        <div className="col-md-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <h6>Total Alerts</h6>
              <h2>{totalAlerts}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <h6>Active Alerts</h6>
              <h2>{activeAlerts}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <h6>Acknowledged</h6>
              <h2>{acknowledgedAlerts}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <h6>Resolved</h6>
              <h2>{resolvedAlerts}</h2>
            </div>
          </div>
        </div>

      </div>

      <div className="card shadow-sm">
        <div className="card-body">

          <h4 className="mb-3">
            Alert Records
          </h4>

          <table className="table table-striped">

            <thead>
              <tr>
                <th>ID</th>
                <th>Alert Type</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>

            <tbody>

              {alerts.map((alert) => (
                <tr key={alert.id}>
                  <td>{alert.id}</td>
                  <td>{alert.alert_type}</td>
                  <td>{alert.status}</td>
                  <td>{alert.created_at}</td>
                </tr>
              ))}

            </tbody>

          </table>

        </div>
      </div>

    </div>
  );
}

export default Alerts;