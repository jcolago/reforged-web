// src/components/MonsterEntryForm/MonsterEntryForm.tsx

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  InputLabel, 
  FormControl,  
  Select,
  SelectChangeEvent, 
  MenuItem,
  OutlinedInput
} from '@mui/material';
import { AppDispatch, RootState } from '../../redux/store';
import { addMonster } from '../../redux/reducers/monster.reducer';
import GlobalCard from '../../global/components/GlobalCard';
import ButtonContained from '../../global/components/ButtonContained';
import FormWrapper from '../../global/components/FormWrapper';

// Import the enum from your monster reducer
import { MonsterSize, MonsterAlignment } from '../../redux/reducers/monster.reducer';

interface MonsterFormValues {
  name: string;
  size: MonsterSize;
  alignment: MonsterAlignment;
  armor_class: number;
  hit_points: number;
  speed: number;
  resistances: string;
  p_bonus: number;
  attacks: string;
  displayed: boolean;
  game_id: number;
}

interface Game {
  id: number;
  name: string;
}

const initialFormValues: MonsterFormValues = {
  name: '',
  size: MonsterSize.Medium, // Set a default value from enum
  alignment: MonsterAlignment.TrueNeutral, // Set a default value from enum
  armor_class: 0,
  hit_points: 0,
  speed: 0,
  resistances: '',
  p_bonus: 0,
  attacks: '',
  displayed: false,
  game_id: 0
};

const MonsterEntryForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const games = useSelector((state: RootState) => state.game.games);

  const [formValues, setFormValues] = useState<MonsterFormValues>(initialFormValues);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: name === 'armor_class' || name === 'hit_points' || 
              name === 'speed' || name === 'p_bonus' 
              ? Number(value) 
              : value
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: name === 'game_id' ? Number(value) : value
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    dispatch(addMonster(formValues));
    setFormValues(initialFormValues);
    navigate('/monstersuccess');
  };

  return (
    <GlobalCard 
      width="100%" 
      style={{
        border: "2px double black", 
        backgroundColor: "rgb(128, 150, 191, .5)"
      }}
    >
      <GlobalCard 
        style={{
          margin: "20px",
          padding: "5px",
          backgroundColor: "rgb(226, 232, 243, .7)"
        }}
      >
        <h2 style={{ textDecoration: "underline" }}>Enter Monster Info</h2>
        <FormWrapper onSubmit={handleSubmit}>
          <FormControl>
            <InputLabel htmlFor="name">Monster Name</InputLabel>
            <OutlinedInput
              required
              id="name"
              name="name"
              value={formValues.name}
              onChange={handleChange}
              label="Monster Name"
              style={{margin: "5px"}}
            />
          </FormControl>

          <FormControl style={{margin: "5px"}}>
            <InputLabel id="size-label">Size</InputLabel>
            <Select
              labelId="size-label"
              id="size"
              name="size"
              value={formValues.size}
              onChange={handleSelectChange}
              label="Size"
            >
              {Object.values(MonsterSize).map((size) => (
                <MenuItem key={size} value={size}>
                  {size.charAt(0).toUpperCase() + size.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl style={{margin: "5px"}}>
            <InputLabel id="alignment-label">Alignment</InputLabel>
            <Select
              labelId="alignment-label"
              id="alignment"
              name="alignment"
              value={formValues.alignment}
              onChange={handleSelectChange}
              label="Alignment"
            >
              {Object.values(MonsterAlignment).map((alignment) => (
                <MenuItem key={alignment} value={alignment}>
                  {alignment.split('_').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl style={{margin: "5px"}}>
            <InputLabel htmlFor="game_id">Select a Game</InputLabel>
            <Select
              value={formValues.game_id.toString()}
              onChange={handleSelectChange}
              label="Select a Game"
              name="game_id"
              id="game_id"
            >
              <MenuItem value="" disabled>Please select a game name</MenuItem>
              {games.map((game: Game) => (
                <MenuItem value={game.id.toString()} key={game.id}>
                  {game.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Add number input fields */}
          {['armor_class', 'hit_points', 'speed', 'p_bonus'].map((field) => (
            <FormControl key={field} style={{margin: "5px"}}>
              <InputLabel htmlFor={field}>
                {field.split('_').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
              </InputLabel>
              <OutlinedInput
                required
                id={field}
                name={field}
                type="number"
                value={formValues[field as keyof MonsterFormValues]}
                onChange={handleChange}
                label={field.split('_').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
              />
            </FormControl>
          ))}

          {/* Text fields for resistances and attacks */}
          {['resistances', 'attacks'].map((field) => (
            <FormControl key={field} style={{margin: "5px"}}>
              <InputLabel htmlFor={field}>
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </InputLabel>
              <OutlinedInput
                id={field}
                name={field}
                value={formValues[field as keyof MonsterFormValues]}
                onChange={handleChange}
                label={field.charAt(0).toUpperCase() + field.slice(1)}
                multiline
                rows={2}
              />
            </FormControl>
          ))}

          <ButtonContained 
            type="submit"
            marginTop="22px"
            marginLeft="935px"
          >
            Submit
          </ButtonContained>
        </FormWrapper>
      </GlobalCard>
    </GlobalCard>
  );
};

export default MonsterEntryForm;