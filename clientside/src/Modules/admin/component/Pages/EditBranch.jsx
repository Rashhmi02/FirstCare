import React, { useState, useEffect } from 'react';
import { Box, Paper, Grid, TextField, Button, IconButton, Snackbar, Alert, Card, CardContent } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Axios from 'axios';
import config from '../../../../config';

export default function AddBranch() {
  const { id } = useParams();

  const host = config.host;
  const navigate = useNavigate();
  const [branchDetails, setBranchDetails] = useState({
    branchName: '',
    phoneNumber: '',
    email: '',
    address: '',
    new_password: ''
  });
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    Axios.get(`${host}/api/branch/GetSingleBranch/${id}`)
      .then((res) => {
        if (res.data) {
          console.log('Fetched Data:', res.data);
          setBranchDetails(res.data);
        }
      })
      .catch((err) => {
        console.log('Error fetching data:', err);
      });
  }, [id]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleBranchDetails = (e) => {
    setBranchDetails({ ...branchDetails, [e.target.name]: e.target.value });
    setErrors((prev) => ({
      ...prev,
      [e.target.name]: ""
    }));
  }

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!branchDetails.branchName) {
      newErrors.branchName = 'Branch name is required';
      isValid = false;
    }
    if (!branchDetails.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
      isValid = false;
    }
    if (!branchDetails.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    }
    if (!branchDetails.address) {
      newErrors.address = 'Address is required';
      isValid = false;
    }


    setErrors(newErrors);
    return isValid;
  };




  const handleSubmit = () => {
    Axios.put(`${host}/api/branch/updateBranch/${id}`, branchDetails)
      .then((res) => {
        if (res.data) {
          // alert('Updated Successfully');
          setOpen(true);
          setTimeout(() => {
            navigate('/admin/manage-branch');

          }, 1000)
        }
      })
      .catch((err) => {
        console.log('Error updating data:', err);
      });
  };

  return (
    <div style={{ minHeight: '100vh', padding: '20px' }}>
      <Paper>
        <Box sx={{ backgroundColor: '#DEECFF', padding: '2px 15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ color: 'rgb(82, 95, 127)', fontWeight: '400', fontSize: '15px' }}>Insert Branch Details</p>
          <Link to='/admin/manage-branch'><Button size='small' endIcon={<ArrowForwardIosIcon />}>View Branch</Button></Link>
        </Box>

        <Card variant="outlined" >
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  id="outlined-basic"
                  label="Branch Name"
                  name='branchName'
                  value={branchDetails.branchName}
                  onChange={handleBranchDetails}
                  variant="outlined"
                  size="small"
                  fullWidth
                  error={!!errors.branchName}
                  helperText={errors.branchName}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="outlined-basic"
                  label="Phone Number"
                  name='phoneNumber'
                  value={branchDetails.phoneNumber}
                  onChange={handleBranchDetails}
                  variant="outlined"
                  size="small"
                  fullWidth
                  error={!!errors.phoneNumber}
                  helperText={errors.phoneNumber}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="outlined-basic"
                  label="Email"
                  name='email'
                  value={branchDetails.email}
                  onChange={handleBranchDetails}
                  variant="outlined"
                  size="small"
                  fullWidth
                  error={!!errors.email}
                  helperText={errors.email}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="outlined-basic"
                  label="Address"
                  name='address'
                  value={branchDetails.address}
                  onChange={handleBranchDetails}
                  variant="outlined"
                  size="small"
                  fullWidth
                  error={!!errors.address}
                  helperText={errors.address}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="outlined-basic"
                  label="Password"
                  name='new_password'
                  type='password'
                  // value={branchDetails.password}
                  onChange={handleBranchDetails}
                  variant="outlined"
                  size="small"
                  fullWidth
                // error={!!errors.password}
                // helperText={errors.password}
                />
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
              <Box sx={{ p: 3, width: '400px' }}>
                <Button variant='contained' color='primary' fullWidth onClick={handleSubmit}>Submit</Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Paper>

      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleClose}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Branch Updated!
        </Alert>
      </Snackbar>
    </div>
  );
}
