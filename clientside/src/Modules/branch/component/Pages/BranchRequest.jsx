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
import { ArrowBack, Check, Close } from '@mui/icons-material';
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

export default function BranchRequest() {
    const { id } = useParams();
    const host = config.host;
    const [medicineBatches, setMedicineBatches] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const tokens = JSON.parse(localStorage.getItem('userToken'));

        axios.get(`${host}/api/branch/getLoginBranchRequest`, { headers: { 'auth-token': tokens } })
            .then((res) => {
                // Group batches by medicine name
                console.log(res.data, 'helooooooopppp')
                setMedicineBatches(res.data);
            })
            .catch((err) => {
                console.log("Error fetching data: ", err);
            });
    }, [loading]);


    const handleStatus = (rid, status) => {
        axios.put(`${host}/api/branch/updateRequestStatus/${rid}`, { status })
            .then((res) => {
                console.log(res.data)
                setLoading(!loading)
            })
            .catch((err) => {
                console.log(err)
            })
    }



    return (
        <div style={{ height: '100vh' }}>
            <Paper>

                <Box sx={{ display: 'flex', flexDirection: 'column', px: 2, py: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant='h6' sx={{ color: 'gray', fontWeight: '500', pl: 2 }}>View All Request Made By The Other Branches.</Typography>
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

                                {
                                    medicineBatches.length > 0 ?
                                        medicineBatches?.map((i) => (
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
                                                    {i.status === 'pending' && (
                                                        <>
                                                            <IconButton onClick={() => handleStatus(i._id, 'approved')}>
                                                                <Check sx={{ color: 'green' }} />
                                                            </IconButton>
                                                            <IconButton onClick={() => handleStatus(i._id, 'denied')}>
                                                                <Close sx={{ color: 'red' }} />
                                                            </IconButton>
                                                        </>
                                                    )}
                                                    <Chip
                                                        label={i.status === 'pending' ? 'Pending' : i.status === 'approved' ? 'Approved' : 'Denied'}
                                                        color={i.status === 'pending' ? 'primary' : i.status === 'approved' ? 'success' : 'error'}
                                                        sx={{ mr: 2 }}
                                                    />
                                                </StyledTableCell>

                                            </StyledTableRow>
                                        ))
                                        :
                                        <TableRow>
                                            <StyledTableCell colSpan={8} align="center">No request yet!</StyledTableCell>
                                        </TableRow>
                                }

                            </TableBody>

                        </Table>
                    </TableContainer>
                </Box>
            </Paper>

        </div>
    );
}
