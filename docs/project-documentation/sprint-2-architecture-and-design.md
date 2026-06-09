# Sprint 2 – Architecture & Design

## Project

**ColdGuard – Smart Cold Storage Warehouse Management System**

---

# Sprint Information

| Item        | Details                         |
| ----------- | ------------------------------- |
| Sprint      | Sprint 2                        |
| Sprint Name | Architecture & Design           |
| Epic        | EPIC-11 – Backend Infrastructure|
| User Stories| US-035 – US-044                 |
---

# Sprint Goal

The goal of Sprint 2 was to establish the complete technical foundation for ColdGuard before development begins. This included defining the system architecture, UML diagrams, entity relationships, deployment architecture, domain-driven design structure, API architecture, security architecture, architecture decisions, and CI/CD design.

---

# Sprint Objectives

* Design the ColdGuard high-level system architecture.
* Create UML diagrams representing system structure and interactions.
* Design the database model and entity relationships.
* Define service interactions using sequence diagrams.
* Design deployment architecture using Docker, PostgreSQL, Render, and GitHub Actions.
* Define bounded contexts and domains.
* Document architecture decisions using ADRs.
* Define API standards and endpoint structure.
* Design authentication and security controls.
* Design CI/CD workflow and deployment verification process.

---

# User Stories Completed

| User Story | Description                          | Status    |
| ---------- | ------------------------------------ | --------- |
| US-035     | Create ColdGuard System Architecture | Completed |
| US-036     | Design UML Diagrams                  | Completed |
| US-037     | Design ColdGuard ERD                 | Completed |
| US-038     | Create Sequence Diagrams             | Completed |
| US-039     | Design Deployment Architecture       | Completed |
| US-040     | Define DDD Domains                   | Completed |
| US-041     | Document Architecture Decisions      | Completed |
| US-042     | Design API Architecture              | Completed |
| US-043     | Design Security Architecture         | Completed |
| US-044     | Design CI/CD Architecture            | Completed |

---

# Deliverables Produced

## Architecture Documentation

* system_architecture.md
* deployment_architecture.md
* api_architecture.md
* security_architecture.md
* ddd_domains.md
* ci_cd_architecture.md

## Architecture Decision Records (ADRs)

* ADR-001 – Backend Framework Selection
* ADR-002 – Database Selection
* ADR-003 – Deployment Platform Selection
* ADR-004 – Containerization Strategy
* ADR-005 – Sensor Simulation Strategy
* ADR-006 – FEFO Dispatch Logic

## UML Diagrams

* use_case_diagram.png
* component_diagram.png
* deployment_diagram.png

## Database Design

* erd.png

## Sequence Diagrams

* inventory_receiving_sequence.png
* temperature_breach_sequence.png
* fefo_dispatch_sequence.png

---

# Technical Sections

## High-Level System Architecture

A layered architecture was designed for ColdGuard consisting of the following layers:

### Presentation Layer

* User Browser
* ColdGuard Web Interface

### Application Layer

* Flask API Layer

### Domain Services Layer

* Authentication Service
* Inventory Service
* Warehouse Zone Service
* Temperature Monitoring Service
* Alert Management Service
* FEFO Dispatch Service
* Analytics Service
* Risk Scoring Service

### Data Layer

* PostgreSQL Database

### Infrastructure Layer

* Docker Containers
* GitHub Actions CI/CD
* Render Cloud Hosting

This layered architecture separates presentation, business logic, data persistence, and deployment concerns, improving maintainability and scalability.

---

## UML Design

Three UML diagrams were created during Sprint 2.

### Use Case Diagram

The use case diagram models interactions between warehouse personnel and the ColdGuard platform.

Supported use cases include:

* User Authentication
* Inventory Receiving
* Warehouse Zone Management
* Temperature Monitoring
* Alert Management
* FEFO Dispatching
* Analytics and Reporting

### Component Diagram

The component diagram illustrates communication between:

* User Browser
* Web Frontend
* Flask Application/API Layer
* Domain Services
* PostgreSQL Database
* Simulated Sensor Feed
* GitHub Actions CI/CD
* Render Hosting

### Deployment Diagram

The deployment diagram illustrates the deployment architecture and CI/CD process:

Developer Machine → GitHub Repository → GitHub Actions → Render Hosting → PostgreSQL Database

Deployment verification includes automated testing and health-check validation.

---

## Database Design

An Entity Relationship Diagram (ERD) was designed to support inventory management, monitoring, dispatching, reporting, and user administration.

### Core Entities

* Role
* User
* Product
* InventoryBatch
* WarehouseZone
* TemperatureLog
* Alert
* DispatchTransaction
* DispatchItem
* RiskScore

### Key Relationships

* Users belong to Roles.
* Products contain Inventory Batches.
* Inventory Batches are assigned to Warehouse Zones.
* Temperature Logs are linked to Warehouse Zones.
* Alerts are generated from Temperature Logs.
* Dispatch Transactions contain Dispatch Items.
* Risk Scores are calculated for Inventory Batches.

