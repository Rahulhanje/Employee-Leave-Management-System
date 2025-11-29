# Database Models Documentation

## Overview
This document describes the Mongoose models used in the Employee Leave Management System.

---

## 📋 User Model (`user.model.js`)

### Purpose
Handles user authentication and authorization for employees and managers.

### Schema Fields

| Field | Type | Required | Default | Validation |
|-------|------|----------|---------|------------|
| `name` | String | Yes | - | 2-100 characters |
| `email` | String | Yes | - | Valid email format, unique, lowercase |
| `password` | String | Yes | - | Min 6 characters, hashed with bcrypt (salt rounds: 10) |
| `role` | String (enum) | No | 'employee' | ['employee', 'manager'] |
| `leaveBalance.sickLeave` | Number | No | 10 | Min 0 |
| `leaveBalance.casualLeave` | Number | No | 5 | Min 0 |
| `leaveBalance.vacationLeave` | Number | No | 5 | Min 0 |
| `createdAt` | Date | Auto | - | Timestamp |
| `updatedAt` | Date | Auto | - | Timestamp |

### Indexes
- `email`: Unique index for fast lookup and ensuring uniqueness

### Security Features
- ✅ Password is **NOT** returned in queries by default (`select: false`)
- ✅ Password is automatically hashed before saving using bcrypt
- ✅ JWT token generation with user payload
- ✅ Secure password comparison method

### Instance Methods

#### `comparePassword(candidatePassword)`
Compares a plain text password with the hashed password.

**Parameters:**
- `candidatePassword` (String): The password to compare

**Returns:** Promise<Boolean> - True if password matches

**Example:**
```javascript
const user = await User.findOne({ email: 'user@example.com' }).select('+password');
const isMatch = await user.comparePassword('password123');
```

#### `generateJWT()`
Generates a JWT token containing user information.

**Returns:** String - JWT token

**Payload includes:**
- `id`: User ID
- `name`: User name
- `email`: User email
- `role`: User role (employee/manager)

**Example:**
```javascript
const user = await User.findById(userId);
const token = user.generateJWT();
```

#### `toJSON()`
Automatically removes sensitive data (password) when converting to JSON.

**Example:**
```javascript
const user = await User.findById(userId);
res.json({ user }); // Password automatically excluded
```

### Pre-save Middleware
- Automatically hashes password if modified
- Uses bcrypt with 10 salt rounds
- Only runs if password field is modified

### Usage Examples

#### Create a new user:
```javascript
import User from './models/user.model.js';

const user = await User.create({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password123',
  role: 'employee'
});
// Password is automatically hashed
```

#### Login validation:
```javascript
const user = await User.findOne({ email: 'john@example.com' }).select('+password');
if (!user) {
  throw new Error('User not found');
}

const isValid = await user.comparePassword('password123');
if (!isValid) {
  throw new Error('Invalid password');
}

const token = user.generateJWT();
```

---

## 📝 LeaveRequest Model (`leaveRequest.model.js`)

### Purpose
Manages employee leave requests with approval workflow.

### Schema Fields

| Field | Type | Required | Default | Validation |
|-------|------|----------|---------|------------|
| `userId` | ObjectId (ref: User) | Yes | - | Valid User ID |
| `leaveType` | String (enum) | Yes | - | ['sick', 'casual', 'vacation'] |
| `startDate` | Date | Yes | - | Must be <= endDate |
| `endDate` | Date | Yes | - | Must be >= startDate |
| `totalDays` | Number | Yes | Auto-calculated | Min 1 |
| `reason` | String | Yes | - | 10-500 characters |
| `status` | String (enum) | No | 'pending' | ['pending', 'approved', 'rejected'] |
| `managerComment` | String | No | - | Max 500 characters |
| `approvedBy` | ObjectId (ref: User) | No | - | Valid User ID |
| `approvedAt` | Date | No | - | Timestamp of approval |
| `createdAt` | Date | Auto | - | Timestamp |
| `updatedAt` | Date | Auto | - | Timestamp |

### Indexes
- `userId`: Index for filtering leaves by user
- `status`: Index for filtering by approval status
- `leaveType`: Index for filtering by leave type
- `{ userId, status }`: Compound index for user's leaves by status
- `{ status, createdAt }`: Compound index for recent pending leaves
- `{ leaveType, startDate }`: Compound index for leaves by type and date

### Virtual Fields

#### `user`
Populates user information from the `userId` reference.

**Example:**
```javascript
const leave = await LeaveRequest.findById(leaveId).populate('user');
console.log(leave.user.name); // Access user name
```

#### `formattedDates`
Returns human-readable date strings.

**Returns:**
```javascript
{
  startDate: 'Nov 29, 2025',
  endDate: 'Dec 1, 2025',
  duration: '3 days'
}
```

**Example:**
```javascript
const leave = await LeaveRequest.findById(leaveId);
console.log(leave.formattedDates.duration); // "3 days"
```

#### `isActive`
Checks if the leave is currently active (approved and within date range).

**Returns:** Boolean

**Example:**
```javascript
const leave = await LeaveRequest.findById(leaveId);
if (leave.isActive) {
  console.log('Employee is currently on leave');
}
```

### Instance Methods

#### `calculateTotalDays()`
Calculates the number of days between start and end date (inclusive).

**Returns:** Number - Total days

**Example:**
```javascript
const leave = new LeaveRequest({
  startDate: new Date('2025-11-29'),
  endDate: new Date('2025-12-01')
});
const days = leave.calculateTotalDays(); // Returns 3
```

