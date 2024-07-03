const express = require('express');
const app = express();

const dotenv = require('dotenv');
dotenv.config({path: './config.env'});

const connectDB = require('./db');
const fetchAndSeedData = require('./data/seedData');
const Product = require('./models/productSchema');

connectDB();


app.use(require('./router/routeGET'));

app.listen(4000,function(){
    console.log("Server is running on port 4000");
})