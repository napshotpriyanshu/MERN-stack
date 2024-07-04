const express = require('express');
const router = express.Router();
const Product = require('../models/productSchema');
const axios = require('axios');


const STATISTICS_API = 'http://localhost:4000/statistics';
const BAR_CHART_API = 'http://localhost:4000/bar-chart';
const PIE_CHART_API = 'http://localhost:4000/pie-chart';

router.get('/combined', async (req, res) => {
    try {

        const { month } = req.query;

        const [transactionsRes, statisticsRes, pieChartRes] = await Promise.all([
            
            // axios.get(`${STATISTICS_API}?month=${month}`),
            // axios.get(`${BAR_CHART_API}?month=${month}`),
            // axios.get(`${PIE_CHART_API}?month=${month}`)

            axios.get(STATISTICS_API, { params: { month } }),
            axios.get(BAR_CHART_API, { params: { month } }),
            axios.get(PIE_CHART_API, { params: { month } })
        ]);

        const combinedRes = {
            transactions: transactionsRes.data,
            statistics: statisticsRes.data,
            pieChart: pieChartRes.data
        };

        res.json(combinedRes).status(200);
    
    } catch (error) {
        console.log(error);
        return res.status(400).send(error);    
    }

});



module.exports = router;