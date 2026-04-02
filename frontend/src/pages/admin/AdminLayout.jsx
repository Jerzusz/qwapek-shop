import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package, ShoppingBag, MessageSquare, LayoutDashboard,
  LogOut, Menu, X, ChevronRight, ExternalLink, Tags, Users, TrendingUp, KeyRound, Loader2
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { authApi } from '../../api';

const NAV_ITEMS = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['owner', 'trusted', 'worker'] },
  { to: '/admin/produkty', icon: Package, label: 'Produkty', roles: ['owner', 'trusted'] },
  { to: '/admin/kategorie', icon: Tags, label: 'Kategorie', roles: ['owner', 'trusted'] },
  { to: '/admin/zamowienia', icon: ShoppingBag, label: 'Zamówienia', roles: ['owner', 'trusted', 'worker'] },
  { to: '/admin/wiadomosci', icon: MessageSquare, label: 'Wiadomości', roles: ['owner', 'trusted'] },
  { to: '/admin/wartosci', icon: TrendingUp, label: 'Wartości', roles: ['owner'] },
  { to: '/admin/uzytkownicy', icon: Users, label: 'Użytkownicy', roles: ['owner'] },
];

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pwModal, setPwModal] = useState(false);
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');
  const { username, role, logout } = useAdmin();
  const navigate = useNavigate();

  const NAV = NAV_ITEMS.filter(item => item.roles.includes(role));

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  const openPwModal = () => {
    setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setPwError('');
    setPwSuccess('');
    setPwModal(true);
  };

  const handleChangePassword = async () => {
    setPwError('');
    setPwSuccess('');
    if (!pwForm.currentPassword) return setPwError('Podaj aktualne hasło');
    if (!pwForm.newPassword) return setPwError('Podaj nowe hasło');
    if (pwForm.newPassword.length < 6) return setPwError('Nowe hasło musi mieć min. 6 znaków');
    if (pwForm.newPassword !== pwForm.confirmPassword) return setPwError('Hasła nie są identyczne');

    setPwSaving(true);
    try {
      await authApi.changePassword({
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      });
      setPwSuccess('Hasło zostało zmienione!');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setPwModal(false), 1500);
    } catch (err) {
      setPwError(err.response?.data?.message || 'Błąd zmiany hasła');
    } finally {
      setPwSaving(false);
    }
  };

  const Sidebar = ({ mobile = false }) => (
    <div className={`flex flex-col h-full bg-gray-900 text-white ${mobile ? 'w-72' : 'w-64'}`}>
      {/* Logo */}
      <div className="px-5 py-6 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <Package size={18} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-sm">Qwapek Admin</p>
            <p className="text-xs text-gray-400">{username}</p>
          </div>
        </div>
        {mobile && (
          <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-lg hover:bg-white/10">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => mobile && setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <Icon size={18} />
            {label}
            <ChevronRight size={14} className="ml-auto opacity-40" />
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/10 space-y-1">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-400 hover:bg-white/10 hover:text-white transition-all"
        >
          <ExternalLink size={16} />
          Podgląd sklepu
        </a>
        <button
          onClick={openPwModal}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-400 hover:bg-white/10 hover:text-white transition-all"
        >
          <KeyRound size={16} />
          Zmień hasło
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-400 hover:bg-red-500/20 hover:text-red-400 transition-all"
        >
          <LogOut size={16} />
          Wyloguj się
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col flex-shrink-0 h-screen sticky top-0">
        <Sidebar />
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 z-50 md:hidden"
            >
              <Sidebar mobile />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile topbar */}
        <header className="md:hidden bg-white border-b border-gray-200 px-4 h-14 flex items-center gap-3 sticky top-0 z-30">
          <button onClick={() => setMobileOpen(true)} className="p-2 rounded-xl hover:bg-gray-100">
            <Menu size={20} className="text-gray-700" />
          </button>
          <span className="font-bold text-gray-900">Qwapek Admin</span>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Password change modal */}
      <AnimatePresence>
        {pwModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
              onClick={() => setPwModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={() => setPwModal(false)}
            >
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                  <h3 className="font-bold text-gray-900">Zmień hasło</h3>
                  <button onClick={() => setPwModal(false)} className="p-2 rounded-lg hover:bg-gray-100">
                    <X size={18} className="text-gray-500" />
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  {pwError && <div className="p-3 bg-red-50 text-red-700 rounded-xl text-sm">{pwError}</div>}
                  {pwSuccess && <div className="p-3 bg-green-50 text-green-700 rounded-xl text-sm">{pwSuccess}</div>}
                  <div>
                    <label className="label">Aktualne hasło</label>
                    <input
                      type="password"
                      value={pwForm.currentPassword}
                      onChange={(e) => setPwForm((f) => ({ ...f, currentPassword: e.target.value }))}
                      className="input"
                      autoComplete="current-password"
                    />
                  </div>
                  <div>
                    <label className="label">Nowe hasło</label>
                    <input
                      type="password"
                      value={pwForm.newPassword}
                      onChange={(e) => setPwForm((f) => ({ ...f, newPassword: e.target.value }))}
                      className="input"
                      autoComplete="new-password"
                    />
                  </div>
                  <div>
                    <label className="label">Powtórz nowe hasło</label>
                    <input
                      type="password"
                      value={pwForm.confirmPassword}
                      onChange={(e) => setPwForm((f) => ({ ...f, confirmPassword: e.target.value }))}
                      className="input"
                      autoComplete="new-password"
                    />
                  </div>
                </div>
                <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
                  <button onClick={() => setPwModal(false)} className="btn-secondary flex-1">Anuluj</button>
                  <button onClick={handleChangePassword} disabled={pwSaving} className="btn-primary flex-1 gap-2">
                    {pwSaving ? <Loader2 size={16} className="animate-spin" /> : null}
                    Zmień hasło
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
