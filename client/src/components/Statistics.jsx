import React, { useState, useEffect } from 'react';
import axios from 'axios';
function Statistics() {

    const [month, setMonth] = useState('03');

    const [statistics, setStatistics] = useState({
        totalSaleAmount: 0,
        totalSoldItems: 0,
        totalNotSoldItems: 0
    });

    const fetchStatistics = async (month) => {
        try {
            const response = await axios.get('http://localhost:4000/statistics', {
                params: { month }
            });
            setStatistics(response.data);
        } catch (error) {
            console.error('Error fetching statistics:', error);
        }
    };

    useEffect(() => {
        fetchStatistics(month);
    }, [month]);

    const handleMonthChange = (event) => {
        setMonth(event.target.value);
    };



    return (
        <div className="statistics">


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

            <div>Total Sale Amount: ${statistics.totalSaleAmount}</div>
            <div>Total Sold Items: {statistics.totalSoldItems}</div>
            <div>Total Not Sold Items: {statistics.totalNotSoldItems}</div>
        </div>
    )
}

export default Statistics