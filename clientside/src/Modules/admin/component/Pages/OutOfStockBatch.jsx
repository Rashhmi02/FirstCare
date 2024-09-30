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
import { Box, TextField, IconButton, Button } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import axios from 'axios';
import Swal from 'sweetalert2';
import config from '../../../../config';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme, outOfStockSoon, outOfStock }) => ({
    '&:last-child td, &:last-child th': {
        border: 0,
    },
    backgroundColor: outOfStock
        ? '#FFCCCC' // Red for expired
        : outOfStockSoon
            ? '#FFDDDD' // Light Red for out of stock soon
            : 'inherit',
}));

export default function OutofStockBatch({ id }) {
    const host = config.host;
    const [medicineBatches, setMedicineBatches] = useState({});
    const [deleted, setDeleted] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

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

    const isOutOfStock = (quantity) => {
        return quantity <= 0; // Assuming out-of-stock if quantity is zero or less
    };

    const isOutOfStockSoon = (quantity) => {
        return quantity > 0 && quantity <= 8; // Assuming out-of-stock soon if quantity is 8 or less
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
                    <Link to={'/admin/manage-stock'}>
                        <Button startIcon={<ArrowBack />}>Back</Button>
                    </Link>
                </Box>
                <Box sx={{ pl: 3, display: 'flex', justifyContent: 'space-between' }}>

                    <Typography variant='h6' sx={{ color: 'gray', fontWeight: '500' }}>View All Medicine Batches</Typography>


                    <TextField
                        label="Search by Medicine Name or Batch Number"
                        variant="outlined"
                        size="small"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        sx={{ width: '50%', }}
                    />
                </Box>
                <TableContainer sx={{ p: 2 }}>
                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell align="center">Medicine Name</StyledTableCell>
                                <StyledTableCell align="center">Batch Number</StyledTableCell>
                                <StyledTableCell align="center">Rack Number</StyledTableCell>
                                <StyledTableCell align="center">Box Number</StyledTableCell>
                                <StyledTableCell align="center">Quantity</StyledTableCell>
                                <StyledTableCell align="center">Expiry Date</StyledTableCell>
                                <StyledTableCell align="center">Status</StyledTableCell>
                                <StyledTableCell align="center">Action</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Object.entries(filteredBatches).length > 0 ? (
                                Object.entries(filteredBatches).map(([medicineName, batches]) => (
                                    <React.Fragment key={medicineName}>
                                        {/* Medicine Name Header Row */}
                                        <StyledTableRow>
                                            <StyledTableCell colSpan={8} align="center" sx={{ fontWeight: 'bold', backgroundColor: '#f0f0f0' }}>
                                                {medicineName}
                                            </StyledTableCell>
                                        </StyledTableRow>
                                        {/* Batches */}
                                        {batches.map((batch) => (
                                            <StyledTableRow
                                                key={batch._id}
                                                outOfStock={isOutOfStock(batch.quantity)}
                                                outOfStockSoon={isOutOfStockSoon(batch.quantity)}
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
                                                <StyledTableCell align="center">{batch.medicine.rackNumber}</StyledTableCell>
                                                <StyledTableCell align="center">{batch.medicine.boxNumber}</StyledTableCell>
                                                <StyledTableCell align="center">{batch.quantity}</StyledTableCell>
                                                <StyledTableCell align="center">{moment(batch.expiryDate).format('MMM DD, YYYY')}</StyledTableCell>
                                                <StyledTableCell align="center">
                                                    <Typography color={isOutOfStock(batch.quantity) ? 'error' : (isOutOfStockSoon(batch.quantity) ? 'warning' : 'inherit')} sx={{ fontWeight: '700' }}>
                                                        {isOutOfStock(batch.quantity) ? 'Out of Stock' : (isOutOfStockSoon(batch.quantity) ? 'Out of Stock Soon' : 'In Stock')}
                                                    </Typography>
                                                </StyledTableCell>
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
                                    <StyledTableCell colSpan={8} align="center" sx={{ fontWeight: 'bold', backgroundColor: '#f0f0f0' }}>
                                        No batches found matching the search query.
                                    </StyledTableCell>
                                </StyledTableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </div>
    );
}
