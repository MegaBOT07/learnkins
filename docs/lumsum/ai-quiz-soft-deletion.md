# AI Quiz Soft Deletion

## Why soft delete instead of hard delete

Attempts are embedded **inside** the ProfessionalQuiz document (not a separate collection). Hard-deleting the document destroys all attempt history, perfect score credit, achievement progress, and token audit trails in one shot. Soft deletion is a single lightweight write (`{ isActive: false }`) — zero server load, all data preserved.

## How it works

- Sets `isActive = false` on the quiz document
- Quiz stays in the database — attempts, statistics, all embedded data intact
- Every query filters by `isActive: true` by default — deleted quizzes are invisible to the user

## What's preserved

| Data | Location | Status |
|------|----------|--------|
| Attempt history | Embedded in `ProfessionalQuiz.attempts[]` | ✅ Preserved |
| Perfect scores | Achievement checker scans all quiz docs for `attempts.userId` | ✅ Still counted |
| User `totalQuizzesTaken` | `User` model (aggregate counter) | ✅ Unchanged |
| User `perfectScores` | `User` model (aggregate counter) | ✅ Unchanged |
| Token transactions | `TokenTransaction` collection (`meta.quizId`) | ✅ Ref stays valid |
| Progress activities | `Progress.completedActivities[]` (`activityId`) | ✅ Ref stays valid |
| Certificates | Embedded in attempt subdocuments (`certificateId`) | ✅ Preserved |

## API endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| `GET` | `/api/professional-quizzes/my-ai` | Required | List own AI quizzes (only `isActive: true`) |
| `DELETE` | `/api/professional-quizzes/my-ai/:id` | Required | Soft-delete own AI quiz (only creator) |
| `GET` | `/api/professional-quizzes` | Public | Public listing — excludes AI quizzes and inactive ones |

## Controller logic (`deleteMyAIQuiz`)

```
1. Find quiz by _id, isAIGenerated: true, createdBy: userId
2. If not found → 404
3. Set quiz.isActive = false
4. Save quiz
5. Return success with quiz data
```

Does **not** touch:
- `User.totalQuizzesTaken` / `User.perfectScores`
- `TokenTransaction` records
- `Progress.completedActivities`
- Achievement checker data (document still exists for perfect-score queries)

## Why not hard delete

The built-in admin `deleteProfessionalQuiz` uses `findByIdAndDelete` — it permanently destroys the document and all embedded attempts/statistics/certificates. That approach is unsuitable for AI quizzes where users have attempt history, progress tracking, and token transactions.

Soft deletion preserves **all** dependent data while making the quiz invisible. The database impact is negligible — each AI quiz is a few KB of text.
