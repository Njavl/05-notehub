# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run build     # Verify compilation (tsc -b + vite build) — use this to check for errors
npm run lint      # Run ESLint
npm run preview   # Preview production build
```

**Never run `npm run dev`.**

## Backend API

Base URL: `https://notehub-public.goit.study/api/notes`  
Docs: `https://notehub-public.goit.study/api/docs`

Auth: `Authorization: Bearer <token>` header. Token comes from `VITE_NOTEHUB_TOKEN` env var — never hardcode it.

Key endpoints:
- `GET /api/notes?page=1&perPage=12&search=text` — paginated + filterable list
- `POST /api/notes` — create note, returns created note
- `DELETE /api/notes/:id` — delete note by ID, returns deleted note

## Missing Dependencies (must install)

These are required by the task but not yet in `package.json`:
- `yup` — Formik schema validation
- `use-debounce` — debounced search (`useDebouncedCallback`)

## Architecture

**NoteHub** — notes CRUD SPA. Stack: React 19 + TypeScript + Vite + TanStack React Query + Axios + Formik + Yup + react-paginate + CSS Modules.

**Data flow:**
1. `App` holds `page` and `search` state. `useDebouncedCallback` (from `use-debounce`) wraps the search setter — use it in `App`, not in `SearchBox`.
2. `useQuery` fetches notes via `fetchNotes({ page, search })`. TanStack Query manages all server state (fetching, caching, mutations).
3. `useMutation` handles `createNote` and `deleteNote`; invalidate the notes query key on success.
4. `NoteList` renders if `notes.length > 0`. `Pagination` renders if `totalPages > 1`.
5. "Create note +" button opens `Modal` containing `NoteForm`. `Modal` closes on backdrop click or Escape key.
6. `NoteForm` submits via `createNote` mutation, then closes the modal.

## Type Locations

| Type | File |
|---|---|
| `Note`, `NoteTag` | `src/types/note.ts` |
| `FetchNotesResponse`, request param types, Axios response types | `src/services/noteService.ts` |
| `ComponentNameProps` interfaces | Inside each component file |

All event callbacks in component props must be explicitly typed. Use `interface` (not `type`) for props. Props interface naming: `ComponentNameProps`.

## Form Validation (Yup schema in NoteForm)

- `title`: required, min 3 chars, max 50 chars
- `content`: optional, max 500 chars
- `tag`: required, one of `Todo | Work | Personal | Meeting | Shopping`

## Component Contracts

**`Modal`** — generic wrapper; renders any `children`. Uses `createPortal` to `document.body`. DOM structure:
```html
<div class="backdrop" role="dialog" aria-modal="true">
  <div class="modal">{children}</div>
</div>
```
Closes on backdrop click and Escape key.

**`SearchBox`** — renders a single `<input type="text" placeholder="Search notes" />`. Receives a callback prop; debouncing lives in `App` via `useDebouncedCallback`.

**`Pagination`** — thin wrapper around `react-paginate`. Only renders when `totalPages > 1`. Note: react-paginate has a module format quirk in Vite 8+ — use a wrapper component (see `../04-react-query/src/components/Paginate/Pagination.tsx`).

**`NoteList`** — renders the `<ul>` list; only mounts when collection has ≥ 1 note. Delete button calls `deleteNote` mutation.

## Conventions

- Each component lives in `src/components/<Name>/` with `<Name>.tsx` and `<Name>.module.css`.
- All components use `export default`.
- Shared entity types → `src/types/`. HTTP interfaces/params → `src/services/noteService.ts`. Props interfaces → component file.
- CSS Modules only; no global utility classes. `modern-normalize` imported in `main.tsx`.

## Reference Implementation

`../04-react-query` (movie search app) demonstrates the same stack wired together. Refer to it for:
- React Query `useQuery` / `useMutation` pattern with typed query keys
- Modal Escape + backdrop close logic (`MovieModal.tsx`)
- Axios service layer with typed request/response (`movieService.ts`)
- react-paginate wrapper workaround (`Paginate/Pagination.tsx`)
