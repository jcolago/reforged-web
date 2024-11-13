// src/components/Review/Review.tsx

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Container, CardHeader, Typography } from '@mui/material';
import { AppDispatch, RootState } from '../../redux/store';
import { addPlayer } from '../../redux/reducers/player.reducer';
import GlobalCard from '../../global/components/GlobalCard';
import ButtonContained from '../../global/components/ButtonContained';

// Interfaces matching the form data from previous components
interface PlayerInfo {
  id?: number;
  name: string;
  character: string;
  class: string;
  image: string;
  level: string;
  current_hp: string;
  total_hp: string;
  armor_class: string;
  speed: string;
  initiative_bonus: string;
  game: string;
}

interface PlayerStats {
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

const PlayerReview: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // Use proper typing for selectors
  const playersInfo = useSelector((state: RootState) => state.player.playerInfo as PlayerInfo);
  const playerStats = useSelector((state: RootState) => state.player.playerStats as PlayerStats);


  const characterObj = {
    ...playersInfo,
    ...playerStats,
  };

  const handleSubmit = () => {
    dispatch(addPlayer(characterObj));
    navigate('/success');
  };

  return (
    <Container style={{
      border: "2px double black", 
      width: "80%", 
      backgroundColor: "rgb(128, 150, 191, .5)"
    }}>
      <div>
        <Typography variant="h4">Player Character Review</Typography>
      </div>

      <GlobalCard style={{
        margin: "5px", 
        padding: "10px", 
        backgroundColor: "rgb(226, 232, 243, .7)"
      }}>
        <CardHeader 
          style={{textDecoration: "underline"}} 
          title="Player Info"
        />
        <div>
          <div key={playersInfo.id}>
            {playersInfo.image && (
              <img 
                style={{width: "197px", height: "255px"}} 
                src={playersInfo.image}
                alt={`${playersInfo.character} character`}
              />
            )}
            <Typography variant="body1">
              Player Name: {playersInfo.name}, 
              Character Name: {playersInfo.character}
            </Typography>
            <Typography variant="body1">
              Character Class: {playersInfo.class}, 
              Character Level: {playersInfo.level}, 
              Current Hit Points: {playersInfo.current_hp}, 
              Total Hit Points: {playersInfo.total_hp}
            </Typography>
            <Typography variant="body1">
              Armor Class: {playersInfo.armor_class}, 
              Speed: {playersInfo.speed}, 
              Initiative Bonus: {playersInfo.initiative_bonus}
            </Typography>
          </div>
        </div>
      </GlobalCard>

      <GlobalCard style={{
        margin: "5px", 
        padding: "10px", 
        backgroundColor: "rgb(226, 232, 243, .7)"
      }}>
        <CardHeader 
          style={{textDecoration: "underline"}} 
          title="Player Stats"
        />
        <div>
          {[
            { stat: 'Strength', value: playerStats.strength, bonus: playerStats.strength_bonus, save: playerStats.strength_save },
            { stat: 'Dexterity', value: playerStats.dexterity, bonus: playerStats.dexterity_bonus, save: playerStats.dexterity_save },
            { stat: 'Constitution', value: playerStats.constitution, bonus: playerStats.constitution_bonus, save: playerStats.constitution_save },
            { stat: 'Intelligence', value: playerStats.intelligence, bonus: playerStats.intelligence_bonus, save: playerStats.intelligence_save },
            { stat: 'Wisdom', value: playerStats.wisdom, bonus: playerStats.wisdom_bonus, save: playerStats.wisdom_save },
            { stat: 'Charisma', value: playerStats.charisma, bonus: playerStats.charisma_bonus, save: playerStats.charisma_save }
          ].map(({ stat, value, bonus, save }) => (
            <Typography key={stat} variant="body1">
              {stat}: {value}, Bonus: {bonus}, Save: {save}
            </Typography>
          ))}
        </div>
      </GlobalCard>

      <GlobalCard style={{
        margin: "5px", 
        padding: "10px", 
        backgroundColor: "rgb(226, 232, 243, .7)"
      }}>
        <CardHeader 
          style={{textDecoration: "underline"}} 
          title="Inventory"
        />
      </GlobalCard>

      <ButtonContained 
        onClick={handleSubmit}
         margin="5px" 
      >
        Submit Character
      </ButtonContained>
    </Container>
  );
};

export default PlayerReview;