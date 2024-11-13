// src/components/ConditionItemSingle/ConditionItemSingle.tsx

import React, { useEffect, useState } from 'react';
import { Typography, OutlinedInput, FormControl } from '@mui/material';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import { AppDispatch } from '../../redux/store';
import { 
  PlayerCondition, 
  deletePlayerCondition,
  updatePlayerCondition 
} from '../../redux/reducers/player_condition.reducer';
import ButtonContained from '../../global/components/ButtonContained';

interface ConditionItemSingleProps {
  condition: PlayerCondition;
}

const ConditionItemSingle: React.FC<ConditionItemSingleProps> = ({ condition }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [newLength, setNewLength] = useState<string>('');

  useEffect(() => {
    setNewLength(condition.condition_length.toString());
  }, [condition]);

  const handleDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "This condition will be removed from the character",
      icon: 'warning',
      showCancelButton: true
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Deleted!',
          'The condition has been removed',
          'success'
        );
        dispatch(deletePlayerCondition(condition.id));
      }
    });
  };

  const handleUpdate = () => {
    dispatch(updatePlayerCondition({
      id: condition.id,
      condition_length: parseInt(newLength)
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewLength(e.target.value);
  };

  if (!condition.condition?.name) {
    return null;
  }

  return (
    <div>
      <FormControl>
        <Typography>
          Condition: {condition.condition.name}
        </Typography>
        <Typography>
          Duration: {' '}
          <OutlinedInput
            type="number"
            value={newLength}
            onChange={handleChange}
            style={{ 
              maxHeight: "25px", 
              maxWidth: "40px"
            }}
          />
          <ButtonContained
            onClick={handleUpdate}
            height="25px"
            marginLeft="5px"
            marginBottom="3px"
          >
            Update
          </ButtonContained>
          <ButtonContained
            onClick={handleDelete}
            height="25px"
            backgroundColor="red"
            color="white"
            marginLeft="5px" 
            marginBottom="3px"
          >
            Delete
          </ButtonContained>
        </Typography>
      </FormControl>
    </div>
  );
};

export default ConditionItemSingle;