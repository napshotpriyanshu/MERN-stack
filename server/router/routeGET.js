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



router.get('/statistics', async (req, res) => {
    try {
        const { month } = req.query;
        let query = {};

        if (month) {
            
            query= {
                $expr: {                                                              
                    $eq: [{ $month: '$dateOfSale' }, parseInt(month, 10)]
                }
            
            };
        }

        const totalSaleAmount = await Product.aggregate([
            { $match: query },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: '$price' }
                }
            }
        ]);

        const totalSoldItems = await Product.countDocuments({
            ...query,
            sold: true
        });

        const totalNotSoldItems = await Product.countDocuments({
            ...query,
            sold: false
        });

        res.json({
            totalSaleAmount: totalSaleAmount.length > 0 ? totalSaleAmount[0].totalAmount : 0,
            totalSoldItems,
            totalNotSoldItems
        }).status(200);
    } catch (error) {
        console.log(error);
        return res.status(400).send(error);
    }
});






router.get('/bar-chart', async (req, res) => {
    try {
        const { month } = req.query;
        let query = {};

        if (month) {
            
            query= {
                $expr: {                                                              
                    $eq: [{ $month: '$dateOfSale' }, parseInt(month, 10)]
                }
            
            };
        }
        
        const result = await Product.aggregate(
            
            [
                {
                    $match: query
                },
                {
                    $group: {
                        _id: {
                            $switch: {
                                branches: [
                                    { case: { $and: [{ $gte: ['$price', 0] }, { $lte: ['$price', 100] }] }, then: '0 - 100' },
                                    { case: { $and: [{ $gte: ['$price', 101] }, { $lte: ['$price', 200] }] }, then: '101 - 200' },
                                    { case: { $and: [{ $gte: ['$price', 201] }, { $lte: ['$price', 300] }] }, then: '201 - 300' },
                                    { case: { $and: [{ $gte: ['$price', 301] }, { $lte: ['$price', 400] }] }, then: '301 - 400' },
                                    { case: { $and: [{ $gte: ['$price', 401] }, { $lte: ['$price', 500] }] }, then: '401 - 500' },
                                    { case: { $and: [{ $gte: ['$price', 501] }, { $lte: ['$price', 600] }] }, then: '501 - 600' },
                                    { case: { $and: [{ $gte: ['$price', 601] }, { $lte: ['$price', 700] }] }, then: '601 - 700' },
                                    { case: { $and: [{ $gte: ['$price', 701] }, { $lte: ['$price', 800] }] }, then: '701 - 800' },
                                    { case: { $and: [{ $gte: ['$price', 801] }, { $lte: ['$price', 900] }] }, then: '801 - 900' },
                                    { case: { $gte: ['$price', 901] }, then: '901-above' }
                                ],
                                default: 'Unknown'
                            }
                        },
                        count: { $sum: 1 }
                    }
                }
            ]

        );


        const formattedResult = result.map(item => ({
            priceRange: item._id,
            count: item.count
        }));

        res.json(formattedResult).status(200);
    } catch (error) {
        console.log(error);
        return res.status(400).send(error);
    }
});
router.get('/pie-chart', async (req, res) => {
    try {
        const { month } = req.query;
        let query = {};

        if (month) {
            
            query= {
                $expr: {                                                              
                    $eq: [{ $month: '$dateOfSale' }, parseInt(month, 10)]
                }
            
            };
        }
        
        

        const result = await Product.aggregate([
            {
                $match: query
            },
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    category: '$_id',
                    count: 1,
                    _id: 0
                }
            }
        ]);




        const formattedResult = result.map(item => ({
            category: item.category,
            count: item.count
        }));


        res.json(formattedResult).status(200);

        
    } catch (error) {
        console.log(error);
        return res.status(400).send(error);
    }
});



module.exports = router;