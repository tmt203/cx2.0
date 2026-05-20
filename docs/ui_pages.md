# ui_pages Data Model

## Purpose

The `ui_pages` collection is the core navigation and page configuration model of the frontend system.

It is responsible for defining:

- Sidebar navigation items
- Nested sidebar structures
- Frontend routes
- Page hierarchy
- Page metadata
- Dynamic page rendering behavior
- Page visibility and enable/disable state

This model allows the frontend sidebar and routing system to be fully configurable from Directus without hardcoding menu structures in the frontend source code.

---

# Table Structure

```txt
ui_pages
- id
- key
- title
- route
- parent_id
- icon
- order
- page_type
- show_in_sidebar
- is_enabled
```

---

# Field Definitions

| Field             | Type                 | Required | Description                                                                              |
| ----------------- | -------------------- | -------- | ---------------------------------------------------------------------------------------- |
| `id`              | uuid                 | yes      | Primary key of the page record.                                                          |
| `key`             | string               | yes      | Unique stable identifier used internally by the frontend.                                |
| `title`           | string               | yes      | Display label of the page or sidebar item.                                               |
| `route`           | string               | no       | Frontend route path. Can be null for sidebar grouping items.                             |
| `parent_id`       | m2o -> `ui_pages.id` | no       | Self-referencing relation used to create nested sidebar structures and page hierarchies. |
| `icon`            | string               | no       | Icon name used by the frontend icon registry.                                            |
| `order`           | integer              | yes      | Display order within the same parent level.                                              |
| `page_type`       | string               | yes      | Defines the behavior or rendering type of the page.                                      |
| `show_in_sidebar` | boolean              | yes      | Controls whether the page appears in sidebar navigation.                                 |
| `is_enabled`      | boolean              | yes      | Soft enable/disable flag for the page.                                                   |

---

# Detailed Field Explanations

## id

Unique identifier of the page record.

Example:

```txt
550e8400-e29b-41d4-a716-446655440000
```

Used internally for:

- Relations
- Tree structures
- Permissions
- Frontend rendering

---

## key

Stable frontend identifier.

Rules:

- Must be unique
- Should never change after creation
- Recommended format:

```txt
^[a-z][a-z0-9_]*$
```

Examples:

```txt
dashboard
customers
sending_history
service_configuration
```

Frontend usage:

```ts
if (page.key === "dashboard") {
}
```

---

## title

Human-readable page name displayed in the UI.

Examples:

```txt
Dashboard
Customers
Campaigns
Settings
```

Recommended multilingual structure:

```json
{
  "title": "Dashboard",
  "translations": {
    "vi": {
      "title": "Bảng điều khiển"
    },
    "en": {
      "title": "Dashboard"
    }
  }
}
```

---

## route

Frontend route path.

Examples:

```txt
/dashboard
/customers
/settings/service-configuration
```

Can be null when the item acts as:

- Sidebar group
- Expandable parent menu
- Non-clickable container

Example:

```txt
Settings
 ├── Service Configuration
 └── Brand Template
```

In this case:

```txt
Settings.route = null
```

---

## parent_id

Self foreign key referencing another `ui_pages` record.

Purpose:

- Build nested sidebar menus
- Build tree structures
- Create sub pages
- Support expandable navigation groups

Relation:

```txt
ui_pages.parent_id -> ui_pages.id
```

Example structure:

```txt
Operation
 ├── Customers
 ├── Campaigns
 └── Send Manual
```

Database records:

| key             | parent_id       |
| --------------- | --------------- |
| operation_group | null            |
| customers       | operation_group |
| campaigns       | operation_group |
| send_manual     | operation_group |

Recommended Directus interface:

```txt
Autocomplete Dropdown
```

with display template:

```txt
{{title}}
```

or:

```txt
{{title}} ({{route}})
```

---

## icon

Frontend icon identifier.

Used by the frontend icon registry.

Examples:

```txt
Settings
Rocket
UserRound
CircleGauge
```

Frontend example:

```tsx
const Icon = icons[page.icon];
```

