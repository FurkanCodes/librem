# Lector Implementation Contract (React Native Full-Parity Build)

This file is the canonical implementation specification for the `Lector` app in this repository.

Scope: Entire repo rooted at `/Users/furkan/lector`.

## Project Goal
- Build a React Native (Expo Router) app that reproduces the source app’s design intent, interaction model, and logic with full core parity.
- Preserve the existing `app` file-based routing foundation and evolve it into product routes/screens.
- Prioritize both visual fidelity and behavior fidelity, with mobile-native gestures and performance.

## Source of Truth
- Reference source implementation: `/Users/furkan/E-book Reader with Chunking`.
- Key files to mirror behavior from:
  - `src/App.tsx`
  - `src/components/Library.tsx`
  - `src/components/Reader.tsx`
  - `src/components/ProfileView.tsx`
  - `src/components/SettingsView.tsx`
  - `src/components/SessionSummary.tsx`
  - `src/components/ShareSheet.tsx`
  - `src/lib/data.ts`
  - `src/lib/ThemeContext.tsx`

## Tech Stack and Styling Policy
- Runtime/UI: Expo + React Native + Expo Router.
- Styling: `StyleSheet.create` + centralized typed design tokens.
- Dynamic states: inline computed styles are allowed only for animation/gesture/theme-driven values.
- Do not adopt utility-class-first styling as the primary architecture.
- Rationale:
  - This app has high dynamic complexity (theme interpolation, mode switching, overlays, gesture transforms).
  - Typed style objects are clearer, easier to audit, and safer in TypeScript.

## Navigation Contract
- Tabs:
  - `Library`
  - `Collection`
  - `Profile`
- Stack route:
  - `Reader` at `/reader/[bookId]`
- Reader entry points:
  - From `Library` selected/current book
  - From `Collection` deep-linking to a specific chunk when available
- Profile subflow:
  - Profile main
  - Settings subview
- Reader exit flow:
  - If at least one chunk has been visited in session, show `SessionSummary`
  - Otherwise return directly to `Library`

## Domain Model and Public Interfaces
- `Book`
  - `id: string`
  - `title: string`
  - `author: string`
  - `synopsis: string`
  - `coverUrl: string`
  - `content: string`
  - `chunks: string[]`
  - `progress: number`
  - `totalChunks: number`
- `Highlight`
  - `id: string`
  - `bookId: string`
  - `chunkIndex: number`
  - `text: string`
  - `createdAt: string` (ISO timestamp)
- `ReadingStreak`
  - `streak: number`
  - `lastDateISO: string` (YYYY-MM-DD)
- `ReaderPreferences`
  - `theme: 'light' | 'sepia' | 'dark' | 'immersive'`
  - `mode: 'vertical' | 'horizontal'`
  - `fontId: string`
  - `fontSize: number`
  - `slowRead: boolean`
  - `hapticEnabled: boolean`
  - `autoNightEnabled: boolean`
  - `wpm: number`
- `ReaderSession`
  - `currentBookId: string | null`
  - `currentChunkIndex: number`
  - `visitedChunkIndices: number[]`
- `ReaderState`
  - `books: Book[]`
  - `highlights: Highlight[]`
  - `streak: ReadingStreak`
  - `preferences: ReaderPreferences`
  - `session: ReaderSession`
  - `hydrated: boolean`
- Route contract:
  - `/reader/[bookId]?chunk=<number>`
  - `chunk` is optional and clamped to valid range.
- Persistence contract:
  - Single payload key: `lector.reader.v1`
  - Versioned payload and migration hook required.

## State Management and Persistence
- Use a domain store in `features/reader/` (context + reducer).
- Keep actions explicit and deterministic (no implicit side effects in view components).
- Persist all state domains:
  - Reading progress
  - Highlights
  - Streak
  - Theme/preferences
  - Last reading position/session
- Hydration:
  - Must complete before first interactive tab render (`hydrated` gate).
- Streak logic:
  - Increment at most once per calendar day.
  - If `lastDateISO` is yesterday, increment streak; otherwise reset to `1`.
- Write strategy:
  - Debounced persistence to reduce storage churn.
- Migrations:
  - Include `version` in stored payload.
  - Backward-compatible migration path required for schema changes.

## Screen-by-Screen Behavioral Spec

