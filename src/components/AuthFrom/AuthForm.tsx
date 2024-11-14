// AuthForm.tsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../../redux/reducers/auth.reducer';
import {
  createUser,
  selectUserError,
  selectUserStatus,
} from '../../redux/reducers/user.reducer';
import { AppDispatch } from '../../redux/store';
import {
  CardHeader,
  OutlinedInput,
  InputLabel,
  FormControl,
} from '@mui/material';
import ButtonContained from '../../global/components/ButtonContained';
import GlobalCard from '../../global/components/GlobalCard';
import FormWrapper from '../../global/components/FormWrapper';
import ButtonOutlined from '../../global/components/ButtonOutlined';

const AuthForm = () => {
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    password_confirmation: '',
  });

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const status = useSelector(selectUserStatus);
  const error = useSelector(selectUserError);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLoginForm) {
        await dispatch(
          login({
            email: formData.email,
            password: formData.password,
          })
        ).unwrap();
        navigate('/dashboard');
      } else {
        await dispatch(createUser(formData)).unwrap();
        setIsLoginForm(true);
      }
    } catch (error) {
      console.error(
        isLoginForm ? 'Login failed:' : 'Registration failed:',
        error
      );
    }
  };

  const toggleForm = () => {
    setIsLoginForm(!isLoginForm);
    setFormData({
      email: '',
      password: '',
      password_confirmation: '',
    });
  };

  const getFieldError = (fieldName: keyof typeof formData) => {
    if (error && typeof error === 'object' && Array.isArray(error[fieldName])) {
      return error[fieldName][0];
    }
    return '';
  };

  return (
    <FormWrapper onSubmit={handleSubmit}>
      <GlobalCard
        style={{
          width: '375px',
          margin: '5px',
          padding: '5px',
          backgroundColor: 'rgb(226, 232, 243, .7)',
        }}
      >
        <CardHeader
          style={{ textDecoration: 'underline' }}
          title={isLoginForm ? 'Log In' : 'Register'}
        />

        {/* Display general errors */}
        {error && typeof error === 'string' && (
          <div className="alert mb-4 p-2 text-red-600 text-center" role="alert">
            {error}
          </div>
        )}

        <div style={{ margin: '5px' }}>
          <center>
            <FormControl error={!!getFieldError('email')}>
              <InputLabel htmlFor="email">Email Address</InputLabel>
              <OutlinedInput
                style={{ width: '250px' }}
                name="email"
                type="email"
                label="Email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              {getFieldError('email') && (
                <div className="text-red-500 text-sm mt-1">
                  {getFieldError('email')}
                </div>
              )}
            </FormControl>
          </center>
        </div>

        <div style={{ margin: '5px' }}>
          <center>
            <FormControl error={!!getFieldError('password')}>
              <InputLabel htmlFor="password">Password</InputLabel>
              <OutlinedInput
                style={{ width: '250px' }}
                name="password"
                type="password"
                label="Password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              {getFieldError('password') && (
                <div className="text-red-500 text-sm mt-1">
                  {getFieldError('password')}
                </div>
              )}
            </FormControl>
          </center>
        </div>

        {!isLoginForm && (
          <div style={{ margin: '5px' }}>
            <center>
              <FormControl error={!!getFieldError('password_confirmation')}>
                <InputLabel htmlFor="password_confirmation">
                  Confirm Password
                </InputLabel>
                <OutlinedInput
                  style={{ width: '250px' }}
                  name="password_confirmation"
                  type="password"
                  label="Confirm Password"
                  value={formData.password_confirmation}
                  onChange={handleInputChange}
                  required
                />
                {getFieldError('password_confirmation') && (
                  <div className="text-red-500 text-sm mt-1">
                    {getFieldError('password_confirmation')}
                  </div>
                )}
              </FormControl>
            </center>
          </div>
        )}

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '0 20px',
            marginTop: '15px',
          }}
        >
          <ButtonContained
            title={isLoginForm ? 'Log In' : 'Register'}
            type="submit"
            disabled={status === 'loading'}
          />
          <ButtonOutlined
            title={isLoginForm ? 'Register' : 'Log In'}
            onClick={toggleForm}
          />
        </div>
      </GlobalCard>
    </FormWrapper>
  );
};

export default AuthForm;
