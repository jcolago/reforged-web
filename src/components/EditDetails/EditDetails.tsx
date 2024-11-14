import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  Typography,
  Box,
  Grid,
  FormControl,
  InputLabel,
  OutlinedInput,
  Container,
  Paper,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
} from '@mui/material';
import { AppDispatch, RootState } from '../../redux/store';
import {
  fetchPlayers,
  updatePlayer,
  PlayerState,
} from '../../redux/reducers/player.reducer';
import GlobalCard from '../../global/components/GlobalCard';
import ButtonContained from '../../global/components/ButtonContained';

const steps = ['Basic Info', 'Stats'];

type EditPlayerFormValues = Omit<PlayerState, 'id' | 'displayed'>;

const EditDetails: React.FC = () => {
  const { id = '' } = useParams<{ id: string }>();
  const playerId = parseInt(id);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const player = useSelector((state: RootState) =>
    state.player.players.find((p) => p.id === playerId)
  );

  const [formValues, setFormValues] = useState<EditPlayerFormValues>({
    name: '',
    character: '',
    class: '',
    image: '',
    level: 0,
    current_hp: 0,
    total_hp: 0,
    armor_class: 0,
    speed: 0,
    initiative_bonus: 0,
    strength: 0,
    strength_bonus: 0,
    strength_save: 0,
    dexterity: 0,
    dexterity_bonus: 0,
    dexterity_save: 0,
    constitution: 0,
    constitution_bonus: 0,
    constitution_save: 0,
    intelligence: 0,
    intelligence_bonus: 0,
    intelligence_save: 0,
    wisdom: 0,
    wisdom_bonus: 0,
    wisdom_save: 0,
    charisma: 0,
    charisma_bonus: 0,
    charisma_save: 0,
    game_id: 0,
  });

  useEffect(() => {
    if (!player) {
      dispatch(fetchPlayers())
        .unwrap()
        .then(() => setIsLoading(false))
        .catch(() => setIsLoading(false));
    } else {
      setFormValues({
        name: player.name,
        character: player.character,
        class: player.class,
        image: player.image,
        level: player.level,
        current_hp: player.current_hp,
        total_hp: player.total_hp,
        armor_class: player.armor_class,
        speed: player.speed,
        initiative_bonus: player.initiative_bonus,
        strength: player.strength,
        strength_bonus: player.strength_bonus,
        strength_save: player.strength_save,
        dexterity: player.dexterity,
        dexterity_bonus: player.dexterity_bonus,
        dexterity_save: player.dexterity_save,
        constitution: player.constitution,
        constitution_bonus: player.constitution_bonus,
        constitution_save: player.constitution_save,
        intelligence: player.intelligence,
        intelligence_bonus: player.intelligence_bonus,
        intelligence_save: player.intelligence_save,
        wisdom: player.wisdom,
        wisdom_bonus: player.wisdom_bonus,
        wisdom_save: player.wisdom_save,
        charisma: player.charisma,
        charisma_bonus: player.charisma_bonus,
        charisma_save: player.charisma_save,
        game_id: player.game_id,
      });
      setIsLoading(false);
    }
  }, [dispatch, player]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
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
      await dispatch(
        updatePlayer({
          id: playerId,
          playerData: formValues,
        })
      ).unwrap();

      // Fetch fresh data after update
      await dispatch(fetchPlayers()).unwrap();

      Swal.fire({
        title: 'Success!',
        text: 'Character has been updated',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        // Navigate after the success message
        navigate(`/details/${playerId}`);
      });
    } catch {
      Swal.fire({
        title: 'Error!',
        text: 'Failed to update character',
        icon: 'error',
      });
    }
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!player) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <Typography variant="h6">Player not found</Typography>
      </Box>
    );
  }

  const renderBasicInfo = () => (
    <Paper
      elevation={3}
      sx={{ p: 3, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Player Name</InputLabel>
            <OutlinedInput
              name="name"
              value={formValues.name}
              onChange={handleChange}
              label="Player Name"
              required
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Character Name</InputLabel>
            <OutlinedInput
              name="character"
              value={formValues.character}
              onChange={handleChange}
              label="Character Name"
              required
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Character Class</InputLabel>
            <OutlinedInput
              name="class"
              value={formValues.class}
              onChange={handleChange}
              label="Character Class"
              required
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Image URL</InputLabel>
            <OutlinedInput
              name="image"
              value={formValues.image}
              onChange={handleChange}
              label="Image URL"
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Level</InputLabel>
            <OutlinedInput
              name="level"
              type="number"
              value={formValues.level}
              onChange={handleChange}
              label="Level"
              required
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Current HP</InputLabel>
            <OutlinedInput
              name="current_hp"
              type="number"
              value={formValues.current_hp}
              onChange={handleChange}
              label="Current HP"
              required
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Total HP</InputLabel>
            <OutlinedInput
              name="total_hp"
              type="number"
              value={formValues.total_hp}
              onChange={handleChange}
              label="Total HP"
              required
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Armor Class</InputLabel>
            <OutlinedInput
              name="armor_class"
              type="number"
              value={formValues.armor_class}
              onChange={handleChange}
              label="Armor Class"
              required
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Speed</InputLabel>
            <OutlinedInput
              name="speed"
              type="number"
              value={formValues.speed}
              onChange={handleChange}
              label="Speed"
              required
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Initiative Bonus</InputLabel>
            <OutlinedInput
              name="initiative_bonus"
              type="number"
              value={formValues.initiative_bonus}
              onChange={handleChange}
              label="Initiative Bonus"
              required
            />
          </FormControl>
        </Grid>
      </Grid>
    </Paper>
  );

  const renderStats = () => (
    <Paper
      elevation={3}
      sx={{ p: 3, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
    >
      <Grid container spacing={3}>
        {[
          'strength',
          'dexterity',
          'constitution',
          'intelligence',
          'wisdom',
          'charisma',
        ].map((ability) => (
          <Grid item xs={12} md={6} key={ability}>
            <Paper
              elevation={2}
              sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.7)' }}
            >
              <Typography variant="h6" gutterBottom>
                {ability.charAt(0).toUpperCase() + ability.slice(1)}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Score</InputLabel>
                    <OutlinedInput
                      name={ability}
                      type="number"
                      value={formValues[ability as keyof EditPlayerFormValues]}
                      onChange={handleChange}
                      label="Score"
                      required
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Bonus</InputLabel>
                    <OutlinedInput
                      name={`${ability}_bonus`}
                      type="number"
                      value={
                        formValues[
                          `${ability}_bonus` as keyof EditPlayerFormValues
                        ]
                      }
                      onChange={handleChange}
                      label="Bonus"
                      required
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Save</InputLabel>
                    <OutlinedInput
                      name={`${ability}_save`}
                      type="number"
                      value={
                        formValues[
                          `${ability}_save` as keyof EditPlayerFormValues
                        ]
                      }
                      onChange={handleChange}
                      label="Save"
                      required
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        ))}
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
          Edit Character
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ mt: 4 }}>
          {activeStep === 0 ? renderBasicInfo() : renderStats()}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <ButtonContained onClick={handleBack} disabled={activeStep === 0}>
            Back
          </ButtonContained>
          {activeStep === steps.length - 1 ? (
            <ButtonContained onClick={handleSubmit}>
              Save Changes
            </ButtonContained>
          ) : (
            <ButtonContained onClick={handleNext}>Next</ButtonContained>
          )}
        </Box>
      </GlobalCard>
    </Container>
  );
};

export default EditDetails;
