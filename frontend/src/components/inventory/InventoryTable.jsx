// Inventory table component
// This component displays inventory records in a professional table.

function InventoryTable({
  inventory,
  totalInventoryCount,
  stockAdjustments,
  actionLoading,
  handleStockInputChange,
  handleIncreaseStock,
  handleDecreaseStock,
  openEditModal,
  handleDeleteItem,
}) {
  // Format expiry date from ISO format into YYYY-MM-DD.
  const formatExpiryDate = (expiryDate) => {
    if (!expiryDate) {
      return "No expiry date";
    }

    return expiryDate.split("T")[0];
  };

  // Calculate expiry status for display.
  const getExpiryStatus = (expiryDate) => {
    if (!expiryDate) {
      return {
        label: "No Date",
        className: "badge bg-secondary",
      };
    }

    const today = new Date();
    const expiry = new Date(expiryDate);
    const thirtyDaysFromNow = new Date();

    thirtyDaysFromNow.setDate(today.getDate() + 30);

    if (expiry < today) {
      return {
        label: "Expired",
        className: "badge bg-danger",
      };
    }

    if (expiry <= thirtyDaysFromNow) {
      return {
        label: "Expiring Soon",
        className: "badge bg-warning text-dark",
      };
    }

    return {
      label: "Fresh",
      className: "badge bg-success",
    };
  };

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h4 className="mb-1">Inventory Items</h4>
            <p className="text-muted mb-0">
              Showing {inventory.length} of {totalInventoryCount} items.
            </p>
          </div>
        </div>

        {inventory.length === 0 ? (
          <div className="alert alert-warning mb-0">
            No inventory items found.
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
                  <th style={{ minWidth: "110px" }}>SKU</th>
                  <th style={{ minWidth: "170px" }}>Item Name</th>
                  <th style={{ minWidth: "160px" }}>Category</th>
                  <th style={{ minWidth: "150px" }}>Zone</th>
                  <th style={{ minWidth: "100px" }}>Qty</th>
                  <th style={{ minWidth: "160px" }}>Temp Range</th>
                  <th style={{ minWidth: "170px" }}>Expiry</th>
                  <th style={{ minWidth: "210px" }}>Stock Action</th>
                  <th style={{ minWidth: "160px" }}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {inventory.map((item) => {
                  const expiryStatus = getExpiryStatus(item.expiry_date);

                  return (
                    <tr key={item.id}>
                      <td className="fw-semibold">{item.sku}</td>
                      <td>{item.item_name}</td>
                      <td>{item.category}</td>
                      <td>{item.storage_zone}</td>

                      <td>
                        <span
                          className={
                            item.quantity <= 10
                              ? "badge bg-danger px-3 py-2"
                              : item.quantity <= 20
                              ? "badge bg-warning text-dark px-3 py-2"
                              : "badge bg-success px-3 py-2"
                          }
                        >
                          {item.quantity}
                        </span>
                      </td>

                      <td>
                        {item.minimum_temperature}°C to{" "}
                        {item.maximum_temperature}°C
                      </td>

                      <td>
                        <div className="d-flex flex-column gap-1">
                          <span>{formatExpiryDate(item.expiry_date)}</span>
                          <span className={`${expiryStatus.className} w-fit`}>
                            {expiryStatus.label}
                          </span>
                        </div>
                      </td>

                      <td>
                        <div className="d-flex align-items-center gap-2">

                            <input
                                type="number"
                                min="1"
                                className="form-control form-control-sm"
                                style={{ width: "85px" }}
                                placeholder="Qty"
                                value={stockAdjustments[item.id] || ""}
                                onChange={(e) =>
                                    handleStockInputChange(item.id, e.target.value)
                                }
                            />

                            <button
                                className="btn btn-outline-success btn-sm"
                                style={{ minWidth: "38px" }}
                                type="button"
                                onClick={() => handleIncreaseStock(item.id)}
                                disabled={actionLoading}
                            >
                                +
                            </button>

                            <button
                                className="btn btn-outline-warning btn-sm"
                                style={{ minWidth: "38px" }}
                                type="button"
                                onClick={() => handleDecreaseStock(item.id)}
                                disabled={actionLoading}
                            >
                                 −
                            </button>

                            </div>
                      </td>

                      <td>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-outline-primary btn-sm px-3"
                            onClick={() => openEditModal(item)}
                            disabled={actionLoading}
                          >
                            Edit
                          </button>

                          <button
                            className="btn btn-outline-danger btn-sm px-3"
                            onClick={() => handleDeleteItem(item.id)}
                            disabled={actionLoading}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default InventoryTable;