/**
 * SQLite database using better-sqlite3 (synchronous API).
 * DB file path: DB_PATH env var (Railway volume) or ./data/qwapek.db locally.
 */
const { Database } = require('node-sqlite3-wasm');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

// DB stored in DB_PATH env var (Railway volume) or local ./data/
const dbDir = process.env.DB_PATH || path.join(__dirname, 'data');
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
const dbFile = path.join(dbDir, 'qwapek.db');

const sqlite = new Database(dbFile);
sqlite.exec('PRAGMA foreign_keys = ON');

function nowISO() { return new Date().toISOString(); }

/* ─── Schema ─────────────────────────────────────────────── */
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS admin (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'worker',
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    icon TEXT DEFAULT 'Package',
    color TEXT DEFAULT 'gray',
    "order" INTEGER DEFAULT 0,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT DEFAULT '',
    category TEXT NOT NULL,
    price REAL NOT NULL,
    quantity INTEGER DEFAULT 0,
    status TEXT DEFAULT 'available',
    is_new INTEGER DEFAULT 0,
    images TEXT DEFAULT '[]',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_number TEXT NOT NULL,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    items TEXT NOT NULL,
    total REAL NOT NULL,
    notes TEXT DEFAULT '',
    status TEXT DEFAULT 'new',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read INTEGER DEFAULT 0,
    created_at TEXT NOT NULL
  );
