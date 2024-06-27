import './Chart.css'
import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from 'recharts';

const Chart = () => {
  const [data, setData] = useState([]);
  const [timeframe, setTimeframe] = useState('daily');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [minValue, setMinValue] = useState('');

  useEffect(() => {
    fetch('/data.json')
      .then(response => response.json())
      .then(data => setData(data));
  }, []);

  const filterDataByCriteria = (data, startDate, endDate, minValue) => {
    return data.filter(point => {
      const date = new Date(point.timestamp);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      const value = minValue ? parseFloat(minValue) : null;

      return (!start || date >= start) &&
             (!end || date <= end) &&
             (!value || point.value >= value);
    });
  };

  const filterDataByTimeframe = (data, timeframe) => {
    let filteredData;
    switch (timeframe) {
      case 'daily':
        filteredData = data; // Just return all data for simplicity
        break;
      case 'weekly':
        filteredData = data.filter((_, index) => index % 7 === 0); // Example filter for weekly
        break;
      case 'monthly':
        filteredData = data.filter((_, index) => index % 30 === 0); // Example filter for monthly
        break;
      default:
        filteredData = data;
    }
    return filteredData;
  };

  const handleTimeframeChange = (newTimeframe) => {
    setTimeframe(newTimeframe);
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const handleMinValueChange = (e) => {
    setMinValue(e.target.value);
  };

  const filteredDataByCriteria = filterDataByCriteria(data, startDate, endDate, minValue);
  const filteredData = filterDataByTimeframe(filteredDataByCriteria, timeframe);

  return (
    <div>
      <div>
        <button onClick={() => handleTimeframeChange('daily')}>Daily</button>
        <button onClick={() => handleTimeframeChange('weekly')}>Weekly</button>
        <button onClick={() => handleTimeframeChange('monthly')}>Monthly</button>
      </div>
      <div className="filterContainer">
        <div>
          <label>
          Start Date:
          <input type="date" value={startDate} onChange={handleStartDateChange} />
        </label></div>
        <div><label>
          End Date:
          <input type="date" value={endDate} onChange={handleEndDateChange} />
        </label></div>
        <div><label>
          Min Value:
          <input type="number" value={minValue} onChange={handleMinValueChange} />
        </label></div>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={filteredData}>
          <XAxis dataKey="timestamp" />
          <YAxis />
          <Tooltip />
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#8884d8"
            animationDuration={1500}
            animationEasing="ease-in-out"
            onClick={(data) => alert(`Value: ${data.value}`)}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
