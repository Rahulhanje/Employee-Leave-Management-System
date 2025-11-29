# Authentication API Documentation

## Base URL
```
http://localhost:5000/api/auth
```

---

## 📋 Endpoints

### 1. Register User

**Endpoint:** `POST /api/auth/register`  
**Access:** Public  
**Description:** Register a new user account

#### Request Body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123",
  "role": "employee"
}
```

#### Field Requirements:
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| name | String | Yes | Min 2 chars, Max 100 chars |
| email | String | Yes | Valid email format, unique |
| password | String | Yes | Min 6 chars, must contain uppercase, lowercase, and number |
| role | String | No | 'employee' or 'manager' (default: 'employee') |

#### Success Response (201):
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "673f5e8a2b1c3d4e5f6a7b8c",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "employee",
      "leaveBalance": {
        "sickLeave": 10,
        "casualLeave": 5,
        "vacationLeave": 5
      },
      "createdAt": "2025-11-29T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Error Responses:

**Validation Error (400):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address"
    }
  ]
}
```

**Email Already Exists (400):**
```json
{
  "success": false,
  "message": "Email already registered"
}
```

---

### 2. Login User

**Endpoint:** `POST /api/auth/login`  
**Access:** Public  
**Description:** Login with email and password, returns JWT token

#### Request Body:
```json
{
  "email": "john@example.com",
  "password": "Password123"
}
```

#### Field Requirements:
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| email | String | Yes | Valid email format |
| password | String | Yes | Required |

#### Success Response (200):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "673f5e8a2b1c3d4e5f6a7b8c",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "employee",
      "leaveBalance": {
        "sickLeave": 10,
        "casualLeave": 5,
        "vacationLeave": 5
      },
      "createdAt": "2025-11-29T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Error Responses:

**Invalid Credentials (401):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

**Validation Error (400):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

---

### 3. Get Current User

**Endpoint:** `GET /api/auth/me`  
**Access:** Private (requires authentication)  
**Description:** Get current logged in user information

#### Headers:
```
Authorization: Bearer <your_jwt_token>
```

#### Success Response (200):
```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "user": {
      "id": "673f5e8a2b1c3d4e5f6a7b8c",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "employee",
      "leaveBalance": {
        "sickLeave": 10,
        "casualLeave": 5,
        "vacationLeave": 5
      },
      "createdAt": "2025-11-29T10:30:00.000Z",
      "updatedAt": "2025-11-29T10:30:00.000Z"
    }
  }
}
```

#### Error Responses:

**No Token (401):**
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

**Invalid Token (401):**
```json
{
  "success": false,
  "message": "Invalid token. Please login again."
}
```

**Token Expired (401):**
```json
{
  "success": false,
  "message": "Token expired. Please login again."
}
```

**User Not Found (404):**
```json
{
  "success": false,
  "message": "User not found"
}
```

---

### 4. Logout

**Endpoint:** `POST /api/auth/logout`  
**Access:** Private (requires authentication)  
**Description:** Logout confirmation (token removal is client-side)

#### Headers:
```
Authorization: Bearer <your_jwt_token>
```

#### Success Response (200):
```json
{
  "success": true,
  "message": "Logout successful",
  "data": {
    "message": "Please remove the token from client storage"
  }
}
```

---

## 🔐 Authentication Flow

### 1. Register/Login Flow:
```
Client                          Server
  |                               |
  |  POST /api/auth/register      |
  |  or POST /api/auth/login      |
  |------------------------------>|
  |                               |
  |                               | Validate credentials
  |                               | Generate JWT token
  |                               |
  |  { user, token }              |
  |<------------------------------|
  |                               |
  | Store token in                |
  | localStorage/sessionStorage   |
```

### 2. Authenticated Request Flow:
```
Client                          Server
  |                               |
  |  GET /api/auth/me             |
  |  Authorization: Bearer token  |
  |------------------------------>|
  |                               |
  |                               | Verify JWT token
  |                               | Attach user to req.user
  |                               | Fetch user data
  |                               |
  |  { user data }                |
  |<------------------------------|
```

---

## 🧪 Testing with Postman/Thunder Client

### Setup:

1. **Create a new collection:** "Employee Leave Management - Auth"

2. **Set collection variables:**
   - `baseUrl`: `http://localhost:5000`
   - `token`: (will be set after login)

### Test Sequence:

