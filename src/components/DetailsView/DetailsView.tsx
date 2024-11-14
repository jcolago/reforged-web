import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Typography,
  Box,
  Grid,
  Paper,
  Divider,
  CircularProgress,
  Container,
} from '@mui/material';
import { AppDispatch, RootState } from '../../redux/store';
import { fetchPlayers, PlayerState } from '../../redux/reducers/player.reducer';
import GlobalCard from '../../global/components/GlobalCard';
import ButtonContained from '../../global/components/ButtonContained';

interface AbilityScore {
  name: string;
  score: number;
  bonus: number;
  save: number;
}

const getAbilityScores = (player: PlayerState): AbilityScore[] => [
  {
    name: 'Strength',
    score: player.strength,
    bonus: player.strength_bonus || 0,
    save: player.strength_save || 0,
  },
  {
    name: 'Dexterity',
    score: player.dexterity,
    bonus: player.dexterity_bonus || 0,
    save: player.dexterity_save || 0,
  },
  {
    name: 'Constitution',
    score: player.constitution,
    bonus: player.constitution_bonus || 0,
    save: player.constitution_save || 0,
  },
  {
    name: 'Intelligence',
    score: player.intelligence,
    bonus: player.intelligence_bonus || 0,
    save: player.intelligence_save || 0,
  },
  {
    name: 'Wisdom',
    score: player.wisdom,
    bonus: player.wisdom_bonus || 0,
    save: player.wisdom_save || 0,
  },
  {
    name: 'Charisma',
    score: player.charisma,
    bonus: player.charisma_bonus || 0,
    save: player.charisma_save || 0,
  },
];

const DetailsView: React.FC = () => {
  const { id = '' } = useParams<{ id: string }>();
  const playerId = parseInt(id);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);

  const player = useSelector((state: RootState) =>
    state.player.players.find((p) => p.id === playerId)
  );

  useEffect(() => {
    if (!player) {
      dispatch(fetchPlayers())
        .unwrap()
        .then(() => setIsLoading(false))
        .catch(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [dispatch, player]);

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

  const abilityScores = getAbilityScores(player);

  return (
    <Container maxWidth="lg">
      <GlobalCard
        style={{
          padding: '2rem',
          backgroundColor: 'rgb(226, 232, 243, .9)',
          marginTop: '2rem',
        }}
      >
        <Box mb={4}>
          <Typography
            variant="h4"
            align="center"
            sx={{
              fontWeight: 'bold',
              color: '#2c3e50',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              mb: 2,
            }}
          >
            Character Details
          </Typography>
          <Divider sx={{ mb: 4 }} />
        </Box>

        <Grid container spacing={4}>
          {/* Character Image */}
          <Grid item xs={12} md={4}>
            <Paper
              elevation={3}
              sx={{
                p: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <img
                style={{
                  width: '100%',
                  maxWidth: '300px',
                  height: 'auto',
                  borderRadius: '8px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                }}
                src={player.image}
                alt={`${player.character}'s portrait`}
              />
              <Typography
                variant="h5"
                sx={{ mt: 2, fontWeight: 'bold', color: '#2c3e50' }}
              >
                {player.character}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                Level {player.level} {player.class}
              </Typography>
            </Paper>
          </Grid>

          {/* Character Stats */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              {/* Basic Info */}
              <Grid item xs={12}>
                <Paper
                  elevation={3}
                  sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
                >
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ color: '#2c3e50', fontWeight: 'bold' }}
                  >
                    Basic Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6} md={4}>
                      <Typography color="textSecondary">Player Name</Typography>
                      <Typography variant="body1">{player.name}</Typography>
                    </Grid>
                    <Grid item xs={6} md={4}>
                      <Typography color="textSecondary">HP</Typography>
                      <Typography variant="body1">
                        {player.current_hp} / {player.total_hp}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} md={4}>
                      <Typography color="textSecondary">Armor Class</Typography>
                      <Typography variant="body1">
                        {player.armor_class}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} md={4}>
                      <Typography color="textSecondary">Speed</Typography>
                      <Typography variant="body1">{player.speed}</Typography>
                    </Grid>
                    <Grid item xs={6} md={4}>
                      <Typography color="textSecondary">Initiative</Typography>
                      <Typography variant="body1">
                        +{player.initiative_bonus}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              {/* Ability Scores */}
              <Grid item xs={12}>
                <Paper
                  elevation={3}
                  sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
                >
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ color: '#2c3e50', fontWeight: 'bold' }}
                  >
                    Ability Scores
                  </Typography>
                  <Grid container spacing={2}>
                    {abilityScores.map((ability) => (
                      <Grid item xs={12} sm={6} md={4} key={ability.name}>
                        <Paper
                          elevation={1}
                          sx={{
                            p: 1.5,
                            textAlign: 'center',
                            backgroundColor: 'rgba(255, 255, 255, 0.7)',
                          }}
                        >
                          <Typography variant="subtitle2" color="textSecondary">
                            {ability.name}
                          </Typography>
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: 'bold', color: '#2c3e50' }}
                          >
                            {ability.score}
                          </Typography>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-around',
                              mt: 1,
                            }}
                          >
                            <Typography variant="body2">
                              Bonus: {ability.bonus >= 0 ? '+' : ''}
                              {ability.bonus}
                            </Typography>
                            <Typography variant="body2">
                              Save: {ability.save >= 0 ? '+' : ''}
                              {ability.save}
                            </Typography>
                          </Box>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* Action Buttons */}
        <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
          <ButtonContained onClick={() => navigate(`/edit/${playerId}`)}>
            Edit Character
          </ButtonContained>
          <ButtonContained onClick={() => navigate('/players')}>
            Back to Player List
          </ButtonContained>
        </Box>
      </GlobalCard>
    </Container>
  );
};

export default DetailsView;
