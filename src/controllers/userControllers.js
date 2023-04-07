

const express = require("express");

const User = require("../models/Users");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Product = require('../models/Products');

const Order = require("../models/Orders");

const config = require('./config');

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.email,
    pass: config.password,
  },
});




const generateRandomPassword = require("generate-random-password");

// use config.email and config.password in your code




const SECRET_KEY = "sk_test_51MmyWZKEeMo1d6ezf8DmLqa8OWMHfFbNVDV4fIVS3iur30I2QARaJpukJPGdpUQpm4aCGFq1j0VHBrcm0bNQQpVd00vvYv5GH8";

const stripe = require('stripe')(SECRET_KEY);


const JWT_SECRET = "facebook"




//Sign Up user
exports.UserSignUp = async(req, res)=>{
    try {
        const existingUser = await User.findOne( {$or: [{ email: req.body.email }, { username: req.body.username }]},)
        if(existingUser){

          if (existingUser.username === req.body.username) {
        return res.status(400).json({ error: "Username is already taken. Please choose another" });
      }
      if(req.body.username.length < 8){
        return res.status(400).json({ error: "Username is short. Username should not be less than eight characters" });
      }
      if (existingUser.email === req.body.email) {
        return res.status(400).json({ error: "Email is currently in use" });
      }
        }
        const user = new User({
            email: req.body.email,
            password: req.body.password,
            username: req.body.username,
            createdAt: new Date(), 
        })
        await user.save();

      //   const transporter = nodemailer.createTransport(transporter {
      //     service: "hotmail",
      //     auth: {
      //       user: "outlook_DD7428FBF76933B9@outlook.com",
      //       pass: "jesutoni"
      //     }
      //   });;

      // }




        res.status(201).json({message: `${user.username} with the email ${user.email} has been created`})
        
    } catch (error) {
        res.status(404).json({
            message: `This is the ${error}`
        })
        console.log(error)
        
    }
}



exports.getUsersbyId = async(req, res)=>{
    try {
        const user = await User.findOne({email: req.params.email})
        console.log(user)

if(!user){
    return res.status(400).json({message: `There is no user with ${req.params.email} `})
}
return res.status(200).json(user);
        
    } catch (error) {
        console.log(error)
        res.status(404).json({error: error.message})
        
    }






}


//Login Users

exports.UserLogin = async(req, res)=>{


    try {
        const{ email, password} = req.body
    
//check if the user exists
const user = await User.findOne({email})

if(!user){
    return res.status(400).json({error: "No user with such records"})
}


//check if the password is valid

const isPasswordValid= await bcrypt.compare(password, user.password)

if(!isPasswordValid){
    console.log(isPasswordValid)
    return res.status(400).json({error: "Invalid Password"})
}else{
    const token = jwt.sign({userId: user._id}, JWT_SECRET)
    return res.json({user, token})
}
        
    } catch (error) {
        res.status(404).json({message: "There is an error logging the user"})
        console.log(error);
        
    }
    


}


//get Users Record
exports.getUsers = async(req,res)=>{
    const user = await User.find().populate("orders");
    res.json({users: user})
    console.log(user)
}


//delete users record

exports.deleteUsers = async(req, res)=>{

    try {
        const user = await User.findByIdAndDelete(req.params.id);
    if(!user){
        return res.status(400).json({message: "No User with that id found"})
    }
    res.json({message: "User deleted"})
        
    } catch (error) {
        res.status(404).json({error: error.message})
        
    }
    
}


//update UsersRecords
exports.updateUsers = async(req, res)=>{
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
             })
             if(!user){
                 return res.status(400).json({message: "There is no user with such ID"})
             }
             console.log({user:user})
             return res.status(200).json(user)
        
    } catch (error) {
        res.status(404). json({error: error.message})
        console.log(error)
    }
    
    
}

//forgot password
 exports.resetPassword = async (req, res) => {
  const { email } = req.body;
  
  // Check if the user with the given email exists
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }


  function generateRandomPassword(length = 8) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += chars[Math.floor(Math.random() * chars.length)];
    }
    return password;
  }
  
  
  // Generate a new random password
  const newPassword = generateRandomPassword();
  
  // Hash the new password and save it to the database
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();
  
  // Send the new password to the user's email address
  const mailOptions = {
    from: config.email,
    to: email,
    subject: 'Password reset',
    text: `Your new password is: ${newPassword}`
  };
  
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).json({ message: "Failed to send email" });
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).json({ message: "Password reset successful" });
    }
  });
};




