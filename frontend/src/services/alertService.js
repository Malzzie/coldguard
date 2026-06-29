// Alert management service
// Communicates with the FastAPI alert endpoints.

import { API_BASE_URL } from "../config";

// Retrieve all alerts
export async function getAlerts() {

  const response = await fetch(
    `${API_BASE_URL}/alerts/`
  );

  // Handle unsuccessful requests
  if (!response.ok) {
    throw new Error(
      "Failed to load alerts"
    );
  }

  // Return JSON response
  return await response.json();
}