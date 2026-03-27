# Expense Tracker — Project Notes

## What's been built

A complete Next.js + NextUI expense tracking app with localStorage persistence.

### Features
- **Add expenses** — description, amount, category (9 options), date
- **Edit expenses** — pencil button on each row opens modal pre-filled
- **Delete with confirmation** — trash button shows a confirmation modal before deleting
- **Spending breakdown chart** — CSS bar chart showing each category as % of total
- **Month filter** — dropdown to view any past month (appears when data spans 2+ months)
- **Category filter** — chip row to filter list by category
- **CSV export** — downloads current filtered expenses as a .csv file
- **Summary stats** — total spent, this month's total, top category (update to reflect selected month)

### File structure
```
src/
  app/
    page.tsx          — main page, wires all state and modals together
    layout.tsx        — root layout, NextUIProvider
    providers.tsx     — client-side NextUIProvider wrapper
  components/
    ExpenseModal.tsx      — unified add/edit modal
    DeleteConfirmModal.tsx — delete confirmation dialog
    ExpenseList.tsx       — date-grouped list with edit + delete buttons
    SummaryStats.tsx      — three stat cards at top
    SpendingChart.tsx     — category breakdown bar chart
    CategoryFilter.tsx    — chip-based category filter
  hooks/
    useExpenses.ts    — all state, localStorage persistence, derived values
  lib/
    format.ts         — shared formatCurrency and formatDate utilities
  types/
    expense.ts        — Expense interface, CATEGORIES, CATEGORY_ICONS, CATEGORY_COLORS
```

## What's next (potential improvements)

- **Backend / database** — currently all data is in localStorage; switching to a real DB (e.g. Supabase, SQLite via Prisma) would enable multi-device sync
- **Budget tracking** — set a monthly budget per category and show progress bars toward limits
- **Recurring expenses** — mark an expense as recurring (weekly/monthly) and auto-generate future entries
- **Charts** — richer visualizations (monthly trend line, pie chart) using a library like Recharts
- **Import CSV** — allow importing expenses from a CSV file
- **Authentication** — user accounts so data is private and portable
- **Dark mode** — NextUI supports it natively via ThemeProvider
- **Tests** — no tests exist yet; add Vitest + Testing Library for unit/integration coverage
