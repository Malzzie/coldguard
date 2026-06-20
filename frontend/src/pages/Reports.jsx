// Reports Dashboard page
// Displays reporting information.

import { useEffect, useState } from "react";

import {
  getDashboardReport,
  getInventoryReport,
  getTemperatureReport,
  getMovementReport,
  getAlertReport,
} from "../services/reportService";

import Navbar from "../components/Navbar";

function Reports() {

  const [dashboard, setDashboard] = useState(null);
  const [inventory, setInventory] = useState(null);
  const [temperature, setTemperature] = useState(null);
  const [movement, setMovement] = useState(null);
  const [alerts, setAlerts] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  // Load all reporting data
  const loadReports = async () => {

    try {

      const dashboardData =
        await getDashboardReport();

      const inventoryData =
        await getInventoryReport();

      const temperatureData =
        await getTemperatureReport();

      const movementData =
        await getMovementReport();

      const alertData =
        await getAlertReport();

      setDashboard(dashboardData);
      setInventory(inventoryData);
      setTemperature(temperatureData);
      setMovement(movementData);
      setAlerts(alertData);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-4">
        Loading reports...
      </div>
    );
  }

  return (
    <div className="container mt-4">

         <Navbar />

      <h1 className="mb-4">
        Reports Dashboard
      </h1>

      {/* Dashboard Summary */}
      {dashboard && (
        <div className="row justify-content-center mb-4 g-3">

          <div className="col-md-2">
            <div className="card shadow-sm">
              <div className="card-body">
                <h6>Inventory</h6>
                <h3>{dashboard.inventory_items}</h3>
              </div>
            </div>
          </div>

          <div className="col-md-2">
            <div className="card shadow-sm">
              <div className="card-body">
                <h6>Movements</h6>
                <h3>{dashboard.inventory_movements}</h3>
              </div>
            </div>
          </div>

          <div className="col-md-2">
            <div className="card shadow-sm">
              <div className="card-body">
                <h6>Logs</h6>
                <h3>{dashboard.temperature_logs}</h3>
              </div>
            </div>
          </div>

          <div className="col-md-2">
            <div className="card shadow-sm">
              <div className="card-body">
                <h6>Alerts</h6>
                <h3>{dashboard.total_alerts}</h3>
              </div>
            </div>
          </div>

          <div className="col-md-2">
            <div className="card shadow-sm">
              <div className="card-body">
                <h6>Open Alerts</h6>
                <h3>{dashboard.open_alerts}</h3>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Report Results */}

      <div className="card shadow-sm mb-3">
        <div className="card-body">
          <h4>Inventory Summary</h4>
          <p>Total Items: {inventory?.total_items}</p>
          <p>Total Quantity: {inventory?.total_quantity}</p>
        </div>
      </div>

      <div className="card shadow-sm mb-3">
        <div className="card-body">
          <h4>Temperature Compliance</h4>
          <p>Total Readings: {temperature?.total_readings}</p>
          <p>Compliance: {temperature?.compliance_percentage}%</p>
        </div>
      </div>

      <div className="card shadow-sm mb-3">
        <div className="card-body">
          <h4>Movement Audit</h4>
          <p>Total Movements: {movement?.total_movements}</p>
          <p>Stock In: {movement?.stock_in_transactions}</p>
          <p>Stock Out: {movement?.stock_out_transactions}</p>
        </div>
      </div>

      <div className="card shadow-sm mb-3">
        <div className="card-body">
          <h4>Alert Activity</h4>
          <p>Total Alerts: {alerts?.total_alerts}</p>
          <p>Open Alerts: {alerts?.open_alerts}</p>
          <p>Resolved Alerts: {alerts?.resolved_alerts}</p>
        </div>
      </div>

    </div>
  );
}

export default Reports;