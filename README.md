# Applicant Tracker (Frontend)

A small React + TypeScript UI to manage job applicants: list, search, filter, paginate, add, edit, delete, and toggle hired status. Connects to a backend API (default `https://localhost:7292`).

## Features

- Applicant list with search and status filter (all, hired, pending)
- Client-side pagination controls
- Create and edit applicants
- Toggle hired status
- Toast notifications
- Age validation: Age must be between 20 and 60. You’ll see “Age' must be between 20 and 60. You entered X.” on invalid input

## Tech Stack

- React 18, TypeScript, Vite
- Zustand (state), Zod (validation)
- Radix UI primitives + small UI components
- Tailwind CSS (v4) + tailwindcss-animate
- Sonner (toasts), Lucide (icons)

## Getting Started

1. Install dependencies

```bash
pnpm install
```

2. Configure API base URL

- The API base is defined in `lib/api.ts` as `API_BASE`. Default is `https://localhost:7292`.
- Update it if your backend runs elsewhere.

3. Run the dev server

```bash
pnpm dev
```

4. Build for production

```bash
pnpm build
pnpm preview
```

## Project Structure

- `src/main.tsx` – app entry
- `src/App.tsx` – root component
- `components/` – UI and feature components
  - `components/applicant-list.tsx` – list, search, filter, pagination
  - `components/applicant-form.tsx` – create/edit form with validation
  - `components/ui/*` – minimal UI primitives
- `store/applicant-store.ts` – Zustand store, API calls wiring
- `lib/api.ts` – API client and DTO mapping
- `styles/globals.css` or `app/globals.css` – global styles

## Notes

- In development, React Strict Mode can cause `useEffect` to run twice. We disabled Strict Mode in `src/main.tsx` to avoid duplicate fetches.
- Ensure your backend has CORS configured to allow the dev server origin.

## License

MIT
