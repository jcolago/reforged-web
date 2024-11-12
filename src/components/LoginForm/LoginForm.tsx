import React, { useState, FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { InputLabel, OutlinedInput, Box, Typography } from "@mui/material";
import { AppDispatch } from '../../redux/store';
import { login, selectUserError, selectUserStatus } from '../../redux/reducers/user.reducer';
import GlobalCard from '../../global/components/GlobalCard';
import ButtonContained from '../../global/components/ButtonContained';
import FormWrapper from '../../global/components/FormWrapper';

interface LoginFormCredentials {
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const error = useSelector(selectUserError);
  const status = useSelector(selectUserStatus);

  const [credentials, setCredentials] = useState<LoginFormCredentials>({
    email: '',
    password: ''
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    const { email, password } = credentials;

    if (email && password) {
      try {
        await dispatch(login({ email, password })).unwrap();
        // After successful login, navigate to the user page
        navigate('/user');
      } catch (err) {
        // Error is handled by the reducer and displayed via the error selector
        console.error('Login failed:', err);
      }
    }
  };

  return (
    <FormWrapper width={300} onSubmit={handleSubmit}>
      <GlobalCard
        padding={20}
        style={{
          margin: "5px",
          backgroundColor: "rgb(226, 232, 243, .7)"
        }}
      >
        <Typography 
          variant="h5" 
          component="h2" 
          style={{ 
            textAlign: 'center', 
            marginBottom: '20px',
            fontWeight: 'bold'
          }}
        >
          Login
        </Typography>
        
        {error && (
          <Box 
            sx={{
              backgroundColor: '#ffebee',
              border: '1px solid #ef5350',
              color: '#c62828',
              padding: '10px',
              borderRadius: '4px',
              marginBottom: '20px'
            }}
            role="alert"
          >
            <Typography>{error}</Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <FormWrapper>
              <InputLabel htmlFor="email">Email</InputLabel>
              <OutlinedInput
                id="email"
                type="email"
                name="email"
                required
                value={credentials.email}
                onChange={handleChange}
                sx={{ width: '250px' }}
                disabled={status === 'loading'}
                autoComplete="email"
              />
            </FormWrapper>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <FormWrapper>
              <InputLabel htmlFor="password">Password</InputLabel>
              <OutlinedInput
                id="password"
                type="password"
                name="password"
                required
                value={credentials.password}
                onChange={handleChange}
                sx={{ width: '250px' }}
                disabled={status === 'loading'}
                autoComplete="current-password"
              />
            </FormWrapper>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
            <ButtonContained
              title={status === 'loading' ? 'Logging in...' : 'Log In'}
              width={100}
              padding={10}
            />
          </Box>
        </Box>
      </GlobalCard>
    </FormWrapper>
  );
};

export default LoginForm;