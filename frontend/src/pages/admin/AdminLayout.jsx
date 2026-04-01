import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package, ShoppingBag, MessageSquare, LayoutDashboard,
  LogOut, Menu, X, ChevronRight, ExternalLink, Tags, Users
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

const NAV_ITEMS = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['owner', 'trusted', 'worker'] },
  { to: '/admin/produkty', icon: Package, label: 'Produkty', roles: ['owner', 'trusted'] },
  { to: '/admin/kategorie', icon: Tags, label: 'Kategorie', roles: ['owner', 'trusted'] },
  { to: '/admin/zamowienia', icon: ShoppingBag, label: 'Zamówienia', roles: ['owner', 'trusted', 'worker'] },
  { to: '/admin/wiadomosci', icon: MessageSquare, label: 'Wiadomości', roles: ['owner', 'trusted'] },
  { to: '/admin/uzytkownicy', icon: Users, label: 'Użytkownicy', roles: ['owner'] },
];

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { username, role, logout } = useAdmin();
  const navigate = useNavigate();

  const NAV = NAV_ITEMS.filter(item => item.roles.includes(role));

  const handleLogout = () => {
    logout();
    navigate('/admin');
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
    </div>
  );
}
