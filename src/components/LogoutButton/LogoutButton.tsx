import React from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import { logout } from '../../redux/reducers/auth.reducer';

interface LogOutButtonProps {
  className?: string;
}

const LogOutButton: React.FC<LogOutButtonProps> = ({ className }) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <button
      className={className}
      onClick={handleLogout}
    >
      Log Out
    </button>
  );
};

export default LogOutButton;