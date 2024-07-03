const express = require('express');
const app = express();

const connectDB = require('./db');
const fetchAndSeedData = require('./data/seedData');
const Product = require('./models/productSchema');

connectDB();

app.get('/initdb', async (req, res) => {
    await fetchAndSeedData();
    res.send('Database initialized and seeded');
});

app.get('/products', async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

app.listen(4000,function(){
    console.log("Server is running on port 4000");
})