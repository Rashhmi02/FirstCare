import React from 'react';
import { Box, Grid, Card, CardMedia, CardContent, Typography, Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import img1 from './Image/img1.jpg';
// import img2 from './Image/img2.jpg';
import img2 from '../../../image/pharmacy.webp';
import admin from '../../../image/admin.jpg';
import { Icon } from '@iconify/react';


const PageContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#f5f5f5', // Light background color
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '20px',
}));

const StyledCard = styled(Card)(({ theme }) => ({
  width: 345,
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(10px)',
  borderRadius: '12px',
  boxShadow: theme.shadows[5],
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const WelcomeMessage = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(6),
}));

const StyledLink = styled(Link)(({ theme }) => ({
  textDecoration: 'none', // Remove underline from the Link component
  color: 'inherit', // Ensure link text color matches surrounding text
}));

const Home = () => {
  return (
    <PageContainer>
      <Container>
        <WelcomeMessage>
          <Typography variant="h2" component="h1" gutterBottom>
            Welcome To First Care
          </Typography>
          <Typography variant="h5" component="h2">
            Your one-stop solution for all medicinal needs
          </Typography>
        </WelcomeMessage>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={4} justifyContent="center">
            <Grid item>
              <StyledLink to="/login-admin">
                <StyledCard>
                  <CardMedia
                    component="img"
                    alt="Admin"
                    height="140"
                    image={admin}
                    title="Admin"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      Admin
                    </Typography>
                  </CardContent>
                </StyledCard>
              </StyledLink>
            </Grid>
            <Grid item>
              <StyledLink to="/login-branch">
                <StyledCard>
                  <CardMedia
                    component="img"
                    alt="Branch"
                    height="140"
                    image={img2}
                    title="Branch"
                  />
                  {/* <Box sx={{py:7,display:'flex',justifyContent:'center'}}>
                    <Icon icon="fa6-solid:notes-medical" style={{ fontSize: '100px' }} />

                  </Box> */}
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      Branch
                    </Typography>
                  </CardContent>
                </StyledCard>
              </StyledLink>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </PageContainer>
  );
};

export default Home;
