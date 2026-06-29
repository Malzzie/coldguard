// Authentication service
// This file contains functions used to communicate
// with the FastAPI authentication endpoints.

import { API_BASE_URL } from "../config";

// Authenticate a user using email and password
export async function login(email, password) {

  // Send login request to the backend
  const response = await fetch(
    `${API_BASE_URL}/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        email,
        password,
      }),
    }
  );

  // Convert response to JSON format
  const data = await response.json();

  // Handle unsuccessful login attempts
  if (!response.ok) {
    throw new Error(
      data.detail || "Login failed"
    );
  }

  // Return successful login response
  return data;
}