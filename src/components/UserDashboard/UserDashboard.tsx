// UserDashboard.tsx
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  Typography,
  Box,
} from '@mui/material';
import { createGame } from '../../redux/reducers/game.reducer';
import type { RootState, AppDispatch } from '../../redux/store';
import GlobalCard from '../../global/components/GlobalCard';
import FormWrapper from '../../global/components/FormWrapper';
import ButtonContained from '../../global/components/ButtonContained';
import GameAccordion from '../GameAccordion/GameAccordion';

interface Game {
  id: number;
  name: string;
  dm_id: number;
}

const UserDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [gameName, setGameName] = useState<string>('');

  const games = useSelector((state: RootState) => state.game.games);
  const user = useSelector((state: RootState) => state.auth.user);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!user?.id) {
      return;
    }

    const gameData = {
      name: gameName,
      dm_id: user.id,
    };

    try {
      await dispatch(createGame(gameData));
      setGameName('');
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
    <div style={{ padding: '20px' }}>
      <Typography
        variant="h4"
        sx={{
          textAlign: 'center',
          color: '#2c3e50',
          fontWeight: 500,
          mb: 3,
        }}
      >
        Welcome, {user.email}!
      </Typography>

      <GlobalCard
        sx={{
          backgroundColor: 'rgb(128, 150, 191, .5)',
          border: '2px double black',
          padding: '20px',
        }}
      >
        {/* Header section with title and game creation */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              color: '#2c3e50',
              fontWeight: 500,
            }}
          >
            Your Games
          </Typography>

          <FormWrapper onSubmit={handleSubmit}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                backgroundColor: 'rgb(226, 232, 243, .7)',
                padding: '8px 16px',
                borderRadius: '4px',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
              }}
            >
              <FormControl size="small">
                <InputLabel>Game Name</InputLabel>
                <OutlinedInput
                  sx={{
                    width: '250px',
                    backgroundColor: 'white',
                    '& .MuiOutlinedInput-input': {
                      padding: '10px 14px',
                    },
                  }}
                  label="Game Name"
                  onChange={(event) => setGameName(event.target.value)}
                  type="text"
                  placeholder="Enter game name"
                  value={gameName}
                  required
                />
              </FormControl>
              <ButtonContained
                title="Create Game"
                type="submit"
                padding="5px"
              />
            </Box>
          </FormWrapper>
        </Box>

        {/* Games List */}
        {games.length > 0 ? (
          games.map((game: Game) => <GameAccordion key={game.id} game={game} />)
        ) : (
          <Typography
            variant="body1"
            sx={{
              textAlign: 'center',
              color: '#666',
              fontStyle: 'italic',
              mt: 4,
            }}
          >
            No games created yet. Create your first game to get started!
          </Typography>
        )}
      </GlobalCard>
    </div>
  );
};

export default UserDashboard;
