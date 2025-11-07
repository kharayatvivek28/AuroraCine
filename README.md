# 🎬 AuroraCine – Smart Movie Ticket Booking Platform

AuroraCine is a **full-stack movie ticket booking platform** built with React (Vite + Tailwind CSS), Firebase, Razorpay, and Express.js.  
It allows users to browse movies via TMDB API, select showtimes and seats, make secure payments through Razorpay, and manage bookings in real time.

---

### 🌟 Key Highlights

- 🎥 **Live Movie Data** from TMDB API (Top Rated, Now Playing, Search)
- 🪑 **Seat Selection UI** with dynamic pricing (₹1 / ₹2 sections)
- 💳 **Razorpay Integration** for secure payments
- 🔥 **Firebase Authentication** (Google Sign-In)
- 🧾 **Booking Management** with Firestore
- ⚡ **Deployed on Vercel (frontend)** + **Render (backend)**
- 📱 **Fully Responsive UI** with Tailwind CSS

---

### 🧩 Tech Stack

| Layer              | Technology                           | Description                |
| ------------------ | ------------------------------------ | -------------------------- |
| **Frontend**       | React (Vite) + Tailwind CSS          | Fast UI and clean styling  |
| **Backend**        | Node.js + Express                    | Razorpay order handling    |
| **Database**       | Firebase Firestore                   | Booking storage            |
| **Authentication** | Firebase Auth                        | Google Sign-In             |
| **Payments**       | Razorpay (Test Mode)                 | Secure online transactions |
| **Hosting**        | Vercel (Frontend) + Render (Backend) | Auto-deploy from GitHub    |

---

## 🗂️ Project Structure

The project follows a modular, production-ready structure — separating frontend, backend, and shared configuration for clarity and scalability.

```
AuroraCine/
│
├── backend/
│ ├── server.js # Express backend for Razorpay integration (CORS enabled)
│ ├── package.json # Backend dependencies and start script
│ └── .env # Razorpay test/live keys (kept secret)
│
├── src/
│ ├── api/
│ │ ├── api.js # TMDB API utilities (fetchPopularMovies, searchMovies, etc.)
│ │ └── bookings.js # Booking data fetch helper
│ │
│ ├── components/
│ │ ├── AuthModal.jsx # Handles Firebase authentication (login/signup modal)
│ │ ├── Footer.jsx # Elegant footer with credits
│ │ ├── HeroBanner.jsx # Dynamic movie hero section with search bar
│ │ ├── MovieCard.jsx # Displays movie posters with hover details
│ │ ├── Navbar.jsx # Main navigation bar with Auth state
│ │ ├── Pagination.jsx # Pagination component for movie lists
│ │ ├── SearchBar.jsx # Movie search input field (used in HeroBanner)
│ │ ├── SeatGrid.jsx # Interactive seat layout (available, selected, booked)
│ │ └── ToasterProvider.jsx # Provides toast notifications for user actions
│ │
│ ├── context/
│ │ └── BookingContext.jsx # Stores selected movie, seats, date, and showtime globally
│ │
│ ├── config/
│ │ └── env.js # Dynamic backend URL (switches between localhost and Render)
│ │
│ ├── firebase/
│ │ └── config.js # Firebase initialization (Auth + Firestore)
│ │
│ ├── hooks/
│ │ ├── useAuth.js # Custom hook to manage and return current Firebase user
│ │ └── useDebounce.js # Debounce utility hook for optimized search input
│ │
│ ├── pages/
│ │ ├── Booking.jsx # Razorpay payment and Firestore booking save logic
│ │ ├── CategoryPage.jsx # Displays movies filtered by selected category
│ │ ├── Home.jsx # Fetches and displays popular movies + search functionality
│ │ ├── MovieDetails.jsx # Seat selection + datepicker + real-time booking sync
│ │ ├── MyBookings.jsx # Shows user’s active and past bookings (real-time listener)
│ │ └── Success.jsx # Payment success summary page
│ │
│ ├── App.jsx # Central routing configuration
│ ├── main.jsx # React root render file
│ └── index.css # Tailwind global styles
│
├── .env # Firebase keys + VITE_BACKEND_URL
├── .firebaserc # Firebase project configuration
├── .gitignore # Ignores .env, node_modules, and build outputs
├── eslint.config.js # ESLint configuration for code quality
├── firebase.json # Firebase hosting and build setup
├── index.html # Root HTML template
├── package.json # Frontend dependencies (Vite + React)
├── package-lock.json # Dependency lock file
├── postcss.config.cjs # Tailwind + PostCSS configuration
├── tailwind.config.js # Tailwind customization
├── vite.config.js # Vite configuration
└── README.md # Project documentation

```

