# ADR-002: Database Selection

## Status

Accepted

---

## Context

ColdGuard stores structured operational data including:

- Users
- Roles
- Warehouse zones
- Products
- Inventory batches
- Temperature logs
- Alerts
- Dispatch records
- Risk scores

The solution requires relational integrity and support for complex queries.

---

## Decision

PostgreSQL will be used as the primary production database.

SQLite may be used during local development.

---

## Rationale

PostgreSQL provides:

- ACID compliance
- Strong relational integrity
- Excellent performance
- Advanced querying capabilities
- Cloud-hosting compatibility
- Strong SQLAlchemy integration

---

## Alternatives Considered

### SQLite

Pros:
- Lightweight
- Easy setup

Cons:
- Limited scalability
- Not ideal for production environments

### MySQL

Pros:
- Widely used
- Mature ecosystem

Cons:
- No significant advantage over PostgreSQL for ColdGuard

---

## Decision Outcome

PostgreSQL provides the best combination of reliability, scalability, and relational database capabilities.