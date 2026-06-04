# Sprint 5 – Monitoring & Alerts

---

## Project

**ColdGuard Smart Cold Storage Management System**

---

## Sprint Information

| Item        | Details                         |
| ----------- | ------------------------------- |
| Sprint      | Sprint 5                        |
| Sprint Name | Monitoring & Alerts             |
| Epic        | EPIC-14 – Monitoring & Alerts   |


---

# Sprint Goal

The objective of Sprint 5 was to implement the ColdGuard Monitoring and Alerts subsystem.

The sprint focused on:

* Monitoring temperature readings within cold storage zones.
* Configuring temperature thresholds.
* Detecting threshold violations.
* Automatically generating alerts.
* Supporting alert acknowledgement workflows.
* Supporting alert resolution workflows.
* Maintaining a complete audit trail for compliance and traceability.

The sprint extends the inventory and warehouse functionality implemented in Sprint 4 by introducing operational monitoring and incident management capabilities.

---

# Sprint Backlog

| Story ID | User Story                       | Status    |
| -------- | -------------------------------- | --------- |
| US-064   | Create Temperature Reading Model | Completed |
| US-065   | Record Temperature Readings      | Completed |
| US-066   | View Historical Temperature Logs | Completed |
| US-067   | Configure Temperature Thresholds | Completed |
| US-068   | Detect Threshold Violations      | Completed |
| US-069   | Generate Automatic Alerts        | Completed |
| US-070   | Acknowledge Alerts               | Completed |
| US-071   | Resolve Alerts                   | Completed |
| US-072   | Maintain Alert Audit Trail       | Completed |
| US-073   | Sprint 5 Testing & Demo Evidence | Completed |

---

# Functional Requirements Delivered

## FR-015 Temperature Recording

ColdGuard can record temperature readings for storage zones.

Implemented Features:

* Temperature logging endpoint
* Storage zone tracking
* Automatic timestamp recording
* Historical storage of readings

Status: Complete

---

## FR-016 Historical Temperature Logs

ColdGuard stores and retrieves historical temperature readings.

Implemented Features:

* Temperature history retrieval endpoint
* Database persistence
* Ordered historical records

Status: Complete

---

## FR-017 Threshold Violation Detection

ColdGuard evaluates readings against configured thresholds.

Implemented Features:

* Dynamic threshold lookup
* Zone-based monitoring
* High temperature detection
* Low temperature detection
* Normal temperature classification

Status: Complete

---

## FR-018 Sensor Data Simulation

Temperature readings can be manually submitted to simulate sensor activity.

Implemented Features:

* API-driven sensor simulation
* Temperature recording endpoint
* Threshold evaluation workflow

Status: Complete

---

## FR-019 Automatic Alert Generation

ColdGuard automatically creates alerts whenever a threshold violation occurs.

Implemented Features:

* Automatic alert creation
* Severity classification
* Open alert management
* Database persistence

Status: Complete

---

## FR-020 Alert Acknowledgement

Users can acknowledge alerts to indicate that incidents are under investigation.

Implemented Features:

* Alert acknowledgement endpoint
* User tracking
* Timestamp tracking
* Status updates

Status: Complete

---

## FR-021 Incident Resolution

Users can formally resolve alerts.

Implemented Features:

* Alert resolution endpoint
* Resolution notes
* Resolution timestamp
* Status updates

Status: Complete

---

## FR-022 Alert Audit Trail

ColdGuard maintains a complete history of alert lifecycle events.

Implemented Features:

* Alert creation auditing
* Alert acknowledgement auditing
* Alert resolution auditing
* Historical audit retrieval

Status: Complete

---

# Architecture Changes

Sprint 5 introduced four major monitoring components.

## Temperature Monitoring

Responsible for:

* Recording temperature readings
* Storing historical logs
* Evaluating threshold compliance

---

## Threshold Management

Responsible for:

* Maintaining zone-specific temperature limits
* Providing dynamic threshold configuration
* Supporting multiple storage environments

---

## Alert Management

Responsible for:

* Creating alerts
* Tracking alert status
* Managing alert lifecycle events

---

## Audit Trail Management

Responsible for:

* Recording alert lifecycle history
* Supporting compliance requirements
* Providing incident traceability

---

# Database Design

## Existing Table Reused

### TemperatureLog

Purpose:

Stores temperature readings captured for storage zones.

Fields:

* id
* storage_zone
* temperature
* status
* recorded_at

---

## New Table Added

### TemperatureThreshold

Purpose:

Stores configurable temperature limits for storage zones.

Fields:

* id
* storage_zone
* minimum_temperature
* maximum_temperature
* created_at

Example:

| Zone        | Min | Max |
| ----------- | --- | --- |
| Frozen      | -25 | -18 |
| Chilled     | 0   | 5   |
| Dry Storage | 10  | 25  |

---

## New Table Added

### Alert

Purpose:

Stores alerts generated from threshold violations.

Fields:

* id
* storage_zone
* temperature
* severity
* status
* acknowledged_at
* acknowledged_by
* resolved_at
* resolution_notes
* created_at

# API Endpoints Implemented

## Temperature Monitoring

### Record Temperature Reading

**Endpoint**

```http
POST /temperature/
```

Purpose:

Records a temperature reading for a storage zone and automatically evaluates the reading against configured thresholds.

Example Request:

```json
{
  "storage_zone": "Frozen",
  "temperature": -20
}
```

---

### Retrieve Temperature History

**Endpoint**

```http
GET /temperature/
```

Purpose:

Returns historical temperature readings stored in the system.

---

# Temperature Threshold Management

## Create Temperature Threshold

**Endpoint**

```http
POST /thresholds/
```

Purpose:

Creates a temperature threshold configuration for a storage zone.

Example Request:

```json
{
  "storage_zone": "Frozen",
  "minimum_temperature": -25,
  "maximum_temperature": -18
}
```

---

## Retrieve Thresholds

**Endpoint**

```http
GET /thresholds/
```

Purpose:

Returns all configured temperature thresholds.

---

# Alert Management

## Retrieve Alerts

**Endpoint**

```http
GET /alerts/
```

Purpose:

Returns all generated alerts.

---

## Acknowledge Alert

**Endpoint**

```http
PUT /alerts/{id}/acknowledge
```

Purpose:

Changes an alert status from OPEN to ACKNOWLEDGED.

Example Request:

```json
{
  "acknowledged_by": "Warehouse Manager"
}
```

---

## Resolve Alert

**Endpoint**

```http
PUT /alerts/{id}/resolve
```

Purpose:

Changes an alert status from ACKNOWLEDGED to RESOLVED.

Example Request:

```json
{
  "resolution_notes": "Temperature returned to normal operating range."
}
```

---

# Audit Trail

## Retrieve Alert Audit History

**Endpoint**

```http
GET /alerts/{id}/audit
```

Purpose:

Returns all audit events associated with an alert.

---

# Monitoring Workflow

The monitoring workflow implemented during Sprint 5 is shown below.

```text
Temperature Reading Submitted
        ↓
Threshold Retrieved
        ↓
Temperature Evaluated
        ↓
Status Assigned

Normal
High
Low

        ↓

If High or Low

        ↓

Alert Generated
        ↓
Status = OPEN
        ↓
Alert Acknowledged
        ↓
Status = ACKNOWLEDGED
        ↓
Alert Resolved
        ↓
Status = RESOLVED
        ↓
Audit Trail Updated
```

---

# Threshold Evaluation Examples

## Frozen Zone

Configured Threshold

```json
{
  "storage_zone": "Frozen",
  "minimum_temperature": -25,
  "maximum_temperature": -18
}
```

### Example 1

Temperature:

```text
-20
```

Result:

