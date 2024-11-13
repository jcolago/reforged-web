// src/components/MonsterDetails/MonsterDetails.tsx

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Typography } from '@mui/material';
import { AppDispatch, RootState } from '../../redux/store';
import { fetchMonsters } from '../../redux/reducers/monster.reducer';
import GlobalCard from '../../global/components/GlobalCard';
import ButtonContained from '../../global/components/ButtonContained';

const MonsterDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  // Get monster details using selector
  const monster = useSelector((state: RootState) => 
    id ? state.monster.monsters.find(m => m.id === parseInt(id)) : null
  );

  useEffect(() => {
    // Fetch all monsters if we don't have the data
    dispatch(fetchMonsters());
  }, [dispatch]);

  if (!monster) return (
    <GlobalCard>
      <Typography>Monster not found</Typography>
      <ButtonContained onClick={() => navigate('/monsters')}>
        Back to Monster List
      </ButtonContained>
    </GlobalCard>
  );

  return (
    <div>
      <GlobalCard 
        width="80%" 
        style={{
          border: "2px double black", 
          backgroundColor: "rgb(128, 150, 191, .5)", 
          padding: "10px"
        }}
      >
        <GlobalCard 
          style={{
            padding: "10px", 
            width: "90%", 
            margin: "20px auto", 
            backgroundColor: "rgb(226, 232, 243, .7)"
          }}
        >
          <h2>{monster.name}</h2>
          <Typography variant="body1" style={{fontSize: "20px"}}>
            Monster: {monster.name}
          </Typography>
          <Typography variant="body1" style={{fontSize: "20px"}}>
            Alignment: {monster.alignment}
          </Typography>
          <Typography variant="body1" style={{fontSize: "20px"}}>
            Armor Class: {monster.armor_class}
          </Typography>
          <Typography variant="body1" style={{fontSize: "20px"}}>
            Hit Points: {monster.hit_points}
          </Typography>
          <Typography variant="body1" style={{fontSize: "20px"}}>
            Speed: {monster.speed}
          </Typography>
          <Typography variant="body1" style={{fontSize: "20px"}}>
            Resistances: {monster.resistances}
          </Typography>
          <Typography variant="body1" style={{fontSize: "20px"}}>
            Proficiency Bonus: {monster.p_bonus}
          </Typography>
          <Typography variant="body1" style={{fontSize: "20px"}}>
            Attacks: {monster.attacks}
          </Typography>
          <ButtonContained onClick={() => navigate('/monsters')}>
            Monster List
          </ButtonContained>
        </GlobalCard>
      </GlobalCard>
    </div>
  );
};

export default MonsterDetails;