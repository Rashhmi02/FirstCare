import React, { useState } from 'react';
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Typography,
  Container,
  Box,
  Snackbar,
  Alert,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import config from '../../../../config.js'; // Update the path to your config file
import bgimg from '../../../image/bgimg.jpg';

const theme = createTheme();

const StyledContainer = styled(Container)({
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  padding: '30px',
  borderRadius: '15px',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  textAlign: 'center',
});

const StyledButton = styled(Button)({
  background: 'linear-gradient(to right, #4caf50, #81c784)',
  color: '#fff',
});

export default function LoginAdmin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 'success' or 'error'
  const navigate = useNavigate();
  const host = config.host;

  const validateForm = () => {
    let isValid = true;
    if (!username) {
      setUsernameError('Username is required');
      isValid = false;
    } else {
      setUsernameError('');
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

    Axios.post(`${host}/api/admin/adminLogin`, { username, password })
      .then((res) => {
        if (res.data.success) {
          setSnackbarMessage('Login Successful');
          setSnackbarSeverity('success');
          setSnackbarOpen(true);
          localStorage.setItem('adminToken', JSON.stringify(res.data.token));
          setTimeout(() => {
            navigate('/admin'); // Redirect to the dashboard or any other page
          }, 1000);
        } else {
          setSnackbarMessage(res.data.message);
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
        }
      })
      .catch((err) => {
        setSnackbarMessage('An error occurred during login');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        console.log('Error:', err);
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
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Admin Log in
            </Typography>
            <StyledContainer component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={handleFieldChange(setUsername, setUsernameError)}
                error={!!usernameError}
                helperText={usernameError}
                InputProps={{
                  style: { backgroundColor: 'white' }
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={handleFieldChange(setPassword, setPasswordError)}
                error={!!passwordError}
                helperText={passwordError}
                InputProps={{
                  style: { backgroundColor: 'white' }
                }}
              />
              <StyledButton
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Log In
              </StyledButton>
            </StyledContainer>
          </Box>
        </Container>
      </ThemeProvider>

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
}
