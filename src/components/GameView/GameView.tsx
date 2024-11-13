// src/components/GameView/GameView.tsx

import React from 'react';
import { useSelector } from 'react-redux';
import { Typography } from '@mui/material';
import { RootState } from '../../redux/store';
import { PlayerState } from '../../redux/reducers/player.reducer';
import PlayerCard from '../PlayerCard/PlayerCard';
import GlobalCard from '../../global/components/GlobalCard';

const GameView: React.FC = () => {
  const players = useSelector((state: RootState) => 
    state.player.players.filter(player => player.displayed)
  );

  return (
    <div>
      <Typography 
        variant="h4"
        style={{
          textAlign: "center", 
          textDecoration: "underline", 
          margin: "10px"
        }}
      >
        Game View
      </Typography>
      
      <GlobalCard
        width="80%"
        style={{
          border: "2px double black",
          backgroundColor: "rgb(128, 150, 191, .5)",
          padding: "20px",
          display: "flex",
          flexWrap: "wrap",
          flexDirection: "row",
          margin: "auto"
        }}
      >
        {players.map((player: PlayerState) => (
          <PlayerCard 
            key={player.id} 
            player={player}
          />
        ))}
      </GlobalCard>
    </div>
  );
};

export default GameView;