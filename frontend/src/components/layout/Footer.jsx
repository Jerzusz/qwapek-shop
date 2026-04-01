import { Link } from 'react-router-dom';
import { Package, Mail, Phone, MapPin, Instagram, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Package size={18} className="text-white" />
              </div>
              <span className="font-extrabold text-xl text-white">Qwapek Shop</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Sprzedajemy produkty z palet zwrotów — elektronika, ubrania, zabawki i wiele więcej.
              Doskonała jakość w przystępnych cenach.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a href="#" className="p-2 bg-gray-800 hover:bg-blue-600 rounded-lg transition-colors">
                <Facebook size={16} />
              </a>
              <a href="#" className="p-2 bg-gray-800 hover:bg-pink-600 rounded-lg transition-colors">
                <Instagram size={16} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Kategorie</h3>
            <ul className="space-y-2 text-sm">
              {['Elektronika', 'Ubrania', 'Zabawki', 'Środki czystości', 'Narzędzia', 'Akcesoria meblowe'].map((cat) => (
                <li key={cat}>
                  <Link to={`/?category=${encodeURIComponent(cat)}`} className="text-gray-400 hover:text-white transition-colors">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4">Kontakt</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-gray-400">
                <Mail size={15} className="text-blue-400 flex-shrink-0" />
                <a href="mailto:kontakt@qwapek.pl" className="hover:text-white transition-colors">kontakt@qwapek.pl</a>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <Phone size={15} className="text-blue-400 flex-shrink-0" />
                <span>+48 000 000 000</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <MapPin size={15} className="text-blue-400 flex-shrink-0" />
                <span>Polska</span>
              </li>
            </ul>
            <Link
              to="/kontakt"
              className="inline-flex items-center gap-2 mt-5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors"
            >
              <Mail size={14} />
              Napisz do nas
            </Link>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Qwapek Shop. Wszelkie prawa zastrzeżone.</p>
          <div className="flex items-center gap-3">
            <Link to="/polityka-prywatnosci" className="hover:text-white transition-colors">Polityka Prywatności</Link>
            <span>·</span>
            <span>Płatność przelewem</span>
            <span>·</span>
            <span>Dostawa 24–48h</span>
            <span>·</span>
            <span>Zwroty 14 dni</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
