// Temperature Monitoring Service
// This service communicates with the ColdGuard FastAPI backend.

import { API_BASE_URL } from "../config";

/**
 * Retrieve every stored temperature log.
 */
export async function getTemperatureLogs() {
  const response = await fetch(`${API_BASE_URL}/temperature/`);

  if (!response.ok) {
    throw new Error("Failed to load temperature data.");
  }

  return await response.json();
}

/**
 * Create a new temperature reading.
 */
export async function createTemperatureLog(logData) {
  const response = await fetch(`${API_BASE_URL}/temperature/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(logData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to create temperature log.");
  }

  return await response.json();
}

/**
 * Delete an existing temperature reading.
 */
export async function deleteTemperatureLog(logId) {
  const response = await fetch(
    `${API_BASE_URL}/temperature/${logId}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete temperature log.");
  }

  return await response.json();
}