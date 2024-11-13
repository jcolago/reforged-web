// src/components/EditDetails/EditDetails.tsx

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { 
  Typography, 
  FormControl, 
  InputLabel, 
  OutlinedInput
} from '@mui/material';
import { AppDispatch, RootState } from '../../redux/store';
import { 
  fetchPlayerDetails,
  updatePlayer,
  PlayerState 
} from '../../redux/reducers/player.reducer';
import GlobalCard from '../../global/components/GlobalCard';
import ButtonContained from '../../global/components/ButtonContained';
import FormWrapper from '../../global/components/FormWrapper';

type EditPlayerFormValues = Omit<PlayerState, 'id' | 'displayed'>;

const EditDetails: React.FC = () => {
  const { id = '' } = useParams<{ id: string }>();
  const playerId = parseInt(id);
  
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const player = useSelector((state: RootState) => 
    state.player.details?.[0]
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
    game: ''
  });

  useEffect(() => {
    if (playerId) {
      dispatch(fetchPlayerDetails(playerId));
    }
  }, [dispatch, playerId]);

  useEffect(() => {
    if (player) {
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
        game: player.game
      });
    }
  }, [player]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(updatePlayer({
          id: playerId,
          ...formValues,
          displayed: false
      })).unwrap();
      
      Swal.fire(
        'Updated!',
        'Character has been updated.',
        'success'
      );
      navigate(`/details/${playerId}`);
    } catch {
      Swal.fire(
        'Error!',
        'Failed to update character.',
        'error'
      );
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
        style={{ margin: "5px" }}
      />
    </FormControl>
  );

  return (
    <>
      <Typography 
        variant="h4" 
        style={{
          textDecoration: "underline",
          textAlign: "center"
        }}
      >
        Edit Details
      </Typography>
      <GlobalCard
        width="80%"
        style={{
          border: "2px double black",
          backgroundColor: "rgb(128, 150, 191, .5)",
          display: "flex",
          flexDirection: "column",
          padding: "10px"
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
              margin: "5px",
              backgroundColor: "rgb(226, 232, 243, .7)",
              padding: "5px"
            }}
          >
            <img 
              style={{width: "197px", height: "255px"}} 
              src={formValues.image}
              alt="Character portrait"
            />
            <Typography variant="h6" style={{textDecoration: "underline"}}>
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
              margin: "5px",
              backgroundColor: "rgb(226, 232, 243, .7)",
              padding: "5px"
            }}
          >
            <Typography variant="h6" style={{textDecoration: "underline"}}>
              Update Player Stats
            </Typography>

            {/* Ability Score Fields */}
            {['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'].map(ability => (
              <div key={ability}>
                {renderField(ability as keyof EditPlayerFormValues, ability.charAt(0).toUpperCase() + ability.slice(1), 'number')}
                {renderField(`${ability}_bonus` as keyof EditPlayerFormValues, `${ability.charAt(0).toUpperCase() + ability.slice(1)} Bonus`, 'number')}
                {renderField(`${ability}_save` as keyof EditPlayerFormValues, `${ability.charAt(0).toUpperCase() + ability.slice(1)} Save`, 'number')}
              </div>
            ))}
          </GlobalCard>

          <ButtonContained 
            type="submit"
            marginTop="25px"
            marginLeft="317px"
          >
            Submit
          </ButtonContained>
        </FormWrapper>
      </GlobalCard>
    </>
  );
};

export default EditDetails;