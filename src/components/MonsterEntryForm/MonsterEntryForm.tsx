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
  Grid,
  Paper,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import Swal from 'sweetalert2';
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
      // Show success message
      Swal.fire({
        title: 'Success!',
        text: 'Monster has been created',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        // Navigate to monster list after success message
        navigate('/monsters');
      });
    } catch {
      Swal.fire({
        title: 'Error!',
        text: 'Failed to create monster',
        icon: 'error',
      });
    }
  };
  const renderBasicInfo = () => (
    <Paper
      elevation={3}
      sx={{ p: 3, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Monster Name</InputLabel>
            <OutlinedInput
              required
              name="name"
              value={formValues.name}
              onChange={handleChange}
              label="Monster Name"
            />
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
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
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
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
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth>
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
        </Grid>
      </Grid>
    </Paper>
  );

  const renderCombatStats = () => (
    <Paper
      elevation={3}
      sx={{ p: 3, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Armor Class</InputLabel>
            <OutlinedInput
              required
              name="armor_class"
              type="number"
              value={formValues.armor_class}
              onChange={handleChange}
              label="Armor Class"
            />
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Hit Points</InputLabel>
            <OutlinedInput
              required
              name="hit_points"
              type="number"
              value={formValues.hit_points}
              onChange={handleChange}
              label="Hit Points"
            />
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Speed</InputLabel>
            <OutlinedInput
              required
              name="speed"
              type="number"
              value={formValues.speed}
              onChange={handleChange}
              label="Speed"
            />
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Proficiency Bonus</InputLabel>
            <OutlinedInput
              required
              name="p_bonus"
              type="number"
              value={formValues.p_bonus}
              onChange={handleChange}
              label="Proficiency Bonus"
            />
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth>
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
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth>
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
        </Grid>
      </Grid>
    </Paper>
  );

  return (
    <Container maxWidth="lg">
      <GlobalCard
        style={{
          padding: '2rem',
          backgroundColor: 'rgb(226, 232, 243, .9)',
          marginTop: '2rem',
        }}
      >
        <Typography
          variant="h4"
          align="center"
          sx={{
            fontWeight: 'bold',
            color: '#2c3e50',
            mb: 4,
          }}
        >
          Create New Monster
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ mt: 4 }}>
          {activeStep === 0 ? renderBasicInfo() : renderCombatStats()}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <ButtonContained onClick={handleBack} disabled={activeStep === 0}>
            Back
          </ButtonContained>
          {activeStep === steps.length - 1 ? (
            <ButtonContained onClick={handleSubmit}>
              Create Monster
            </ButtonContained>
          ) : (
            <ButtonContained onClick={handleNext}>Next</ButtonContained>
          )}
        </Box>
      </GlobalCard>
    </Container>
  );
};

export default MonsterEntryForm;
