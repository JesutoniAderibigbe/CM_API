const express = require("express");
const router = express.Router();
const adminKey = require("../middlewares/adminfile")
const userController = require("../controllers/userControllers");
const {authMiddleware} = require("../middlewares/authUser");
const limiter = require("../middlewares/ratelimit");
//const authUser = require("../middlewares/authUser");

router.post('/', userController.UserSignUp); // Users Sign Up
router.post('/api/login', userController.UserLogin); //Users Login
router.get('/', adminKey, userController.getUsers) //Get Users
router.delete('/:id', authMiddleware, userController.deleteUsers); //Delete Users

router.put("/api/v1/:id", authMiddleware, userController.updateUsers); //Update Users
router.post("/api/v1/:userId/orders", authMiddleware, limiter, userController.addProductforUser); //Add Orders to users cart
router.delete("/api/v1/:userId/orders/:orderId", authMiddleware,userController.deleteOrderForUser); //Delete Orders from users cart
router.get("/api/v1/:email", authMiddleware, userController.getUsersbyId);  // Get Users by EmailId to know what is in the orders cart
router.put("/api/v1/:userId/orders/:orderId",authMiddleware, limiter, userController.updateOrderforUser); //Update Orders from users cart
router.get("/api/v1/orders/:email", userController.getOrdersforUser); //Get Orders for specific users
router.post("/api/v1/password", userController.resetPassword); //Forgot Password for Users

router.post("/api/v1/orders/:email/pay", limiter, authMiddleware, userController.makePayment);//User making payments for the orders

router.get("/api/v1/:userId/orders/price", userController.getOrdersAndPrice);
//Get all Orders for admin


module.exports = router;