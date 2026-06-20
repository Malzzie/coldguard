// Temperature monitoring service
// Communicates with the FastAPI temperature endpoints.

// Base URL for the ColdGuard backend API
const API_BASE_URL = "http://127.0.0.1:8000";

// Retrieve all temperature logs
export async function getTemperatureLogs() {

  const response = await fetch(
    `${API_BASE_URL}/temperature/`
  );

  // Handle unsuccessful requests
  if (!response.ok) {
    throw new Error(
      "Failed to load temperature data"
    );
  }

  // Return JSON response
  return await response.json();
}