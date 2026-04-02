const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database');
const { authenticateToken } = require('../middleware/authMiddleware');

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
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role || 'worker' }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, username: user.username, role: user.role || 'worker' });
  } catch (err) {
    res.status(500).json({ message: 'Błąd serwera', error: err.message });
  }
});

// POST /api/auth/verify
router.post('/verify', (req, res) => {
  try {
    const decoded = jwt.verify(req.body.token, JWT_SECRET);
    res.json({ valid: true, username: decoded.username, role: decoded.role });
  } catch {
    res.status(401).json({ valid: false });
  }
});

// PUT /api/auth/change-password – any authenticated user (own password)
router.put('/change-password', authenticateToken, (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return res.status(400).json({ message: 'Podaj aktualne i nowe hasło' });
    if (newPassword.length < 6) return res.status(400).json({ message: 'Nowe hasło musi mieć min. 6 znaków' });

    const user = db.admin.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'Użytkownik nie znaleziony' });

    if (!bcrypt.compareSync(currentPassword, user.password_hash)) {
      return res.status(401).json({ message: 'Nieprawidłowe aktualne hasło' });
    }

    db.admin.update(user.id, { password: newPassword });
    res.json({ message: 'Hasło zostało zmienione' });
  } catch (err) {
    res.status(500).json({ message: 'Błąd serwera', error: err.message });
  }
});

// GET /api/auth/users – owner only
router.get('/users', authenticateToken, (req, res) => {
  try {
    if (req.user.role !== 'owner') return res.status(403).json({ message: 'Brak uprawnień' });
    const users = db.admin.getAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Błąd serwera', error: err.message });
  }
});

// POST /api/auth/users – owner only
router.post('/users', authenticateToken, (req, res) => {
  try {
    if (req.user.role !== 'owner') return res.status(403).json({ message: 'Brak uprawnień' });
    const { username, password, role } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'Podaj login i hasło' });
    if (!['owner', 'trusted', 'worker'].includes(role)) return res.status(400).json({ message: 'Nieprawidłowa rola' });
    if (db.admin.findByUsername(username)) return res.status(409).json({ message: 'Użytkownik o tej nazwie już istnieje' });
    const user = db.admin.create({ username, password, role });
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Błąd serwera', error: err.message });
  }
});

// PUT /api/auth/users/:id – owner only
router.put('/users/:id', authenticateToken, (req, res) => {
  try {
    if (req.user.role !== 'owner') return res.status(403).json({ message: 'Brak uprawnień' });
    const { username, password, role } = req.body;
    if (role && !['owner', 'trusted', 'worker'].includes(role)) return res.status(400).json({ message: 'Nieprawidłowa rola' });
    const updated = db.admin.update(parseInt(req.params.id), { username, password, role });
    if (!updated) return res.status(404).json({ message: 'Użytkownik nie znaleziony' });
    res.json(updated);
  } catch (err) {
    if (err.message?.includes('UNIQUE')) return res.status(409).json({ message: 'Nazwa użytkownika jest już zajęta' });
    res.status(500).json({ message: 'Błąd serwera', error: err.message });
  }
});

// DELETE /api/auth/users/:id – owner only
router.delete('/users/:id', authenticateToken, (req, res) => {
  try {
    if (req.user.role !== 'owner') return res.status(403).json({ message: 'Brak uprawnień' });
    const id = parseInt(req.params.id);
    if (id === req.user.id) return res.status(400).json({ message: 'Nie możesz usunąć własnego konta' });
    const deleted = db.admin.delete(id);
    if (!deleted) return res.status(404).json({ message: 'Użytkownik nie znaleziony' });
    res.json({ message: 'Użytkownik usunięty' });
  } catch (err) {
    res.status(500).json({ message: 'Błąd serwera', error: err.message });
  }
});

module.exports = router;
