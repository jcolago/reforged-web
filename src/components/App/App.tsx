// src/components/App/App.tsx

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AppDispatch } from '../../redux/store';
import { 
  selectIsAuthenticated, 
  selectAuthStatus, 
  fetchCurrentUser 
} from '../../redux/reducers/auth.reducer';
import { fetchPlayers } from '../../redux/reducers/player.reducer';
import { fetchMonsters } from '../../redux/reducers/monster.reducer';

import './App.css';

// Import components
import LandingPage from '../LandingPage/LandingPage';
import RegistrationPage from '../RegistrationPage/RegistrationPage';
import Nav from '../Nav/Nav';
import Footer from '../Footer/Footer';
import UserDashboard from '../UserDashboard/UserDashboard';
import PlayerInfoForm from '../PlayerInfoForm/PlayerInfoForm';
import PlayerStatInfoForm from '../PlayerStatInfoForm/PlayerStatInfoForm';
import PlayersTable from '../PlayersTable/PlayersTable';
import PlayerReview from '../PlayerReview/PlayerReview';
import Success from '../Success/Success';
import DetailsView from '../DetailsView/DetailsView';
import EditDetails from '../EditDetails/EditDetails';
import MonsterEntryForm from '../MonsterEntryForm/MonsterEntryForm';
import MonsterSuccess from '../MonsterSuccess/MonsterSuccess';
import MonsterTable from '../MonsterTable/MonsterTable';
import MonsterDetails from '../MonsterDetails/MonsterDetails';
import GameView from '../GameView/GameView';

const ProtectedRoute: React.FC = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const authStatus = useSelector(selectAuthStatus);
  
  if (authStatus === 'loading') {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      dispatch(fetchCurrentUser())
        .unwrap()
        .then(() => {
          // After successful authentication, fetch initial data
          dispatch(fetchPlayers());
          dispatch(fetchMonsters());
        })
        .catch((error) => {
          console.error('Failed to fetch current user:', error);
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
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />} 
        />
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />} 
        />
        <Route 
          path="/register" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegistrationPage />} 
        />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/playerinfo" element={<PlayerInfoForm />} />
          <Route path="/stats" element={<PlayerStatInfoForm />} />
          <Route path="/players" element={<PlayersTable />} />
          <Route path="/review" element={<PlayerReview />} />
          <Route path="/success" element={<Success />} />
          <Route path="/details/:id" element={<DetailsView />} />
          <Route path="/edit/:id" element={<EditDetails />} />
          <Route path="/monsterentry" element={<MonsterEntryForm />} />
          <Route path="/monstersuccess" element={<MonsterSuccess />} />
          <Route path="/monsters" element={<MonsterTable />} />
          <Route path="/monsterdetails/:id" element={<MonsterDetails />} />
          <Route path="/gameview" element={<GameView />} />
        </Route>

        {/* 404 route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;