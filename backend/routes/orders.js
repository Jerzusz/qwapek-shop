const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const db = require('../database');
const { authenticateToken, requireRole } = require('../middleware/authMiddleware');

function generateOrderNumber() {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  return `ORD-${ymd}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
}

async function sendOrderEmail(order) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) return;
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  const rows = order.items.map(item =>
    `<tr><td style="padding:8px;border-bottom:1px solid #e5e7eb">${item.name}</td><td style="padding:8px;text-align:center">${item.quantity}</td><td style="padding:8px;text-align:right">${(item.price * item.quantity).toFixed(2)} zł</td></tr>`
  ).join('');
  await transporter.sendMail({
    from: `"${process.env.SHOP_NAME || 'Qwapek Shop'}" <${process.env.SMTP_USER}>`,
    to: order.email,
    subject: `Potwierdzenie zamówienia ${order.order_number}`,
    html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto"><div style="background:linear-gradient(135deg,#1d4ed8,#4f46e5);padding:32px;border-radius:12px 12px 0 0"><h1 style="color:#fff;margin:0">Qwapek Shop</h1></div><div style="background:#fff;padding:32px;border:1px solid #e5e7eb"><h2>Dziękujemy za zamówienie!</h2><p>Numer: <strong style="color:#2563eb">${order.order_number}</strong></p><table style="width:100%;border-collapse:collapse"><thead><tr style="background:#f9fafb"><th style="padding:8px;text-align:left">Produkt</th><th style="padding:8px;text-align:center">Szt.</th><th style="padding:8px;text-align:right">Kwota</th></tr></thead><tbody>${rows}</tbody><tfoot><tr><td colspan="2" style="padding:8px;font-weight:600">Razem:</td><td style="padding:8px;font-weight:700;text-align:right;color:#2563eb">${order.total.toFixed(2)} zł</td></tr></tfoot></table><h3>Dane do przelewu:</h3><div style="background:#eff6ff;padding:16px;border-radius:8px;border-left:4px solid #2563eb"><p><strong>Numer konta:</strong> ${process.env.BANK_ACCOUNT || '—'}</p><p><strong>Odbiorca:</strong> ${process.env.SHOP_NAME || 'Qwapek Shop'}</p><p><strong>Tytuł:</strong> Zamówienie ${order.order_number}</p><p><strong>Kwota:</strong> ${order.total.toFixed(2)} zł</p></div></div></div>`,
  });
}

// POST /api/orders
router.post('/', async (req, res) => {
  try {
    const { name, phone, email, address, city, postal_code, items, notes } = req.body;
    if (!name || !phone || !email || !address || !city || !postal_code) {
      return res.status(400).json({ message: 'Wypełnij wszystkie wymagane pola' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Nieprawidłowy adres email' });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Koszyk jest pusty' });
    }
    const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const order_number = generateOrderNumber();
    const order = db.orders.create({ order_number, name, phone, email, address, city, postal_code, items, total, notes: notes || '', status: 'new' });
    try { await sendOrderEmail(order); } catch (e) { console.error('Email error:', e.message); }
    res.status(201).json({ message: 'Zamówienie złożone pomyślnie', order_number, total });
  } catch (err) {
    res.status(500).json({ message: 'Błąd serwera', error: err.message });
  }
});

// GET /api/orders/stats – admin only
router.get('/stats', authenticateToken, (req, res) => {
  try {
    const stats = db.orders.getStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: 'Błąd serwera', error: err.message });
  }
});

// GET /api/orders – admin only
router.get('/', authenticateToken, (req, res) => {
  try {
    const { status, page, limit } = req.query;
    const result = db.orders.getAll({ status: status || undefined, page: parseInt(page) || 1, limit: parseInt(limit) || 20 });
    res.json({ orders: result.records, total: result.total });
  } catch (err) {
    res.status(500).json({ message: 'Błąd serwera', error: err.message });
  }
});

// PUT /api/orders/:id/status – admin only
router.put('/:id/status', authenticateToken, (req, res) => {
  try {
    const { status } = req.body;
    if (!['new', 'processing', 'shipped', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Nieprawidłowy status' });
    }
    const updated = db.orders.updateStatus(req.params.id, status);
    if (!updated) return res.status(404).json({ message: 'Zamówienie nie znalezione' });
    res.json({ message: 'Status zaktualizowany' });
  } catch (err) {
    res.status(500).json({ message: 'Błąd serwera', error: err.message });
  }
});

module.exports = router;
