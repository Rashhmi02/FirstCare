import React, { useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Navigation from '../component/Nav/Navigation'
import Box from '@mui/material/Box';
import Home from '../component/Pages/Home';
import { styled, useTheme } from '@mui/material/styles';
import '../css/Style.css'

import CssBaseline from '@mui/material/CssBaseline';
import ManageBranch from '../component/Pages/ManageBranch';
import AddBranch from '../component/Pages/AddBranch';
import UpdateBranch from '../component/Pages/UpdateBranch';
import EditBranch from '../component/Pages/EditBranch';
import ManageStock from '../component/Pages/ManageStock';
import ViewStock from '../component/Pages/ViewStock';
import ManageBranchStock from '../component/Pages/ManageBranchStock';
import ViewBranchSales from '../component/Pages/ViewBranchSales';
import Dashboard from '../component/Pages/Dashboard';



export default function AdminRoute() {
    const navigate = useNavigate();
    useEffect(() => {
        if (JSON.parse(localStorage.getItem('adminToken')) == null) {
            navigate('/')

        }

    }, [])

    const DrawerHeader = styled('div')(({ theme }) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    }));

    return (
        <div>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <Navigation />
                <Box component="main" sx={{ flexGrow: 1, background: '#f0f1f6', minHeight: '100vh' }}>
                    <DrawerHeader />
                    <Routes>

                        {/* <Route exact path="/" element={<Home />} /> */}
                        <Route exact path="/" element={<Dashboard />} />
                        <Route exact path="/manage-branch" element={<ManageBranch />} />
                        <Route exact path="/add-branch" element={<AddBranch />} />
                        <Route exact path="/manage-stock" element={<ManageStock />} />
                        <Route exact path="/manageBranchStock" element={<ManageBranchStock />} />
                        <Route exact path="/view-stock/:id" element={<ViewStock />} />
                        <Route exact path="/ViewBranchSales/:id" element={<ViewBranchSales />} />
                        <Route exact path="/update-branch/:id" element={<UpdateBranch />} />
                        <Route exact path="/edit-branch/:id" element={<EditBranch />} />




                    </Routes>
                </Box>

            </Box>
        </div>
    )
}
