const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  deliveryDate: {
    type: Date,
    required: true
  },
  destination: {
    type: String,
    required: false
  }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
