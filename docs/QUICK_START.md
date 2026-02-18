# 🚀 LearnKins - Backend Integration Quick Start

## Current Status
✅ **Backend:** Running on `http://localhost:5000`
✅ **Database:** MongoDB on `localhost:27017`
✅ **API:** All endpoints functional
✅ **Frontend:** React + TypeScript

## What's Already Integrated

### 1. **Parental Control** ✅ (100% Complete)
- Real-time syncing with backend
- Database persistence for parent/child relationships
- Full CRUD operations for controls

### 2. **Quiz System** ✅ (90% Complete)
- Real quiz data from backend
- Answer submission & scoring
- Progress tracking
- Only missing: Live leaderboard

## How to Use Features

### Run the Full Application
```bash
# Terminal 1: Start MongoDB
"C:\Program Files\MongoDB\Server\bin\mongod.exe"

# Terminal 2: Start Backend
cd project/server
npm start

# Terminal 3: Start Frontend
cd project
npm run dev
```

### Test Backend Endpoints
```bash
# Check if server is running
curl http://localhost:5000/api/auth/me

# You should get a 401 error (no auth token) - this is normal!
```

### Features Using Real Backend Data

**✅ Parental Control Page**
- Login as a parent
- Go to Parental Control
- See real children from database
- Adjust controls and save (syncs to MongoDB)

**✅ Quiz Page**
- Login as student
- Navigate to a quiz
- Take the quiz and submit
- Scores save to database in real-time

## Integration Status by Feature

| Feature | Status | Data Source | Last Updated |
|---------|--------|-------------|--------------|
| Parental Control | ✅ Ready | Backend | Dec 8 |
| Quiz System | ✅ Ready | Backend | Dec 8 |
| Flashcards | ⏳ Pending | Backend available | Dec 8 |
| Games | ⏳ Pending | Backend available | Dec 8 |
| Progress | ⏳ Pending | Backend available | Dec 8 |
| Community | ⏳ Pending | Backend available | Dec 8 |
| Materials | ⏳ Pending | Backend available | Dec 8 |

## File Reference

### API Integration
- **API Functions:** `src/utils/api.js`
- **Backend Routes:** `server/routes/*.js`
- **Backend Controllers:** `server/controllers/*.js`

### Frontend Pages (To Be Updated)
- `src/pages/Flashcards.tsx` - Need backend integration
- `src/pages/Games.tsx` - Need backend integration
- `src/pages/Progress.tsx` - Need backend integration
- `src/pages/Community.tsx` - Need backend integration
- `src/pages/StudyMaterials.tsx` - Need backend integration

### Already Integrated
- ✅ `src/pages/ParentalControl.tsx` - Fully integrated
- ✅ `src/pages/Quiz.tsx` - Fully integrated

## Common API Patterns

### Fetch Data
```typescript
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetch = async () => {
    try {
      const res = await someAPI.getItems();
      setData(res.data.items);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  fetch();
}, []);
```

### Submit Data
```typescript
const handleSubmit = async (data) => {
  try {
    const res = await someAPI.createItem(data);
    // Handle success
  } catch (err) {
    console.error(err);
    // Handle error
  }
};
```

## Database Access

### View MongoDB Data
```bash
# Open MongoDB Compass or mongosh
mongo

# Use database
use learnkins

# View collections
show collections

# Query data
db.users.find()
db.quizzes.find()
db.parentalcontrols.find()
```

## Troubleshooting

**Backend not connecting?**
```bash
# Check if port 5000 is free
netstat -ano | findstr :5000

# If in use, kill it
taskkill /PID <pid> /F
```

**MongoDB not found?**
```bash
# Start MongoDB
"C:\Program Files\MongoDB\Server\bin\mongod.exe"

# Check connection
netstat -ano | findstr :27017
```

**API returning 401?**
- This is normal without a token
- Login first to get a token
- Token is auto-added to all requests

## Next Steps

To integrate the remaining features, follow the template in `BACKEND_INTEGRATION_GUIDE.md`:

1. Open the page file (e.g., `Flashcards.tsx`)
2. Add imports from `utils/api`
3. Create fetch functions in `useEffect`
4. Replace demo data with API response
5. Add loading/error states
6. Test in browser

Example for Flashcards:
```typescript
import { flashcardAPI } from '../utils/api';

useEffect(() => {
  const fetch = async () => {
    const res = await flashcardAPI.getFlashcards(subjectId);
    setFlashcards(res.data.flashcards);
  };
  fetch();
}, [subjectId]);
```

## Server Commands

```bash
# Start backend
npm start  # Default port 5000

# Start with custom port
PORT=5001 npm start

# View server logs
# Check browser console for API errors
```

## API Response Format

All APIs return:
```javascript
{
  success: true,
  data: { /* actual data */ },
  message: "Success message"
}
```

Or on error:
```javascript
{
  success: false,
  message: "Error message"
}
```

## Performance Tips

✅ Use `useEffect` with empty dependency array for initial load
✅ Add loading states so UI doesn't freeze
✅ Handle errors gracefully with try-catch
✅ Don't fetch on every render
✅ Use proper key props in lists

## Support Resources

- **Backend Guide:** `BACKEND_INTEGRATION_GUIDE.md`
- **API Documentation:** `src/utils/api.js` comments
- **Example Integration:** `src/pages/Quiz.tsx`
- **Server Logs:** Terminal where `npm start` is running
- **Browser Console:** F12 → Console tab

---

**Ready to integrate more features?** Pick any page from the "Pending" list and follow the template!

**Need help?** Check `BACKEND_INTEGRATION_GUIDE.md` for detailed instructions.
