import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { contactApi } from '../../api';

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Podaj swoje imię';
    if (!form.email.trim()) errs.email = 'Podaj adres email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Nieprawidłowy email';
    if (!form.message.trim()) errs.message = 'Wpisz wiadomość';
    else if (form.message.trim().length < 10) errs.message = 'Wiadomość jest zbyt krótka';
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
      await contactApi.send(form);
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <CheckCircle size={56} className="text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">Wiadomość wysłana!</h3>
        <p className="text-gray-500 mb-6">Odezwiemy się wkrótce na podany adres email.</p>
        <button onClick={() => setStatus('idle')} className="btn-secondary">Wyślij kolejną</button>
      </motion.div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      {status === 'error' && (
        <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-xl text-sm">
          <AlertCircle size={16} />
          Wystąpił błąd. Spróbuj ponownie.
        </div>
      )}

      <div>
        <label className="label">Imię *</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Twoje imię"
          className={`input ${errors.name ? 'border-red-400' : ''}`}
        />
        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
      </div>

      <div>
        <label className="label">Email *</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="twoj@email.pl"
          className={`input ${errors.email ? 'border-red-400' : ''}`}
        />
        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
      </div>

      <div>
        <label className="label">Wiadomość *</label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          rows={5}
          placeholder="W czym możemy pomóc?"
          className={`input resize-none ${errors.message ? 'border-red-400' : ''}`}
        />
        {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
        <p className="text-xs text-gray-400 text-right mt-1">{form.message.length}/2000</p>
      </div>

      <button type="submit" disabled={status === 'loading'} className="btn-primary w-full py-3.5 text-base">
        {status === 'loading' ? (
          <><Loader2 size={18} className="animate-spin" /> Wysyłanie...</>
        ) : (
          <><Send size={18} /> Wyślij wiadomość</>
        )}
      </button>
    </motion.form>
  );
}
