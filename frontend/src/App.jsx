import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AdminProvider } from './context/AdminContext';
import ShopLayout from './components/layout/ShopLayout';
import Home from './pages/Home';
import Contact from './pages/Contact';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminProductForm from './pages/admin/AdminProductForm';
import AdminOrders from './pages/admin/AdminOrders';
import AdminMessages from './pages/admin/AdminMessages';
import AdminCategories from './pages/admin/AdminCategories';
import AdminUsers from './pages/admin/AdminUsers';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PrivacyPolicy from './pages/PrivacyPolicy';

export default function App() {
  return (
    <Router>
      <AdminProvider>
        <CartProvider>
          <Routes>
            {/* Shop */}
            <Route element={<ShopLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/kontakt" element={<Contact />} />
              <Route path="/polityka-prywatnosci" element={<PrivacyPolicy />} />
            </Route>

            {/* Admin login */}
            <Route path="/admin" element={<AdminLogin />} />

            {/* Protected admin */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="produkty" element={<AdminProducts />} />
              <Route path="produkty/nowy" element={<AdminProductForm />} />
              <Route path="produkty/edytuj/:id" element={<AdminProductForm />} />
              <Route path="kategorie" element={<AdminCategories />} />
              <Route path="zamowienia" element={<AdminOrders />} />
              <Route path="wiadomosci" element={<AdminMessages />} />
              <Route path="uzytkownicy" element={<AdminUsers />} />
            </Route>
          </Routes>
        </CartProvider>
      </AdminProvider>
    </Router>
  );
}
