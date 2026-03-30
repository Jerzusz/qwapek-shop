const express = require('express');
const router = express.Router();
const db = require('../database');
const { authenticateToken } = require('../middleware/authMiddleware');

// GET /api/categories – public
router.get('/', (req, res) => {
  try {
    res.json(db.categories.getAll());
  } catch (err) {
    res.status(500).json({ message: 'Błąd serwera', error: err.message });
  }
});

// POST /api/categories – admin only
router.post('/', authenticateToken, (req, res) => {
  try {
    const { name, icon, color } = req.body;
    if (!name || !name.trim()) return res.status(400).json({ message: 'Podaj nazwę kategorii' });
    const all = db.categories.getAll();
    if (all.some(c => c.name.toLowerCase() === name.trim().toLowerCase())) {
      return res.status(409).json({ message: 'Kategoria o tej nazwie już istnieje' });
    }
    const category = db.categories.create({ name: name.trim(), icon: icon || 'Package', color: color || 'gray' });
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: 'Błąd serwera', error: err.message });
  }
});

// PUT /api/categories/:id – admin only
router.put('/:id', authenticateToken, (req, res) => {
  try {
    const existing = db.categories.getById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Kategoria nie znaleziona' });
    const { name, icon, color } = req.body;
    const updated = db.categories.update(req.params.id, {
      name: name ? name.trim() : existing.name,
      icon: icon || existing.icon,
      color: color || existing.color,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Błąd serwera', error: err.message });
  }
});

// DELETE /api/categories/:id – admin only
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const existing = db.categories.getById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Kategoria nie znaleziona' });
    db.categories.delete(req.params.id);
    res.json({ message: 'Kategoria usunięta' });
  } catch (err) {
    res.status(500).json({ message: 'Błąd serwera', error: err.message });
  }
});

module.exports = router;
