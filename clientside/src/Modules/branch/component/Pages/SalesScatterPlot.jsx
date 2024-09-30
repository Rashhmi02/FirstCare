import React, { useState, useEffect } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import config from '../../../../config';

const SalesScatterPlot = () => {
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

  // Transform data for the scatter plot
  const transformedData = salesData.map(sale => ({
    date: new Date(sale.createdAt).getTime(),
    total: sale.total,
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ScatterChart
        margin={{
          top: 10, right: 30, left: 0, bottom: 0,
        }}
      >
        <CartesianGrid />
        <XAxis
          type="number"
          dataKey="date"
          name="Date"
          domain={['dataMin', 'dataMax']}
          tickFormatter={(tick) => new Date(tick).toLocaleDateString()}
        />
        <YAxis type="number" dataKey="total" name="Total Sales" />
        <Tooltip
          cursor={{ strokeDasharray: '3 3' }}
          formatter={(value, name, props) => [value, name === 'date' ? new Date(props.payload.date).toLocaleDateString() : name]}
        />
        <Scatter name="Sales" data={transformedData} fill="#8884d8" />
      </ScatterChart>
    </ResponsiveContainer>
  );
};

export default SalesScatterPlot;
