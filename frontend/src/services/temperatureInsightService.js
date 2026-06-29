// Service file for Temperature Trend Insights API calls

import { API_BASE_URL } from "../config";

// Get calculated temperature trend insights from the backend
export async function getTemperatureInsights() {
  const response = await fetch(`${API_BASE_URL}/temperature/insights`);

  if (!response.ok) {
    throw new Error("Failed to fetch temperature insights");
  }

  return response.json();
}