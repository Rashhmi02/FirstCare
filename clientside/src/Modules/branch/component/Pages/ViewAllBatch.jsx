import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Box, Button, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import IconButton from '@mui/material/IconButton';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Swal from 'sweetalert2';
import config from '../../../../config';
import moment from 'moment';

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

export default function ViewAllBatch() {
    const host = config.host;
    const [medicineBatches, setMedicineBatches] = useState({});
    const [deleted, setDeleted] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const tokens = JSON.parse(localStorage.getItem('userToken'));

        axios.get(`${host}/api/branch/GetAllBatch`, { headers: { 'auth-token': tokens } })
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
                <Box sx={{ display: 'flex', flexDirection: 'column', p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant='h6' sx={{ color: 'gray', fontWeight: '500' }}>View All Medicine Batches</Typography>
                        <TextField
                            label="Search by Medicine Name or Batch Number"
                            variant="outlined"
                            size="small"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            sx={{ width: '50%' }}
                        />
                    </Box>

                    <TableContainer sx={{ p: 2 }}>
                        <Table sx={{ minWidth: 700 }} aria-label="customized table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell align="center">Medicine Name</StyledTableCell>
                                    <StyledTableCell align="center">Batch Number</StyledTableCell>
                                    <StyledTableCell align="center">Price</StyledTableCell>
                                    <StyledTableCell align="center">Rack Number</StyledTableCell>
                                    <StyledTableCell align="center">Box Number</StyledTableCell>
                                    <StyledTableCell align="center">Quantity</StyledTableCell>
                                    <StyledTableCell align="center">Expiry Date</StyledTableCell>
                                    <StyledTableCell align="center">Action</StyledTableCell>
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
                                                    <StyledTableCell align="center">
                                                        <Box sx={{ border: '1px solid', borderRadius: '10px',fontWeight:'600' }}>
                                                            {batch.medicine.rackNumber}
                                                        </Box>
                                                    </StyledTableCell>
                                                    <StyledTableCell align="center">
                                                        <Box sx={{ border: '1px solid', borderRadius: '10px' ,fontWeight:'600'}}>
                                                            {batch.medicine.boxNumber}
                                                        </Box>
                                                    </StyledTableCell>
                                                    <StyledTableCell align="center">{batch.quantity}</StyledTableCell>
                                                    <StyledTableCell align="center">{moment(batch.expiryDate).format('MMM DD, YYYY')}</StyledTableCell>
                                                    <StyledTableCell align="center">
                                                        <IconButton onClick={() => handleDelete(batch._id)}>
                                                            <DeleteOutlineIcon />
                                                        </IconButton>
                                                    </StyledTableCell>
                                                </StyledTableRow>
                                            ))}
                                        </React.Fragment>
                                    ))
                                ) : (
                                    <StyledTableRow>
                                        <StyledTableCell colSpan={7} align="center" sx={{ fontWeight: 'bold', backgroundColor: '#f0f0f0' }}>
                                            No batches found matching the search query.
                                        </StyledTableCell>
                                    </StyledTableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Paper>
        </div>
    );
}
