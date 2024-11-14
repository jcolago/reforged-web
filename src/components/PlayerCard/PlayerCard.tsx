import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  FormControl,
  OutlinedInput,
  Select,
  MenuItem,
  Divider,
  Stack,
  Grid,
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
import Swal from 'sweetalert2';

const PlayerCard: React.FC<{ player: PlayerState }> = ({ player }) => {
  const dispatch = useDispatch<AppDispatch>();
  const conditions = useSelector(
    (state: RootState) => state.condition.conditions
  );
  //   const playerConditions = useSelector((state: RootState) =>
  //     state.playerCondition.playerConditions.filter(
  //       (pc) => pc.player_id === player.id
  //     )
  //   );

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
    <Paper
      elevation={3}
      sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      {/* Character Header */}
      <Box sx={{ p: 2, backgroundColor: 'rgba(44, 62, 80, 0.05)' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
          {player.character}
        </Typography>
        <Typography variant="subtitle2" color="text.secondary">
          {player.name} • Level {player.level} {player.character_class}
        </Typography>
      </Box>

      {/* Character Image */}
      <Box
        sx={{
          width: '100%',
          pt: '100%',
          position: 'relative',
          backgroundColor: 'rgba(0, 0, 0, 0.03)',
        }}
      >
        <img
          src={player.image}
          alt={`${player.character}'s portrait`}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </Box>

      {/* Stats Section */}
      <Box sx={{ p: 2 }}>
        {/* HP Management */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Hit Points
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <OutlinedInput
              type="number"
              value={formValues.newHp}
              onChange={(e) =>
                setFormValues((prev) => ({ ...prev, newHp: e.target.value }))
              }
              size="small"
              sx={{ width: '80px' }}
            />
            <Typography>/ {player.total_hp}</Typography>
            <ButtonContained
              onClick={handleHpUpdate}
              style={{ marginLeft: 'auto' }}
            >
              Update
            </ButtonContained>
          </Box>
        </Box>

        {/* Basic Stats */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Armor Class
            </Typography>
            <Typography variant="body1">{player.armor_class}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Initiative
            </Typography>
            <Typography variant="body1">+{player.initiative_bonus}</Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Conditions Section */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Active Conditions
          </Typography>

          <Stack spacing={1} sx={{ mb: 2 }}>
            {playerConditionsWithNames.length > 0 ? (
              playerConditionsWithNames.map((condition) => (
                <ConditionItem key={condition.id} condition={condition} />
              ))
            ) : (
              <Typography color="text.secondary" variant="body2">
                No active conditions
              </Typography>
            )}
          </Stack>
        </Box>

        {/* Add Condition */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <OutlinedInput
            type="number"
            placeholder="Duration"
            size="small"
            value={formValues.conditionLength}
            onChange={(e) =>
              setFormValues((prev) => ({
                ...prev,
                conditionLength: e.target.value,
              }))
            }
            sx={{ width: '100px' }}
          />
          <FormControl sx={{ flexGrow: 1 }}>
            <Select
              value={formValues.conditionId}
              onChange={(e) =>
                setFormValues((prev) => ({
                  ...prev,
                  conditionId: e.target.value,
                }))
              }
              size="small"
              displayEmpty
            >
              <MenuItem value="" disabled>
                Select Condition
              </MenuItem>
              {conditions
                .filter((condition) => condition.name !== 'None')
                .map((condition) => (
                  <MenuItem key={condition.id} value={condition.id}>
                    {condition.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Box>
        <ButtonContained
          onClick={handleConditionAdd}
          style={{ width: '100%', marginBottom: '8px' }}
        >
          Add Condition
        </ButtonContained>

        {/* Remove from View */}
        <ButtonContained
          onClick={handleRemove}
          style={{
            width: '100%',
            backgroundColor: '#d32f2f',
          }}
          sx={{
            '&:hover': {
              backgroundColor: '#9a0007',
            },
          }}
        >
          Remove from View
        </ButtonContained>
      </Box>
    </Paper>
  );
};

export default PlayerCard;
