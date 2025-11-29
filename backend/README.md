# Employee Leave Management System - Backend

## 🚀 Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT + bcrypt
- **Validation:** express-validator

## 📁 Project Structure
```
backend/
├── src/
│   ├── config/         # Database and other configurations
│   ├── controllers/    # Request handlers
│   ├── middleware/     # Custom middleware (auth, error handling)
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API routes
│   ├── utils/          # Utility functions
│   └── server.js       # Entry point
├── .env                # Environment variables
├── .env.example        # Environment variables template
├── .gitignore          # Git ignore rules
└── package.json        # Dependencies and scripts
```

## 🛠️ Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   - Copy `.env.example` to `.env`
   - Update the values as needed (especially MONGODB_URI and JWT_SECRET)

3. **Make sure MongoDB is running:**
   - Local: `mongod`
   - Or use MongoDB Atlas connection string

## 🚦 Running the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:5000`

## 📡 API Endpoints

### Health Check
- `GET /api/health` - Check server status

### Authentication (Coming soon)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Leave Management (Coming soon)
- `POST /api/leaves` - Create leave request
- `GET /api/leaves` - Get all leaves (filtered by role)
- `GET /api/leaves/:id` - Get single leave
- `PUT /api/leaves/:id` - Update leave request
- `DELETE /api/leaves/:id` - Delete leave request
- `PATCH /api/leaves/:id/approve` - Approve leave (manager/admin)
- `PATCH /api/leaves/:id/reject` - Reject leave (manager/admin)

## 📋 API Response Format

All API responses follow this unified format:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error message",
  "errors": [ ... ]
}
```

## 🔐 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/leave_management |
| JWT_SECRET | Secret key for JWT | - |
| JWT_EXPIRE | JWT expiration time | 7d |
| CORS_ORIGIN | Allowed CORS origin | http://localhost:5173 |
| NODE_ENV | Environment | development |

## 👥 User Roles

- **Employee:** Can create and view own leave requests
- **Manager:** Can approve/reject leave requests + employee permissions
- **Admin:** Full access to all operations
