import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Box, Modal, Grid } from "@mui/material";
import Axios from "axios";
import config from "../../../../config";
import { EmailOutlined, LocationOnOutlined, PhoneOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const BranchStocks = () => {
  const navigate = useNavigate();
  const host = config.host;
  const [branches, setBranches] = useState([]);
  const [currentBranchId, setCurrentBranchId] = useState(null);
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [roadmap, setRoadmap] = useState([]);
  const [deleted, setDeleted] = useState(false);

  const handleClose = () => setOpen(false);

  useEffect(() => {
    // Fetch current user's branch ID (replace with your actual API call or context)
    const fetchCurrentBranchId = async () => {
      try {
        const tokens = JSON.parse(localStorage.getItem('userToken'));

        const response = await Axios.get(`${host}/api/branch/getLoginBranch`,{ headers: { 'auth-token': tokens } });
        setCurrentBranchId(response.data._id);
        console.log(response.data._id,'jekoo')
      } catch (err) {
        console.log(err);
      }
    };

    fetchCurrentBranchId();
  }, []);

  useEffect(() => {
    Axios.get(`${host}/api/branch/getBranch`)
      .then((res) => {
        setBranches(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [deleted]);

  const handleOpen = (index) => {
    setOpen(true);
    setDescription(branches[index].description);
    setRoadmap(branches[index].roadmap);
  };

  return (
    <div style={{ height: "100vh", padding: "20px" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography variant="h6" sx={{ color: "gray", fontWeight: "500" }}>
          Manage Branch-wise Stock
        </Typography>
      </Box>
      <Grid container spacing={1} sx={{ display: 'flex', justifyContent: 'center' }}>
        {branches
          .filter(branch => branch._id !== currentBranchId) // Exclude current user's branch
          .map((row, index) => (
            <Grid item xs={12} sm={6} md={4} key={row._id}>
              <Box
                sx={{
                  p: 1,
                  borderRadius: 2,
                  "&:hover": {
                    transform: "scale(1.05)",
                    zIndex: 10,
                  },
                  transition: "transform 0.3s, z-index 0.3s",
                }}
                onClick={() => navigate(`/branch/ViewBranchMedicine/${row._id}`)}
              >
                <Card elevation={0} sx={{ backgroundColor: "#DEECFF", border: '1px solid gray', cursor: 'pointer' }}>
                  <CardContent>
                    <Typography variant="h6" component="div" sx={{ textTransform: 'uppercase', mb: 2 }}>
                      {row.branchName}
                    </Typography>
                    <Box sx={{ display: "flex", gap: '3px' }}>
                      <PhoneOutlined sx={{ color: 'gray' }} />
                      <Typography color="text.secondary">
                        {row.phoneNumber}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", gap: '3px' }}>
                      <EmailOutlined sx={{ color: 'gray' }} />
                      <Typography variant="body1" color="text.secondary">{row.email}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", gap: '3px' }}>
                      <LocationOnOutlined sx={{ color: 'gray' }} />
                      <Typography variant="body1" color="text.secondary">{row.address}</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
          ))}
      </Grid>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 700,
            bgcolor: "background.paper",
            maxHeight: "500px",
            overflowY: "auto",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={{ fontWeight: "600", color: "grey" }}
          >
            Branch Description
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {description}
          </Typography>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={{ fontWeight: "600", color: "grey", mt: 3 }}
          >
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

export default BranchStocks;
