# Expense Tracker — Project Notes

## What's been built

A complete Next.js + NextUI expense tracking app with localStorage persistence, packaged as a native macOS desktop app via Electron.

### Features
- **Add expenses** — description, amount, category (9 options), date
- **Edit expenses** — pencil button on each row opens modal pre-filled
- **Delete with confirmation** — trash button shows a confirmation modal before deleting
- **Spending breakdown chart** — CSS bar chart showing each category as % of total
- **Month filter** — dropdown to view any past month (appears when data spans 2+ months)
- **Category filter** — chip row to filter list by category
- **CSV export** — downloads current filtered expenses as a .csv file
- **Summary stats** — total spent, this month's total, top category (updates to reflect selected month)
- **Electron desktop app** — runs as a native macOS window via `npm run electron`

### File structure
```
src/
  app/
    page.tsx               — main page, all state and event handlers
    layout.tsx             — root layout, NextUIProvider
    providers.tsx          — client-side NextUIProvider wrapper
  components/
    AppModal.tsx           — custom CSS modal (no framer-motion, no @react-aria)
    ExpenseModal.tsx       — add/edit form using native inputs + AppModal
    DeleteConfirmModal.tsx — delete confirmation using AppModal
    ExpenseList.tsx        — date-grouped list with edit + delete buttons
    SummaryStats.tsx       — three stat cards at top
    SpendingChart.tsx      — category breakdown bar chart
    CategoryFilter.tsx     — chip-based category filter
  hooks/
    useExpenses.ts         — all state, localStorage persistence, derived values
  lib/
    format.ts              — shared formatCurrency and formatDate utilities
  types/
    expense.ts             — Expense interface, CATEGORIES, CATEGORY_ICONS, CATEGORY_COLORS
electron/
  main.js                  — Electron entry point, BrowserWindow loading localhost:3000
```

### Electron setup
- `"main": "electron/main.js"` in package.json
- `npm run electron` — starts Next.js dev server + opens Electron window (uses `concurrently` and `wait-on`)
- `npm run dist` — builds Next.js then packages a `.dmg` (arm64 + x64) via `electron-builder` into `dist-electron/`
- BrowserWindow: 1200×800, `hiddenInset` title bar (native macOS traffic lights), context isolation on

### Electron bugs fixed
**`wait-on` 404 loop** — `wait-on http://localhost:3000` uses HEAD requests; Next.js returns 404
for HEAD on `/`, so `wait-on` never considers the server ready and Electron never opens.

**Fix:** use `http-get://localhost:3000` so `wait-on` uses GET and accepts any HTTP response
(including 404) as "server is up."

## NextUI compatibility rule (React 19 / Next.js 16)

**Do not use NextUI interactive components in this stack.** The following all fail silently:
- `Button` with `onPress` — click events never fire
- `Input` — label and placeholder overlap, component doesn't render correctly
- `Select` (inside modals) — same rendering issues as Input
- `Modal` / `ModalContent` — doesn't open when `isOpen` changes

**What to use instead:**
- Buttons → native `<button onClick={...}>` styled with Tailwind
- Inputs/selects → native `<input>` / `<select>` styled with Tailwind
- Modals → custom `AppModal` component (`fixed inset-0` backdrop, plain div panel)

**What still works fine (display-only components):**
- `Card`, `CardBody`
- `Chip`
- `Select` / `SelectItem` outside of modals (month filter in page.tsx)

## What's next (potential improvements)

- **Electron production mode** — load from `next start` (or exported static files) instead of
  the dev server, so `npm run dist` produces a fully self-contained app
- **Budget tracking** — set a monthly budget per category and show progress bars toward limits
- **Recurring expenses** — mark an expense as recurring (weekly/monthly) and auto-generate
  future entries
- **Charts** — richer visualizations (monthly trend line, pie chart) using a library like Recharts
- **Import CSV** — allow importing expenses from a CSV file
- **Backend / database** — currently all data is in localStorage; switching to a real DB
  (e.g. Supabase, SQLite via Prisma) would enable multi-device sync
- **Authentication** — user accounts so data is private and portable
- **Dark mode** — NextUI supports it natively via ThemeProvider
- **Tests** — no tests exist yet; add Vitest + Testing Library for unit/integration coverage
