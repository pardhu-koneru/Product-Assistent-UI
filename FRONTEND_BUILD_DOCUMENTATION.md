# Frontend Build Documentation — Phase 1, 2 & 3

## Overview

This document describes the frontend implementation for the ShopAI e-commerce application. The build covers project setup, common UI components, routing with guards, and authentication pages — all integrated with the existing Redux store and Django REST Framework backend.

**Tech Stack:** React 19, React Router v7 (framework mode, SPA), Redux Toolkit, Axios, Tailwind CSS v4, Vite 7

---

## Project Structure

```
frontend/app/
├── root.jsx                          # App shell — Redux Provider, auth rehydration
├── routes.js                         # Route definitions (React Router v7 file-based routing)
├── app.css                           # Tailwind CSS entry
│
├── hooks/
│   └── useAuth.js                    # Auth abstraction hook over Redux
│
├── layouts/
│   └── PublicLayout.jsx              # Navbar + Outlet + Footer wrapper
│
├── components/
│   └── common/
│       ├── Spinner.jsx               # Animated loading spinner (sm/md/lg)
│       ├── ErrorMessage.jsx          # Red alert box for error display
│       ├── Button.jsx                # Multi-variant button with loading state
│       ├── Modal.jsx                 # Overlay modal with backdrop
│       ├── Badge.jsx                 # Inline status pill
│       ├── StarRating.jsx            # 5-star rating display
│       ├── EmptyState.jsx            # Placeholder for empty lists
│       └── Navbar.jsx                # Top navigation bar (guest/auth/admin states)
│
├── routes/
│   ├── home.jsx                      # Homepage placeholder
│   ├── login.jsx                     # Login page
│   ├── register.jsx                  # Registration page
│   ├── verify-email.jsx              # Email verification page
│   ├── not-found.jsx                 # 404 fallback
│   └── guards/
│       ├── guest.jsx                 # Redirects authenticated users away from login/register
│       ├── protected.jsx             # Blocks unauthenticated users (for future use)
│       └── admin.jsx                 # Blocks non-admin users (for future use)
│
└── store/                            # Pre-existing — NOT modified (except SSR guard)
    ├── index.js
    ├── slices/
    │   ├── authSlice.js              # ← Added SSR-safe localStorage guard
    │   ├── categoriesSlice.js
    │   ├── productsSlice.js
    │   └── ...
    └── thunks/
        ├── authThunks.js
        └── ...
```

---

## Configuration Changes

### `react-router.config.js`

- Converted from `.ts` to `.js` (no TypeScript in frontend)
- Set `ssr: false` — the app uses `localStorage` for JWT tokens, making SSR incompatible

### `vite.config.js`

- Converted from `.ts` to `.js`
- Added explicit `resolve.alias` for `~` → `./app` to ensure `.jsx` imports resolve correctly alongside `tsconfigPaths`

### `authSlice.js` (Minimal Fix)

- Added `const isBrowser = typeof window !== "undefined"` guard around `localStorage.getItem()` calls in `initialState` to prevent crashes during React Router's SPA HTML generation step (which runs in Node.js)

---

## Architecture Decisions & Backend Alignment

Several adjustments were made after inspecting the actual Django backend:

| Prompt Assumption | Actual Backend Behavior | Decision |
|---|---|---|
| `registerUser` takes `{ email, password }` only | `RegisterSerializer` accepts `email, username, first_name, last_name, phone_number, password` (fields beyond email/password are optional) | Register form sends only `email` + `password` — minimal required fields |
| `verifyEmail` is public | `verify_email` action uses `permission_classes=[IsAuthenticated]` — user must be logged in | VerifyEmailPage notes this. Verification requires an active session. |
| `resendVerificationEmail()` takes no args | Thunk takes `{ email }` as payload | `useAuth.resendVerification` passes `{ email }` and the verify-email page reads `user.email` from Redux |
| React Router v6 with `BrowserRouter` | Project uses React Router v7 framework mode | Used `routes.js` file-based routing with layout nesting and `root.jsx` instead of `main.jsx` + `App.jsx` |
| Tailwind `bg-opacity-50` | Tailwind v4 syntax | Used `bg-black/50` instead |

---

## Phase 0 — Entry Point

### `root.jsx`

The root component:

1. Wraps the entire app in `<Provider store={store}>` for Redux
2. On boot, dispatches `fetchCurrentUser()` if an `accessToken` exists in localStorage — this rehydrates the session from an existing JWT
3. Provides `<Layout>` (HTML shell with `<head>`, `<body>`, `<Scripts>`, etc.)
4. Includes `HydrateFallback` (spinner shown while SPA JS loads)
5. Includes `ErrorBoundary` for unhandled errors

---

## Phase 1 — Routing & Guards

### Route Table (`routes.js`)