---

### 🧾 Notes

- The project uses **modular separation** — so backend and frontend can be deployed independently.
- `env.js` automatically detects environment (`localhost` vs. production Render API).
- All sensitive credentials (Firebase + Razorpay keys) are stored in `.env` and excluded via `.gitignore`.
- Real-time data (MyBookings, Seat updates) uses **Firestore `onSnapshot()`** for live sync.

---

## ⚙️ Installation & Local Development Setup

Follow these steps to run **AuroraCine** on your local machine for testing and development.

---

### 🧩 1️⃣ Prerequisites

Make sure you have the following installed:

| Tool                                                          | Version | Purpose                     |
| ------------------------------------------------------------- | ------- | --------------------------- |
| [Node.js](https://nodejs.org/)                                | 18+     | For both frontend & backend |
| [npm](https://www.npmjs.com/)                                 | 8+      | Package manager             |
| [Firebase Project](https://console.firebase.google.com/)      | –       | For Auth + Firestore        |
| [Razorpay Account (Test Mode)](https://razorpay.com/docs/api) | –       | For payments                |
| [TMDB API Key](https://developer.themoviedb.org/)             | –       | To fetch movie data         |

---

### ⚡ 2️⃣ Clone the Repository

```bash
# Clone the repo
git clone https://github.com/kharayatvivek28/AuroraCine.git

# Navigate into the folder
cd AuroraCine
```

### 🧱 3️⃣ Setup Frontend

```bash
# Move into frontend root
cd src

# Install dependencies
npm install
```

### 🚀 4️⃣ Setup Backend

```bash
# Move into backend folder
cd ../backend

# Install dependencies
npm install
```

Then create a .env file inside /backend and add:

```bash
RAZORPAY_KEY_ID=rzp_test_XXXXXXXX
RAZORPAY_KEY_SECRET=your_razorpay_secret
PORT=5000
```

### 🔥 5️⃣ Setup Firebase & Frontend Environment

Create a .env file in the project root (not in /backend) and add:

```bash
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Dynamic backend switching
VITE_BACKEND_URL=http://localhost:5000
```

### 🧩 6️⃣ Run the Project Locally

Run Backend:

```bash
cd backend
npm start
```

Run Frontend:

```bash
cd src
npm run dev
```

### 7️⃣ Access the App

- Once both servers are running:

  - Frontend: http://localhost:5173
  - Backend API: http://localhost:5000

- #### You’ll see the AuroraCine homepage with movie listings from TMDB.
- #### Selecting a movie will open seat booking and payment flow via Razorpay (test mode).

### 💡 Local Testing Notes

- Use Razorpay test keys for local development.

- Firestore + Auth must be configured under your Firebase project.

- The backend CORS already allows localhost:5173 (for local use).

# Test Suites

### Test Cards for Indian Payments

| Card Network | Card Number         | CVV        | Expiry Date     |
| ------------ | ------------------- | ---------- | --------------- |
| Mastercard   | 2305 3242 5784 8228 | Random CVV | Any future date |
| Visa         | 4386 2894 0766 0153 | Random CVV | Any future date |

---

### Test Cards for International Payments

| Card Network | Card Number         | CVV        | Expiry Date     |
| ------------ | ------------------- | ---------- | --------------- |
| Mastercard   | 5421 1393 0609 0628 | Random CVV | Any future date |
| Mastercard   | 5105 1051 0510 5100 | Random CVV | Any future date |
| Mastercard   | 5104 0600 0000 0008 | Random CVV | Any future date |
| Visa         | 4012 8888 8888 1881 | Random CVV | Any future date |

---

### 🪙 Test UPI ID Details

**How to Use:**

1. At the **Checkout**, select **UPI** as the payment method.
2. Enter the **UPI ID** when prompted.
3. Use the following IDs for testing:

| Test Scenario           | UPI ID             | Notes                               |
| ----------------------- | ------------------ | ----------------------------------- |
| ✅ Payment Success Flow | `success@razorpay` | Simulates a successful UPI payment. |
| ⚠️ Payment Failure Flow | `failure@razorpay` | Simulates a failed UPI transaction. |

---

### ⚠️ Watch Out!

- In **test mode**, payment **cancellation will still result in a successful payment**.
- To properly test **payment cancellation**, switch to **live mode**.

---

## 🚀 Deployment Guide (Vercel + Render)

AuroraCine uses a **2-part deployment**:

- 🎨 **Frontend** → Vercel
- ⚙️ **Backend (Express + Razorpay)** → Render
- 🔥 **Firebase** → already hosted on Google Cloud
- 💳 **Razorpay** → Live/Test mode handled via `.env`

---

### 🌐 1️⃣ Deploy Backend on Render

#### 🧱 Step 1: Create Render Account

Go to [https://render.com](https://render.com) → **Sign in with GitHub**  
(Authorize Render to access your repo)

#### ⚙️ Step 2: Create a New Web Service

1. Click **“New +” → “Web Service”**
2. Select your **AuroraCine repo**
3. Choose `/backend` as the root directory
4. Configure the build:

```bash
Build Command: npm install
Start Command: npm start
```

5. Choose **Free Plan** (or Pro for faster spin-up).

#### 🔑 Step 3: Add Environment Variables in Render

Under **Settings → Environment → Add Variables**, add:

```bash
RAZORPAY_KEY_ID=rzp_test_xxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxx
PORT=5000
```

Then click **Deploy**.

🟢 Once deployed, Render will give you a public URL like:
https://auroracine-backend.onrender.com

Keep this — it’s your **backend API base URL**.

---

### 🎨 2️⃣ Deploy Frontend on Vercel

#### 🧱 Step 1: Create a Vercel Account

Go to [https://vercel.com](https://vercel.com) → **Login with GitHub**

#### ⚙️ Step 2: Import Your Repository

- Click **“New Project” → “Import Git Repository”**
- Select your **AuroraCine** repo.
- Choose the root project (where your `vite.config.js` exists).

#### ⚙️ Step 3: Set Build Settings

- Framework: Vite
- Build Command: npm run build
- Output Directory: dist

#### 🔑 Step 4: Add Environment Variables in Vercel

Go to **Settings → Environment Variables** and add:

```bash
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_BACKEND_URL=https://auroracine-backend.onrender.com
```

Then click **Deploy** 🚀

After a few seconds, you’ll get a public link like:https://aurora-cine.vercel.app

---

### 🧩 3️⃣ Fix Firebase Auth Domain Error (Important)

Go to **Firebase Console → Authentication → Settings → Authorized Domains**

Add both:

- localhost
- aurora-cine.vercel.app

✅ This fixes the Google Sign-In `auth/unauthorized-domain` error.

---

### 🔄 4️⃣ GitHub Auto-Deploy

Both Vercel & Render automatically detect changes in your GitHub repo:

- On **git push**, Vercel rebuilds frontend automatically.
- Render redeploys backend if connected to the same repo.

---

### 🧾 Example Environment Overview

| Layer        | Platform           | URL Example                                     | Description         |
| ------------ | ------------------ | ----------------------------------------------- | ------------------- |
| **Frontend** | Vercel             | `https://aurora-cine.vercel.app`                | React + Vite app    |
| **Backend**  | Render             | `https://auroracine-backend.onrender.com`       | Express + Razorpay  |
| **Database** | Firebase Firestore | –                                               | Bookings, seats     |
| **Auth**     | Firebase           | –                                               | Google Sign-In      |
| **Payments** | Razorpay           | –                                               | Secure checkout     |
| **Repo**     | GitHub             | `https://github.com/<your-username>/AuroraCine` | Auto-deploy enabled |

---

✅ Done!  
Your AuroraCine app will now work both locally and in production with automatic sync from GitHub.
