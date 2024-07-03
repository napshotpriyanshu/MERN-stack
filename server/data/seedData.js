const axios = require('axios');
const Product = require('../models/productSchema');

const fetchAndSeedData = async () => {
    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const products = response.data;

        await Product.insertMany(products);
        console.log('Database seeded successfully');
    } catch (error) {
        console.error('Error seeding the database', error);
    }
};

module.exports = fetchAndSeedData;
