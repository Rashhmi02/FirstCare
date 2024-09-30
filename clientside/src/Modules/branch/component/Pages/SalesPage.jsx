import React, { useState, useEffect } from 'react';
import {
    Container,
    TextField,
    Button,
    Grid,
    Typography,
    Autocomplete,
    Box,
    Chip,
    CircularProgress,
    Paper,
    Alert,
    Snackbar
} from '@mui/material';
import axios from 'axios';
import config from '../../../../config';
import { useNavigate } from 'react-router-dom';

const SalesPage = () => {
    const host = config.host;
    const navigate = useNavigate();
    const [customerName, setCustomerName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [searchText, setSearchText] = useState('');
    const [selectedMedicines, setSelectedMedicines] = useState([]);
    const [medicineOptions, setMedicineOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [errors, setErrors] = useState({
        customerName: '',
        phoneNumber: '',
        medicineSelection: ''
    });
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');

    useEffect(() => {
        const fetchMedicineBatches = async () => {
            setLoading(true);
            try {
                const tokens = JSON.parse(localStorage.getItem('userToken'));
                const response = await axios.get(`${host}/api/branch/GetAllBatch`, {
                    headers: { 'auth-token': tokens }
                });

                const groupedBatches = response.data.reduce((acc, batch) => {
                    const medicineName = batch.medicine.medicineName;
                    if (!acc[medicineName]) {
                        acc[medicineName] = [];
                    }
                    acc[medicineName].push(batch);
                    return acc;
                }, {});

                const expiringSoon = Object.entries(groupedBatches).map(([name, batches]) => {
                    const expiringSoonBatches = batches.filter(batch => {
                        const expiryDate = new Date(batch.expiryDate);
                        const today = new Date();
                        const thirtyDaysFromNow = new Date(today.setDate(today.getDate() + 150));
                        return expiryDate <= thirtyDaysFromNow;
                    });
                    return { name, batches: expiringSoonBatches };
                });

                const medicineOptions = expiringSoon.flatMap(medicine => (
                    medicine.batches.map(batch => ({
                        id: batch._id,
                        name: medicine.name,
                        batchNumber: batch.batchNumber,
                        quantity: batch.quantity,
                        expiryDate: new Date(batch.expiryDate),
                        price: batch.price
                    }))
                )).sort((a, b) => a.expiryDate - b.expiryDate);

                setMedicineOptions(medicineOptions);
            } catch (error) {
                console.error('Error fetching medicine batches:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMedicineBatches();
    }, []);

    const handleSearchChange = (event, value) => {
        setSearchText(value);
    };

    const handleAddMedicine = (event, newValue) => {
        if (newValue && !selectedMedicines.find(med => med.id === newValue.id)) {
            setSelectedMedicines([...selectedMedicines, { ...newValue, quantity: 1 }]);
            // Clear medicine selection error if a medicine is added
            setErrors(prevErrors => ({ ...prevErrors, medicineSelection: '' }));
        }
    };

    const handleRemoveMedicine = (medicineId) => {
        setSelectedMedicines(selectedMedicines.filter(med => med.id !== medicineId));
    };

    // const handleQuantityChange = (id, quantity) => {
    //     const medicine = selectedMedicines.find(med => med.id === id);
    //     if (medicine) {
    //         const updatedQuantity = Math.max(1, quantity);
    //         if (updatedQuantity > medicine.quantity) {
    //             setAlertMessage(`Quantity exceeds available stock for ${medicine.name}. Available quantity is ${medicine.quantity}.`);
    //             setAlertSeverity('error');
    //             setAlertOpen(true);
    //             return;
    //         }
    //         setSelectedMedicines(selectedMedicines.map(med =>
    //             med.id === id ? { ...med, quantity: updatedQuantity } : med
    //         ));
    //     }
    // };
    const handleQuantityChange = (id, quantity) => {
        const medicineOption = medicineOptions.find(med => med.id === id);
        const selectedMedicine = selectedMedicines.find(med => med.id === id);
    
        if (medicineOption) {
            const updatedQuantity = Math.max(1, quantity);
            if (updatedQuantity > medicineOption.quantity) {
                setAlertMessage(`Quantity exceeds available stock for ${medicineOption.name}. Available quantity is ${medicineOption.quantity}.`);
                setAlertSeverity('error');
                setAlertOpen(true);
                return;
            }
    
            setSelectedMedicines(selectedMedicines.map(med =>
                med.id === id ? { ...med, quantity: updatedQuantity } : med
            ));
        }
    };
    
    

    const handleAlertClose = () => {
        setAlertOpen(false);
    };

    useEffect(() => {
        const calculateTotal = () => {
            const totalAmount = selectedMedicines.reduce((acc, med) => acc + med.price * med.quantity, 0);
            setTotal(totalAmount);
        };
        calculateTotal();
    }, [selectedMedicines]);

    const handleCustomerNameChange = (e) => {
        setCustomerName(e.target.value);
        // Clear error message when input is valid
        if (e.target.value.trim() !== '' && e.target.value.length >= 3) {
            setErrors(prevErrors => ({ ...prevErrors, customerName: '' }));
        } else if (e.target.value.trim() === '') {
            setErrors(prevErrors => ({ ...prevErrors, customerName: 'Customer name is required.' }));
        } else if (e.target.value.length < 3) {
            setErrors(prevErrors => ({ ...prevErrors, customerName: 'Customer name must be at least 3 characters long.' }));
        }
    };

    const handlePhoneNumberChange = (e) => {
        setPhoneNumber(e.target.value);
        // Clear error message when input is valid
        if (e.target.value.trim() !== '' && /^\d{10}$/.test(e.target.value)) {
            setErrors(prevErrors => ({ ...prevErrors, phoneNumber: '' }));
        } else if (e.target.value.trim() === '') {
            setErrors(prevErrors => ({ ...prevErrors, phoneNumber: 'Phone number is required.' }));
        } else if (!/^\d{10}$/.test(e.target.value)) {
            setErrors(prevErrors => ({ ...prevErrors, phoneNumber: 'Phone number must be exactly 10 digits.' }));
        }
    };

    const validateForm = () => {
        let valid = true;
        let newErrors = {
            customerName: '',
            phoneNumber: '',
            medicineSelection: ''
        };

        if (customerName.trim() === '') {
            newErrors.customerName = 'Customer name is required.';
            valid = false;
        } else if (customerName.length < 3) {
            newErrors.customerName = 'Customer name must be at least 3 characters long.';
            valid = false;
        }

        if (phoneNumber.trim() === '') {
            newErrors.phoneNumber = 'Phone number is required.';
            valid = false;
        } else if (!/^\d{10}$/.test(phoneNumber)) {
            newErrors.phoneNumber = 'Phone number must be exactly 10 digits.';
            valid = false;
        }

        if (selectedMedicines.length < 1) {
            newErrors.medicineSelection = 'At least one medicine must be selected.';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        const saleData = {
            customerName,
            phoneNumber,
            medicines: selectedMedicines,
            total
        };

        try {
            const tokens = JSON.parse(localStorage.getItem('userToken'));
            const response = await axios.post(`${host}/api/sales/create`, saleData, {
                headers: { 'auth-token': tokens }
            });
            if (response) {
                setAlertMessage('Sale created successfully.');
                setAlertSeverity('success');
                setAlertOpen(true);
                setTimeout(() => {
                    setAlertOpen(false);
                    navigate('/branch/view-sales');
                }, 1000);
            }
            // Reset form fields and errors
            setCustomerName('');
            setPhoneNumber('');
            setSearchText('');
            setSelectedMedicines([]);
            setTotal(0);
            setErrors({
                customerName: '',
                phoneNumber: '',
                medicineSelection: ''
            });
        } catch (error) {
            console.error('Error creating sale:', error);
            setAlertMessage('Failed to create sale.');
            setAlertSeverity('error');
            setAlertOpen(true);
        }
    };

    return (
        <Container>
            <Paper>
                <Box sx={{ backgroundColor: '#DEECFF', padding: '10px 15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ color: 'rgb(82, 95, 127)', fontWeight: '400' }}>Manage Sales</Typography>
                </Box>

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2} sx={{ py: 4, px: 3 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Customer Name"
                                variant="outlined"
                                value={customerName}
                                onChange={handleCustomerNameChange}
                                error={!!errors.customerName}
                                helperText={errors.customerName}
                                size='small'
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Phone Number"
                                variant="outlined"
                                value={phoneNumber}
                                onChange={handlePhoneNumberChange}
                                error={!!errors.phoneNumber}
                                helperText={errors.phoneNumber}
                                size='small'
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Autocomplete
                                disableClearable
                                options={medicineOptions}
                                getOptionLabel={(option) => `${option.name} (Batch: ${option.batchNumber})`}
                                onChange={handleAddMedicine}
                                value={null}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Search Medicines"
                                        variant="outlined"
                                        value={searchText}
                                        onChange={handleSearchChange}
                                        size='small'
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Box display="flex" flexWrap="wrap">
                                {selectedMedicines.map((medicine) => (
                                    <Chip
                                        key={medicine.id}
                                        label={`${medicine.name} (Batch: ${medicine.batchNumber})`}
                                        onDelete={() => handleRemoveMedicine(medicine.id)}
                                        sx={{ mr: 1, mb: 1 }}
                                    />
                                ))}
                            </Box>
                        </Grid>
                        {errors.medicineSelection && (
                            <Grid item xs={12}>
                                <Alert severity="error">{errors.medicineSelection}</Alert>
                            </Grid>
                        )}
                        <Grid item xs={12}>
                            <Typography variant="h6">Selected Medicines:</Typography>
                            {selectedMedicines.length > 0 ? (
                                <Box mt={2}>
                                    {selectedMedicines.map((medicine, index) => (
                                        <Box key={index} display="flex" alignItems="center" mb={2}>
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                label="Medicine Name"
                                                value={medicine.name}
                                                InputProps={{ readOnly: true }}
                                                size='small'
                                            />
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                label="Batch Number"
                                                value={medicine.batchNumber}
                                                InputProps={{ readOnly: true }}
                                                size='small'
                                            />
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                label="Price"
                                                value={medicine.price}
                                                InputProps={{ readOnly: true }}
                                                size='small'
                                            />
                                            <TextField
                                                fullWidth
                                                type="number"
                                                variant="outlined"
                                                label="Quantity"
                                                value={medicine.quantity}
                                                onChange={(e) => handleQuantityChange(medicine.id, parseInt(e.target.value))}
                                                size='small'
                                            />
                                        </Box>
                                    ))}
                                </Box>
                            ) : (
                                <Typography>No medicines selected</Typography>
                            )}
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6">Total: ₹{total.toFixed(2)}</Typography>
                        </Grid>
                        <Grid item xs={12} md={12} sx={{display:'flex',justifyContent:'center'}}>
                            <Button variant="contained" color="primary" type="submit" size='small' fullWidth> Submit</Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
            <Snackbar open={alertOpen} autoHideDuration={3000} onClose={handleAlertClose}>
                <Alert onClose={handleAlertClose} severity={alertSeverity} sx={{ width: '100%' }}>
                    {alertMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default SalesPage;
