import React from 'react';
import { Link } from 'react-router-dom';
import LogOutButton from '../LogoutButton/LogoutButton';
import './Nav.css';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../redux/reducers/auth.reducer';

const Nav: React.FC = () => {
  const user = useSelector(selectCurrentUser);

  return (
    <div className="nav">
      <Link to="/dashboard">
        <h2 className="nav-title">Dungeon Master Companion App</h2>
      </Link>
      <div>
        {/* If no user is logged in, show these links */}
        {!user?.id && (
          <Link 
            className="navLink" 
            to="/login"
          >
            Login / Register
          </Link>
        )}

        {/* If a user is logged in, show these links */}
        {user?.id && (
          <>
            <Link 
              className="navLink" 
              to="/dashboard"
            >
              Home
            </Link>

            <Link 
              className="navLink" 
              to="/playerinfo"
            >
              Player Entry
            </Link>

            <Link 
              className="navLink" 
              to="/players"
            >
              Character List
            </Link>

            <Link 
              className="navLink" 
              to="/gameview"
            >
              Game View
            </Link>

            <Link 
              className="navLink" 
              to="/monsterentry"
            >
              Monster Entry
            </Link>

            <Link 
              className="navLink" 
              to="/monsters"
            >
              Monster List
            </Link>

            <LogOutButton className="navLink" />
          </>
        )}
      </div>
    </div>
  );
};

export default Nav;