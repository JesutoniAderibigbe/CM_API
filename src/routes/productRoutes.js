const express = require("express");
const router = express.Router();
const productController = require('../controllers/productControllers');
const upload = require('../middlewares/authfile');
const adminKey = require('../middlewares/adminfile');
const limiter = require('../middlewares/ratelimit');
const productCache = require('../middlewares/cache');

router.post("/", adminKey, upload.single('image'),  productController.addProduct); //Add Products to the database by Admin
router.get("/", limiter, productController.getAllProducts); //Get all products
router.get("/:brand", limiter, productController.getProductsbyName); //Get Products by name
router.get("/p/:category", limiter, productController.getProductsbyCategory); //get products by category
router.post("/:productId", adminKey, upload.single("image"), productController.updateProduct) //update products 
router.delete("/:productId", adminKey, productController.deleteProduct); //deleteProduct
//router.get("/api/:price", productController.getProductsbyPrice);
router.post('/a/practice', upload.single("image"), productController.practice);


module.exports = router;


//Don't forget to add product cache