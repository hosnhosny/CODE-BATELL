require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// الاتصال بـ PostgreSQL (ستملأها Railway لاحقاً)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// إنشاء الجدول تلقائياً
const initTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    );
  `);
};
initTable();

// تسجيل حساب جديد
app.post('/api/signup', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3)', [name, email, hashed]);
    res.json({ message: 'تم إنشاء الحساب' });
  } catch (e) {
    if (e.code === '23505') return res.status(400).json({ message: 'البريد مستخدم' });
    res.status(500).json({ message: 'خطأ بالسيرفر' });
  }
});

// تسجيل دخول
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  if (rows.length === 0) return res.status(401).json({ message: 'بيانات خاطئة' });

  const match = await bcrypt.compare(password, rows[0].password);
  if (!match) return res.status(401).json({ message: 'بيانات خاطئة' });

  res.json({ token: 'demo-token', name: rows[0].name });
});

// فحص صحة الخادم
app.get('/', (_req, res) => res.send('Batell Auth API is running.'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));