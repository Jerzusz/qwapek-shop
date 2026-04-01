import { Shield, Cookie, Database, UserCheck, Clock, Mail } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-screen-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
          <Shield size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Polityka Prywatności</h1>
          <p className="text-sm text-gray-500 mt-1">Ostatnia aktualizacja: 1 kwietnia 2026</p>
        </div>
      </div>

      <div className="space-y-10 text-gray-700 text-sm leading-relaxed">
        {/* Administrator danych */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <UserCheck size={18} className="text-blue-600" />
            <h2 className="text-lg font-bold text-gray-900">1. Administrator danych osobowych</h2>
          </div>
          <p>
            Administratorem Twoich danych osobowych jest <strong>Qwapek Shop</strong> (dalej „Administrator").
            W sprawach związanych z ochroną danych osobowych możesz skontaktować się z nami pod adresem e-mail:{' '}
            <a href="mailto:kontakt@qwapek.pl" className="text-blue-600 hover:underline">kontakt@qwapek.pl</a>.
          </p>
        </section>

        {/* Zakres danych */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Database size={18} className="text-blue-600" />
            <h2 className="text-lg font-bold text-gray-900">2. Zakres zbieranych danych</h2>
          </div>
          <p className="mb-3">W ramach korzystania z naszego sklepu możemy zbierać następujące dane:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Imię i nazwisko</li>
            <li>Adres e-mail</li>
            <li>Numer telefonu</li>
            <li>Adres dostawy (ulica, kod pocztowy, miasto)</li>
            <li>Treść wiadomości przesłanych przez formularz kontaktowy</li>
            <li>Dane dotyczące zamówień (wybrane produkty, kwota, data)</li>
          </ul>
        </section>

        {/* Cel przetwarzania */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Shield size={18} className="text-blue-600" />
            <h2 className="text-lg font-bold text-gray-900">3. Cel i podstawa przetwarzania danych</h2>
          </div>
          <p className="mb-3">Twoje dane osobowe przetwarzamy w następujących celach:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li><strong>Realizacja zamówień</strong> — na podstawie art. 6 ust. 1 lit. b RODO (wykonanie umowy)</li>
            <li><strong>Obsługa zapytań</strong> z formularza kontaktowego — na podstawie art. 6 ust. 1 lit. f RODO (prawnie uzasadniony interes)</li>
            <li><strong>Wypełnienie obowiązków prawnych</strong> — na podstawie art. 6 ust. 1 lit. c RODO (np. rachunkowość, podatki)</li>
            <li><strong>Marketing własnych produktów</strong> — na podstawie art. 6 ust. 1 lit. a RODO (zgoda) lub art. 6 ust. 1 lit. f RODO</li>
          </ul>
        </section>

        {/* Odbiorcy */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <UserCheck size={18} className="text-blue-600" />
            <h2 className="text-lg font-bold text-gray-900">4. Odbiorcy danych</h2>
          </div>
          <p>
            Twoje dane mogą być przekazywane podmiotom świadczącym usługi na rzecz Administratora, w tym:
            firmom kurierskim, dostawcom usług hostingowych, dostawcom usług płatniczych.
            Dane nie są przekazywane do państw trzecich poza Europejski Obszar Gospodarczy.
          </p>
        </section>

        {/* Okres przechowywania */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Clock size={18} className="text-blue-600" />
            <h2 className="text-lg font-bold text-gray-900">5. Okres przechowywania danych</h2>
          </div>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Dane związane z zamówieniami — przez okres wymagany przepisami prawa podatkowego (5 lat)</li>
            <li>Dane z formularza kontaktowego — do czasu zakończenia korespondencji lub wycofania zgody</li>
            <li>Dane marketingowe — do czasu wycofania zgody</li>
          </ul>
        </section>

        {/* Prawa */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Shield size={18} className="text-blue-600" />
            <h2 className="text-lg font-bold text-gray-900">6. Twoje prawa</h2>
          </div>
          <p className="mb-3">Przysługują Ci następujące prawa:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Prawo dostępu do swoich danych</li>
            <li>Prawo do sprostowania danych</li>
            <li>Prawo do usunięcia danych („prawo do bycia zapomnianym")</li>
            <li>Prawo do ograniczenia przetwarzania</li>
            <li>Prawo do przenoszenia danych</li>
            <li>Prawo do wniesienia sprzeciwu wobec przetwarzania</li>
            <li>Prawo do cofnięcia zgody w dowolnym momencie</li>
            <li>Prawo do wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych (UODO)</li>
          </ul>
          <p className="mt-3">
            W celu realizacji swoich praw skontaktuj się z nami:{' '}
            <a href="mailto:kontakt@qwapek.pl" className="text-blue-600 hover:underline">kontakt@qwapek.pl</a>.
          </p>
        </section>

        {/* Cookies */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Cookie size={18} className="text-blue-600" />
            <h2 className="text-lg font-bold text-gray-900">7. Pliki cookies</h2>
          </div>
          <p className="mb-3">
            Nasz serwis wykorzystuje pliki cookies (ciasteczka) w celu zapewnienia prawidłowego działania strony.
          </p>
          <h3 className="font-semibold text-gray-900 mb-2">Rodzaje plików cookies:</h3>
          <ul className="list-disc list-inside space-y-1 ml-2 mb-3">
            <li><strong>Niezbędne</strong> — konieczne do prawidłowego działania strony (np. sesja koszyka)</li>
            <li><strong>Funkcjonalne</strong> — zapamiętują Twoje preferencje (np. zgoda na cookies)</li>
          </ul>
          <h3 className="font-semibold text-gray-900 mb-2">Zarządzanie cookies:</h3>
          <p>
            Możesz zmienić ustawienia dotyczące cookies w swojej przeglądarce internetowej.
            Wyłączenie plików cookies może wpłynąć na funkcjonalność strony.
            Szczegółowe informacje znajdziesz w ustawieniach swojej przeglądarki.
          </p>
        </section>

        {/* Bezpieczeństwo */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Shield size={18} className="text-blue-600" />
            <h2 className="text-lg font-bold text-gray-900">8. Bezpieczeństwo danych</h2>
          </div>
          <p>
            Administrator stosuje odpowiednie środki techniczne i organizacyjne w celu ochrony danych osobowych
            przed nieuprawnionym dostępem, utratą lub zniszczeniem. Komunikacja ze stroną jest zabezpieczona
            protokołem SSL/TLS.
          </p>
        </section>

        {/* Zmiany */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Clock size={18} className="text-blue-600" />
            <h2 className="text-lg font-bold text-gray-900">9. Zmiany w polityce prywatności</h2>
          </div>
          <p>
            Administrator zastrzega sobie prawo do wprowadzania zmian w niniejszej Polityce Prywatności.
            O wszelkich zmianach użytkownicy zostaną poinformowani poprzez aktualizację treści na tej stronie.
          </p>
        </section>

        {/* Kontakt */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Mail size={18} className="text-blue-600" />
            <h2 className="text-lg font-bold text-gray-900">10. Kontakt</h2>
          </div>
          <p>
            W razie pytań dotyczących ochrony danych osobowych, prosimy o kontakt pod adresem:{' '}
            <a href="mailto:kontakt@qwapek.pl" className="text-blue-600 hover:underline">kontakt@qwapek.pl</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
