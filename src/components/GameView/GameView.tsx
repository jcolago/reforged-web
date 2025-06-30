import React from 'react';
import { useSelector } from 'react-redux';
import { Typography, Container, Grid, Box, Paper } from '@mui/material';
import { RootState } from '../../redux/store';
import { PlayerState } from '../../redux/reducers/player.reducer';
import PlayerCard from '../PlayerCard/PlayerCard';

const GameView: React.FC = () => {
  const players = useSelector((state: RootState) =>
    state.player.players.filter((player) => player.displayed)
  );

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Typography
          variant="h4"
          align="center"
          sx={{
            fontWeight: 'bold',
            color: '#2c3e50',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            mb: 4,
          }}
        >
          Game View
        </Typography>

        <Paper
          elevation={3}
          sx={{
            backgroundColor: 'rgb(128, 150, 191, .5)',
            p: 3,
            borderRadius: 2,
          }}
        >
          {players.length === 0 ? (
            <Box
              sx={{
                py: 8,
                textAlign: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: 1,
              }}
            >
              <Typography variant="h6" color="text.secondary">
                No characters are currently displayed.
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                Add characters using the "Display" button in the player list.
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={1}>
              {players.map((player: PlayerState) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={player.id}>
                  <PlayerCard player={player} />
                </Grid>
              ))}
            </Grid>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default GameView;
