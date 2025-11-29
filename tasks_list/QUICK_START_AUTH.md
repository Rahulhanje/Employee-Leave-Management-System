# 🚀 Authentication System - Quick Start Guide

## ✅ What's Ready

Complete JWT-based authentication system with:
- User Registration & Login
- JWT Token Generation & Verification
- Protected Routes
- Role-Based Access Control
- Input Validation
- Comprehensive Error Handling

---

## 📡 API Endpoints

### Base URL: `http://localhost:5000/api/auth`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/register` | Public | Register new user |
| POST | `/login` | Public | Login and get token |
| GET | `/me` | Private | Get current user info |
| POST | `/logout` | Private | Logout confirmation |

---

## 🧪 Quick Test (Copy & Paste)

### 1. Start Server
```powershell
cd D:\tap_academy_assignment\backend
npm run dev
```

### 2. Test with PowerShell

**Register:**
```powershell
$body = @{
    name = "Test Employee"
    email = "employee@test.com"
    password = "Test123"
    role = "employee"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method POST -Body $body -ContentType "application/json"
```

**Login:**
```powershell
$body = @{
    email = "employee@test.com"
    password = "Test123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -Body $body -ContentType "application/json"
$token = $response.data.token
```

**Get Me:**
```powershell
$headers = @{
    Authorization = "Bearer $token"
}

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/me" -Method GET -Headers $headers
```

---

## 📥 Import Postman Collection

1. Open Postman
2. Click **Import**
3. Select: `backend/postman_collection.json`
4. Ready to test!

---

## 📚 Documentation

- **Full API Docs:** `backend/AUTH_API_DOCUMENTATION.md`
- **Task Summary:** `TASK_3_SUMMARY.md`
- **Postman Collection:** `backend/postman_collection.json`

---

## 🔐 Sample Users

Create these for testing:

```json
// Employee
{
  "name": "John Employee",
  "email": "john@employee.com",
  "password": "Employee123",
  "role": "employee"
}

// Manager
{
  "name": "Jane Manager",
  "email": "jane@manager.com",
  "password": "Manager123",
  "role": "manager"
}
```

---

## ✅ Verification Checklist

- [ ] MongoDB is running
- [ ] Server starts without errors (`npm run dev`)
- [ ] Health check works: `http://localhost:5000/api/health`
- [ ] Can register new user
- [ ] Can login and receive token
- [ ] Can access `/me` with valid token
- [ ] Receives 401 without token
- [ ] Validation errors work correctly

---

## 🐛 Troubleshooting

**MongoDB Connection Error?**
```
Check if MongoDB is running: net start MongoDB
Or update MONGODB_URI in .env
```

**Token not working?**
```
Make sure Authorization header is: Bearer <token>
Check JWT_SECRET in .env is set
```

**Validation errors?**
```
Password must have: uppercase, lowercase, number
Email must be valid format
Name must be at least 2 characters
```

---

## 🎯 Next: Task 4

Leave Management APIs:
- Create leave request
- View leaves
- Approve/Reject (managers)
- Status filtering
- Full CRUD operations

---

**Status:** ✅ Complete  
**Branch:** `feature/auth`  
**Ready for:** Task 4
