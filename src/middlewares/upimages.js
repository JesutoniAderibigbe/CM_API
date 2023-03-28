const multer = require('multer');
const Grid = require('gridfs-stream');
const GridFsStorage = require('multer-gridfs-storage');
const mongoose = require('mongoose');

const conn = mongoose.createConnection('mongodb+srv://Jesutoni:Jaderibigbe147$@cluster0.8azare7.mongodb.net/shop-db');

let gfs;
conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

const storage = new GridFsStorage({
  url: 'mongodb+srv://Jesutoni:Jaderibigbe147$@cluster0.8azare7.mongodb.net/shop-db', 
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      const filename = `${Date.now()}_${file.originalname}`;
      const fileInfo = {
        filename: filename,
        bucketName: 'uploads'
      };
      resolve(fileInfo);
    });
  }
});

const upload = multer({ storage: storage });
