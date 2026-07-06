// Inventory service
// This file contains functions that communicate with the FastAPI inventory endpoints.

import { API_BASE_URL } from "../config";

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

// Create a new inventory item
export async function createInventoryItem(itemData) {
  const response = await fetch(`${API_BASE_URL}/inventory/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(itemData),
  });

  if (!response.ok) {
    throw new Error("Failed to create inventory item");
  }

  return await response.json();
}

// Update an inventory item
export async function updateInventoryItem(id, itemData) {
  const response = await fetch(`${API_BASE_URL}/inventory/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(itemData),
  });

  if (!response.ok) {
    throw new Error("Failed to update inventory item");
  }

  return await response.json();
}

// Delete an inventory item
export async function deleteInventoryItem(id) {
  const response = await fetch(`${API_BASE_URL}/inventory/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete inventory item");
  }

  return await response.json();
}

// Increase stock
export async function increaseStock(id, quantity) {
  const response = await fetch(
    `${API_BASE_URL}/inventory/${id}/increase-stock`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        quantity: Number(quantity),
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to increase stock");
  }

  return await response.json();
}

// Decrease stock
export async function decreaseStock(id, quantity) {
  const response = await fetch(
    `${API_BASE_URL}/inventory/${id}/decrease-stock`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        quantity: Number(quantity),
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to decrease stock");
  }

  return await response.json();
}