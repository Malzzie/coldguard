// Temperature Monitoring page
// Displays live temperature readings from the backend.

import { useEffect, useState } from "react";
import { getTemperatureLogs } from "../services/temperatureService";

import Navbar from "../components/Navbar";

function Temperature() {

  // Temperature readings from backend
  const [logs, setLogs] = useState([]);

  // Loading state
  const [loading, setLoading] = useState(true);

  // Error state
  const [error, setError] = useState("");

  useEffect(() => {
    loadTemperatureData();
  }, []);

  // Load temperature data from backend
  const loadTemperatureData = async () => {

    try {
      setLoading(true);

      const data =
        await getTemperatureLogs();

      setLogs(data);

    } catch (err) {

      setError(err.message);

    } finally {

      setLoading(false);
    }
  };

  // Calculate dashboard values
  const totalReadings = logs.length;

  const highAlerts =
    logs.filter(
      (log) => log.status === "high"
    ).length;

  const lowAlerts =
    logs.filter(
      (log) => log.status === "low"
    ).length;

  const normalReadings =
    logs.filter(
      (log) => log.status === "normal"
    ).length;

  if (loading) {
    return (
      <div className="container mt-4">
        Loading temperature data...
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
        Temperature Monitoring
      </h1>

      <div className="row mb-4">

        <div className="col-md-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <h6>Total Readings</h6>
              <h2>{totalReadings}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <h6>High Alerts</h6>
              <h2>{highAlerts}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <h6>Low Alerts</h6>
              <h2>{lowAlerts}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <h6>Normal Readings</h6>
              <h2>{normalReadings}</h2>
            </div>
          </div>
        </div>

      </div>

      <div className="card shadow-sm">
        <div className="card-body">

          <h4 className="mb-3">
            Temperature Logs
          </h4>

          <table className="table table-striped">

            <thead>
              <tr>
                <th>ID</th>
                <th>Storage Zone</th>
                <th>Temperature</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>

              {logs.map((log) => (
                <tr key={log.id}>
                  <td>{log.id}</td>
                  <td>{log.storage_zone}</td>
                  <td>{log.temperature}°C</td>
                  <td>{log.status}</td>
                </tr>
              ))}

            </tbody>

          </table>

        </div>
      </div>

    </div>
  );
}

export default Temperature;