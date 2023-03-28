const mongoose = require("mongoose");
const random = require("mongoose-random");

const productsSchema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId()
    },

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


module.exports = new mongoose.model("Product", productsSchema)