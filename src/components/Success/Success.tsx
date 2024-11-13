import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Typography } from '@mui/material';
import { AppDispatch } from '../../redux/store';
import { clearPlayerForms } from '../../redux/reducers/player.reducer';
import GlobalCard from '../../global/components/GlobalCard';
import ButtonContained from '../../global/components/ButtonContained';

const Success: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const handleNewCharacter = () => {
    dispatch(clearPlayerForms());
    navigate('/playerinfo');
  };

  const handlePlayerList = () => {
    dispatch(clearPlayerForms());
    navigate('/players');
  };

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
          margin: "5px", 
          backgroundColor: "rgb(226, 232, 243, .7)"
        }}
      >
        <Typography 
          variant="h3" 
          style={{textAlign: "center"}}
        >
          Character Successfully Entered!
        </Typography>
        <div style={{textAlign: "center", margin: "5px"}}>
          <ButtonContained
            margin="5px"
            onClick={handleNewCharacter}
          >
            Enter New Character
          </ButtonContained>
          <ButtonContained
              margin="5px"
              width="214.609px"
            onClick={handlePlayerList}
          >
            Players List
          </ButtonContained>
        </div>
      </GlobalCard>
    </GlobalCard>
  );
};

export default Success;