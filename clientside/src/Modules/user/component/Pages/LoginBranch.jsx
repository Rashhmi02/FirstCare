import React, { useState } from 'react';
import { Button, TextField, Typography, Container, Box, CssBaseline, Snackbar, Alert } from '@mui/material';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import config from '../../../../config';
import bgimg from '../../../image/bgimg.jpg';

const LoginBranch = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 'success' or 'error'
  const navigate = useNavigate();
  const host = config.host;

  const validateForm = () => {
    let isValid = true;
    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    Axios.post(`${host}/api/branch/branchLogin`, { email, password })
      .then((res) => {
        if (res.data.success) {
          setSnackbarMessage('Login Successful');
          setSnackbarSeverity('success');
          setSnackbarOpen(true);
          localStorage.setItem('userToken', JSON.stringify(res.data.token));
          setTimeout(() => {
            navigate('/branch'); // Redirect to the dashboard or any other page

          }, 1000)
        } else {
          setSnackbarMessage('Incorrect email or password');
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
        }
      })
      .catch((err) => {
        setSnackbarMessage('An error occurred during login');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        console.log('Error:' + err);
      });
  };

  const handleFieldChange = (setter, errorSetter) => (event) => {
    setter(event.target.value);
    if (event.target.value) {
      errorSetter(''); // Clear the error when the user starts typing
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <div style={{
      backgroundImage: `url(${bgimg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 20px',
      overflow: 'hidden',
    }}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent background for the form
            padding: '20px',
            borderRadius: '8px',
            boxShadow: 3,
            width: '100%', // Ensure the Box takes full width of Container
            maxWidth: '400px', // Set a max-width for the Box
          }}
        >
          <Typography variant="h5" component="h1" gutterBottom>
            Branch Login
          </Typography>
          <TextField
            label="Email Address"
            variant="outlined"
            margin="normal"
            fullWidth
            value={email}
            onChange={handleFieldChange(setEmail, setEmailError)}
            error={!!emailError}
            helperText={emailError}
          />
          <TextField
            label="Password"
            variant="outlined"
            margin="normal"
            fullWidth
            type="password"
            value={password}
            onChange={handleFieldChange(setPassword, setPasswordError)}
            error={!!passwordError}
            helperText={passwordError}
          />
          <Button
            variant="contained"
            // color="success"
            fullWidth
            sx={{ mt: 3,background: 'linear-gradient(to right, #4caf50, #81c784)', }}
            onClick={handleSubmit}
          >
            Login
          </Button>
        </Box>
      </Container>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default LoginBranch;
