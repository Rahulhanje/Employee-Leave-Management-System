# Leave Management API Documentation - Employee

## Base URL
```
http://localhost:5000/api/leaves
```

**Note:** All endpoints require authentication via JWT token

---

## 📋 Employee Endpoints

### 1. Apply for Leave

**Endpoint:** `POST /api/leaves`  
**Access:** Private (Employee)  
**Description:** Submit a new leave request

#### Headers:
```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

#### Request Body:
```json
{
  "leaveType": "sick",
  "startDate": "2025-12-01",
  "endDate": "2025-12-03",
  "reason": "Medical appointment and recovery needed"
}
```

#### Field Requirements:
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| leaveType | String | Yes | Must be: 'sick', 'casual', or 'vacation' |
| startDate | Date (ISO) | Yes | Valid date, cannot be in the past |
| endDate | Date (ISO) | Yes | Valid date, must be >= startDate |
| reason | String | Yes | Min 10 chars, Max 500 chars |

#### Business Rules:
- ✅ Start date must be <= End date
- ✅ Total days automatically calculated (inclusive)
- ✅ Checks available leave balance
- ✅ Prevents overlapping with approved leaves
- ✅ Start date cannot be in the past

#### Success Response (201):
```json
{
  "success": true,
  "message": "Leave request submitted successfully",
  "data": {
    "leaveRequest": {
      "id": "673f5e8a2b1c3d4e5f6a7b8c",
      "leaveType": "sick",
      "startDate": "2025-12-01T00:00:00.000Z",
      "endDate": "2025-12-03T00:00:00.000Z",
      "totalDays": 3,
      "reason": "Medical appointment and recovery needed",
      "status": "pending",
      "createdAt": "2025-11-29T10:30:00.000Z",
      "user": {
        "id": "673f5e8a2b1c3d4e5f6a7b8c",
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
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
      "field": "reason",
      "message": "Reason must be at least 10 characters long"
    }
  ]
}
```

**Insufficient Leave Balance (400):**
```json
{
  "success": false,
  "message": "Insufficient sick leave balance. Available: 10 days, Requested: 15 days"
}
```

**Overlapping Leave (400):**
```json
{
  "success": false,
  "message": "Leave dates overlap with an existing approved leave.",
  "errors": [
    {
      "leaveType": "vacation",
      "startDate": "2025-12-02T00:00:00.000Z",
      "endDate": "2025-12-05T00:00:00.000Z",
      "totalDays": 4
    }
  ]
}
```

**Unauthorized (401):**
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

---

### 2. Get My Leave Requests

**Endpoint:** `GET /api/leaves/my-requests`  
**Access:** Private (Employee)  
**Description:** Retrieve all leave requests for the logged-in employee

#### Headers:
```
Authorization: Bearer <your_jwt_token>
```

#### Query Parameters:
| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| status | String | No | Filter by status | `pending`, `approved`, `rejected` |
| leaveType | String | No | Filter by type | `sick`, `casual`, `vacation` |
| startDate | Date | No | Filter from date | `2025-11-01` |
| endDate | Date | No | Filter to date | `2025-12-31` |
| page | Number | No | Page number | `1` (default) |
| limit | Number | No | Items per page | `10` (default) |

#### Example Request:
```
GET /api/leaves/my-requests?status=pending&page=1&limit=10
```

#### Success Response (200):
```json
{
  "success": true,
  "message": "Leave requests retrieved successfully",
  "data": {
    "leaves": [
      {
        "id": "673f5e8a2b1c3d4e5f6a7b8c",
        "leaveType": "sick",
        "startDate": "2025-12-01T00:00:00.000Z",
        "endDate": "2025-12-03T00:00:00.000Z",
        "totalDays": 3,
        "reason": "Medical appointment",
        "status": "pending",
        "managerComment": null,
        "approvedBy": null,
        "approvedAt": null,
        "createdAt": "2025-11-29T10:30:00.000Z",
        "updatedAt": "2025-11-29T10:30:00.000Z"
      },
      {
        "id": "673f5e8a2b1c3d4e5f6a7b8d",
        "leaveType": "vacation",
        "startDate": "2025-11-20T00:00:00.000Z",
        "endDate": "2025-11-22T00:00:00.000Z",
        "totalDays": 3,
        "reason": "Family vacation",
        "status": "approved",
        "managerComment": "Approved. Have a good time!",
        "approvedBy": {
          "id": "673f5e8a2b1c3d4e5f6a7b8e",
          "name": "Jane Manager",
          "email": "jane@manager.com"
        },
        "approvedAt": "2025-11-28T14:00:00.000Z",
        "createdAt": "2025-11-25T09:00:00.000Z",
        "updatedAt": "2025-11-28T14:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 15,
      "page": 1,
      "limit": 10,
      "totalPages": 2
    }
  }
}
```

#### Error Responses:

**Unauthorized (401):**
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

---

### 3. Get Leave Balance

**Endpoint:** `GET /api/leaves/balance`  
**Access:** Private (Employee)  
**Description:** Get leave balance with detailed breakdown

#### Headers:
```
Authorization: Bearer <your_jwt_token>
```

#### Success Response (200):
```json
{
  "success": true,
  "message": "Leave balance retrieved successfully",
  "data": {
    "leaveBalance": {
      "sickLeave": {
        "total": 10,
        "used": 2,
        "pending": 3,
        "available": 8
      },
      "casualLeave": {
        "total": 5,
        "used": 1,
        "pending": 0,
        "available": 4
      },
      "vacationLeave": {
        "total": 5,
        "used": 3,
        "pending": 2,
        "available": 2
      }
    },
    "summary": {
      "totalApprovedLeaves": 3,
      "totalPendingLeaves": 2,
      "totalDaysUsed": 6,
      "totalDaysPending": 5
    }
  }
}
```

#### Field Descriptions:
- **total**: Total allocated leave days
- **used**: Days already used (approved leaves)
- **pending**: Days in pending requests
- **available**: Days remaining (total - used)

#### Error Responses:

**Unauthorized (401):**
```json
{
  "success": false,
  "message": "Access denied. No token provided."
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

### 4. Cancel Leave Request

**Endpoint:** `DELETE /api/leaves/:id`  
**Access:** Private (Employee - own requests only)  
**Description:** Cancel a pending leave request

#### Headers:
```
Authorization: Bearer <your_jwt_token>
```

#### URL Parameters:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | String | Yes | Leave request ID |

#### Example Request:
```
DELETE /api/leaves/673f5e8a2b1c3d4e5f6a7b8c
```

#### Success Response (200):
```json
{
  "success": true,
  "message": "Leave request cancelled successfully",
  "data": {
    "cancelledLeave": {
      "id": "673f5e8a2b1c3d4e5f6a7b8c",
      "leaveType": "sick",
      "startDate": "2025-12-01T00:00:00.000Z",
      "endDate": "2025-12-03T00:00:00.000Z",
      "totalDays": 3
    }
  }
}
```

#### Error Responses:

**Leave Not Found (404):**
```json
{
  "success": false,
  "message": "Leave request not found"
}
```

**Forbidden (403):**
```json
{
  "success": false,
  "message": "Access denied. You can only cancel your own leave requests"
}
```

**Invalid Status (400):**
```json
{
  "success": false,
  "message": "Cannot cancel leave request with status: approved. Only pending requests can be cancelled."
}
```

**Unauthorized (401):**
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

---

## 🔄 Leave Application Flow

```
Employee                        System                          Database
   |                              |                                |
   | POST /api/leaves             |                                |
   |----------------------------->|                                |
   |                              |                                |
   |                              | Validate inputs                |
   |                              | Check date range               |
   |                              | Calculate total days           |
   |                              |                                |
   |                              | Fetch user leave balance       |
   |                              |------------------------------>|
   |                              |<------------------------------|
   |                              |                                |
   |                              | Check sufficient balance       |
   |                              | Check overlapping leaves       |
   |                              |------------------------------>|
   |                              |<------------------------------|
   |                              |                                |
   |                              | Create leave request           |
   |                              | status: "pending"              |
   |                              |------------------------------>|
   |                              |<------------------------------|
   |                              |                                |
   | { leaveRequest }             |                                |
   |<-----------------------------|                                |
   |                              |                                |
```

---

## 🧪 Testing Scenarios

### Scenario 1: Successful Leave Application
```bash
# Prerequisite: Login and get token
POST /api/auth/login
{
  "email": "employee@test.com",
  "password": "Test123"
}

# Apply for leave
POST /api/leaves
Authorization: Bearer <token>
{
  "leaveType": "sick",
  "startDate": "2025-12-01",
  "endDate": "2025-12-03",
  "reason": "Medical appointment and recovery"
}

# Expected: 201, leave request created
```

---

### Scenario 2: Insufficient Balance
```bash
# Apply for more days than available
POST /api/leaves
Authorization: Bearer <token>
{
  "leaveType": "sick",
  "startDate": "2025-12-01",
  "endDate": "2025-12-15",
  "reason": "Extended medical treatment"
}

# Expected: 400, "Insufficient sick leave balance"
```

---

### Scenario 3: Overlapping Dates
```bash
# First: Create and approve a leave (manager does this)
POST /api/leaves
{
  "leaveType": "vacation",
  "startDate": "2025-12-01",
  "endDate": "2025-12-05",
  "reason": "Holiday trip"
}

# After approval, try overlapping dates
POST /api/leaves
{
  "leaveType": "sick",
  "startDate": "2025-12-03",
  "endDate": "2025-12-07",
  "reason": "Medical checkup"
}

# Expected: 400, "Leave dates overlap with an existing approved leave"
```

---

### Scenario 4: Get My Requests with Filters
```bash
# Get only pending requests
GET /api/leaves/my-requests?status=pending
Authorization: Bearer <token>

# Expected: 200, list of pending leaves

# Get approved sick leaves
GET /api/leaves/my-requests?status=approved&leaveType=sick
Authorization: Bearer <token>

# Expected: 200, filtered list
```

---

### Scenario 5: Check Balance
```bash
GET /api/leaves/balance
Authorization: Bearer <token>

# Expected: 200, detailed balance breakdown
```

---

### Scenario 6: Cancel Pending Leave
```bash
# Get leave ID from my-requests
GET /api/leaves/my-requests?status=pending
Authorization: Bearer <token>

# Cancel the leave
DELETE /api/leaves/<leave_id>
Authorization: Bearer <token>

# Expected: 200, "Leave request cancelled successfully"
```

---

### Scenario 7: Try to Cancel Approved Leave
```bash
DELETE /api/leaves/<approved_leave_id>
Authorization: Bearer <token>

# Expected: 400, "Cannot cancel leave request with status: approved"
```

---

### Scenario 8: Validation Errors
```bash
# Missing required fields
POST /api/leaves
Authorization: Bearer <token>
{
  "leaveType": "sick",
  "startDate": "2025-12-01"
}

# Expected: 400, validation errors

# Invalid date range
POST /api/leaves
Authorization: Bearer <token>
{
  "leaveType": "sick",
  "startDate": "2025-12-05",
  "endDate": "2025-12-01",
  "reason": "Medical appointment"
}

# Expected: 400, "End date cannot be before start date"

# Reason too short
POST /api/leaves
Authorization: Bearer <token>
{
  "leaveType": "sick",
  "startDate": "2025-12-01",
  "endDate": "2025-12-03",
  "reason": "Sick"
}

# Expected: 400, "Reason must be at least 10 characters long"
```

---

## 🔐 Security Features

### Implemented:
- ✅ **JWT Authentication** required for all endpoints
- ✅ **User Isolation** - Employees can only see/manage their own leaves
- ✅ **Status Validation** - Only pending leaves can be cancelled
- ✅ **Date Validation** - Prevents past dates and invalid ranges
- ✅ **Balance Check** - Prevents exceeding available leave
- ✅ **Overlap Prevention** - Prevents double-booking approved leaves
- ✅ **Input Validation** - All inputs sanitized and validated

---

## 📊 Leave Status Lifecycle

```
PENDING ────────────┬─────────> APPROVED (by Manager)
                    │
                    └─────────> REJECTED (by Manager)
                    │
                    └─────────> CANCELLED (by Employee - only if pending)
```

**Rules:**
- Employee can only cancel **pending** leaves
- Only managers can **approve** or **reject** leaves
- Once **approved** or **rejected**, status is final
- **Approved** leaves count against balance
- **Rejected/Cancelled** leaves don't affect balance

---

## 💡 Business Logic Summary

### Apply Leave:
1. Validate all inputs
2. Parse and validate dates
3. Calculate total days (inclusive)
4. Check user's leave balance
5. Verify sufficient balance available
6. Check for overlapping approved leaves
7. Create leave request with status "pending"
8. Return created leave request

### Get My Requests:
1. Filter by userId (logged-in user)
2. Apply optional filters (status, type, dates)
3. Paginate results
4. Return leaves with pagination info

### Cancel Request:
1. Find leave by ID
2. Verify ownership (belongs to logged-in user)
3. Check status is "pending"
4. Delete the leave request
5. Return success confirmation

### Get Balance:
1. Fetch user's leave balance
2. Calculate used leaves (approved only)
3. Calculate pending leaves
4. Calculate available (total - used)
5. Return detailed breakdown

---

## 🐛 Common Errors & Solutions

### Error: "Insufficient leave balance"
**Cause:** Requesting more days than available  
**Solution:** Check balance first using `/api/leaves/balance`

### Error: "Leave dates overlap"
**Cause:** New leave conflicts with existing approved leave  
**Solution:** Choose different dates or check existing leaves

### Error: "Start date cannot be in the past"
**Cause:** Trying to apply for past dates  
**Solution:** Use current or future dates only

### Error: "Cannot cancel leave request"
**Cause:** Leave is already approved/rejected  
**Solution:** Only pending leaves can be cancelled

### Error: "Access denied"
**Cause:** Missing or invalid JWT token  
**Solution:** Login again and use valid token

---

## 📚 Next Steps

After employee APIs are working:
1. ✅ Test all endpoints
2. ✅ Verify validation rules
3. ✅ Test overlap detection
4. ⏳ Implement manager endpoints (Task 5)
5. ⏳ Add role-based authorization
6. ⏳ Build frontend UI

---

**Last Updated:** November 29, 2025  
**Version:** 1.0.0  
**Status:** ✅ Complete
