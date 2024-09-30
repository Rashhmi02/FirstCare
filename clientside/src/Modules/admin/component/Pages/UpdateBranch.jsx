// import React from 'react'

// export default function UpdateBranch() {
//   return (
//     <div>
      
//     </div>
//   )
// }

import React, { useState } from 'react';
import { Box, Paper, Grid, TextField, Button, IconButton, Snackbar, Alert, Card, CardContent } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Link , useNavigate } from 'react-router-dom';
import Axios from 'axios';
import config from '../../../../config';

export default function UpdateBranch() {
    const host = config.host;
    const navigate = useNavigate();
    const [branchDetails, setBranchDetails] = useState({
        branchName: '',
        phoneNumber: '',
        email: '',
        address: '',
        password: ''
    });
    const [open, setOpen] = useState(false);
    const [errors, setErrors] = useState({});

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
        if (!branchDetails.password) {
            newErrors.password = 'Password is required';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = () => {
        if (!validateForm()) {
            return;
        }

        Axios.post(`${host}/api/branch/branchInsert`, branchDetails)
            .then((res) => {
                if (res.data) {
                    setOpen(true);
                    setBranchDetails({
                        branchName: '',
                        phoneNumber: '',
                        email: '',
                        address: '',
                        password: ''
                    });
                } else {
                    console.log("some error occurred");
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <div style={{ height: '100%', backgroundColor: '#ffe5b4', padding: '20px' }}>
            <Paper>
                <Box sx={{ backgroundColor: '#f0f1f6', padding: '2px 15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ color: 'rgb(82, 95, 127)', fontWeight: '400', fontSize: '15px' }}>Insert Branch Details</p>
                    <Link to='/admin/manage-branch'><Button size='small' endIcon={<ArrowForwardIosIcon />}>View Branch</Button></Link>
                </Box>

                <Card variant="outlined" sx={{ margin: '20px', padding: '20px', backgroundColor: '#ffdab9' }}>
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
                                    name='password'
                                    type='password'
                                    value={branchDetails.password}
                                    onChange={handleBranchDetails}
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    error={!!errors.password}
                                    helperText={errors.password}
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
                    Branch Inserted!
                </Alert>
            </Snackbar>
        </div>
    );
}
