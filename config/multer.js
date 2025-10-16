// config/multer.js
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

// Configure storage directly in Cloudinary — no local save
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "uploads",
    allowed_formats: ["jpg", "png", "pdf", "docx", "mp3", "mp4"],
    resource_type: "auto", // allows any file type (image, video, pdf, etc.)
  },
});

const upload = multer({ storage });
module.exports = upload;
