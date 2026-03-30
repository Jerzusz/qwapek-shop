import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Search, Menu, X, Package, ChevronDown } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import CartDrawer from '../cart/CartDrawer';

export default function Navbar({ onMenuClick }) {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { count, toggleCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`, { preventScrollReset: true });
      setSearchOpen(false);
      setSearchQuery('');
      setTimeout(() => {
        document.getElementById('products')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled ? 'bg-white/95 backdrop-blur-lg shadow-sm border-b border-gray-100' : 'bg-white/80 backdrop-blur-md'
        }`}
      >
        {/* Announcement bar */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center text-xs py-2 font-medium tracking-wide">
          🚚 Dostawa w 24–48h &nbsp;•&nbsp; 🔄 Zwroty 14 dni &nbsp;•&nbsp; 💳 Płatność przelewem
        </div>

        <nav className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
          {/* Left: hamburger + logo */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={onMenuClick}
              className="p-2 rounded-xl hover:bg-gray-100 transition-colors lg:hidden"
              aria-label="Menu kategorii"
            >
              <Menu size={22} className="text-gray-700" />
            </button>

            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Package size={16} className="text-white" />
              </div>
              <span className="font-extrabold text-xl text-gray-900 group-hover:text-blue-600 transition-colors">
                Qwapek
              </span>
              <span className="hidden sm:block text-xs text-gray-400 font-medium mt-0.5">SHOP</span>
            </Link>
          </div>

          {/* Center: category links (desktop) */}
          <div className="hidden lg:flex items-center gap-1 flex-1 px-4">
            <button
              onClick={onMenuClick}
              className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-all"
            >
              <Menu size={16} />
              Kategorie
              <ChevronDown size={14} />
            </button>
            <Link to="/?category=Elektronika" preventScrollReset className="px-3 py-2 rounded-xl text-sm text-gray-600 hover:bg-gray-100 hover:text-blue-600 transition-all">
              Elektronika
            </Link>
            <Link to="/?category=Ubrania" preventScrollReset className="px-3 py-2 rounded-xl text-sm text-gray-600 hover:bg-gray-100 hover:text-blue-600 transition-all">
              Ubrania
            </Link>
            <Link to="/?category=Narzędzia" preventScrollReset className="px-3 py-2 rounded-xl text-sm text-gray-600 hover:bg-gray-100 hover:text-blue-600 transition-all">
              Narzędzia
            </Link>
          </div>

          {/* Right: search + cart */}
          <div className="flex items-center gap-2 ml-auto">
            <AnimatePresence>
              {searchOpen && (
                <motion.form
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 260, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleSearch}
                  className="overflow-hidden"
                  style={{ maxWidth: 'calc(100vw - 175px)' }}
                >
                  <input
                    autoFocus
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Szukaj produktów..."
                    className="w-full px-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </motion.form>
              )}
            </AnimatePresence>

            <button
              onClick={() => setSearchOpen((v) => !v)}
              className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
              aria-label="Szukaj"
            >
              {searchOpen ? <X size={20} className="text-gray-700" /> : <Search size={20} className="text-gray-700" />}
            </button>

            <Link to="/kontakt" className="hidden sm:block px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
              Kontakt
            </Link>

            <button
              onClick={toggleCart}
              className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors"
              aria-label="Koszyk"
            >
              <ShoppingCart size={22} className="text-gray-700" />
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center"
                  >
                    {count > 9 ? '9+' : count}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </nav>
      </header>

      <CartDrawer />
    </>
  );
}
