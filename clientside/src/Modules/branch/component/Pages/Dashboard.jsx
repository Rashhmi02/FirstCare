import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import config from '../../../../config';

const Dashboard = () => {
  const host = config.host;
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    // Fetch sales data from your backend
    const tokens = JSON.parse(localStorage.getItem('userToken'));

    const fetchSalesData = async () => {
      try {
        const response = await axios.get(`${host}/api/sales/getSales`, {
          headers: { 'auth-token': tokens },
        }); // Update with your API endpoint
        setSalesData(response.data);
        console.log(response.data, 'sales');
      } catch (error) {
        console.error('Error fetching sales data:', error);
      }
    };

    fetchSalesData();
  }, [host]);

  // Transform data for the graph
  const transformedData = salesData.reduce((acc, sale) => {
    const date = new Date(sale.createdAt).toLocaleDateString();
    const existingEntry = acc.find(entry => entry.date === date);
    if (existingEntry) {
      existingEntry.total += sale.total;
    } else {
      acc.push({ date, total: sale.total });
    }
    return acc;
  }, []);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        width={500}
        height={300}
        data={transformedData}
        margin={{
          top: 5, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="total" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Dashboard;