#### Test 1: Register User
```
POST {{baseUrl}}/api/auth/register
Content-Type: application/json

{
  "name": "Test Employee",
  "email": "employee@test.com",
  "password": "Test123",
  "role": "employee"
}
```

**Expected:** 201 status, user object + token

**Post-request script (save token):**
```javascript
if (pm.response.code === 201) {
  const response = pm.response.json();
  pm.collectionVariables.set("token", response.data.token);
}
```

---

#### Test 2: Register Manager
```
POST {{baseUrl}}/api/auth/register
Content-Type: application/json

{
  "name": "Test Manager",
  "email": "manager@test.com",
  "password": "Manager123",
  "role": "manager"
}
```

**Expected:** 201 status, manager user + token

---

#### Test 3: Register with Validation Error
```
POST {{baseUrl}}/api/auth/register
Content-Type: application/json

{
  "name": "A",
  "email": "invalid-email",
  "password": "123"
}
```

**Expected:** 400 status with validation errors

---

#### Test 4: Login with Valid Credentials
```
POST {{baseUrl}}/api/auth/login
Content-Type: application/json

{
  "email": "employee@test.com",
  "password": "Test123"
}
```

**Expected:** 200 status, user + token

---

#### Test 5: Login with Invalid Credentials
```
POST {{baseUrl}}/api/auth/login
Content-Type: application/json

{
  "email": "employee@test.com",
  "password": "wrongpassword"
}
```

**Expected:** 401 status, "Invalid email or password"

---

#### Test 6: Get Current User (Protected Route)
```
GET {{baseUrl}}/api/auth/me
Authorization: Bearer {{token}}
```

**Expected:** 200 status, user data

---

#### Test 7: Get Current User Without Token
```
GET {{baseUrl}}/api/auth/me
```

**Expected:** 401 status, "Access denied. No token provided."

---

#### Test 8: Logout
```
POST {{baseUrl}}/api/auth/logout
Authorization: Bearer {{token}}
```

**Expected:** 200 status, logout confirmation

---

## 🔑 JWT Token Details

### Token Structure:
```
Header.Payload.Signature
```

### Payload Contains:
```json
{
  "id": "673f5e8a2b1c3d4e5f6a7b8c",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "employee",
  "iat": 1701234567,
  "exp": 1701838367
}
```

### Token Expiration:
- Default: 7 days (configurable via `JWT_EXPIRE` in .env)
- After expiration, user must login again

---

## 🛡️ Security Features

### Implemented:
- ✅ Password hashing with bcrypt (10 salt rounds)
- ✅ JWT token-based authentication
- ✅ Password excluded from API responses
- ✅ Input validation with express-validator
- ✅ Email uniqueness check
- ✅ Token expiration
- ✅ Protected routes with authMiddleware
- ✅ Role-based access control ready

### Best Practices:
- Store JWT token securely (httpOnly cookies or secure storage)
- Use HTTPS in production
- Implement rate limiting (optional)
- Add refresh token mechanism (optional enhancement)
- Validate token on every protected request

---

## 📝 Role-Based Access

### Middleware Usage:
```javascript
import authMiddleware from './middleware/authMiddleware.js';
import roleMiddleware from './middleware/roleMiddleware.js';

// Only authenticated users
router.get('/protected', authMiddleware, handler);

// Only managers
router.get('/manager-only', authMiddleware, roleMiddleware('manager'), handler);

// Managers and admins (when implemented)
router.get('/admin-area', authMiddleware, roleMiddleware('manager', 'admin'), handler);
```

---

## 🐛 Common Errors & Solutions

### Error: "Email already registered"
**Cause:** Email exists in database  
**Solution:** Use a different email or login instead

### Error: "Access denied. No token provided"
**Cause:** Authorization header missing  
**Solution:** Add `Authorization: Bearer <token>` header

### Error: "Invalid token"
**Cause:** Token is malformed or tampered  
**Solution:** Login again to get a new token

### Error: "Token expired"
**Cause:** Token validity period exceeded  
**Solution:** Login again to get a fresh token

### Error: "Validation failed"
**Cause:** Request body doesn't meet validation rules  
**Solution:** Check error details and fix input data

---

## 📚 Next Steps

After authentication is working:
1. ✅ Test all endpoints with Postman
2. ✅ Verify token generation and validation
3. ⏳ Implement leave management routes (Task 4)
4. ⏳ Add role-based authorization to leave routes
5. ⏳ Build frontend authentication UI

---

**Last Updated:** November 29, 2025  
**Version:** 1.0.0  
**Status:** ✅ Complete
