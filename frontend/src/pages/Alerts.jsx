// Alerts Dashboard page
// This page allows users to view, acknowledge, resolve, and audit alerts.

import { useEffect, useMemo, useState } from "react";
import {
  getAlerts,
  acknowledgeAlert,
  resolveAlert,
  archiveAlert,
  getAlertAudit,
} from "../services/alertService";

import Navbar from "../components/Navbar";

function Alerts() {
  // Stores all alert records returned from the backend.
  const [alerts, setAlerts] = useState([]);

  // Stores audit trail records for the selected alert.
  const [auditRecords, setAuditRecords] = useState([]);

  // Stores the alert currently selected for resolution.
  const [selectedAlert, setSelectedAlert] = useState(null);

  // Stores resolution notes entered by the user.
  const [resolutionNotes, setResolutionNotes] = useState("");

  // Stores search text used to filter alert records.
  const [searchTerm, setSearchTerm] = useState("");

  // Controls modal visibility.
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [showAuditModal, setShowAuditModal] = useState(false);

  // Stores loading states.
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Stores user feedback messages.
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Load alert records when the page opens.
  useEffect(() => {
    loadAlerts();
  }, []);

  // Automatically clear success and error messages.
  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        setError("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [successMessage, error]);

  // Load all alerts from the backend.
  const loadAlerts = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAlerts();

      setAlerts(data);
    } catch (err) {
      setError(err.message || "Failed to load alerts.");
    } finally {
      setLoading(false);
    }
  };

  // Acknowledge an open alert.
  const handleAcknowledgeAlert = async (alertId) => {
    const confirmAcknowledge = window.confirm(
      "Are you sure you want to acknowledge this alert?"
    );

    if (!confirmAcknowledge) return;

    try {
      setActionLoading(true);
      setError("");
      setSuccessMessage("");

      await acknowledgeAlert(alertId, "Warehouse Manager");

      setSuccessMessage("Alert acknowledged successfully.");
      await loadAlerts();
    } catch (err) {
      setError(err.message || "Failed to acknowledge alert.");
    } finally {
      setActionLoading(false);
    }
  };

  // Open the resolution modal for a selected alert.
  const openResolveModal = (alert) => {
    setSelectedAlert(alert);
    setResolutionNotes("");
    setShowResolveModal(true);
  };

  // Close the resolution modal and clear related state.
  const closeResolveModal = () => {
    setSelectedAlert(null);
    setResolutionNotes("");
    setShowResolveModal(false);
  };

  // Resolve an alert with operational notes.
  const handleResolveAlert = async (e) => {
    e.preventDefault();

    if (!selectedAlert) return;

    try {
      setActionLoading(true);
      setError("");
      setSuccessMessage("");

      await resolveAlert(selectedAlert.id, resolutionNotes);

      setSuccessMessage("Alert resolved successfully.");
      closeResolveModal();

      await loadAlerts();
    } catch (err) {
      setError(err.message || "Failed to resolve alert.");
    } finally {
      setActionLoading(false);
    }
  };

   // Archive a resolved alert.
  // Archived alerts are removed from the active dashboard while
  // preserving operational history and audit traceability.
  const handleArchiveAlert = async (alertId) => {
    const confirmArchive = window.confirm(
      "Archive this resolved alert?\n\nThe alert will be removed from the active dashboard while preserving its audit history."
    );

    if (!confirmArchive) return;

    try {
      setActionLoading(true);
      setError("");
      setSuccessMessage("");

      await archiveAlert(alertId);

      setSuccessMessage(
        "Alert archived successfully."
      );

      await loadAlerts();
    } catch (err) {
      setError(
        err.message ||
        "Failed to archive alert."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // Load and display the audit trail for a selected alert.
  const openAuditModal = async (alert) => {
    try {
      setActionLoading(true);
      setError("");

      const auditData = await getAlertAudit(alert.id);

      setSelectedAlert(alert);
      setAuditRecords(auditData);
      setShowAuditModal(true);
    } catch (err) {
      setError(err.message || "Failed to load alert audit trail.");
    } finally {
      setActionLoading(false);
    }
  };

  // Close audit modal and reset audit data.
  const closeAuditModal = () => {
    setSelectedAlert(null);
    setAuditRecords([]);
    setShowAuditModal(false);
  };

  // Dashboard calculations.
  const totalAlerts = alerts.length;
  const activeAlerts = alerts.filter((alert) => alert.status === "OPEN").length;
  const acknowledgedAlerts = alerts.filter(
    (alert) => alert.status === "ACKNOWLEDGED"
  ).length;
  const resolvedAlerts = alerts.filter(
    (alert) => alert.status === "RESOLVED"
  ).length;

  // Filter alerts using ID, storage zone, severity, status, or temperature.
  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      const searchText = searchTerm.toLowerCase();

      return (
        String(alert.id).includes(searchText) ||
        alert.storage_zone?.toLowerCase().includes(searchText) ||
        alert.severity?.toLowerCase().includes(searchText) ||
        alert.status?.toLowerCase().includes(searchText) ||
        String(alert.temperature).includes(searchText)
      );
    });
  }, [alerts, searchTerm]);

  // Return Bootstrap badge styling based on alert status.
  const getStatusBadgeClass = (status) => {
    if (status === "OPEN") {
      return "badge bg-danger px-3 py-2";
    }

    if (status === "ACKNOWLEDGED") {
      return "badge bg-warning text-dark px-3 py-2";
    }

    return "badge bg-success px-3 py-2";
  };

  // Return Bootstrap badge styling based on alert severity.
  const getSeverityBadgeClass = (severity) => {
    if (severity === "HIGH") {
      return "badge bg-danger px-3 py-2";
    }

    if (severity === "LOW") {
      return "badge bg-warning text-dark px-3 py-2";
    }

    return "badge bg-secondary px-3 py-2";
  };

  // Format backend datetime values for display.
  const formatDateTime = (value) => {
  if (!value) {
    return "N/A";
  }

  return new Date(value).toLocaleString("en-ZA", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};


  // Show loading spinner while alerts are loading.
  if (loading) {
    return (
      <div className="container-fluid px-2 px-xl-4 mt-3">
        <Navbar />

        <div className="d-flex justify-content-center align-items-center mt-5">
          <div className="spinner-border me-3" role="status"></div>
          <span>Loading alerts...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid px-2 px-xl-4 mt-3">
      <Navbar />

      <div className="text-center mb-4">
        <h1 className="mb-1">Alerts Dashboard</h1>
        <p className="text-muted mb-0">
          Review temperature violations, acknowledge incidents and record
          resolution actions.
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
              <h6>Total Alerts</h6>
              <h2>{totalAlerts}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <h6>Open Alerts</h6>
              <h2>{activeAlerts}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <h6>Acknowledged</h6>
              <h2>{acknowledgedAlerts}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <h6>Resolved</h6>
              <h2>{resolvedAlerts}</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-body py-3">
          <label className="form-label">Search Alerts</label>
          <input
            className="form-control"
            placeholder="Search by ID, zone, severity, status or temperature..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="mb-3">
            <h4 className="mb-1">Alert Records</h4>
            <p className="text-muted mb-0">
              Showing {filteredAlerts.length} of {alerts.length} alerts.
            </p>
          </div>

          {filteredAlerts.length === 0 ? (
            <div className="alert alert-warning mb-0">No alerts found.</div>
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
                    <th style={{ minWidth: "80px" }}>ID</th>
                    <th style={{ minWidth: "190px" }}>Storage Zone</th>
                    <th style={{ minWidth: "130px" }}>Temperature</th>
                    <th style={{ minWidth: "120px" }}>Severity</th>
                    <th style={{ minWidth: "150px" }}>Status</th>
                    <th style={{ minWidth: "220px" }}>Created</th>
                    <th style={{ minWidth: "320px" }}>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredAlerts.map((alert) => (
                    <tr key={alert.id}>
                      <td className="fw-semibold">{alert.id}</td>
                      <td>{alert.storage_zone}</td>
                      <td>{alert.temperature}°C</td>
                      <td>
                        <span className={getSeverityBadgeClass(alert.severity)}>
                          {alert.severity}
                        </span>
                      </td>
                      <td>
                        <span className={getStatusBadgeClass(alert.status)}>
                          {alert.status}
                        </span>
                      </td>
                      <td>{formatDateTime(alert.created_at)}</td>
                      <td>
                        <div className="d-flex gap-2 flex-wrap">
                          <button
                            className="btn btn-outline-warning btn-sm px-3"
                            onClick={() => handleAcknowledgeAlert(alert.id)}
                            disabled={
                              actionLoading || alert.status !== "OPEN"
                            }
                          >
                            Acknowledge
                          </button>

                          <button
                            className="btn btn-outline-success btn-sm px-3"
                            onClick={() => openResolveModal(alert)}
                            disabled={
                              actionLoading || alert.status === "RESOLVED"
                            }
                          >
                            Resolve
                          </button>

                          <button
                            className="btn btn-outline-danger btn-sm px-3"
                            onClick={() => handleArchiveAlert(alert.id)}
                            disabled={
                              actionLoading || alert.status !== "RESOLVED"
                            }
                          >
                            Remove
                          </button>

                          <button
                            className="btn btn-outline-primary btn-sm px-3"
                            onClick={() => openAuditModal(alert)}
                            disabled={actionLoading}
                          >
                            Audit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showResolveModal && selectedAlert && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog modal-md modal-dialog-centered">
            <div className="modal-content">
              <form onSubmit={handleResolveAlert}>
                <div className="modal-header">
                  <h5 className="modal-title">Resolve Alert</h5>

                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeResolveModal}
                    disabled={actionLoading}
                  ></button>
                </div>

                <div className="modal-body">
                  <div className="alert alert-info">
                    Record the operational action taken to resolve this alert.
                  </div>

                  <p>
                    <strong>Alert ID:</strong> {selectedAlert.id}
                  </p>

                  <p>
                    <strong>Storage Zone:</strong> {selectedAlert.storage_zone}
                  </p>

                  <p>
                    <strong>Temperature:</strong> {selectedAlert.temperature}°C
                  </p>

                  <div className="mb-3">
                    <label className="form-label">Resolution Notes</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      placeholder="Example: Cooling unit inspected and temperature returned to normal."
                      value={resolutionNotes}
                      onChange={(e) => setResolutionNotes(e.target.value)}
                      required
                    ></textarea>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeResolveModal}
                    disabled={actionLoading}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn btn-success"
                    disabled={actionLoading}
                  >
                    {actionLoading ? "Resolving..." : "Resolve Alert"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showAuditModal && selectedAlert && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Alert Audit Trail #{selectedAlert.id}
                </h5>

                <button
                  type="button"
                  className="btn-close"
                  onClick={closeAuditModal}
                  disabled={actionLoading}
                ></button>
              </div>

              <div className="modal-body">
                {auditRecords.length === 0 ? (
                  <div className="alert alert-warning mb-0">
                    No audit records found for this alert.
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-striped table-hover align-middle">
                      <thead className="table-dark">
                        <tr>
                          <th>Action</th>
                          <th>Performed By</th>
                          <th>Notes</th>
                          <th>Created</th>
                        </tr>
                      </thead>

                      <tbody>
                        {auditRecords.map((record) => (
                          <tr key={record.id}>
                            <td>{record.action}</td>
                            <td>{record.performed_by || "N/A"}</td>
                            <td>{record.notes || "N/A"}</td>
                            <td>{formatDateTime(record.created_at)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeAuditModal}
                  disabled={actionLoading}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Alerts;