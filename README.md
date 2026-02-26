<div align="center">

# 🎬 AuroraCine

### Smart Movie Ticket Booking Platform

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-aurora--cine.vercel.app-4f46e5?style=for-the-badge)](https://aurora-cine.vercel.app)
[![Backend API](https://img.shields.io/badge/⚙️_Backend_API-onrender.com-10B981?style=for-the-badge)](https://auroracine-backend.onrender.com)

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Auth_+_Firestore-FFCA28?logo=firebase&logoColor=black)
![Razorpay](https://img.shields.io/badge/Razorpay-Payments-0C2451?logo=razorpay&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-000?logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Backend-Render-46E3B7?logo=render&logoColor=white)

<br/>

> A full-stack movie ticket booking platform — browse live movies from TMDB, select seats with dynamic pricing, pay securely via Razorpay, and manage bookings in real time.

</div>

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🎥 Movie Discovery
- Live movie data from **TMDB API**
- Browse by category: Popular, Top Rated, Now Playing, Upcoming
- Instant search with debounced input
- Watch trailers directly in-app

</td>
<td width="50%">

### 🪑 Seat Booking
- Interactive seat selection grid (A1–H8)
- Dynamic pricing sections (₹1 Classic / ₹2 Premium)
- Real-time seat availability via **Firestore snapshots**
- Auto-cleanup of expired seat locks

</td>
</tr>
<tr>
<td width="50%">

### 💳 Secure Payments
- **Razorpay** integration (test mode ready)
- Order creation via Express backend
- Payment confirmation saved to Firestore
- Supports Cards, UPI, and Net Banking

</td>
<td width="50%">

### 👤 User Experience
- **Google Sign-In** via Firebase Auth
- Booking history with active/expired split
- Session persistence across page refreshes
- Fully responsive — mobile to desktop

</td>
</tr>
</table>

---

## 🧩 Tech Stack

| Layer | Technology | Purpose |
|:---|:---|:---|
| **Frontend** | React 19 + Vite 7 + Tailwind CSS 4 | Fast, modern UI |
| **Backend** | Node.js + Express | Razorpay order creation API |
| **Database** | Firebase Firestore | Real-time booking & seat storage |
| **Auth** | Firebase Authentication | Google Sign-In |
| **Payments** | Razorpay (Test Mode) | Secure online transactions |
| **Frontend Hosting** | Vercel | Auto-deploy from GitHub |
| **Backend Hosting** | Render | Auto-deploy from GitHub |
| **Movie Data** | TMDB API | Live movie metadata & posters |

---

## 🗂️ Project Structure

```
AuroraCine/
├── backend/
│   ├── server.js             # Express server — Razorpay + CORS
│   ├── package.json          # Backend dependencies
│   └── .env                  # Razorpay keys (gitignored)
│
├── src/
│   ├── api/
│   │   ├── api.js            # TMDB API helpers (fetch, search, details)
│   │   └── bookings.js       # Firestore booking queries
│   │
│   ├── components/
│   │   ├── AuthModal.jsx     # Firebase login/signup modal
│   │   ├── Footer.jsx        # App footer
│   │   ├── HeroBanner.jsx    # Hero section with search
│   │   ├── MovieCard.jsx     # Movie poster card with hover effects
│   │   ├── Navbar.jsx        # Navigation bar with auth state
│   │   ├── Pagination.jsx    # Page controls for movie lists
│   │   ├── SearchBar.jsx     # Search input component
│   │   ├── SeatGrid.jsx      # Interactive seat layout
│   │   └── ToasterProvider.jsx # Toast notification system
│   │
│   ├── context/
│   │   └── BookingContext.jsx # Global booking state (movie, seats, date)
│   │
│   ├── config/
│   │   └── env.js            # Dynamic backend URL switching
│   │
│   ├── firebase/
│   │   └── config.js         # Firebase init (Auth + Firestore)
│   │
│   ├── hooks/
│   │   ├── useAuth.js        # Auth context + Google sign-in
│   │   └── useDebounce.js    # Debounce utility for search
│   │
│   ├── pages/
│   │   ├── Home.jsx          # Homepage — popular movies + search
│   │   ├── MovieDetails.jsx  # Movie info + seat selection + trailer
│   │   ├── Booking.jsx       # Payment flow + Firestore save
│   │   ├── Success.jsx       # Post-payment confirmation
│   │   ├── MyBookings.jsx    # Active & expired bookings (real-time)
│   │   └── CategoryPage.jsx  # Category-filtered movie listings
│   │
│   ├── App.jsx               # Route definitions
│   ├── main.jsx              # React entry point
│   └── index.css             # Global styles
│
├── .env                      # Frontend env vars (gitignored)
├── index.html                # Root HTML template
├── vite.config.js            # Vite configuration
├── package.json              # Frontend dependencies
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites

| Tool | Version | Purpose |
|:---|:---|:---|
| [Node.js](https://nodejs.org/) | 18+ | Runtime |
| [npm](https://www.npmjs.com/) | 8+ | Package manager |
| [Firebase Project](https://console.firebase.google.com/) | — | Auth + Firestore |
| [Razorpay Account](https://razorpay.com/docs/api) | — | Payment gateway |
| [TMDB API Key](https://developer.themoviedb.org/) | — | Movie data |

### 1. Clone & Install

```bash
# Clone the repository
git clone https://github.com/kharayatvivek28/AuroraCine.git
cd AuroraCine

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Configure Environment Variables

**Frontend** — create `.env` in the project root:

```env
VITE_TMDB_API_KEY=your_tmdb_api_key
VITE_TMDB_BEARER=your_tmdb_bearer_token
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_RAZORPAY_KEY_ID=rzp_test_XXXXXXXX
VITE_BACKEND_URL=http://localhost:5000
```

**Backend** — create `.env` inside `/backend`:

```env
RAZORPAY_KEY_ID=rzp_test_XXXXXXXX
RAZORPAY_KEY_SECRET=your_razorpay_secret
PORT=5000
```

### 3. Run Locally

```bash
# Terminal 1 — Start backend
cd backend
npm start

# Terminal 2 — Start frontend
npm run dev
```

| Service | URL |
|:---|:---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000 |

---

## 🧪 Test Credentials

> Use these credentials in **Razorpay test mode** to simulate payments without real money.

### 💳 Test Cards — Indian Payments

| Card Network | Card Number | CVV | Expiry |
|:---|:---|:---|:---|
| Mastercard | `2305 3242 5784 8228` | Any 3 digits | Any future date |
| Visa | `4386 2894 0766 0153` | Any 3 digits | Any future date |

### 💳 Test Cards — International Payments

| Card Network | Card Number | CVV | Expiry |
|:---|:---|:---|:---|
| Mastercard | `5421 1393 0609 0628` | Any 3 digits | Any future date |
| Mastercard | `5105 1051 0510 5100` | Any 3 digits | Any future date |
| Visa | `4012 8888 8888 1881` | Any 3 digits | Any future date |

### 📱 Test UPI IDs

| Scenario | UPI ID | Result |
|:---|:---|:---|
| ✅ Success | `success@razorpay` | Payment succeeds |
| ❌ Failure | `failure@razorpay` | Payment fails |

> **⚠️ Note:** In test mode, cancelling a payment may still result in a successful transaction. Switch to live mode to properly test cancellation flows.

---

## 🚀 Deployment

AuroraCine uses a **split deployment** — frontend on Vercel, backend on Render, with CI/CD via GitHub.

### Backend → Render

1. Go to [render.com](https://render.com) → **Sign in with GitHub**
2. Click **New+ → Web Service** → select the AuroraCine repo
3. Set **Root Directory** to `/backend`
4. Configure:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Add environment variables under **Settings → Environment**:
   ```
   RAZORPAY_KEY_ID=rzp_test_xxxxxxxx
   RAZORPAY_KEY_SECRET=xxxxxxxxxxxxx
   PORT=5000
   ```
6. Deploy → You'll get a URL like `https://auroracine-backend.onrender.com`

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → **Login with GitHub**
2. **Import** the AuroraCine repo
3. Build settings:
   - **Framework:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Add all `VITE_*` environment variables under **Settings → Environment Variables**
5. Set `VITE_BACKEND_URL` to your Render backend URL
6. Deploy → Live at `https://aurora-cine.vercel.app`

### Firebase Auth Setup

> **Important:** Add your deployed domain to Firebase's authorized list to avoid `auth/unauthorized-domain` errors.

Go to **Firebase Console → Authentication → Settings → Authorized Domains** and add:
- `localhost`
- `aurora-cine.vercel.app`

### 🔄 CI/CD

Both platforms auto-deploy on every `git push` to the connected branch. No manual redeployment needed.

---

## 🌐 Live Environment

| Service | Platform | URL |
|:---|:---|:---|
| **Frontend** | Vercel | [`aurora-cine.vercel.app`](https://aurora-cine.vercel.app) |
| **Backend** | Render | [`auroracine-backend.onrender.com`](https://auroracine-backend.onrender.com) |
| **Database** | Firebase Firestore | Google Cloud |
| **Auth** | Firebase Auth | Google Sign-In |
| **Payments** | Razorpay | Test Mode |
| **Source Code** | GitHub | [`kharayatvivek28/AuroraCine`](https://github.com/kharayatvivek28/AuroraCine) |

---

## 📝 Architecture Notes

- **Modular Separation** — Frontend and backend are independently deployable
- **Environment Switching** — `env.js` auto-detects `localhost` vs production backend
- **Real-time Sync** — Firestore `onSnapshot()` for live seat updates and booking status
- **Session Persistence** — Booking context saved to `sessionStorage` to survive page refreshes
- **Secure Credentials** — All API keys in `.env` files, excluded via `.gitignore`

---

<div align="center">

**Built with ❤️ by [Vivek Kharayat](https://github.com/kharayatvivek28)**

</div>