```text
NORMAL
```

---

### Example 2

Temperature:

```text
-10
```

Result:

```text
HIGH
```

---

### Example 3

Temperature:

```text
-30
```

Result:

```text
LOW
```

---

# Alert Lifecycle

The following lifecycle was implemented.

```text
OPEN
 ↓
ACKNOWLEDGED
 ↓
RESOLVED
```

Each transition is permanently recorded within the audit trail.

---

# Audit Trail Events

The following audit events are automatically generated.

| Event              | Description                   |
| ------------------ | ----------------------------- |
| ALERT_CREATED      | Alert automatically generated |
| ALERT_ACKNOWLEDGED | Alert acknowledged by user    |
| ALERT_RESOLVED     | Alert resolved by user        |

---

# Swagger Testing Evidence

The following tests were executed successfully using Swagger UI.

## Temperature Threshold Testing

Verified:

* Threshold creation
* Threshold retrieval

Result:

PASS

---

## Temperature Monitoring Testing

Verified:

* Normal temperature readings
* High temperature violations
* Low temperature violations

Result:

PASS

---

## Alert Generation Testing

Verified:

* Automatic alert creation
* Alert severity classification
* Alert retrieval

Result:

PASS

---

## Alert Acknowledgement Testing

Verified:

* Status updates
* User tracking
* Timestamp tracking

Result:

PASS

---

## Alert Resolution Testing

Verified:

* Resolution notes
* Resolution timestamps
* Status updates

Result:

PASS

---

## Audit Trail Testing

Verified:

* Alert creation auditing
* Alert acknowledgement auditing
* Alert resolution auditing
* Audit retrieval endpoint

Result:

PASS

---

# Automated Testing

Sprint 5 functionality was incorporated into the project test suite.

The following tests were added.

```text
test_create_temperature_threshold
test_create_temperature_log
test_temperature_violation_detected
test_alert_generation
test_alert_acknowledgement
test_alert_resolution
test_alert_audit_trail
```

---

# Pytest Results

Automated testing completed successfully.

```text
Collected: 20 tests
Passed: 20
Failed: 0
```

Result:

PASS

---

# Definition of Done

Sprint 5 was considered complete when:

* All Jira stories were completed.
* Temperature monitoring was operational.
* Threshold management was operational.
* Alert generation was operational.
* Alert acknowledgement was operational.
* Alert resolution was operational.
* Audit trail functionality was operational.
* Swagger testing passed.
* Pytest execution passed.
* Sprint documentation was completed.

All criteria were achieved.

Status:

```text
COMPLETE
```

---

# Sprint Retrospective

## What Went Well

* Existing monitoring components were successfully extended.
* Threshold management improved flexibility.
* Alert generation integrated smoothly with monitoring workflows.
* Audit logging provided complete incident traceability.
* Automated testing remained stable.
* All Sprint 5 objectives were achieved.

---

## Challenges Encountered

* SQLite schema updates required occasional database recreation during development.
* Existing functionality from previous sprints required careful alignment.
* Testing required verification of multiple alert lifecycle stages.

---

## Improvements For Future Sprints

Future enhancements may include:

* Alembic database migrations.
* Alert filtering by severity.
* Alert filtering by storage zone.
* Email notifications.
* SMS notifications.
* Dashboard alert widgets.
* Real-time monitoring.
* Role-based alert permissions.

---

# Sprint 5 Summary

Sprint 5 successfully delivered the Monitoring and Alerts subsystem for ColdGuard.

The system can now:

* Monitor temperature readings.
* Store historical temperature logs.
* Manage configurable thresholds.
* Detect threshold violations.
* Automatically generate alerts.
* Acknowledge alerts.
* Resolve alerts.
* Maintain a complete audit trail.

All Sprint 5 user stories were completed successfully.

The sprint achieved its objectives and provides a solid foundation for future reporting, analytics, and dashboard functionality in subsequent sprints.

