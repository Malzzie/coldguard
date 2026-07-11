// Alert management service
// Communicates with the FastAPI alert endpoints.

import { API_BASE_URL } from "../config";

/**
 * Retrieve every alert from the backend.
 */
export async function getAlerts() {
  const response = await fetch(
    `${API_BASE_URL}/alerts/`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to load alerts."
    );
  }

  return await response.json();
}

/**
 * Acknowledge an alert.
 * This records who acknowledged it and changes
 * the alert status to ACKNOWLEDGED.
 */
export async function acknowledgeAlert(
  alertId,
  acknowledgedBy
) {
  const response = await fetch(
    `${API_BASE_URL}/alerts/${alertId}/acknowledge`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        acknowledged_by: acknowledgedBy,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();

    throw new Error(
      error.detail ||
      "Failed to acknowledge alert."
    );
  }

  return await response.json();
}

/**
 * Resolve an alert.
 * This closes the alert and stores the
 * warehouse manager's resolution notes.
 */
export async function resolveAlert(
  alertId,
  resolutionNotes
) {
  const response = await fetch(
    `${API_BASE_URL}/alerts/${alertId}/resolve`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        resolution_notes: resolutionNotes,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();

    throw new Error(
      error.detail ||
      "Failed to resolve alert."
    );
  }

  return await response.json();
}

/**
 * Archive a resolved alert.
 * This removes the alert from the active dashboard
 * while preserving its audit history.
 */
export async function archiveAlert(alertId) {
  const response = await fetch(
    `${API_BASE_URL}/alerts/${alertId}/archive`,
    {
      method: "PUT",
    }
  );

  if (!response.ok) {
    const error = await response.json();

    throw new Error(
      error.detail ||
      "Failed to archive alert."
    );
  }

  return await response.json();
}

/**
 * Retrieve the audit trail for a
 * specific alert.
 */
export async function getAlertAudit(
  alertId
) {
  const response = await fetch(
    `${API_BASE_URL}/alerts/${alertId}/audit`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to load audit trail."
    );
  }

  return await response.json();
}