exports.addProductforUser = async (req, res) => {
    try {
      const { productId, deliveryDate, destination } = req.body;
      const { userId } = req.params;
  
      // Get the user by ID
      const user = await User.findById(userId);
  
      // Make sure that the user exists
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
   
      // Create a new order object
      const order = new Order({
        user: userId,
        product: productId,
        deliveryDate: new Date(deliveryDate).toISOString(),
        destination: destination
      });

      await order.save();
  
      // Push the order to the user's orders array
      user.orders.push(order);
  
      // Save the user to the database
      await user.save();
      //await order.save();
  
      res.json({ success: true, message: 'Product added to order' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };


  exports.deleteOrderForUser = async(req, res)=>{
    try {
      const { userId, orderId } = req.params;
  
      // Get the user by ID
      const user = await User.findById(userId);
      console.log(user);
  
      // Make sure that the user exists
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
  
      // Find the index of the order to be deleted in the user's orders array
      const orderIndex = user.orders.findIndex(order => order._id == orderId);
  
      // Make sure that the order exists
      if (orderIndex === -1) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }
  
      // Remove the order from the user's orders array
      user.orders.splice(orderIndex, 1);
  
      // Save the updated user object
      await user.save();
  
      res.json({ success: true, message: 'Order deleted' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  }


  exports.getOrdersAndPrice = async (req, res) => {
    try {
      const { userId } = req.params;
  
      // Get the user by ID
      const user = await User.findById(userId);
  
      // Make sure that the user exists
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
  
      // Get the total number of orders
      const numOrders = user.orders.length;
  
      // Calculate the total price of all orders
      let totalPrice = 0;
      for (const order of user.orders) {
        const product = await Product.findById(order.productID);
  
        if (product && typeof product.price === 'number') {
          
          totalPrice += product.price;
          console.log(`Product price: ${product.price}`);
        }
      }
      
      
      
      console.log(`Total price: ${totalPrice}`);
      res.json({ success: true, numOrders, totalPrice });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };
  


  exports.updateOrderforUser = async (req, res) => {
    try {
        const { orderId, userId } = req.params;
        const { productId, deliveryDate, destination } = req.body;

        // Find the user by order ID and update the order
        const user = await User.findOneAndUpdate(
            { "orders._id": orderId },
            { $set: { "orders.$.product": productId, "orders.$.deliveryDate": deliveryDate, "orders.$.destination": destination} },
            { new: true }
        );
        console.log(user);
      


        // Make sure that the user exists and the order was updated
        if (!user) {
            return res.status(404).json({ success: false, message: 'User or order not found' });
        }
        await user.save();

        res.json({ success: true, message: 'Order updated successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

 


exports.makePayment = async(req, res)=> {
  const name = req.body.name;
  const amount = req.body.amount;
  const orderId = req.body.orderId;
  const email = req.params.email;

  try {
    const customer = await stripe.customers.create({
      email: req.body.stripeEmail,
      source: req.body.stripeToken,
      name: name
    });

    const paymentMethods = await stripe.paymentMethods.list({
      customer: customer.id,
      type: 'card',
    });

    console.log(paymentMethods)

    if (paymentMethods.data.length === 0) {
      throw new Error('Customer does not have an active payment method.');
    }

    const charge = await stripe.charges.create({
      amount: amount,
      description: "Products",
      currency: 'USD',
      customer: customer.id,
      receipt_email: req.body.stripeEmail
    });

    const chargeId = charge.id;
    const receiptLink = `https://dashboard.stripe.com/receipts/${chargeId}`;

    res.json({
      message: `Success, ${name} has ordered for product item ${orderId}`,
      receipt_link: receiptLink
    });


    


  } catch (error) {
    console.log(error.message);

    res.json({message: error.message});
  }
};


exports.getOrdersforUser = async(req, res)=>{
  try {
    const user = await User.findOne({email: req.params.email}).populate("orders");


    if(!user){
      return res.status(400).json({message: "There is no user with such email"})
    }


    if (user.orders.length === 0) {
      return res.status(200).json({ message: "This user has no orders" });
    }

    console.log(user)
    return res.status(200).json(user)
    
  } catch (error) {
    console.log(error)
    res.status(404).json({error: error.message})
    
  }
 
}


exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user');

    if (orders.length === 0) {
      return res.status(404).json({ message: 'There are no orders.' });
    }

    console.log(orders);

    res.status(200).json({ orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
