// src/Dashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import config from '../../../../config';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const host = config.host;
  const [salesData, setSalesData] = useState([]);
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    axios.get(`${host}/api/branch/getBranch`)
      .then((res) => {
        setBranches(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [host]);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await axios.get(`${host}/api/sales/getBranchWiseSales`);
        setSalesData(response.data);
      } catch (error) {
        console.error('Error fetching sales data:', error);
      }
    };

    fetchSalesData();
  }, [host]);

  const aggregateSalesByBranch = () => {
    const branchSales = branches.reduce((acc, branch) => {
      acc[branch._id] = { name: branch.branchName.trim(), total: 0 };
      return acc;
    }, {});

    salesData.forEach((sale) => {
      if (branchSales[sale.branch]) {
        branchSales[sale.branch].total += sale.total;
      }
    });

    const branchNames = Object.values(branchSales).map(branch => branch.name);
    const totals = Object.values(branchSales).map(branch => branch.total);

    return { branchNames, totals };
  };

  const { branchNames, totals } = aggregateSalesByBranch();

  const data = {
    labels: branchNames,
    datasets: [
      {
        label: 'Total Sales',
        data: totals,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Sales by Branch',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' ,}}>
      <div style={{ width: '100%', maxWidth: '800px', height: '500px',marginBottom:'20px' }}>
        <h1>Sales by Branch</h1>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default Dashboard;
