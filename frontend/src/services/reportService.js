// Reporting service
// Communicates with Sprint 6 reporting endpoints.

import { API_BASE_URL } from "../config";

async function handleResponse(response, errorMessage) {
  if (!response.ok) {
    throw new Error(errorMessage);
  }

  return await response.json();
}

export async function getDashboardReport() {
  const response = await fetch(`${API_BASE_URL}/reports/dashboard`);
  return handleResponse(response, "Failed to load dashboard report.");
}

export async function getInventoryReport() {
  const response = await fetch(`${API_BASE_URL}/reports/inventory`);
  return handleResponse(response, "Failed to load inventory report.");
}

export async function getLowStockReport(threshold = 20) {
  const response = await fetch(
    `${API_BASE_URL}/reports/low-stock?threshold=${threshold}`
  );

  return handleResponse(response, "Failed to load low stock report.");
}

export async function getTemperatureReport() {
  const response = await fetch(
    `${API_BASE_URL}/reports/temperature-compliance`
  );

  return handleResponse(response, "Failed to load temperature report.");
}

export async function getMovementReport() {
  const response = await fetch(`${API_BASE_URL}/reports/movement-audit`);
  return handleResponse(response, "Failed to load movement report.");
}

export async function getAlertReport() {
  const response = await fetch(`${API_BASE_URL}/reports/alert-activity`);
  return handleResponse(response, "Failed to load alert report.");
}