// Temperature Monitoring page
// This page simulates incoming IoT temperature readings from warehouse sensors.
// Users can create simulated readings, view historical readings, and delete test records.

import { useEffect, useMemo, useState } from "react";
import {
  getTemperatureLogs,
  createTemperatureLog,
  deleteTemperatureLog,
} from "../services/temperatureService";
import { getTemperatureThresholds } from "../services/thresholdService";

import Navbar from "../components/Navbar";

function Temperature() {
  // Default form values for simulating a new sensor reading.
  const emptyForm = {
    storage_zone: "",
    temperature: "",
  };

  // Stores all temperature logs returned from the backend.
  const [logs, setLogs] = useState([]);

  // Stores configured thresholds used to populate the storage-zone dropdown.
  const [thresholds, setThresholds] = useState([]);

  // Stores the sensor simulation form values.
  const [formData, setFormData] = useState(emptyForm);

  // Stores search input used to filter temperature logs.
  const [searchTerm, setSearchTerm] = useState("");

  // Controls whether the sensor simulation modal is visible.
  const [showModal, setShowModal] = useState(false);

  // Stores loading states.
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Stores user feedback messages.
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Load temperature logs and configured thresholds when the page opens.
  useEffect(() => {
    loadTemperaturePageData();
  }, []);

  // Clear success and error messages automatically after a few seconds.
  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        setError("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [successMessage, error]);

  // Load all data needed by the Temperature Monitoring page.
  const loadTemperaturePageData = async () => {
    try {
      setLoading(true);
      setError("");

      const logsData = await getTemperatureLogs();
      const thresholdsData = await getTemperatureThresholds();

      setLogs(logsData);
      setThresholds(thresholdsData);
    } catch (err) {
      setError(err.message || "Failed to load temperature monitoring data.");
    } finally {
      setLoading(false);
    }
  };

  // Open the sensor simulation modal.
  const openModal = () => {
    setFormData(emptyForm);
    setShowModal(true);
  };

  // Close the sensor simulation modal and reset the form.
  const closeModal = () => {
    setShowModal(false);
    setFormData(emptyForm);
  };

  // Simulate a new IoT sensor reading.
  // The backend validates the reading against configured thresholds.
  // If the reading is outside the allowed range, an alert is created automatically.
  const handleCreateTemperatureLog = async (e) => {
    e.preventDefault();

    try {
      setActionLoading(true);
      setError("");
      setSuccessMessage("");

      await createTemperatureLog({
        storage_zone: formData.storage_zone,
        temperature: Number(formData.temperature),
      });

      setSuccessMessage("Sensor reading simulated successfully.");
      closeModal();

      await loadTemperaturePageData();
    } catch (err) {
      setError(err.message || "Failed to simulate sensor reading.");
    } finally {
      setActionLoading(false);
    }
  };

  // Delete a temperature reading after user confirmation.
  const handleDeleteTemperatureLog = async (logId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this temperature reading?"
    );

    if (!confirmDelete) return;

    try {
      setActionLoading(true);
      setError("");
      setSuccessMessage("");

      await deleteTemperatureLog(logId);

      setSuccessMessage("Temperature reading deleted successfully.");
      await loadTemperaturePageData();
    } catch (err) {
      setError(err.message || "Failed to delete temperature reading.");
    } finally {
      setActionLoading(false);
    }
  };

  // Calculate dashboard values from the loaded temperature logs.
  const totalReadings = logs.length;
  const highAlerts = logs.filter((log) => log.status === "high").length;
  const lowAlerts = logs.filter((log) => log.status === "low").length;
  const normalReadings = logs.filter((log) => log.status === "normal").length;

  // Filter logs by storage zone, temperature, status, or ID.
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const searchText = searchTerm.toLowerCase();

      return (
        String(log.id).includes(searchText) ||
        log.storage_zone?.toLowerCase().includes(searchText) ||
        log.status?.toLowerCase().includes(searchText) ||
        String(log.temperature).includes(searchText)
      );
    });
  }, [logs, searchTerm]);

  // Return a Bootstrap badge class based on temperature status.
  const getStatusBadgeClass = (status) => {
    if (status === "high") {
      return "badge bg-danger px-3 py-2";
    }

    if (status === "low") {
      return "badge bg-warning text-dark px-3 py-2";
    }

    return "badge bg-success px-3 py-2";
  };

  // Format recorded timestamp for display in the logs table.
  const formatRecordedAt = (recordedAt) => {
    if (!recordedAt) {
      return "N/A";
    }

    return new Date(recordedAt).toLocaleString();
  };

  // Show loading spinner while data is loading.
  if (loading) {
    return (
      <div className="container-fluid px-2 px-xl-4 mt-3">
        <Navbar />

        <div className="d-flex justify-content-center align-items-center mt-5">
          <div className="spinner-border me-3" role="status"></div>
          <span>Loading temperature monitoring data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid px-2 px-xl-4 mt-3">
      <Navbar />

      <div className="text-center mb-4">
        <h1 className="mb-1">Temperature Monitoring</h1>
        <p className="text-muted mb-0">
          Simulate incoming IoT sensor readings and monitor cold storage
          temperature compliance.
        </p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}

      {actionLoading && (
        <div className="alert alert-info">Processing request...</div>
      )}

      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <h6>Total Readings</h6>
              <h2>{totalReadings}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <h6>High Alerts</h6>
              <h2>{highAlerts}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <h6>Low Alerts</h6>
              <h2>{lowAlerts}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <h6>Normal Readings</h6>
              <h2>{normalReadings}</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-body py-3">
          <div className="row align-items-end g-3">
            <div className="col-xl-3 col-lg-3 col-md-6">
              <button className="btn btn-primary w-100" onClick={openModal}>
                + Simulate Sensor Reading
              </button>
            </div>

            <div className="col-xl-9 col-lg-9 col-md-6">
              <label className="form-label">Search Temperature Logs</label>
              <input
                className="form-control"
                placeholder="Search by ID, zone, temperature or status..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="mb-3">
            <h4 className="mb-1">Temperature Logs</h4>
            <p className="text-muted mb-0">
              Showing {filteredLogs.length} of {logs.length} readings.
            </p>
          </div>

          {filteredLogs.length === 0 ? (
            <div className="alert alert-warning mb-0">
              No temperature readings found.
            </div>
          ) : (
            <div
              className="table-responsive"
              style={{
                maxHeight: "62vh",
                overflowY: "auto",
              }}
            >
              <table
                className="table table-striped table-hover align-middle mb-0"
                style={{
                  fontSize: "0.95rem",
                }}
              >
                <thead className="table-dark sticky-top">
                  <tr>
                    <th style={{ minWidth: "90px" }}>ID</th>
                    <th style={{ minWidth: "220px" }}>Storage Zone</th>
                    <th style={{ minWidth: "150px" }}>Temperature</th>
                    <th style={{ minWidth: "140px" }}>Status</th>
                    <th style={{ minWidth: "220px" }}>Recorded At</th>
                    <th style={{ minWidth: "140px" }}>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredLogs.map((log) => (
                    <tr key={log.id}>
                      <td className="fw-semibold">{log.id}</td>
                      <td>{log.storage_zone}</td>
                      <td>{log.temperature}°C</td>
                      <td>
                        <span className={getStatusBadgeClass(log.status)}>
                          {log.status}
                        </span>
                      </td>
                      <td>{formatRecordedAt(log.recorded_at)}</td>
                      <td>
                        <button
                          className="btn btn-outline-danger btn-sm px-3"
                          onClick={() => handleDeleteTemperatureLog(log.id)}
                          disabled={actionLoading}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog modal-md modal-dialog-centered">
            <div className="modal-content">
              <form onSubmit={handleCreateTemperatureLog}>
                <div className="modal-header">
                  <h5 className="modal-title">Simulate Sensor Reading</h5>

                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeModal}
                    disabled={actionLoading}
                  ></button>
                </div>

                <div className="modal-body">
                  <div className="alert alert-info">
                    This tool simulates data received from IoT temperature sensors 
                    installed throughout the warehouse. In a production deployment, 
                    these readings would be transmitted automatically by monitoring devices
                    and validated against the configured thresholds.
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Storage Zone</label>
                    <select
                      className="form-select"
                      value={formData.storage_zone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          storage_zone: e.target.value,
                        })
                      }
                      required
                    >
                      <option value="">Select a configured zone</option>

                      {thresholds.map((threshold) => (
                        <option
                          key={threshold.id}
                          value={threshold.storage_zone}
                        >
                          {threshold.storage_zone} (
                          {threshold.minimum_temperature}°C to{" "}
                          {threshold.maximum_temperature}°C)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Temperature</label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-control"
                      placeholder="Example: -20"
                      value={formData.temperature}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          temperature: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeModal}
                    disabled={actionLoading}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={actionLoading}
                  >
                    {actionLoading ? "Saving..." : "Simulate Reading"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Temperature;