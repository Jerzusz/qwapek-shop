const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database');

const JWT_SECRET = process.env.JWT_SECRET || 'qwapek-dev-secret-key';

// POST /api/auth/login
router.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'Podaj login i hasło' });
    const user = db.admin.findByUsername(username);
    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
      return res.status(401).json({ message: 'Nieprawidłowy login lub hasło' });
    }
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, username: user.username });
  } catch (err) {
    res.status(500).json({ message: 'Błąd serwera', error: err.message });
  }
});

// POST /api/auth/verify
router.post('/verify', (req, res) => {
  try {
    const decoded = jwt.verify(req.body.token, JWT_SECRET);
    res.json({ valid: true, username: decoded.username });
  } catch {
    res.status(401).json({ valid: false });
  }
});

module.exports = router;
