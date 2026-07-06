// Inventory toolbar component
// This component contains the main inventory action controls.

function InventoryToolbar({
  searchTerm,
  setSearchTerm,
  categoryFilter,
  setCategoryFilter,
  categories,
  openAddModal,
  handleExportCsv,
}) {
  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body py-3">
        <div className="row align-items-end g-3">
          {/* Opens the add inventory modal */}
          <div className="col-xl-2 col-lg-3 col-md-6">
            <button className="btn btn-primary w-100" onClick={openAddModal}>
              + Add Inventory Item
            </button>
          </div>

          {/* Search field used to filter inventory by item name, SKU, category or zone */}
          <div className="col-xl-5 col-lg-4 col-md-6">
            <label className="form-label">Search Inventory</label>
            <input
              className="form-control"
              placeholder="Search by item, SKU, category or storage zone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Category filter dropdown built from the current inventory categories */}
          <div className="col-xl-3 col-lg-3 col-md-6">
            <label className="form-label">Category Filter</label>
            <select
              className="form-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>

              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Exports the currently filtered inventory table to CSV */}
          <div className="col-xl-2 col-lg-2 col-md-6">
            <button
              className="btn btn-outline-success w-100"
              onClick={handleExportCsv}
            >
              Export CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InventoryToolbar;