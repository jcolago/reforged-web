import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import LoginForm from '../LoginForm/LoginForm';
import ButtonContained from '../../global/components/ButtonContained';

const LoginPage: React.FC = () => {
  const navigate = useNavigate(); 
  
  return (
    <Box 
      className='login-background'
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
        padding: '20px'
      }}
    >
      <LoginForm />

      <Box>
        <ButtonContained 
          title="Register"
          width={120}
          padding={10}
          onClick={() => navigate('/registration')}
        />
      </Box>
    </Box>
  );
};

export default LoginPage;