import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Axios from 'axios';
// import Swal from 'sweetalert2';
import config from '../../../../config';
import { Box, TextField, Button, Typography } from '@mui/material';

export default function EditBranch() {
    const { id } = useParams();
    const navigate = useNavigate();
    const host = config.host;
    const [data, setData] = useState({});
  
    useEffect(() => {
      Axios.get(`${host}/api/branch/GetSingleBranch/${id}`)
        .then((res) => {
          if (res.data) {
            console.log('Fetched Data:', res.data);
            setData(res.data);
          }
        })
        .catch((err) => {
          console.log('Error fetching data:', err);
        });
    }, [id]);

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const onSubmit = () => {
        Axios.put(`${host}/api/branch/updateBranch/${id}`, data)
          .then((res) => {
            if (res.data) {
              alert('Updated Successfully');
              navigate('/admin/manage-branch');
            }
          })
          .catch((err) => {
            console.log('Error updating data:', err);
          });
      };

      return (
        <Box
          height="100vh"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          sx={{ backgroundColor: 'pink' }}
        >
          <Box textAlign="center" mb={4}>
            <Typography variant="h3" gutterBottom>
              Edit Branch
            </Typography>
            <Box
              height={400}
              width={400}
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              p={2}
              sx={{ backgroundColor: 'white', borderRadius: 1 }}
            >
              
              <TextField
                id="outlined-basic"
                
                name="branchName"
                variant="outlined"
                value={data.branchName}
                onChange={handleChange}
                sx={{ marginBottom: 2, width: '100%' }}
              />
              <TextField
                id="outlined-basic"
                
                name="phoneNumber"
                variant="outlined"
                value={data.phoneNumber}
                onChange={handleChange}
                sx={{ marginBottom: 2, width: '100%' }}
              />
              <TextField
                id="outlined-basic"
                
                name="email"
                variant="outlined"
                value={data.email}
                onChange={handleChange}
                sx={{ marginBottom: 2, width: '100%' }}
              />
              
              <TextField
                id="outlined-basic"
                
                name="address"
                variant="outlined"
                value={data.address}
                onChange={handleChange}
                sx={{ marginBottom: 2, width: '100%' }}
              />
              <TextField
                id="outlined-basic"
                
                name="password"
                variant="outlined"
                value={data.password}
                onChange={handleChange}
                sx={{ marginBottom: 2, width: '100%' }}
              />
              <Button variant="contained" onClick={onSubmit}>
                Update
              </Button>
            </Box>
          </Box>
        </Box>
      );
    }
    
    