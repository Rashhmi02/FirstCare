import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import ViewAllBatch from './ViewAllBatch';
import ExpiringBatch from './ExpiryBatch';
import OutofStockBatch from './OutOfStockBatch'
import { useNavigate, useParams } from 'react-router-dom';


function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function ViewStock() {
  const [value, setValue] = React.useState(0);
  const {id}=useParams();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={value} 
          onChange={handleChange} 
          aria-label="basic tabs example"
          sx={{ 
            width: '100%', // Ensure Tabs container is full width
            '& .MuiTabs-flexContainer': {
              width: '100%',
            },
            '& .MuiTab-root': {
              flexGrow: 1, // Make each Tab take up equal width
              textTransform: 'none', // Disable uppercase
              fontWeight: 'bold',
              fontSize: '16px',
              color: '#555', // Tab text color
              '&.Mui-selected': {
                color: '#1976d2', // Color for selected tab
              },
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#1976d2', // Indicator color
              height: 4, // Indicator height
            },
          }}
        >
          <Tab label="All Batch" {...a11yProps(0)} />
          <Tab label="Expiring Batch" {...a11yProps(1)} />
          <Tab label="Batch Stock Status" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <ViewAllBatch id={id}/>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <ExpiringBatch id={id}/>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <OutofStockBatch id={id}/>
      </CustomTabPanel>
     
    </Box>
  );
}