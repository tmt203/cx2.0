/**
 * Directus E-commerce Seed Script
 * Usage:
 *   1. npm install -g tsx   (hoặc: npx tsx seed-directus.ts)
 *   2. Cập nhật DIRECTUS_URL và DIRECTUS_TOKEN bên dưới
 *   3. npx tsx seed-directus.ts
 */

const DIRECTUS_URL = "http://localhost:8055"; // ← đổi thành URL Directus của bạn
const DIRECTUS_TOKEN = "_m0Yulv5s96dyN1uk3HEA_rWScZwkVcA"; // ← lấy từ Settings → API Tokens

// ─── HTTP helper ────────────────────────────────────────────────────────────

async function api<T = any>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  const res = await fetch(`${DIRECTUS_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${DIRECTUS_TOKEN}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`[${method} ${path}] ${res.status}: ${err}`);
  }

  const json = await res.json();
  return json.data ?? json;
}

const post = <T = any>(path: string, body: unknown) =>
  api<T>("POST", path, body);

// ─── Helpers ─────────────────────────────────────────────────────────────────

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number, decimals = 2) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function orderNumber() {
  return `ORD-${Date.now().toString().slice(-6)}-${randomBetween(100, 999)}`;
}

// ─── 1. Categories ───────────────────────────────────────────────────────────

async function seedCategories() {
  console.log("📁 Seeding categories...");

  const roots = await Promise.all([
    post("/items/categories", {
      name: "Thời trang",
      slug: "thoi-trang",
      sort_order: 1,
      status: "published",
    }),
    post("/items/categories", {
      name: "Điện tử",
      slug: "dien-tu",
      sort_order: 2,
      status: "published",
    }),
    post("/items/categories", {
      name: "Gia dụng",
      slug: "gia-dung",
      sort_order: 3,
      status: "published",
    }),
  ]);

  const [fashion, electronics, home] = roots;

  // Sub-categories
  const subs = await Promise.all([
    // Thời trang
    post("/items/categories", {
      name: "Áo nam",
      slug: "ao-nam",
      parent_id: fashion.id,
      sort_order: 1,
      status: "published",
    }),
    post("/items/categories", {
      name: "Áo nữ",
      slug: "ao-nu",
      parent_id: fashion.id,
      sort_order: 2,
      status: "published",
    }),
    post("/items/categories", {
      name: "Giày dép",
      slug: "giay-dep",
      parent_id: fashion.id,
      sort_order: 3,
      status: "published",
    }),
    // Điện tử
    post("/items/categories", {
      name: "Điện thoại",
      slug: "dien-thoai",
      parent_id: electronics.id,
      sort_order: 1,
      status: "published",
    }),
    post("/items/categories", {
      name: "Laptop",
      slug: "laptop",
      parent_id: electronics.id,
      sort_order: 2,
      status: "published",
    }),
    post("/items/categories", {
      name: "Phụ kiện",
      slug: "phu-kien",
      parent_id: electronics.id,
      sort_order: 3,
      status: "published",
    }),
    // Gia dụng
    post("/items/categories", {
      name: "Bếp & Nấu ăn",
      slug: "bep-nau-an",
      parent_id: home.id,
      sort_order: 1,
      status: "published",
    }),
    post("/items/categories", {
      name: "Đồ trang trí",
      slug: "do-trang-tri",
      parent_id: home.id,
      sort_order: 2,
      status: "published",
    }),
  ]);

  console.log(
    `  ✓ ${roots.length} root categories, ${subs.length} sub-categories`,
  );
  return { fashion, electronics, home, subs };
}

// ─── 2. Products + Variants ──────────────────────────────────────────────────

async function seedProducts(
  categories: Awaited<ReturnType<typeof seedCategories>>,
) {
  console.log("📦 Seeding products...");

  const { subs } = categories;
  const [aoNam, aoNu, giayDep, dienThoai, laptop, phuKien, bep, trangTri] =
    subs;

  const productDefs = [
    // Thời trang
    {
      name: "Áo thun basic unisex",
      sku: "AT-001",
      description:
        "Áo thun cotton 100%, form rộng thoải mái, phù hợp mọi hoạt động hàng ngày.",
      category_id: aoNam.id,
      price: 199000,
      compare_price: 299000,
      stock: 150,
      status: "published",
      variants: [
        {
          name: "Trắng / S",
          sku: "AT-001-WS",
          price: 199000,
          stock: 30,
          attributes: { color: "Trắng", size: "S" },
        },
        {
          name: "Trắng / M",
          sku: "AT-001-WM",
          price: 199000,
          stock: 40,
          attributes: { color: "Trắng", size: "M" },
        },
        {
          name: "Đen / M",
          sku: "AT-001-BM",
          price: 199000,
          stock: 35,
          attributes: { color: "Đen", size: "M" },
        },
        {
          name: "Đen / L",
          sku: "AT-001-BL",
          price: 199000,
          stock: 45,
          attributes: { color: "Đen", size: "L" },
        },
      ],
    },
    {
      name: "Áo sơ mi linen nữ",
      sku: "SM-002",
      description:
        "Chất liệu linen cao cấp, thoáng mát, thích hợp đi làm và dạo phố.",
      category_id: aoNu.id,
      price: 450000,
      compare_price: 650000,
      stock: 80,
      status: "published",
      variants: [
        {
          name: "Kem / S",
          sku: "SM-002-CS",
          price: 450000,
          stock: 20,
          attributes: { color: "Kem", size: "S" },
        },
        {
          name: "Kem / M",
          sku: "SM-002-CM",
          price: 450000,
          stock: 30,
          attributes: { color: "Kem", size: "M" },
        },
        {
          name: "Xanh / M",
          sku: "SM-002-BM",
          price: 450000,
          stock: 30,
          attributes: { color: "Xanh nhạt", size: "M" },
        },
      ],
    },
    {
      name: "Giày sneaker thể thao",
      sku: "GS-003",
      description: "Đế cao su chống trơn, đệm êm ái, phù hợp tập gym và đi bộ.",
      category_id: giayDep.id,
      price: 890000,
      compare_price: 1200000,
      stock: 60,
      status: "published",
      variants: [
        {
          name: "Trắng / 38",
          sku: "GS-003-W38",
          price: 890000,
          stock: 15,
          attributes: { color: "Trắng", size: "38" },
        },
        {
          name: "Trắng / 40",
          sku: "GS-003-W40",
          price: 890000,
          stock: 20,
          attributes: { color: "Trắng", size: "40" },
        },
        {
          name: "Đen / 41",
          sku: "GS-003-B41",
          price: 890000,
          stock: 25,
          attributes: { color: "Đen", size: "41" },
        },
      ],
    },
    // Điện tử
    {
      name: "iPhone 15 Pro",
      sku: "IP-015P",
      description:
        "Chip A17 Pro, camera 48MP, khung titan, màn hình Super Retina XDR 6.1 inch.",
      category_id: dienThoai.id,
      price: 28990000,
      compare_price: 32990000,
      stock: 45,
      status: "published",
      variants: [
        {
          name: "Titan tự nhiên / 128GB",
          sku: "IP-015P-N128",
          price: 28990000,
          stock: 15,
          attributes: { color: "Titan tự nhiên", storage: "128GB" },
        },
        {
          name: "Titan tự nhiên / 256GB",
          sku: "IP-015P-N256",
          price: 32990000,
          stock: 10,
          attributes: { color: "Titan tự nhiên", storage: "256GB" },
        },
        {
          name: "Titan đen / 256GB",
          sku: "IP-015P-B256",
          price: 32990000,
          stock: 20,
          attributes: { color: "Titan đen", storage: "256GB" },
        },
      ],
    },
    {
      name: "MacBook Air M3",
      sku: "MBA-M3",
      description:
        "Chip Apple M3, màn hình Liquid Retina 13.6 inch, pin 18 giờ, không quạt tản nhiệt.",
      category_id: laptop.id,
      price: 29990000,
      compare_price: 33990000,
      stock: 30,
      status: "published",
      variants: [
        {
          name: "Midnight / 8GB / 256GB",
          sku: "MBA-M3-M8-256",
          price: 29990000,
          stock: 10,
          attributes: { color: "Midnight", ram: "8GB", storage: "256GB" },
        },
        {
          name: "Starlight / 8GB / 512GB",
          sku: "MBA-M3-S8-512",
          price: 35990000,
          stock: 10,
          attributes: { color: "Starlight", ram: "8GB", storage: "512GB" },
        },
        {
          name: "Midnight / 16GB / 512GB",
          sku: "MBA-M3-M16-512",
          price: 41990000,
          stock: 10,
          attributes: { color: "Midnight", ram: "16GB", storage: "512GB" },
        },
      ],
    },
    {
      name: "Tai nghe Sony WH-1000XM5",
      sku: "TN-SONY-XM5",
      description:
        "Chống ồn chủ động hàng đầu, pin 30 giờ, kết nối multipoint 2 thiết bị.",
      category_id: phuKien.id,
      price: 7490000,
      compare_price: 9490000,
      stock: 50,
      status: "published",
      variants: [
        {
          name: "Đen",
          sku: "TN-SONY-XM5-B",
          price: 7490000,
          stock: 25,
          attributes: { color: "Đen" },
        },
        {
          name: "Bạc",
          sku: "TN-SONY-XM5-S",
          price: 7490000,
          stock: 25,
          attributes: { color: "Bạc" },
        },
      ],
    },
    // Gia dụng
    {
      name: "Nồi chiên không dầu Philips 4.1L",
      sku: "NC-PHL-41",
      description:
        "Công nghệ Rapid Air, dung tích 4.1L, màn hình kỹ thuật số, 7 chế độ nấu.",
      category_id: bep.id,
      price: 2490000,
      compare_price: 3200000,
      stock: 40,
      status: "published",
      variants: [],
    },
    {
      name: "Bình hoa gốm thủ công",
      sku: "BH-GOM-001",
      description:
        "Gốm thủ công Bát Tràng, men màu độc đáo, phù hợp trang trí phòng khách và bàn làm việc.",
      category_id: trangTri.id,
      price: 320000,
      compare_price: 420000,
      stock: 100,
      status: "published",
      variants: [
        {
          name: "Xanh lam / Nhỏ",
          sku: "BH-GOM-BS",
          price: 320000,
          stock: 35,
          attributes: { color: "Xanh lam", size: "Nhỏ" },
        },
        {
          name: "Xanh lam / Lớn",
          sku: "BH-GOM-BL",
          price: 450000,
          stock: 30,
          attributes: { color: "Xanh lam", size: "Lớn" },
        },
        {
          name: "Nâu đất / Nhỏ",
          sku: "BH-GOM-ES",
          price: 320000,
          stock: 35,
          attributes: { color: "Nâu đất", size: "Nhỏ" },
        },
      ],
    },
    // Draft product
    {
      name: "Áo khoác bomber mùa đông",
      sku: "AK-WIN-001",
      description: "Đang cập nhật mô tả sản phẩm.",
      category_id: aoNam.id,
      price: 1290000,
      compare_price: 1690000,
      stock: 0,
      status: "draft",
      variants: [],
    },
  ];

  const products: any[] = [];

  for (const def of productDefs) {
    const { variants: variantDefs, ...productData } = def;

    const product = await post("/items/products", productData);
    products.push(product);

    if (variantDefs.length > 0) {
      for (const v of variantDefs) {
        await post("/items/product_variants", {
          ...v,
          product_id: product.id,
        });
      }
    }
  }

  console.log(`  ✓ ${products.length} products với variants`);
  return products;
}

// ─── 3. Customers + Addresses ────────────────────────────────────────────────

async function seedCustomers() {
  console.log("👤 Seeding customers...");

  const customerDefs = [
    {
      first_name: "Nguyễn",
      last_name: "Văn An",
      email: "an.nguyen@email.com",
      phone: "0901234567",
      status: "active",
    },
    {
      first_name: "Trần",
      last_name: "Thị Bình",
      email: "binh.tran@email.com",
      phone: "0912345678",
      status: "active",
    },
    {
      first_name: "Lê",
      last_name: "Minh Cường",
      email: "cuong.le@email.com",
      phone: "0923456789",
      status: "active",
    },
    {
      first_name: "Phạm",
      last_name: "Thị Dung",
      email: "dung.pham@email.com",
      phone: "0934567890",
      status: "active",
    },
    {
      first_name: "Hoàng",
      last_name: "Văn Em",
      email: "em.hoang@email.com",
      phone: "0945678901",
      status: "active",
    },
    {
      first_name: "Vũ",
      last_name: "Thị Phương",
      email: "phuong.vu@email.com",
      phone: "0956789012",
      status: "active",
    },
    {
      first_name: "Đặng",
      last_name: "Quốc Hùng",
      email: "hung.dang@email.com",
      phone: "0967890123",
      status: "blocked",
    },
  ];

  const customers: any[] = [];

  for (const def of customerDefs) {
    const customer = await post("/items/customers", def);
    customers.push(customer);
  }

  // Addresses
  const addressDefs = [
    {
      customer_id: customers[0].id,
      label: "Nhà",
      street: "123 Nguyễn Trãi",
      city: "TP. Hồ Chí Minh",
      province: "Hồ Chí Minh",
      country: "Vietnam",
      is_default: true,
    },
    {
      customer_id: customers[0].id,
      label: "Văn phòng",
      street: "45 Lê Lợi",
      city: "TP. Hồ Chí Minh",
      province: "Hồ Chí Minh",
      country: "Vietnam",
      is_default: false,
    },
    {
      customer_id: customers[1].id,
      label: "Nhà",
      street: "67 Trần Hưng Đạo",
      city: "Hà Nội",
      province: "Hà Nội",
      country: "Vietnam",
      is_default: true,
    },
    {
      customer_id: customers[2].id,
      label: "Nhà",
      street: "89 Lý Thái Tổ",
      city: "Đà Nẵng",
      province: "Đà Nẵng",
      country: "Vietnam",
      is_default: true,
    },
    {
      customer_id: customers[3].id,
      label: "Nhà",
      street: "12 Phan Đình Phùng",
      city: "TP. Hồ Chí Minh",
      province: "Hồ Chí Minh",
      country: "Vietnam",
      is_default: true,
    },
    {
      customer_id: customers[4].id,
      label: "Nhà",
      street: "34 Hai Bà Trưng",
      city: "Hà Nội",
      province: "Hà Nội",
      country: "Vietnam",
      is_default: true,
    },
    {
      customer_id: customers[5].id,
      label: "Nhà",
      street: "56 Đinh Tiên Hoàng",
      city: "TP. Hồ Chí Minh",
      province: "Hồ Chí Minh",
      country: "Vietnam",
      is_default: true,
    },
    {
      customer_id: customers[6].id,
      label: "Nhà",
      street: "78 Lê Duẩn",
      city: "Đà Nẵng",
      province: "Đà Nẵng",
      country: "Vietnam",
      is_default: true,
    },
  ];

  const addresses: any[] = [];
  for (const def of addressDefs) {
    const address = await post("/items/addresses", def);
    addresses.push(address);
  }

  console.log(
    `  ✓ ${customers.length} customers, ${addresses.length} addresses`,
  );
  return { customers, addresses };
}

// ─── 4. Orders + Order Items ─────────────────────────────────────────────────

async function seedOrders(
  products: any[],
  customersData: Awaited<ReturnType<typeof seedCustomers>>,
) {
  console.log("🛒 Seeding orders...");

  const { customers, addresses } = customersData;

  // Lấy variants để dùng trong order items
  const allVariants = await api("GET", "/items/product_variants?limit=100");

  function getVariantsOf(productId: string) {
    return allVariants.filter((v: any) => v.product_id === productId);
  }

  const orderStatuses = [
    "pending",
    "confirmed",
    "shipping",
    "delivered",
    "cancelled",
  ];
  const paymentStatuses = ["unpaid", "paid", "refunded"];

  const orderDefs = [
    // Order 1 — đã giao, đã thanh toán
    {
      customer: customers[0],
      address: addresses[0],
      status: "delivered",
      payment_status: "paid",
      items: [
        { product: products[0], quantity: 2 }, // Áo thun
        { product: products[5], quantity: 1 }, // Tai nghe Sony
      ],
    },
    // Order 2 — đang giao
    {
      customer: customers[1],
      address: addresses[2],
      status: "shipping",
      payment_status: "paid",
      items: [
        { product: products[3], quantity: 1 }, // iPhone
      ],
    },
    // Order 3 — mới đặt, chưa thanh toán
    {
      customer: customers[2],
      address: addresses[3],
      status: "pending",
      payment_status: "unpaid",
      items: [
        { product: products[1], quantity: 1 }, // Áo sơ mi
        { product: products[2], quantity: 1 }, // Giày sneaker
      ],
    },
    // Order 4 — đã xác nhận
    {
      customer: customers[3],
      address: addresses[4],
      status: "confirmed",
      payment_status: "paid",
      items: [
        { product: products[4], quantity: 1 }, // MacBook
      ],
    },
    // Order 5 — đã hủy, hoàn tiền
    {
      customer: customers[4],
      address: addresses[5],
      status: "cancelled",
      payment_status: "refunded",
      items: [
        { product: products[6], quantity: 1 }, // Nồi chiên
        { product: products[7], quantity: 2 }, // Bình hoa
      ],
    },
    // Order 6 — đã giao
    {
      customer: customers[5],
      address: addresses[6],
      status: "delivered",
      payment_status: "paid",
      items: [
        { product: products[0], quantity: 3 }, // Áo thun
        { product: products[7], quantity: 1 }, // Bình hoa
      ],
    },
    // Order 7 — pending
    {
      customer: customers[0],
      address: addresses[1], // văn phòng
      status: "pending",
      payment_status: "unpaid",
      items: [
        { product: products[5], quantity: 1 }, // Tai nghe Sony
      ],
    },
    // Order 8 — đang giao
    {
      customer: customers[1],
      address: addresses[2],
      status: "shipping",
      payment_status: "paid",
      items: [
        { product: products[6], quantity: 1 }, // Nồi chiên
        { product: products[1], quantity: 2 }, // Áo sơ mi
      ],
    },
  ];

  const orders: any[] = [];

  for (const def of orderDefs) {
    const SHIPPING_FEE =
      def.status === "delivered"
        ? 30000
        : def.status === "cancelled"
          ? 0
          : 30000;

    // Tính subtotal từ items
    let subtotal = 0;
    const itemsToCreate: any[] = [];

    for (const { product, quantity } of def.items) {
      const variants = getVariantsOf(product.id);
      const variant = variants.length > 0 ? pick(variants) : null;
      const unit_price = variant?.price ?? product.price;
      const line_subtotal = unit_price * quantity;
      subtotal += line_subtotal;

      itemsToCreate.push({
        product_id: product.id,
        variant_id: variant?.id ?? null,
        product_name: product.name + (variant ? ` — ${variant.name}` : ""),
        unit_price,
        quantity,
        subtotal: line_subtotal,
      });
    }

    const discount = subtotal > 5000000 ? Math.round(subtotal * 0.05) : 0;
    const total = subtotal + SHIPPING_FEE - discount;

    const order = await post("/items/orders", {
      order_number: orderNumber(),
      customer_id: def.customer.id,
      shipping_address_id: def.address.id,
      subtotal,
      shipping_fee: SHIPPING_FEE,
      discount,
      total,
      status: def.status,
      payment_status: def.payment_status,
    });

    orders.push(order);

    for (const item of itemsToCreate) {
      await post("/items/order_items", {
        ...item,
        order_id: order.id,
      });
    }
  }

  console.log(`  ✓ ${orders.length} orders với order items`);
  return orders;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("\n🌱 Bắt đầu seed Directus E-commerce data...\n");
  console.log(`   URL  : ${DIRECTUS_URL}`);
  console.log(`   Token: ${DIRECTUS_TOKEN.slice(0, 8)}...\n`);

  // Thay thế block health check
  const healthRes = await fetch(`${DIRECTUS_URL}/server/health`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${DIRECTUS_TOKEN}`,
    },
  });
  const health = await healthRes.json();

  if (healthRes.ok && health.status === "ok") {
    console.log("✅ Kết nối Directus thành công\n");
  } else {
    console.warn(
      "⚠️ Health check warning:",
      health.checks?.["storage:local:responseTime"] ?? health,
    );
  }

  const categories = await seedCategories();
  const products = await seedProducts(categories);
  const customers = await seedCustomers();
  await seedOrders(products, customers);

  console.log("\n✅ Seed hoàn tất!");
  console.log("   Mở Directus admin để kiểm tra data.");
}

main().catch((err) => {
  console.error("\n❌ Seed thất bại:", err.message);
  process.exit(1);
});
