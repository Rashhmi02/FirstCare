


import React, { useState, useEffect } from 'react';
import { Box, Paper, Grid, TextField, Button, Snackbar, Alert, Card, CardContent } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Link, useNavigate } from 'react-router-dom';
import Axios from 'axios';
import config from '../../../../config';
import Autocomplete from '@mui/material/Autocomplete';

export default function AddSales() {
    const host = config.host;
    const navigate = useNavigate();

    const [salesDetails, setSalesDetails] = useState({
        name: '',
        phoneNumber: '',
        medicineName: '',
        quantity: '',
    });
    const [open, setOpen] = useState(false);
    const [errors, setErrors] = useState({});
    const [medicineData, setMedicineData] = useState([]);
    const [selectedMedicine, setSelectedMedicine] = useState(null);

    useEffect(() => {
        const tokens = JSON.parse(localStorage.getItem('userToken'));

        Axios.get(`${host}/api/medi/getMedicine`, { headers: { 'auth-token': tokens } })
            .then((res) => {
                if (res.data) {
                    setMedicineData(res.data);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const handleSalesDetails = (e, newValue) => {
        const name = e.target.name || 'medicineName';
        const value = e.target.value || newValue;

        if (name === 'medicineName') {
            const selected = medicineData.find(med => med.medicineName === value);
            setSelectedMedicine(selected);
        }

        setSalesDetails({ ...salesDetails, [name]: value });
        setErrors((prev) => ({
            ...prev,
            [name]: ""
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        let isValid = true;

        if (!salesDetails.name) {
            newErrors.name = 'Name is required';
            isValid = false;
        }
        if (!salesDetails.phoneNumber) {
            newErrors.phoneNumber = 'Phone Number is required';
            isValid = false;
        }

        if (!salesDetails.medicineName) {
            newErrors.medicineName = 'Medicine Name is required';
            isValid = false;
        }

        if (!salesDetails.quantity) {
            newErrors.quantity = 'Quantity is required';
            isValid = false;
        } else if (selectedMedicine && parseInt(salesDetails.quantity, 10) > selectedMedicine.quantity) {
            newErrors.quantity = `Quantity should not exceed available quantity of ${selectedMedicine.quantity}`;
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = () => {
        const tokens = JSON.parse(localStorage.getItem('userToken'));

        if (!validateForm()) {
            return;
        }

        Axios.post(`${host}/api/sales/salesInsert`, salesDetails, { headers: { 'auth-token': tokens } })
            .then((res) => {
                if (res.data) {
                    setOpen(true);
                    setSalesDetails({
                        name: '',
                        phoneNumber: '',
                        medicineName: '',
                        quantity: '',
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
                    <p style={{ color: 'rgb(82, 95, 127)', fontWeight: '400', fontSize: '15px' }}>Insert User Details</p>
                    <Link to='/branch/manage-sales'><Button size='small' endIcon={<ArrowForwardIosIcon />}>View Sales</Button></Link>
                </Box>

                <Card variant="outlined" sx={{ margin: '20px', padding: '20px', backgroundColor: '#ffdab9' }}>
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    id="outlined-basic"
                                    label="Name"
                                    name='name'
                                    value={salesDetails.name}
                                    onChange={handleSalesDetails}
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    error={!!errors.name}
                                    helperText={errors.name}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    id="outlined-basic"
                                    label="Phone Number"
                                    name='phoneNumber'
                                    value={salesDetails.phoneNumber}
                                    onChange={handleSalesDetails}
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    error={!!errors.phoneNumber}
                                    helperText={errors.phoneNumber}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Autocomplete
                                    options={medicineData.map(medicine => medicine.medicineName)}
                                    value={salesDetails.medicineName}
                                    onChange={(e, newValue) => handleSalesDetails(e, newValue)}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Medicine Name"
                                            name='medicineName'
                                            variant="outlined"
                                            size="small"
                                            error={!!errors.medicineName}
                                            helperText={errors.medicineName}
                                        />
                                    )}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    id="outlined-basic"
                                    label="Quantity"
                                    name='quantity'
                                    value={salesDetails.quantity}
                                    onChange={handleSalesDetails}
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    error={!!errors.quantity}
                                    helperText={errors.quantity}
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
                    User Info Inserted!
                </Alert>
            </Snackbar>
        </div>
    );
}
