const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../database');
const { authenticateToken, requireRole } = require('../middleware/authMiddleware');

const uploadDir = path.join(__dirname, '../uploads/products');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname).toLowerCase());
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (/\.(jpeg|jpg|png|gif|webp)$/i.test(file.originalname)) cb(null, true);
    else cb(new Error('Only images are allowed'));
  },
});

// GET /api/products
router.get('/', (req, res) => {
  try {
    const { category, search, status, page, limit } = req.query;
    const result = db.products.getAll({
      category: category || undefined,
      search: search || undefined,
      status: status || undefined,
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
    });
    res.json({ products: result.records, total: result.total, page: parseInt(page) || 1, limit: parseInt(limit) || 20 });
  } catch (err) {
    res.status(500).json({ message: 'Błąd serwera', error: err.message });
  }
});

// GET /api/products/:id
router.get('/:id', (req, res) => {
  try {
    const product = db.products.getById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Produkt nie znaleziony' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Błąd serwera', error: err.message });
  }
});

// POST /api/products – owner & trusted only
router.post('/', authenticateToken, requireRole('owner', 'trusted'), upload.array('images', 10), (req, res) => {
  try {
    const { name, description, category, price, quantity, status, is_new } = req.body;
    if (!name || !category || price === undefined) {
      return res.status(400).json({ message: 'Pola name, category i price są wymagane' });
    }
    const images = req.files ? req.files.map(f => `/uploads/products/${f.filename}`) : [];
    const product = db.products.create({
      name,
      description: description || '',
      category,
      price: parseFloat(price),
      quantity: parseInt(quantity) || 0,
      images,
      status: status || 'available',
      is_new: is_new === 'true' || is_new === true,
    });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Błąd serwera', error: err.message });
  }
});

// PUT /api/products/:id – owner & trusted only
router.put('/:id', authenticateToken, requireRole('owner', 'trusted'), upload.array('images', 10), (req, res) => {
  try {
    const existing = db.products.getById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Produkt nie znaleziony' });

    const { name, description, category, price, quantity, status, is_new, keep_images } = req.body;

    let images = keep_images
      ? Array.isArray(keep_images) ? keep_images : [keep_images]
      : existing.images || [];

    if (req.files && req.files.length > 0) {
      images = [...images, ...req.files.map(f => `/uploads/products/${f.filename}`)];
    }

    const updated = db.products.update(req.params.id, {
      name: name || existing.name,
      description: description !== undefined ? description : existing.description,
      category: category || existing.category,
      price: price !== undefined ? parseFloat(price) : existing.price,
      quantity: quantity !== undefined ? parseInt(quantity) : existing.quantity,
      images,
      status: status || existing.status,
      is_new: is_new !== undefined ? (is_new === 'true' || is_new === true) : existing.is_new,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Błąd serwera', error: err.message });
  }
});

// DELETE /api/products/:id – owner & trusted only
router.delete('/:id', authenticateToken, requireRole('owner', 'trusted'), (req, res) => {
  try {
    const existing = db.products.getById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Produkt nie znaleziony' });

    (existing.images || []).forEach(imgPath => {
      const full = path.join(__dirname, '..', imgPath);
      if (fs.existsSync(full)) fs.unlinkSync(full);
    });

    db.products.delete(req.params.id);
    res.json({ message: 'Produkt usunięty' });
  } catch (err) {
    res.status(500).json({ message: 'Błąd serwera', error: err.message });
  }
});

module.exports = router;
