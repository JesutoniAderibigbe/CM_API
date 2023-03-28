const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const OrderSchema = require("./Orders");

const UserSchema =  new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 30
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  orders: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      //required: true
    },
    deliveryDate: {
      type: Date,
      //required: true
    }
  }] // add the orders property as an array of orders
});

//hash the password before saving it to the database
UserSchema.pre("save", async function(next){
  const user = this;

  if (user.isModified('password') || user.isNew) {
    const hash = await bcrypt.hash(user.password, 10);
    user.password = hash;
  }
  next()
});

module.exports = new mongoose.model("User", UserSchema);
