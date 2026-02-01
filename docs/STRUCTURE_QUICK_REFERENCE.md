# LearnKins - Quick Reference Guide for New Structure

## 📁 Project Structure Overview

```
learnkinsnew/
├── backend/          # Express backend (separate from frontend)
├── project/          # React frontend (Vite)
├── docs/             # All documentation
└── frontend/         # (empty - can be removed)
```

---

## 🔙 BACKEND STRUCTURE

### Location: `backend/`

```
backend/
├── src/
│   ├── server.js                    # Main entry point
│   ├── controllers/                 # Request handlers (13 files)
│   ├── models/                      # Mongoose schemas (13 files)
│   ├── routes/                      # API routes (13 files)
│   ├── middleware/                  # Express middleware (3 files)
│   ├── utils/                       # Utility functions
│   ├── seeds/                       # Database seeding scripts
│   ├── services/                    # Business logic (TO CREATE)
│   ├── validators/                  # Input validation (TO CREATE)
│   └── config/                      # Configuration files (TO CREATE)
├── scripts/                         # Test scripts (9 files)
├── uploads/                         # User uploaded files
├── package.json
└── README.md
```

### Running Backend

```bash
cd backend
npm install
npm run dev          # Start development server
npm run seed         # Seed database
npm run seed:all     # Seed all data
```

---

## 🎨 FRONTEND STRUCTURE

### Location: `project/`

```
project/
├── src/
│   ├── components/
│   │   ├── layout/              # Navbar, Footer, ScrollToTop
│   │   ├── features/            # Feature-specific components
│   │   │   ├── achievements/    # AchievementCard
│   │   │   ├── progress/        # ProgressBar, LevelDisplay
│   │   │   ├── vault/           # Vault
│   │   │   └── videos/          # SiteVideos
│   │   ├── animation/           # StartupAnimation
│   │   ├── auth/                # ProtectedRoute
│   │   └── common/              # (TO CREATE) Reusable UI components
│   │
│   ├── pages/
│   │   ├── auth/                # Login, Register, ForgotPassword
│   │   ├── home/                # Home
│   │   ├── subjects/            # Subjects, SubjectDetail, Math, Science, etc.
│   │   ├── learning/            # StudyMaterials, Notes, Flashcards
│   │   ├── assessment/          # Quizzes, Quiz, ProfessionalQuizzes
│   │   ├── games/               # Games, Game
│   │   ├── community/           # Community
│   │   ├── parental/            # ParentalControl
│   │   ├── progress/            # Progress
│   │   ├── admin/               # AdminPanel
│   │   ├── about/               # Team, Faculty
│   │   ├── contact/             # Contact
│   │   └── media/               # VideoPage
│   │
│   ├── features/
│   │   └── learnerbot/          # EmbeddedLearnerBot + related files
│   │
│   ├── context/                 # React Context (Auth, Game, Token)
│   ├── hooks/                   # Custom React hooks (TO CREATE)
│   ├── services/                # API service layer (TO CREATE)
│   ├── utils/                   # api.js, authAPI.js
│   ├── types/                   # TypeScript type definitions
│   ├── games/                   # Game implementations
│   ├── data/                    # Static JSON data
│   ├── assets/                  # Static assets (TO CREATE)
│   └── __tests__/               # Test files
│
├── public/                      # Static files
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

### Running Frontend

```bash
cd project
npm install
npm run dev              # Start dev server
npm run build            # Build for production
npm run server           # Start backend from frontend
npm run server:install   # Install backend dependencies
```

---

## 📝 DOCUMENTATION

### Location: `docs/`

All `.md` files have been moved here:
- `SETUP.md` - Setup instructions
- `QUICK_START.md` - Quick start guide
- `MONGODB-SETUP.md` - MongoDB setup
- `BACKEND_INTEGRATION_GUIDE.md` - Backend integration
- `OTP_QUICK_START.md` - OTP setup
- `OTP_PASSWORD_RESET.md` - Password reset with OTP
- `DATA_SEEDING_COMPLETE.md` - Database seeding guide
- `RESTRUCTURE_PROGRESS.md` - This restructure progress

---

## 🔄 IMPORT PATH EXAMPLES

### Before (Old Structure)
```typescript
import Navbar from './components/Navbar';
import Login from './pages/Login';
import { useAuth } from './context/AuthContext';
```

### After (New Structure)
```typescript
import Navbar from './components/layout/Navbar';
import Login from './pages/auth/Login';
import { useAuth } from './context/AuthContext';
```

### Relative Imports Examples

**From App.tsx:**
```typescript
import Home from './pages/home/Home';
import Login from './pages/auth/Login';
```

**From a page (e.g., pages/auth/Login.tsx):**
```typescript
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/layout/Navbar';
```

**From a nested component (e.g., components/features/progress/ProgressBar.tsx):**
```typescript
import { useAuth } from '../../../context/AuthContext';
```

---

## 🛠️ COMMON TASKS

### Adding a New Component

**Layout Component:**
1. Create in `src/components/layout/`
2. Import from: `../components/layout/ComponentName`

**Feature Component:**
1. Create in `src/components/features/[feature-name]/`
2. Import from: `../components/features/[feature-name]/ComponentName`

### Adding a New Page

1. Identify category (auth, subjects, learning, etc.)
2. Create in `src/pages/[category]/`
3. Update App.tsx with new route
4. Import from: `./pages/[category]/PageName`

### Adding a New API Service

1. Create in `src/services/`
2. Export service functions
3. Import in pages/components: `import { functionName } from '../../services/serviceName'`

---

## 🐛 TROUBLESHOOTING

### Import Errors

1. Check file location in new structure
2. Verify relative path (../ levels)
3. Check file extension (.tsx vs .jsx)
4. Ensure no circular dependencies

### Module Not Found

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors

```bash
# Run TypeScript compiler
npx tsc --noEmit
```

### Build Errors

```bash
# Check for syntax errors
npm run lint

# Try clean build
rm -rf dist
npm run build
```

---

## ⚡ NEXT STEPS

1. ✅ Run import updater script: `.\update-imports.ps1`
2. ⏳ Create service layer files in `src/services/`
3. ⏳ Convert Register.jsx to Register.tsx
4. ⏳ Test frontend: `npm run dev`
5. ⏳ Test backend: `cd backend && npm run dev`
6. ⏳ Fix any remaining import errors
7. ⏳ Update backend server.js for new structure

---

## 📞 File Location Quick Reference

| Old Location | New Location |
|-------------|--------------|
| `components/Navbar.tsx` | `components/layout/Navbar.tsx` |
| `pages/Login.jsx` | `pages/auth/Login.tsx` |
| `pages/Home.tsx` | `pages/home/Home.tsx` |
| `components/ProtectedRoute.jsx` | `components/auth/ProtectedRoute.tsx` |
| `learnerbot/` | `features/learnerbot/` |
| `server/` | `../backend/src/` |
| `*.md` (root) | `../docs/*.md` |

---

## 🎯 Benefits of New Structure

✅ **Separation of Concerns** - Backend and frontend completely separate
✅ **Scalability** - Easy to find and organize files as project grows
✅ **Team Collaboration** - Clear folder structure for multiple developers
✅ **Type Safety** - Converted to TypeScript for better error catching
✅ **Industry Standard** - Follows React/Node.js best practices
✅ **Maintainability** - Easier to update and refactor code
