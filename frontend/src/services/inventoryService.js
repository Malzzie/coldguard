// Inventory service
// This file contains functions that communicate with the FastAPI inventory endpoints.

// Base URL for the local FastAPI backend
const API_BASE_URL = "http://127.0.0.1:8000";

// Get all inventory items from the backend
export async function getInventoryItems() {
  const response = await fetch(`${API_BASE_URL}/inventory/`);

  // Stop the request if the backend returns an error
  if (!response.ok) {
    throw new Error("Failed to load inventory items");
  }

  // Convert the response into JSON data
  return await response.json();
}

// Get inventory dashboard summary data from the backend
export async function getDashboardSummary() {
  const response = await fetch(`${API_BASE_URL}/inventory/dashboard/summary`);

  // Stop the request if the backend returns an error
  if (!response.ok) {
    throw new Error("Failed to load dashboard summary");
  }

  // Convert the response into JSON data
  return await response.json();
}