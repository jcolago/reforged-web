import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Divider,
} from '@mui/material';
import { AppDispatch, RootState } from '../../redux/store';
import { PlayerState, updatePlayer } from '../../redux/reducers/player.reducer';
import {
  createPlayerCondition,
  fetchPlayerConditions,
} from '../../redux/reducers/player_condition.reducer';
import { fetchConditions } from '../../redux/reducers/condition.reducer';
import ButtonContained from '../../global/components/ButtonContained';
import ConditionItem from '../ConditionItem/ConditionItem';
import GlobalCard from '../../global/components/GlobalCard';
import Swal from 'sweetalert2';

const PlayerCard: React.FC<{ player: PlayerState }> = ({ player }) => {
  const dispatch = useDispatch<AppDispatch>();
  const conditions = useSelector(
    (state: RootState) => state.condition.conditions
  );

  const playerConditionsWithNames = useSelector((state: RootState) =>
    state.playerCondition.playerConditions
      .filter((pc) => pc.player_id === player.id)
      .map((pc) => ({
        ...pc,
        condition: state.condition.conditions.find(
          (c) => c.id === pc.condition_id
        ),
      }))
  );

  useEffect(() => {
    console.log('Player Conditions:', playerConditionsWithNames);
  }, [playerConditionsWithNames]);

  const [formValues, setFormValues] = useState({
    conditionLength: '',
    conditionId: '',
    newHp: player.current_hp.toString(),
  });

  useEffect(() => {
    dispatch(fetchPlayerConditions());
    dispatch(fetchConditions());
  }, [dispatch]);

  useEffect(() => {
    setFormValues((prev) => ({
      ...prev,
      newHp: player.current_hp.toString(),
      // Revisit this, might not need to be a string
    }));
  }, [player.current_hp]);

  const handleHpUpdate = async () => {
    try {
      await dispatch(
        updatePlayer({
          id: player.id,
          playerData: { current_hp: parseInt(formValues.newHp) },
        })
      ).unwrap();

      Swal.fire({
        icon: 'success',
        title: 'HP Updated',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
      });
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Failed to update HP',
        text: 'Please try again',
      });
    }
  };

  const handleConditionAdd = async () => {
    if (!formValues.conditionId || !formValues.conditionLength) return;

    try {
      await dispatch(
        createPlayerCondition({
          condition_length: parseInt(formValues.conditionLength),
          condition_id: parseInt(formValues.conditionId),
          player_id: player.id,
        })
      ).unwrap();

      setFormValues((prev) => ({
        ...prev,
        conditionId: '',
        conditionLength: '',
      }));

      Swal.fire({
        icon: 'success',
        title: 'Condition Added',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
      });
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Failed to add condition',
        text: 'Please try again',
      });
    }
  };

  const handleRemove = async () => {
    try {
      await dispatch(
        updatePlayer({
          id: player.id,
          playerData: { displayed: false },
        })
      ).unwrap();
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Failed to remove from view',
        text: 'Please try again',
      });
    }
  };

  return (
    <GlobalCard
      style={{
        padding: '15px',
        backgroundColor: 'rgb(226, 232, 243, .7)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Player Image and Basic Info */}

      <Box sx={{ flex: 1 }}>
        <Typography variant="h6" gutterBottom>
          {player.character}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Player: {player.name}
        </Typography>
        <Typography variant="body2">
          AC: {player.armor_class} | Initiative: +{player.initiative_bonus}
        </Typography>
      </Box>

      {/* HP Management */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="body1" sx={{ mb: 1 }}>
          Hit Points:
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <input
            type="number"
            name="newHp"
            value={formValues.newHp}
            onChange={handleHpUpdate}
            style={{
              width: '60px',
              height: '32px',
              padding: '4px 8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
          <Typography>/ {player.total_hp}</Typography>
          <ButtonContained
            height="32px"
            onClick={handleHpUpdate}
            style={{ fontSize: '0.75rem', padding: '4px 8px' }}
          >
            Update
          </ButtonContained>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Conditions Section */}
      <Box sx={{ mb: 2, flex: 1 }}>
        <Typography variant="h6" gutterBottom>
          Active Conditions
        </Typography>

        {playerConditionsWithNames.length > 0 ? (
          <Box sx={{ mb: 2 }}>
            {playerConditionsWithNames.map((condition) => (
              <Box key={condition.id} sx={{ mb: 1 }}>
                <ConditionItem condition={condition} />
              </Box>
            ))}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            No active conditions
          </Typography>
        )}

        {/* Add Condition */}
        <Typography variant="subtitle2" gutterBottom>
          Add Condition:
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <input
              style={{
                width: '60px',
                height: '32px',
                padding: '4px 8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
              type="number"
              name="conditionLength"
              value={formValues.conditionLength}
              onChange={(e) =>
                setFormValues((prev) => ({
                  ...prev,
                  conditionLength: e.target.value,
                }))
              }
              placeholder="Rounds"
            />

            <FormControl size="small" sx={{ flex: 1 }}>
              <Select
                value={formValues.conditionId}
                onChange={(e) =>
                  setFormValues((prev) => ({
                    ...prev,
                    conditionId: e.target.value,
                  }))
                }
                displayEmpty
                sx={{ height: '32px' }}
              >
                <MenuItem value="" disabled>
                  Select condition
                </MenuItem>
                {conditions.map(
                  (condition) =>
                    condition.name !== 'None' && (
                      <MenuItem key={condition.id} value={condition.id}>
                        {condition.name}
                      </MenuItem>
                    )
                )}
              </Select>
            </FormControl>
          </Box>

          <ButtonContained
            height="32px"
            onClick={handleConditionAdd}
            disabled={!formValues.conditionId || !formValues.conditionLength}
            style={{ fontSize: '0.75rem' }}
          >
            Add Condition
          </ButtonContained>
        </Box>
      </Box>

      {/* Remove Button */}
      <Box sx={{ mt: 'auto' }}>
        <ButtonContained
          onClick={handleRemove}
          style={{
            width: '100%',
            backgroundColor: '#f44336',
            color: 'white',
          }}
        >
          Remove from Game View
        </ButtonContained>
      </Box>
    </GlobalCard>
  );
};

export default PlayerCard;