| Path | Component | Guard | Layout |
|---|---|---|---|
| `/` | `home.jsx` | None | `PublicLayout` |
| `/login` | `login.jsx` | `GuestRoute` | `PublicLayout` |
| `/register` | `register.jsx` | `GuestRoute` | `PublicLayout` |
| `/verify-email` | `verify-email.jsx` | None | `PublicLayout` |
| `*` | `not-found.jsx` | None | `PublicLayout` |

### Route Guards

- **`guards/guest.jsx`** — If `isAuthenticated === true`, redirects to `/`. Shows spinner during auth loading. Used to wrap `/login` and `/register` so logged-in users can't access them.

- **`guards/protected.jsx`** — If `isAuthenticated === false`, redirects to `/login`. Shows spinner during loading. Built for future phases when private pages (profile, orders, etc.) are added.

- **`guards/admin.jsx`** — If not authenticated → `/login`. If authenticated but not admin → `/`. Shows spinner during loading. Built for future admin dashboard routes.

### `PublicLayout`

Wraps all public pages with:
- Sticky `<Navbar />` at top
- `<main>` container with `<Outlet />` for page content
- Dark footer with copyright text

---

## Phase 2 — Common Components

All components are pure UI (props only, no Redux) except `Navbar`.

| Component | Key Features |
|---|---|
| **Spinner** | 3 sizes (`sm`/`md`/`lg`), `animate-spin` border trick |
| **ErrorMessage** | Red left-bordered alert box, returns `null` if no message |
| **Button** | 4 variants (`primary`/`secondary`/`danger`/`ghost`), `loading` state shows inline Spinner, `fullWidth` option |
| **Modal** | Backdrop click + × button to close, 3 sizes, prevents body scroll |
| **Badge** | 5 color variants (`success`/`danger`/`warning`/`info`/`neutral`), pill shape |
| **StarRating** | Full/half/empty stars from numeric rating, optional review count |
| **EmptyState** | Centered placeholder with icon, title, description, optional action button |
| **Navbar** | 3 states: loading (spinner) / guest (Login + Register links) / authenticated (email + logout + optional admin link). Uses `NavLink` for active link styling. |

---

## Phase 3 — Auth Pages & `useAuth` Hook

### `useAuth` Hook

Single abstraction over Redux auth state. Returns:

- **State:** `user`, `isAuthenticated`, `isAdmin`, `loading`, `error`, `emailVerificationSent`
- **Actions:** `login()`, `register()`, `logout()`, `fetchCurrentUser()`, `verifyEmail()`, `resendVerification()`, `clearError()`

All pages use `useAuth()` instead of calling `useSelector`/`useDispatch` directly.

### Login Page (`/login`)

- Centered card with email + password form
- Dispatches `login({ email, password })` on submit
- Redirects to `/` on successful authentication (watched via `useEffect` on `isAuthenticated`)
- Shows `<ErrorMessage>` for backend errors
- Clears stale errors on mount
- Links to `/register`

### Register Page (`/register`)

- Centered card with email + password + confirm password form
- Client-side validation: password length ≥ 8, passwords must match
- Dispatches `register({ email, password })` on valid submit
- On success: shows "check your email" message instead of navigating (watches `emailVerificationSent`)
- Shows `<ErrorMessage>` for backend errors (e.g., duplicate email)
- Links to `/login`

### Verify Email Page (`/verify-email?token=...`)

- Reads `token` from URL query params
- Auto-dispatches `verifyEmail({ token })` on mount
- 3 display states:
  - **Loading:** Spinner + "Verifying your email..."
  - **Success:** Green checkmark + "Email verified!" + link to login
  - **Error:** Red ✗ + error message + "Resend" button (if user is logged in) + "Go to Login" button
- Shows "Invalid verification link" if no token in URL

### Home Page (`/`)

Placeholder with "Welcome to ShopAI" heading and "Products coming soon" text. No data fetching.

### Not Found Page (`*`)

Simple 404 with "Page not found" message and link back to home.

---

## How to Run

```bash
cd frontend
npm install
npm run dev        # Dev server at http://localhost:5173
npm run build      # Production build
```

---

## End-to-End Flows

| Flow | Expected Behavior |
|---|---|
| App boots | `fetchCurrentUser` fires if token exists → rehydrates session |
| Visit `/login` while logged in | Redirected to `/` by GuestRoute |
| Visit `/register` while logged in | Redirected to `/` by GuestRoute |
| Submit login form | Loading state on button → success navigates to `/` → Navbar shows user email |
| Submit login with bad creds | Error message appears below form |
| Logout | Navbar reverts to guest state, tokens cleared |
| Register | Success message shown (no redirect), prompts email check |
| Visit `/verify-email?token=abc` | Auto-verifies, shows success or error |
| Visit `/anything-random` | 404 page with link home |
