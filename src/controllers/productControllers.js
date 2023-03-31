const express = require("express")
const Product = require('../models/Products')
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const cloudinary = require('../utils/cloudinary');
const upload = require('../middlewares/authfile');




exports.addProduct = async(req, res)=> {
  try {

    if (!req.file) {
      return res.status(400).json({ error: "No image provided" });
    }
    

    const result = await cloudinary.uploader.upload(req.file.path);
    
    
    const product = new Product({
      title: req.body.title,
      price: req.body.price,
      image: result.secure_url,
      category: req.body.category,
    });

    
    
    await product.save();

    res.json({
      success: true,
      message: 'Product added successfully',
      product: {
        title: product.title,
        price: `#${product.price}`,
        image: result.secure_url,
        category: product.category
      }
    });
  } catch (error) {
    res.status(404).json({error: error.message});
    console.log(error);
  }
}


exports.getAllProducts = async(req, res)=>{
    try {
        const product = await Product.find()
      

        if(!product){
            return res.status(400).json({message: "There are no products at all in this database"})
        }
        const productsWithImageUrl = product.map(product => {
            const imageUrl = product.image;
            return {
              title: product.title,
              price: `#${product.price}` ,
              image: product.image,
              id: product._id,
              category: product.category
            }
          });

          console.log(productsWithImageUrl)
      
          return res.status(200).json({products: productsWithImageUrl});
         
        
    } catch (error) {
        res.status(404).json({message: error.message})
        
    }
   
}


exports.getProductsbyName = async(req, res)=> {
    const brand = req.params.brand;
    const regex = new RegExp(brand, 'i'); // 'i' flag makes the search case-insensitive
    try {
      const products = await Product.find({ title: regex });
      if (!products.length) {
        return res.status(404).json({ message: `No products found for ${brand}` });
      }
      res.status(200).json({products: products});
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


  exports.getProductsbyCategory = async(req, res)=>{
    const category = req.params.category
    const regex = new RegExp(category, 'i');

    try {
        const products = await Product.find({category: regex});

        if(!products.length){
            return res.status(404).json({ message: `No products found for ${category}` });


        }
        res.status(200).json({products: products});

        
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
        
    }
  }


  exports.getProductsbyPrice = async(req, res)=>{
    try {
      const { price } = req.query;
      let products;
    
      if (price) {
        // Get all products with a price less than or equal to the provided price
        products = await Product.find({ price: { $lte: price } });
      } else {
        // Get all products if no price is provided
        products = await Product.find();
      }
    
      if (!products.length) {
        return res.status(404).json({ message: "No products found" });
      }
    
      res.status(200).json({ products: products });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
    
}


  exports.updateProduct = async(req, res)=>{

    try {
        const {productId}= req.params;

     
      //  await cloudinary.uploader.destory(Product.cloudinary_id);


       const result = await cloudinary.uploader.upload(req.file.path);

        
         console.log(result)

        

        const product = await Product.findByIdAndUpdate(
          productId, req.body, 

          {
            title: req.body.title,
            price: req.body.price,
            image: result.secure_url,
            category: req.body.category,
          },
          
          
          {
            new: true
          }
           
        );
       console.log(result.secure_url);

        if(!product){
            return res.status(400).json({message: "There is no such product on the cart"})
        }
        res.json({product: {
          title: product.title,
          price: `#${product.price}` ,
          image: result.secure_url,
          id: product._id,
          category: product.category

        }})
    } catch (error) {
      console.log(error)
        res.status(500).json({error: error.message})
        
    }
  

  }


  exports.deleteProduct = async(req, res)=>{


    try {
      const {productId} = req.params
    const product = await Product.findByIdAndDelete(productId)


    if(!product){
      console.log(`There is no such product with the ${productId} to delete`)
      return res.status(400).json({message: `There is no such product with the ${productId} to delete`})
    }
    console.log(product)
   
    return res.status(200).json({message: `Product with the id ${productId}has been deleted`})
      
    } catch (error) {
      console.log(error)
      res.status(404).json({error: error.message})
      
    }
    
  }


  exports.practice = async(req, res)=>{

    try {
      const result = await cloudinary.uploader.upload(req.file.path)
      if(!result){
        console.log("There is no image to upload")
      }
      res.status(200).json({message: result})
      
    } catch (error) {
      console.log(error)
      
    }
  }

  


