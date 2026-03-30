import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Trash2, Plus, Minus, CreditCard } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useState } from 'react';
import OrderForm from '../order/OrderForm';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, total, count } = useCart();
  const [showOrder, setShowOrder] = useState(false);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
              onClick={closeCart}
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 flex flex-col shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <ShoppingCart size={20} className="text-blue-600" />
                  <h2 className="font-bold text-lg">Koszyk</h2>
                  {count > 0 && (
                    <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">{count}</span>
                  )}
                </div>
                <button onClick={closeCart} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                  <X size={20} className="text-gray-600" />
                </button>
              </div>

              {/* Items */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-3">
                    <ShoppingCart size={52} strokeWidth={1.5} />
                    <p className="font-medium">Koszyk jest pusty</p>
                    <p className="text-sm">Dodaj produkty, aby złożyć zamówienie</p>
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {items.map((item) => (
                      <motion.li
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 60 }}
                        className="flex gap-3 p-3 bg-gray-50 rounded-2xl"
                      >
                        {/* Image */}
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0">
                          {item.images?.[0] ? (
                            <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-400 text-2xl">
                              📦
                            </div>
                          )}
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-gray-900 line-clamp-2 leading-tight">{item.name}</p>
                          <p className="text-blue-600 font-bold text-sm mt-1">{(item.price * item.quantity).toFixed(2)} zł</p>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => updateQty(item.id, item.quantity - 1)}
                              className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQty(item.id, item.quantity + 1)}
                              disabled={item.quantity >= item.maxQty}
                              className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-40"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-500 text-gray-400 transition-colors self-start"
                        >
                          <Trash2 size={15} />
                        </button>
                      </motion.li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="px-6 py-5 border-t border-gray-100 bg-gray-50 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Razem:</span>
                    <span className="text-2xl font-extrabold text-gray-900">{total.toFixed(2)} zł</span>
                  </div>
                  <button
                    onClick={() => { setShowOrder(true); closeCart(); }}
                    className="w-full btn-primary py-3 text-base"
                  >
                    <CreditCard size={18} />
                    Złóż zamówienie
                  </button>
                  <p className="text-xs text-gray-400 text-center">Płatność przelewem bankowym</p>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showOrder && <OrderForm onClose={() => setShowOrder(false)} />}
      </AnimatePresence>
    </>
  );
}