#### `approve(managerId, comment)`
Approves the leave request.

**Parameters:**
- `managerId` (ObjectId): ID of the approving manager
- `comment` (String, optional): Manager's comment

**Returns:** Promise<LeaveRequest>

**Example:**
```javascript
await leave.approve(managerId, 'Approved for medical reasons');
```

#### `reject(managerId, comment)`
Rejects the leave request.

**Parameters:**
- `managerId` (ObjectId): ID of the rejecting manager
- `comment` (String, **required**): Manager's comment explaining rejection

**Returns:** Promise<LeaveRequest>

**Example:**
```javascript
await leave.reject(managerId, 'Insufficient leave balance');
```

### Static Methods

#### `getPendingLeaves()`
Retrieves all pending leave requests with user information.

**Returns:** Promise<Array<LeaveRequest>>

**Example:**
```javascript
const pendingLeaves = await LeaveRequest.getPendingLeaves();
```

#### `getUserLeaves(userId, filter)`
Retrieves leave history for a specific user.

**Parameters:**
- `userId` (ObjectId): User ID
- `filter` (Object, optional): Additional filters (status, leaveType, etc.)

**Returns:** Promise<Array<LeaveRequest>>

**Example:**
```javascript
// Get all approved leaves for a user
const approvedLeaves = await LeaveRequest.getUserLeaves(userId, { status: 'approved' });

// Get all sick leaves for a user
const sickLeaves = await LeaveRequest.getUserLeaves(userId, { leaveType: 'sick' });
```

### Query Helpers

#### `byDateRange(startDate, endDate)`
Filters leave requests by date range.

**Example:**
```javascript
const leaves = await LeaveRequest.find()
  .byDateRange(new Date('2025-11-01'), new Date('2025-11-30'))
  .exec();
```

### Pre-validation Middleware
- Validates that `endDate` is not before `startDate`
- Auto-calculates `totalDays` if dates are modified
- Runs before document validation

### Usage Examples

#### Create a leave request:
```javascript
import LeaveRequest from './models/leaveRequest.model.js';

const leave = await LeaveRequest.create({
  userId: user._id,
  leaveType: 'sick',
  startDate: new Date('2025-11-29'),
  endDate: new Date('2025-12-01'),
  reason: 'Medical appointment and recovery'
});
// totalDays is automatically calculated (3 days)
```

#### Approve a leave request:
```javascript
const leave = await LeaveRequest.findById(leaveId);
await leave.approve(managerId, 'Approved for medical reasons');
```

#### Get pending leaves for managers:
```javascript
const pendingLeaves = await LeaveRequest.getPendingLeaves();
pendingLeaves.forEach(leave => {
  console.log(`${leave.userId.name} requested ${leave.leaveType} leave`);
});
```

#### Get employee's leave history:
```javascript
const userLeaves = await LeaveRequest.getUserLeaves(userId);
console.log(`Total leaves requested: ${userLeaves.length}`);
```

---

## 🔐 Security Best Practices

### User Model:
- ✅ Passwords are hashed with bcrypt (10 salt rounds)
- ✅ Passwords excluded from queries by default
- ✅ JWT tokens with expiration
- ✅ Email validation and uniqueness
- ✅ Role-based access control ready

### LeaveRequest Model:
- ✅ User references validated
- ✅ Date range validation
- ✅ Status tracking with audit trail
- ✅ Manager approval tracking
- ✅ Indexed for performance

---

## 🚀 Performance Optimizations

### Indexes Created:
- User email (unique)
- Leave userId
- Leave status
- Leave leaveType
- Compound: userId + status
- Compound: status + createdAt
- Compound: leaveType + startDate

### Benefits:
- Fast user lookup by email
- Quick filtering of leaves by user
- Efficient status-based queries
- Optimized date range searches
- Reduced query execution time

---

## 📊 Data Relationships

```
User (1) ──────────────> (Many) LeaveRequest
  │                              │
  ├─ _id                        ├─ userId (ref)
  ├─ name                       ├─ status
  ├─ email                      ├─ approvedBy (ref)
  ├─ role                       └─ dates
  └─ leaveBalance
```

---

## 🧪 Testing the Models

### Test User Model:
```javascript
// Create a test user
const user = await User.create({
  name: 'Test User',
  email: 'test@example.com',
  password: 'test123',
  role: 'employee'
});

// Verify password hashing
console.log(user.password); // Should be hashed, not 'test123'

// Test password comparison
const isValid = await user.comparePassword('test123');
console.log(isValid); // true

// Generate JWT
const token = user.generateJWT();
console.log(token); // JWT string
```

### Test LeaveRequest Model:
```javascript
// Create a test leave request
const leave = await LeaveRequest.create({
  userId: user._id,
  leaveType: 'sick',
  startDate: new Date('2025-11-29'),
  endDate: new Date('2025-12-01'),
  reason: 'Medical appointment'
});

// Check auto-calculated days
console.log(leave.totalDays); // 3

// Check formatted dates
console.log(leave.formattedDates);

// Test approval
await leave.approve(managerId, 'Approved');
console.log(leave.status); // 'approved'
```

---

## 📝 Next Steps

After models are set up:
1. ✅ Models created and exported
2. ⏳ Create authentication controllers
3. ⏳ Create leave management controllers
4. ⏳ Set up API routes
5. ⏳ Add validation middleware
6. ⏳ Test with Postman/Thunder Client

---

**Last Updated:** November 29, 2025  
**Task:** 2 - Database Models  
**Status:** ✅ Complete
