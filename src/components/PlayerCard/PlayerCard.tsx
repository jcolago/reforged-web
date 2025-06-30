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
      {/* Player Basic Info */}
      <Box sx={{ mb: 2, textAlign: 'center' }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ fontWeight: 'bold', color: '#2c3e50' }}
        >
          {player.character}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
          Player: {player.name}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-around',
            backgroundColor: 'rgba(128, 150, 191, 0.3)',
            padding: 1,
            borderRadius: 1,
          }}
        >
          <Typography variant="body2" fontWeight="bold">
            AC: {player.armor_class}
          </Typography>
          <Typography variant="body2" fontWeight="bold">
            Initiative: +{player.initiative_bonus}
          </Typography>
          <Typography variant="body2" fontWeight="bold">
            Level: {player.level}
          </Typography>
        </Box>
      </Box>

      {/* HP Management */}
      <Box
        sx={{
          mb: 2,
          backgroundColor: 'rgba(255, 255, 255, 0.6)',
          padding: 2,
          borderRadius: 1,
        }}
      >
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
          Hit Points
        </Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
          }}
        >
          <input
            type="number"
            name="newHp"
            value={formValues.newHp}
            onChange={handleHpUpdate}
            style={{
              width: '70px',
              height: '40px',
              padding: '8px',
              border: '2px solid #3f51b5',
              borderRadius: '4px',
              textAlign: 'center',
              fontSize: '16px',
              fontWeight: 'bold',
            }}
          />
          <Typography variant="h6" fontWeight="bold">
            / {player.total_hp}
          </Typography>
          <ButtonContained
            height="40px"
            onClick={handleHpUpdate}
            style={{ fontSize: '0.875rem', padding: '8px 12px' }}
          >
            Update
          </ButtonContained>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Conditions Section */}
      <Box
        sx={{
          mb: 2,
          flex: 1,
          backgroundColor: 'rgba(255, 255, 255, 0.6)',
          padding: 2,
          borderRadius: 1,
        }}
      >
        <Typography
          variant="subtitle1"
          gutterBottom
          fontWeight="bold"
          sx={{ textAlign: 'center' }}
        >
          Active Conditions
        </Typography>

        {playerConditionsWithNames.length > 0 ? (
          <Box sx={{ mb: 2, maxHeight: '200px', overflowY: 'auto' }}>
            {playerConditionsWithNames.map((condition) => (
              <Box key={condition.id} sx={{ mb: 1 }}>
                <ConditionItem condition={condition} />
              </Box>
            ))}
          </Box>
        ) : (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2, textAlign: 'center', fontStyle: 'italic' }}
          >
            No active conditions
          </Typography>
        )}

        {/* Add Condition */}
        <Typography variant="subtitle2" gutterBottom fontWeight="bold">
          Add New Condition:
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Typography variant="caption" sx={{ mb: 0.5 }}>
                Rounds
              </Typography>
              <input
                style={{
                  width: '70px',
                  height: '36px',
                  padding: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  textAlign: 'center',
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
                placeholder="0"
              />
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" sx={{ mb: 0.5, display: 'block' }}>
                Condition
              </Typography>
              <FormControl size="small" sx={{ width: '100%' }}>
                <Select
                  value={formValues.conditionId}
                  onChange={(e) =>
                    setFormValues((prev) => ({
                      ...prev,
                      conditionId: e.target.value,
                    }))
                  }
                  displayEmpty
                  sx={{ height: '36px' }}
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
          </Box>

          <ButtonContained
            height="36px"
            onClick={handleConditionAdd}
            disabled={!formValues.conditionId || !formValues.conditionLength}
            style={{ fontSize: '0.875rem', width: '100%' }}
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
            padding: '8px',
            fontSize: '0.875rem',
          }}
        >
          Remove from Game View
        </ButtonContained>
      </Box>
    </GlobalCard>
  );
};

export default PlayerCard;
