require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',').map(o => o.trim());
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serwowanie uploadu
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Trasy
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/categories', require('./routes/categories'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Obsługa błędów
app.use((err, req, res, next) => {
  console.error(err.stack);
  if (err.message === 'Only images are allowed') {
    return res.status(400).json({ message: 'Dozwolone są tylko pliki graficzne' });
  }
  res.status(500).json({ message: 'Błąd serwera' });
});

app.listen(PORT, () => {
  console.log(`✓ Qwapek API działa na http://localhost:${PORT}`);
});
