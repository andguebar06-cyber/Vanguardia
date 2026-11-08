import 'dotenv/config';
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import {
  initDatabase,
  getDbHealth,
  getAllProducts,
  createOrder,
  getOrders,
  addSubscriber,
} from './src/server/db.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Initialize Neon PostgreSQL database tables & seeds
  await initDatabase();

  // API Routes for Neon PostgreSQL
  app.get('/api/db/health', async (_req, res) => {
    const health = await getDbHealth();
    res.json(health);
  });

  app.get('/api/products', async (_req, res) => {
    try {
      const products = await getAllProducts();
      res.json(products);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/orders', async (req, res) => {
    try {
      const {
        id,
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress,
        city,
        postalCode,
        paymentMethod,
        subtotal,
        shippingFee,
        total,
        items,
      } = req.body;

      if (!id || !customerName || !customerEmail || !items) {
        return res.status(400).json({ error: 'Faltan campos obligatorios de la orden' });
      }

      const order = await createOrder({
        id,
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress,
        city,
        postalCode,
        paymentMethod,
        subtotal: Number(subtotal) || 0,
        shippingFee: Number(shippingFee) || 0,
        total: Number(total) || 0,
        items,
      });

      res.status(201).json({ success: true, order });
    } catch (err: any) {
      console.error('[API Orders Error]', err);
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/orders', async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
      const orders = await getOrders(limit);
      res.json(orders);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/newsletter', async (req, res) => {
    try {
      const { email } = req.body;
      if (!email || !email.includes('@')) {
        return res.status(400).json({ error: 'Correo electrónico inválido' });
      }
      const subscriber = await addSubscriber(email);
      res.json({ success: true, subscriber });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Serve Vite frontend in dev or static dist in prod
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
    console.log(`Neon PostgreSQL database attached and ready.`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
