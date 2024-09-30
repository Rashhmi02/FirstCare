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
// import PreviewIcon from '@mui/icons-material/Preview';
// import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import Modal from '@mui/material/Modal';
// import IconButton from '@mui/material/IconButton';
// import BorderColorIcon from '@mui/icons-material/BorderColor';
// import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
// import Swal from 'sweetalert2'
import Axios from 'axios';
import config from '../../../../config';
// import moment from 'moment';

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
    //   border: '2px solid #000',
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

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));


export default function ManageSales() {
  const host = config.host;
  // const navigate = useNavigate();

  const [data, setData] = useState({});
  const [value, setValue] = useState([]);
  const [deleted, setDeleted] = useState(false);

    
    const handleChange = (e) => {
      setData({ ...data, [e.target.name]: e.target.value });
    };
    useEffect (()=>{
      Axios.get(`${host}/api/sales/getSales`, data)
      .then((res) => {
        if (res.data) {
          console.log(res.data);
          setValue(res.data)
        }
      })
      .catch((err) => {
        console.log('Error:' + err);
      });
  },[deleted]);


    const [sales, setsales] = useState([]);
    const [open, setOpen] = React.useState(false);
    const [description, setDescription] = useState('');
    const [roadmap, setRoadmap] = useState([]);
    const [deleteCat, setDeletesales] = useState(false);

    const handleClose = () => setOpen(false);
    


    useEffect(() => {
  const tokens =JSON.parse(localStorage.getItem('userToken'));

        axios.get(`${host}/api/sales/getSales`,{headers:{'auth-token':tokens}})
            .then((res) => {
                console.log(res.data,777878)
                setsales(res.data);
            })
            .catch((err) => {
                console.log(err);
            })
    }, [deleteCat])


    const handleOpen = (index) => {
        setOpen(true)
        setDescription(sales[index].description);
        setRoadmap(sales[index].roadmap)
    }

    return (
        <div style={{ height: '100vh' }}>

        
            <Paper sx={{ padding: '20px 20px 20px 20px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', }}>
                    <Typography variant='h6' sx={{ mb: 2, color: 'gray', fontWeight: '500' }}>Manage Sales</Typography>
                    <Link to='/branch/add-sales'>
                        <Button variant='contained' color='success' sx={{ backgroundColor: 'gray' }} startIcon={<AddIcon />} size='small'>Add User INfo</Button>
                    </Link>
                </Box>
                <TableContainer >
                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell align="center">Name</StyledTableCell>
                                <StyledTableCell align="center">Phone Number</StyledTableCell>
                                <StyledTableCell align="center">Medicine Name </StyledTableCell>                              
                                <StyledTableCell align="center">Quantity</StyledTableCell>
                               
                                
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sales?.map((row, index) => (
                                <StyledTableRow key={row.name}>
                                    
                                    
                                    <StyledTableCell align="center">{row.name}</StyledTableCell>
                                    <StyledTableCell align="center">{row.phoneNumber}</StyledTableCell>
                                    <StyledTableCell align="center">{row.medicineName}</StyledTableCell>
                                    <StyledTableCell align="center">{row.quantity}</StyledTableCell>
                                    
                                 
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>


                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ fontWeight: '600', color: 'grey' }}>
                            Medicine Description
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            {description}
                        </Typography>

                        <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ fontWeight: '600', color: 'grey', mt: 3 }}>
                            Medicine Roadmap
                        </Typography>
                        <ul>
                            {roadmap.map((i) => (
                                <li>
                                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                        {i}
                                    </Typography>
                                </li>

                            ))}
                        </ul>
                    </Box>
                </Modal>
            </Paper>
        </div>
    );
}
