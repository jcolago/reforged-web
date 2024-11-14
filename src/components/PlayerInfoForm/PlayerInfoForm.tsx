// src/components/PlayerInfo/PlayerInfo.tsx

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  CardHeader,
  OutlinedInput, 
  InputLabel, 
  FormControl, 
  Select,
  SelectChangeEvent,
  MenuItem
} from '@mui/material';
import { AppDispatch, RootState } from '../../redux/store';
import { setPlayerInfo } from '../../redux/reducers/player.reducer';
import GlobalCard from '../../global/components/GlobalCard';
import ButtonContained from '../../global/components/ButtonContained';
import FormWrapper from '../../global/components/FormWrapper';


interface PlayerInfoFormValues {
    name: string;
    character: string;
    class: string;
    image: string;
    level: string;
    current_hp: string;
    total_hp: string;
    armor_class: string;
    speed: string;
    initiative_bonus: string;
    game: string;
}

const initialFormState: PlayerInfoFormValues = {
    name: '',
    character: '',
    class: '',
    image: '',
    level: '',
    current_hp: '',
    total_hp: '',
    armor_class: '',
    speed: '',
    initiative_bonus: '',
    game: '',
};

const PlayerInfoForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const games = useSelector((state: RootState) => state.game.games);
  
  const [formValues, setFormValues] = useState<PlayerInfoFormValues>(initialFormState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    setFormValues(prev => ({
      ...prev,
      game_id: e.target.value
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    dispatch(setPlayerInfo(formValues));
    setFormValues(initialFormState);
    navigate('/stats');
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
          marginTop: "20px",
          marginBottom: "20px",
          backgroundColor: "rgb(226, 232, 243, .7)"
        }}
      >
        <CardHeader 
          style={{ textDecoration: "underline" }} 
          title="Enter Character Info Below" 
        />
        <FormWrapper onSubmit={handleSubmit}>
          {/* Basic Info Fields */}
          {[
            { name: 'player_name', label: 'Player Name' },
            { name: 'character_name', label: 'Character Name' },
            { name: 'character_img', label: 'Character Image', placeholder: 'Character Image URL' },
            { name: 'character_class', label: 'Character Class' }
          ].map((field) => (
            <FormControl key={field.name}>
              <InputLabel htmlFor={field.name}>{field.label}</InputLabel>
              <OutlinedInput
                required
                id={field.name}
                name={field.name}
                value={formValues[field.name as keyof PlayerInfoFormValues]}
                onChange={handleChange}
                label={field.label}
                placeholder={field.placeholder}
                style={{ margin: "5px" }}
              />
            </FormControl>
          ))}

          {/* Numeric Fields */}
          {[
            { name: 'character_level', label: 'Character Level' },
            { name: 'current_hp', label: 'Current Hit Points' },
            { name: 'total_hp', label: 'Total Hit Points' },
            { name: 'armor_class', label: 'Armor Class' },
            { name: 'speed', label: 'Speed' },
            { name: 'initiative_bonus', label: 'Initiative Bonus' }
          ].map((field) => (
            <FormControl key={field.name}>
              <InputLabel htmlFor={field.name}>{field.label}</InputLabel>
              <OutlinedInput
                required
                type="number"
                id={field.name}
                name={field.name}
                value={formValues[field.name as keyof PlayerInfoFormValues]}
                onChange={handleChange}
                label={field.label}
                style={{ margin: "5px" }}
              />
            </FormControl>
          ))}

          {/* Game Select */}
          <FormControl style={{ margin: "5px" }}>
            <InputLabel htmlFor="game_id">Please Select a Game</InputLabel>
            <Select
              value={formValues.game}
              onChange={handleSelectChange}
              label="Please Select a Game"
              name="game_id"
              id="game_id"
              style={{ width: "300px" }}
            >
              <MenuItem value="" disabled>Please select a game name</MenuItem>
              {games.map(game => (
                <MenuItem value={game.id.toString()} key={game.id}>
                  {game.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <ButtonContained 
            type="submit"
            marginTop="23px"
          >
            Submit
          </ButtonContained>
        </FormWrapper>
      </GlobalCard>
    </GlobalCard>
  );
};

export default PlayerInfoForm;