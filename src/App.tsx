import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppDispatch } from './redux/store';
import { selectIsAuthenticated, selectAuthStatus, fetchCurrentUser } from './redux/reducers/auth.reducer';

// Import your components
import LandingPage from './components/LandingPage/LandingPage';
import RegistrationPage from './components/RegistrationPage/RegistrationPage';

// Import other components you need...

// Protected Route component
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const authStatus = useSelector(selectAuthStatus);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, isAuthenticated]);

  // Show loading state while checking authentication
  if (authStatus === 'loading') {
    return <div>Loading...</div>; // Consider replacing with a proper loading component
  }

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route 
          path="/" 
          element={!isAuthenticated ? <LandingPage /> : <Navigate to="/dashboard" replace />} 
        />
        <Route 
          path="/login" 
          element={!isAuthenticated ? <LandingPage /> : <Navigate to="/dashboard" replace />} 
        />
        <Route 
          path="/register" 
          element={!isAuthenticated ? <RegistrationPage /> : <Navigate to="/dashboard" replace />} 
        />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <div>Dashboard Component</div> {/* Replace with your actual Dashboard component */}
            </ProtectedRoute>
          }
        />

        {/* Add more protected routes as needed */}
        <Route
          path="/games"
          element={
            <ProtectedRoute>
              <div>Games Component</div> {/* Replace with your actual Games component */}
            </ProtectedRoute>
          }
        />

        <Route
          path="/monsters"
          element={
            <ProtectedRoute>
              <div>Monsters Component</div> {/* Replace with your actual Monsters component */}
            </ProtectedRoute>
          }
        />

        {/* 404 route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;