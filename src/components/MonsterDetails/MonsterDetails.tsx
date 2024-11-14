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
import { fetchMonsters } from '../../redux/reducers/monster.reducer';
import GlobalCard from '../../global/components/GlobalCard';
import ButtonContained from '../../global/components/ButtonContained';

const MonsterDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const monster = useSelector((state: RootState) =>
    id ? state.monster.monsters.find((m) => m.id === parseInt(id)) : null
  );

  useEffect(() => {
    if (!monster) {
      dispatch(fetchMonsters())
        .unwrap()
        .then(() => setIsLoading(false))
        .catch(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [dispatch, monster]);

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

  if (!monster) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <Typography variant="h6">Monster not found</Typography>
      </Box>
    );
  }

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
            Monster Details
          </Typography>
          <Divider sx={{ mb: 4 }} />
        </Box>

        <Grid container spacing={4}>
          {/* Basic Info */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                height: '100%',
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: '#2c3e50',
                  fontWeight: 'bold',
                  mb: 3,
                }}
              >
                Basic Information
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" color="textSecondary">
                    Name
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ mb: 2, fontWeight: 'bold' }}
                  >
                    {monster.name}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="subtitle1" color="textSecondary">
                    Size
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {monster.size.charAt(0).toUpperCase() +
                      monster.size.slice(1)}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="subtitle1" color="textSecondary">
                    Alignment
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {monster.alignment
                      .split('_')
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(' ')}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Combat Stats */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                height: '100%',
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: '#2c3e50',
                  fontWeight: 'bold',
                  mb: 3,
                }}
              >
                Combat Statistics
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle1" color="textSecondary">
                    Armor Class
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {monster.armor_class}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="subtitle1" color="textSecondary">
                    Hit Points
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {monster.hit_points}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="subtitle1" color="textSecondary">
                    Speed
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {monster.speed} ft.
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="subtitle1" color="textSecondary">
                    Proficiency Bonus
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    +{monster.p_bonus}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Resistances */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                height: '100%',
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: '#2c3e50',
                  fontWeight: 'bold',
                  mb: 3,
                }}
              >
                Resistances
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                {monster.resistances || 'None'}
              </Typography>
            </Paper>
          </Grid>

          {/* Attacks */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                height: '100%',
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: '#2c3e50',
                  fontWeight: 'bold',
                  mb: 3,
                }}
              >
                Attacks
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                {monster.attacks || 'None'}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Action Buttons */}
        <Box
          sx={{
            mt: 8,
            mb: 2,
            display: 'flex',
            gap: 2,
            justifyContent: 'center',
          }}
        >
          <ButtonContained onClick={() => navigate('/monsters')}>
            Back to Monster List
          </ButtonContained>
        </Box>
      </GlobalCard>
    </Container>
  );
};

export default MonsterDetails;
