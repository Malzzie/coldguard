// Reporting service
// Communicates with Sprint 6 reporting endpoints.

import { API_BASE_URL } from "../config";

// Helper function to handle API responses
async function handleResponse(response, errorMessage) {
  if (!response.ok) {
    throw new Error(errorMessage);
  }

  return await response.json();
}

// Dashboard report
// Returns a summary of key metrics, including total inventory, alerts, and temperature compliance.
export async function getDashboardReport() {
  const response = await fetch(`${API_BASE_URL}/reports/dashboard`);
  return handleResponse(response, "Failed to load dashboard report.");
}

// Inventory report
// Returns a summary of the current inventory status, including total items, categories, and stock levels.
export async function getInventoryReport() {
  const response = await fetch(`${API_BASE_URL}/reports/inventory`);
  return handleResponse(response, "Failed to load inventory report.");
}

// Low Stock report
// Returns a list of inventory items that are below the specified stock threshold.
export async function getLowStockReport(threshold = 20) {
  const response = await fetch(
    `${API_BASE_URL}/reports/low-stock?threshold=${threshold}`
  );

  return handleResponse(response, "Failed to load low stock report.");
}

// Temperature Compliance report
// Returns a list of temperature logs that are out of compliance with the set thresholds.
export async function getTemperatureReport() {
  const response = await fetch(
    `${API_BASE_URL}/reports/temperature-compliance`
  );

  return handleResponse(response, "Failed to load temperature report.");
}

// Movement Audit report
// Returns a list of all inventory movements with timestamps and user actions.
export async function getMovementReport() {
  const response = await fetch(`${API_BASE_URL}/reports/movement-audit`);
  return handleResponse(response, "Failed to load movement report.");
}

// Alert Activity report
// Returns a list of all alerts with their status and timestamps.
export async function getAlertReport() {
  const response = await fetch(`${API_BASE_URL}/reports/alert-activity`);
  return handleResponse(response, "Failed to load alert report.");
}

// Expiry Management report
// Returns inventory approaching expiry together with expiry statistics.
export async function getExpiryManagementReport(days = 30) {
  const response = await fetch(
    `${API_BASE_URL}/reports/expiry-management?days=${days}`
  );

  return handleResponse(
    response,
    "Failed to load expiry management report."
  );
}