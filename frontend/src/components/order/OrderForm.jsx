import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Loader2, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { ordersApi } from '../../api';

export default function OrderForm({ onClose }) {
  const { items, total, clearCart } = useCart();
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '', city: '', postal_code: '', notes: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');
  const [orderNumber, setOrderNumber] = useState('');

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Podaj imię i nazwisko';
    if (!form.phone.trim()) errs.phone = 'Podaj numer telefonu';
    if (!form.email.trim()) errs.email = 'Podaj adres email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Nieprawidłowy email';
    if (!form.address.trim()) errs.address = 'Podaj adres';
    if (!form.city.trim()) errs.city = 'Podaj miasto';
    if (!form.postal_code.trim()) errs.postal_code = 'Podaj kod pocztowy';
    else if (!/^\d{2}-\d{3}$/.test(form.postal_code)) errs.postal_code = 'Format: XX-XXX';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setStatus('loading');
    try {
      const { data } = await ordersApi.create({
        ...form,
        items: items.map((i) => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
      });
      setOrderNumber(data.order_number);
      setStatus('success');
      clearCart();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Błąd podczas składania zamówienia');
      setStatus('error');
    }
  };

  const Field = ({ name, label, type = 'text', placeholder, half }) => (
    <div className={half ? 'col-span-1' : 'col-span-2'}>
      <label className="label">{label}</label>
      <input
        type={type}
        name={name}
        value={form[name]}
        onChange={handleChange}
        placeholder={placeholder}
        className={`input ${errors[name] ? 'border-red-400 focus:ring-red-400' : ''}`}
      />
      {errors[name] && <p className="text-xs text-red-500 mt-1">{errors[name]}</p>}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.93 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.93 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {status === 'success' ? (
          <div className="p-10 text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
              <CheckCircle size={72} className="text-green-500 mx-auto mb-4" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Zamówienie przyjęte!</h2>
            <p className="text-gray-500 mb-2">Numer zamówienia:</p>
            <p className="text-2xl font-extrabold text-blue-600 mb-4">{orderNumber}</p>
            <p className="text-sm text-gray-500 mb-6">
              Na podany adres email wysłaliśmy potwierdzenie z danymi do płatności przelewem.
            </p>
            <button onClick={onClose} className="btn-primary px-8">Super, dziękuję!</button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} className="text-blue-600" />
                <h2 className="font-bold text-lg">Złóż zamówienie</h2>
              </div>
              <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Order summary */}
            <div className="mx-6 mt-4 p-4 bg-gray-50 rounded-2xl">
              <p className="text-sm font-semibold text-gray-700 mb-2">Podsumowanie zamówienia</p>
              <ul className="space-y-1 mb-2">
                {items.map((item) => (
                  <li key={item.id} className="flex justify-between text-sm text-gray-600">
                    <span className="truncate flex-1 mr-2">{item.name} <span className="text-gray-400">×{item.quantity}</span></span>
                    <span className="font-medium flex-shrink-0">{(item.price * item.quantity).toFixed(2)} zł</span>
                  </li>
                ))}
              </ul>
              <div className="border-t border-gray-200 pt-2 flex justify-between font-bold">
                <span>Razem</span>
                <span className="text-blue-600">{total.toFixed(2)} zł</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {status === 'error' && (
                <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-xl text-sm">
                  <AlertCircle size={16} />
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <Field name="name" label="Imię i nazwisko *" placeholder="Jan Kowalski" />
                <Field name="phone" label="Telefon *" placeholder="+48 600 000 000" half />
                <Field name="email" label="Email *" type="email" placeholder="jan@example.com" half />
                <Field name="address" label="Ulica i numer *" placeholder="ul. Przykładowa 1/2" />
                <Field name="city" label="Miasto *" placeholder="Warszawa" half />
                <Field name="postal_code" label="Kod pocztowy *" placeholder="00-000" half />
              </div>

              <div>
                <label className="label">Uwagi do zamówienia</label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Opcjonalne uwagi..."
                  className="input resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'loading' || items.length === 0}
                className="w-full btn-primary py-4 text-base"
              >
                {status === 'loading' ? (
                  <><Loader2 size={18} className="animate-spin" /> Składanie zamówienia...</>
                ) : (
                  <>Potwierdź zamówienie — {total.toFixed(2)} zł</>
                )}
              </button>
              <p className="text-xs text-gray-400 text-center">
                Po złożeniu zamówienia wyślemy dane do przelewu na podany email.
              </p>
            </form>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
