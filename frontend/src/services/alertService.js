// Alert management service
// Communicates with the FastAPI alert endpoints.

// Base URL for the ColdGuard backend API
const API_BASE_URL = "http://127.0.0.1:8000";

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