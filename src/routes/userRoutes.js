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

router.put("/:id", authMiddleware, userController.updateUsers); //Update Users
router.post("/:userId/orders", authMiddleware, limiter, userController.addProductforUser); //Add Orders to users cart
router.delete("/:userId/orders/:orderId", authMiddleware,userController.deleteOrderForUser); //Delete Orders from users cart
router.get("/:email", authMiddleware, userController.getUsersbyId);  // Get Users by EmailId to know what is in the orders cart
router.put("/:userId", userController.updateOrderforUser); //Update Orders from users cart
router.get("/orders/:email", userController.getOrdersforUser); //Get Orders for specific users
router.post("/password", userController.resetPassword); //Forgot Password for Users

router.post("/orders/:email/pay", limiter, authMiddleware, userController.makePayment);//User making payments for the orders

router.get("/:userId/orders/price", userController.getOrdersAndPrice);
//Get all Orders for admin


module.exports = router;