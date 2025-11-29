import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import store from './store/store';
import AppRouter from './router/AppRouter';
import { setAuthFromStorage } from './store/authSlice';
import './styles/globals.css';

// Component to handle auth initialization
const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Initialize auth state from localStorage on app load
    dispatch(setAuthFromStorage());
  }, [dispatch]);

  return children;
};

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AuthInitializer>
          <AppRouter />
          <Toaster
            position="top-right"
            reverseOrder={false}
            toastOptions={{
              // Default options
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              // Success
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#fff',
                },
              },
              // Error
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </AuthInitializer>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
