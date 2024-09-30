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
import { Box, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';
import axios from 'axios';
import IconButton from '@mui/material/IconButton';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Swal from 'sweetalert2';
import config from '../../../../config';
import moment from 'moment';
import { ArrowBack, Edit } from '@mui/icons-material';

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

const StyledTableRow = styled(TableRow)(({ theme, expiringSoon, expired }) => ({
    '&:last-child td, &:last-child th': {
        border: 0,
    },
    backgroundColor: expired ? '#FFCCCC' : (expiringSoon ? '#FFDDDD' : 'inherit'),
}));

export default function ExpiringBatch({ id }) {
    const host = config.host;
    const [medicineBatches, setMedicineBatches] = useState({});
    const [deleted, setDeleted] = useState(false);

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

    const isExpiringSoon = (expiryDate) => {
        const today = moment();
        const expDate = moment(expiryDate);
        return expDate.diff(today, 'days') <= 90 && expDate.isAfter(today); // Expiring within 30 days and not yet expired
    };

    const isExpired = (expiryDate) => {
        const today = moment();
        const expDate = moment(expiryDate);
        return expDate.isBefore(today); // Expired
    };

    return (
        <div style={{ height: '100vh' }}>
            <Paper>
                <Box sx={{ p: 2 }}>
                    <Link to={'/admin/manage-stock'}>
                        <Button startIcon={<ArrowBack />}>Back</Button>
                    </Link>
                </Box>
                <Box sx={{ pl: 2 }}>
                    <Typography variant='h6' sx={{ color: 'gray', fontWeight: '500' }}>View All Medicine Batches</Typography>
                    <Typography variant='body1' sx={{ color: 'black' }}>Checkout all expired and expiring medicine batches here.</Typography>
                    {/* <Link to='/branch/add-medicine'>
                        <Button variant='contained' color='success' sx={{ backgroundColor: 'gray' }} startIcon={<AddIcon />} size='small'>Add Medicine</Button>
                    </Link> */}
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
                            {Object.entries(medicineBatches).map(([medicineName, batches]) => (
                                <React.Fragment key={medicineName}>
                                    {/* Medicine Name Header Row */}
                                    {batches.filter(batch => isExpiringSoon(batch.expiryDate) && !isExpired(batch.expiryDate)).map((batch) => (

                                        <StyledTableRow>
                                            <StyledTableCell colSpan={8} align="center" sx={{ fontWeight: 'bold', backgroundColor: '#f0f0f0' }}>
                                                {medicineName}
                                            </StyledTableCell>


                                        </StyledTableRow>
                                    ))}

                                    {/* Expiring Soon Batches */}
                                    {batches.filter(batch => isExpiringSoon(batch.expiryDate) && !isExpired(batch.expiryDate)).map((batch) => (
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
                                            <StyledTableCell align="center">{batch.medicine.rackNumber}</StyledTableCell>
                                            <StyledTableCell align="center">{batch.medicine.boxNumber}</StyledTableCell>
                                            <StyledTableCell align="center">{batch.quantity}</StyledTableCell>
                                            <StyledTableCell align="center">{moment(batch.expiryDate).format('MMM DD, YYYY')}</StyledTableCell>
                                            <StyledTableCell align="center">
                                                <Typography color='warning'>Expiring Soon</Typography>
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                <IconButton onClick={() => handleDelete(batch._id)}>
                                                    <DeleteOutlineIcon />
                                                </IconButton>
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    ))}
                                    {/* Expired Batches */}
                                    {batches.filter(batch => isExpired(batch.expiryDate)).map((batch) => (
                                        <StyledTableRow
                                            key={batch._id}
                                            expired
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
                                                <Typography color='error'>Expired</Typography>
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                <IconButton onClick={() => handleDelete(batch._id)}>
                                                    <DeleteOutlineIcon />
                                                </IconButton>
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    ))}
                                </React.Fragment>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </div >
    );
}
