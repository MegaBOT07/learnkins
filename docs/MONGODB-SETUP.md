# MongoDB Setup Guide for LearnKins

## 🚀 Quick Setup Options

### Option 1: MongoDB Atlas (Recommended - Free Cloud Database)

1. **Go to MongoDB Atlas**: https://www.mongodb.com/atlas
2. **Create Free Account**: Sign up for free
3. **Create Cluster**:
   - Choose "FREE" tier
   - Select your preferred cloud provider
   - Choose region close to you
4. **Get Connection String**:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
5. **Update Environment**:
   - Replace `<password>` with your database password
   - Add this to `server/.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/learnkins
   ```

### Option 2: Local MongoDB Installation

1. **Download MongoDB Community Server**: https://www.mongodb.com/try/download/community
2. **Install with default settings**
3. **Start MongoDB Service**:
   ```powershell
   # Run as Administrator
   net start MongoDB
   ```

### Option 3: Docker (if Docker Desktop is installed)

```bash
docker run -d -p 27017:27017 --name mongodb mongo
```

## 🔧 Current Status

- ✅ **Frontend**: Running on http://localhost:5173
- ✅ **Backend**: Running on http://localhost:5000
- ✅ **API Health**: Working
- ✅ **TypeScript Errors**: Fixed
- ✅ **JWT Configuration**: Fixed
- ✅ **Demo Users**: Ready to be created
- ⚠️ **MongoDB**: Needs to be started

## 🎯 Next Steps

1. **Choose one of the MongoDB setup options above**
2. **Start the servers**: `npm run dev:full`
3. **Seed the database**: `npm run server:seed`
4. **Test login**: Use demo credentials

## 📋 Demo Login Credentials

Once MongoDB is running and seeded:

- **Student**: `student@learnkins.com` / `student123`
- **Teacher**: `teacher@learnkins.com` / `teacher123`
- **Parent**: `parent@learnkins.com` / `parent123`
- **Admin**: `admin@learnkins.com` / `admin123`

## 🆘 Need Help?

If you're having trouble with MongoDB setup, you can:

1. Use MongoDB Atlas (easiest option)
2. Ask for help with local installation
3. Use Docker if available
