import React from 'react';
import { Box, Typography, Grid, Paper, IconButton } from '@mui/material';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import HealingIcon from '@mui/icons-material/Healing';
import { styled } from '@mui/material/styles';
import home1 from './Image/home1.png';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  height: '100%',
}));

const PageContainer = styled(Box)({
  backgroundImage: `url(${home1})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
});

export default function Home() {
  return (
    <PageContainer>
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <StyledPaper>
              <IconButton color="primary" aria-label="pharmacy">
                <LocalPharmacyIcon fontSize="large" />
              </IconButton>
              <Typography variant="h6">Pharmacy</Typography>
              <Typography>Manage all pharmacy-related tasks.</Typography>
            </StyledPaper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StyledPaper>
              <IconButton color="primary" aria-label="medical services">
                <MedicalServicesIcon fontSize="large" />
              </IconButton>
              <Typography variant="h6">Medical Services</Typography>
              <Typography>Access and manage medical services.</Typography>
            </StyledPaper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StyledPaper>
              <IconButton color="primary" aria-label="healing">
                <HealingIcon fontSize="large" />
              </IconButton>
              <Typography variant="h6">Healing</Typography>
              <Typography>Overview of healing products.</Typography>
            </StyledPaper>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
}