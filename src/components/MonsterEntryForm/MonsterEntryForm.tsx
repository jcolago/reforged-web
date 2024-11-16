import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  InputLabel,
  FormControl,
  Select,
  SelectChangeEvent,
  MenuItem,
  OutlinedInput,
  Container,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { AppDispatch, RootState } from '../../redux/store';
import {
  addMonster,
  MonsterSize,
  MonsterAlignment,
} from '../../redux/reducers/monster.reducer';
import GlobalCard from '../../global/components/GlobalCard';
import ButtonContained from '../../global/components/ButtonContained';

const steps = ['Basic Info', 'Combat Stats'];

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

const initialFormValues: MonsterFormValues = {
  name: '',
  size: MonsterSize.Medium,
  alignment: MonsterAlignment.TrueNeutral,
  armor_class: 0,
  hit_points: 0,
  speed: 0,
  resistances: '',
  p_bonus: 0,
  attacks: '',
  displayed: false,
  game_id: 0,
};

const MonsterEntryForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const games = useSelector((state: RootState) => state.game.games);
  const [activeStep, setActiveStep] = useState(0);
  const [formValues, setFormValues] =
    useState<MonsterFormValues>(initialFormValues);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]:
        name === 'armor_class' ||
        name === 'hit_points' ||
        name === 'speed' ||
        name === 'p_bonus'
          ? Number(value)
          : value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: name === 'game_id' ? Number(value) : value,
    }));
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {
    try {
      await dispatch(addMonster(formValues)).unwrap();
      navigate('/monsters');
    } catch (error) {
      console.error('Failed to create monster:', error);
    }
  };

  const renderBasicInfo = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <FormControl>
        <InputLabel>Monster Name</InputLabel>
        <OutlinedInput
          name="name"
          label="Monster Name"
          value={formValues.name}
          onChange={handleChange}
          required
        />
      </FormControl>

      <FormControl>
        <InputLabel>Size</InputLabel>
        <Select
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

      <FormControl>
        <InputLabel>Alignment</InputLabel>
        <Select
          name="alignment"
          value={formValues.alignment}
          onChange={handleSelectChange}
          label="Alignment"
        >
          {Object.values(MonsterAlignment).map((alignment) => (
            <MenuItem key={alignment} value={alignment}>
              {alignment
                .split('_')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl>
        <InputLabel>Select Game</InputLabel>
        <Select
          value={formValues.game_id.toString()}
          onChange={handleSelectChange}
          name="game_id"
          label="Select Game"
        >
          <MenuItem value="0" disabled>
            Please select a game
          </MenuItem>
          {games.map((game) => (
            <MenuItem key={game.id} value={game.id.toString()}>
              {game.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );

  const renderCombatStats = () => (
    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
      <FormControl>
        <InputLabel>Armor Class</InputLabel>
        <OutlinedInput
          name="armor_class"
          type="number"
          label="Armor Class"
          value={formValues.armor_class}
          onChange={handleChange}
          required
        />
      </FormControl>

      <FormControl>
        <InputLabel>Hit Points</InputLabel>
        <OutlinedInput
          name="hit_points"
          type="number"
          label="Hit Points"
          value={formValues.hit_points}
          onChange={handleChange}
          required
        />
      </FormControl>

      <FormControl>
        <InputLabel>Speed</InputLabel>
        <OutlinedInput
          name="speed"
          type="number"
          label="Speed"
          value={formValues.speed}
          onChange={handleChange}
          required
        />
      </FormControl>

      <FormControl>
        <InputLabel>Proficiency Bonus</InputLabel>
        <OutlinedInput
          name="p_bonus"
          type="number"
          label="Proficiency Bonus"
          value={formValues.p_bonus}
          onChange={handleChange}
          required
        />
      </FormControl>

      <FormControl sx={{ gridColumn: 'span 2' }}>
        <InputLabel>Resistances</InputLabel>
        <OutlinedInput
          name="resistances"
          value={formValues.resistances}
          onChange={handleChange}
          label="Resistances"
          multiline
          rows={3}
        />
      </FormControl>

      <FormControl sx={{ gridColumn: 'span 2' }}>
        <InputLabel>Attacks</InputLabel>
        <OutlinedInput
          name="attacks"
          value={formValues.attacks}
          onChange={handleChange}
          label="Attacks"
          multiline
          rows={3}
        />
      </FormControl>
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
          Create New Monster
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep === 0 ? renderBasicInfo() : renderCombatStats()}

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

export default MonsterEntryForm;
