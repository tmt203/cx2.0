# CX2.0 Mixed REST + GraphQL Strategy

## Goal

Use REST where Directus is strongest (schema, admin, CRUD) and GraphQL where the UI benefits from flexible shapes and fewer round trips.

## Core Principle

- REST for schema/metadata and admin actions.
- GraphQL for read-heavy, nested, or view-specific UI queries.

## What Should Use REST

### 1) Schema and Metadata

- Get fields, relations, collections, and system metadata.
- Required for dynamic UI rendering and custom fields.

Examples:

- `GET /fields/{collection}`
- `GET /fields/{collection}/{field}`
- `GET /collections`
- `GET /relations`

### 2) Admin or System Actions

- Create or update fields, collections, permissions.
- These are privileged and should be done server-side.

Examples:

- `POST /fields/{collection}`
- `PATCH /fields/{collection}/{field}`

### 3) Simple CRUD and Lists

- Tables with standard pagination, sort, and filters.
- Easier to cache, log, and debug.

Examples:

- `GET /items/{collection}?fields=...&filter=...&sort=...&limit=...&offset=...`
- `POST /items/{collection}`

### 4) Files and Media

- Uploads and assets should use REST.

Examples:

- `POST /files`
- `GET /assets/{id}`

## What Should Use GraphQL

### 1) Read-Heavy, Nested UI Pages

- Dashboards and complex detail views.
- Fetch multiple nested relations in one request.

### 2) Custom Shaped Responses

- The UI needs a specific projection of fields.
- Reduce payload size and over-fetching.

### 3) Multi-Widget Pages

- Multiple datasets in a single page load.
- Useful for widgets with different data needs.

## Recommended Split by Feature

- Dynamic UI config + schema: REST
- Collection list + CRUD: REST
- Complex detail views: GraphQL (read-only)
- Dashboards + widgets: GraphQL (read-only)
- Saved views + filters: REST for config, GraphQL for data

## Security and Governance

- Keep schema changes on server-side routes only.
- Use separate tokens for schema/admin vs read-only data.
- Restrict GraphQL to read operations if possible.

## Implementation Notes

- Build REST wrappers in Next.js API routes for schema and admin actions.
- Cache metadata (fields, labels) with revalidation.
- Use GraphQL sparingly for performance-critical views.
- Document all query shapes for UI config entries.

## Example Usage Patterns

### Table List (REST)

- Fetch columns from `/fields/{collection}`
- Fetch data from `/items/{collection}`

### Dashboard (GraphQL)

- Fetch multiple widget datasets with a single query
- Only select fields required per widget

## Decision Checklist

Before choosing REST or GraphQL, ask:

- Do we need schema metadata? If yes, REST.
- Is it a privileged action? If yes, REST via server.
- Is the response shape highly customized? If yes, GraphQL.
- Are we joining multiple entities? If yes, GraphQL.
- Do we need predictable caching/logging? If yes, REST.
