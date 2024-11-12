import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from './redux/store';
import { 
  selectCurrentUser, 
  selectToken, 
  fetchCurrentUser,
  type User 
} from './redux/reducers/auth.reducer';
import { fetchGames } from './redux/reducers/game.reducer';
import { fetchPlayers } from './redux/reducers/player.reducer';
import { fetchMonsters } from './redux/reducers/monster.reducer';
import { fetchConditions } from './redux/reducers/condition.reducer';

// Components
// import Nav from './components/Nav';
// import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

// Pages
// import AboutPage from './pages/AboutPage';
// import UserPage from './pages/UserPage';
// import InfoPage from './pages/InfoPage';
// import LandingPage from './pages/LandingPage';
import LoginPage from '../src/components/LoginPage/LoginPage';
// import RegisterPage from './pages/RegisterPage';
// import PlayerInfo from './pages/PlayerInfo';
// import PlayerStatInfo from './pages/PlayerStatInfo';
// import PlayersTable from './pages/PlayersTable';
// import PlayerInventoryInfo from './pages/PlayerInventoryInfo';
// import Review from './pages/Review';
// import DetailsView from './pages/DetailsView';
// import EditDetails from './pages/EditDetails';
// import Success from './pages/Success';
// import MonstersTable from './pages/MonsterTable';
// import GameView from './pages/GameView';
// import MonsterEntryForm from './pages/MonsterEntryForm';
// import MonsterSuccess from './pages/MonsterSuccess';
// import MonsterDetails from './pages/MonsterDetails';

// Custom hook for typed dispatch
const useAppDispatch = () => useDispatch<AppDispatch>();

const App: React.FC = () => {
  const dispatch = useAppDispatch(); // Use typed dispatch
  const currentUser = useSelector<RootState, User | null>(selectCurrentUser);
  const token = useSelector<RootState, string | null>(selectToken);

  // Fetch user data on app load if token exists
  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          await dispatch(fetchCurrentUser()).unwrap();
        } catch (error) {
          console.error('Failed to fetch user:', error);
        }
      }
    };

    fetchUser();
  }, [dispatch, token]);

  // Fetch app data after user authentication
  useEffect(() => {
    const fetchData = async () => {
      if (currentUser?.id) {
        try {
          await Promise.all([
            dispatch(fetchPlayers()),
            dispatch(fetchGames()),
            dispatch(fetchMonsters()),
            dispatch(fetchConditions())
          ]);
        } catch (error) {
          console.error('Failed to fetch data:', error);
        }
      }
    };

    fetchData();
  }, [currentUser, dispatch]);

  return (
    <Router>
      <div 
        style={{
          backgroundImage: "url(/images/dice2.jpg)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          height: "100%",
          width: "100%"
        }}
      >
        {/* <Nav /> */}
        <Routes>
          /* Public routes
          {/* <Route path="/" element={
            currentUser?.id ? <Navigate to="/user" replace /> : <LandingPage />
          } /> */}
          
          {/* <Route path="/about" element={<AboutPage />} /> */}
          
          <Route path="/login" element={
            currentUser?.id ? <Navigate to="/user" replace /> : <LoginPage />
          } />
          
          {/* <Route path="/registration" element={
            currentUser?.id ? <Navigate to="/user" replace /> : <RegisterPage />
          } /> */}

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            {/* <Route path="/user" element={<UserPage />} />
            <Route path="/info" element={<InfoPage />} />
            <Route path="/playerinfo" element={<PlayerInfo />} />
            <Route path="/stats" element={<PlayerStatInfo />} />
            <Route path="/playerinventory" element={<PlayerInventoryInfo />} />
            <Route path="/players" element={<PlayersTable />} />
            <Route path="/review" element={<Review />} />
            <Route path="/success" element={<Success />} />
            <Route path="/details/:id" element={<DetailsView />} />
            <Route path="/edit/:id" element={<EditDetails />} />
            <Route path="/monsterentry" element={<MonsterEntryForm />} />
            <Route path="/monstersuccess" element={<MonsterSuccess />} />
            <Route path="/monsters" element={<MonstersTable />} />
            <Route path="/monsterdetails/:id" element={<MonsterDetails />} />
            <Route path="/gameview" element={<GameView />} /> */}
          </Route>

          {/* 404 route */}
          <Route path="*" element={<h1>404</h1>} />
        </Routes>
        {/* <Footer /> */}
      </div>
    </Router>
  );
};

export default App;