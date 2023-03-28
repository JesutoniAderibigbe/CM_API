const mongoose = require("mongoose");

const ordersSchema = mongoose.Schema({
    
    title: {
        type: "String",
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
      category: {
        type: "String",
        required: true
      }

      
})


module.exports = new mongoose.model("Orders", ordersSchema)