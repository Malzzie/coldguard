// Temperature monitoring service
// Communicates with the FastAPI temperature endpoints.

import { API_BASE_URL } from "../config";

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