import express from "express";
import cors from "cors";
import pool from "./db.js";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// Needed in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root
dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ message: "API is running successfully 🚀" });
});

app.get("/api/users", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email FROM users ORDER BY id ASC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Database query failed:", error);
    res.status(500).json({ error: "Database query failed" });
  }
});

app.post("/api/users", async (req, res) => {
  try {
    const { name, email } = req.body;

    const result = await pool.query(
      "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id, name, email",
      [name, email]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Insert failed:", error);
    res.status(500).json({ error: "Insert failed" });
  }
});

const productMap = {
  'city-bike': 'VTT standard - 20€ / day',
  'mountain-bike': 'VTT with baby seat - 24€ / day',
  'electric-scooter': 'BMX bike - 22€ / day',
  'e-bike': 'Neomouv e-bike - 38€ / day',
  'foldable e-bike': 'Ness Icon foldable e-bike - 34€ / day',
  'electric fatbike': 'Sduro Fatsix electric fatbike - 48€ / day',
  'vespa': 'Vespa scooter - 55€ / day',
  'motorcycle': 'Moto Guzzi motorcycle - 75€ / day',
  'dirt bike': 'KTM 300 XC dirt bike - 85€ / day'
};

app.post('/api/orders', async (req, res) => {
  try {
    const { product, quantity, startDate, endDate, firstName, lastName, email, phoneNumber, plan, acceptTerms, subscribeNewsletter, message } = req.body;

    const productName = productMap[product] || product;
    const isReturningCustomer = plan === 'yes';

    // Insert user
    const userResult = await pool.query(
      'INSERT INTO users (first_name, last_name, email, phone_number, is_returning_customer, subscribed_newsletter) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [firstName, lastName, email, phoneNumber, isReturningCustomer, subscribeNewsletter]
    );

    const userId = userResult.rows[0].id;

    // Insert rental
    const rentalResult = await pool.query(
      'INSERT INTO rentals (user_id, product_name, quantity, start_date, end_date, additional_notes, accepted_terms) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      [userId, productName, quantity, startDate, endDate, message || null, acceptTerms]
    );

    res.status(201).json({ message: 'Order created successfully', orderId: rentalResult.rows[0].id });
  } catch (error) {
    console.error('Order insert failed:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT r.id, r.product_name, r.quantity, r.start_date, r.end_date, r.additional_notes, r.accepted_terms, r.created_at,
             u.first_name, u.last_name, u.email, u.phone_number, u.is_returning_customer, u.subscribed_newsletter
      FROM rentals r
      JOIN users u ON r.user_id = u.id
      ORDER BY r.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Fetch orders failed:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

app.listen(PORT, () => {
  console.log(`API listening on port ${PORT}`);
});