import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../redux/reducers/auth.reducer';

const ProtectedRoute: React.FC = () => {
  const currentUser = useSelector(selectCurrentUser);
  const location = useLocation();

  if (!currentUser?.id) {
    // Redirect to login while saving the attempted URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Render child routes
  return <Outlet />;
};

export default ProtectedRoute;