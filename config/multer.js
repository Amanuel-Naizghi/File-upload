const multer = require("multer");
const {CloudinaryStorage} = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");
const path = require("path");

//for configuring cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads",
    allowed_formats: ["jpg", "png", "pdf", "docx", "mp3", "mp4"],
  },
})
  
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/") || file.mimetype === "application/pdf") {
        cb(null, true);
    } else {
        cb(new Error("Only images and PDFs are allowed!"), false);
    }
};
  
  // initialize upload
  const upload = multer({ storage });
  
  module.exports = upload;
  