// Reporting service
// Communicates with Sprint 6 reporting endpoints.

import { API_BASE_URL } from "../config";

// Get reporting dashboard summary
export async function getDashboardReport() {

  const response = await fetch(
    `${API_BASE_URL}/reports/dashboard`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to load dashboard report"
    );
  }

  return await response.json();
}

// Get inventory summary report
export async function getInventoryReport() {

  const response = await fetch(
    `${API_BASE_URL}/reports/inventory`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to load inventory report"
    );
  }

  return await response.json();
}

// Get temperature compliance report
export async function getTemperatureReport() {

  const response = await fetch(
    `${API_BASE_URL}/reports/temperature-compliance`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to load temperature report"
    );
  }

  return await response.json();
}

// Get movement audit report
export async function getMovementReport() {

  const response = await fetch(
    `${API_BASE_URL}/reports/movement-audit`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to load movement report"
    );
  }

  return await response.json();
}

// Get alert activity report
export async function getAlertReport() {

  const response = await fetch(
    `${API_BASE_URL}/reports/alert-activity`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to load alert report"
    );
  }

  return await response.json();
}