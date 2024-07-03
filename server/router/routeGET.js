const express = require('express');
const router = express.Router();
const Product = require('../models/productSchema')




router.get('/initdb', async (req, res) => {
    await fetchAndSeedData();
    res.send('Database initialized and seeded');
});

router.get('/products', async (req, res) => {
    const products = await Product.find();
    res.json(products);
});





router.get('/transactions', async (req, res) => {
    try {
        const { search = '', page = 1, perPage = 10, month } = req.query;
        const pageNum = parseInt(page);
        const limit = parseInt(perPage);
        const skip = (pageNum - 1) * limit;

        let query = {};


        if (search) {

            const searchAsNumber = parseFloat(search);
            if (!isNaN(searchAsNumber)) {
                query = {
                    $or: [
                        { title: { $regex: search, $options: "i" } },              // regex regular expression capabilities for pattern matching strings in queries , i denote it is case insensitive
                        { description: { $regex: search, $options: "i" } },
                        { price: { $eq: searchAsNumber } }
                    ]
                };
            } else {
                query = {
                    $or: [
                        { title: { $regex: search, $options: "i" } },
                        { description: { $regex: search, $options: "i" } }
                    ]
                };
            }
        }


        if (month) {
            
            query= {
                $expr: {                                                              // build query expressions that compare fields from the same document 
                    $eq: [{ $month: '$dateOfSale' }, parseInt(month, 10)]
                }
            
            };
        }

        const transactions = await Product.find(query).skip(skip).limit(limit);

        const total = await Product.countDocuments(query);

        res.json({
            transactions,
            total,
            page: pageNum,
            perPage: limit,
            totalPages: Math.ceil(total / limit),
        }).status(200);

    } catch (error) {
        console.log(error);
        return res.status(400).send(error);
    }
});

module.exports = router;