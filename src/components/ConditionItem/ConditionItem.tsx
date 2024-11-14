import React from 'react';
import { Box, Typography } from '@mui/material';
import { PlayerCondition } from '../../redux/reducers/player_condition.reducer';

interface ConditionItemProps {
  condition: PlayerCondition;
}

const ConditionItem: React.FC<ConditionItemProps> = ({ condition }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        p: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.03)',
        borderRadius: 1,
      }}
    >
      <Typography flex={1}>{condition.condition?.name}</Typography>
      <Typography>Duration: {condition.condition_length}</Typography>
    </Box>
  );
};

export default ConditionItem;
