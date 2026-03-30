import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, ChevronLeft, ChevronRight, Package, CheckCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const CATEGORY_COLORS = {
  Elektronika: 'from-blue-500 to-indigo-600',
  Ubrania: 'from-pink-500 to-rose-600',
  Zabawki: 'from-amber-400 to-orange-500',
  'Środki czystości': 'from-emerald-400 to-teal-600',
  'Akcesoria meblowe': 'from-violet-500 to-purple-700',
  Narzędzia: 'from-red-500 to-red-700',
  Inne: 'from-gray-400 to-gray-600',
};

export default function ProductModal({ product, onClose }) {
  const [imgIndex, setImgIndex] = useState(0);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const isOutOfStock = product.quantity === 0 || product.status === 'out_of_stock';
  const isLowStock = !isOutOfStock && product.quantity <= 2;
  const gradient = CATEGORY_COLORS[product.category] || CATEGORY_COLORS['Inne'];

  const handleAdd = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const images = product.images?.length ? product.images : null;
  const prevImg = () => setImgIndex((i) => (i - 1 + (images?.length || 1)) % (images?.length || 1));
  const nextImg = () => setImgIndex((i) => (i + 1) % (images?.length || 1));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image section */}
        <div className="relative md:w-1/2 bg-gray-50 flex-shrink-0">
          <div className="aspect-square w-full relative overflow-hidden">
            {images ? (
              <>
                <AnimatePresence mode="wait">
                  <motion.img
                    key={imgIndex}
                    src={images[imgIndex]}
                    alt={product.name}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>
                {images.length > 1 && (
                  <>
                    <button onClick={prevImg} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow hover:scale-110 transition-transform">
                      <ChevronLeft size={16} />
                    </button>
                    <button onClick={nextImg} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow hover:scale-110 transition-transform">
                      <ChevronRight size={16} />
                    </button>
                    {/* Dots */}
                    <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                      {images.map((_, i) => (
                        <button key={i} onClick={() => setImgIndex(i)} className={`w-2 h-2 rounded-full transition-all ${i === imgIndex ? 'bg-blue-600 w-4' : 'bg-gray-300'}`} />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className={`w-full h-full bg-gradient-to-br ${gradient} flex flex-col items-center justify-center`}>
                <Package size={64} className="text-white/60" />
              </div>
            )}
          </div>

          {/* Thumbnail strip */}
          {images?.length > 1 && (
            <div className="flex gap-2 px-4 pb-4 overflow-x-auto">
              {images.map((img, i) => (
                <button key={i} onClick={() => setImgIndex(i)} className={`w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${i === imgIndex ? 'border-blue-500' : 'border-transparent'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info section */}
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Close */}
          <div className="flex justify-end p-4 pb-0">
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          <div className="px-6 pb-6 flex flex-col flex-1">
            {/* Category */}
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full w-fit mb-3">
              {product.category}
            </span>

            {/* Badges */}
            <div className="flex gap-2 mb-3">
              {product.is_new && <span className="badge bg-blue-600 text-white">Nowość</span>}
              {isLowStock && <span className="badge bg-orange-500 text-white">Ostatnie {product.quantity} szt.</span>}
              {isOutOfStock && <span className="badge bg-gray-400 text-white">Wyprzedane</span>}
            </div>

            <h2 className="text-xl font-bold text-gray-900 mb-3 leading-tight">{product.name}</h2>

            {product.description && (
              <p className="text-sm text-gray-600 leading-relaxed mb-5">{product.description}</p>
            )}

            {/* Price */}
            <div className="mt-auto pt-4 border-t border-gray-100">
              <div className="flex items-end gap-2 mb-4">
                <span className="text-3xl font-extrabold text-gray-900">{product.price.toFixed(2)}</span>
                <span className="text-lg font-semibold text-gray-500 pb-0.5">zł</span>
              </div>

              <button
                onClick={handleAdd}
                disabled={isOutOfStock}
                className={`w-full py-3.5 rounded-2xl font-semibold text-base flex items-center justify-center gap-2 transition-all duration-300 ${
                  isOutOfStock
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : added
                    ? 'bg-green-500 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white active:scale-95'
                }`}
              >
                <AnimatePresence mode="wait">
                  {added ? (
                    <motion.span key="added" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                      <CheckCircle size={18} />
                      Dodano do koszyka!
                    </motion.span>
                  ) : (
                    <motion.span key="add" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                      <ShoppingCart size={18} />
                      {isOutOfStock ? 'Brak w magazynie' : 'Dodaj do koszyka'}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              <p className="text-xs text-gray-400 text-center mt-3">🚚 Dostawa 24–48h &nbsp;•&nbsp; 🔄 Zwroty 14 dni</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
