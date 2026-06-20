// Inventory Dashboard page
// This page displays inventory summary cards and inventory table data.

import { useEffect, useState } from "react";
import {
  getInventoryItems,
  getDashboardSummary,
} from "../services/inventoryService";

import Navbar from "../components/Navbar";

function Dashboard() {
  // Stores all inventory items returned from the backend
  const [inventory, setInventory] = useState([]);

  // Stores dashboard summary values returned from the backend
  const [summary, setSummary] = useState(null);

  // Stores loading state while data is being fetched
  const [loading, setLoading] = useState(true);

  // Stores error messages if the backend request fails
  const [error, setError] = useState("");

  // Load inventory data when the dashboard page opens
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Fetch inventory items and dashboard summary from the backend
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const inventoryData = await getInventoryItems();
      const summaryData = await getDashboardSummary();

      setInventory(inventoryData);
      setSummary(summaryData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Show loading message while the dashboard data is loading
  if (loading) {
    return (
      <div className="container mt-4">
        <p>Loading inventory dashboard...</p>
      </div>
    );
  }

  // Show error message if dashboard data cannot be loaded
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
      <h1 className="mb-4">Inventory Dashboard</h1>

      {/* Summary cards */}
      {summary && (
        <div className="row mb-4">
          <div className="col-md-3">
            <div className="card shadow-sm">
              <div className="card-body">
                <h6>Total Products</h6>
                <h2>{summary.total_products}</h2>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card shadow-sm">
              <div className="card-body">
                <h6>Total Stock</h6>
                <h2>{summary.total_stock}</h2>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card shadow-sm">
              <div className="card-body">
                <h6>Low Stock Items</h6>
                <h2>{summary.low_stock_count}</h2>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card shadow-sm">
              <div className="card-body">
                <h6>Expired Products</h6>
                <h2>{summary.expired_product_count}</h2>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Inventory table */}
      <div className="card shadow-sm">
        <div className="card-body">
          <h4 className="mb-3">Inventory Items</h4>

          {inventory.length === 0 ? (
            <p>No inventory items found.</p>
          ) : (
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>SKU</th>
                  <th>Item Name</th>
                  <th>Category</th>
                  <th>Quantity</th>
                </tr>
              </thead>

              <tbody>
                {inventory.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.sku}</td>
                    <td>{item.item_name}</td>
                    <td>{item.category}</td>
                    <td>{item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;