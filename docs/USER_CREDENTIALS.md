# 🔐 User Credentials & Access Guide

## 📋 Test User Accounts

All credentials are **auto-generated** when the backend starts with `USE_INMEMORY_DB=true` or connects to MongoDB.

### Quick Reference Table

| **User Type** | **Email** | **Password** | **Role** | **Grade** |
|---|---|---|---|---|
| 👨‍🎓 Student | `mohitlalwani1931@gmail.com` | `mohit@123` | `student` | 6th |
| 👨‍👩‍👧 Parent | `mohitlalwani1931.parent@gmail.com` | `mohit@123` | `parent` | N/A |
| 🔐 Admin | `admin@learnkins.com` | `admin123` | `admin` | N/A |

---

## 👥 User Roles & Permissions

### **1. Student Role** 👨‍🎓
**Email**: `mohitlalwani1931@gmail.com`  
**Password**: `mohit@123`

**Permissions**:
- ✅ Access all quizzes and assessments
- ✅ Play educational games
- ✅ View study materials and notes
- ✅ Create and manage flashcards
- ✅ Track personal progress and achievements
- ✅ View achievements and badges
- ✅ Purchase items from shop using tokens
- ✅ Join study groups and community
- ✅ Participate in discussions
- ❌ Cannot create content (quizzes, materials)
- ❌ Cannot manage users
- ❌ Cannot access admin panel

**Default Grade**: 6th

---

### **2. Parent Role** 👨‍👩‍👧
**Email**: `mohitlalwani1931.parent@gmail.com`  
**Password**: `mohit@123`

**Permissions**:
- ✅ View linked child's profile
- ✅ Monitor child's progress and activity
- ✅ View child's quiz scores and achievements
- ✅ Set parental controls and restrictions
- ✅ View study time and activity reports
- ✅ Receive progress notifications
- ❌ Cannot take quizzes directly
- ❌ Cannot play games
- ❌ Cannot manage system settings
- ❌ Cannot access admin panel

**Linked To**: Student (`mohitlalwani1931@gmail.com`)

---

### **3. Admin Role** 🔐
**Email**: `admin@learnkins.com`  
**Password**: `admin123`

**Permissions**:
- ✅ Full system access
- ✅ Create and manage quizzes
- ✅ Create and manage study materials
- ✅ Create and manage games content
- ✅ Manage shop items and pricing
- ✅ Create achievements and badges
- ✅ Create and assign professional quizzes
- ✅ Manage all users (create, edit, delete, suspend)
- ✅ View system analytics and reports
- ✅ Configure system settings
- ✅ Manage subjects and curriculum
- ✅ View audit logs
- ✅ Manage newsletters and communications

**Default Grade**: None (System-wide access)

---

## 🌐 Access Points

### Frontend Application
**URL**: `http://localhost:5173`

1. Click on **"Login"** button
2. Enter email and password from the table above
3. Select appropriate role if prompted
4. Click **"Sign In"**

### Backend API
**Base URL**: `http://localhost:5000/api`

**Authentication**:
- Send credentials to `/api/auth/login`
- Receive JWT token
- Include token in `Authorization: Bearer <token>` header for all requests

**Example Login Request**:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "mohitlalwani1931@gmail.com",
    "password": "mohit@123"
  }'
```

---

## 🎯 Auto-Seeded Content

When the backend starts, the following content is automatically created:

### Subjects (4 total)
- **Science** - Crop Production, Microorganisms, Synthetic Fibres
- **Mathematics** - Rational Numbers, Linear Equations, Quadrilaterals
- **English** - Best Christmas Present, The Tsunami, Glimpses of the Past
- **Social Science** - How When Where, Trade to Territory, Ruling Countryside

### Professional Quizzes
- Science Fundamentals – Grade 6
- Mathematics Essentials – Grade 6
- English Language – Grade 6
- Social Science – Grade 6

### Shop Items
- Predefined tokens and boosters
- Achievement rewards
- Premium content unlocks

### Achievements System
- Multiple achievement categories
- Badges and milestones
- Progress tracking

---

## 🔄 User Relationships

```
Admin (admin@learnkins.com)
  ├── Creates Content (Quizzes, Materials)
  ├── Manages Users
  └── Manages System

Parent (mohitlalwani1931.parent@gmail.com)
  └── Monitors Child's Progress
      └── Student (mohitlalwani1931@gmail.com)
          ├── Takes Quizzes
          ├── Plays Games
          ├── Earns Achievements
          └── Purchases from Shop
```

---

## 📝 Notes

1. **Password Security**: Test passwords are simple for development. Change in production.
2. **JWT Expiry**: Default expiry is `7 days` (configurable in `.env`)
3. **Session Management**: Users are automatically logged out after JWT expiry
4. **Data Persistence**: In-memory DB data resets on server restart
5. **Email Verification**: Not enforced in development mode

---

## ⚙️ Environment Configuration

### `.env` Settings
```bash
# These control user behavior
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
USE_INMEMORY_DB=true  # Use temporary in-memory database
```

---

## 🐛 Troubleshooting

### Cannot Login?
- ✅ Ensure backend is running on `http://localhost:5000`
- ✅ Check if user exists in database
- ✅ Verify password matches exactly
- ✅ Clear browser cache and try again

### JWT Token Expired?
- ✅ Log out and log in again
- ✅ Check `JWT_EXPIRE` setting in `.env`
- ✅ Verify system time is correct

### Parental Link Not Working?
- ✅ Ensure both parent and student users exist
- ✅ Check `parentId` field in student document
- ✅ Verify student is in parent's `children` array

---

## 📞 Support

For issues with user accounts, check:
- Backend logs: `backend/src/server.js`
- Database: MongoDB Atlas console
- API responses: Check network tab in browser DevTools

Last Updated: **June 13, 2026**
