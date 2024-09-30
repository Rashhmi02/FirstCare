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
import { Box, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import axios from 'axios';
import config from '../../../../config';
import moment from 'moment';
import { ArrowBack, LocalPhoneOutlined, PersonOutlineOutlined } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: '#DEECFF',
    },
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const ReceiptBox = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper,
    width: '100%',
}));

const Header = styled(Typography)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette.divider}`,
    paddingBottom: theme.spacing(1),
}));

const Section = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(2),
}));

export default function ViewAllBatch() {
    const host = config.host;
    const [salesDetails, setSalesDetails] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [open, setOpen] = useState(false);
    const [receiptData, setReceiptData] = useState(null);

    useEffect(() => {
        const tokens = JSON.parse(localStorage.getItem('userToken'));

        axios.get(`${host}/api/sales/getSales`, { headers: { 'auth-token': tokens } })
            .then((res) => {
                // Ensure the response data is an array
                if (Array.isArray(res.data)) {
                    setSalesDetails(res.data);
                } else {
                    console.error('Unexpected data format:', res.data);
                }
            })
            .catch((err) => {
                console.log("Error fetching data: ", err);
            });
    }, []);

    const filteredSalesDetails = Array.isArray(salesDetails)
        ? salesDetails.filter((sale) => {
            const lowercasedQuery = searchQuery.toLowerCase();
            const phoneNumberStr = String(sale.phoneNumber).toLowerCase();
            const customerNameStr = sale.customerName ? sale.customerName.toLowerCase() : '';
            const matchesName = customerNameStr.includes(lowercasedQuery);
            const matchesPhone = phoneNumberStr.includes(lowercasedQuery);
            return matchesName || matchesPhone;
        })
        : [];

    const handleClickOpen = (sale) => {
        setReceiptData(sale);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setReceiptData(null);
    };

    const handlePrint = () => {
        window.print();
    };

    const calculateTotalAmount = (medicines) => {
        return medicines.reduce((total, medicine) => total + (medicine.price * medicine.quantity), 0);
    };

    return (
        <div style={{ height: '100vh' }}>
            <Paper>
               
                <Box sx={{ display: 'flex', flexDirection: 'column', px: 1, py: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, p: 2 }}>
                        <Typography variant='h6' sx={{ color: 'gray', fontWeight: '600' }}>View All Sales Details</Typography>
                        <TextField
                            label="Search by Customer Name or Phone Number"
                            variant="outlined"
                            size="small"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            sx={{ width: '45%' }}
                        />
                    </Box>

                    <TableContainer sx={{ p: 2 }}>
                        <Table sx={{ minWidth: 700 }} aria-label="customized table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>Customer Info</StyledTableCell>
                                    <StyledTableCell>Medicines Purchased</StyledTableCell>
                                    <StyledTableCell>Date</StyledTableCell>
                                    <StyledTableCell>Action</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredSalesDetails.length > 0 ? (
                                    filteredSalesDetails.map((i) => (
                                        <StyledTableRow key={i._id}>
                                            <StyledTableCell sx={{ fontWeight: 'bold' }}>
                                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                    <Box sx={{ display: 'flex', gap: '4px' }}>
                                                        <PersonOutlineOutlined />
                                                        <Typography>
                                                            {i.customerName}
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', gap: '4px' }}>
                                                        <LocalPhoneOutlined />
                                                        <Typography>
                                                            {i.phoneNumber}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                {i.medicines.map((row) => (
                                                    <Box key={row._id} sx={{ display: 'flex', gap: '4px' }}>
                                                        {row.name} - Quantity: {row.quantity} - Price: ₹{row.price}
                                                    </Box>
                                                ))}
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                {moment(i.createdAt).format('DD-MM-YYYY')}
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                <Button onClick={() => handleClickOpen(i)}><ReceiptOutlinedIcon /></Button>
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    ))
                                ) : (
                                    <StyledTableRow>
                                        <StyledTableCell colSpan={4} align="center" sx={{ fontWeight: 'bold', backgroundColor: '#f0f0f0' }}>
                                            No sales details found matching the search query.
                                        </StyledTableCell>
                                    </StyledTableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Paper>

            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>Receipt Details</DialogTitle>
                <DialogContent>
                    {receiptData && (
                        <ReceiptBox id="receipt-content">
                            <Header variant="h6">Receipt</Header>
                            <Section>
                                <Typography variant="h6">Customer Information</Typography>
                                <Typography><strong>Name:</strong> {receiptData.customerName}</Typography>
                                <Typography><strong>Phone:</strong> {receiptData.phoneNumber}</Typography>
                            </Section>
                            <Section>
                                <Typography variant="h6">Medicines Purchased</Typography>
                                <Table>
                                    <TableBody>
                                        <TableRow sx={{ background: '#DEECFF' }}>
                                            <TableCell sx={{ fontWeight: '600' }}>Medicine</TableCell>
                                            <TableCell sx={{ fontWeight: '600' }}>Quantity</TableCell>
                                            <TableCell sx={{ fontWeight: '600' }}>Price</TableCell>
                                        </TableRow>
                                        {receiptData.medicines.map((medicine) => (
                                            <TableRow key={medicine._id}>
                                                <TableCell>{medicine.name}</TableCell>
                                                <TableCell>{medicine.quantity}</TableCell>
                                                <TableCell>₹{medicine.price}</TableCell>
                                            </TableRow>
                                        ))}
                                        <TableRow>
                                            <TableCell colSpan={2} sx={{ fontWeight: 'bold' }}>Total Amount</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>₹{calculateTotalAmount(receiptData.medicines)}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </Section>
                            <Section>
                                <Typography variant="h6">Date</Typography>
                                <Typography>{moment(receiptData.createdAt).format('DD-MM-YYYY')}</Typography>
                            </Section>
                        </ReceiptBox>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handlePrint}>Print</Button>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
