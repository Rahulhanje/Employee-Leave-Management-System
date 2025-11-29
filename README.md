<div align="center">

# 🏢 Employee Leave Management System

### A Modern, Full-Stack Leave Management Solution

[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)

[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-764ABC?style=for-the-badge&logo=redux&logoColor=white)](https://redux-toolkit.js.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)](https://jwt.io/)

*Streamline leave requests, approvals, and tracking with a beautiful, intuitive interface*

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [API Documentation](#-api-documentation) • [Screenshots](#-screenshots)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Database Seeding](#-database-seeding)
- [API Documentation](#-api-documentation)
- [Frontend Routes](#-frontend-routes)
- [Screenshots](#-screenshots)
- [Development Workflow](#-development-workflow)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

The **Employee Leave Management System** is a comprehensive web application designed to streamline the leave management process in organizations. Built with the MERN stack, it offers role-based access control, real-time leave balance tracking, and an intuitive user interface with smooth animations.

### 🎯 Key Highlights

- 🔐 **Secure Authentication** - JWT-based auth with bcrypt password hashing
- 👥 **Role-Based Access** - Separate interfaces for Employees and Managers
- 📊 **Real-Time Dashboard** - Live statistics and leave balance tracking
- 🎨 **Modern UI/UX** - Beautiful, responsive design with Framer Motion animations
- ⚡ **Fast & Efficient** - Redux Toolkit for optimized state management
- 📱 **Mobile Responsive** - Works seamlessly on all devices

---

## ✨ Features

### 🧑‍💼 Employee Features

<table>
<tr>
<td width="50%">

#### 📝 Leave Management
- ✅ Apply for leaves (Sick, Casual, Annual)
- ✅ View leave history with filters
- ✅ Cancel pending leave requests
- ✅ Auto-calculate leave duration
- ✅ Real-time status updates

</td>
<td width="50%">

#### 📊 Dashboard & Analytics
- ✅ View leave balance by type
- ✅ Pending requests overview
- ✅ Upcoming leaves calendar
- ✅ Leave history statistics
- ✅ Quick action buttons

</td>
</tr>
</table>

### 👨‍💼 Manager Features

<table>
<tr>
<td width="50%">

#### 🎯 Leave Approval System
- ✅ View all pending requests
- ✅ Approve/Reject with comments
- ✅ Filter by status, type, employee
- ✅ Search functionality
- ✅ Bulk operations ready

</td>
<td width="50%">

#### 📈 Analytics & Reporting
- ✅ Team leave statistics
- ✅ Leave type distribution
- ✅ 30-day approval/rejection trends
- ✅ Employee leave history
- ✅ Export capabilities (coming soon)

</td>
</tr>
</table>

### 🔒 Security Features

- 🔐 JWT token-based authentication
- 🛡️ Password hashing with bcrypt
- 🚪 Role-based access control (RBAC)
- 🔄 Token refresh mechanism
- 🚫 Protected API routes
- ✅ Input validation & sanitization

---

## 🛠️ Tech Stack

### Backend

| Technology | Purpose | Version |
|------------|---------|---------|
| **Node.js** | Runtime Environment | v18+ |
| **Express.js** | Web Framework | 4.18.2 |
| **MongoDB** | Database | Latest |
| **Mongoose** | ODM | 8.0.0 |
| **JWT** | Authentication | 9.0.2 |
| **bcrypt** | Password Hashing | 5.1.1 |
| **express-validator** | Input Validation | 7.0.1 |
| **date-fns** | Date Utilities | 4.1.0 |

### Frontend

| Technology | Purpose | Version |
|------------|---------|---------|
| **React** | UI Library | 18.2.0 |
| **Vite** | Build Tool | 5.0.8 |
| **Redux Toolkit** | State Management | 2.0.1 |
| **React Router** | Routing | 6.21.0 |
| **Tailwind CSS** | Styling | 3.4.0 |
| **Framer Motion** | Animations | 10.16.16 |
| **Axios** | HTTP Client | 1.6.2 |
| **Heroicons** | Icons | 2.1.1 |
| **React Hot Toast** | Notifications | 2.4.1 |
| **date-fns** | Date Formatting | 4.1.0 |

---

## 📁 Project Structure

```
tap_academy_assignment/
├── 📂 backend/
│   ├── 📂 src/
│   │   ├── 📂 config/
│   │   │   └── database.js           # MongoDB configuration
│   │   ├── 📂 controllers/
│   │   │   ├── auth.controller.js    # Authentication logic
│   │   │   ├── leave.controller.js   # Employee leave operations
│   │   │   ├── manager.controller.js # Manager operations
│   │   │   └── dashboard.controller.js # Dashboard statistics
│   │   ├── 📂 middleware/
│   │   │   ├── authMiddleware.js     # JWT verification
│   │   │   ├── roleMiddleware.js     # Role-based access
│   │   │   ├── errorHandler.js       # Global error handler
│   │   │   └── notFound.js           # 404 handler
│   │   ├── 📂 models/
│   │   │   ├── user.model.js         # User schema
│   │   │   └── leaveRequest.model.js # Leave request schema
│   │   ├── 📂 routes/
│   │   │   ├── auth.routes.js        # Auth endpoints
│   │   │   ├── leave.routes.js       # Leave endpoints
│   │   │   └── dashboard.routes.js   # Dashboard endpoints
│   │   ├── 📂 utils/
│   │   │   └── response.js           # Unified API responses
│   │   ├── 📂 validators/
│   │   │   ├── authValidator.js      # Auth validation rules
│   │   │   ├── leaveValidator.js     # Leave validation rules
│   │   │   └── managerValidator.js   # Manager validation rules
│   │   └── server.js                 # Express server entry point
│   ├── 📂 scripts/
│   │   └── seed.js                   # Database seeding script
│   ├── .env                          # Environment variables
│   ├── .env.example                  # Environment template
│   └── package.json                  # Backend dependencies
│
├── 📂 frontend/
│   ├── 📂 public/                    # Static assets
│   ├── 📂 src/
│   │   ├── 📂 components/
│   │   │   ├── LeaveCard.jsx         # Reusable leave card
│   │   │   └── ManagerRequestCard.jsx # Manager request card
│   │   ├── 📂 pages/
│   │   │   ├── Login.jsx             # Login page
│   │   │   ├── Register.jsx          # Registration page
│   │   │   ├── NotFound.jsx          # 404 page
│   │   │   ├── 📂 employee/
│   │   │   │   ├── Dashboard.jsx     # Employee dashboard
│   │   │   │   ├── ApplyLeave.jsx    # Apply leave form
│   │   │   │   └── MyRequests.jsx    # Leave history
│   │   │   └── 📂 manager/
│   │   │       ├── Dashboard.jsx     # Manager dashboard
│   │   │       ├── PendingRequests.jsx # Approval queue
│   │   │       └── AllRequests.jsx   # Complete history
│   │   ├── 📂 router/
│   │   │   └── AppRouter.jsx         # Route configuration
│   │   ├── 📂 store/
│   │   │   ├── store.js              # Redux store config
│   │   │   ├── authSlice.js          # Auth state management
│   │   │   ├── leaveSlice.js         # Leave state management
│   │   │   ├── managerSlice.js       # Manager state management
│   │   │   └── dashboardSlice.js     # Dashboard state
│   │   ├── 📂 utils/
│   │   │   └── axiosInstance.js      # Axios configuration
│   │   ├── App.jsx                   # Root component
│   │   ├── main.jsx                  # React entry point
│   │   └── index.css                 # Global styles
│   ├── .env                          # Frontend environment variables
│   ├── index.html                    # HTML template
│   ├── package.json                  # Frontend dependencies
│   ├── tailwind.config.js            # Tailwind configuration
│   └── vite.config.js                # Vite configuration
│
├── 📂 tasks_list/                    # Task documentation
│   ├── TASK_1_SUMMARY.md             # Database design
│   ├── TASK_2_SUMMARY.md             # Backend setup
│   ├── TASK_9_SUMMARY.md             # Authentication UI
│   ├── TASK_10_SUMMARY.md            # Employee UI
│   └── TASK_11_SUMMARY.md            # Manager UI
│
└── README.md                         # This file
```

---

## 🚀 Installation

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (local or MongoDB Atlas) - [Download](https://www.mongodb.com/try/download/community)
- **Git** - [Download](https://git-scm.com/downloads)
- **npm** or **yarn** - Comes with Node.js

### 🔧 Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Rahulhanje/Employee-Leave-Management-System.git
   cd Employee-Leave-Management-System
   ```

2. **Navigate to backend directory**
   ```bash
   cd backend
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Configure environment variables**
   
   Create a `.env` file in the backend directory:
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # Database
   MONGODB_URI=mongodb://localhost:27017/employee-leave-management
   
   # JWT Secret (use a strong random string)
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=7d
   
   # CORS Origin (frontend URL)
   CORS_ORIGIN=http://localhost:3001
   ```

5. **Seed the database** (Optional - creates sample users)
   ```bash
   npm run seed
   ```
   
   **Default Credentials:**
   - **Manager:** manager@example.com / manager123
   - **Employee:** employee@example.com / employee123

6. **Start the backend server**
   ```bash
   # Development mode with hot reload
   npm run dev
   
   # Production mode
   npm start
   ```
   
   ✅ Backend running at `http://localhost:5000`

### 🎨 Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the frontend directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   
   ✅ Frontend running at `http://localhost:3001`

5. **Build for production**
   ```bash
   npm run build
   ```

---

## 🔐 Environment Variables

### Backend (.env)

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port | `5000` | ✅ |
| `NODE_ENV` | Environment | `development` / `production` | ✅ |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/dbname` | ✅ |
| `JWT_SECRET` | JWT signing secret | `your-secret-key` | ✅ |
| `JWT_EXPIRE` | Token expiration time | `7d` | ✅ |
| `CORS_ORIGIN` | Allowed CORS origins | `http://localhost:3001` | ✅ |

### Frontend (.env)

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000/api` | ✅ |

---

## 🌱 Database Seeding

The project includes a seeding script to populate the database with sample data for testing.

### Run Seed Script

```bash
cd backend
npm run seed
```

### Seed Data Includes

#### 👤 Users

| Role | Email | Password | Leave Balances |
|------|-------|----------|----------------|
| Manager | manager@example.com | manager123 | Sick: 10, Casual: 12, Annual: 15 |
| Employee | employee@example.com | employee123 | Sick: 10, Casual: 12, Annual: 15 |

#### 📋 Sample Leave Requests

- 5 sample leave requests with various statuses (Pending, Approved, Rejected)
- Mix of leave types (Sick, Casual, Annual)
- Includes manager comments for approved/rejected requests

### Reset Database

To clear and reseed the database:

```bash
# Drop the database in MongoDB
mongosh employee-leave-management --eval "db.dropDatabase()"

# Run seed script again
npm run seed
```

---

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### 🔓 Auth Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "employee"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "employee"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 📝 Leave Endpoints (Employee)

#### Apply for Leave
```http
POST /leaves
Authorization: Bearer <token>
Content-Type: application/json

{
  "leaveType": "sick",
  "startDate": "2024-01-15",
  "endDate": "2024-01-17",
  "reason": "Medical appointment"
}
```

#### Get My Leave Requests
```http
GET /leaves/my-requests?status=pending&page=1&limit=10
Authorization: Bearer <token>
```

#### Get Leave Balance
```http
GET /leaves/balance
Authorization: Bearer <token>
```

#### Cancel Leave Request
```http
DELETE /leaves/:id
Authorization: Bearer <token>
```

### 👨‍💼 Manager Endpoints

#### Get Pending Requests
```http
GET /leaves/pending
Authorization: Bearer <token>
Role: manager
```

#### Get All Requests
```http
GET /leaves/all?status=approved&leaveType=sick
Authorization: Bearer <token>
Role: manager
```

#### Approve Leave
```http
PUT /leaves/:id/approve
Authorization: Bearer <token>
Role: manager
Content-Type: application/json

{
  "comment": "Approved - Feel better soon"
}
```

#### Reject Leave
```http
PUT /leaves/:id/reject
Authorization: Bearer <token>
Role: manager
Content-Type: application/json

{
  "comment": "Insufficient leave balance"
}
```

### 📊 Dashboard Endpoints

#### Employee Dashboard
```http
GET /dashboard/employee
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "leaveBalance": {
      "sick": 8,
      "casual": 10,
      "annual": 15
    },
    "pendingRequests": 2,
    "approvedRequests": 5,
    "rejectedRequests": 1,
    "upcomingLeaves": [...]
  }
}
```

#### Manager Dashboard
```http
GET /dashboard/manager
Authorization: Bearer <token>
Role: manager
```

**Response:**
```json
{
  "success": true,
  "data": {
    "pendingCount": 8,
    "approvedLast30Days": 25,
    "rejectedLast30Days": 3,
    "leaveTypeDistribution": [
      { "_id": "sick", "count": 12 },
      { "_id": "casual", "count": 10 },
      { "_id": "annual", "count": 6 }
    ]
  }
}
```

For complete API documentation, see:
- [AUTH_API_DOCUMENTATION.md](backend/AUTH_API_DOCUMENTATION.md)
- [LEAVE_API_DOCUMENTATION.md](backend/LEAVE_API_DOCUMENTATION.md)
- [MANAGER_API_DOCUMENTATION.md](backend/MANAGER_API_DOCUMENTATION.md)

---

## 🗺️ Frontend Routes

### Public Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | Redirect | Redirects to `/login` |
| `/login` | Login | User login page |
| `/register` | Register | User registration page |

### Protected Routes - Employee

| Path | Component | Description | Access |
|------|-----------|-------------|--------|
| `/employee/dashboard` | Dashboard | Employee dashboard with stats | Employee |
| `/employee/apply-leave` | ApplyLeave | Leave application form | Employee |
| `/employee/my-requests` | MyRequests | Leave history | Employee |

### Protected Routes - Manager

| Path | Component | Description | Access |
|------|-----------|-------------|--------|
| `/manager/dashboard` | Dashboard | Manager dashboard with analytics | Manager |
| `/manager/pending` | PendingRequests | Pending approval queue | Manager |
| `/manager/requests` | AllRequests | Complete leave history | Manager |

---

## 📸 Screenshots

### 🔐 Authentication

<table>
<tr>
<td width="50%" align="center">
<b>Login Page</b><br/>
<img src="tasks_list_and_results/Screenshot 2025-11-29 152205.png" alt="Login Page" width="100%"/>
<i>Modern login interface with form validation</i>
</td>
<td width="50%" align="center">
<b>Register Page</b><br/>
<img src="tasks_list_and_results/Screenshot 2025-11-29 152205 - Copy.png" alt="Register Page" width="100%"/>
<i>User registration with role selection</i>
</td>
</tr>
</table>

### 🧑‍💼 Employee Dashboard

<table>
<tr>
<td width="50%" align="center">
<b>Dashboard Overview</b><br/>
<img src="tasks_list_and_results/Screenshot 2025-11-29 152212.png" alt="Employee Dashboard" width="100%"/>
<i>Leave balance, analytics charts, and upcoming leaves</i>
</td>
<td width="50%" align="center">
<b>Apply Leave</b><br/>
<img src="tasks_list_and_results/Screenshot 2025-11-29 152220 - Copy.png" alt="Apply Leave" width="100%"/>
<i>Intuitive form with auto-calculate duration</i>
</td>
</tr>
<tr>
<td width="50%" align="center">
<b>My Requests</b><br/>
<img src="tasks_list_and_results/Screenshot 2025-11-29 152243.png" alt="My Requests" width="100%"/>
<i>Complete leave history with status badges</i>
</td>
<td width="50%" align="center">
<b>Leave Analytics</b><br/>
<img src="tasks_list_and_results/Screenshot 2025-11-29 152310.png" alt="Leave Analytics" width="100%"/>
<i>Visual charts showing leave balance and request status</i>
</td>
</tr>
</table>

### 👨‍💼 Manager Dashboard

<table>
<tr>
<td width="50%" align="center">
<b>Manager Dashboard</b><br/>
<img src="tasks_list_and_results/Screenshot 2025-11-29 152318.png" alt="Manager Dashboard" width="100%"/>
<i>Team statistics, leave distribution charts, and analytics</i>
</td>
<td width="50%" align="center">
<b>Pending Requests</b><br/>
<img src="tasks_list_and_results/Screenshot 2025-11-29 152325.png" alt="Pending Requests" width="100%"/>
<i>Approval queue with quick approve/reject actions</i>
</td>
</tr>
<tr>
<td width="50%" align="center">
<b>All Requests</b><br/>
<img src="tasks_list_and_results/Screenshot 2025-11-29 152350.png" alt="All Requests" width="100%"/>
<i>Complete leave history with advanced filters and search</i>
</td>
<td width="50%" align="center">
<b>Manager Analytics</b><br/>
<img src="tasks_list_and_results/Screenshot 2025-11-29 152243.png" alt="Manager Analytics" width="100%"/>
<i>Visual insights into team leave patterns and trends</i>
</td>
</tr>
</table>

> 📝 **Note**: All screenshots showcase the modern, responsive UI with beautiful animations and intuitive navigation.
<tr>
<td width="50%">
<b>All Requests</b><br/>
Filterable table with search
</td>
<td width="50%">
<b>Approve/Reject</b><br/>
Action modal with comment support
</td>
</tr>
</table>

---

## 🔄 Development Workflow

### Git Workflow

The project follows a feature-branch workflow:

```bash
# Create a new feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push to remote
git push origin feature/your-feature-name

# Create Pull Request on GitHub
```

### Commit Message Convention

Follow conventional commits:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

**Examples:**
```bash
git commit -m "feat(frontend): add employee dashboard"
git commit -m "fix(backend): correct leave balance calculation"
git commit -m "docs: update API documentation"
```

### Available Branches

- `main` - Production-ready code
- `feature/frontend-auth-ui` - Authentication UI (merged)
- `feature/employee-ui` - Employee interface (merged)
- `feature/manager-ui` - Manager interface (active)

---

## 🧪 Testing

### Manual Testing

1. **Start both servers:**
   ```bash
   # Terminal 1 - Backend
   cd backend && npm run dev
   
   # Terminal 2 - Frontend
   cd frontend && npm run dev
   ```

2. **Login with default credentials:**
   - Manager: manager@example.com / manager123
   - Employee: employee@example.com / employee123

3. **Test Employee Features:**
   - View dashboard
   - Apply for leave
   - View leave history
   - Cancel pending requests

4. **Test Manager Features:**
   - View manager dashboard
   - Approve/reject pending requests
   - Filter and search leave history

### Postman Collection

Import the Postman collection for API testing:

```bash
backend/postman/Leave_Management_APIs.postman_collection.json
backend/postman/Manager_Leave_APIs.postman_collection.json
```

---

## 🚀 Deployment

### Backend Deployment (Heroku Example)

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Create Heroku app**
   ```bash
   cd backend
   heroku create your-app-name
   ```

3. **Set environment variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=your-secret
   heroku config:set MONGODB_URI=your-mongodb-atlas-uri
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

### Frontend Deployment (Vercel Example)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   cd frontend
   vercel
   ```

3. **Set environment variables in Vercel Dashboard**
   - `VITE_API_URL` → Your backend URL

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**

2. **Clone your fork**
   ```bash
   git clone https://github.com/your-username/Employee-Leave-Management-System.git
   ```

3. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

4. **Make your changes and commit**
   ```bash
   git commit -m "feat: add amazing feature"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Open a Pull Request**

### Code Style Guidelines

- Use ES6+ features
- Follow ESLint rules
- Write meaningful commit messages
- Add comments for complex logic
- Keep functions small and focused
- Use descriptive variable names

---

## 🐛 Known Issues

- [ ] Duplicate Mongoose index warning (doesn't affect functionality)
- [ ] Mobile responsive improvements needed for tables
- [ ] Export to CSV feature pending
- [ ] Email notifications not implemented
- [ ] Bulk approve/reject not implemented

---

## 🗺️ Roadmap

### Phase 1 - Core Features ✅
- [x] Backend API development
- [x] Authentication & Authorization
- [x] Employee leave management
- [x] Manager approval system
- [x] Frontend UI implementation

### Phase 2 - Enhancements 🚧
- [ ] Email notifications
- [ ] Calendar integration
- [ ] Bulk operations
- [ ] Export to PDF/CSV
- [ ] Advanced analytics

### Phase 3 - Advanced Features 📋
- [ ] Team management
- [ ] Department-wise reporting
- [ ] Leave policy configuration
- [ ] Holiday calendar
- [ ] Mobile app

---

## 📄 License

This project is licensed under the **ISC License**.

---

## 👨‍💻 Author

**Rahul Hanje**

- GitHub: [@Rahulhanje](https://github.com/Rahulhanje)
- Repository: [Employee-Leave-Management-System](https://github.com/Rahulhanje/Employee-Leave-Management-System)

---

## 🙏 Acknowledgments

- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Framer Motion Documentation](https://www.framer.com/motion/)

---

## 📞 Support

If you have any questions or need help, please:

1. Check the [API Documentation](#-api-documentation)
2. Open an [Issue](https://github.com/Rahulhanje/Employee-Leave-Management-System/issues)
3. Contact: [Your Email]

---

<div align="center">

### ⭐ Star this repo if you find it helpful!

**Made with ❤️ by Rahul Hanje**

[⬆ Back to Top](#-employee-leave-management-system)

</div>
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
