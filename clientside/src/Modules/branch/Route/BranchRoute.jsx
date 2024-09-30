import React ,{useEffect} from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Navigation from '../component/Nav/Navigation';
import Box from '@mui/material/Box';
import Home from '../component/Pages/Home';
import { styled } from '@mui/material/styles';
import '../css/Style.css';
import CssBaseline from '@mui/material/CssBaseline';
import ManageMedicine from '../component/Pages/ManageMedicine';
import ManageStock from '../component/Pages/ManageStock';
import ManageSales from '../component/Pages/ManageSales';
import Reports from '../component/Pages/Reports';
import AddMedicine from '../component/Pages/AddMedicine';
import AddSales from '../component/Pages/AddSales';
import EditMedicine from '../component/Pages/EditMedicine';
import AddBatch from '../component/Pages/AddBatch';
import SalesPage from '../component/Pages/SalesPage';
import ViewSales from '../component/Pages/ViewSales';
import BranchStocks from '../component/Pages/BranchStocks';
import ViewBranchMedicine from '../component/Pages/ViewBranchMedicine';
import ViewRequest from '../component/Pages/ViewRequest';
import AllRequestStatus from '../component/Pages/AllRequestStatus';
import Dashboard from '../component/Pages/Dashboard';
import SalesScatterPlot from '../component/Pages/SalesScatterPlot';




export default function BranchRoute() {

  const navigate = useNavigate();
  useEffect(() => {
      if (JSON.parse(localStorage.getItem('userToken')) == null) {
          navigate('/')

      }

  }, [])

  const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  }));
  
  return (
    <div>
      <Box sx={{display:'flex'}}>
        <CssBaseline />
        <Navigation />
        <Box component="main" sx={{ flexGrow: 1,px: 1,py:3, background: '#f0f1f6',minHeight:'100vh' }}>
          <DrawerHeader />
          <Routes>
            <Route exact path="/" element={<Home />} />
            {/* <Route exact path="/" element={<Dashboard />} /> */}
            <Route exact path="/SalesScatterPlot" element={<SalesScatterPlot />} />
            <Route exact path="/manage-medicine" element={<ManageMedicine />} />
            <Route exact path="/manage-stock" element={<ManageStock />} />
            <Route exact path="/add-medicine" element={<AddMedicine />} />
            <Route exact path="/edit-medicine/:id" element={<EditMedicine/>} />
            <Route exact path="/add-sales" element={<AddSales />} />
            <Route exact path="/add-batch" element={<AddBatch />} />
            <Route exact path="/manage-sales" element={<SalesPage />} />
            <Route exact path="/view-sales" element={<ViewSales />} />
            <Route exact path="/branchStocks" element={<BranchStocks />} />
            <Route exact path="/ViewBranchMedicine/:id" element={<ViewBranchMedicine />} />
            <Route exact path="/allRequestStatus" element={<AllRequestStatus />} />

            <Route exact path="/manage-sales" element={<ManageSales />} />
            <Route exact path="/reports" element={<Reports />} />
            
            

          </Routes>
        </Box>
      </Box>
    </div>
  );
}
