# Manual Import Update Guide

Due to the complexity of automatically updating all import paths, here's a systematic manual approach:

## STEP 1: Update Component Imports in Pages

### Pattern to Find and Replace:

**In files under `pages/`:**

```typescript
// OLD
import Navbar from '../components/Navbar'
// NEW
import Navbar from '../../components/layout/Navbar'

// OLD
import { useAuth } from '../context/AuthContext'
// NEW (stays same or adjust ../ levels)
import { useAuth } from '../../context/AuthContext'
```

### Files to Update (by folder):

**pages/auth/** (Login.tsx, Register.jsx, ForgotPassword.tsx)
- Already updated in Login.tsx and ProtectedRoute.tsx
- Need to update Register.jsx → convert to TypeScript first

**pages/home/** (Home.tsx)
- Update all component imports

**pages/subjects/** (6 files)
- Update all imports

**pages/learning/** (3 files)
- Update all imports

**pages/assessment/** (5 files)
- Update all imports

**pages/games/** (2 files)
- Update all imports

**Other page folders** (Community, Parental, Progress, Admin, About, Contact, Media)
- Update all imports

## STEP 2: Simple Search and Replace

Use your editor's find and replace (Ctrl+Shift+H in VS Code):

### Replace Component Imports:

1. **Navbar:**
   - Find: `from ['"]\.\.?/components/Navbar`
   - Replace: `from "../../components/layout/Navbar`

2. **Footer:**
   - Find: `from ['"]\.\.?/components/Footer`
   - Replace: `from "../../components/layout/Footer`

3. **ProtectedRoute:**
   - Find: `from ['"]\.\.?/components/ProtectedRoute`
   - Replace: `from "../../components/auth/ProtectedRoute`

And so on for each moved component...

## STEP 3: Check Build

```bash
cd project
npm run dev
```

Fix errors one by one as they appear in the console.

## STEP 4: Common Import Patterns by File Location

### From App.tsx (root src/):
```typescript
import Component from './components/layout/Component'
import Page from './pages/category/Page'
import { useContext } from './context/Context'
```

### From pages/[category]/ (2 levels deep):
```typescript
import Component from '../../components/layout/Component'
import { useContext } from '../../context/Context'
import { service } from '../../services/service'
```

### From components/features/[feature]/ (3 levels deep):
```typescript
import { useContext } from '../../../context/Context'
```

## STEP 5: Known Issues to Fix

1. **Register.jsx** - Still needs TypeScript conversion
2. **Context imports** - Some pages may have wrong ../ levels  
3. **API imports** - May need adjustment after service layer creation
4. **Game imports** - Check relative paths in game files

## Quick Fix Command (run in VS Code terminal):

```bash
# Check for common import errors
cd project
npx tsc --noEmit
```

This will list all TypeScript errors including import issues.