`);

/* ─── Seed admin ─────────────────────────────────────────── */
// Add role column if migrating from old schema
try { sqlite.exec('ALTER TABLE admin ADD COLUMN role TEXT NOT NULL DEFAULT \'worker\''); } catch {}

if (sqlite.get('SELECT COUNT(*) as c FROM admin').c === 0) {
  sqlite.run('INSERT INTO admin (username, password_hash, role, created_at) VALUES (?, ?, ?, ?)',
    ['admin', bcrypt.hashSync('admin123', 10), 'owner', nowISO()]);
  console.log('✓ Domyślny admin: login=admin, hasło=admin123');
}

/* ─── Ensure required accounts ───────────────────────────── */
// Qwapek – owner
if (!sqlite.get('SELECT id FROM admin WHERE username = ?', ['Qwapek'])) {
  sqlite.run('INSERT INTO admin (username, password_hash, role, created_at) VALUES (?, ?, ?, ?)',
    ['Qwapek', bcrypt.hashSync('asdasd123', 10), 'owner', nowISO()]);
  console.log('✓ Konto Qwapek (owner) utworzone');
}
// Ensure Jerzusz is owner
const jerzusz = sqlite.get('SELECT id, role FROM admin WHERE username = ?', ['Jerzusz']);
if (jerzusz && jerzusz.role !== 'owner') {
  sqlite.run('UPDATE admin SET role = ? WHERE id = ?', ['owner', jerzusz.id]);
  console.log('✓ Jerzusz ustawiony jako owner');
}

/* ─── Seed categories ────────────────────────────────────── */
if (sqlite.get('SELECT COUNT(*) as c FROM categories').c === 0) {
  const cats = [
    { name: 'Elektronika',       icon: 'Zap',       color: 'blue',    order: 1 },
    { name: 'Ubrania',           icon: 'Shirt',     color: 'pink',    order: 2 },
    { name: 'Zabawki',           icon: 'Gamepad2',  color: 'amber',   order: 3 },
    { name: 'Środki czystości',  icon: 'Sparkles',  color: 'emerald', order: 4 },
    { name: 'Akcesoria meblowe', icon: 'Sofa',      color: 'violet',  order: 5 },
    { name: 'Narzędzia',         icon: 'Wrench',    color: 'red',     order: 6 },
    { name: 'Inne',              icon: 'Package',   color: 'gray',    order: 7 },
  ];
  cats.forEach(c => sqlite.run(
    'INSERT INTO categories (name, icon, color, "order", created_at) VALUES (?, ?, ?, ?, ?)',
    [c.name, c.icon, c.color, c.order, nowISO()]
  ));
}

/* ─── Seed products ──────────────────────────────────────── */
if (sqlite.get('SELECT COUNT(*) as c FROM products').c === 0) {
  const samples = [
    { name: 'Smartwatch Samsung Galaxy Watch 5', description: 'Zwrotowy smartwatch w bardzo dobrym stanie. Kompletny zestaw z ładowarką i opaską. Ekran AMOLED, GPS, pomiar tętna.', category: 'Elektronika', price: 299.99, quantity: 3, is_new: 1 },
    { name: 'Słuchawki Sony WH-1000XM4', description: 'Sony WH-1000XM4 z aktywną redukcją hałasu. Zwrot klienta, pełna sprawność techniczna. Czas pracy baterii do 30h.', category: 'Elektronika', price: 449.99, quantity: 1, is_new: 1 },
    { name: 'Tablet Lenovo Tab M10 Plus', description: '10.3" FHD, 4GB RAM, 64GB, Android 12. Lekkie ślady użytkowania, kompletny zestaw.', category: 'Elektronika', price: 599.99, quantity: 2, is_new: 0 },
    { name: 'Kurtka zimowa damska rozm. L', description: 'Ciepła kurtka zimowa z kapturem, wypełnienie puch syntetyczny. Kolor czarny, rozmiar L. Stan bardzo dobry.', category: 'Ubrania', price: 89.99, quantity: 1, is_new: 0 },
    { name: 'Buty sportowe Nike Air Max 42', description: 'Nike Air Max 270, rozmiar 42. Stan idealny, nieużywane. Oryginalne pudełko.', category: 'Ubrania', price: 199.99, quantity: 1, is_new: 1 },
    { name: 'Bluza Adidas męska M', description: 'Bluza dresowa Adidas Essentials, rozmiar M, kolor granatowy. Zwrot, nieużywana.', category: 'Ubrania', price: 69.99, quantity: 4, is_new: 0 },
    { name: 'LEGO Technic Bugatti Chiron 42083', description: 'Kompletny zestaw LEGO Technic, pudełko otwarte ale wszystkie elementy w oryginalnych woreczkach. 3599 klocków.', category: 'Zabawki', price: 249.99, quantity: 2, is_new: 1 },
    { name: 'Zestaw środków czystości premium (10 szt)', description: 'Mix produktów znanych marek: Fairy, Ariel, Domestos. Wszystkie nieużywane.', category: 'Środki czystości', price: 49.99, quantity: 8, is_new: 0 },
    { name: 'Odkurzacz bezworkowy Rowenta', description: 'Rowenta Silence Force – bardzo cichy, 4.5L pojemność. Zwrot klienta, używany 1 tydzień.', category: 'Środki czystości', price: 329.99, quantity: 1, is_new: 0 },
    { name: 'Krzesło biurowe ergonomiczne', description: 'Fotel biurowy z regulacją wysokości, podłokietnikami i podparciem lędźwiowym. Wymaga złożenia.', category: 'Akcesoria meblowe', price: 299.99, quantity: 1, is_new: 0 },
    { name: 'Lampka biurowa LED z USB', description: 'Lampka LED z regulacją jasności i temperatury barwowej, port USB do ładowania. Nowa, nieużywana.', category: 'Akcesoria meblowe', price: 79.99, quantity: 3, is_new: 1 },
    { name: 'Zestaw narzędzi 108 elementów', description: 'Kompletny zestaw narzędzi ręcznych w walizce: klucze, śrubokręty, młotek, poziomnica. Nowy.', category: 'Narzędzia', price: 129.99, quantity: 4, is_new: 1 },
    { name: 'Wiertarko-wkrętarka Bosch PSB 18', description: 'Bosch PSB 18 LI-2, 18V, 2 akumulatory w zestawie. Zwrot magazynowy, nieużywana.', category: 'Narzędzia', price: 399.99, quantity: 2, is_new: 1 },
    { name: 'Mix kosmetyki i akcesoria (paczka S)', description: 'Losowy mix kosmetyków i akcesoriów z palety zwrotów. Wartość detaliczna min. 3x ceny zakupu.', category: 'Inne', price: 39.99, quantity: 10, is_new: 0 },
  ];
  const ts = nowISO();
  samples.forEach(s => sqlite.run(
    'INSERT INTO products (name, description, category, price, quantity, status, is_new, images, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [s.name, s.description, s.category, s.price, s.quantity, 'available', s.is_new, '[]', ts, ts]
  ));
  console.log(`✓ Dodano ${samples.length} przykładowych produktów`);
}

/* ─── Row parsers ────────────────────────────────────────── */
function parseProduct(row) {
  if (!row) return null;
  return { ...row, images: JSON.parse(row.images || '[]'), is_new: Boolean(row.is_new) };
}
function parseOrder(row) {
  if (!row) return null;
  return { ...row, items: JSON.parse(row.items || '[]') };
}
function parseMessage(row) {
  if (!row) return null;
  return { ...row, is_read: Boolean(row.is_read) };
}

/* ══════════════════════════════════════════════════════════════
   DATABASE API  (same interface as before – routes unchanged)
══════════════════════════════════════════════════════════════ */
const db = {
  /* ─── Products ─────────────────────────────────────────────── */
  products: {
    getAll({ category, search, status, page = 1, limit = 20 } = {}) {
      const conds = ['1=1'];
      const params = [];
      if (category && category !== 'Wszystkie') { conds.push('category = ?'); params.push(category); }
      if (search) { conds.push('(name LIKE ? OR description LIKE ?)'); params.push(`%${search}%`, `%${search}%`); }
      if (status) { conds.push('status = ?'); params.push(status); }
      const where = conds.join(' AND ');
      const total = sqlite.get(`SELECT COUNT(*) as c FROM products WHERE ${where}`, params).c;
      const records = sqlite.all(
        `SELECT * FROM products WHERE ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
        [...params, limit, (page - 1) * limit]
      ).map(parseProduct);
      return { records, total };
    },

    getById(id) {
      return parseProduct(sqlite.get('SELECT * FROM products WHERE id = ?', [id]));
    },

    create(data) {
      const ts = nowISO();
      const { lastInsertRowid } = sqlite.run(
        'INSERT INTO products (name, description, category, price, quantity, status, is_new, images, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [data.name, data.description || '', data.category, data.price, data.quantity || 0,
         data.status || 'available', data.is_new ? 1 : 0, JSON.stringify(data.images || []), ts, ts]
      );
      return parseProduct(sqlite.get('SELECT * FROM products WHERE id = ?', [lastInsertRowid]));
    },

    update(id, data) {
      const existing = parseProduct(sqlite.get('SELECT * FROM products WHERE id = ?', [id]));
      if (!existing) return null;
      const merged = { ...existing, ...data };
      sqlite.run(
        'UPDATE products SET name=?, description=?, category=?, price=?, quantity=?, status=?, is_new=?, images=?, updated_at=? WHERE id=?',
        [merged.name, merged.description, merged.category, merged.price, merged.quantity,
         merged.status, merged.is_new ? 1 : 0, JSON.stringify(merged.images || []), nowISO(), id]
      );
      return parseProduct(sqlite.get('SELECT * FROM products WHERE id = ?', [id]));
    },

    delete(id) {
      const row = sqlite.get('SELECT * FROM products WHERE id = ?', [id]);
      if (!row) return null;
      sqlite.run('DELETE FROM products WHERE id = ?', [id]);
      return parseProduct(row);
    },
  },

  /* ─── Orders ───────────────────────────────────────────────── */
  orders: {
    getAll({ status, page = 1, limit = 20 } = {}) {
      const conds = ['1=1'];
      const params = [];
      if (status) { conds.push('status = ?'); params.push(status); }
      const where = conds.join(' AND ');
      const total = sqlite.get(`SELECT COUNT(*) as c FROM orders WHERE ${where}`, params).c;
      const records = sqlite.all(
        `SELECT * FROM orders WHERE ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
        [...params, limit, (page - 1) * limit]
      ).map(parseOrder);
      return { records, total };
    },

    create(data) {
      const ts = nowISO();
      const { lastInsertRowid } = sqlite.run(
        'INSERT INTO orders (order_number, name, phone, email, address, city, postal_code, items, total, notes, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [data.order_number, data.name, data.phone, data.email, data.address, data.city,
         data.postal_code, JSON.stringify(data.items || []), data.total, data.notes || '',
         data.status || 'new', ts, ts]
      );
      return parseOrder(sqlite.get('SELECT * FROM orders WHERE id = ?', [lastInsertRowid]));
    },

    updateStatus(id, status) {
      const { changes } = sqlite.run('UPDATE orders SET status=?, updated_at=? WHERE id=?', [status, nowISO(), id]);
      if (changes === 0) return null;
      return parseOrder(sqlite.get('SELECT * FROM orders WHERE id = ?', [id]));
    },

    getStats() {
      const total = sqlite.get('SELECT COUNT(*) as c FROM orders').c;
      const revenue = sqlite.get("SELECT COALESCE(SUM(total), 0) as s FROM orders WHERE status = 'completed'").s;
      return { total, revenue };
    },

    getFinancials() {
      // Total revenue from completed orders
      const totalRevenue = sqlite.get("SELECT COALESCE(SUM(total), 0) as s FROM orders WHERE status = 'completed'").s;

      // Weekly revenue (last 7 days, completed only)
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const weekRevenue = sqlite.get("SELECT COALESCE(SUM(total), 0) as s FROM orders WHERE status = 'completed' AND created_at >= ?", [weekAgo]).s;
      const weekOrders = sqlite.get("SELECT COUNT(*) as c FROM orders WHERE status = 'completed' AND created_at >= ?", [weekAgo]).c;

      // Monthly projection (week * 4.33)
      const monthlyProjection = weekRevenue * (30 / 7);

      // Last 30 days revenue (completed)
      const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const monthRevenue = sqlite.get("SELECT COALESCE(SUM(total), 0) as s FROM orders WHERE status = 'completed' AND created_at >= ?", [monthAgo]).s;
      const monthOrders = sqlite.get("SELECT COUNT(*) as c FROM orders WHERE status = 'completed' AND created_at >= ?", [monthAgo]).c;

      // Stock value: sum of price * quantity for available products
      const stockValue = sqlite.get("SELECT COALESCE(SUM(price * quantity), 0) as s FROM products WHERE status = 'available' AND quantity > 0").s;
      const stockItems = sqlite.get("SELECT COALESCE(SUM(quantity), 0) as c FROM products WHERE status = 'available' AND quantity > 0").c;
      const stockProducts = sqlite.get("SELECT COUNT(*) as c FROM products WHERE status = 'available' AND quantity > 0").c;

      // Daily breakdown last 7 days (completed)
      const dailySales = sqlite.all(
        "SELECT DATE(created_at) as day, COALESCE(SUM(total), 0) as revenue, COUNT(*) as orders FROM orders WHERE status = 'completed' AND created_at >= ? GROUP BY DATE(created_at) ORDER BY day ASC",
        [weekAgo]
      );

      return {
        totalRevenue,
        weekRevenue,
        weekOrders,
        monthlyProjection,
        monthRevenue,
        monthOrders,
        stockValue,
        stockItems,
        stockProducts,
        dailySales,
      };
    },
  },

  /* ─── Messages ─────────────────────────────────────────────── */
  messages: {
    getAll({ page = 1, limit = 20 } = {}) {
      const total = sqlite.get('SELECT COUNT(*) as c FROM messages').c;
      const unread = sqlite.get('SELECT COUNT(*) as c FROM messages WHERE is_read = 0').c;
      const records = sqlite.all(
        'SELECT * FROM messages ORDER BY created_at DESC LIMIT ? OFFSET ?',
        [limit, (page - 1) * limit]
      ).map(parseMessage);
      return { records, total, unread };
    },

    create(data) {
      const { lastInsertRowid } = sqlite.run(
        'INSERT INTO messages (name, email, message, is_read, created_at) VALUES (?, ?, ?, 0, ?)',
        [data.name, data.email, data.message, nowISO()]
      );
      return parseMessage(sqlite.get('SELECT * FROM messages WHERE id = ?', [lastInsertRowid]));
    },

    markRead(id) {
      const { changes } = sqlite.run('UPDATE messages SET is_read = 1 WHERE id = ?', [id]);
      if (changes === 0) return null;
      return parseMessage(sqlite.get('SELECT * FROM messages WHERE id = ?', [id]));
    },
  },

  /* ─── Admin ────────────────────────────────────────────────── */
  admin: {
    findByUsername(username) {
      return sqlite.get('SELECT * FROM admin WHERE username = ?', [username]) || null;
    },
    findById(id) {
      return sqlite.get('SELECT * FROM admin WHERE id = ?', [id]) || null;
    },
    getAll() {
      return sqlite.all('SELECT id, username, role, created_at FROM admin ORDER BY id ASC');
    },
    create(data) {
      const { lastInsertRowid } = sqlite.run(
        'INSERT INTO admin (username, password_hash, role, created_at) VALUES (?, ?, ?, ?)',
        [data.username, bcrypt.hashSync(data.password, 10), data.role || 'worker', nowISO()]
      );
      const row = sqlite.get('SELECT id, username, role, created_at FROM admin WHERE id = ?', [lastInsertRowid]);
      return row;
    },
    update(id, data) {
      const existing = sqlite.get('SELECT * FROM admin WHERE id = ?', [id]);
      if (!existing) return null;
      const fields = [];
      const params = [];
      if (data.username) { fields.push('username = ?'); params.push(data.username); }
      if (data.password) { fields.push('password_hash = ?'); params.push(bcrypt.hashSync(data.password, 10)); }
      if (data.role) { fields.push('role = ?'); params.push(data.role); }
      if (fields.length === 0) return existing;
      params.push(id);
      sqlite.run(`UPDATE admin SET ${fields.join(', ')} WHERE id = ?`, params);
      return sqlite.get('SELECT id, username, role, created_at FROM admin WHERE id = ?', [id]);
    },
    delete(id) {
      const existing = sqlite.get('SELECT id, username, role, created_at FROM admin WHERE id = ?', [id]);
      if (!existing) return null;
      sqlite.run('DELETE FROM admin WHERE id = ?', [id]);
      return existing;
    },
  },

  /* ─── Categories ───────────────────────────────────────────── */
  categories: {
    getAll() {
      return sqlite.all('SELECT * FROM categories ORDER BY "order" ASC');
    },
    getById(id) {
      return sqlite.get('SELECT * FROM categories WHERE id = ?', [id]) || null;
    },
    create(data) {
      const maxOrder = (sqlite.get('SELECT MAX("order") as m FROM categories') || {}).m || 0;
      const { lastInsertRowid } = sqlite.run(
        'INSERT INTO categories (name, icon, color, "order", created_at) VALUES (?, ?, ?, ?, ?)',
        [data.name, data.icon || 'Package', data.color || 'gray', maxOrder + 1, nowISO()]
      );
      return sqlite.get('SELECT * FROM categories WHERE id = ?', [lastInsertRowid]);
    },
    update(id, data) {
      const existing = sqlite.get('SELECT * FROM categories WHERE id = ?', [id]);
      if (!existing) return null;
      sqlite.run('UPDATE categories SET name=?, icon=?, color=? WHERE id=?',
        [data.name || existing.name, data.icon || existing.icon, data.color || existing.color, id]);
      return sqlite.get('SELECT * FROM categories WHERE id = ?', [id]);
    },
    delete(id) {
      const existing = sqlite.get('SELECT * FROM categories WHERE id = ?', [id]);
      if (!existing) return null;
      sqlite.run('DELETE FROM categories WHERE id = ?', [id]);
      return existing;
    },
  },
};

module.exports = db;
