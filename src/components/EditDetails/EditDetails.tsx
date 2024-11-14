import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  Typography,
  FormControl,
  InputLabel,
  OutlinedInput,
} from '@mui/material';
import { AppDispatch, RootState } from '../../redux/store';
import {
  fetchPlayerDetails,
  updatePlayer,
  PlayerState,
} from '../../redux/reducers/player.reducer';
import GlobalCard from '../../global/components/GlobalCard';
import ButtonContained from '../../global/components/ButtonContained';
import FormWrapper from '../../global/components/FormWrapper';

// Type for form values based on PlayerState
type EditPlayerFormValues = Omit<
  PlayerState,
  | 'id'
  | 'displayed'
  | 'strength_bonus'
  | 'dexterity_bonus'
  | 'constitution_bonus'
  | 'intelligence_bonus'
  | 'wisdom_bonus'
  | 'charisma_bonus'
>;

const EditDetails: React.FC = () => {
  const { id = '' } = useParams<{ id: string }>();
  const playerId = parseInt(id);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const player = useSelector((state: RootState) => state.player.details?.[0]);

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
    strength_save: 0,
    dexterity: 0,
    dexterity_save: 0,
    constitution: 0,
    constitution_save: 0,
    intelligence: 0,
    intelligence_save: 0,
    wisdom: 0,
    wisdom_save: 0,
    charisma: 0,
    charisma_save: 0,
    game_id: 0,
  });

  useEffect(() => {
    if (playerId) {
      dispatch(fetchPlayerDetails(playerId));
    }
  }, [dispatch, playerId]);

  useEffect(() => {
    if (player) {
      // Create form values from player data, omitting id and displayed
      const { ...playerData } = player;
      setFormValues(playerData);
    }
  }, [player]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await dispatch(
        updatePlayer({
          id: playerId,
          playerData: {
            ...formValues,
            displayed: false,
          },
        })
      ).unwrap();

      Swal.fire({
        title: 'Updated!',
        text: 'Character has been updated.',
        icon: 'success',
      });
      navigate(`/details/${playerId}`);
    } catch {
      Swal.fire({
        title: 'Error!',
        text: 'Failed to update character.',
        icon: 'error',
      });
    }
  };

  const renderField = (
    fieldName: keyof EditPlayerFormValues,
    label: string,
    type: 'text' | 'number' = 'text'
  ) => (
    <FormControl>
      <InputLabel htmlFor={fieldName}>{label}</InputLabel>
      <OutlinedInput
        id={fieldName}
        name={fieldName}
        type={type}
        value={formValues[fieldName]}
        onChange={handleChange}
        label={label}
        style={{ margin: '5px' }}
      />
    </FormControl>
  );

  return (
    <>
      <Typography
        variant="h4"
        style={{
          textDecoration: 'underline',
          textAlign: 'center',
        }}
      >
        Edit Details
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
        <ButtonContained
          width="124.078px"
          height="36.5px"
          margin="5px"
          onClick={() => navigate('/players')}
        >
          Player List
        </ButtonContained>

        <FormWrapper onSubmit={handleSubmit}>
          <GlobalCard
            style={{
              margin: '5px',
              backgroundColor: 'rgb(226, 232, 243, .7)',
              padding: '5px',
            }}
          >
            <img
              style={{ width: '197px', height: '255px' }}
              src={formValues.image}
              alt="Character portrait"
            />
            <Typography variant="h6" style={{ textDecoration: 'underline' }}>
              Update Player Info
            </Typography>

            {/* Basic Info Fields */}
            {renderField('name', 'Player Name')}
            {renderField('character', 'Character Name')}
            {renderField('image', 'Character Image URL')}
            {renderField('class', 'Character Class')}
            {renderField('level', 'Character Level', 'number')}
            {renderField('current_hp', 'Current Hit Points', 'number')}
            {renderField('total_hp', 'Total Hit Points', 'number')}
            {renderField('armor_class', 'Armor Class', 'number')}
            {renderField('speed', 'Speed', 'number')}
            {renderField('initiative_bonus', 'Initiative Bonus', 'number')}
          </GlobalCard>

          <GlobalCard
            style={{
              margin: '5px',
              backgroundColor: 'rgb(226, 232, 243, .7)',
              padding: '5px',
            }}
          >
            <Typography variant="h6" style={{ textDecoration: 'underline' }}>
              Update Player Stats
            </Typography>

            {/* Ability Score Fields */}
            {[
              'strength',
              'dexterity',
              'constitution',
              'intelligence',
              'wisdom',
              'charisma',
            ].map((ability) => (
              <div key={ability}>
                {renderField(
                  ability as keyof EditPlayerFormValues,
                  ability.charAt(0).toUpperCase() + ability.slice(1),
                  'number'
                )}
                {renderField(
                  `${ability}_save` as keyof EditPlayerFormValues,
                  `${ability.charAt(0).toUpperCase() + ability.slice(1)} Save`,
                  'number'
                )}
              </div>
            ))}
          </GlobalCard>

          <ButtonContained type="submit" marginTop="25px" marginLeft="317px">
            Submit
          </ButtonContained>
        </FormWrapper>
      </GlobalCard>
    </>
  );
};

export default EditDetails;
