const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose  = require("mongoose");
const port = process.env.PORT || 8000
const userRoutes = require('./src/routes/userRoutes');
const productRoutes = require('./src/routes/productRoutes');
const path = require('path');




//connect to MongoDB
mongoose.connect('mongodb+srv://Jesutoni:Jaderibigbe147$@cluster0.8azare7.mongodb.net/shop-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  writeConcern: {
    w: 'majority'
  }
}).then(()=>{
  console.log("MongoDB connected")
});


//set up middleware 
app.use(bodyParser.json())


//set up routes

app.get('/', async(req, res)=>{
  res.status(200).send("Welcome to Shopify API")
})

app.use('/users', userRoutes);
app.use('/products', productRoutes);


// Serve static files from public directory
//app.use('/public', express.static(path.join(__dirname, 'public')));


//set up server
app.listen(port, ()=>{
    console.log(`Server running on port ${port}`)
})


