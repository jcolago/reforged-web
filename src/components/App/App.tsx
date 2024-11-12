import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppDispatch } from '../../redux/store';
import { 
  selectIsAuthenticated, 
  selectAuthStatus, 
  fetchCurrentUser 
} from '../../redux/reducers/auth.reducer';

import './App.css'

// Import your components
import LandingPage from '../LandingPage/LandingPage';
import RegistrationPage from '../RegistrationPage/RegistrationPage';
import Nav from '../Nav/Nav';
import Footer from '../Footer/Footer';
import UserDashboard from '../UserDashboard/UserDashboard';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const authStatus = useSelector(selectAuthStatus);
  
  // Show loading state while checking authentication
  if (authStatus === 'loading') {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Only try to fetch current user if we have a token
    if (token) {
      dispatch(fetchCurrentUser())
        .unwrap()
        .catch((error) => {
          console.error('Failed to fetch current user:', error);
          // Optionally clear token if it's invalid
          localStorage.removeItem('token');
        });
    }
  }, [dispatch, token]);

  return (
    <Router>
      <Nav />
      <Routes>
        {/* Public routes */}
        <Route 
          path="/" 
          element={<LandingPage />} 
        />
        <Route 
          path="/login" 
          element={
            token ? <Navigate to="/dashboard" replace /> : <LandingPage />
          } 
        />
        <Route 
          path="/register" 
          element={
            token ? <Navigate to="/dashboard" replace /> : <RegistrationPage />
          } 
        />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/games/*"
          element={
            <ProtectedRoute>
              <div>Games Component</div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/monsters/*"
          element={
            <ProtectedRoute>
              <div>Monsters Component</div>
            </ProtectedRoute>
          }
        />

        {/* 404 route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;