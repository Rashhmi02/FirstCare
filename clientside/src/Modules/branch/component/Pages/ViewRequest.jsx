import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Typography, Box, Button, TextField, Modal, IconButton, Tooltip,
    Chip
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

export default function ViewRequest() {
    const { id } = useParams();
    const host = config.host;
    const [medicineBatches, setMedicineBatches] = useState([]);
    const [deleted, setDeleted] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [openFreezeModal, setOpenFreezeModal] = useState(false);
    const [selectedBatch, setSelectedBatch] = useState(null);
    const [freezeQuantity, setFreezeQuantity] = useState('');

    useEffect(() => {
        const tokens = JSON.parse(localStorage.getItem('userToken'));

        axios.get(`${host}/api/branch/getAllBranchRequest`, { headers: { 'auth-token': tokens } })
            .then((res) => {
                // Group batches by medicine name
                console.log(res.data, 'heloooooooj')
                setMedicineBatches(res.data);
            })
            .catch((err) => {
                console.log("Error fetching data: ", err);
            });
    }, [deleted]);



    return (
        <div style={{ height: '100vh' }}>
            <Paper>

                <Box sx={{ display: 'flex', flexDirection: 'column', px: 2, py: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant='h6' sx={{ color: 'gray', fontWeight: '500', pl: 2 }}>View All Request Made To The Branches.</Typography>
                        {/* <TextField
                            label="Search by Medicine Name or Batch Number"
                            variant="outlined"
                            size="small"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            sx={{ width: '50%' }}
                        /> */}
                    </Box>
                    {/* <Typography variant='body1' sx={{ color: 'gray', fontWeight: '500', pl: 2 }}>Checkout available medicine stocks and request to freeze that medicine.</Typography> */}
                    <TableContainer sx={{ p: 2 }}>
                        <Table sx={{ minWidth: 700 }} aria-label="customized table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell align="center">Branch Name</StyledTableCell>
                                    <StyledTableCell align="center">Medicine</StyledTableCell>
                                    <StyledTableCell align="center">Quantity</StyledTableCell>
                                    <StyledTableCell align="center">Requested Date</StyledTableCell>
                                    <StyledTableCell align="center">Status</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>

                                {medicineBatches?.slice().reverse().map((i) => (
                                    <StyledTableRow
                                        key={i._id}
                                    >
                                       
                                        <StyledTableCell align="center">
                                            <Typography color='primary' sx={{ fontWeight: '700' }}>
                                                {i.batch.branch.branchName}
                                            </Typography>
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            <Typography color='primary' sx={{ fontWeight: '700' }}>
                                                {i.batch.medicine.medicineName}
                                            </Typography>
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            <Typography color='primary' sx={{ fontWeight: '700' }}>
                                                {i.quantity}
                                            </Typography>
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            <Typography color='primary' sx={{ fontWeight: '700' }}>
                                                 {moment(i.createdAt).format('DD-MM-YYYY')}
                                            </Typography>
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            <Chip 
                                             label={i.status === 'pending'? 'Pending' : i.status === 'approved'? 'Approved' : 'Denied'}
                                             color={i.status === 'pending'? 'primary' : i.status === 'approved'? 'success' : 'error'}
                                             sx={{ mr: 2 }}
                                             />
                                        </StyledTableCell>

                                    </StyledTableRow>
                                ))}

                                {/* <TableRow>
                                        <StyledTableCell colSpan={8} align="center">No matching batches found</StyledTableCell>
                                    </TableRow> */}

                            </TableBody>

                        </Table>
                    </TableContainer>
                </Box>
            </Paper>

        </div>
    );
}
