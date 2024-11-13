import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from '../../redux/store';
import { createUser, selectUserError, selectUserStatus } from '../../redux/reducers/user.reducer';
import { FormControl, InputLabel, OutlinedInput } from "@mui/material";
import GlobalCard from '../../global/components/GlobalCard';
import FormWrapper from '../../global/components/FormWrapper';
import ButtonContained from '../../global/components/ButtonContained';

interface RegisterFormData {
  email: string;
  password: string;
  password_confirmation: string;
}

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    password: '',
    password_confirmation: ''
  });

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const status = useSelector(selectUserStatus);
  const error = useSelector(selectUserError);

  // Clear form when successfully registered
  useEffect(() => {
    if (status === 'succeeded') {
      setFormData({
        email: '',
        password: '',
        password_confirmation: ''
      });
      // Redirect to login page after successful registration
      navigate('/login');
    }
  }, [status, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(formData)
    try {
      await dispatch(createUser(formData)).unwrap();
    } catch (err) {
      // Error handling is managed by the reducer
      console.error('Registration failed:', err);
    }
  };

  // Helper function to get field-specific errors
  const getFieldError = (fieldName: keyof RegisterFormData) => {
    if (error && typeof error === 'object' && Array.isArray(error[fieldName])) {
      return error[fieldName][0];
    }
    return '';
  };

  return (
    <FormWrapper width="100%" padding={10}>
      <GlobalCard
        padding={10}
        style={{
          margin: "5px",
          backgroundColor: "rgba(226, 232, 243, 0.7)"
        }}
      >
        <h2 className="text-xl font-semibold text-center underline mb-4">
          Register User
        </h2>
        
        {/* Display general errors */}
        {error && typeof error === 'string' && (
          <div className="alert mb-4 p-2 text-red-600 text-center" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <center>
              <FormControl error={!!getFieldError('email')}>
                <InputLabel htmlFor="email">Email</InputLabel>
                <OutlinedInput
                  id="email"
                  name="email"
                  type="email"
                  label="Email"
                  value={formData.email}
                  required
                  onChange={handleInputChange}
                  style={{ width: "250px" }}
                />
                {getFieldError('email') && (
                  <div className="text-red-500 text-sm mt-1">
                    {getFieldError('email')}
                  </div>
                )}
              </FormControl>
            </center>
          </div>

          <div className="mb-4">
            <center>
              <FormControl error={!!getFieldError('password')}>
                <InputLabel htmlFor="password">Password</InputLabel>
                <OutlinedInput
                  id="password"
                  name="password"
                  type="password"
                  label="Password"
                  value={formData.password}
                  required
                  onChange={handleInputChange}
                  style={{ width: "250px" }}
                />
                {getFieldError('password') && (
                  <div className="text-red-500 text-sm mt-1">
                    {getFieldError('password')}
                  </div>
                )}
              </FormControl>
            </center>
          </div>

          <div className="mb-4">
            <center>
              <FormControl error={!!getFieldError('password_confirmation')}>
                <InputLabel htmlFor="password_confirmation">
                  Confirm Password
                </InputLabel>
                <OutlinedInput
                  id="password_confirmation"
                  name="password_confirmation"
                  type="password"
                  label="Confirm Password"
                  value={formData.password_confirmation}
                  required
                  onChange={handleInputChange}
                  style={{ width: "250px" }}
                />
                {getFieldError('password_confirmation') && (
                  <div className="text-red-500 text-sm mt-1">
                    {getFieldError('password_confirmation')}
                  </div>
                )}
              </FormControl>
            </center>
          </div>

          <div className="text-center">
            <ButtonContained
              width={120}
              padding={10}
              type="submit"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Registering...' : 'Register'}
            </ButtonContained>
          </div>
        </form>
      </GlobalCard>
    </FormWrapper>
  );
};

export default RegisterForm;