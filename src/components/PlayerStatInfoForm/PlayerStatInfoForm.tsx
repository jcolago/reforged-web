// src/components/PlayerStatInfo/PlayerStatInfo.tsx

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  OutlinedInput, 
  InputLabel, 
  FormControl, 
  CardHeader 
} from '@mui/material';
import { AppDispatch } from '../../redux/store';
import { setPlayerStats } from '../../redux/reducers/player.reducer';
import GlobalCard from '../../global/components/GlobalCard';
import ButtonContained from '../../global/components/ButtonContained';
import FormWrapper from '../../global/components/FormWrapper';

interface PlayerStatsFormValues {
    strength: string;
    strength_bonus: string;
    strength_save: string;
    dexterity: string;
    dexterity_bonus: string;
    dexterity_save: string;
    constitution: string;
    constitution_bonus: string;
    constitution_save: string;
    intelligence: string;
    intelligence_bonus: string;
    intelligence_save: string;
    wisdom: string;
    wisdom_bonus: string;
    wisdom_save: string;
    charisma: string;
    charisma_bonus: string;
    charisma_save: string;
}

const initialFormState: PlayerStatsFormValues = {
    strength: '',
    strength_bonus: '',
    strength_save: '',
    dexterity: '',
    dexterity_bonus: '',
    dexterity_save: '',
    constitution: '',
    constitution_bonus: '',
    constitution_save: '',
    intelligence: '',
    intelligence_bonus: '',
    intelligence_save: '',
    wisdom: '',
    wisdom_bonus: '',
    wisdom_save: '',
    charisma: '',
    charisma_bonus: '',
    charisma_save: ''
};

const PlayerStatInfoForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const [formValues, setFormValues] = useState<PlayerStatsFormValues>(initialFormState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    dispatch(setPlayerStats(formValues));
    setFormValues(initialFormState);
    navigate('/playerinventory');
  };

  const statFields = [
    { ability: 'strength', label: 'Strength' },
    { ability: 'dexterity', label: 'Dexterity' },
    { ability: 'constitution', label: 'Constitution' },
    { ability: 'intelligence', label: 'Intelligence' },
    { ability: 'wisdom', label: 'Wisdom' },
    { ability: 'charisma', label: 'Charisma' }
  ];

  return (
    <GlobalCard
      width="80%"
      style={{
        border: "2px double black",
        backgroundColor: "rgb(128, 150, 191, .5)"
      }}
    >
      <GlobalCard
        style={{
          marginTop: "20px",
          marginBottom: "20px",
          backgroundColor: "rgb(226, 232, 243, .7)"
        }}
      >
        <CardHeader 
          style={{ textDecoration: "underline" }} 
          title="Enter Character Stats Below" 
        />
        <FormWrapper onSubmit={handleSubmit}>
          {statFields.map(({ ability, label }) => (
            <React.Fragment key={ability}>
              <FormControl>
                <InputLabel htmlFor={ability}>{label}</InputLabel>
                <OutlinedInput
                  required
                  id={ability}
                  name={ability}
                  type="number"
                  value={formValues[ability as keyof PlayerStatsFormValues]}
                  onChange={handleChange}
                  label={label}
                  style={{ margin: "5px", width: "225px" }}
                />
              </FormControl>
              <FormControl>
                <InputLabel htmlFor={`${ability.slice(0, 3)}_bonus`}>{`${label} Bonus`}</InputLabel>
                <OutlinedInput
                  required
                  id={`${ability.slice(0, 3)}_bonus`}
                  name={`${ability.slice(0, 3)}_bonus`}
                  type="number"
                  value={formValues[`${ability.slice(0, 3)}_bonus` as keyof PlayerStatsFormValues]}
                  onChange={handleChange}
                  label={`${label} Bonus`}
                  style={{ margin: "5px", width: "225px" }}
                />
              </FormControl>
              <FormControl>
                <InputLabel htmlFor={`${ability.slice(0, 3)}_save`}>{`${label} Saving Throw`}</InputLabel>
                <OutlinedInput
                  required
                  id={`${ability.slice(0, 3)}_save`}
                  name={`${ability.slice(0, 3)}_save`}
                  type="number"
                  value={formValues[`${ability.slice(0, 3)}_save` as keyof PlayerStatsFormValues]}
                  onChange={handleChange}
                  label={`${label} Saving Throw`}
                  style={{ margin: "5px", width: "225px" }}
                />
              </FormControl>
            </React.Fragment>
          ))}
          
          <ButtonContained
            type="submit"
            marginTop="23px"
            marginLeft="380px"
          >
            Submit
          </ButtonContained>
        </FormWrapper>
      </GlobalCard>
    </GlobalCard>
  );
};

export default PlayerStatInfoForm;