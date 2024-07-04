import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend} from 'recharts';



function Bar_Chart() {


    const [month, setMonth] = useState('03');
    const [barChartData, setBarChartData] = useState([]);


    const fetchBarData = async (month) => {
        try {
            const response = await axios.get('http://localhost:4000/bar-chart', {
                params: { month }
            });
            setBarChartData(response.data);
            console.log(barChartData);



        } catch (error) {
            console.error('Error fetching statistics:', error);
        }
    };

    useEffect(() => {
        fetchBarData(month);
    }, [month]);


    const handleMonthChange = (event) => {
        setMonth(event.target.value);
      };

  return (
    <div>

<div>
                <label htmlFor="month-select">Select Month: </label>
                <select id="month-select" value={month} onChange={handleMonthChange}>
                    <option value="01">January</option>
                    <option value="02">February</option>
                    <option value="03">March</option>
                    <option value="04">April</option>
                    <option value="05">May</option>
                    <option value="06">June</option>
                    <option value="07">July</option>
                    <option value="08">August</option>
                    <option value="09">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                </select>
            </div>
        <BarChart
          width={500}
          height={300}
          data={barChartData}
          margin={{
            top: 20, right: 30, left: 20, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="priceRange" />
          <YAxis />
          <Legend />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
    </div>
  )
}

export default Bar_Chart