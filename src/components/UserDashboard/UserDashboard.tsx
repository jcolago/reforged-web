import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  FormControl,
  InputLabel,
  CardHeader,
  OutlinedInput,
  Typography,
} from '@mui/material';
import { createGame, fetchGames } from '../../redux/reducers/game.reducer';
import type { RootState, AppDispatch } from '../../redux/store';
import FormWrapper from '../../global/components/FormWrapper';
import GlobalCard from '../../global/components/GlobalCard';
import ButtonContained from '../../global/components/ButtonContained';
import GameAccordion from '../GameAccordion/GameAccordion';

interface Game {
  id: number;
  name: string;
  dm_id: number;
}

const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // State for game creation
  const [gameName, setGameName] = useState<string>('');
  console.log(gameName);

  // Redux selectors with proper typing
  const games = useSelector((state: RootState) => state.game.games);
  const user = useSelector((state: RootState) => state.auth.user);
  console.log(user);
  //   const gameStatus = useSelector((state: RootState) => state.game.status);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Make sure this is here to prevent page refresh

    if (!user?.id || !gameName.trim()) {
      return;
    }

    const gameData = {
      name: gameName,
      dm_id: user.id,
    };

    try {
      await dispatch(createGame(gameData)).unwrap();
      setGameName('');
      // Refresh games list after creation
      dispatch(fetchGames(user.id));
    } catch (error) {
      console.error('Failed to create game:', error);
    }
  };

  if (!user) {
    return (
      <Typography variant="h6" color="error" align="center">
        Please log in to view this page
      </Typography>
    );
  }

  return (
    <>
      <div style={{ textAlign: 'center' }}>
        <Typography variant="h4" style={{ textDecoration: 'underline' }}>
          Welcome, {user.email}!
        </Typography>
      </div>

      <Container
        style={{
          border: '2px double black',
          marginTop: '20px',
        }}
      >
        <div>
          <GlobalCard
            style={{
              margin: '5px',
              marginTop: '20px',
              backgroundColor: 'rgb(226, 232, 243, .7)',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-around',
              }}
            >
              <div>
                <CardHeader
                  style={{ textDecoration: 'underline' }}
                  title="Create A Game"
                />

                <FormWrapper onSubmit={handleSubmit}>
                  <div style={{ margin: '5px' }}>
                    <FormControl>
                      <InputLabel>Enter Game Name</InputLabel>
                      <OutlinedInput
                        style={{ width: '250px' }}
                        label="Enter Game Name"
                        onChange={(event) => setGameName(event.target.value)}
                        type="text"
                        placeholder="Game Name"
                        value={gameName}
                        required
                      />
                      <div style={{ marginTop: '10px' }}>
                        <ButtonContained
                          title="Create Game"
                          type="submit"
                          padding="5px"
                        />
                      </div>
                    </FormControl>
                  </div>
                </FormWrapper>
              </div>

              <div
                style={{
                  justifyContent: 'flex-end',
                  width: '100%',
                  maxWidth: '500px',
                }}
              >
                <Typography
                  variant="h6"
                  style={{ textDecoration: 'underline', marginBottom: '16px' }}
                >
                  Your Games
                </Typography>
                {games.map((game: Game) => (
                  <GameAccordion key={game.id} game={game} />
                ))}
                {games.length === 0 && (
                  <Typography variant="body2" style={{ fontStyle: 'italic' }}>
                    No games created yet
                  </Typography>
                )}
              </div>
            </div>
          </GlobalCard>

          <GlobalCard
            style={{
              margin: '5px',
              marginBottom: '20px',
              backgroundColor: 'rgb(226, 232, 243, .7)',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ margin: '5px' }}>
                <CardHeader
                  style={{ textDecoration: 'underline' }}
                  title="Click To Navigate To An Entry Form or List"
                />
                <ButtonContained
                  title="Player Entry Form"
                  padding="5px"
                  onClick={() => navigate('/playerinfo')}
                />
                <ButtonContained
                  title="Character List"
                  padding="5px"
                  onClick={() => navigate('/players')}
                />
                <ButtonContained
                  title="Monster Entry Form"
                  padding="5px"
                  onClick={() => navigate('/monsterentry')}
                />
              </div>
            </div>
          </GlobalCard>
        </div>
      </Container>
    </>
  );
};

export default UserDashboard;
