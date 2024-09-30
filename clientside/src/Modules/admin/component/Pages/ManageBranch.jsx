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
import { Box, Button, Modal, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom';
import Axios from 'axios';
import Swal from 'sweetalert2';
import config from '../../../../config';

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
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const ManageBranch = () => {
    const host = config.host;
    const [branch, setBranch] = useState([]);
    const [open, setOpen] = useState(false);
    const [description, setDescription] = useState('');
    const [roadmap, setRoadmap] = useState([]);
    const [deleted, setDeleteBranch] = useState(false);

    const handleClose = () => setOpen(false);

    useEffect(() => {
        Axios.get(`${host}/api/branch/getBranch`)
            .then((res) => {
                setBranch(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [deleted]);

    const handleOpen = (index) => {
        setOpen(true);
        setDescription(branch[index].description);
        setRoadmap(branch[index].roadmap);
    };

    const handleDelete = async (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You want to delete this Branch',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
            if (result.isConfirmed) {
                Axios.delete(`${host}/api/branch/deleteBranch/${id}`)
                    .then((response) => {
                        setDeleteBranch(!deleted);
                        console.log("Insert Response : " + response.data.cname);
                    })
                    .catch((err) => {
                        console.log("Error : " + err);
                    });
                Swal.fire('Deleted!', 'Branch has been deleted.', 'success');
            }
        });
    };
    

    return (
        <div style={{ height: '100vh' }}>
             <Paper >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' ,p: 2}}>
                    <Typography variant='h6' sx={{ mb: 2, color: 'gray', fontWeight: '500' }}>Manage Branch</Typography>
                    <Link to='/admin/add-branch'>
                        <Button variant='contained' color='success' sx={{ backgroundColor: 'gray' }} startIcon={<AddIcon />} size='small'>Add Branch</Button>
                    </Link>
                </Box>
                <TableContainer sx={{ p: 2 }}>
                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell align="center">Branch Name</StyledTableCell>
                                <StyledTableCell align="center">Phone Number</StyledTableCell>
                                <StyledTableCell align="center">Email</StyledTableCell>
                                <StyledTableCell align="center">Address</StyledTableCell>
                                <StyledTableCell align="center">Actions</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {branch.map((row, index) => (
                                <StyledTableRow key={row._id}>
                                    <StyledTableCell align="center">{row.branchName}</StyledTableCell>
                                    <StyledTableCell align="center">{row.phoneNumber}</StyledTableCell>
                                    <StyledTableCell align="center">{row.email}</StyledTableCell>
                                    <StyledTableCell align="center">{row.address}</StyledTableCell>
                                    <StyledTableCell align="center">
                                        <IconButton aria-label="edit">
                                            <Link to={`/admin/edit-branch/${row._id}`}>
                                                <EditIcon />
                                            </Link>
                                        </IconButton>
                                        <IconButton aria-label="delete" onClick={() => handleDelete(row._id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 700,
                    bgcolor: 'background.paper',
                    maxHeight: '500px',
                    overflowY: 'auto',
                    boxShadow: 24,
                    p: 4,
                }}>
                    <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ fontWeight: '600', color: 'grey' }}>
                        Branch Description
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        {description}
                    </Typography>

                    <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ fontWeight: '600', color: 'grey', mt: 3 }}>
                        Branch Roadmap
                    </Typography>
                    <ul>
                        {roadmap.map((item, index) => (
                            <li key={index}>
                                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                    {item}
                                </Typography>
                            </li>
                        ))}
                    </ul>
                </Box>
            </Modal>
        </div>
    );
};

export default ManageBranch;


