# CX2.0 CRM UI Architecture (Dynamic UI + Custom Fields)

## Purpose

This document describes how CX2.0 renders a dynamic CRM UI by storing UI configuration and custom field definitions in Directus. The goal is to allow non-developer configuration of screens, fields, and layouts while keeping the UI consistent and secure.

## High-Level Architecture

- Directus acts as the source of truth for UI configuration and custom fields.
- The Next.js UI fetches configuration at runtime and renders pages dynamically.
- Custom field definitions are created in Directus and reflected in the UI.

## Core Concepts

### 1) UI Configuration Model (Directus)

Store UI configuration in Directus collections, for example:

- `ui_pages`: Page metadata, route, title, permissions.
- `ui_sections`: Layout blocks for a page (header, grid, tabs, tables).
- `ui_components`: Component definition and props (e.g., table, form, card).
- `ui_fields`: Field-level configuration (label, type, formatting, validation).

Recommended fields per config entry:

- `key`: Unique identifier for a config node.
- `label`: Display label.
- `type`: Component or field type.
- `props`: JSON for component props.
- `order`: Sort order.
- `visibility`: Rules for conditional display.
- `permissions`: Roles or flags allowed to view/edit.

### 2) Custom Field Model (Directus)

Custom fields are created through Directus schema endpoints and linked to business collections (e.g., `addresses`).

- Field metadata is stored by Directus and can include display labels, visibility, and validation rules.
- The UI uses Directus field metadata to infer rendering and mapping.

### 3) UI Renderer (Next.js)

The UI renderer is responsible for:

- Loading the UI configuration and field definitions from Directus.
- Mapping Directus field types to UI components and `ColumnType` in tables.
- Rendering the layout tree using a component registry.

Example rendering flow:

1. Fetch UI config for the current route.
2. Fetch custom fields and labels for the collection.
3. Merge and normalize config + field metadata.
4. Render components dynamically using a registry and typed props.

### 4) State Management (Zustand)

Zustand is used for client-side state management to keep UI state consistent and lightweight.

Responsibilities:

- Store shared UI state such as collections, fields, and user session context.
- Provide fast, localized updates without prop drilling.
- Coordinate UI interactions (filters, pagination, visibility) across components.

## Data Flow

1. **User loads page**
2. UI calls `/api/collections/fields?collection=...` to get field names and labels
3. UI calls data API (`fetchCollectionItems`) to get collection data
4. UI builds columns dynamically and renders `DataTable`
5. User may add a new field via UI; server calls Directus `POST /fields/{collection}`
6. UI refreshes field metadata and re-renders

## Type Mapping Strategy

Map Directus field types to UI types:

- `boolean` -> `ColumnType.BOOLEAN`
- `integer`, `float`, `decimal` -> `ColumnType.NUMBER`
- `date`, `datetime` -> `ColumnType.DATE` or `ColumnType.DATETIME`
- `string`, `text`, `uuid` -> `ColumnType.TEXT`

This can be refined by reading Directus field `meta` and `schema` fields.

## Security and Permissions

- Server-side routes use a server token (e.g., `DIRECTUS_STATIC_TOKEN`) to avoid exposing credentials.
- The token role must have schema permissions for creating fields.
- UI should hide actions based on user role and config `permissions`.

## Error Handling

- Server errors from Directus are surfaced as user-friendly messages.
- UI should show validation hints for field creation.
- Changes should be optimistic only when schema changes are confirmed.

## Suggested Next Steps

- Add a UI config registry and schema validation layer.
- Define a strict JSON schema for UI config entries.
- Implement caching and revalidation for UI config endpoints.
- Add audit logging for UI config and schema changes.

## Architecture Q&A for BE and Tech Lead

Use this checklist to align on scope, contracts, and risks before implementation.

### Product and Scope

- Which pages are fixed (dashboard widgets) vs templated (view/create/update/delete)?
- Should a single screen support multiple layouts (table, kanban, cards)?
- What is the granularity for user customization (per user, role, team, org)?
- Are there system views that are read-only or locked?

### Data Contracts and API

- What is the canonical query format for filter/sort/search/pagination?
- Do we need a query DSL for advanced filters or saved segments?
- How do we handle field metadata caching and invalidation on schema change?
- What is the API shape for views (table/kanban) and widgets?

### Permissions and Governance

- What permissions apply at page, widget, view, field, and action levels?
- Do we need row-level permissions and field-level masking?
- Who can create or publish views and widgets?
- Do we need approval flows or versioning for UI config changes?

### Performance and Reliability

- What are the expected limits (widgets per dashboard, columns per view)?
- Should we batch requests or use server aggregation for heavy widgets?
- How do we handle slow or failing widgets (timeouts, fallbacks)?

### UX and Consistency

- What is the component registry and how do we enforce design consistency?
- How do we map Directus field types to UI components and validators?
- How do we handle localization for labels, errors, and view names?

## Draft Data Models (Directus)

The collections below are suggested. Fields can be refined once the scope is confirmed.

### ui_pages

Purpose: Define screens and top-level layout containers.

Recommended fields:

- `key` (string, unique)
- `route` (string)
- `title` (string)
- `layout` (string, e.g. `dashboard`, `record`, `list`)
- `permissions` (json)
- `is_system` (boolean)
- `order` (integer)

### ui_widgets

Purpose: Dashboard widgets with data sources and visualization settings.

Recommended fields:

- `key` (string, unique)
- `page_id` (m2o -> ui_pages)
- `type` (string, e.g. `chart`, `kpi`, `list`)
- `title` (string)
- `data_source` (json, query config)
- `props` (json, visualization config)
- `layout` (json, x/y/w/h for grid)
- `permissions` (json)

### ui_views

Purpose: Saved views for list pages (table, kanban, cards).

Recommended fields:

- `key` (string, unique)
- `collection` (string)
- `name` (string)
- `view_type` (string: `table`, `kanban`, `cards`)
- `is_system` (boolean)
- `owner` (m2o -> users)
- `permissions` (json)
- `query` (json: filters, sort, search, pagination defaults)
- `columns` (json: column list, order, width, visibility)
- `group_by` (string, for kanban)
- `card_template` (json)

### ui_filters

Purpose: Named filter presets and segments used across views.

Recommended fields:

- `key` (string, unique)
- `collection` (string)
- `name` (string)
- `definition` (json: filter DSL)
- `permissions` (json)

### ui_fields

Purpose: UI-level field configuration layered on top of Directus schema.

Recommended fields:

- `collection` (string)
- `field` (string)
- `label` (string)
- `component` (string)
- `props` (json)
- `validation` (json)
- `visibility` (json)

## Open Design Decisions

- How to version and migrate UI config when schema changes.
- Whether view configs should allow custom computed fields.
- How to handle cross-collection widgets and joins.
