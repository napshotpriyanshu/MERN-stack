const express = require('express');
const app = express();

const cors = require('cors')
app.use(cors())

const dotenv = require('dotenv');
dotenv.config({path: './config.env'});

const connectDB = require('./db');
const fetchAndSeedData = require('./data/seedData');
const Product = require('./models/productSchema');

connectDB();


app.use(require('./router/routeGET'));
app.use(require('./router/combineRoute'));

app.listen(4000,function(){
    console.log("Server is running on port 4000");
})