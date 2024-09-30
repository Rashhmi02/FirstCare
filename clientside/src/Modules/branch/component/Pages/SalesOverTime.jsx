import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import config from '../../../../config';

const MonthlySalesTrendsChart = () => {
  const host = config.host;
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    const tokens = JSON.parse(localStorage.getItem('userToken'));

    const fetchSalesData = async () => {
      try {
        const response = await axios.get(`${host}/api/sales/getSales`, {
          headers: { 'auth-token': tokens },
        });
        setSalesData(response.data);
        console.log(response.data, 'sales');
      } catch (error) {
        console.error('Error fetching sales data:', error);
      }
    };

    fetchSalesData();
  }, [host]);

  // Transform data for the line chart
  const transformedData = salesData.reduce((acc, sale) => {
    const month = new Date(sale.createdAt).toLocaleString('default', { month: 'short', year: 'numeric' });
    const existingEntry = acc.find(entry => entry.month === month);
    if (existingEntry) {
      existingEntry.total += sale.total;
    } else {
      acc.push({ month, total: sale.total });
    }
    return acc;
  }, []);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        width={500}
        height={300}
        data={transformedData}
        margin={{
          top: 5, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="total" stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default MonthlySalesTrendsChart;