---

## Sequence Diagram Design

Three operational workflows were modelled using UML Sequence Diagrams.

### Inventory Receiving Workflow

The workflow includes:

* User authentication
* Product validation
* Warehouse zone validation
* Batch creation
* Inventory update
* Confirmation response

### Temperature Breach Workflow

The workflow includes:

* Sensor reading ingestion
* Temperature threshold validation
* Alert generation
* Alert storage
* Alert acknowledgement
* Status updates

### FEFO Dispatch Workflow

The workflow includes:

* Product selection
* Batch retrieval
* FEFO sorting logic
* Dispatch recommendation
* Dispatch transaction creation
* Inventory reduction
* Dispatch confirmation

---

## Domain-Driven Design (DDD)

The system was divided into bounded contexts to separate business responsibilities.

### Authentication Context

Responsible for:

* User management
* Role management
* Authentication
* Authorization

### Inventory Context

Responsible for:

* Product management
* Inventory batches
* Stock movement

### Warehouse Context

Responsible for:

* Zone management
* Capacity management
* Storage requirements

### Monitoring Context

Responsible for:

* Temperature logging
* Environmental monitoring
* Sensor integrations

### Alert Context

Responsible for:

* Alert generation
* Alert tracking
* Incident acknowledgement

### Dispatch Context

Responsible for:

* FEFO recommendations
* Dispatch processing
* Inventory reduction

### Analytics Context

Responsible for:

* Risk scoring
* Reporting
* Spoilage prediction

---

## API Architecture

The API architecture follows a RESTful design approach.

### Authentication Endpoints

```http
POST /auth/login
POST /auth/register
```

### Inventory Endpoints

```http
GET /inventory
POST /inventory
PUT /inventory/{id}
DELETE /inventory/{id}
```

### Warehouse Zone Endpoints

```http
GET /zones
POST /zones
PUT /zones/{id}
```

### Temperature Monitoring Endpoints

```http
GET /temperature
POST /temperature
```

### Alert Endpoints

```http
GET /alerts
PUT /alerts/{id}/acknowledge
```

### Dispatch Endpoints

```http
GET /dispatch/recommendations
POST /dispatch
```

---

## Security Architecture

Security controls were designed for application and infrastructure protection.

### Authentication Controls

* JWT Authentication
* Password Hashing
* Secure Session Management

### Authorization Controls

* Role-Based Access Control (RBAC)
* Privilege Separation
* Access Enforcement

### Application Security

* Request Validation
* Input Sanitization
* Exception Handling
* Audit Logging

### Infrastructure Security

* Environment Variables
* Secret Management
* Secure Deployment Configuration

---

## CI/CD Architecture

The CI/CD pipeline was designed to automate build validation, testing, and deployment.

### Deployment Workflow

```text
Developer Machine
        │
        ▼
GitHub Repository
        │
        ▼
GitHub Actions
        │
        ▼
Automated Testing
        │
        ▼
Render Deployment
        │
        ▼
Health Check Validation
```

### Pipeline Activities

* Source Code Validation
* Automated Testing
* Build Verification
* Deployment Automation
* Health Endpoint Verification

---

# Sprint Outcome

Sprint 2 successfully established the complete technical blueprint for ColdGuard.

The architecture, database structure, deployment strategy, security controls, domain boundaries, API design, and workflow interactions were fully documented and approved for implementation.

All design artefacts required for backend implementation were completed, providing a solid foundation for Sprint 3.

---

# Evidence

## Jira Evidence

* Sprint 2 backlog completed.
* User Stories US-035 to US-044 marked as Done.
* EPIC-11 Architecture & Design completed.
* Sprint 2 recorded as a Closed Sprint within the Jira timeline.

## GitHub Evidence

Architecture artefacts committed to the repository:

```text
docs/
└── architecture/
    ├── adr/
    │   ├── ADR-001-backend-framework.md
    │   ├── ADR-002-database-choice.md
    │   ├── ADR-003-deployment-platform.md
    │   ├── ADR-004-containerization.md
    │   ├── ADR-005-sensor-simulation.md
    │   └── ADR-006-fefo-dispatch-logic.md
    │
    ├── diagrams/
    │   ├── use_case_diagram.png
    │   ├── component_diagram.png
    │   ├── deployment_diagram.png
    │   ├── erd.png
    │   ├── inventory_receiving_sequence.png
    │   ├── temperature_breach_sequence.png
    │   └── fefo_dispatch_sequence.png
    │
    ├── system_architecture.md
    ├── deployment_architecture.md
    ├── api_architecture.md
    ├── security_architecture.md
    ├── ddd_domains.md
    └── ci_cd_architecture.md
```

---

# Next Sprint

## Sprint 3 – Backend Infrastructure

Sprint 3 focuses on implementing the ColdGuard backend using Flask, PostgreSQL, Docker, JWT authentication, REST API endpoints, database integration, automated testing, and deployment foundations established during Sprint 2.
