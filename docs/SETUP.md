# LearnKins Setup Guide

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### 1. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 2. Environment Setup

Create the following environment files:

**Frontend (.env in project root):**

```
VITE_API_URL=http://localhost:5000/api
VITE_CLIENT_URL=http://localhost:5173
```

**Backend (.env in server folder):**

```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/learnkins
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173
```

### 3. Database Setup

**Option A: Local MongoDB**

```bash
# Install MongoDB locally or use Docker
docker run -d -p 27017:27017 --name mongodb mongo
```

**Option B: MongoDB Atlas (Cloud)**

- Create account at mongodb.com
- Create cluster and get connection string
- Update MONGODB_URI in server/.env

### 4. Start Development Servers

**Option A: Start both servers together**

```bash
npm run dev:full
```

**Option B: Start servers separately**

```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run dev
```

### 5. Seed Database (Optional)

```bash
npm run server:seed
```

## 📊 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Subjects

- `GET /api/subjects` - Get all subjects
- `GET /api/subjects/:slug` - Get subject by slug
- `GET /api/subjects/:slug/chapters` - Get subject chapters

### Materials

- `GET /api/materials` - Get all materials
- `GET /api/materials/:id` - Get material by ID
- `POST /api/materials` - Create new material

### Quizzes & Games

- `GET /api/quizzes` - Get all quizzes
- `GET /api/games` - Get all games
- `POST /api/quizzes/:id/submit` - Submit quiz answers

### Community

- `GET /api/community/discussions` - Get discussions
- `POST /api/community/discussions` - Create discussion

### Progress

- `GET /api/progress` - Get user progress
- `PUT /api/progress/update` - Update progress

### Flashcards

- `GET /api/flashcards` - Get all flashcards
- `POST /api/flashcards` - Create flashcard
- `POST /api/flashcards/:id/study` - Study flashcard

## 🔧 Development

### Frontend Structure

```
src/
├── components/     # Reusable components
├── pages/         # Page components
├── context/       # React context
├── utils/         # Utility functions
└── App.tsx        # Main app component
```

### Backend Structure

```
server/
├── controllers/   # Route controllers
├── models/        # MongoDB models
├── routes/        # API routes
├── middleware/    # Custom middleware
└── server.js      # Main server file
```

## 🚨 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**

   - Ensure MongoDB is running
   - Check connection string in .env
   - Verify network connectivity

2. **CORS Errors**

   - Check CORS configuration in server.js
   - Verify CLIENT_URL in .env

3. **JWT Token Issues**

   - Ensure JWT_SECRET is set
   - Check token expiration

4. **Port Already in Use**
   - Change PORT in .env
   - Kill existing processes

### Health Checks

- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- API Health: http://localhost:5000/api/health

## 📝 Notes

- All API calls include automatic token handling
- Error responses are standardized
- File uploads supported for materials
- Real-time features planned for future updates
