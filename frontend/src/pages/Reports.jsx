// Reports Dashboard page
// This page provides management-level reporting for ColdGuard operations.
// It consolidates inventory, low stock, temperature, movement, and alert reports.

import { useEffect, useMemo, useState } from "react";

import {
  getDashboardReport,
  getInventoryReport,
  getLowStockReport,
  getTemperatureReport,
  getMovementReport,
  getAlertReport,
} from "../services/reportService";

import Navbar from "../components/Navbar";

function Reports() {
  const [dashboard, setDashboard] = useState(null);
  const [inventory, setInventory] = useState(null);
  const [lowStock, setLowStock] = useState(null);
  const [temperature, setTemperature] = useState(null);
  const [movement, setMovement] = useState(null);
  const [alerts, setAlerts] = useState(null);

  const [activeReport, setActiveReport] = useState("inventory");
  const [searchTerm, setSearchTerm] = useState("");
  const [lowStockThreshold, setLowStockThreshold] = useState(20);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      setError("");

      const dashboardData = await getDashboardReport();
      const inventoryData = await getInventoryReport();
      const lowStockData = await getLowStockReport(lowStockThreshold);
      const temperatureData = await getTemperatureReport();
      const movementData = await getMovementReport();
      const alertData = await getAlertReport();

      setDashboard(dashboardData);
      setInventory(inventoryData);
      setLowStock(lowStockData);
      setTemperature(temperatureData);
      setMovement(movementData);
      setAlerts(alertData);
    } catch (err) {
      setError(err.message || "Failed to load reports.");
    } finally {
      setLoading(false);
    }
  };

  const refreshLowStockReport = async () => {
    try {
      setActionLoading(true);
      setError("");

      const data = await getLowStockReport(lowStockThreshold);

      setLowStock(data);
      setActiveReport("low-stock");
    } catch (err) {
      setError(err.message || "Failed to refresh low stock report.");
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (value) => {
    if (!value) {
      return "N/A";
    }

    return new Date(value).toLocaleString();
  };

  const formatExpiryDate = (value) => {
    if (!value) {
      return "N/A";
    }

    return value.split("T")[0];
  };

  const filteredInventory = useMemo(() => {
    const items = inventory?.inventory || [];
    const searchText = searchTerm.toLowerCase();

    return items.filter(
      (item) =>
        item.item_name?.toLowerCase().includes(searchText) ||
        item.sku?.toLowerCase().includes(searchText) ||
        item.category?.toLowerCase().includes(searchText) ||
        item.storage_zone?.toLowerCase().includes(searchText)
    );
  }, [inventory, searchTerm]);

  const filteredLowStock = useMemo(() => {
    const items = lowStock?.inventory || [];
    const searchText = searchTerm.toLowerCase();

    return items.filter(
      (item) =>
        item.item_name?.toLowerCase().includes(searchText) ||
        item.sku?.toLowerCase().includes(searchText) ||
        item.category?.toLowerCase().includes(searchText) ||
        item.storage_zone?.toLowerCase().includes(searchText)
    );
  }, [lowStock, searchTerm]);

  const filteredMovements = useMemo(() => {
    const items = movement?.movements || [];
    const searchText = searchTerm.toLowerCase();

    return items.filter(
      (item) =>
        String(item.id).includes(searchText) ||
        String(item.inventory_item_id).includes(searchText) ||
        item.movement_type?.toLowerCase().includes(searchText) ||
        item.reference?.toLowerCase().includes(searchText)
    );
  }, [movement, searchTerm]);

  const filteredAlerts = useMemo(() => {
    const items = alerts?.alerts || [];
    const searchText = searchTerm.toLowerCase();

    return items.filter(
      (alert) =>
        String(alert.id).includes(searchText) ||
        alert.storage_zone?.toLowerCase().includes(searchText) ||
        alert.severity?.toLowerCase().includes(searchText) ||
        alert.status?.toLowerCase().includes(searchText) ||
        String(alert.temperature).includes(searchText)
    );
  }, [alerts, searchTerm]);

  const exportCsv = () => {
    let headers = [];
    let rows = [];
    let filename = "coldguard_report.csv";

    if (activeReport === "inventory") {
      headers = ["SKU", "Item Name", "Category", "Zone", "Quantity", "Expiry"];
      rows = filteredInventory.map((item) => [
        item.sku,
        item.item_name,
        item.category,
        item.storage_zone,
        item.quantity,
        formatExpiryDate(item.expiry_date),
      ]);
      filename = "coldguard_inventory_report.csv";
    }

    if (activeReport === "low-stock") {
      headers = ["SKU", "Item Name", "Category", "Zone", "Quantity"];
      rows = filteredLowStock.map((item) => [
        item.sku,
        item.item_name,
        item.category,
        item.storage_zone,
        item.quantity,
      ]);
      filename = "coldguard_low_stock_report.csv";
    }

    if (activeReport === "temperature") {
      headers = [
        "Total Readings",
        "Normal",
        "High Violations",
        "Low Violations",
        "Compliance %",
      ];
      rows = [
        [
          temperature?.total_readings,
          temperature?.normal_readings,
          temperature?.high_violations,
          temperature?.low_violations,
          temperature?.compliance_percentage,
        ],
      ];
      filename = "coldguard_temperature_compliance_report.csv";
    }

    if (activeReport === "movement") {
      headers = ["ID", "Inventory Item ID", "Movement Type", "Quantity", "Reference", "Created"];
      rows = filteredMovements.map((item) => [
        item.id,
        item.inventory_item_id,
        item.movement_type,
        item.quantity,
        item.reference,
        formatDate(item.created_at),
      ]);
      filename = "coldguard_movement_audit_report.csv";
    }

    if (activeReport === "alerts") {
      headers = ["ID", "Storage Zone", "Temperature", "Severity", "Status", "Created"];
      rows = filteredAlerts.map((alert) => [
        alert.id,
        alert.storage_zone,
        alert.temperature,
        alert.severity,
        alert.status,
        formatDate(alert.created_at),
      ]);
      filename = "coldguard_alert_activity_report.csv";
    }

    const csvContent = [headers, ...rows]
      .map((row) => row.map((value) => `"${value ?? ""}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="container-fluid px-2 px-xl-4 mt-3">
        <Navbar />

        <div className="d-flex justify-content-center align-items-center mt-5">
          <div className="spinner-border me-3" role="status"></div>
          <span>Loading reports...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid px-2 px-xl-4 mt-3">
      <Navbar />

      <div className="text-center mb-4">
        <h1 className="mb-1">Reports Dashboard</h1>
        <p className="text-muted mb-0">
          Review warehouse performance, compliance, stock activity and alerts.
        </p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {actionLoading && (
        <div className="alert alert-info">Processing request...</div>
      )}

      {dashboard && (
        <div className="row mb-4">
          <div className="col-md-2 mb-3">
            <div className="card shadow-sm h-100">
              <div className="card-body text-center">
                <h6>Inventory</h6>
                <h2>{dashboard.inventory_items}</h2>
              </div>
            </div>
          </div>

          <div className="col-md-2 mb-3">
            <div className="card shadow-sm h-100">
              <div className="card-body text-center">
                <h6>Movements</h6>
                <h2>{dashboard.inventory_movements}</h2>
              </div>
            </div>
          </div>

          <div className="col-md-2 mb-3">
            <div className="card shadow-sm h-100">
              <div className="card-body text-center">
                <h6>Temp Logs</h6>
                <h2>{dashboard.temperature_logs}</h2>
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div className="card shadow-sm h-100">
              <div className="card-body text-center">
                <h6>Total Alerts</h6>
                <h2>{dashboard.total_alerts}</h2>
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div className="card shadow-sm h-100">
              <div className="card-body text-center">
                <h6>Open Alerts</h6>
                <h2>{dashboard.open_alerts}</h2>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="row align-items-end g-3">
            <div className="col-xl-3 col-lg-4 col-md-6">
              <label className="form-label">Report Type</label>
              <select
                className="form-select"
                value={activeReport}
                onChange={(e) => {
                  setActiveReport(e.target.value);
                  setSearchTerm("");
                }}
              >
                <option value="inventory">Inventory Summary</option>
                <option value="low-stock">Low Stock Report</option>
                <option value="temperature">Temperature Compliance</option>
                <option value="movement">Movement Audit</option>
                <option value="alerts">Alert Activity</option>
              </select>
            </div>

            <div className="col-xl-5 col-lg-4 col-md-6">
              <label className="form-label">Search Report</label>
              <input
                className="form-control"
                placeholder="Search current report..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={activeReport === "temperature"}
              />
            </div>

            <div className="col-xl-2 col-lg-2 col-md-6">
              <label className="form-label">Low Stock Limit</label>
              <input
                type="number"
                className="form-control"
                value={lowStockThreshold}
                onChange={(e) => setLowStockThreshold(e.target.value)}
              />
            </div>

            <div className="col-xl-1 col-lg-1 col-md-3">
              <button
                className="btn btn-outline-primary w-100"
                onClick={refreshLowStockReport}
              >
                Apply
              </button>
            </div>

            <div className="col-xl-1 col-lg-1 col-md-3">
              <button className="btn btn-outline-success w-100" onClick={exportCsv}>
                CSV
              </button>
            </div>
          </div>
        </div>
      </div>

      {activeReport === "inventory" && (
        <ReportCard title="Inventory Summary">
          <p className="text-muted">
            Total Items: {inventory?.total_items} | Total Quantity:{" "}
            {inventory?.total_quantity}
          </p>

          <ReportTable
            headers={["SKU", "Item Name", "Category", "Zone", "Quantity", "Expiry"]}
            rows={filteredInventory.map((item) => [
              item.sku,
              item.item_name,
              item.category,
              item.storage_zone,
              item.quantity,
              formatExpiryDate(item.expiry_date),
            ])}
          />
        </ReportCard>
      )}

      {activeReport === "low-stock" && (
        <ReportCard title="Low Stock Report">
          <p className="text-muted">
            Threshold: {lowStock?.threshold} | Items Found:{" "}
            {lowStock?.items_found}
          </p>

          <ReportTable
            headers={["SKU", "Item Name", "Category", "Zone", "Quantity"]}
            rows={filteredLowStock.map((item) => [
              item.sku,
              item.item_name,
              item.category,
              item.storage_zone,
              item.quantity,
            ])}
          />
        </ReportCard>
      )}

      {activeReport === "temperature" && (
        <ReportCard title="Temperature Compliance">
          <h5>Compliance Rate: {temperature?.compliance_percentage}%</h5>

          <div className="progress mb-3" style={{ height: "24px" }}>
            <div
              className="progress-bar"
              style={{ width: `${temperature?.compliance_percentage || 0}%` }}
            >
              {temperature?.compliance_percentage}%
            </div>
          </div>

          <ReportTable
            headers={[
              "Total Readings",
              "Normal",
              "High Violations",
              "Low Violations",
              "Compliance %",
            ]}
            rows={[
              [
                temperature?.total_readings,
                temperature?.normal_readings,
                temperature?.high_violations,
                temperature?.low_violations,
                temperature?.compliance_percentage,
              ],
            ]}
          />
        </ReportCard>
      )}

      {activeReport === "movement" && (
        <ReportCard title="Movement Audit">
          <p className="text-muted">
            Total Movements: {movement?.total_movements} | Stock In:{" "}
            {movement?.stock_in_transactions} | Stock Out:{" "}
            {movement?.stock_out_transactions}
          </p>

          <ReportTable
            headers={[
              "ID",
              "Inventory Item ID",
              "Movement Type",
              "Quantity",
              "Reference",
              "Created",
            ]}
            rows={filteredMovements.map((item) => [
              item.id,
              item.inventory_item_id,
              item.movement_type,
              item.quantity,
              item.reference || "N/A",
              formatDate(item.created_at),
            ])}
          />
        </ReportCard>
      )}

      {activeReport === "alerts" && (
        <ReportCard title="Alert Activity">
          <p className="text-muted">
            Total Alerts: {alerts?.total_alerts} | Open: {alerts?.open_alerts} |
            Acknowledged: {alerts?.acknowledged_alerts} | Resolved:{" "}
            {alerts?.resolved_alerts}
          </p>

          <ReportTable
            headers={["ID", "Zone", "Temperature", "Severity", "Status", "Created"]}
            rows={filteredAlerts.map((alert) => [
              alert.id,
              alert.storage_zone,
              `${alert.temperature}°C`,
              alert.severity,
              alert.status,
              formatDate(alert.created_at),
            ])}
          />
        </ReportCard>
      )}
    </div>
  );
}

function ReportCard({ title, children }) {
  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h4 className="mb-3">{title}</h4>
        {children}
      </div>
    </div>
  );
}

function ReportTable({ headers, rows }) {
  if (!rows || rows.length === 0) {
    return <div className="alert alert-warning mb-0">No report data found.</div>;
  }

  return (
    <div className="table-responsive mt-3">
      <table className="table table-striped table-hover align-middle mb-0">
        <thead className="table-dark">
          <tr>
            {headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={`${rowIndex}-${cellIndex}`}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Reports;