### Library
- Coverflow-style carousel with strong center emphasis.
- Ambient blurred background based on selected book cover.
- Dot indicators for selected index.
- Metadata/progress panel with estimated remaining read time.
- Synopsis bottom sheet with:
  - Drag-to-dismiss
  - Blurred backdrop
  - CTA to open reader
- Optional import affordance remains simulated in phase 1.

### Collection
- Render saved highlights/passages list.
- Empty state when no saved highlights exist.
- Each item shows source attribution (book title/cover).
- Tap item deep-links to reader at corresponding chunk when resolvable.

### Profile
- Show streak and content stats.
- Streak badge behavior mirrors source.
- Decorative “Ex Libris” motif retained.
- Entry into settings subview.

### Settings
- Appearance toggle wired to real app state.
- Reading speed selector (`wpm`) wired to reader behavior.
- Haptic toggle wired to interaction feedback.
- Additional settings can be future-ready but must still be state-backed.

### Reader
- Two reading modes:
  - Vertical full-screen paged passages
  - Horizontal card swipe mode
- Text rendering:
  - Drop-cap logic
  - Slow-read reveal mode
  - Font family + font size customization
- Interactions:
  - Double-tap highlight toggle
  - Long-press action menu
  - Share sheet
  - Session summary on exit (conditional)
- Overlays:
  - Opening cover reveal
  - Auto-hiding top controls

## Animation and Gesture Spec
- Locked thresholds:
  - Double-tap save window: `300ms`
  - Long-press trigger: `600ms`
  - Horizontal swipe threshold: `50px`
  - Synopsis drag-dismiss: offset `>80` or velocity `>500`
  - Reader auto-hide controls timeout: `3000ms`
- Use `react-native-reanimated` and `react-native-gesture-handler` for gesture/animation parity.
- Favor spring animations for sheet/card transitions where source behavior implies spring motion.

## Design Token System
- Maintain typed token maps for:
  - App light/dark surfaces
  - Reader themes: `light`, `sepia`, `dark`, `immersive`
  - Text hierarchy
  - Borders/dividers
  - Progress tracks/fills
  - CTA states
  - Tab and badge states
- All component color usage should come from tokens.
- Hardcoded colors only allowed for:
  - temporary placeholders during implementation,
  - highly specific effects that are then promoted to tokens.

## File/Folder Architecture
- `features/reader/`
  - Domain types
  - Seed data and chunking
  - Reducer/store
  - Persistence and migrations
  - Selectors/helpers
- `components/reader/`
  - Bottom sheets
  - Carousel/card primitives
  - Reader controls/overlays
  - Share card UI primitives
- `app/(tabs)/`
  - `index.tsx` => Library
  - `collection.tsx`
  - `profile.tsx`
  - `_layout.tsx` => tab contract
- `app/reader/[bookId].tsx`
  - Reader entry route
- Reuse existing shared components where suitable; replace starter-template screens.

## Implementation Sequence
1. Define domain types, seed data, and chunking helpers.
2. Implement store/reducer and persistence module with hydration.
3. Mount providers in root layout and finalize navigation contract.
4. Implement Library screen + synopsis sheet + route entry.
5. Implement Reader core modes, gestures, settings, and overlays.
6. Implement Collection deep-linking and Profile/Settings flow.
7. Implement ShareSheet + SessionSummary parity behaviors.
8. Run lint + TypeScript checks and close acceptance checklist.

## Testing and Acceptance Criteria
- Functional scenarios:
  - Chunk generation validity and stable chunk indexing.
  - Daily streak correctness (same-day, consecutive-day, reset).
  - Highlight toggle idempotency and collection synchronization.
  - Reader mode switching without losing session state.
  - Theme/font/size persistence across app restarts.
  - Deep-link to chunk from Collection works.
  - Session summary appears only if reading activity occurred.
  - Share/copy behaviors succeed or gracefully fall back.
  - Safe-area behavior on iOS and Android gesture devices.
- Project checks:
  - `npm run lint` passes.
  - `npx tsc --noEmit` passes.

## Non-Goals (Phase 1)
- Real EPUB/PDF parsing/import pipeline.
- Remote catalog/content sync.
- User accounts or cloud sync.

## Assumptions and Defaults
- Full parity is required for core design and logic.
- Seed books are the only content source in phase 1.
- Expo Router remains tab + stack (no single-screen state-machine rewrite).
- Styling remains `StyleSheet + tokens`.
- This file (`AGENTS.md`) is canonical implementation guidance.
