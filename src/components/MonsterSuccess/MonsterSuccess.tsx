// src/components/MonsterSuccess/MonsterSuccess.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography } from '@mui/material';
import GlobalCard from '../../global/components/GlobalCard';
import ButtonContained from '../../global/components/ButtonContained';

const MonsterSuccess: React.FC = () => {
  const navigate = useNavigate();

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
          margin: "15px", 
          backgroundColor: "rgb(226, 232, 243, .7)"
        }}
      >
        <Typography variant="h3" style={{textAlign: "center"}}>
          Monster Successfully Entered!
        </Typography>
        <div style={{textAlign: "center", margin: "5px"}}>
          <ButtonContained onClick={() => navigate("/monsterentry")}>
            Enter New Monster
          </ButtonContained>
          <ButtonContained 
            margin = "5px"
            width = "196.695px"
            onClick={() => navigate("/monsters")}
          >
            Monster List
          </ButtonContained>
        </div>
      </GlobalCard>
    </GlobalCard>
  );
};

export default MonsterSuccess;