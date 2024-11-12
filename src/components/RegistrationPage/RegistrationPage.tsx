import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import ButtonContained from '../../global/components/ButtonContained';
import RegisterForm from '../RegisterForm/RegisterForm';

const RegistrationPage: React.FC = () => {
  const navigate = useNavigate(); 

  return (
    <Box 
      className='registration-background'
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
        padding: '20px'
      }}
    >
      <RegisterForm />

      <Box>
        <ButtonContained 
          title="Login"
          width={120}
          padding={10}
          onClick={() => navigate('/login')}
        />
      </Box>
    </Box>
  );
};

export default RegistrationPage;