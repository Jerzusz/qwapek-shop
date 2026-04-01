import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cookie, X } from 'lucide-react';

const COOKIE_CONSENT_KEY = 'qwapek_cookie_consent';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Small delay so it doesn't flash on load
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'declined');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-[100] p-4 sm:p-6 pointer-events-none">
      <div className="pointer-events-auto max-w-screen-md mx-auto bg-white border border-gray-200 rounded-2xl shadow-2xl p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="hidden sm:flex w-10 h-10 bg-blue-100 rounded-xl items-center justify-center flex-shrink-0 mt-0.5">
            <Cookie size={20} className="text-blue-600" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-1">
              🍪 Ta strona używa plików cookies
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Korzystamy z plików cookies, aby zapewnić prawidłowe działanie strony oraz poprawić
              komfort korzystania z naszego sklepu. Więcej informacji znajdziesz w naszej{' '}
              <Link to="/polityka-prywatnosci" className="text-blue-600 hover:underline font-medium">
                Polityce Prywatności
              </Link>.
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-4">
              <button
                onClick={accept}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors"
              >
                Akceptuję
              </button>
              <button
                onClick={decline}
                className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-xl transition-colors"
              >
                Tylko niezbędne
              </button>
            </div>
          </div>

          <button
            onClick={decline}
            className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
            aria-label="Zamknij"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
