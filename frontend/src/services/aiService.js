// Service file for ColdGuard Operational Advisor API calls.
// The backend provides AI-inspired decision support using warehouse data.

import { API_BASE_URL } from "../config";

// Get operational advisor recommendation from the backend.
export async function getAIRiskAdvisor() {
  const response = await fetch(`${API_BASE_URL}/ai/risk-advisor`);

  if (!response.ok) {
    throw new Error("Failed to fetch Operational Advisor  data");
  }

  return response.json();
}