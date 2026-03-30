# Qwapek Shop

Sklep internetowy do sprzedaży produktów z palet zwrotów.

## Stack technologiczny

- **Frontend:** React 18 + Vite + Tailwind CSS + Framer Motion
- **Backend:** Node.js + Express
- **Baza danych:** SQLite (better-sqlite3)
- **Autentykacja:** JWT

## Szybki start

### 1. Uruchom backend

```bash
cd backend
npm install
npm run dev
```

Server startuje na `http://localhost:5000`

### 2. Uruchom frontend

```bash
cd frontend
npm install
npm run dev
```

Aplikacja dostępna na `http://localhost:5173`

## Domyślne dane logowania do panelu admina

- URL: `http://localhost:5173/admin`
- Login: `admin`
- Hasło: `admin123`

> ⚠️ **Zmień hasło w produkcji!** Edytuj `backend/database.js` lub bezpośrednio w bazie SQLite.

## Konfiguracja emaili (opcjonalne)

Edytuj `backend/.env`:

```env
SMTP_USER=twoj-email@gmail.com
SMTP_PASS=twoje-haslo-aplikacji-google
SHOP_NAME=Qwapek Shop
BANK_NAME=PKO Bank Polski
BANK_ACCOUNT=PL00 0000 0000 0000 0000 0000 0000
```

> Gmail wymaga **hasła aplikacji** (nie zwykłego hasła). Wygeneruj w ustawieniach konta Google → Bezpieczeństwo → Hasła aplikacji.

## Struktura projektu

```
strona qwapek/
├── backend/
│   ├── data/           # Baza SQLite (tworzona automatycznie)
│   ├── uploads/        # Zdjęcia produktów (tworzone automatycznie)
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── contact.js
│   │   ├── orders.js
│   │   └── products.js
│   ├── database.js
│   ├── server.js
│   └── package.json
│
└── frontend/
    └── src/
        ├── api/
        ├── components/
        │   ├── auth/
        │   ├── cart/
        │   ├── contact/
        │   ├── layout/
        │   ├── order/
        │   └── products/
        ├── context/
        ├── pages/
        │   ├── admin/
        │   ├── Contact.jsx
        │   └── Home.jsx
        ├── App.jsx
        └── main.jsx
```

## API Endpoints

| Metoda | Endpoint | Opis | Auth |
|--------|----------|------|------|
| GET | `/api/products` | Lista produktów | - |
| GET | `/api/products/:id` | Szczegóły produktu | - |
| POST | `/api/products` | Dodaj produkt | ✓ |
| PUT | `/api/products/:id` | Edytuj produkt | ✓ |
| DELETE | `/api/products/:id` | Usuń produkt | ✓ |
| POST | `/api/orders` | Złóż zamówienie | - |
| GET | `/api/orders` | Lista zamówień | ✓ |
| PUT | `/api/orders/:id/status` | Zmień status | ✓ |
| POST | `/api/contact` | Wyślij wiadomość | - |
| GET | `/api/contact/messages` | Lista wiadomości | ✓ |
| PUT | `/api/contact/messages/:id/read` | Oznacz jako przeczytaną | ✓ |
| POST | `/api/auth/login` | Logowanie admina | - |

## Funkcjonalności

### Sklep
- Grid produktów z lazy loading
- Filtrowanie po kategoriach (Elektronika, Ubrania, Zabawki, Środki czystości, Akcesoria meblowe, Narzędzia, Inne)
- Wyszukiwarka produktów
- Modal z podglądem produktu i galerią zdjęć
- Koszyk z drawer'em (slide-in z prawej)
- Formularz zamówienia z walidacją
- Email potwierdzenia z danymi do przelewu
- Formularz kontaktowy

### Panel admina (`/admin`)
- Logowanie z JWT
- Dashboard ze statystykami
- Zarządzanie produktami (CRUD + upload zdjęć)
- Lista zamówień z filtrowaniem statusu
- Zarządzanie wiadomościami kontaktowymi

### UI/UX
- Animacje Framer Motion
- Responsywny design (mobile first)
- Wysuwane menu kategorii
- Nowoczesny, minimalistyczny styl
