import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { ShoppingCart, Eye } from 'lucide-react';

const CATEGORY_COLORS = {
  Elektronika: 'from-blue-500 to-indigo-600',
  Ubrania: 'from-pink-500 to-rose-600',
  Zabawki: 'from-amber-400 to-orange-500',
  'Środki czystości': 'from-emerald-400 to-teal-600',
  'Akcesoria meblowe': 'from-violet-500 to-purple-700',
  Narzędzia: 'from-red-500 to-red-700',
  Inne: 'from-gray-400 to-gray-600',
};

const CATEGORY_EMOJI = {
  Elektronika: '⚡',
  Ubrania: '👕',
  Zabawki: '🎮',
  'Środki czystości': '✨',
  'Akcesoria meblowe': '🛋️',
  Narzędzia: '🔧',
  Inne: '📦',
};

export default function ProductCard({ product, onClick }) {
  const { addItem } = useCart();
  const gradient = CATEGORY_COLORS[product.category] || CATEGORY_COLORS['Inne'];
  const emoji = CATEGORY_EMOJI[product.category] || '📦';
  const isLowStock = product.quantity > 0 && product.quantity <= 2;
  const isOutOfStock = product.quantity === 0 || product.status === 'out_of_stock';

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!isOutOfStock) addItem(product);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className="card group cursor-pointer relative"
      onClick={onClick}
    >
      {/* Image area */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradient} flex flex-col items-center justify-center`}>
            <span className="text-5xl mb-2">{emoji}</span>
            <span className="text-white/80 text-xs font-medium">{product.category}</span>
          </div>
        )}

        {/* Overlay on hover */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 bg-black/30 flex items-center justify-center gap-3"
        >
          <button
            onClick={(e) => { e.stopPropagation(); onClick(); }}
            className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md hover:scale-110 transition-transform"
            aria-label="Podgląd"
          >
            <Eye size={18} className="text-gray-800" />
          </button>
          {!isOutOfStock && (
            <button
              onClick={handleAddToCart}
              className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-md hover:scale-110 hover:bg-blue-700 transition-all"
              aria-label="Dodaj do koszyka"
            >
              <ShoppingCart size={18} className="text-white" />
            </button>
          )}
        </motion.div>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.is_new && (
            <span className="badge bg-blue-600 text-white">Nowość</span>
          )}
          {isLowStock && !isOutOfStock && (
            <span className="badge bg-orange-500 text-white">Ostatnie sztuki</span>
          )}
          {isOutOfStock && (
            <span className="badge bg-gray-500 text-white">Wyprzedane</span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center gap-1.5 mb-2">
          <span className={`inline-block w-2 h-2 rounded-full bg-gradient-to-br ${gradient}`} />
          <span className="text-xs text-gray-400 font-medium">{product.category}</span>
        </div>
        <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 mb-3 min-h-[2.5rem]">
          {product.name}
        </h3>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xl font-extrabold text-gray-900">{product.price.toFixed(2)}<span className="text-sm ml-0.5 font-semibold text-gray-500">zł</span></p>
            {product.quantity > 0 && !isOutOfStock && (
              <p className="text-xs text-gray-400">{product.quantity} szt. w magazynie</p>
            )}
          </div>
          <AnimatePresence>
            {!isOutOfStock && (
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleAddToCart}
                className="w-9 h-9 bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center justify-center transition-colors shadow-sm"
                aria-label="Dodaj do koszyka"
              >
                <ShoppingCart size={16} className="text-white" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
