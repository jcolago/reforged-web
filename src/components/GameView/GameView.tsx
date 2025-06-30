import React from 'react';
import { useSelector } from 'react-redux';
import { Typography, Grid } from '@mui/material';
import { RootState } from '../../redux/store';
import { PlayerState } from '../../redux/reducers/player.reducer';
import PlayerCard from '../PlayerCard/PlayerCard';
import GlobalCard from '../../global/components/GlobalCard';

const GameView: React.FC = () => {
  const players = useSelector((state: RootState) =>
    state.player.players.filter((player) => player.displayed)
  );

  return (
    <div>
      <Typography
        variant="h4"
        style={{
          textAlign: 'center',
          textDecoration: 'underline',
          margin: '10px',
        }}
      >
        Game View
      </Typography>

      <GlobalCard
        width="95%"
        style={{
          border: '2px double black',
          backgroundColor: 'rgb(128, 150, 191, .5)',
          padding: '20px',
          margin: 'auto',
        }}
      >
        <Grid container spacing={3}>
          {players.map((player: PlayerState) => (
            <Grid item xs={12} md={6} key={player.id}>
              <PlayerCard player={player} />
            </Grid>
          ))}
        </Grid>
      </GlobalCard>
    </div>
  );
};

export default GameView;
