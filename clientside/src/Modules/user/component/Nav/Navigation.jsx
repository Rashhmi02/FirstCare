// Navigation.jsx
import React, { useState, useEffect } from 'react';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import { Link, useLocation } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  palette: {
    primary: {
      main: '#f44336 ', // Teal color
    },
    secondary: {
      main: '#ff9e80', // Cyan color
    },
  },
});

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
   // Use secondary main color for the background
  color: '#000', // Black text color
  padding: '5px 0',
}));

export default function Navigation() {
  // const location = useLocation();
  // const [activeItem, setActiveItem] = useState(location.pathname);

  // useEffect(() => {
  //   const currentRoute = location.pathname;
  //   setActiveItem(currentRoute);
  // }, [location.pathname]);
  const location = useLocation();
  const [activeItem, setActiveItem] = useState('');

  useEffect(() => {
    const currentRoute = location.pathname;

    if (currentRoute.includes('/admin/home')) {
      setActiveItem('Home');
    } else if (currentRoute.includes('/login-branch')) {
      setActiveItem('LoginBranch');
    } else {
      setActiveItem('home');
    }
  }, [location.pathname]);

  const navLinks = [
    { title: 'Home', path: '/' },
    

  ];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <StyledAppBar position="fixed">
        <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {/* <LocalHospitalIcon sx={{ fontSize: '29px', color: theme.palette.primary.main }} /> */}
              <HealthAndSafetyIcon sx={{ color: 'red', fontSize: '31px' }} />
              <Typography variant="h6" sx={{ ml: 1, fontSize: '29px', fontWeight: '600' }}  >FirstCare</Typography>
            </Box>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'end' }}>
            {navLinks.map((item) => (
              <Link 
                key={item.title} 
                to={item.path} 
                style={{ 
                  marginRight:30,
                  textDecoration: 'none', 
                  color: activeItem === item.path ? '#fff' : '#000', 
                  fontWeight: '500' 
                }}
                onClick={() => setActiveItem(item.path)}
              >
                <Typography variant="body1">
                  {item.title}
                </Typography>
              </Link>
            ))}
          </Box>
       
        </Toolbar>
      </StyledAppBar>
      <Toolbar />
    </ThemeProvider>
  );
}
