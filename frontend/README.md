# Employee Leave Management System - Frontend

## 🚀 Tech Stack

- **Framework**: React 18 with Vite
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM v6
- **Styling**: Tailwind CSS
- **UI Components**: Headless UI, Heroicons
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast
- **Animations**: Framer Motion

## 📁 Project Structure

```
frontend/
├── src/
│   ├── assets/          # Static assets (images, icons)
│   ├── components/      # Reusable components
│   ├── features/        # Feature-based modules
│   ├── hooks/           # Custom React hooks
│   ├── layouts/         # Layout components
│   ├── pages/           # Page components
│   ├── router/          # Routing configuration
│   ├── store/           # Redux store and slices
│   ├── styles/          # Global styles
│   ├── utils/           # Utility functions
│   ├── App.jsx          # Main App component
│   └── main.jsx         # Entry point
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## 🛠️ Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

## 🏃 Running the Application

### Development Mode
```bash
npm run dev
```
The application will start at `http://localhost:3000`

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the frontend root (if needed):
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### Proxy Configuration
The Vite config includes proxy settings for API calls:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000/api`

## 📦 Key Dependencies

### Core
- `react`: ^18.2.0
- `react-dom`: ^18.2.0
- `vite`: ^5.0.8

### State & Routing
- `@reduxjs/toolkit`: ^2.0.1
- `react-redux`: ^9.0.4
- `react-router-dom`: ^6.21.0

### UI & Styling
- `tailwindcss`: ^3.4.0
- `@headlessui/react`: ^1.7.17
- `@heroicons/react`: ^2.1.1
- `framer-motion`: ^10.16.16

### Utilities
- `axios`: ^1.6.2
- `react-hot-toast`: ^2.4.1

## 🎨 Styling

The project uses Tailwind CSS with custom configuration:
- Custom color palette (primary colors)
- Custom utility classes
- Responsive design support
- Dark mode ready

## 🔐 Authentication

Authentication is handled through:
- Redux store (`authSlice`)
- JWT tokens stored in localStorage
- Axios interceptors for automatic token attachment
- Protected routes with role-based access

## 🗺️ Routing

Routes are configured in `src/router/AppRouter.jsx`:
- `/login` - Login page
- `/register` - Registration page
- `/employee/dashboard` - Employee dashboard (protected)
- `/manager/dashboard` - Manager dashboard (protected)

## 📱 Features

### Implemented
- ✅ Project structure setup
- ✅ Vite + React configuration
- ✅ Tailwind CSS integration
- ✅ Redux Toolkit store setup
- ✅ React Router configuration
- ✅ Axios instance with interceptors
- ✅ Authentication flow structure
- ✅ Basic page components

### To Be Implemented
- ⏳ Complete authentication logic
- ⏳ Leave management features
- ⏳ Dashboard functionality
- ⏳ API integration
- ⏳ Form validations
- ⏳ Advanced UI components

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

This project is part of the TAP Academy Assignment.
