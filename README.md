
# Habit Tracker PWA

A mobile-first Progressive Web App for building and tracking daily habits. Built with Next.js, React, TypeScript, and Tailwind CSS. All data is stored locally in the browser using localStorage — no backend, no external auth service.

## Live Demo & Repository

- **Live App:** https://habit-app-p1z9.vercel.app
- **GitHub:** https://github.com/justicefriday/Habit-App

---

## Project Overview

Habit Tracker lets a user:

- Sign up and log in with email and password
- Create, edit, and delete daily habits
- Mark a habit as complete for today (or unmark it)
- See a live current streak for each habit
- Reload the app and retain all saved state
- Install the app to their home screen as a PWA
- Load the app shell offline after it has been loaded once

This project follows a strict technical specification. Every route, localStorage key, data shape, component test ID, utility function name, and test title matches the specification exactly.

---

## Setup Instructions

**Requirements:**
- Node.js 18 or later
- npm 9 or later

**Install dependencies:**
```bash
npm install
```

**Install Playwright browsers (for end-to-end tests):**
```bash
npx playwright install
```

---

## Run Instructions

**Start the development server:**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**Build for production:**
```bash
npm run build
npm run start
```

---

## Test Instructions

**Run all tests (unit + integration + e2e):**
```bash
npm test
```

**Run unit tests only (with coverage report):**
```bash
npm run test:unit
```

**Run integration tests only:**
```bash
npm run test:integration
```

**Run end-to-end tests only:**
```bash
npm run test:e2e
```

**Coverage threshold:** The `src/lib` directory must maintain at least 80% line coverage. The current coverage exceeds this threshold.

---

## Local Persistence Structure

All data is stored in the browser's `localStorage` under three keys:

### `habit-tracker-users`
Stores a JSON array of registered users. Each user has the following shape:
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "password": "plaintext",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```
Passwords are stored in plaintext for simplicity. This is an intentional trade-off for a local-only frontend project.

### `habit-tracker-session`
Stores the currently logged-in user's session, or `null` when no user is logged in:
```json
{
  "userId": "uuid",
  "email": "user@example.com"
}
```

### `habit-tracker-habits`
Stores a JSON array of all habits across all users. Each habit has the following shape:
```json
{
  "id": "uuid",
  "userId": "uuid",
  "name": "Drink Water",
  "description": "Stay hydrated throughout the day",
  "frequency": "daily",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "completions": ["2024-01-01", "2024-01-02"]
}
```
The `completions` array contains unique ISO calendar dates in `YYYY-MM-DD` format. Habits are filtered by `userId` at read time so each user only sees their own habits.

---

## PWA Support

The app is installable as a Progressive Web App and can load offline after its first visit.

**Implementation details:**

- `public/manifest.json` — declares the app name, icons, theme color, start URL, and display mode so browsers can offer the install prompt.
- `public/icons/icon-192.png` and `public/icons/icon-512.png` — required icon sizes for PWA installation.
- `public/sw.js` — a service worker that caches a static `offline.html` fallback on install. When the user navigates while offline, the service worker intercepts the request and serves the cached fallback, which renders the splash screen with `data-testid="splash-screen"` so the app does not hard-crash.
- `public/offline.html` — a lightweight static HTML file containing the splash screen markup. This is what gets served offline.
- The service worker is registered in `src/app/layout.tsx` via an inline script that runs after the page loads.

**Why a static offline fallback instead of caching Next.js routes directly:**
Next.js in development mode renders pages dynamically via a Node.js server. Service workers cannot cache server-rendered responses the same way they cache static files. The offline fallback approach ensures a predictable, testable offline experience without requiring a full production build.

---

## Trade-offs and Limitations

**Plaintext passwords** — Passwords are stored as plaintext in localStorage. This is acceptable for a local-only frontend demo but must never be used in production. A real app would hash passwords server-side.

**No real authentication** — Sessions are stored in localStorage with no expiry and no server verification. Any user who can access the browser's dev tools can read or modify the session.

**localStorage limits** — Browsers typically cap localStorage at 5–10MB. For a habit tracker this is more than sufficient, but the app has no error handling for storage quota exceeded errors.

**No data sync** — Data exists only in the browser where it was created. Clearing browser data or switching devices loses all habits and users.

**PWA offline limited to shell** — The offline experience serves a static fallback page, not the full interactive dashboard. Full offline support would require caching the Next.js build output (a production build with `next export` or a static export strategy).

**Streak logic is calendar-day based** — Streaks are calculated using local ISO dates. If a user's system clock changes or they cross timezones, streak calculations may behave unexpectedly.

---

## Test File Map

This section maps each required test file to the application behavior it verifies.

### `tests/unit/slug.test.ts`
Verifies the `getHabitSlug` utility function. Tests confirm that habit names are correctly converted to lowercase hyphenated slugs, that leading and trailing spaces are trimmed, that internal repeated spaces collapse to a single hyphen, and that non-alphanumeric characters are removed. These slugs are used to generate deterministic `data-testid` values on habit cards.

### `tests/unit/validators.test.ts`
Verifies the `validateHabitName` utility function. Tests confirm that empty names are rejected with the correct error message, that names longer than 60 characters are rejected, and that valid names are returned trimmed and normalized.

### `tests/unit/streaks.test.ts`
Verifies the `calculateCurrentStreak` utility function. Tests confirm that an empty completions array returns 0, that a streak of 0 is returned when today is not completed, that consecutive completed days are counted correctly, that duplicate dates are ignored, and that a gap in the calendar breaks the streak.

### `tests/unit/habits.test.ts`
Verifies the `toggleHabitCompletion` utility function. Tests confirm that a date is added when not present, removed when already present, that the original habit object is not mutated, and that no duplicate completion dates are introduced.

### `tests/integration/auth-flow.test.tsx`
Verifies the signup and login form components using React Testing Library. Tests confirm that submitting the signup form creates a session in localStorage, that signing up with a duplicate email shows the correct error message, that submitting the login form with valid credentials stores the session, and that invalid credentials show the correct error message.

### `tests/integration/habit-form.test.tsx`
Verifies the habit form component. Tests confirm that submitting with an empty name shows a validation error, that a valid submission writes the habit to localStorage, that editing a habit updates the name while preserving the id, userId, createdAt, and completions fields, that deletion clears the habit from localStorage, and that toggling a completion date updates the completions array correctly.

### `tests/e2e/app.spec.ts`
Full end-to-end tests using Playwright against the running Next.js development server. Tests cover the complete user journey: the splash screen appearing and redirecting unauthenticated users to login, authenticated users being redirected to the dashboard, the dashboard being protected from unauthenticated access, signing up a new user, logging in an existing user, creating a habit from the dashboard, completing a habit and seeing the streak update, persisting data after a page reload, logging out and being redirected to login, and loading the cached app shell while offline.