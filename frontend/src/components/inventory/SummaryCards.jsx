// Inventory summary cards component
// This component displays high-level operational inventory metrics.
// These cards help users quickly understand the current warehouse status.

function SummaryCards({ summary }) {
  // If summary data has not been loaded yet, render nothing.
  // This prevents empty or incorrect cards from showing.
  if (!summary) {
    return null;
  }

  return (
    <div className="row mb-4">
      {/* Total number of unique inventory products */}
      <div className="col-md-3 mb-3">
        <div className="card shadow-sm h-100">
          <div className="card-body text-center">
            <h6 className="text-muted">Total Products</h6>
            <h2>{summary.total_products}</h2>
          </div>
        </div>
      </div>

      {/* Total stock quantity across all inventory items */}
      <div className="col-md-3 mb-3">
        <div className="card shadow-sm h-100">
          <div className="card-body text-center">
            <h6 className="text-muted">Total Stock</h6>
            <h2>{summary.total_stock}</h2>
          </div>
        </div>
      </div>

      {/* Number of items with quantity at or below the low-stock threshold */}
      <div className="col-md-3 mb-3">
        <div className="card shadow-sm h-100">
          <div className="card-body text-center">
            <h6 className="text-muted">Low Stock Items</h6>
            <h2>{summary.low_stock_count}</h2>
          </div>
        </div>
      </div>

      {/* Number of expired products.
          This will become meaningful once expiry dates are added to inventory. */}
      <div className="col-md-3 mb-3">
        <div className="card shadow-sm h-100">
          <div className="card-body text-center">
            <h6 className="text-muted">Expired Products</h6>
            <h2>{summary.expired_product_count}</h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SummaryCards;