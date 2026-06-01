# ADR-006: FEFO Dispatch Strategy

## Status

Accepted

---

## Context

Cold storage inventory contains products with expiry dates.

Improper dispatch ordering can increase spoilage risk.

---

## Decision

ColdGuard will use FEFO (First Expiry First Out) dispatch recommendations.

---

## Rationale

FEFO:

- Reduces spoilage
- Improves inventory rotation
- Supports cold storage best practices
- Aligns with warehouse management principles

---

## Alternatives Considered

### FIFO

Pros:
- Simpler implementation

Cons:
- Ignores expiry dates

### Manual Selection

Pros:
- User flexibility

Cons:
- Increased human error

---

## Decision Outcome

FEFO provides the most suitable dispatch strategy for temperature-sensitive inventory.