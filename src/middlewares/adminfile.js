const express = require("express")

const authmiddleware = async(req, res, next)=>{
    const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "Authorization header missing" });
        }
        const role =  await authHeader.split(' ')[1];
        if (role !== "admin") {
          return res.status(403).json({ message: "Unauthorized" });
        }
        next();
}

module.exports = authmiddleware;