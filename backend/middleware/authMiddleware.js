const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'qwapek-dev-secret-key';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Brak tokenu autoryzacji' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(403).json({ message: 'Token wygasł lub jest nieprawidłowy' });
  }
}

module.exports = { authenticateToken };
