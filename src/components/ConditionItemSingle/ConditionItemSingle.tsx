import React from 'react';
import { Box, Typography, OutlinedInput } from '@mui/material';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import { AppDispatch } from '../../redux/store';
import {
  PlayerCondition,
  deletePlayerCondition,
  updatePlayerCondition,
} from '../../redux/reducers/player_condition.reducer';
import ButtonContained from '../../global/components/ButtonContained';

interface ConditionItemSingleProps {
  condition: PlayerCondition;
}

const ConditionItemSingle: React.FC<ConditionItemSingleProps> = ({
  condition,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [length, setLength] = React.useState(
    condition.condition_length.toString()
  );

  React.useEffect(() => {
    setLength(condition.condition_length.toString());
  }, [condition.condition_length]);

  const handleDelete = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This condition will be removed from the character',
      icon: 'warning',
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deletePlayerCondition(condition.id));
        Swal.fire('Deleted!', 'The condition has been removed', 'success');
      }
    });
  };

  const handleUpdate = () => {
    dispatch(
      updatePlayerCondition({
        id: condition.id,
        condition_length: parseInt(length),
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
        gap: 1,
        p: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.03)',
        borderRadius: 1,
      }}
    >
      <Typography sx={{ minWidth: '100px' }}>
        {condition.condition.name}:
      </Typography>

      <OutlinedInput
        type="number"
        value={length}
        onChange={(e) => setLength(e.target.value)}
        size="small"
        sx={{
          width: '70px',
          height: '32px',
        }}
      />

      <ButtonContained
        onClick={handleUpdate}
        style={{
          height: '32px',
          minWidth: '80px',
        }}
      >
        Update
      </ButtonContained>

      <ButtonContained
        onClick={handleDelete}
        style={{
          height: '32px',
          minWidth: '80px',
          backgroundColor: '#d32f2f',
        }}
        sx={{
          '&:hover': {
            backgroundColor: '#9a0007',
          },
        }}
      >
        Delete
      </ButtonContained>
    </Box>
  );
};

export default ConditionItemSingle;
