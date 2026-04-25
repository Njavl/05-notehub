# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Commands

```bash
— Never run "npn run dev".
- Use "npo run build" to check if code compiles or not. See results and fix code if it's needed
npm run lint      # Run ESLint
npm run preview   # Preview production build
```

## Architecture

**NoteHub** is a notes management SPA: React 19 + TypeScript + Vite, styled with
CSS Modules, data fetching via TanStack React Query + Axios, form state via
Formik, and pagination via react-paginate.

The intended data flow mirrors the reference implementation in
`../04-react-query`:

1. `App` orchestrates all state: notes list, current page/search query, and
   which note is selected for modal display.
2. `useQuery` (React Query) drives note fetching; mutations use `useMutation` +
   `queryClient.invalidateQueries` to keep the cache fresh.
3. `noteService.ts` (in `src/services/`) contains the Axios calls — env var
   `VITE_NOTEHUB_TOKEN` (or equivalent) for auth headers.
4. `NoteList` renders the fetched notes; clicking a note card populates
   `selectedNote` state and opens `Modal`.
5. `Modal` is a `createPortal` to `document.body`. It accepts `onClose` and
   renders `NoteForm` (or note detail) as children.
6. `NoteForm` uses Formik with the `Note` types from `src/types/note.ts`; on
   submit it calls the create/update service and closes the modal.

## Key Types

```typescript
// src/types/note.ts
type NoteTag = 'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping';

interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tag: NoteTag;
}
```

## Current Status (skeleton)

The project structure is laid out but not yet wired together:

- `noteService.ts` — three empty stubs: `fetchNotes`, `createNote`, `deleteNote`
- `App.tsx` — no state, no `useQuery`, no `QueryClientProvider` in `main.tsx`
- `Modal.tsx` — portal shell with no props
- `NoteForm.tsx` — Formik form with empty `initialValues` and `onSubmit`
- `NoteList.tsx` — hardcoded mockup item, no mapping over real data

## CSS Conventions

Each component has a co-located `.module.css` file. No global utility classes —
layout is Flexbox/Grid per component. `modern-normalize` is imported in
`main.tsx` via the module declaration in `declarations.d.ts`.

## Reference Implementation

`../04-react-query` (movie search app) is the architectural template for this
project. Refer to it for:

- React Query `useQuery` wiring pattern (query key arrays, `enabled`,
  `placeholderData: keepPreviousData`)
- Modal Escape-key / backdrop-click close logic (see `MovieModal.tsx`)
- Axios service layer pattern with typed responses (see `movieService.ts`)
- Pagination integration with `react-paginate` (see `Pagination.tsx` wrapper —
  needed due to module format quirk in Vite 8+)
- Toast notifications with `react-hot-toast`
