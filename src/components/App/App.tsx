// src/components/App/App.tsx

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from 'react-router-dom';
import { AppDispatch, RootState } from '../../redux/store';
import {
  selectIsAuthenticated,
  selectAuthStatus,
  fetchCurrentUser,
} from '../../redux/reducers/auth.reducer';
import { fetchPlayers } from '../../redux/reducers/player.reducer';
import { fetchMonsters } from '../../redux/reducers/monster.reducer';

import './App.css';

// Import components
import LandingPage from '../LandingPage/LandingPage';
import Nav from '../Nav/Nav';
import Footer from '../Footer/Footer';
import UserDashboard from '../UserDashboard/UserDashboard';
import PlayersTable from '../PlayersTable/PlayersTable';
import PlayerEntryForm from '../PlayerEntryForm/PlayerEnrtyFrom';
import Success from '../Success/Success';
import DetailsView from '../DetailsView/DetailsView';
import EditDetails from '../EditDetails/EditDetails';
import MonsterEntryForm from '../MonsterEntryForm/MonsterEntryForm';
import MonsterTable from '../MonsterTable/MonsterTable';
import MonsterDetails from '../MonsterDetails/MonsterDetails';
import GameView from '../GameView/GameView';
import { fetchGames } from '../../redux/reducers/game.reducer';

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
  const user = useSelector((state: RootState) => state.auth.user);
  const token = localStorage.getItem('token');
  const player = useSelector((state: RootState) => state.player.players);
  console.log(player);

  useEffect(() => {
    if (token && !isAuthenticated) {
      dispatch(fetchCurrentUser())
        .unwrap()
        .catch((error) => {
          console.error('Failed to fetch current user:', error);
          localStorage.removeItem('token');
        });
    }
  }, [dispatch, token, isAuthenticated]);

  // Second useEffect to fetch initial data once authenticated
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      dispatch(fetchPlayers());
      dispatch(fetchMonsters());
      dispatch(fetchGames(user.id));
    }
  }, [dispatch, isAuthenticated, user?.id]);

  return (
    <Router>
      <Nav />
      <Routes>
        {/* Public routes */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <LandingPage />
            )
          }
        />
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <LandingPage />
            )
          }
        />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/players" element={<PlayersTable />} />
          <Route path="/playerinfo" element={<PlayerEntryForm />} />
          <Route path="/success" element={<Success />} />
          <Route path="/details/:id" element={<DetailsView />} />
          <Route path="/edit/:id" element={<EditDetails />} />
          <Route path="/monsterentry" element={<MonsterEntryForm />} />
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
