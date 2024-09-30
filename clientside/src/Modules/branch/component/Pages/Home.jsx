import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, IconButton } from '@mui/material';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import HealingIcon from '@mui/icons-material/Healing';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { styled } from '@mui/material/styles';
import home1 from './Image/home1.jpg';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import config from '../../../../config';
import SalesScatterPlot from './SalesScatterPlot';
import SalesOverTime from './SalesOverTime';
import { TrendingUp } from '@mui/icons-material';



const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  height: '100%',
}));

const PageContainer = styled(Box)({
  // backgroundImage: `url(${home1})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
});

export default function Home() {
  const host = config.host;

  const [salesData, setSalesData] = useState([]);
  const [allData,setAllData]=useState({});



  useEffect(()=>{
    const tokens = JSON.parse(localStorage.getItem('userToken'));

    axios.get(`${host}/api/branch/getDashboardDetails`,{
      headers: { 'auth-token': tokens }})
    .then((res)=>{
      console.log(res.data)
      setAllData(res.data)
  })
    .catch((err)=>{
      console.log(err)
    })
  },[])

  console.log(allData)

  useEffect(() => {
    // Fetch sales data from your backend
    const tokens = JSON.parse(localStorage.getItem('userToken'));

    const fetchSalesData = async () => {
      try {
        const response = await axios.get(`${host}/api/sales/getSales`, {
          headers: { 'auth-token': tokens },
        }); // Update with your API endpoint
        setSalesData(response.data);
        console.log(response.data, 'sales');
      } catch (error) {
        console.error('Error fetching sales data:', error);
      }
    };

    fetchSalesData();
  }, [host]);

  // Transform data for the graph
  const transformedData = salesData.reduce((acc, sale) => {
    const date = new Date(sale.createdAt).toLocaleDateString();
    const existingEntry = acc.find(entry => entry.date === date);
    if (existingEntry) {
      existingEntry.total += sale.total;
    } else {
      acc.push({ date, total: sale.total });
    }
    return acc;
  }, []);

  return (
    <PageContainer>
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant='h5' sx={{mb:2}}>Dashboard</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <StyledPaper>
              <IconButton color="primary" aria-label="medicine">
                <LocalPharmacyIcon fontSize="large" />
              </IconButton>
              <Typography variant="h6">Total Medicine</Typography>
              <Typography variant='h5' color='primary'>{allData.medicineCount}</Typography>
            </StyledPaper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <StyledPaper>
              <IconButton color="primary" aria-label="sales">
                <TrendingUp fontSize="large" />
              </IconButton>
              <Typography variant="h6">Total Sales</Typography>
              <Typography variant='h5' color='primary'>{allData.salesCount}</Typography>
            </StyledPaper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StyledPaper>
              <IconButton color="primary" aria-label="reports">
                <AssessmentIcon fontSize="large" />
              </IconButton>
              <Typography variant="h6">Branch Request</Typography>
              <Typography variant='h5' color='primary'>{allData.requestCount}</Typography>
            </StyledPaper>
          </Grid>

          <Grid item xs={12} md={12}>
            <Box sx={{mb:2}}>
              <Typography variant="h5" >Sales Data</Typography>
            </Box>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                width={500}
                height={300}
                data={transformedData}
                margin={{
                  top: 5, right: 30, left: 20, bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Grid>
        </Grid>

      </Box>
    </PageContainer>
  );
}
