import React, { useState,useEffect } from 'react';
import { Box, Paper, Grid, TextField, Button, Snackbar, Alert, Card, CardContent } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import config from '../../../../config';


export default function EditMedicine() {
    const host = config.host;
    const {id}=useParams();
    const navigate = useNavigate();
    const [medicine, setmedicine] = useState({});



   

    const [medicineDetails, setMedicineDetails] = useState({
        medicineName: '',
        medicineType: '',
        rackNumber: '',
        boxNumber: '',
        description: '',
        
    });
    const [open, setOpen] = useState(false);
    const [errors, setErrors] = useState({});

     
    useEffect(() => {

        axios.get(`${host}/api/medi/getSingleMedicine/${id}`)
            .then((res) => {
                console.log(res.data, 777878)
                setMedicineDetails(res.data);
            })
            .catch((err) => {
                console.log(err);
            })
    }, [])

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

        if (!medicineDetails.medicineName) {
            newErrors.medicineName = 'Medicine name is required';
            isValid = false;
        }
        if (!medicineDetails.medicineType) {
            newErrors.medicineType = 'Medicine Type is required';
            isValid = false;
        }

        if (!medicineDetails.rackNumber) {
            newErrors.rackNumber = 'Rack Number is required';
            isValid = false;
        }
        if (!medicineDetails.boxNumber) {
            newErrors.boxNumber = 'Box Number is required';
            isValid = false;
        }
        if (!medicineDetails.description) {
            newErrors.description = 'description is required';
            isValid = false;
        }
       

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = () => {
  const tokens =JSON.parse(localStorage.getItem('userToken'));

        if (!validateForm()) {
            return;
        }

        axios.put(`${host}/api/medi/updateMedicine/${id}`, medicineDetails)
            .then((res) => {
                if (res.data) {
                    setOpen(true);
                    setMedicineDetails({
                        medicineName: '',
                        medicineType: '',
                        rackNumber: '',
                        boxNumber: '',
                       description: '',
                    });
                    setTimeout(()=>{
                        navigate('/branch/manage-medicine');
                    },1000)
                } else {
                    console.log("some error occurred");
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <div style={{ minheight: '100vh', backgroundColor: '#ffe5b4'}}>
            <Paper>
                <Box sx={{ backgroundColor: '#DEECFF', padding: '2px 15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ color: 'rgb(82, 95, 127)', fontWeight: '400', fontSize: '15px' }}>Edit Medicine Details</p>
                    <Link to='/branch/manage-medicine'><Button size='small' endIcon={<ArrowForwardIosIcon />}>View Branch</Button></Link>
                </Box>

                <Card variant="outlined" sx={{ padding: '10px', backgroundColor: '#FAF9F9' }}>
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    id="outlined-basic"
                                    label="Medicine Name"
                                    name='medicineName'
                                    value={medicineDetails.medicineName}
                                    onChange={handleMedicineDetails}
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    error={!!errors.medicineName}
                                    helperText={errors.medicineName}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    id="outlined-basic"
                                    label="Medicine Type"
                                    name='medicineType'
                                    value={medicineDetails.medicineType}
                                    onChange={handleMedicineDetails}
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    error={!!errors.medicineType}
                                    helperText={errors.medicineType}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    id="outlined-basic"
                                    label="Rack Number"
                                    name='rackNumber'
                                    value={medicineDetails.rackNumber}
                                    onChange={handleMedicineDetails}
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    error={!!errors.rackNumber}
                                    helperText={errors.rackNumber}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    id="outlined-basic"
                                    label="Box Number"
                                    name='boxNumber'
                                    value={medicineDetails.boxNumber}
                                    onChange={handleMedicineDetails}
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    error={!!errors.boxNumber}
                                    helperText={errors.boxNumber}
                                />
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <TextField
                                multiline
                                rows={2}
                                    id="outlined-basic"
                                    label="Description"
                                    name='description'
                                    value={medicineDetails.description}
                                    onChange={handleMedicineDetails}
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    error={!!errors.description}
                                    helperText={errors.description}
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
                    Medicine Updated!
                </Alert>
            </Snackbar>
        </div>
    );
}
