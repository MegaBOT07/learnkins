# LearnKins Backend API

Express.js backend for the LearnKins Educational Platform.

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Nodemailer** - Email service
- **Cloudinary** - File storage

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file from `.env.example` and configure variables

3. Start MongoDB server

4. Run the server:
```bash
npm run dev
```

## Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Request handlers
├── models/         # Mongoose schemas
├── routes/         # API routes
├── middleware/     # Express middleware
├── services/       # Business logic
├── utils/          # Utility functions
├── validators/     # Input validation
└── seeds/          # Database seeding
```

## API Documentation

See `/docs` folder for detailed API documentation.
