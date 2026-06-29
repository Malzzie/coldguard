// Service file for AI Risk Advisor API calls

import { API_BASE_URL } from "../config";

// Get AI risk recommendation from the backend
export async function getAIRiskAdvisor() {
  const response = await fetch(`${API_BASE_URL}/ai/risk-advisor`);

  if (!response.ok) {
    throw new Error("Failed to fetch AI risk advisor data");
  }

  return response.json();
}