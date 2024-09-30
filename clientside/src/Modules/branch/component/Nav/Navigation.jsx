import React, { useState, useEffect } from 'react';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import GroupIcon from '@mui/icons-material/Group';
import FeedbackIcon from '@mui/icons-material/Feedback';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import LogoutIcon from '@mui/icons-material/Logout';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import config from '../../../../config';
import axios from 'axios';
import { TrendingUp } from '@mui/icons-material';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import StreetviewOutlinedIcon from '@mui/icons-material/StreetviewOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import AddToQueueOutlinedIcon from '@mui/icons-material/AddToQueueOutlined';
import { Button } from '@mui/material';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
  backgroundColor: theme.palette.secondary.main, // Light blue background
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Blue color
    },
    secondary: {
      main: '#b3e5fc', // Light blue color
    },
  },
});

export default function Navigation() {
  const host = config.host;
  const location = useLocation();
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState('');
  const [loginBranch, setLoginBranch] = useState('');
  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const currentRoute = location.pathname;

    if (currentRoute.includes('/branch/manage-medicine')) {
      setActiveItem('Manage Medicine');
    }
    else if (currentRoute.includes('/branch/add-medicine')) {
      setActiveItem('Manage Medicine');
    } else if (currentRoute.includes('/branch/manage-stock')) {
      setActiveItem('Manage Stock');
    } else if (currentRoute.includes('/branch/manage-sales')) {
      setActiveItem('Manage Sales');
    } else if (currentRoute.includes('/branch/view-sales')) {
      setActiveItem('View Sales');
    } else if (currentRoute.includes('/branch/branchStocks')) {
      setActiveItem('Branch Stocks');
    } else if (currentRoute.includes('/branch/ViewBranchMedicine')) {
      setActiveItem('Branch Stocks');
    } else if (currentRoute.includes('/branch/allRequestStatus')) {
      setActiveItem('View Request');
    } else if (currentRoute.includes('/branch/')) {
      setActiveItem('Dashboard');
    } else {
      setActiveItem('Dashboard');
    }
  }, [location.pathname]);

  const sideBarList = [
    { title: 'Dashboard', path: '/branch/', icon: <DashboardOutlinedIcon sx={{ fontSize: 24 }} /> },
    { title: 'Manage Medicine', path: '/branch/manage-medicine', icon: <LocalHospitalIcon sx={{ fontSize: 24 }} /> },
    { title: 'Manage Stock', path: '/branch/manage-stock', icon: <GroupIcon sx={{ fontSize: 24 }} /> },
    { title: 'Manage Sales', path: '/branch/manage-sales', icon: <TrendingUp sx={{ fontSize: 24 }} /> },
    { title: 'View Sales', path: '/branch/view-sales', icon: <StreetviewOutlinedIcon sx={{ fontSize: 24 }} /> },
    { title: 'Branch Stocks', path: '/branch/branchStocks', icon: <Inventory2OutlinedIcon sx={{ fontSize: 24 }} /> },
    { title: 'View Request', path: '/branch/allRequestStatus', icon: <AddToQueueOutlinedIcon sx={{ fontSize: 24 }} /> },
    // { title: 'Reports', path: '/branch/reports', icon: <FeedbackIcon sx={{ fontSize: 24 }} /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    // Logic for logout
    navigate('/');
  };

  const tokens = JSON.parse(localStorage.getItem('userToken'));

  useEffect(() => {
    axios.get(`${host}/api/branch/getLoginBranch`, { headers: { 'auth-token': tokens } })
      .then((res) => {
        console.log(res.data, 987654);
        setLoginBranch(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [tokens, host]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ color: 'gray', fontWeight: '500' }}>
            Branch Dashboard
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
        
          <Typography variant='body1' color='error' sx={{textTransform:'uppercase'}}>{loginBranch.branchName} | </Typography>
          <Button  onClick={handleLogout} startIcon={<LogoutIcon sx={{ color: 'gray' }} />}>Logout</Button>
          {/* <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon sx={{ color: 'gray' }} />
          </IconButton> */}
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" open={open}>
        <Box className="sidebar-body">

          <DrawerHeader>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {/* <LocalHospitalIcon sx={{ fontSize: '29px', color: theme.palette.primary.main }} /> */}
              <HealthAndSafetyIcon sx={{ color: 'red', fontSize: '31px' }} />
              <Typography variant="h6" sx={{ ml: 1, fontSize: '29px', fontWeight: '600' }}  >FirstCare</Typography>
            </Box>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </DrawerHeader>
          <List>
            {sideBarList.map((item) => (
              <ListItem key={item.title} disablePadding sx={{ display: 'block' }}>
                <Link to={item.path} style={{ textDecoration: 'none', color: 'black' }}>
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? 'initial' : 'center',
                      px: 2.5,
                      border: activeItem === item.title ? '1px solid #DEECFF' : 'inherit',

                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                        // color: theme.palette.primary.main,
                        color: activeItem === item.title ? 'white' : 'inherit',
                        backgroundColor: 'rgba(194, 244, 219, 0.12)',
                        padding: '4px',
                        fontSize: '80px',
                        borderRadius: '3px',

                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      color='primary'
                      primary={item.title}
                      sx={{ opacity: open ? 1 : 0, color: activeItem === item.title ? 'white' : 'inherit', }}
                    />
                  </ListItemButton>
                </Link>
              </ListItem>
            ))}
          </List>
        </Box>

      </Drawer>
    </ThemeProvider>
  );
}
