const { existsSync, readFileSync } = require("node:fs");
const { resolve } = require("node:path");

loadEnv(resolve(__dirname, ".env"));
loadEnv(resolve(__dirname, "../directus/.env"));

const DIRECTUS_URL = process.env.DIRECTUS_URL ?? "http://localhost:8055";
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN;
const COUNT = Number.parseInt(process.argv[2] ?? "100", 10);

if (!DIRECTUS_TOKEN) {
  throw new Error("Missing DIRECTUS_TOKEN. Add it to scripts/.env or directus/.env.");
}

if (!Number.isInteger(COUNT) || COUNT < 1) {
  throw new Error("Count must be a positive integer. Example: node scripts/create-data.js 100");
}

const firstNames = [
  "An",
  "Binh",
  "Chi",
  "Dung",
  "Giang",
  "Ha",
  "Hieu",
  "Khanh",
  "Lan",
  "Linh",
  "Long",
  "Mai",
  "Minh",
  "Nam",
  "Ngoc",
  "Nhi",
  "Phuong",
  "Quang",
  "Son",
  "Thao",
  "Trang",
  "Tuan",
  "Vy",
  "Yen",
];

const lastNames = [
  "Nguyen Van",
  "Tran Thi",
  "Le Minh",
  "Pham Gia",
  "Hoang Anh",
  "Vu Thanh",
  "Dang Quoc",
  "Bui Duc",
  "Do Bao",
  "Ngo Hai",
  "Duong Nhat",
  "Ly Hoai",
];

function loadEnv(path) {
  if (!existsSync(path)) return;

  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
    if (!match || match[1].startsWith("#") || process.env[match[1]]) continue;
    process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
  }
}

function pick(items, index) {
  return items[index % items.length];
}

function makeCustomers(count) {
  const runId = Date.now().toString(36);

  return Array.from({ length: count }, (_, index) => {
    const number = index + 1;
    const firstName = pick(firstNames, index);
    const lastName = pick(lastNames, index);
    const suffix = String(number).padStart(3, "0");

    return {
      first_name: firstName,
      last_name: lastName,
      email: `customer.${runId}.${suffix}@example.com`,
      phone: `08${String(20000000 + number).padStart(8, "0")}`,
      status: "active",
    };
  });
}

async function createCustomer(customer) {
  const response = await fetch(`${DIRECTUS_URL}/items/customers`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${DIRECTUS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(customer),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(
      `Failed to create ${customer.email}: ${response.status} ${message}`,
    );
  }

  const json = await response.json();
  return json.data;
}

async function main() {
  console.log(`Creating ${COUNT} dummy customers in ${DIRECTUS_URL}...`);

  const customers = makeCustomers(COUNT);
  const created = [];

  for (const customer of customers) {
    created.push(await createCustomer(customer));

    if (created.length % 10 === 0 || created.length === customers.length) {
      console.log(`Created ${created.length}/${customers.length}`);
    }
  }

  console.log(`Done. Created ${created.length} customers.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
