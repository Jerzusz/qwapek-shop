import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import ContactForm from '../components/contact/ContactForm';

const INFO = [
  { icon: Mail, label: 'Email', value: 'kontakt@qwapek.pl', href: 'mailto:kontakt@qwapek.pl' },
  { icon: Phone, label: 'Telefon', value: '+48 000 000 000', href: 'tel:+48000000000' },
  { icon: MapPin, label: 'Lokalizacja', value: 'Polska' },
  { icon: Clock, label: 'Czas odpowiedzi', value: 'do 24h roboczych' },
];

export default function Contact() {
  return (
    <div className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">Napisz do nas</h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          Masz pytanie o produkt, zamówienie lub chcesz się dowiedzieć więcej? Chętnie pomożemy.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Contact info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Dane kontaktowe</h2>
          <div className="space-y-4 mb-8">
            {INFO.map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 hover:border-blue-200 transition-colors">
                <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">{label}</p>
                  {href ? (
                    <a href={href} className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">{value}</a>
                  ) : (
                    <p className="font-semibold text-gray-900">{value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white">
            <h3 className="font-bold text-lg mb-2">Szybka wysyłka gwarantowana</h3>
            <p className="text-blue-100 text-sm leading-relaxed">
              Zamówienia złożone przed 12:00 wysyłamy tego samego dnia roboczego.
              Gwarantujemy dostawę w ciągu 24–48 godzin.
            </p>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6 sm:p-8"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Formularz kontaktowy</h2>
          <ContactForm />
        </motion.div>
      </div>
    </div>
  );
}
