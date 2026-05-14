# CX2.0 CRM UI Roadmap

## Phase 0 - Alignment (1-2 weeks)

Goals:

- Confirm product scope: fixed vs templated pages, customization granularity, permissions model.
- Lock data contracts: filter/sort/search/pagination format, view schema, widget query shape.
- Decide governance: versioning of UI config, audit logging, approval workflow.

Deliverables:

- Written product and technical decisions.
- API and UI config contract spec.

## Phase 1 - Foundation (2-3 weeks)

Goals:

- Implement REST wrappers for schema/admin: fields, collections, relations, create/update field.
- Add metadata caching and revalidation strategy for UI config + field definitions.
- Establish auth model: server token for admin, read-only token for data.

Deliverables:

- Stable backend endpoints for metadata and schema changes.
- Auth and token separation documented.

## Phase 2 - Dynamic UI Core (3-5 weeks)

Goals:

- Build UI config registry and JSON schema validation.
- Implement renderer pipeline: fetch config + fields, normalize, map to components.
- Define field-type mapping to UI widgets and table column types.

Deliverables:

- Dynamic page renders from Directus config end to end.
- Validated config entries with error reporting.

## Phase 3 - Data Views (3-4 weeks)

Goals:

- REST list views: pagination/sort/filter; table column config and persistence.
- GraphQL for complex detail views and dashboards (read-only).
- Add caching and error handling patterns for API layer.

Deliverables:

- List, detail, and dashboard pages loading real data.
- Standardized API error handling.

## Phase 4 - Custom Field Lifecycle (2-3 weeks)

Goals:

- UI flow to create fields (server-side REST to Directus schema).
- Refresh metadata, re-render UI, validate optimistic updates.
- Add UI-level field config overlay (labels, visibility, validation).

Deliverables:

- Non-devs can add fields and see them in the UI.
- Field metadata refresh is reliable and fast.

## Phase 5 - Governance and Scale (2-4 weeks)

Goals:

- Role-based visibility at page/widget/view/field level.
- Audit logging for config and schema changes.
- Performance hardening: batching, widget timeouts, limits, fallbacks.

Deliverables:

- Secure, stable, and scalable dynamic UI.
- Audit trail for changes and admin actions.

## Ongoing - Risk Checks

- Clarify limits: widgets per dashboard, columns per view, query complexity.
- Define safe fallbacks for slow widgets or partial failures.
- Keep documentation updated for REST and GraphQL query shapes.
