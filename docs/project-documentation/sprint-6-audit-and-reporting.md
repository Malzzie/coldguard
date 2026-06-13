# Sprint 6 – Audit & Reporting

---

## Project

**ColdGuard Smart Cold Storage Management System**

---

## Sprint Information

| Item         | Details                     |
| ------------ | --------------------------- |
| Sprint       | Sprint 6                    |
| Sprint Name  | Audit & Reporting           |
| Epic         | EPIC-15 – Audit & Reporting |
| User Stories | US-074 – US-081             |

---

## Sprint Goal

The objective of Sprint 6 was to implement reporting and audit capabilities for ColdGuard, providing warehouse managers with visibility into inventory, stock movement activity, temperature compliance, alert management, and overall warehouse operations through centralized reporting endpoints.

---

## Sprint Objectives

* Implement inventory summary reporting.
* Implement low stock reporting.
* Implement temperature compliance reporting.
* Implement inventory movement audit reporting.
* Implement alert activity reporting.
* Implement a centralized reporting dashboard.
* Document reporting endpoints through Swagger/OpenAPI.
* Validate reporting functionality through testing and regression testing.

---

## User Stories Completed

| Story ID | Description                              |
| -------- | ---------------------------------------- |
| US-074   | Generate Inventory Summary Report        |
| US-075   | Generate Low Stock Report                |
| US-076   | Generate Temperature Compliance Report   |
| US-077   | Generate Inventory Movement Audit Report |
| US-078   | Generate Alert Activity Report           |
| US-079   | Generate Reporting Dashboard Endpoint    |
| US-080   | Document Reporting Endpoints             |
| US-081   | Sprint 6 Testing & Demo Evidence         |

---

## Deliverables Produced

### Reporting Module

Created:

```text
app/routes/reports.py
```

### Reporting Endpoints

Implemented:

```http
GET /reports/inventory
GET /reports/low-stock
GET /reports/temperature-compliance
GET /reports/movement-audit
GET /reports/alert-activity
GET /reports/dashboard
```

### Documentation

* Swagger/OpenAPI reporting documentation.
* Sprint 6 implementation evidence.
* Regression testing evidence.

---

## Technical Sections

### Inventory Summary Report

Implemented an inventory reporting endpoint that provides warehouse inventory visibility.

Features:

* Total inventory item count.
* Total inventory quantity.
* Inventory item details.

Endpoint:

```http
GET /reports/inventory
```

---

### Low Stock Report

Implemented low stock reporting to identify inventory requiring replenishment.

Features:

* Threshold-based filtering.
* Low stock item identification.
* Inventory visibility.

Endpoint:

```http
GET /reports/low-stock
```

Example:

```http
GET /reports/low-stock?threshold=200
```

---

### Temperature Compliance Report

Implemented compliance reporting using temperature monitoring data collected during Sprint 5.

Features:

* Total readings.
* Normal readings.
* High violations.
* Low violations.
* Compliance percentage calculation.

Endpoint:

```http
GET /reports/temperature-compliance
```

---

### Inventory Movement Audit Report

Implemented audit reporting using inventory movement records.

Features:

* Total movements.
* Stock-in transaction count.
* Stock-out transaction count.
* Movement history visibility.

Endpoint:

```http
GET /reports/movement-audit
```

---

### Alert Activity Report

Implemented reporting for alert lifecycle management.

Features:

* Open alerts.
* Acknowledged alerts.
* Resolved alerts.
* Alert audit visibility.

Endpoint:

```http
GET /reports/alert-activity
```

---

### Reporting Dashboard

Implemented a consolidated reporting dashboard.

Features:

* Inventory metrics.
* Inventory movement metrics.
* Temperature monitoring metrics.
* Alert metrics.

Endpoint:

```http
GET /reports/dashboard
```

---

## Sprint Outcome

Sprint 6 successfully introduced management reporting and audit functionality into ColdGuard.

The system can now:

* Generate inventory summary reports.
* Identify low stock inventory.
* Monitor temperature compliance.
* Audit inventory movements.
* Review alert activity.
* Access a consolidated warehouse dashboard.

These features provide operational visibility and support data-driven warehouse management decisions.

---

## Evidence

### Inventory Summary Report

Endpoint:

```http
GET /reports/inventory
```

Result:

* Inventory data returned successfully.
* Total item count displayed.
* Total quantity displayed.

Status:

```text
200 OK
```

---

### Low Stock Report

Endpoint:

```http
GET /reports/low-stock
```

Result:

* Threshold filtering verified.
* Low stock items successfully identified.

Status:

```text
200 OK
```

---

### Temperature Compliance Report

Endpoint:

```http
GET /reports/temperature-compliance
```

Result:

* Total Readings: 5
* Compliance Percentage: 20%

Status:

```text
200 OK
```

---

### Inventory Movement Audit Report

Endpoint:

```http
GET /reports/movement-audit
```

Result:

* Total Movements: 3
* Stock-In Transactions: 3
* Stock-Out Transactions: 0

Status:

```text
200 OK
```

---

### Alert Activity Report

Endpoint:

```http
GET /reports/alert-activity
```

Result:

* Total Alerts: 4
* Open Alerts: 2
* Resolved Alerts: 2

Status:

```text
200 OK
```

---

### Reporting Dashboard

Endpoint:

```http
GET /reports/dashboard
```

Result:

* Inventory Items: 2
* Inventory Movements: 3
* Temperature Logs: 9
* Total Alerts: 6
* Open Alerts: 4

Status:

```text
200 OK
```

---

### Regression Testing

Command:

```bash
python -m pytest -v
```

Result:

```text
20 Passed
0 Failed
```

Outcome:

All Sprint 1–6 functionality remains operational with no regression defects identified.

---

## Next Sprint

### Sprint 7 – Testing, DevOps & Deployment

Planned Objectives:

* Expand automated test coverage.
* Improve test validation.
* Configure deployment readiness.
* Prepare deployment documentation.
* Validate end-to-end functionality.
* Improve system stability.
* Prepare production-ready deliverables.
* Prepare demonstration environment for final project presentation.
