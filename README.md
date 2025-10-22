The File Uploader App is web application focused on backend side, that allows authenticated users to upload, view, download, edit, and delete files securely.
Uploaded files are stored on Cloudinary, and their metadata (such as filename, type, upload date, and Cloudinary URL) is saved in a PostgreSQL database via Prisma ORM.

This project is designed to provide an organized, cloud-integrated file management system similar to Google Drive — with user authentication, folder organization, and smooth upload/download operations.

🚀 Features

🔒 User Authentication – Only logged-in users can upload or manage files.

☁️ Cloud Storage (Cloudinary) – Files are uploaded directly to the cloud with secure URLs.

💾 Database Integration – Prisma manages all file and folder data in PostgreSQL.

📤 Upload Files – Supports documents, images, videos, and audio files.

🧾 File Management – View, edit (rename), download, or delete uploaded files.

📁 Folder Support – Organize uploads into custom folders.

🧹 Automatic Cleanup – Temporary local uploads are removed after successful upload.

🛠️ Technologies Used

Backend: Node.js, Express.js

Database: PostgreSQL (via Prisma ORM)

Authentication: Passport.js and Express Sessions

File Upload: Multer & Multer-Storage-Cloudinary

Cloud Storage: Cloudinary

Frontend: EJS Templates, CSS, JavaScript

Other Tools: dotenv, bcrypt, connect-flash, etc.

⚙️ How It Works

A user logs in to their account.

They select a file from their computer and choose (optionally) a folder to upload to.

The file is uploaded directly to Cloudinary via Multer middleware.

Cloudinary returns a public URL that is saved to the database.

Users can then view, download, edit, or delete their files anytime.