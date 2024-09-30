import React, { useState, useEffect } from 'react';
import { Box, Paper, Grid, TextField, Button, Snackbar, Alert, Card, CardContent, Autocomplete } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import config from '../../../../config';

export default function AddBatch() {
    const host = config.host;
    const navigate = useNavigate();
    const [medicines, setMedicines] = useState([]);
    const [selectedMedicine, setSelectedMedicine] = useState(null); // Add state for selected medicine
    const [medicineDetails, setMedicineDetails] = useState({
        medicine: '',
        price: '',
        batchNumber: '',
        quantity: '',
        manufactureDate: '',
        expiryDate: '',
    });
    const [open, setOpen] = useState(false);
    const [errors, setErrors] = useState({});
    const [existingBatchNumbers, setExistingBatchNumbers] = useState([]);


    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const handleMedicineDetails = (e) => {
        setMedicineDetails({ ...medicineDetails, [e.target.name]: e.target.value });
        setErrors((prev) => ({
            ...prev,
            [e.target.name]: ""
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        let isValid = true;
    
        if (!medicineDetails.medicine) {
            newErrors.medicine = 'Medicine name is required';
            isValid = false;
        }
        if (!medicineDetails.price) {
            newErrors.price = 'Price is required';
            isValid = false;
        }
        if (!medicineDetails.batchNumber) {
            newErrors.batchNumber = 'Batch Number is required';
            isValid = false;
        } else if (existingBatchNumbers.includes(medicineDetails.batchNumber)) {
            newErrors.batchNumber = 'Batch Number already exists';
            isValid = false;
        }
        if (!medicineDetails.quantity) {
            newErrors.quantity = 'Quantity is required';
            isValid = false;
        }
        if (!medicineDetails.manufactureDate) {
            newErrors.manufactureDate = 'Manufacture Date is required';
            isValid = false;
        }
        if (!medicineDetails.expiryDate) {
            newErrors.expiryDate = 'Expiry Date is required';
            isValid = false;
        } else if (medicineDetails.expiryDate <= medicineDetails.manufactureDate) {
            newErrors.expiryDate = 'Expiry Date must be later than Manufacture Date';
            isValid = false;
        }
    
        setErrors(newErrors);
        return isValid;
    };
    

    useEffect(() => {
        const tokens = JSON.parse(localStorage.getItem('userToken'));

        Axios.get(`${host}/api/medi/getMedicine`, { headers: { 'auth-token': tokens } })
            .then((res) => {
                setMedicines(res.data);
            })
            .catch((err) => {
                console.log(err);
            });


            Axios.get(`${host}/api/branch/getBatchNumbers`, { headers: { 'auth-token': tokens } }) // Fetch existing batch numbers for the user
            .then((res) => {
                setExistingBatchNumbers(res.data.map(batch => batch.batchNumber));
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const handleSubmit = () => {
        const tokens = JSON.parse(localStorage.getItem('userToken'));

        if (!validateForm()) {
            return;
        }

        Axios.post(`${host}/api/branch/medicineBatchInsert`, medicineDetails, { headers: { 'auth-token': tokens } })
            .then((res) => {
                if (res.data) {
                    setOpen(true);
                    setSelectedMedicine(null); // Reset selected medicine
                    setMedicineDetails({
                        medicine: '', // Reset medicine as well
                        price: '',
                        batchNumber: '',
                        quantity: '',
                        manufactureDate: '',
                        expiryDate: '',
                    });
                    setTimeout(() => {
                        // navigate('/branch/manage-medicine');
                    }, 1000);
                } else {
                    console.log("some error occurred");
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <div>
            <Paper>
                <Box sx={{ backgroundColor: '#DEECFF', padding: '2px 15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ color: 'rgb(82, 95, 127)', fontWeight: '400', fontSize: '15px' }}>Insert New Medicine Batch Details</p>
                </Box>

                <Card variant="outlined" sx={{ padding: '10px', backgroundColor: '#FAF9F9' }}>
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Autocomplete
                                    options={medicines}
                                    getOptionLabel={(option) => option.medicineName}
                                    value={selectedMedicine} // Controlled value for Autocomplete
                                    onChange={(event, value) => {
                                        setSelectedMedicine(value);
                                        setMedicineDetails({
                                            ...medicineDetails,
                                            medicine: value ? value._id : '' // Set the medicine when a medicine is selected
                                        });
                                        setErrors((prev) => ({
                                            ...prev,
                                            medicine: ""
                                        }));
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Medicine Name"
                                            name='medicineName'
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            error={!!errors.medicine}
                                            helperText={errors.medicine}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    type='number'
                                    label="Price"
                                    name='price'
                                    value={medicineDetails.price}
                                    onChange={handleMedicineDetails}
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    error={!!errors.price}
                                    helperText={errors.price}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Batch Number"
                                    name='batchNumber'
                                    value={medicineDetails.batchNumber}
                                    onChange={handleMedicineDetails}
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    error={!!errors.batchNumber}
                                    helperText={errors.batchNumber}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Quantity"
                                    name='quantity'
                                    value={medicineDetails.quantity}
                                    onChange={handleMedicineDetails}
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    error={!!errors.quantity}
                                    helperText={errors.quantity}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Manufacture Date"
                                    name='manufactureDate'
                                    type='date'
                                    value={medicineDetails.manufactureDate}
                                    onChange={handleMedicineDetails}
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    error={!!errors.manufactureDate}
                                    helperText={errors.manufactureDate}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Expiry Date"
                                    name='expiryDate'
                                    type='date'
                                    value={medicineDetails.expiryDate}
                                    onChange={handleMedicineDetails}
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    error={!!errors.expiryDate}
                                    helperText={errors.expiryDate}
                                    InputLabelProps={{ shrink: true }}
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
                    New Medicine Batch Inserted!
                </Alert>
            </Snackbar>
        </div>
    );
}
