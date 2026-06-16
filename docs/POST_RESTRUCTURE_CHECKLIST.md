# ✅ POST-RESTRUCTURE CHECKLIST

## Before You Start Coding Again

Go through this checklist to ensure everything is working:

---

## 📋 PHASE 1: Initial Setup (5 minutes)

- [ ] Navigate to backend folder: `cd backend`
- [ ] Install backend dependencies: `npm install`
- [ ] Navigate to frontend folder: `cd ../project`
- [ ] Install frontend dependencies: `npm install`

---

## 📋 PHASE 2: Backend Validation (10 minutes)

### Start Backend

```bash
cd backend
npm run dev
```

- [ ] Server starts without errors
- [ ] Shows "MongoDB connected" message
- [ ] Port 5000 is listening
- [ ] No import errors in console

### Test Backend Endpoints

```bash
# In a new terminal
curl http://localhost:5000/api/auth/me
```

- [ ] API responds (even with 401 unauthorized is fine)
- [ ] No 404 errors
- [ ] Backend logs show the request

---

## 📋 PHASE 3: Frontend Validation (15 minutes)

### Check TypeScript Compilation

```bash
cd project
npx tsc --noEmit
```

- [ ] Note all errors (expected at this stage)
- [ ] Most errors should be import path issues
- [ ] No syntax errors

### Fix Critical Import Errors

**Priority Files (fix these first):**

1. [ ] `src/App.tsx` - Already updated ✅
2. [ ] `src/main.tsx` - Check if needs updates
3. [ ] `src/context/AuthContext.tsx` - Already updated ✅
4. [ ] `src/context/GameContext.tsx` - Check imports
5. [ ] `src/context/TokenContext.tsx` - Check imports

**Update Pattern:**
```typescript
// If you see this error:
Cannot find module './components/Navbar'

// Change import from:
import Navbar from './components/Navbar'

// To:
import Navbar from './components/layout/Navbar'
```

### Start Frontend

```bash
cd project
npm run dev
```

- [ ] Vite starts without crash
- [ ] Shows local URL (usually http://localhost:5173)
- [ ] Open browser to that URL
- [ ] App loads (even with errors is progress)

---

## 📋 PHASE 4: Page-by-Page Verification (30-60 minutes)

### Test Each Route:

Homepage:
- [ ] Navigate to http://localhost:5173
- [ ] Homepage loads
- [ ] No console errors (check F12 Developer Tools)
- [ ] Navbar displays
- [ ] Footer displays

Auth Pages:
- [ ] /login loads
- [ ] /register loads (may need Register.tsx conversion first)
- [ ] /forgot-password loads
- [ ] Forms display correctly

Subjects:
- [ ] /subjects loads
- [ ] Can click on a subject
- [ ] Subject detail page loads

Other Pages (test each):
- [ ] /study-materials
- [ ] /games
- [ ] /quizzes
- [ ] /community
- [ ] /progress
- [ ] /contact

### Fix Errors As You Go:

For each error you see:
1. Note the error message
2. Identify the file with the problem
3. Fix the import path
4. Refresh browser
5. Repeat

---

## 📋 PHASE 5: Common Issues & Fixes

### Issue: "Cannot find module 'X'"

**Solution:**
1. Check if file exists at new location
2. Update import path
3. Count ../ correctly:
   - From App.tsx: `./components/layout/Navbar`
   - From pages/auth/Login.tsx: `../../components/layout/Navbar`
   - From components/features/vault/Vault.tsx: `../../../context/AuthContext`

### Issue: "Module has no default export"

**Solution:**
1. Check if file uses `export default` or named exports
2. Match import style:
   ```typescript
   // Default export
   export default Component;
   import Component from './Component';
   
   // Named export
   export { Component };
   import { Component } from './Component';
   ```

### Issue: Register page not loading

**Solution:**
- Convert Register.jsx to TypeScript:
  1. Copy code from Register.jsx
  2. Create new Register.tsx in pages/auth/
  3. Add proper TypeScript types (see Login.tsx as example)
  4. Delete Register.jsx

### Issue: Context not found

**Solution:**
- Check context files are in src/context/
- Context files should be .tsx now:
  - AuthContext.tsx ✅
  - GameContext.tsx (check if needs updating)
  - TokenContext.tsx (check if needs updating)

---

## 📋 PHASE 6: Final Verification (10 minutes)

### Build Test

```bash
cd project
npm run build
```

- [ ] Build completes successfully
- [ ] No errors in build output
- [ ] Creates dist/ folder

### Production Test

```bash
npm run preview
```

- [ ] Production preview starts
- [ ] App works in production mode
- [ ] All routes accessible

---

## 📋 PHASE 7: Clean Up (5 minutes)

- [ ] Delete empty learnerbot folder if it exists
- [ ] Delete empty old component folders
- [ ] Remove any backup files created
- [ ] Delete frontend folder if empty
- [ ] Delete old project/server folder

```bash
cd ../project
Remove-Item -Path "server" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "learnerbot" -Recurse -Force -ErrorAction SilentlyContinue
```

---

## 📋 OPTIONAL: Enhanced Features

### Create Service Layer

- [ ] Create `src/services/authService.ts`
- [ ] Create `src/services/gameService.ts`
- [ ] Create `src/services/quizService.ts`
- [ ] Create `src/services/subjectService.ts`
- [ ] Split utils/api.js logic into these files
- [ ] Update components to use new services

### Add Common Components

- [ ] Create components/common/Button.tsx
- [ ] Create components/common/Card.tsx
- [ ] Create components/common/Modal.tsx
- [ ] Create components/common/Input.tsx
- [ ] Update pages to use common components

### Create Custom Hooks

- [ ] Create hooks/useApi.ts
- [ ] Create hooks/useLocalStorage.ts
- [ ] Create hooks/useDebounce.ts
- [ ] Update components to use custom hooks

---

## 🎯 SUCCESS CRITERIA

You're done when:

✅ Backend starts without errors
✅ Frontend starts without errors
✅ Homepage loads correctly
✅ Login page works
✅ Can navigate between pages
✅ No critical console errors
✅ Build process succeeds
✅ All main features functional

---

## 📊 PROGRESS TRACKING

Use this to track your progress:

```
Phase 1: Initial Setup         [ ]
Phase 2: Backend Validation    [ ]
Phase 3: Frontend Validation   [ ]
Phase 4: Page Verification     [ ]
Phase 5: Issue Resolution      [ ]
Phase 6: Final Verification    [ ]
Phase 7: Clean Up              [ ]
Optional Enhancements          [ ]
```

---

## 💾 SAVE YOUR WORK

After completing each phase:

```bash
git add .
git commit -m "Phase X complete: [description]"
```

---

## 🆘 IF YOU GET STUCK

1. Check [docs/MANUAL_IMPORT_UPDATE.md](./MANUAL_IMPORT_UPDATE.md)
2. Check [docs/STRUCTURE_QUICK_REFERENCE.md](./STRUCTURE_QUICK_REFERENCE.md)
3. Run `npx tsc --noEmit` to see all errors at once
4. Fix one error at a time
5. Test after each fix

---

## 🎉 WHEN COMPLETE

Congratulations! You now have:

✅ Professional project structure
✅ Separated backend and frontend
✅ TypeScript for better code quality
✅ Scalable folder organization
✅ Industry-standard architecture
✅ Documentation for future reference

**Time to build amazing features! 🚀**

---

*Last Updated: January 26, 2026*
