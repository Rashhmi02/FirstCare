import React from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';

const services = [
  { name: 'General Consultation', description: 'A complete health check-up with a certified physician.', price: '$50' },
  { name: 'Dental Check-up', description: 'Comprehensive dental examination including X-rays.', price: '$80' },
  { name: 'Eye Examination', description: 'Vision tests and eye health assessments by an optometrist.', price: '$40' },
  { name: 'Physiotherapy', description: 'Treatment and rehabilitation for musculoskeletal issues.', price: '$100' },
  { name: 'Vaccination', description: 'Administration of vaccines to prevent diseases.', price: '$20' }
];

const HealthCareServices = () => {
  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Healthcare Services
      </Typography>
      <Grid container spacing={3}>
        {services.map((service, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div">
                  {service.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {service.description}
                </Typography>
                <Typography variant="h6" color="primary" style={{ marginTop: '10px' }}>
                  {service.price}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default HealthCareServices;
