// src/components/PlayerEntryModal/PlayerEntryModal.tsx
import React, { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  OutlinedInput,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import {
  createPlayer,
  convertToPlayerState,
} from '../../redux/reducers/player.reducer';
import ButtonContained from '../../global/components/ButtonContained';

interface PlayerEntryModalProps {
  open: boolean;
  onClose: () => void;
  gameId: number;
}

const steps = ['Basic Info', 'Stats'];

const PlayerEntryModal: React.FC<PlayerEntryModalProps> = ({
  open,
  onClose,
  gameId,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [activeStep, setActiveStep] = useState(0);
  const [playerInfo, setPlayerInfo] = useState({
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
    game: gameId.toString(),
  });

  const [playerStats, setPlayerStats] = useState({
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

  const resetStats = {
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
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {
    const playerData = convertToPlayerState(playerInfo, playerStats);
    try {
      await dispatch(createPlayer(playerData)).unwrap();
      onClose();
      // Reset form
      setPlayerInfo({
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
        game: gameId.toString(),
      });
      setPlayerStats(resetStats);
      setActiveStep(0);
    } catch (error) {
      console.error('Failed to create player:', error);
    }
  };

  const handleClose = () => {
    onClose();
    setActiveStep(0);
    // Reset form states when closing
    setPlayerInfo({
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
      game: gameId.toString(),
    });
    setPlayerStats(resetStats);
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
        <FormControl>
          <InputLabel>Level</InputLabel>
          <OutlinedInput
            name="level"
            type="number"
            label="Level"
            value={playerInfo.level}
            onChange={handleInfoChange}
            required
          />
        </FormControl>

        <FormControl>
          <InputLabel>Current HP</InputLabel>
          <OutlinedInput
            name="current_hp"
            type="number"
            label="Current HP"
            value={playerInfo.current_hp}
            onChange={handleInfoChange}
            required
          />
        </FormControl>

        <FormControl>
          <InputLabel>Total HP</InputLabel>
          <OutlinedInput
            name="total_hp"
            type="number"
            label="Total HP"
            value={playerInfo.total_hp}
            onChange={handleInfoChange}
            required
          />
        </FormControl>

        <FormControl>
          <InputLabel>Armor Class</InputLabel>
          <OutlinedInput
            name="armor_class"
            type="number"
            label="Armor Class"
            value={playerInfo.armor_class}
            onChange={handleInfoChange}
            required
          />
        </FormControl>

        <FormControl>
          <InputLabel>Speed</InputLabel>
          <OutlinedInput
            name="speed"
            type="number"
            label="Speed"
            value={playerInfo.speed}
            onChange={handleInfoChange}
            required
          />
        </FormControl>

        <FormControl>
          <InputLabel>Initiative Bonus</InputLabel>
          <OutlinedInput
            name="initiative_bonus"
            type="number"
            label="Initiative Bonus"
            value={playerInfo.initiative_bonus}
            onChange={handleInfoChange}
            required
          />
        </FormControl>
      </Box>
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
              value={playerStats[stat as keyof typeof playerStats]}
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
              value={playerStats[`${stat}_save` as keyof typeof playerStats]}
              onChange={handleStatsChange}
              required
            />
          </FormControl>
        </Box>
      ))}
    </Box>
  );

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="player-entry-modal"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 800,
          maxHeight: '90vh',
          overflow: 'auto',
          bgcolor: 'rgb(226, 232, 243, .9)',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
          Add New Player
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep === 0 ? renderBasicInfo() : renderStats()}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
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
      </Box>
    </Modal>
  );
};

export default PlayerEntryModal;
