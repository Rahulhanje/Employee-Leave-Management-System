# Employee Leave Management System

A full-stack Employee Leave Management System built with **Node.js, Express, MongoDB, React, Redux Toolkit, and Tailwind CSS**.

## 🎯 Features

### Backend
- JWT-based authentication with bcrypt password hashing
- Role-based access control (Employee, Manager, Admin)
- RESTful API with unified response format
- MongoDB database with Mongoose ODM
- Input validation with express-validator
- Comprehensive error handling

### Frontend (Coming Soon)
- React with Vite
- Redux Toolkit for state management
- Tailwind CSS for styling
- Protected routes
- Role-based UI components

## 📁 Project Structure

```
tap_academy_assignment/
├── backend/           # Node.js + Express + MongoDB
└── frontend/          # React + Redux + Tailwind (Coming soon)
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update MongoDB URI and JWT secret

4. Start the server:
   ```bash
   npm run dev
   ```

5. Server will run on: `http://localhost:5000`

See [backend/README.md](backend/README.md) for detailed backend documentation.

## 📝 Development Progress

- [x] Backend project initialization
- [ ] Database models and connection
- [ ] Authentication system
- [ ] Leave management APIs
- [ ] Authorization and error handling
- [ ] Frontend initialization
- [ ] Redux store setup
- [ ] Authentication UI
- [ ] Employee dashboard
- [ ] Manager/Admin dashboard

## 🔐 User Roles

- **Employee:** Create and manage own leave requests
- **Manager:** Approve/reject team leave requests
- **Admin:** Full system access and management

## 📄 License

ISC
