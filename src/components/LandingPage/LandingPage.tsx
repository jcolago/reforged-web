import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import { Card, CardContent, Typography, Container } from '@mui/material';
import ButtonContained from '../../global/components/ButtonContained';
import LoginForm from '../LoginForm/LoginForm';


const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const onClick = () => {
    navigate('/register');
  };

  return (
    <div className="container">
      <div className="grid">
        <div className="grid-col grid-col_8">
          <Container className="border-2 border-black bg-opacity-50 bg-[rgb(128,150,191)]">
            <Card className="m-4 p-2 bg-opacity-70 bg-[rgb(226,232,243)]">
              <CardContent>
                <Typography variant="h1" className="text-4xl font-bold mb-4">
                  Welcome
                </Typography>
                <Typography variant="h2" className="text-2xl mb-4">
                  Welcome to the D&D Dungeon Master Companion App!
                </Typography>
                <Typography variant="h3" className="text-xl mb-4">
                  This app was designed to help keep track of player characters for your specific games as well as keep a list of entered monsters for use.
                </Typography>
                <Typography variant="h3" className="text-xl">
                  Register now or log in if you already have an account.
                </Typography>
              </CardContent>
            </Card>
          </Container>
        </div>
        <div className="grid-col grid-col_4">
        <LoginForm />

          <div className="text-center">
            <Typography 
              variant="h3" 
              className="text-white text-xl mb-4 drop-shadow-lg"
              style={{ textShadow: '2px 2px 4px black' }}
            >
              Create an account
            </Typography>
            <ButtonContained 
              title="Register"
              width={120}
              padding={10}
              onClick={onClick}
            />
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;