import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navigation from '../component/Nav/Navigation';
import Box from '@mui/material/Box';
import Home from '../component/Pages/Home';
import { styled } from '@mui/material/styles';
import '../css/Style.css';

import CssBaseline from '@mui/material/CssBaseline';
import LoginBranch from '../component/Pages/LoginBranch';
import Search from '../component/Pages/Search';
import UserInfo from '../component/Pages/UserInfo';
import LoginAdmin from '../component/Pages/LoginAdmin';



export default function UserRoute() {

  const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  }));
  
  return (
    <div>
      <Box >
        {/* <CssBaseline /> */}
        <Navigation />
        {/* <Box component="main" sx={{ flexGrow: 1, p: 3, background: '#f0f1f6' }}> */}
          {/* <DrawerHeader /> */}
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/login-branch" element={<LoginBranch />} />
            <Route exact path="/login-admin" element={<LoginAdmin />} />

            <Route exact path="/search" element={<Search/>} />
            <Route exact path="/userInfo" element={<UserInfo/>} />


            

            
          </Routes>
        </Box>
      {/* </Box> */}
    </div>
  );
}
