// Inventory modal component
// This component is reused for both creating and updating inventory items.

function InventoryModal({
  showModal,
  editingItemId,
  formData,
  setFormData,
  closeModal,
  handleSaveItem,
  actionLoading,
}) {
  // If the modal should not be visible, render nothing.
  if (!showModal) {
    return null;
  }

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      role="dialog"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <form onSubmit={handleSaveItem}>
            <div className="modal-header">
              <h5 className="modal-title">
                {editingItemId ? "Edit Inventory Item" : "Add Inventory Item"}
              </h5>

              <button
                type="button"
                className="btn-close"
                onClick={closeModal}
                disabled={actionLoading}
              ></button>
            </div>

            <div className="modal-body">
              <div className="row">
                {/* Item name */}
                <div className="col-md-4 mb-3">
                  <label className="form-label">Item Name</label>
                  <input
                    className="form-control"
                    value={formData.item_name}
                    onChange={(e) =>
                      setFormData({ ...formData, item_name: e.target.value })
                    }
                    required
                  />
                </div>

                {/* SKU */}
                <div className="col-md-4 mb-3">
                  <label className="form-label">SKU</label>
                  <input
                    className="form-control"
                    value={formData.sku}
                    onChange={(e) =>
                      setFormData({ ...formData, sku: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Category */}
                <div className="col-md-4 mb-3">
                  <label className="form-label">Category</label>
                  <input
                    className="form-control"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Quantity */}
                <div className="col-md-3 mb-3">
                  <label className="form-label">Quantity</label>
                  <input
                    type="number"
                    min="0"
                    className="form-control"
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({ ...formData, quantity: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Storage Zone */}
                <div className="col-md-3 mb-3">
                  <label className="form-label">Storage Zone</label>
                  <input
                    className="form-control"
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

                {/* Minimum Temperature */}
                <div className="col-md-3 mb-3">
                  <label className="form-label">Minimum Temp</label>
                  <input
                    type="number"
                    step="0.1"
                    className="form-control"
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

                {/* Maximum Temperature */}
                <div className="col-md-3 mb-3">
                  <label className="form-label">Maximum Temp</label>
                  <input
                    type="number"
                    step="0.1"
                    className="form-control"
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

                {/* Expiry Date */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Expiry Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={formData.expiry_date || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        expiry_date: e.target.value,
                      })
                    }
                  />
                </div>
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
                  : editingItemId
                  ? "Save Changes"
                  : "Add Item"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default InventoryModal;