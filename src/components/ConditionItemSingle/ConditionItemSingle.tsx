// src/components/ConditionItemSingle/ConditionItemSingle.tsx

import React, { useEffect, useState } from 'react';
import { Typography, Box, IconButton } from '@mui/material';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import { AppDispatch } from '../../redux/store';
import {
  PlayerCondition,
  deletePlayerCondition,
  updatePlayerCondition,
} from '../../redux/reducers/player_condition.reducer';

interface ConditionItemSingleProps {
  condition: PlayerCondition;
}

const ConditionItemSingle: React.FC<ConditionItemSingleProps> = ({
  condition,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [newLength, setNewLength] = useState<string>('');

  useEffect(() => {
    setNewLength(condition.condition_length.toString());
  }, [condition]);

  const handleDelete = () => {
    Swal.fire({
      title: 'Remove condition?',
      text: `Remove ${condition.condition?.name} from character?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, remove it!',
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deletePlayerCondition(condition.id));
        Swal.fire('Removed!', 'The condition has been removed', 'success');
      }
    });
  };

  const handleUpdate = () => {
    dispatch(
      updatePlayerCondition({
        id: condition.id,
        condition_length: parseInt(newLength),
      })
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewLength(e.target.value);
  };

  const handleDecrement = () => {
    const newValue = Math.max(0, parseInt(newLength) - 1);
    setNewLength(newValue.toString());
    dispatch(
      updatePlayerCondition({
        id: condition.id,
        condition_length: newValue,
      })
    );
  };

  const handleIncrement = () => {
    const newValue = parseInt(newLength) + 1;
    setNewLength(newValue.toString());
    dispatch(
      updatePlayerCondition({
        id: condition.id,
        condition_length: newValue,
      })
    );
  };

  if (!condition.condition?.name) {
    return null;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        padding: '8px',
        borderRadius: '4px',
        border: '1px solid #ddd',
        mb: 1,
      }}
    >
      <Box sx={{ flex: 1 }}>
        <Typography variant="body2" fontWeight="bold">
          {condition.condition.name}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {condition.condition_length} round
          {condition.condition_length !== 1 ? 's' : ''} remaining
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {/* Decrement Button */}
        <IconButton
          size="small"
          onClick={handleDecrement}
          sx={{
            width: 24,
            height: 24,
            backgroundColor: '#f0f0f0',
            '&:hover': { backgroundColor: '#e0e0e0' },
          }}
        >
          <Typography variant="body2">-</Typography>
        </IconButton>

        {/* Duration Input */}
        <input
          type="number"
          value={newLength}
          onChange={handleChange}
          onBlur={handleUpdate}
          style={{
            width: '40px',
            height: '24px',
            padding: '2px 4px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            textAlign: 'center',
            fontSize: '12px',
          }}
        />

        {/* Increment Button */}
        <IconButton
          size="small"
          onClick={handleIncrement}
          sx={{
            width: 24,
            height: 24,
            backgroundColor: '#f0f0f0',
            '&:hover': { backgroundColor: '#e0e0e0' },
          }}
        >
          <Typography variant="body2">+</Typography>
        </IconButton>

        {/* Delete Button */}
        <IconButton
          size="small"
          onClick={handleDelete}
          sx={{
            width: 24,
            height: 24,
            backgroundColor: '#ffebee',
            color: '#d32f2f',
            '&:hover': { backgroundColor: '#ffcdd2' },
          }}
        >
          <Typography variant="body2">×</Typography>
        </IconButton>
      </Box>
    </Box>
  );
};

export default ConditionItemSingle;
