// Temperature Thresholds page
// This page allows administrators to configure acceptable temperature ranges
// for each warehouse storage zone.

import { useEffect, useMemo, useState } from "react";
import {
  getTemperatureThresholds,
  createTemperatureThreshold,
  updateTemperatureThreshold,
  deleteTemperatureThreshold,
} from "../services/thresholdService";

import Navbar from "../components/Navbar";

function Thresholds() {
  // Default empty form used for both add and edit mode.
  const emptyForm = {
    storage_zone: "",
    minimum_temperature: "",
    maximum_temperature: "",
  };

  // Stores all threshold records returned from the backend.
  const [thresholds, setThresholds] = useState([]);

  // Stores form values for create/update actions.
  const [formData, setFormData] = useState(emptyForm);

  // Stores the selected threshold ID when editing.
  const [editingThresholdId, setEditingThresholdId] = useState(null);

  // Stores search text used to filter threshold records.
  const [searchTerm, setSearchTerm] = useState("");

  // Controls modal visibility.
  const [showModal, setShowModal] = useState(false);

  // Stores loading and action state.
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Stores user feedback messages.
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Load threshold data when the page opens.
  useEffect(() => {
    loadThresholds();
  }, []);

  // Automatically clear feedback messages after a short delay.
  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        setError("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [successMessage, error]);

  // Retrieve all threshold records from the backend.
  const loadThresholds = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getTemperatureThresholds();

      setThresholds(data);
    } catch (err) {
      setError(err.message || "Failed to load thresholds.");
    } finally {
      setLoading(false);
    }
  };

  // Open modal in add mode.
  const openAddModal = () => {
    setEditingThresholdId(null);
    setFormData(emptyForm);
    setShowModal(true);
  };

  // Open modal in edit mode and populate form with selected threshold.
  const openEditModal = (threshold) => {
    setEditingThresholdId(threshold.id);

    setFormData({
      storage_zone: threshold.storage_zone || "",
      minimum_temperature: threshold.minimum_temperature ?? "",
      maximum_temperature: threshold.maximum_temperature ?? "",
    });

    setShowModal(true);
  };

  // Close modal and reset form state.
  const closeModal = () => {
    setShowModal(false);
    setEditingThresholdId(null);
    setFormData(emptyForm);
  };

  // Save a new threshold or update an existing threshold.
  const handleSaveThreshold = async (e) => {
    e.preventDefault();

    try {
      setActionLoading(true);
      setError("");
      setSuccessMessage("");

      const payload = {
        storage_zone: formData.storage_zone,
        minimum_temperature: Number(formData.minimum_temperature),
        maximum_temperature: Number(formData.maximum_temperature),
      };

      if (editingThresholdId) {
        await updateTemperatureThreshold(editingThresholdId, payload);
        setSuccessMessage("Threshold updated successfully.");
      } else {
        await createTemperatureThreshold(payload);
        setSuccessMessage("Threshold created successfully.");
      }

      closeModal();
      await loadThresholds();
    } catch (err) {
      setError(err.message || "Failed to save threshold.");
    } finally {
      setActionLoading(false);
    }
  };

  // Delete a threshold after user confirmation.
  const handleDeleteThreshold = async (thresholdId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this threshold?"
    );

    if (!confirmDelete) return;

    try {
      setActionLoading(true);
      setError("");
      setSuccessMessage("");

      await deleteTemperatureThreshold(thresholdId);

      setSuccessMessage("Threshold deleted successfully.");
      await loadThresholds();
    } catch (err) {
      setError(err.message || "Failed to delete threshold.");
    } finally {
      setActionLoading(false);
    }
  };

  // Filter thresholds by storage zone or temperature values.
  const filteredThresholds = useMemo(() => {
    return thresholds.filter((threshold) => {
      const searchText = searchTerm.toLowerCase();

      return (
        threshold.storage_zone?.toLowerCase().includes(searchText) ||
        String(threshold.minimum_temperature).includes(searchText) ||
        String(threshold.maximum_temperature).includes(searchText)
      );
    });
  }, [thresholds, searchTerm]);

  // Dashboard summary values.
  const totalThresholds = thresholds.length;

  const frozenZones = thresholds.filter((threshold) =>
    threshold.storage_zone?.toLowerCase().includes("frozen")
  ).length;

  const chilledZones = thresholds.filter((threshold) =>
    threshold.storage_zone?.toLowerCase().includes("chilled")
  ).length;

  const pharmaceuticalZones = thresholds.filter((threshold) =>
    threshold.storage_zone?.toLowerCase().includes("pharmaceutical")
  ).length;

  if (loading) {
    return (
      <div className="container-fluid px-2 px-xl-4 mt-3">
        <Navbar />

        <div className="d-flex justify-content-center align-items-center mt-5">
          <div className="spinner-border me-3" role="status"></div>
          <span>Loading threshold configuration...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid px-2 px-xl-4 mt-3">
      <Navbar />

      <div className="text-center mb-4">
        <h1 className="mb-1">Temperature Thresholds</h1>
        <p className="text-muted mb-0">
          Configure acceptable temperature ranges for warehouse storage zones.
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
              <h6>Total Thresholds</h6>
              <h2>{totalThresholds}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <h6>Frozen Zones</h6>
              <h2>{frozenZones}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <h6>Chilled Zones</h6>
              <h2>{chilledZones}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <h6>Pharmaceutical Zones</h6>
              <h2>{pharmaceuticalZones}</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-body py-3">
          <div className="row align-items-end g-3">
            <div className="col-xl-3 col-lg-3 col-md-6">
              <button className="btn btn-primary w-100" onClick={openAddModal}>
                + Add Threshold
              </button>
            </div>

            <div className="col-xl-9 col-lg-9 col-md-6">
              <label className="form-label">Search Thresholds</label>
              <input
                className="form-control"
                placeholder="Search by storage zone or temperature value..."
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
            <h4 className="mb-1">Threshold Configuration</h4>
            <p className="text-muted mb-0">
              Showing {filteredThresholds.length} of {thresholds.length}{" "}
              thresholds.
            </p>
          </div>

          {filteredThresholds.length === 0 ? (
            <div className="alert alert-warning mb-0">
              No thresholds found.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover align-middle mb-0">
                <thead className="table-dark">
                  <tr>
                    <th>Storage Zone</th>
                    <th>Minimum Temperature</th>
                    <th>Maximum Temperature</th>
                    <th>Configured At</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredThresholds.map((threshold) => (
                    <tr key={threshold.id}>
                      <td className="fw-semibold">{threshold.storage_zone}</td>
                      <td>{threshold.minimum_temperature}°C</td>
                      <td>{threshold.maximum_temperature}°C</td>
                      <td>
                        {threshold.created_at
                          ? new Date(threshold.created_at).toLocaleString()
                          : "N/A"}
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-outline-primary btn-sm px-3"
                            onClick={() => openEditModal(threshold)}
                            disabled={actionLoading}
                          >
                            Edit
                          </button>

                          <button
                            className="btn btn-outline-danger btn-sm px-3"
                            onClick={() =>
                              handleDeleteThreshold(threshold.id)
                            }
                            disabled={actionLoading}
                          >
                            Delete
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

      {showModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog modal-md modal-dialog-centered">
            <div className="modal-content">
              <form onSubmit={handleSaveThreshold}>
                <div className="modal-header">
                  <h5 className="modal-title">
                    {editingThresholdId ? "Edit Threshold" : "Add Threshold"}
                  </h5>

                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeModal}
                    disabled={actionLoading}
                  ></button>
                </div>

                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Storage Zone</label>
                    <input
                      className="form-control"
                      placeholder="Example: Frozen Storage"
                      value={formData.storage_zone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          storage_zone: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Minimum Temperature</label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-control"
                      placeholder="Example: -25"
                      value={formData.minimum_temperature}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          minimum_temperature: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Maximum Temperature</label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-control"
                      placeholder="Example: -18"
                      value={formData.maximum_temperature}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          maximum_temperature: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="alert alert-info mb-0">
                    These thresholds are used to validate simulated IoT sensor
                    readings and automatically generate alerts when readings are
                    too high or too low.
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
                    {actionLoading
                      ? "Saving..."
                      : editingThresholdId
                      ? "Save Changes"
                      : "Add Threshold"}
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

export default Thresholds;