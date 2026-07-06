// Temperature Threshold Service
// This service communicates with the FastAPI Threshold endpoints.

import { API_BASE_URL } from "../config";

// Retrieve all configured temperature thresholds from the backend.
export async function getTemperatureThresholds() {
  const response = await fetch(`${API_BASE_URL}/thresholds/`);

  if (!response.ok) {
    throw new Error("Failed to load temperature thresholds.");
  }

  return await response.json();
}

// Create a new temperature threshold.
export async function createTemperatureThreshold(thresholdData) {
  const response = await fetch(`${API_BASE_URL}/thresholds/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(thresholdData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to create threshold.");
  }

  return await response.json();
}

// Update an existing temperature threshold.
export async function updateTemperatureThreshold(thresholdId, thresholdData) {
  const response = await fetch(`${API_BASE_URL}/thresholds/${thresholdId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(thresholdData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to update threshold.");
  }

  return await response.json();
}

// Delete an existing temperature threshold.
export async function deleteTemperatureThreshold(thresholdId) {
  const response = await fetch(`${API_BASE_URL}/thresholds/${thresholdId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete threshold.");
  }

  return await response.json();
}