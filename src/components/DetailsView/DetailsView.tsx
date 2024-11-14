import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Typography } from '@mui/material';
import { AppDispatch, RootState } from '../../redux/store';
import { fetchPlayerDetails } from '../../redux/reducers/player.reducer';
import GlobalCard from '../../global/components/GlobalCard';
import ButtonContained from '../../global/components/ButtonContained';

const DetailsView: React.FC = () => {
  const { id = '' } = useParams<{ id: string }>();
  const playerId = parseInt(id);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const player = useSelector(
    (state: RootState) => state.player.details?.[0] || null
  );

  const status = useSelector((state: RootState) => state.player.status);
  const error = useSelector((state: RootState) => state.player.error);

  useEffect(() => {
    if (playerId && !isNaN(playerId)) {
      dispatch(fetchPlayerDetails(playerId));
    }
  }, [dispatch, playerId]);

  if (status === 'loading') {
    return (
      <div className="text-center">
        <Typography>Loading player details...</Typography>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center">
        <Typography color="error">Error: {error}</Typography>
        <ButtonContained onClick={() => navigate('/players')}>
          Back to Player List
        </ButtonContained>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="text-center">
        <Typography>Player not found</Typography>
        <ButtonContained onClick={() => navigate('/players')}>
          Back to Player List
        </ButtonContained>
      </div>
    );
  }

  return (
    <>
      <Typography
        variant="h4"
        style={{
          textAlign: 'center',
          margin: '10px',
          textDecoration: 'underline',
        }}
      >
        Character Details
      </Typography>
      <GlobalCard
        width="80%"
        style={{
          border: '2px double black',
          backgroundColor: 'rgb(128, 150, 191, .5)',
          display: 'flex',
          flexDirection: 'column',
          padding: '10px',
        }}
      >
        <GlobalCard
          style={{
            backgroundColor: 'rgb(226, 232, 243, .7)',
            padding: '10px',
            width: '90%',
            margin: '20px auto',
          }}
        >
          {player.image && (
            <img
              style={{ width: '197px', height: '255px' }}
              src={player.image}
              alt={`${player.character}'s portrait`}
            />
          )}

          <Typography>Player Name: {player.name}</Typography>
          <Typography>Character Name: {player.character}</Typography>
          <Typography>Character Class: {player.class}</Typography>
          <Typography>Character Level: {player.level}</Typography>
          <Typography>Current Hit Points: {player.current_hp}</Typography>
          <Typography>Total Hit Points: {player.total_hp}</Typography>
          <Typography>Armor Class: {player.armor_class}</Typography>
          <Typography>Speed: {player.speed}</Typography>
          <Typography>Initiative Bonus: {player.initiative_bonus}</Typography>

          <div style={{ marginTop: '20px' }}>
            <Typography style={{ marginTop: '5px' }}>
              Strength: {player.strength}
              {player.strength_bonus !== undefined &&
                ` (${player.strength_bonus >= 0 ? '+' : ''}${player.strength_bonus})`}
              Save: {player.strength_save}
            </Typography>
            <Typography style={{ marginTop: '5px' }}>
              Dexterity: {player.dexterity}
              {player.dexterity_bonus !== undefined &&
                ` (${player.dexterity_bonus >= 0 ? '+' : ''}${player.dexterity_bonus})`}
              Save: {player.dexterity_save}
            </Typography>
            <Typography style={{ marginTop: '5px' }}>
              Constitution: {player.constitution}
              {player.constitution_bonus !== undefined &&
                ` (${player.constitution_bonus >= 0 ? '+' : ''}${player.constitution_bonus})`}
              Save: {player.constitution_save}
            </Typography>
            <Typography style={{ marginTop: '5px' }}>
              Intelligence: {player.intelligence}
              {player.intelligence_bonus !== undefined &&
                ` (${player.intelligence_bonus >= 0 ? '+' : ''}${player.intelligence_bonus})`}
              Save: {player.intelligence_save}
            </Typography>
            <Typography style={{ marginTop: '5px' }}>
              Wisdom: {player.wisdom}
              {player.wisdom_bonus !== undefined &&
                ` (${player.wisdom_bonus >= 0 ? '+' : ''}${player.wisdom_bonus})`}
              Save: {player.wisdom_save}
            </Typography>
            <Typography style={{ marginTop: '5px' }}>
              Charisma: {player.charisma}
              {player.charisma_bonus !== undefined &&
                ` (${player.charisma_bonus >= 0 ? '+' : ''}${player.charisma_bonus})`}
              Save: {player.charisma_save}
            </Typography>
          </div>

          <div style={{ marginTop: '20px' }}>
            <ButtonContained
              onClick={() => navigate(`/edit/${playerId}`)}
              marginRight="10px"
            >
              Edit
            </ButtonContained>
            <ButtonContained onClick={() => navigate('/players')}>
              Player List
            </ButtonContained>
          </div>
        </GlobalCard>
      </GlobalCard>
    </>
  );
};

export default DetailsView;
