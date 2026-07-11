# Sprint 3 – Backend Infrastructure

---

# Project

**ColdGuard Smart Cold Storage Management System**

---

# Sprint Information


| Item        | Details                         |
| ----------- | ------------------------------- |
| Sprint      | Sprint 3                        |
| Sprint Name | Backend Infrastructure          |
| Epic        | EPIC-12 – Backend Infrastructure|
| User Stories| US-045 – US-054                 |

---

# Sprint Goal

Build the backend foundation for ColdGuard by implementing the API framework, database integration, inventory management services, temperature monitoring services, authentication structure, API documentation, and backend testing.

---

# Sprint Overview

Sprint 3 focused on developing the backend architecture of the ColdGuard Smart Cold Storage Management System. The sprint established the server-side foundation required to support inventory management, temperature monitoring, user authentication, API documentation, and automated testing.

The backend was implemented using FastAPI and SQLAlchemy with SQLite used as the development database.

---

# User Stories Completed

| ID     | User Story                                      | Status    |
| ------ | ----------------------------------------------- | ----------|
| US-045 | Set up backend API framework                    | Completed |
| US-046 | Configure database connection layer             | Completed |
| US-047 | Create backend database models                  | Completed |
| US-048 | Build inventory API endpoints                   | Completed |
| US-049 | Create temperature monitoring data model        | Completed |
| US-050 | Build temperature monitoring API endpoints      | Completed |
| US-051 | Add basic user authentication structure         | Completed |
| US-052 | Enable API documentation using Swagger          | Completed |
| US-053 | Add backend API tests                           | Completed |
| US-054 | Prepare Sprint 3 backend demonstration evidence | Completed |

---

# Technical Implementation

## Backend Architecture Implemented

The backend architecture was structured as follows:

```text
backend/
├── app/
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── inventory.py
│   │   └── temperature.py
│   │
│   ├── __init__.py
│   ├── database.py
│   ├── main.py
│   ├── models.py
│   ├── schemas.py
│   └── security.py
│
├── tests/
│   └── test_api.py
│
├── coldguard.db
├── README.md
└── requirements.txt
```

The architecture follows a modular design approach, separating routing, database access, business models, security functions, and validation schemas.

---

# Database Implementation

A SQLite database was configured using SQLAlchemy.

The following database tables were created:

### User

Stores application user information.

Fields:

* id
* full_name
* email
* hashed_password
* role
* is_active

### InventoryItem

Stores inventory records.

Fields:

* id
* item_name
* category
* quantity
* storage_zone
* minimum_temperature
* maximum_temperature
* created_at

### TemperatureLog

Stores temperature monitoring records.

Fields:

* id
* storage_zone
* temperature
* status
* recorded_at

---

# Inventory Management API

Inventory endpoints were implemented to support warehouse stock management.

### Endpoints

| Method | Endpoint        | Purpose                  |
| ------ | --------------- | ------------------------ |
| POST   | /inventory/     | Create inventory item    |
| GET    | /inventory/     | Retrieve all inventory   |
| GET    | /inventory/{id} | Retrieve inventory by ID |

Features implemented:

* Inventory creation
* Inventory retrieval
* Input validation
* Swagger documentation support

---

### Implementation Note

The endpoints documented above represent the initial inventory management API implemented during Sprint 3. Additional update, delete, stock adjustment, and inventory management endpoints were introduced during subsequent development sprints as ColdGuard functionality expanded.

---

# Temperature Monitoring API

Temperature monitoring functionality was implemented to support cold-storage management.

### Endpoints

| Method | Endpoint      | Purpose                   |
| ------ | ------------- | ------------------------- |
| POST   | /temperature/ | Create temperature record |
| GET    | /temperature/ | Retrieve temperature logs |

Temperature classifications:

| Condition             | Status |
| --------------------- | ------ |
| Below -25°C           | Low    |
| Between -25°C and 8°C | Normal |
| Above 8°C             | High   |

This allows ColdGuard to identify abnormal storage conditions.

---

### Implementation Note

The temperature monitoring endpoints established the initial backend monitoring capability. Additional threshold management, reporting, alert handling, and analytics functionality were implemented during later development sprints.

---

# Authentication Module

A basic authentication framework was implemented.

Features include:

* Password hashing using bcrypt
* User registration
* User login
* JWT token generation
* Protected route validation

### Authentication Endpoints

| Method | Endpoint        | Purpose                      |
| ------ | --------------- | ---------------------------- |
| POST   | /auth/register  | Register user                |
| POST   | /auth/login     | Authenticate user            |
| GET    | /auth/protected | Protected resource           |
| GET    | /auth/health    | Authentication service check |

Security controls implemented:

* Password hashing
* JWT access tokens
* Authorization header validation
* Unauthorized access protection

---

# API Documentation

Swagger documentation was automatically generated through FastAPI.

Documentation available at:

```text
http://127.0.0.1:8000/docs
```

Benefits:

* Endpoint discovery
* Request validation examples
* Response schema documentation
* Backend testing support

---

# Automated Testing

Backend tests were implemented using pytest and FastAPI TestClient.

Tests included:

* Health endpoint validation
* Authentication health validation
* Inventory endpoint validation
* Temperature endpoint validation
* Unauthorized access validation

Result:

```text
All tests passed successfully.
```

---

# Challenges Encountered

Several implementation challenges were encountered:

1. Uvicorn execution issues caused by environment configuration.
2. Import errors resulting from incorrect module naming.
3. Schema file naming mismatch (schema.py vs schemas.py).
4. Route registration issues during API integration.
5. Authentication dependency configuration.

All issues were resolved through debugging and iterative testing.

---

# Deliverables Produced

The following deliverables were completed:

* FastAPI backend application
* SQLAlchemy database integration
* Inventory management API
* Temperature monitoring API
* Authentication module
* JWT token support
* Swagger documentation
* Automated backend tests
* Sprint documentation

---

# Sprint Outcome

Sprint 3 successfully established the backend infrastructure for ColdGuard.

The system now supports:

* Persistent data storage
* Inventory management
* Temperature monitoring
* User authentication
* API documentation
* Automated testing

These backend services provide the foundation required for Sprint 4, where warehouse inventory management capabilities will be expanded through additional business 
logic, inventory workflows, stock movement functionality, and warehouse operations.

---

# Evidence

## Jira Evidence

- Sprint 3 backlog completed.
- User Stories US-045 to US-054 marked as Done.
- EPIC-12 – Backend Infrastructure completed.
- Sprint 3 successfully closed in Jira.

## GitHub Evidence

Backend implementation committed to the repository, including:

- FastAPI application structure
- SQLAlchemy database configuration
- Authentication module
- Inventory API
- Temperature Monitoring API
- Swagger documentation
- Automated backend tests
- Sprint 3 documentation

---

# Next Sprint

## Sprint 4 – Warehouse & Inventory

Sprint 4 focuses on expanding the backend by implementing warehouse inventory management features, including product management, stock movements, inventory updates, warehouse locations, and supporting business logic that builds upon the backend infrastructure established during Sprint 3.
