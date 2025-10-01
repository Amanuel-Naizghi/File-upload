const multer = require("multer");
const path = require("path");

//for configuring multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb){
      cb(null,"uploads/")
    },
    filename: function (req, file, cb){
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });
  
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/") || file.mimetype === "application/pdf") {
        cb(null, true);
    } else {
        cb(new Error("Only images and PDFs are allowed!"), false);
    }
};
  
  // initialize upload
  const upload = multer({ storage: storage, fileFilter: fileFilter });
  
  module.exports = upload;
  