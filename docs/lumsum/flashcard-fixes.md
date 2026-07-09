# Flashcard AI Generation — Fixes & Improvements

## Backend

### Flashcard Controller (`backend/src/controllers/flashcardController.js`)

- **`generateAIFlashcards` now accepts subject, difficulty, count** — previously only accepted `topic`. Now generates cards specific to a subject/difficulty and supports 1–10 cards (up from fixed 5).
- **Added `batchCreateFlashcards` endpoint** — saves multiple flashcards at once via `Flashcard.insertMany()` so AI-generated cards can be persisted. Validates each card (question + answer required), caps at 50 per batch, normalises tags and subjects.

### Flashcard Routes (`backend/src/routes/flashcards.js`)

- **Added `POST /api/flashcards/batch`** — protected route (any authenticated user) for batch-saving flashcards. Previously only `admin/teacher` could create cards via `POST /api/flashcards`.

## Frontend

### API layer (`project/src/utils/api.js`)

- **`generateAIFlashcards`** — now sends full params object `{ topic, subject, difficulty, count }` instead of just `{ topic }`.
- **Added `batchCreateFlashcards(flashcards)`** — calls `POST /api/flashcards/batch`.

### AI Service (`project/src/services/flashcardAiService.ts`)

- **`generateFlashcards(params)`** — accepts `AiGenerationParams` (topic, subject, difficulty, count), passes all to backend.
- **Added `saveGeneratedFlashcards(cards)`** — calls batch API, returns saved cards with success/error.

### Flashcards Page (`project/src/pages/learning/Flashcards.tsx`)

- **AI modal moved to top-level** — was nested inside the `activeTab === "create"` block, so clicking "Generate with AI" in the Browse tab never showed the modal. Now renders unconditionally.
- **Options form** — subject (4 options), difficulty (Easy/Medium/Hard), and count (1–10) inputs added to AI modal.
- **Save All Cards** — green button in the preview section that persists generated cards to the database via the batch endpoint. On success, merges saved cards into the flashcard list and switches to Browse tab.
- **Study Now** — starts study mode with AI-generated cards (preview only, not saved).
- **Auth gate** — if user is not authenticated, clicking "Generate" shows a login/register modal instead of making the API call. Prevents 401 errors and improves UX.

## Flow

```
User clicks "Generate with AI" in Browse tab
  → Auth check (login modal if not authenticated)
  → AI modal opens with topic + subject + difficulty + count
  → Clicks "Generate"
  → OpenRouter generates cards
  → Preview shows cards with "Save All Cards" / "Study Now" / "Back"
  → "Save All Cards" → batch saved to DB → modal closes → cards appear in Browse
  → "Study Now" → study mode with temporary cards
```
