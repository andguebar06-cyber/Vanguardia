import pg from 'pg';
import { PRODUCTS_DATA } from '../data/products.js';
import { Product } from '../types.js';

const { Pool } = pg;

function extractPostgresUrl(input: string | undefined): string {
  const fallback =
    'postgresql://neondb_owner:npg_HLIVjk34AeGb@ep-morning-thunder-b48v3nsw-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
  if (!input) return fallback;
  const match = input.match(/postgres(?:ql)?:\/\/[^\s"'`]+/i);
  let resolved = match ? match[0] : input.trim();
  if (resolved.includes('/neondbsslmode=')) {
    resolved = resolved.replace('/neondbsslmode=', '/neondb?sslmode=');
  }
  return resolved;
}

const connectionString = extractPostgresUrl(process.env.DATABASE_URL);

export const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

export async function initDatabase() {
  try {
    const client = await pool.connect();
    try {
      // 1. Create products table
      await client.query(`
        CREATE TABLE IF NOT EXISTS products (
          id VARCHAR(255) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          category VARCHAR(100) NOT NULL,
          department VARCHAR(100),
          subtheme VARCHAR(100),
          price NUMERIC(10, 2) NOT NULL,
          original_price NUMERIC(10, 2),
          image TEXT NOT NULL,
          description TEXT,
          sizes JSONB NOT NULL DEFAULT '[]'::jsonb,
          colors JSONB NOT NULL DEFAULT '[]'::jsonb,
          in_stock BOOLEAN DEFAULT true,
          rating NUMERIC(3, 2) DEFAULT 5.0,
          reviews_count INT DEFAULT 0,
          is_new BOOLEAN DEFAULT false,
          is_sale BOOLEAN DEFAULT false,
          featured BOOLEAN DEFAULT false,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `);

      // 2. Create orders table
      await client.query(`
        CREATE TABLE IF NOT EXISTS orders (
          id VARCHAR(100) PRIMARY KEY,
          customer_name VARCHAR(255) NOT NULL,
          customer_email VARCHAR(255) NOT NULL,
          customer_phone VARCHAR(100),
          shipping_address TEXT,
          city VARCHAR(100),
          postal_code VARCHAR(50),
          payment_method VARCHAR(50) DEFAULT 'card',
          subtotal NUMERIC(10, 2) NOT NULL,
          shipping_fee NUMERIC(10, 2) NOT NULL DEFAULT 0,
          total NUMERIC(10, 2) NOT NULL,
          items JSONB NOT NULL DEFAULT '[]'::jsonb,
          status VARCHAR(50) DEFAULT 'completado',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `);

      // 3. Create newsletter table
      await client.query(`
        CREATE TABLE IF NOT EXISTS newsletter_subscribers (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `);

      // 4. Check if products table has data, seed if empty
      const countRes = await client.query('SELECT COUNT(*) as count FROM products');
      const count = parseInt(countRes.rows[0].count, 10);

      if (count === 0 && PRODUCTS_DATA.length > 0) {
        console.log(`[Neon DB] Seeding ${PRODUCTS_DATA.length} products into PostgreSQL...`);
        for (const p of PRODUCTS_DATA) {
          await client.query(
            `INSERT INTO products (
              id, name, category, department, subtheme, price, original_price,
              image, description, sizes, colors, in_stock, rating, reviews_count,
              is_new, is_sale, featured
            ) VALUES (
              $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17
            ) ON CONFLICT (id) DO NOTHING`,
            [
              p.id,
              p.name,
              p.category,
              p.department || null,
              p.subtheme || null,
              p.price,
              p.originalPrice || null,
              p.image,
              p.description,
              JSON.stringify(p.sizes),
              JSON.stringify(p.colors),
              p.inStock ?? true,
              p.rating ?? 5.0,
              p.reviewsCount ?? 0,
              p.isNew ?? false,
              p.isSale ?? false,
              p.featured ?? false,
            ]
          );
        }
        console.log('[Neon DB] Products seeded successfully into PostgreSQL!');
      }

      console.log('[Neon DB] PostgreSQL connected and schema verified.');
    } finally {
      client.release();
    }
  } catch (err: any) {
    console.error('[Neon DB] Initialization error:', err.message);
  }
}

export async function getDbHealth() {
  const start = Date.now();
  try {
    const res = await pool.query(`
      SELECT 
        current_database() as database, 
        current_user as user,
        version() as version,
        (SELECT COUNT(*) FROM products) as products_count,
        (SELECT COUNT(*) FROM orders) as orders_count,
        (SELECT COUNT(*) FROM newsletter_subscribers) as subscribers_count
    `);
    const latency = Date.now() - start;
    const row = res.rows[0];
    return {
      connected: true,
      database: row.database,
      user: row.user,
      latencyMs: latency,
      tables: {
        products: parseInt(row.products_count, 10),
        orders: parseInt(row.orders_count, 10),
        subscribers: parseInt(row.subscribers_count, 10),
      },
      provider: 'Neon Serverless PostgreSQL (AWS us-east-2)',
    };
  } catch (err: any) {
    return {
      connected: false,
      error: err.message,
      latencyMs: Date.now() - start,
      provider: 'Neon Serverless PostgreSQL',
    };
  }
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    const res = await pool.query('SELECT * FROM products ORDER BY created_at ASC');
    if (res.rows.length === 0) {
      return PRODUCTS_DATA;
    }
    return res.rows.map((row) => ({
      id: row.id,
      name: row.name,
      category: row.category,
      department: row.department || undefined,
      subtheme: row.subtheme || undefined,
      price: parseFloat(row.price),
      originalPrice: row.original_price ? parseFloat(row.original_price) : undefined,
      image: row.image,
      description: row.description,
      sizes: typeof row.sizes === 'string' ? JSON.parse(row.sizes) : row.sizes,
      colors: typeof row.colors === 'string' ? JSON.parse(row.colors) : row.colors,
      inStock: row.in_stock,
      rating: parseFloat(row.rating),
      reviewsCount: parseInt(row.reviews_count, 10),
      isNew: row.is_new,
      isSale: row.is_sale,
      featured: row.featured,
    }));
  } catch (err) {
    console.warn('[Neon DB] Error fetching products, falling back to local dataset:', err);
    return PRODUCTS_DATA;
  }
}

export async function createOrder(order: {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress?: string;
  city?: string;
  postalCode?: string;
  paymentMethod?: string;
  subtotal: number;
  shippingFee: number;
  total: number;
  items: any[];
}) {
  const query = `
    INSERT INTO orders (
      id, customer_name, customer_email, customer_phone, shipping_address,
      city, postal_code, payment_method, subtotal, shipping_fee, total, items, status
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'completado'
    ) RETURNING *;
  `;
  const values = [
    order.id,
    order.customerName,
    order.customerEmail,
    order.customerPhone || null,
    order.shippingAddress || null,
    order.city || null,
    order.postalCode || null,
    order.paymentMethod || 'card',
    order.subtotal,
    order.shippingFee,
    order.total,
    JSON.stringify(order.items),
  ];

  const res = await pool.query(query, values);
  return res.rows[0];
}

export async function getOrders(limit = 20) {
  const res = await pool.query('SELECT * FROM orders ORDER BY created_at DESC LIMIT $1', [limit]);
  return res.rows.map((r) => ({
    id: r.id,
    customerName: r.customer_name,
    customerEmail: r.customer_email,
    customerPhone: r.customer_phone,
    shippingAddress: r.shipping_address,
    city: r.city,
    postalCode: r.postal_code,
    paymentMethod: r.payment_method,
    subtotal: parseFloat(r.subtotal),
    shippingFee: parseFloat(r.shipping_fee),
    total: parseFloat(r.total),
    items: typeof r.items === 'string' ? JSON.parse(r.items) : r.items,
    status: r.status,
    createdAt: r.created_at,
  }));
}

export async function addSubscriber(email: string) {
  const query = `
    INSERT INTO newsletter_subscribers (email)
    VALUES ($1)
    ON CONFLICT (email) DO NOTHING
    RETURNING *;
  `;
  const res = await pool.query(query, [email.toLowerCase().trim()]);
  return res.rows[0] || { email, status: 'already_subscribed' };
}
