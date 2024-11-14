// src/components/PlayerCard/PlayerCard.tsx

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  CardMedia, 
  Typography, 
  FormControl, 
  InputLabel,
  Select,
  SelectChangeEvent,
  MenuItem
} from '@mui/material';
import { AppDispatch, RootState } from '../../redux/store';
import { PlayerState } from '../../redux/reducers/player.reducer';
import { 
  createPlayerCondition, 
  updatePlayerCondition 
} from '../../redux/reducers/player_condition.reducer';
import GlobalCard from '../../global/components/GlobalCard';
import ButtonContained from '../../global/components/ButtonContained';
import ConditionItem from '../ConditionItem/ConditionItem';

interface PlayerCardProps {
  player: PlayerState;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player }) => {
  const dispatch = useDispatch<AppDispatch>();
  
  // Get conditions from the condition reducer
  const conditions = useSelector((state: RootState) => 
    state.condition.conditions
  );
  
  // Get player conditions from player_condition reducer
  const playerConditions = useSelector((state: RootState) => 
    state.playerCondition.playerConditions.filter(
      pc => pc.player_id === player.id
    )
  );

  const [formValues, setFormValues] = useState({
    conditionLength: '',
    conditionId: '',
    newHp: player.current_hp.toString()
  });

  useEffect(() => {
    setFormValues(prev => ({
      ...prev,
      newHp: player.current_hp.toString()
    }));
  }, [player]);

  const handleConditionAdd = () => {
    if (!formValues.conditionId || !formValues.conditionLength) return;

    const conditionObj = {
      condition_length: Number(formValues.conditionLength),
      condition_id: Number(formValues.conditionId),
      player_id: player.id
    };

    dispatch(createPlayerCondition(conditionObj));
    setFormValues(prev => ({
      ...prev,
      conditionId: '',
      conditionLength: ''
    }));
  };

  const handleHpUpdate = () => {
    dispatch(updatePlayerCondition({
      id: player.id,
      condition_length: Number(formValues.newHp)
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    setFormValues(prev => ({
      ...prev,
      conditionId: e.target.value
    }));
  };

  return (
    <GlobalCard 
      style={{ 
        padding: "5px", 
        margin: "5px", 
        width: "23%", 
        backgroundColor: "rgb(226, 232, 243, .7)", 
        flexBasis: "25%"
      }}
    >
      <CardMedia style={{textAlign: "center"}}>
        <img 
          style={{width: "197px", height: "255px"}} 
          src={player.image}
          alt={`${player.character}'s portrait`}
        />
      </CardMedia>

      <Typography>Player Name: {player.name}</Typography>
      <Typography gutterBottom>Character Name: {player.character}</Typography>

      <Typography>
        Hit Points: 
        <FormControl>
          <InputLabel htmlFor="newHp">Current HP</InputLabel>
          <input
            type="number"
            name="newHp"
            value={formValues.newHp}
            onChange={handleInputChange}
            style={{ 
              maxHeight: "25px", 
              maxWidth: "50px"
            }}
          />
        </FormControl>
        / {player.total_hp}
        <ButtonContained
          height="25px"
          onClick={handleHpUpdate}
          marginLeft="5px"
        >
          Update
        </ButtonContained>
      </Typography>

      <Typography>Armor Class: {player.armor_class}</Typography>
      <Typography>Initiative bonus: {player.initiative_bonus}</Typography>
      
      <hr />

      {playerConditions.map(condition => (
        <ConditionItem 
          key={condition.id} 
          player={condition}
        />
      ))}

      <div style={{marginTop: "5px"}}>
        <FormControl>
          <InputLabel size="small" htmlFor="condition-length">
            Length
          </InputLabel>
          <input
            style={{width: "95px"}}
            type="number"
            name="conditionLength"
            value={formValues.conditionLength}
            onChange={handleInputChange}
            placeholder="Length"
          />
        </FormControl>

        <FormControl>
          <InputLabel id="condition-label" size="small">
            Condition
          </InputLabel>
          <Select
            labelId="condition-label"
            label="Condition"
            size="small"
            value={formValues.conditionId}
            onChange={handleSelectChange}
            style={{width: "200px", marginLeft: "5px"}}
          >
            <MenuItem disabled value="">
              Please select a condition
            </MenuItem>
            {conditions.map(condition => 
              condition.name !== "None" && (
                <MenuItem key={condition.id} value={condition.id}>
                  <Typography>{condition.name}</Typography>
                </MenuItem>
              )
            )}
          </Select>
        </FormControl>

        <ButtonContained
          height="25px"
          marginBottom="3px"
          marginTop="2px"
          onClick={handleConditionAdd}
        >
          Add Condition
        </ButtonContained>
      </div>

      <div style={{textAlign: "left"}}>
        <ButtonContained
          onClick={() => dispatch({ type: 'REMOVE_PLAYER', payload: player.id })}
          marginTop="5px"
        >
          Remove
        </ButtonContained>
      </div>
    </GlobalCard>
  );
};

export default PlayerCard;