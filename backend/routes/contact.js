const express = require('express');
const router = express.Router();
const db = require('../database');
const { authenticateToken } = require('../middleware/authMiddleware');

// POST /api/contact
router.post('/', (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) return res.status(400).json({ message: 'Wypełnij wszystkie pola' });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ message: 'Nieprawidłowy adres email' });
    if (message.length > 2000) return res.status(400).json({ message: 'Wiadomość za długa (max 2000 znaków)' });
    db.messages.create({ name, email, message });
    res.status(201).json({ message: 'Wiadomość wysłana. Odezwiemy się wkrótce!' });
  } catch (err) {
    res.status(500).json({ message: 'Błąd serwera', error: err.message });
  }
});

// GET /api/contact/messages – admin only
router.get('/messages', authenticateToken, (req, res) => {
  try {
    const { page, limit } = req.query;
    const result = db.messages.getAll({ page: parseInt(page) || 1, limit: parseInt(limit) || 20 });
    res.json({ messages: result.records, total: result.total, unread: result.unread });
  } catch (err) {
    res.status(500).json({ message: 'Błąd serwera', error: err.message });
  }
});

// PUT /api/contact/messages/:id/read – admin only
router.put('/messages/:id/read', authenticateToken, (req, res) => {
  try {
    const updated = db.messages.markRead(req.params.id);
    if (!updated) return res.status(404).json({ message: 'Wiadomość nie znaleziona' });
    res.json({ message: 'Zaznaczono jako przeczytane' });
  } catch (err) {
    res.status(500).json({ message: 'Błąd serwera', error: err.message });
  }
});

module.exports = router;
