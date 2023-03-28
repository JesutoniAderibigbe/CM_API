const multer = require('multer');
const path = require("path");


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'images') // specify the directory where files will be stored
    },
    filename: function (req, file, cb) {
      console.log(file);
      cb(null, Date.now() + path.extname(file.originalname)) // specify the file name format
    }
  });
  
  const upload = multer({ storage: storage });
  
  module.exports = upload;