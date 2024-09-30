import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

export default function Search() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    console.log('Search Term:', searchTerm);
    // Add your search logic here
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 100, // Adjust this value to control the distance from the top
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        padding: '20px',
        boxShadow: 3,
        borderRadius: 2,
        bgcolor: 'background.paper',
      }}
    >
      <TextField
        label="Search"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ marginRight: '10px' }}
      />
      <Button variant="contained" color="primary" onClick={handleSearch}>
        Search
      </Button>
      
    </Box>
    
  );
}
