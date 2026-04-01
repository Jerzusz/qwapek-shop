import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { categoriesApi } from '../../api';
import { ICON_MAP, DEFAULT_ICON, COLOR_MAP } from '../../utils/categoryUtils';

const ALL_CATEGORY = { name: 'Wszystkie', icon: 'LayoutGrid', color: 'gray', accent: '#6b7280' };

export default function Sidebar({ isOpen, onClose, activeCategory }) {
  const navigate = useNavigate();
  const [apiCategories, setApiCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    categoriesApi.getAll()
      .then(({ data }) => setApiCategories(data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categories = [ALL_CATEGORY, ...apiCategories];

  const handleCategory = (cat) => {
    navigate(cat === 'Wszystkie' ? '/' : `/?category=${encodeURIComponent(cat)}`, { preventScrollReset: true });
    onClose();
    requestAnimationFrame(() => {
      const el = document.getElementById('products');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Sidebar panel */}
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed left-0 top-0 bottom-0 w-72 bg-white z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="font-bold text-lg text-gray-900">Kategorie</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                aria-label="Zamknij"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            {/* Categories */}
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
              {loading ? (
                <>
                  {[...Array(7)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl animate-pulse">
                      <div className="w-8 h-8 bg-gray-200 rounded-lg flex-shrink-0" />
                      <div className="h-4 bg-gray-200 rounded w-24" />
                    </div>
                  ))}
                </>
              ) : (
                categories.map((cat) => {
                const Icon = ICON_MAP[cat.icon] || DEFAULT_ICON;
                const cs = COLOR_MAP[cat.color] || COLOR_MAP.gray;
                const { name, accent } = cat;
                const isActive = activeCategory === name || (name === 'Wszystkie' && !activeCategory);
                return (
                  <motion.button
                    key={name}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleCategory(name)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 text-left ${
                      isActive
                        ? 'text-white shadow-sm'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    style={isActive ? { background: `linear-gradient(135deg, ${accent}dd, ${accent})` } : {}}
                  >
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isActive ? 'bg-white/20' : `${cs.bg} ${cs.text}`}`}>
                      <Icon size={16} />
                    </span>
                    <span>{name}</span>
                    {isActive && (
                      <motion.span
                        layoutId="activeIndicator"
                        className="ml-auto w-2 h-2 bg-white rounded-full"
                      />
                    )}
                  </motion.button>
                );
              })
              )}
            </nav>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
              <p className="text-xs text-gray-400 text-center">
                Produkty z palet zwrotów<br />Świetna jakość · Niskie ceny
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
