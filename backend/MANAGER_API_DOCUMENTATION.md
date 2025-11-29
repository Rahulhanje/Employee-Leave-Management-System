# Manager Leave Approval API Documentation

## Base URL
```
http://localhost:5000/api/leaves
```

**Note:** All manager endpoints require authentication AND manager role

---

## 🔐 Authorization Requirements

All manager endpoints require:
1. **Authentication:** Valid JWT token in Authorization header
2. **Authorization:** User role must be "manager"

### Required Headers:
```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

---

## 📋 Manager Endpoints

### 1. Get Pending Leave Requests

**Endpoint:** `GET /api/leaves/pending`  
**Access:** Private (Manager only)  
**Description:** Retrieve all pending leave requests across the organization

#### Request Example:
```
GET /api/leaves/pending
Authorization: Bearer <manager_jwt_token>
```

#### Success Response (200):
```json
{
  "success": true,
  "message": "Pending leave requests retrieved successfully",
  "data": {
    "leaves": [
      {
        "_id": "673f5e8a2b1c3d4e5f6a7b8c",
        "leaveType": "sick",
        "startDate": "2025-12-01T00:00:00.000Z",
        "endDate": "2025-12-03T00:00:00.000Z",
        "totalDays": 3,
        "reason": "Medical appointment and recovery needed",
        "status": "pending",
        "user": {
          "_id": "673f5e8a2b1c3d4e5f6a7b8d",
          "name": "John Doe",
          "email": "john@example.com"
        },
        "managerComment": null,
        "approvedBy": null,
        "approvedAt": null,
        "createdAt": "2025-11-29T10:30:00.000Z",
        "updatedAt": "2025-11-29T10:30:00.000Z"
      }
    ],
    "total": 5
  }
}
```

#### Features:
- ✅ Returns all pending leave requests
- ✅ Includes employee details (name, email)
- ✅ Sorted by creation date (newest first)
- ✅ Shows total count of pending requests

#### Error Responses:

**Unauthorized (401):**
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

**Forbidden (403):**
```json
{
  "success": false,
  "message": "Access denied. This route requires one of the following roles: manager"
}
```

---

### 2. Get All Leave Requests

**Endpoint:** `GET /api/leaves/all`  
**Access:** Private (Manager only)  
**Description:** Retrieve all leave requests with advanced filtering and pagination

#### Query Parameters:
| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| status | String | No | Filter by status | `pending`, `approved`, `rejected` |
| leaveType | String | No | Filter by type | `sick`, `casual`, `vacation` |
| employee | String | No | Filter by employee ID | `673f5e8a2b1c3d4e5f6a7b8c` |
| startDate | Date | No | Filter from date | `2025-11-01` |
| endDate | Date | No | Filter to date | `2025-12-31` |
| page | Number | No | Page number | `1` (default) |
| limit | Number | No | Items per page | `10` (default) |

#### Request Examples:

**Get all approved leaves:**
```
GET /api/leaves/all?status=approved
Authorization: Bearer <manager_jwt_token>
```

**Get sick leaves for specific employee:**
```
GET /api/leaves/all?leaveType=sick&employee=673f5e8a2b1c3d4e5f6a7b8c
Authorization: Bearer <manager_jwt_token>
```

**Get leaves in date range:**
```
GET /api/leaves/all?startDate=2025-11-01&endDate=2025-11-30
Authorization: Bearer <manager_jwt_token>
```

**Get pending vacation leaves with pagination:**
```
GET /api/leaves/all?status=pending&leaveType=vacation&page=1&limit=20
Authorization: Bearer <manager_jwt_token>
```

#### Success Response (200):
```json
{
  "success": true,
  "message": "Leave requests retrieved successfully",
  "data": {
    "leaves": [
      {
        "_id": "673f5e8a2b1c3d4e5f6a7b8c",
        "leaveType": "sick",
        "startDate": "2025-12-01T00:00:00.000Z",
        "endDate": "2025-12-03T00:00:00.000Z",
        "totalDays": 3,
        "reason": "Medical appointment",
        "status": "approved",
        "user": {
          "_id": "673f5e8a2b1c3d4e5f6a7b8d",
          "name": "John Doe",
          "email": "john@example.com"
        },
        "managerComment": "Approved for medical reasons",
        "approvedBy": {
          "_id": "673f5e8a2b1c3d4e5f6a7b8e",
          "name": "Jane Manager",
          "email": "jane@manager.com"
        },
        "approvedAt": "2025-11-28T14:00:00.000Z",
        "createdAt": "2025-11-25T09:00:00.000Z",
        "updatedAt": "2025-11-28T14:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 50,
      "page": 1,
      "limit": 10,
      "totalPages": 5
    }
  }
}
```

#### Features:
- ✅ Advanced filtering by status, type, employee, dates
- ✅ Pagination support
- ✅ Includes employee and approver details
- ✅ Sorted by creation date (newest first)

#### Error Responses:

**Unauthorized (401):**
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

**Forbidden (403):**
```json
{
  "success": false,
  "message": "Access denied. This route requires one of the following roles: manager"
}
```

---

### 3. Approve Leave Request

**Endpoint:** `PUT /api/leaves/:id/approve`  
**Access:** Private (Manager only)  
**Description:** Approve a pending leave request and automatically deduct balance from employee

#### URL Parameters:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | String | Yes | Leave request ID |

#### Request Body (Optional):
```json
{
  "managerComment": "Approved. Hope you feel better soon!"
}
```

#### Request Body Schema:
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| managerComment | String | No | Min 5 chars, Max 500 chars |

#### Request Example:
```
PUT /api/leaves/673f5e8a2b1c3d4e5f6a7b8c/approve
Authorization: Bearer <manager_jwt_token>
Content-Type: application/json

{
  "managerComment": "Approved for medical treatment"
}
```

#### Business Logic:
1. ✅ Validate leave request exists
2. ✅ Check status is "pending"
3. ✅ Fetch employee details
4. ✅ **Verify sufficient leave balance**
5. ✅ **Deduct leave days from employee balance**
6. ✅ Update status to "approved"
7. ✅ Record approver ID and timestamp
8. ✅ Save manager comment (optional)
9. ✅ Return updated leave request

#### Balance Deduction Logic:
```javascript
// Example: Approve 3 days of sick leave
employee.leaveBalance.sickLeave -= 3;
// If sickLeave was 10, it becomes 7
```

#### Success Response (200):
```json
{
  "success": true,
  "message": "Leave request approved successfully",
  "data": {
    "leaveRequest": {
      "_id": "673f5e8a2b1c3d4e5f6a7b8c",
      "leaveType": "sick",
      "startDate": "2025-12-01T00:00:00.000Z",
      "endDate": "2025-12-03T00:00:00.000Z",
      "totalDays": 3,
      "reason": "Medical appointment and recovery",
      "status": "approved",
      "user": {
        "_id": "673f5e8a2b1c3d4e5f6a7b8d",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "managerComment": "Approved for medical treatment",
      "approvedBy": {
        "_id": "673f5e8a2b1c3d4e5f6a7b8e",
        "name": "Jane Manager",
        "email": "jane@manager.com"
      },
      "approvedAt": "2025-11-29T15:00:00.000Z",
      "createdAt": "2025-11-29T10:30:00.000Z",
      "updatedAt": "2025-11-29T15:00:00.000Z"
    },
    "updatedBalance": {
      "sickLeave": 7
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

**Invalid Status (400):**
```json
{
  "success": false,
  "message": "Cannot approve leave request with status: approved. Only pending requests can be approved."
}
```

**Insufficient Balance (400):**
```json
{
  "success": false,
  "message": "Cannot approve leave. Insufficient sick leave balance. Available: 2 days, Requested: 3 days"
}
```

**Employee Not Found (404):**
```json
{
  "success": false,
  "message": "Employee not found"
}
```

**Validation Error (400):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "managerComment",
      "message": "Manager comment must be between 5 and 500 characters if provided"
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

**Forbidden (403):**
```json
{
  "success": false,
  "message": "Access denied. This route requires one of the following roles: manager"
}
```

---

### 4. Reject Leave Request

**Endpoint:** `PUT /api/leaves/:id/reject`  
**Access:** Private (Manager only)  
**Description:** Reject a pending leave request with optional comment

#### URL Parameters:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | String | Yes | Leave request ID |

#### Request Body (Optional):
```json
{
  "managerComment": "Cannot approve due to critical project deadlines"
}
```

#### Request Body Schema:
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| managerComment | String | No | Min 5 chars, Max 500 chars |

**Note:** If no comment is provided, default message is used: "Leave request rejected by manager"

#### Request Example:
```
PUT /api/leaves/673f5e8a2b1c3d4e5f6a7b8c/reject
Authorization: Bearer <manager_jwt_token>
Content-Type: application/json

{
  "managerComment": "Cannot approve due to team capacity constraints"
}
```

#### Business Logic:
1. ✅ Validate leave request exists
2. ✅ Check status is "pending"
3. ✅ Update status to "rejected"
4. ✅ Record approver ID and timestamp
5. ✅ Save manager comment (optional or default)
6. ✅ **No balance deduction** (rejected leaves don't affect balance)
7. ✅ Return updated leave request

#### Success Response (200):
```json
{
  "success": true,
  "message": "Leave request rejected successfully",
  "data": {
    "leaveRequest": {
      "_id": "673f5e8a2b1c3d4e5f6a7b8c",
      "leaveType": "vacation",
      "startDate": "2025-12-15T00:00:00.000Z",
      "endDate": "2025-12-20T00:00:00.000Z",
      "totalDays": 6,
      "reason": "Family vacation",
      "status": "rejected",
      "user": {
        "_id": "673f5e8a2b1c3d4e5f6a7b8d",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "managerComment": "Cannot approve due to team capacity constraints",
      "approvedBy": {
        "_id": "673f5e8a2b1c3d4e5f6a7b8e",
        "name": "Jane Manager",
        "email": "jane@manager.com"
      },
      "approvedAt": "2025-11-29T15:00:00.000Z",
      "createdAt": "2025-11-29T10:30:00.000Z",
      "updatedAt": "2025-11-29T15:00:00.000Z"
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

**Invalid Status (400):**
```json
{
  "success": false,
  "message": "Cannot reject leave request with status: rejected. Only pending requests can be rejected."
}
```

**Validation Error (400):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "managerComment",
      "message": "Manager comment must be between 5 and 500 characters if provided"
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

**Forbidden (403):**
```json
{
  "success": false,
  "message": "Access denied. This route requires one of the following roles: manager"
}
```

---

## 🔄 Manager Approval Workflow

```
Employee                      Manager                         System
   |                             |                                |
   | Apply Leave                 |                                |
   |---------------------------->|                                |
   |                             |                                |
   |                             | GET /pending                   |
   |                             |------------------------------->|
   |                             |<-------------------------------|
   |                             | View pending requests          |
   |                             |                                |
   |                             | PUT /:id/approve               |
   |                             |------------------------------->|
   |                             |                                |
   |                             |          Check balance         |
   |                             |          Deduct balance        |
   |                             |          Update status         |
   |                             |                                |
   |                             |<-------------------------------|
   |                             | Approval confirmed             |
   |                             |                                |
   | Email notification          |                                |
   |<-----------------------------------------------------------|
   |                             |                                |
```

---

## 🧪 Testing Scenarios

### Scenario 1: Manager Views Pending Requests

```bash
# Prerequisite: Login as manager
POST /api/auth/login
{
  "email": "manager@test.com",
  "password": "Manager123"
}

# Get all pending requests
GET /api/leaves/pending
Authorization: Bearer <manager_token>

# Expected: 200, list of pending leaves
```

---

### Scenario 2: Manager Approves Leave

```bash
# Step 1: Get pending leaves
GET /api/leaves/pending
Authorization: Bearer <manager_token>

# Step 2: Approve a specific leave
PUT /api/leaves/673f5e8a2b1c3d4e5f6a7b8c/approve
Authorization: Bearer <manager_token>
{
  "managerComment": "Approved for medical reasons"
}

# Expected: 200, leave approved, balance deducted
```

---

### Scenario 3: Manager Rejects Leave

```bash
# Reject leave with comment
PUT /api/leaves/673f5e8a2b1c3d4e5f6a7b8c/reject
Authorization: Bearer <manager_token>
{
  "managerComment": "Cannot approve due to project deadlines"
}

# Expected: 200, leave rejected, no balance change
```

---

### Scenario 4: Insufficient Balance

```bash
# Employee has only 2 sick days
# Manager tries to approve 5 days

PUT /api/leaves/673f5e8a2b1c3d4e5f6a7b8c/approve
Authorization: Bearer <manager_token>

# Expected: 400, "Insufficient sick leave balance. Available: 2 days, Requested: 5 days"
```

---

### Scenario 5: Already Processed Leave

```bash
# Try to approve already approved leave
PUT /api/leaves/673f5e8a2b1c3d4e5f6a7b8c/approve
Authorization: Bearer <manager_token>

# Expected: 400, "Cannot approve leave request with status: approved"
```

---

### Scenario 6: Filter Leaves by Employee

```bash
# Get all leaves for specific employee
GET /api/leaves/all?employee=673f5e8a2b1c3d4e5f6a7b8d
Authorization: Bearer <manager_token>

# Expected: 200, filtered list
```

---

### Scenario 7: Employee Access Denied

```bash
# Employee tries to access manager endpoint
GET /api/leaves/pending
Authorization: Bearer <employee_token>

# Expected: 403, "Access denied. This route requires one of the following roles: manager"
```

---

### Scenario 8: Advanced Filtering

```bash
# Get approved sick leaves in November
GET /api/leaves/all?status=approved&leaveType=sick&startDate=2025-11-01&endDate=2025-11-30
Authorization: Bearer <manager_token>

# Expected: 200, filtered results with pagination
```

---

## 💡 Business Rules Summary

### Approval Rules:
1. ✅ Only **pending** leaves can be approved
2. ✅ Employee must have **sufficient balance**
3. ✅ Balance is **immediately deducted** upon approval
4. ✅ Once approved, status is **final** (cannot be changed)
5. ✅ Approver ID and timestamp are recorded

### Rejection Rules:
1. ✅ Only **pending** leaves can be rejected
2. ✅ **No balance impact** for rejected leaves
3. ✅ Manager comment is recommended but optional
4. ✅ Once rejected, status is **final** (cannot be changed)
5. ✅ Approver ID and timestamp are recorded

### Balance Deduction:
```javascript
// Sick leave example
employee.leaveBalance.sickLeave -= totalDays;

// Casual leave example
employee.leaveBalance.casualLeave -= totalDays;

// Vacation leave example
employee.leaveBalance.vacationLeave -= totalDays;
```

### Status Lifecycle:
```
PENDING ──── Manager Approves ────> APPROVED (balance deducted)
         │
         └── Manager Rejects ─────> REJECTED (no balance change)
```

**Rules:**
- Only managers can approve/reject leaves
- Only pending leaves can be processed
- Once approved or rejected, status is final
- Approved leaves automatically deduct balance
- Rejected leaves don't affect balance

---

## 🔐 Security Features

### Implemented:
- ✅ **JWT Authentication** - Valid token required
- ✅ **Role-Based Authorization** - Manager role required
- ✅ **Status Validation** - Only pending leaves can be processed
- ✅ **Balance Protection** - Prevents approving leaves with insufficient balance
- ✅ **Audit Trail** - Records approver, timestamp, and comments
- ✅ **Input Validation** - All inputs sanitized and validated
- ✅ **Idempotency** - Cannot re-approve/re-reject leaves

---

## 📊 Manager Dashboard Data

### Useful Queries for Dashboard:

**Pending Requests Count:**
```
GET /api/leaves/pending
→ Returns total: 5
```

**Approved This Month:**
```
GET /api/leaves/all?status=approved&startDate=2025-11-01&endDate=2025-11-30
→ Returns paginated list with total count
```

**Leaves by Type:**
```
GET /api/leaves/all?leaveType=sick
GET /api/leaves/all?leaveType=casual
GET /api/leaves/all?leaveType=vacation
```

**Employee Leave History:**
```
GET /api/leaves/all?employee=<userId>
→ Returns all leaves for specific employee
```

---

## 🐛 Common Errors & Solutions

### Error: "Access denied. This route requires manager role"
**Cause:** User is not a manager  
**Solution:** Login with manager credentials

### Error: "Cannot approve leave request with status: approved"
**Cause:** Leave is already processed  
**Solution:** Check leave status before approval

### Error: "Insufficient leave balance"
**Cause:** Employee doesn't have enough days  
**Solution:** Reject the leave or ask employee to modify dates

### Error: "Leave request not found"
**Cause:** Invalid leave ID  
**Solution:** Verify the leave ID from pending list

---

## 📚 Integration with Employee APIs

### Employee Flow:
1. Employee applies for leave → `POST /api/leaves`
2. Leave created with status "pending"
3. Employee can view their requests → `GET /api/leaves/my-requests?status=pending`
4. Employee can cancel if still pending → `DELETE /api/leaves/:id`

### Manager Flow:
1. Manager views pending requests → `GET /api/leaves/pending`
2. Manager reviews details → `GET /api/leaves/all?employee=<userId>`
3. Manager approves → `PUT /api/leaves/:id/approve`
4. Manager rejects → `PUT /api/leaves/:id/reject`

### After Approval/Rejection:
- Employee sees updated status → `GET /api/leaves/my-requests`
- Employee sees updated balance → `GET /api/leaves/balance`
- Employee receives notification (if implemented)

---

**Last Updated:** November 29, 2025  
**Version:** 1.0.0  
**Status:** ✅ Complete
