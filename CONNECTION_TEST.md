# 🔗 Frontend-Backend Connection Test

## Current Status

### ❌ Backend Status
- **Expected**: Running on `http://localhost:5000`
- **Actual**: Exit Code 1 (FAILED)
- **Issue**: Backend crashed or failed to start

### ❓ Frontend Status
- **Expected**: Running on `http://localhost:5173`
- **Status**: Unknown

---

## 🔧 Configuration Check

### ✅ Frontend API Configuration
```javascript
// File: src/utils/api.js
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
```
✅ Correctly set to port 5000

### ✅ Backend CORS Configuration
```javascript
// File: src/server.js
const allowedOrigins = [
  "http://localhost:5173",  // ✅ Frontend URL
  "http://127.0.0.1:5173",
  ...
];
```
✅ Allows frontend at localhost:5173

### ✅ Backend Environment
```env
PORT=5000
FRONTEND_URL=http://localhost:5173
USE_INMEMORY_DB=true
```
✅ Configuration is correct

---

## 🚀 Steps to Fix Connection

### Step 1: Start Backend
Open Terminal in `backend/` folder:
```bash
npm run dev
```

**Expected Output**:
```
Server running on port 5000 in development mode
✅ Connected to in-memory MongoDB
🔄 MongoDB: connecting...
✅ MongoDB connected successfully
```

### Step 2: Start Frontend
Open Terminal in `project/` folder:
```bash
npm run dev
```

**Expected Output**:
```
  VITE v5.0.0  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

### Step 3: Test the Connection

#### Option A: Test in Browser
1. Open `http://localhost:5173`
2. Open Browser DevTools (F12)
3. Go to **Network** tab
4. Try to login or navigate to any page
5. Look for API calls to `http://localhost:5000/api`
6. Check if responses are successful (200 status)

#### Option B: Test via API
Open PowerShell and run:
```powershell
# Test backend health
curl http://localhost:5000/api/auth/login -Method OPTIONS -Verbose
```

Expected Response:
```
StatusCode        : 200
StatusDescription : OK
```

#### Option C: Test Login Request
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"mohitlalwani1931@gmail.com","password":"mohit@123"}'
```

Expected Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "email": "mohitlalwani1931@gmail.com",
    "role": "student",
    ...
  }
}
```

---

## 🐛 Troubleshooting

### Backend Not Starting?
```bash
cd backend
npm install  # Ensure dependencies installed
npm run dev
```

Check for errors in console. If `mongodb-memory-server` issue:
```bash
npm install mongodb-memory-server --save-dev
```

### Frontend Can't Connect to Backend?
1. Verify backend is running on port 5000
2. Check CORS errors in browser console
3. Test with curl first (shown above)
4. Check firewall isn't blocking port 5000

### API Returns 401/403?
- Check JWT token is being sent
- Verify token hasn't expired
- Check Authorization header format: `Bearer <token>`

---

## ✅ Connection Verified When

- ✅ Backend starts without errors
- ✅ Frontend loads at http://localhost:5173
- ✅ Network tab shows successful API calls
- ✅ Login returns JWT token
- ✅ API calls use token in Authorization header

---

## 📊 API Endpoints to Test

| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---|
| POST | `/api/auth/login` | Login user | ❌ No |
| GET | `/api/users/profile` | Get user profile | ✅ Yes |
| GET | `/api/subjects` | Get all subjects | ✅ Yes |
| GET | `/api/quizzes` | Get quizzes | ✅ Yes |

---

## Next Steps

1. **Start Backend**: `cd backend && npm run dev`
2. **Start Frontend**: `cd project && npm run dev`
3. **Test Connection**: Navigate to `http://localhost:5173` and try login
4. **Check DevTools**: Open F12 → Network tab → verify API calls succeed

Let me know if you see any error messages! 🚀
