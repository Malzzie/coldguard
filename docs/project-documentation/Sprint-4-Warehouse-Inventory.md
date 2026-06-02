# Sprint 4 – Warehouse & Inventory

## Project

**ColdGuard Smart Cold Storage Management System**

---

## Sprint Information

| Item        | Details                         |
| ----------- | ------------------------------- |
| Sprint      | Sprint 4                        |
| Sprint Name | Warehouse & Inventory           |
| Epic        | EPIC-13 – Warehouse & Inventory |

---

# Sprint Goal

Implement warehouse inventory management functionality including product management, storage locations, stock tracking, inventory movements, search capabilities, validation rules, automated testing, and documentation.

---

# Sprint Objectives

The objectives of Sprint 4 were:

* Create product management functionality
* Create storage location management
* Implement stock quantity tracking
* Record inventory movements
* Enable inventory search
* Provide dashboard summary data
* Add inventory validation rules
* Develop automated tests
* Produce Sprint 4 documentation

---

# User Stories Completed

| ID     | User Story                            | Status    |
| ------ | ------------------------------------- | --------- |
| US-055 | Create Product Management Module      | Completed |
| US-056 | Create Storage Location Management    | Completed |
| US-057 | Create Stock Quantity Tracking        | Completed |
| US-058 | Record Inventory Movements            | Completed |
| US-059 | Create Inventory Search Functionality | Completed |
| US-060 | View Inventory Dashboard Data         | Completed |
| US-061 | Add Inventory Validation Rules        | Completed |
| US-062 | Create Warehouse Inventory Tests      | Completed |
| US-063 | Prepare Sprint 4 Documentation        | Completed |

---

# Features Implemented

## Product Management

Implemented product management functionality using the InventoryItem model.

### Product Fields

* Item Name
* SKU
* Category
* Description
* Quantity
* Storage Zone
* Minimum Temperature
* Maximum Temperature
* Expiry Date
* Created Date

### Product API Endpoints

```http
POST   /inventory/
GET    /inventory/
GET    /inventory/{item_id}
PUT    /inventory/{item_id}
DELETE /inventory/{item_id}
```

---

## Storage Location Management

Implemented storage location management for warehouse organization.

### Storage Location Fields

* Location Code
* Cold Room
* Zone
* Shelf
* Created Date

### Storage Location API Endpoints

```http
POST   /locations/
GET    /locations/
GET    /locations/{location_id}
PUT    /locations/{location_id}
DELETE /locations/{location_id}
```

---

## Stock Quantity Tracking

Implemented stock increase and decrease operations.

### Endpoints

```http
POST /inventory/{item_id}/increase-stock
POST /inventory/{item_id}/decrease-stock
```

### Business Rules

* Quantity must be greater than zero
* Negative inventory is not permitted
* Stock levels update automatically

---

## Inventory Movement Tracking

Implemented inventory movement audit history.

### Movement Fields

* Inventory Item ID
* Movement Type
* Quantity
* Reference
* Timestamp

### Movement Types

* STOCK_IN
* STOCK_OUT

### Endpoints

```http
POST /movements/
GET  /movements/
GET  /movements/{movement_id}
```

---

## Inventory Search

Implemented search functionality.

### Search Criteria

* SKU
* Product Name
* Category

### Endpoint

```http
GET /inventory/search/?query=
```

---

## Dashboard Summary

Implemented dashboard summary endpoint.

### Endpoint

```http
GET /inventory/dashboard/summary
```

### Dashboard Metrics

* Total Products
* Total Stock
* Low Stock Count
* Expired Product Count

---

# Database Changes

## InventoryItem

Additional fields added:

```text
sku
description
expiry_date
```

---

## StorageLocation

New table created:

```text
StorageLocation
---------------
id
location_code
cold_room
zone
shelf
created_at
```

---

## InventoryMovement

New table created:

```text
InventoryMovement
-----------------
id
inventory_item_id
movement_type
quantity
reference
created_at
```

---

# Validation Rules

Implemented validation using Pydantic and API checks.

## Product Validation

* SKU required
* Product Name required
* Category required
* Quantity cannot be negative
* Maximum Temperature must exceed Minimum Temperature
* Duplicate SKU prevented

## Storage Location Validation

* Location Code required
* Duplicate Location Code prevented

## Inventory Movement Validation

* Quantity must be greater than zero
* Movement type must be valid
* Insufficient stock prevented

---

# Testing

Automated tests were implemented using Pytest.

## Test Coverage

* Health Endpoint
* Authentication Endpoint
* Inventory Retrieval
* Temperature Retrieval
* Authorization Protection
* Product Creation
* Duplicate SKU Validation
* Storage Location Creation
* Stock Increase
* Stock Decrease
* Inventory Movement Creation
* Inventory Search
* Dashboard Summary

## Test Results

```text
13 Passed
0 Failed
```

---

# Jira Evidence

## Sprint

Sprint 4 – Warehouse & Inventory

## Epic

EPIC-13 – Warehouse & Inventory

## Stories Completed

US-055 through US-063

## Workflow

```text
To Do
→ In Progress
→ Done
```

All Sprint 4 user stories were completed and validated.

---

# GitHub Deliverables

Sprint 4 changes include:

```text
models.py
schemas.py
inventory.py
locations.py
movements.py
main.py
test_api.py
Sprint4_Warehouse_Inventory.md
```

---

# Traceability Matrix

| Sprint 1 Requirement  | Sprint 2 Design     | Sprint 4 Implementation |
| --------------------- | ------------------- | ----------------------- |
| Product Management    | Inventory Component | US-055                  |
| Warehouse Locations   | Warehouse Design    | US-056                  |
| Stock Control         | Inventory Service   | US-057                  |
| Inventory Audit Trail | Inventory Workflow  | US-058                  |
| Product Search        | API Layer           | US-059                  |
| Dashboard Reporting   | Reporting Design    | US-060                  |
| Data Validation       | Validation Layer    | US-061                  |
| Quality Assurance     | Test Strategy       | US-062                  |

---

# Sprint Retrospective

## What Went Well

* Product management successfully implemented
* Storage location management completed
* Inventory movement tracking operational
* Dashboard functionality implemented
* Automated tests passed successfully

## Challenges

* Route ordering considerations in FastAPI
* Database schema evolution without migrations
* Validation rule refinement

## Improvements for Future Sprints

* Introduce Alembic database migrations
* Add user attribution to inventory movements
* Add warehouse-to-warehouse transfer tracking
* Expand dashboard analytics

---

# Sprint Outcome

Sprint 4 successfully delivered the warehouse and inventory management capabilities required for the ColdGuard Smart Cold Storage Management System.

All planned user stories were completed, tested, documented, and aligned with the Agile Scrum process and capstone project requirements.
