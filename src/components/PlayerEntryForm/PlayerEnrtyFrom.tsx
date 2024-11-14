import React, { useState } from 'react';
import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  OutlinedInput,
  Select,
  MenuItem,
  Container,
  SelectChangeEvent,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../redux/store';
import { createPlayer } from '../../redux/reducers/player.reducer';
import GlobalCard from '../../global/components/GlobalCard';
import ButtonContained from '../../global/components/ButtonContained';

const steps = ['Basic Info', 'Stats'];

interface PlayerInfo {
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
  game_id: string; // Changed from game to game_id
}

interface PlayerStats {
  strength: string;
  strength_save: string;
  dexterity: string;
  dexterity_save: string;
  constitution: string;
  constitution_save: string;
  intelligence: string;
  intelligence_save: string;
  wisdom: string;
  wisdom_save: string;
  charisma: string;
  charisma_save: string;
}

const PlayerEntryForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const games = useSelector((state: RootState) => state.game.games);
  const [activeStep, setActiveStep] = useState(0);

  const [playerInfo, setPlayerInfo] = useState<PlayerInfo>({
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
    game_id: '', // Changed from game to game_id
  });

  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    strength: '',
    strength_save: '',
    dexterity: '',
    dexterity_save: '',
    constitution: '',
    constitution_save: '',
    intelligence: '',
    intelligence_save: '',
    wisdom: '',
    wisdom_save: '',
    charisma: '',
    charisma_save: '',
  });

  const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPlayerInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStatsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPlayerStats((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Fixed the type for handleGameChange
  const handleGameChange = (event: SelectChangeEvent<string>) => {
    setPlayerInfo((prev) => ({
      ...prev,
      game_id: event.target.value,
    }));
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {
    // Convert string values to numbers where needed
    const playerData = {
      ...playerInfo,
      ...playerStats,
      level: parseInt(playerInfo.level),
      current_hp: parseInt(playerInfo.current_hp),
      total_hp: parseInt(playerInfo.total_hp),
      armor_class: parseInt(playerInfo.armor_class),
      speed: parseInt(playerInfo.speed),
      initiative_bonus: parseInt(playerInfo.initiative_bonus),
      strength: parseInt(playerStats.strength),
      strength_save: parseInt(playerStats.strength_save),
      dexterity: parseInt(playerStats.dexterity),
      dexterity_save: parseInt(playerStats.dexterity_save),
      constitution: parseInt(playerStats.constitution),
      constitution_save: parseInt(playerStats.constitution_save),
      intelligence: parseInt(playerStats.intelligence),
      intelligence_save: parseInt(playerStats.intelligence_save),
      wisdom: parseInt(playerStats.wisdom),
      wisdom_save: parseInt(playerStats.wisdom_save),
      charisma: parseInt(playerStats.charisma),
      charisma_save: parseInt(playerStats.charisma_save),
      game_id: parseInt(playerInfo.game_id),
      displayed: false,
    };

    try {
      await dispatch(createPlayer(playerData)).unwrap();
      navigate('/success');
    } catch (error) {
      console.error('Failed to create player:', error);
    }
  };

  const renderBasicInfo = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <FormControl>
        <InputLabel>Player Name</InputLabel>
        <OutlinedInput
          name="name"
          label="Player Name"
          value={playerInfo.name}
          onChange={handleInfoChange}
          required
        />
      </FormControl>

      <FormControl>
        <InputLabel>Character Name</InputLabel>
        <OutlinedInput
          name="character"
          label="Character Name"
          value={playerInfo.character}
          onChange={handleInfoChange}
          required
        />
      </FormControl>

      <FormControl>
        <InputLabel>Character Class</InputLabel>
        <OutlinedInput
          name="class"
          label="Character Class"
          value={playerInfo.class}
          onChange={handleInfoChange}
          required
        />
      </FormControl>

      <FormControl>
        <InputLabel>Image URL</InputLabel>
        <OutlinedInput
          name="image"
          label="Image URL"
          value={playerInfo.image}
          onChange={handleInfoChange}
        />
      </FormControl>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
        {[
          { name: 'level', label: 'Level' },
          { name: 'current_hp', label: 'Current HP' },
          { name: 'total_hp', label: 'Total HP' },
          { name: 'armor_class', label: 'Armor Class' },
          { name: 'speed', label: 'Speed' },
          { name: 'initiative_bonus', label: 'Initiative Bonus' },
        ].map((field) => (
          <FormControl key={field.name}>
            <InputLabel>{field.label}</InputLabel>
            <OutlinedInput
              name={field.name}
              type="number"
              label={field.label}
              value={playerInfo[field.name as keyof PlayerInfo]}
              onChange={handleInfoChange}
              required
            />
          </FormControl>
        ))}
      </Box>

      <FormControl>
        <InputLabel>Select Game</InputLabel>
        <Select
          value={playerInfo.game_id}
          onChange={handleGameChange}
          label="Select Game"
        >
          {games.map((game) => (
            <MenuItem key={game.id} value={game.id.toString()}>
              {game.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );

  const renderStats = () => (
    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
      {[
        'strength',
        'dexterity',
        'constitution',
        'intelligence',
        'wisdom',
        'charisma',
      ].map((stat) => (
        <Box
          key={stat}
          sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}
        >
          <FormControl>
            <InputLabel>
              {stat.charAt(0).toUpperCase() + stat.slice(1)}
            </InputLabel>
            <OutlinedInput
              name={stat}
              type="number"
              label={stat.charAt(0).toUpperCase() + stat.slice(1)}
              value={playerStats[stat as keyof PlayerStats]}
              onChange={handleStatsChange}
              required
            />
          </FormControl>

          <FormControl>
            <InputLabel>{stat} Save</InputLabel>
            <OutlinedInput
              name={`${stat}_save`}
              type="number"
              label={`${stat} Save`}
              value={playerStats[`${stat}_save` as keyof PlayerStats]}
              onChange={handleStatsChange}
              required
            />
          </FormControl>
        </Box>
      ))}
    </Box>
  );

  return (
    <Container maxWidth="md">
      <GlobalCard
        style={{
          padding: '2rem',
          backgroundColor: 'rgb(226, 232, 243, .9)',
          marginTop: '2rem',
        }}
      >
        <Typography variant="h5" component="h2" sx={{ mb: 4 }}>
          Create New Character
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep === 0 ? renderBasicInfo() : renderStats()}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <ButtonContained
            title="Back"
            onClick={handleBack}
            disabled={activeStep === 0}
          />
          {activeStep === steps.length - 1 ? (
            <ButtonContained title="Submit" onClick={handleSubmit} />
          ) : (
            <ButtonContained title="Next" onClick={handleNext} />
          )}
        </Box>
      </GlobalCard>
    </Container>
  );
};

export default PlayerEntryForm;
