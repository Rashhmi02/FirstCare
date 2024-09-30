import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Typography, Box, Button, TextField, Modal, IconButton, Tooltip
} from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import FreezeIcon from '@mui/icons-material/AcUnit';
import { Link, useParams } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material';
import Swal from 'sweetalert2';
import axios from 'axios';
import moment from 'moment';
import config from '../../../../config';

const style = {
    position: 'absolute',
    top: '50%',
    borderRadius: '10px',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    bgcolor: 'background.paper',
    maxHeight: '500px',
    overflowY: 'auto',
    boxShadow: 24,
    p: 4,
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme, expiringSoon }) => ({
    '&:last-child td, &:last-child th': {
        border: 0,
    },
    backgroundColor: expiringSoon ? '#FFDDDD' : 'inherit',
}));

export default function ViewBranchMedicine() {
    const { id } = useParams();
    const host = config.host;
    const [medicineBatches, setMedicineBatches] = useState({});
    const [deleted, setDeleted] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [openFreezeModal, setOpenFreezeModal] = useState(false);
    const [selectedBatch, setSelectedBatch] = useState(null);
    const [freezeQuantity, setFreezeQuantity] = useState('');

    useEffect(() => {
        axios.get(`${host}/api/branch/getAllBranchBatch/${id}`)
            .then((res) => {
                // Group batches by medicine name
                const groupedBatches = res.data.reduce((acc, batch) => {
                    const medicineName = batch.medicine.medicineName;
                    if (!acc[medicineName]) {
                        acc[medicineName] = [];
                    }
                    acc[medicineName].push(batch);
                    return acc;
                }, {});

                setMedicineBatches(groupedBatches);
            })
            .catch((err) => {
                console.log("Error fetching data: ", err);
            });
    }, [deleted]);

    const handleDelete = async (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You want to delete this batch',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`${host}/api/branch/deleteBatch/${id}`)
                    .then((response) => {
                        setDeleted(!deleted);
                        Swal.fire('Deleted!', 'Batch has been deleted.', 'success');
                    })
                    .catch((err) => {
                        console.log("Error deleting medicine: ", err);
                    });
            }
        });
    };

    const handleFreeze = (batch) => {
        setSelectedBatch(batch);
        setOpenFreezeModal(true);
    };

    const handleFreezeSubmit = async () => {
        const tokens = JSON.parse(localStorage.getItem('userToken'));

        if (!freezeQuantity || isNaN(freezeQuantity) || freezeQuantity <= 0) {
            Swal.fire('Error', 'Please enter a valid quantity to freeze', 'error');
            return;
        }

        axios.post(`${host}/api/branch/freezBatchInsert/`, {
            quantity: freezeQuantity,
            batch:selectedBatch._id,
            requestToBranch:id
        },{ headers: { 'auth-token': tokens } })
            .then((response) => {
                setDeleted(!deleted); // Reload the data
                setOpenFreezeModal(false);
                Swal.fire('Submitted!', 'Request submitted Successfully .', 'success');
            })
            .catch((err) => {
                console.log("Error freezing batch: ", err);
                Swal.fire('Error', 'An error occurred while freezing the batch', 'error');
            });
    };

    const isExpiringSoon = (expiryDate) => {
        const today = moment();
        const expDate = moment(expiryDate);
        return expDate.diff(today, 'days') <= 30; // Expiring within 30 days
    };

    const filteredBatches = Object.entries(medicineBatches).reduce((acc, [medicineName, batches]) => {
        const filtered = batches.filter(batch =>
            batch.medicine.medicineName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            batch.batchNumber.toLowerCase().includes(searchQuery.toLowerCase())
        );
        if (filtered.length > 0) {
            acc[medicineName] = filtered;
        }
        return acc;
    }, {});

    return (
        <div style={{ height: '100vh' }}>
            <Paper>
                <Box sx={{ p: 2 }}>
                    <Link to={'/branch/branchStocks'}>
                        <Button startIcon={<ArrowBack />}>Back</Button>
                    </Link>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', p: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant='h6' sx={{ color: 'gray', fontWeight: '500', pl: 2 }}>View All Medicine Batches</Typography>
                        <TextField
                            label="Search by Medicine Name or Batch Number"
                            variant="outlined"
                            size="small"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            sx={{ width: '50%' }}
                        />
                    </Box>
                    <Typography variant='body1' sx={{ color: 'gray', fontWeight: '500', pl: 2 }}>Checkout available medicine stocks and request to freeze that medicine.</Typography>
                    <TableContainer sx={{ p: 2 }}>
                        <Table sx={{ minWidth: 700 }} aria-label="customized table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell align="center">Medicine Name</StyledTableCell>
                                    <StyledTableCell align="center">Batch Number</StyledTableCell>
                                    <StyledTableCell align="center">Price</StyledTableCell>
                                    <StyledTableCell align="center">Quantity</StyledTableCell>
                                    <StyledTableCell align="center">Expiry Date</StyledTableCell>
                                    <StyledTableCell align="center">Actions</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Object.keys(filteredBatches).length > 0 ? (
                                    Object.entries(filteredBatches).map(([medicineName, batches]) => (
                                        <React.Fragment key={medicineName}>
                                            {/* Medicine Name Header Row */}
                                            <StyledTableRow>
                                                <StyledTableCell colSpan={8} align="center" sx={{ fontWeight: 'bold', backgroundColor: '#f0f0f0' }}>
                                                    <Typography color='primary' sx={{ fontWeight: '700' }}>
                                                        {medicineName}
                                                    </Typography>
                                                </StyledTableCell>
                                            </StyledTableRow>
                                            {/* Batch Rows */}
                                            {batches.map((batch) => (
                                                <StyledTableRow
                                                    key={batch._id}
                                                    expiringSoon={isExpiringSoon(batch.expiryDate)}
                                                >
                                                    <StyledTableCell align="center">
                                                        <Typography color='primary' sx={{ fontWeight: '700' }}>
                                                            {batch.medicine.medicineName}
                                                        </Typography>
                                                    </StyledTableCell>
                                                    <StyledTableCell align="center">
                                                        <Typography sx={{ fontWeight: '700' }}>
                                                            {batch.batchNumber}
                                                        </Typography>
                                                    </StyledTableCell>
                                                    <StyledTableCell align="center">
                                                        <Typography sx={{ fontWeight: '700' }}>
                                                            ₹{batch.price}
                                                        </Typography>
                                                    </StyledTableCell>
                                                  
                                                    <StyledTableCell align="center">{batch.quantity}</StyledTableCell>
                                                    <StyledTableCell align="center">{moment(batch.expiryDate).format('DD-MM-YYYY')}</StyledTableCell>
                                                    <StyledTableCell align="center">
                                                        <Tooltip title="Freeze Quantity">
                                                            <IconButton onClick={() => handleFreeze(batch)}>
                                                                <FreezeIcon color='primary' />
                                                            </IconButton>
                                                        </Tooltip>
                                                        
                                                    </StyledTableCell>
                                                </StyledTableRow>
                                            ))}
                                        </React.Fragment>
                                    ))
                                ) : (
                                    <TableRow>
                                        <StyledTableCell colSpan={8} align="center">No matching batches found</StyledTableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Paper>
            <Modal
                open={openFreezeModal}
                onClose={() => setOpenFreezeModal(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography variant="h6" component="h2" gutterBottom>
                        Freeze Quantity
                    </Typography>
                    <TextField
                        label="Enter quantity to freeze"
                        variant="outlined"
                        size="small"
                        fullWidth
                        value={freezeQuantity}
                        onChange={(e) => setFreezeQuantity(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <Button variant="contained" color="primary" onClick={handleFreezeSubmit}>
                        Submit
                    </Button>
                </Box>
            </Modal>
        </div>
    );
}