Can be null for:

- child items
- grouping items
- minimal menus

---

## order

Controls display sorting order.

Sorting happens within the same parent level.

Examples:

| key        | order |
| ---------- | ----- |
| dashboard  | 10    |
| statistics | 20    |
| customers  | 30    |

Recommended strategy:

```txt
10, 20, 30, 40
```

instead of:

```txt
1, 2, 3, 4
```

This makes future insertions easier.

---

## page_type

Defines page behavior.

Recommended values:

| Value              | Meaning                          |
| ------------------ | -------------------------------- |
| `custom`           | Standard frontend page           |
| `collection_shell` | Generic collection page renderer |
| `dashboard`        | Widget/dashboard page            |
| `sidebar_group`    | Non-clickable sidebar group      |
| `sidebar_parent`   | Expandable parent menu           |
| `settings`         | Settings page                    |
| `workspace`        | Workspace page                   |

Examples:

```txt
Dashboard -> dashboard
Customers -> collection_shell
Settings -> sidebar_parent
```

Frontend usage:

```ts
switch (page.page_type) {
  case "dashboard":
  case "collection_shell":
}
```

---

## show_in_sidebar

Controls sidebar visibility.

Examples:

| Value   | Meaning         |
| ------- | --------------- |
| `true`  | Show in sidebar |
| `false` | Hidden page     |

Useful for:

- hidden routes
- modal pages
- internal pages
- system pages

---

## is_enabled

Soft enable/disable state.

Examples:

| Value   | Meaning       |
| ------- | ------------- |
| `true`  | Active page   |
| `false` | Disabled page |

Disabled pages should:

- not render
- not appear in navigation
- optionally redirect users

Useful for:

- feature flags
- staged rollout
- temporary maintenance
- permission gating

---

# Example Sidebar Structure

```txt
Dashboard
Statistics

Operation
 ├── Customers
 ├── Send Manual
 └── Campaigns

More
 └── Settings
      ├── Service Configuration
      └── Brand Template
```

---

# Example Records

| key                   | title                 | route                          | parent_id       | icon              | page_type      |
| --------------------- | --------------------- | ------------------------------ | --------------- | ----------------- | -------------- |
| dashboard_group       | Dashboard             | null                           | null            | null              | sidebar_group  |
| dashboard             | Dashboard             | /dashboard                     | dashboard_group | CircleGauge       | dashboard      |
| statistics            | Statistics            | /report                        | dashboard_group | ChartNoAxesColumn | custom         |
| more_group            | More                  | null                           | null            | null              | sidebar_group  |
| setting               | Settings              | null                           | more_group      | Settings          | sidebar_parent |
| service_configuration | Service Configuration | /setting/service-configuration | setting         | null              | custom         |

---

# Recommended Constraints

| Field             | Constraint           |
| ----------------- | -------------------- |
| `id`              | Primary key          |
| `key`             | Unique               |
| `route`           | Unique when not null |
| `order`           | Default = 100        |
| `show_in_sidebar` | Default = true       |
| `is_enabled`      | Default = true       |

---

# Recommended Indexes

Recommended database indexes:

| Index             | Purpose               |
| ----------------- | --------------------- |
| `key`             | Fast lookup           |
| `route`           | Route resolution      |
| `parent_id`       | Sidebar tree building |
| `order`           | Sorting               |
| `show_in_sidebar` | Sidebar query         |
| `is_enabled`      | Active page filtering |

---

# Recommended Frontend Query

Example Directus query:

```ts
const pages = await directus.items("ui_pages").readByQuery({
  filter: {
    is_enabled: {
      _eq: true,
    },
    show_in_sidebar: {
      _eq: true,
    },
  },
  sort: ["order"],
});
```

---

# Frontend Tree Building

Example:

```ts
function buildTree(items, parentId = null) {
  return items
    .filter((item) => item.parent_id === parentId)
    .map((item) => ({
      ...item,
      children: buildTree(items, item.id),
    }));
}
```

This allows Directus to become the single source of truth for the entire sidebar and page navigation system.
