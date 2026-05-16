/**
 * Create the Directus `ui_pages` collection described in docs/architecture.md.
 *
 * Usage:
 *   DIRECTUS_URL=http://localhost:8055 DIRECTUS_TOKEN=<admin-token> npx tsx scripts/create-ui-pages-model.ts
 */

const DIRECTUS_URL = "http://localhost:8055";
const DIRECTUS_TOKEN = "IC-M_stC1KuVGEuthJRluUQ5Ge7cCChF";

if (!DIRECTUS_TOKEN) {
  throw new Error(
    "Missing DIRECTUS_TOKEN. Use an admin/static token that can manage schema.",
  );
}

type DirectusFieldDefinition = {
  field: string;
  type: string;
  meta?: Record<string, unknown>;
  schema?: Record<string, unknown>;
};

const primaryKeyField: DirectusFieldDefinition = {
  field: "id",
  type: "uuid",
  meta: {
    interface: "input",
    hidden: true,
    readonly: true,
  },
  schema: {
    is_primary_key: true,
    has_auto_increment: false,
  },
};

async function directus<T = unknown>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  const response = await fetch(`${DIRECTUS_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${DIRECTUS_TOKEN}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`[${method} ${path}] ${response.status}: ${message}`);
  }

  const json = await response.json();
  return json.data ?? json;
}

async function collectionExists(collection: string) {
  try {
    await directus("GET", `/collections/${collection}`);
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes("404")) return false;
    throw error;
  }
}

async function fieldExists(collection: string, field: string) {
  try {
    await directus("GET", `/fields/${collection}/${field}`);
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes("404")) return false;
    throw error;
  }
}

async function createCollection() {
  const exists = await collectionExists("ui_pages");
  if (exists) {
    console.log("Collection ui_pages already exists");
    return;
  }

  await directus("POST", "/collections", {
    collection: "ui_pages",
    meta: {
      collection: "ui_pages",
      icon: "web_asset",
      note: "Configurable frontend pages, routes, sidebar entries, and page shells.",
      hidden: false,
      singleton: false,
      accountability: "all",
      sort_field: "order",
    },
    schema: {
      name: "ui_pages",
    },
    fields: [primaryKeyField],
  });

  console.log("Created collection ui_pages");
}

const fields: DirectusFieldDefinition[] = [
  {
    field: "key",
    type: "string",
    meta: {
      interface: "input",
      required: true,
      width: "half",
      note: "Stable code-friendly identifier, for example dashboard or collections.",
      options: {
        trim: true,
      },
    },
    schema: {
      is_nullable: false,
      is_unique: true,
      max_length: 100,
    },
  },
  {
    field: "route",
    type: "string",
    meta: {
      interface: "input",
      required: true,
      width: "half",
      note: "Frontend route. Must start with /.",
      options: {
        trim: true,
      },
    },
    schema: {
      is_nullable: false,
      is_unique: true,
      max_length: 255,
    },
  },
  {
    field: "title",
    type: "string",
    meta: {
      interface: "input",
      required: true,
      width: "half",
    },
    schema: {
      is_nullable: false,
      max_length: 255,
    },
  },
  {
    field: "translations",
    type: "json",
    meta: {
      interface: "input-code",
      width: "full",
      options: {
        language: "json",
      },
    },
    schema: {
      is_nullable: true,
    },
  },
  {
    field: "description",
    type: "text",
    meta: {
      interface: "input-multiline",
      width: "full",
    },
    schema: {
      is_nullable: true,
    },
  },
  {
    field: "icon",
    type: "string",
    meta: {
      interface: "input",
      width: "half",
      note: "Lucide icon key used by the frontend icon registry.",
    },
    schema: {
      is_nullable: true,
      max_length: 100,
    },
  },
  {
    field: "page_type",
    type: "string",
    meta: {
      interface: "select-dropdown",
      required: true,
      width: "half",
      options: {
        choices: [
          { text: "Dashboard", value: "dashboard" },
          { text: "Workspace", value: "workspace" },
          { text: "Collection shell", value: "collection_shell" },
          { text: "Settings", value: "settings" },
          { text: "Custom", value: "custom" },
        ],
      },
    },
    schema: {
      is_nullable: false,
      default_value: "custom",
      max_length: 50,
    },
  },
  {
    field: "layout",
    type: "string",
    meta: {
      interface: "select-dropdown",
      required: true,
      width: "half",
      options: {
        choices: [
          { text: "Default", value: "default" },
          { text: "Dashboard", value: "dashboard" },
          { text: "List", value: "list" },
          { text: "Settings", value: "settings" },
          { text: "Blank", value: "blank" },
        ],
      },
    },
    schema: {
      is_nullable: false,
      default_value: "default",
      max_length: 50,
    },
  },
  {
    field: "collection",
    type: "string",
    meta: {
      interface: "input",
      width: "half",
      note: "Optional Directus collection name for collection-bound pages.",
    },
    schema: {
      is_nullable: true,
      max_length: 100,
    },
  },
  {
    field: "default_view_key",
    type: "string",
    meta: {
      interface: "input",
      width: "half",
      note: "Optional ui_views.key used by collection-like pages.",
    },
    schema: {
      is_nullable: true,
      max_length: 100,
    },
  },
  {
    field: "props",
    type: "json",
    meta: {
      interface: "input-code",
      width: "full",
      options: {
        language: "json",
      },
    },
    schema: {
      is_nullable: true,
    },
  },
  {
    field: "visibility",
    type: "json",
    meta: {
      interface: "input-code",
      width: "full",
      options: {
        language: "json",
      },
    },
    schema: {
      is_nullable: true,
    },
  },
  {
    field: "permissions",
    type: "json",
    meta: {
      interface: "input-code",
      width: "full",
      options: {
        language: "json",
      },
    },
    schema: {
      is_nullable: true,
    },
  },
  {
    field: "show_in_sidebar",
    type: "boolean",
    meta: {
      interface: "boolean",
      required: true,
      width: "half",
    },
    schema: {
      is_nullable: false,
      default_value: true,
    },
  },
  {
    field: "is_enabled",
    type: "boolean",
    meta: {
      interface: "boolean",
      required: true,
      width: "half",
    },
    schema: {
      is_nullable: false,
      default_value: true,
    },
  },
  {
    field: "is_system",
    type: "boolean",
    meta: {
      interface: "boolean",
      required: true,
      width: "half",
      note: "Core pages should be protected from deletion and unsafe edits.",
    },
    schema: {
      is_nullable: false,
      default_value: false,
    },
  },
  {
    field: "order",
    type: "integer",
    meta: {
      interface: "input",
      required: true,
      width: "half",
    },
    schema: {
      is_nullable: false,
      default_value: 100,
    },
  },
];

async function createFields() {
  for (const field of fields) {
    const exists = await fieldExists("ui_pages", field.field);
    if (exists) {
      console.log(`Field ui_pages.${field.field} already exists`);
      continue;
    }

    await directus("POST", "/fields/ui_pages", field);
    console.log(`Created field ui_pages.${field.field}`);
  }
}

async function seedSystemPages() {
  const systemPages = [
    {
      key: "dashboard",
      route: "/dashboard",
      title: "Dashboard",
      icon: "LayoutDashboard",
      page_type: "dashboard",
      layout: "dashboard",
      show_in_sidebar: true,
      is_enabled: true,
      is_system: true,
      order: 10,
    },
    {
      key: "workspace",
      route: "/workspace",
      title: "Workspace",
      icon: "BriefcaseBusiness",
      page_type: "workspace",
      layout: "default",
      show_in_sidebar: true,
      is_enabled: true,
      is_system: true,
      order: 20,
    },
    {
      key: "campaigns",
      route: "/campaigns",
      title: "Campaigns",
      icon: "Megaphone",
      page_type: "workspace",
      layout: "default",
      show_in_sidebar: true,
      is_enabled: true,
      is_system: true,
      order: 30,
    },
    {
      key: "analytics",
      route: "/analytics",
      title: "Analytics",
      icon: "ChartColumn",
      page_type: "dashboard",
      layout: "dashboard",
      show_in_sidebar: true,
      is_enabled: true,
      is_system: true,
      order: 40,
    },
    {
      key: "automation",
      route: "/automation",
      title: "Automation",
      icon: "Workflow",
      page_type: "workspace",
      layout: "default",
      show_in_sidebar: true,
      is_enabled: true,
      is_system: true,
      order: 50,
    },
    {
      key: "settings",
      route: "/settings",
      title: "Settings",
      icon: "Settings",
      page_type: "settings",
      layout: "settings",
      show_in_sidebar: true,
      is_enabled: true,
      is_system: true,
      order: 60,
    },
    {
      key: "collections",
      route: "/collections",
      title: "Collections",
      icon: "Folders",
      page_type: "collection_shell",
      layout: "default",
      show_in_sidebar: true,
      is_enabled: true,
      is_system: true,
      order: 70,
    },
  ];

  for (const page of systemPages) {
    const existing = await directus<{ id: string }[]>(
      "GET",
      `/items/ui_pages?filter[key][_eq]=${page.key}&limit=1`,
    );

    if (existing.length) {
      console.log(`System page ${page.key} already exists`);
      continue;
    }

    await directus("POST", "/items/ui_pages", page);
    console.log(`Created system page ${page.key}`);
  }
}

async function main() {
  console.log(`Creating ui_pages model in ${DIRECTUS_URL}`);
  await createCollection();
  await createFields();
  await seedSystemPages();
  console.log("ui_pages model is ready");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
