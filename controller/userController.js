const prisma = require('../index');
const bcrypt = require("bcryptjs");
const {body,validationResult} = require("express-validator");
const userControllerHelper = require("./userControllerHelper");
const axios = require("axios");
const path = require("path");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

const lengthErr1 = "length must be more than 8 characters";
const lengthErr2 = "length must be more than 4 characters and less than 10 characters";

const validateUser = [
    body("password").trim()
    .isLength({min:8}).withMessage(`Password ${lengthErr1}`)
    .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])/)
    .withMessage("Password must contain at least one letter, one number, and one special character")
    .escape(),

    body("confirmPassword").trim()
    .custom((value,{req}) =>{
        if(value !== req.body.password){
            throw new Error("Passwords do not match");
        }
        return true;
    }).escape(),

    body("userName").trim().toLowerCase()
    .isLength({min:4,max:10}).withMessage(`User name ${lengthErr2}`)
    .custom(async (value)=>{ //value is the same as req.body.userName
        const user = await userControllerHelper.getUser(value);
        if(user){
            throw new Error("User already exists");
        }
    }).escape(),

];

exports.postAddUser = [
    validateUser,
    async (req,res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.render('initial',{
                errors:errors.array(),//For showing the error input by the user
                old:req.body// It puts the previous user inputs after the page get reloaded for better UX
            })
        }
        const {userName,password} = req.body;
        const hashedPassword = await bcrypt.hash(password,10);
        try{
            const user = await prisma.user.create({
                data:{userName: userName.toLowerCase(),
                      password: hashedPassword,
                      folders: {
                        create: [
                            {name: "Documents"},
                            {name: "Images"},
                            {name: "Audios"},
                            {name: "Videos"}
                        ]
                       }
                    },
                include: {folders:true}
            })
            
            res.render('login');
        }catch (error) {
            res.status(500).json({error: error.message})
        }
    
        const findAllUsers = await prisma.user.findMany();
        // console.log(`All users are here men`, findAllUsers);
    }
]

exports.createFolder = async (req,res) => {
    const {folderName, parentId} = req.body;

    try{
        const folder = await prisma.folder.create({
            data:{
                name:folderName,
                userId: req.user.id,
                parentId:parentId ? Number (parentId) : null
            }
        });
        res.redirect(`/folders/${parentId || 'root'}`);
    }catch (err) {
        console.error(err);
        res.status(500).json({success:false,error:err.message});
    }
}

exports.getFolderContent = async (req, res) => {
    const folderId = req.params.id || 'root';

    try {
      if (folderId === 'root') {
        const directoryArray = ['root'];
        const folders = await prisma.folder.findMany({
          where: { userId: req.user.id, parentId: null },
          include: { children: true, files: true }
        });
        const files = await prisma.file.findMany({
            where: { userId: req.user.id, folderId: null}
        })
        return res.render('folders', { folder: null, folders, files,directoryArray });
      }
      const folder = await prisma.folder.findUnique({
        where: { id: Number(folderId) },
        include: { children: true, files: true }
      });
      const directoryArray = await userControllerHelper.getDirectory(folder);
    //   console.log(`The folders inside the file directory are `,folder);
    //   console.log(`directory Array`,directoryArray);
  
      if (!folder) {
        return res.status(404).send("Folder not found");
      }
      res.render('folders', {
        folder,
        folders: folder.children,
        files: folder.files,
        directoryArray,
      });
  
    } catch (err) {
      console.error(err);
      res.status(500).send("Error loading folder");
    }
};
//Deleting folder
exports.deleteItem = async(req,res) => {
    const {id,parentId} = req.body;
    try {
        await prisma.folder.delete({
            where: {id:Number(id)}
        });

        if(parentId === 'root'){
            res.redirect("/folders/root");
        }else{
            res.redirect(`/folders/${parentId}`);
        }
    }catch (err) {
        console.error(err);
        res.status(500).send("Error loading folder");
    }
}

exports.editFolderName = async(req,res) => {
    const {id,name,parentId} = req.body;
    console.log(`The parent id is what `,parentId);
    try{
        await prisma.folder.update({
            where: {id:Number(id)},
            data: {name}
        });
        if(parentId === 'root'){
            res.redirect("/folders/root");
        }else{
            res.redirect(`/folders/${parentId}`);
        }
        
    }catch (err){
        res.status(500).send("Error updating folder");
    }
}

exports.uploadFile = async (req,res) => {
    const {folderId} = req.body;
    try {
        if (!req.file) return res.status(400).send("No file uploaded.");
    
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "uploads",
          resource_type: "auto",
        });
    
        await prisma.file.create({
          data: {
            filename: req.file.originalname,
            mimetype: req.file.mimetype,
            path: result.secure_url,
            userId: req.user.id,
            folderId: folderId ? Number(folderId) : null,
            publicId: result.public_id,
          },
        });
    
        // Safely remove local file
        try {
          if (fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
          }
        } catch (deleteErr) {
          console.warn("⚠️ Failed to delete local file:", deleteErr.message);
        }
    
        // Redirect based on folder
        if (!folderId) {
          return res.redirect("/folders/root");
        } else {
          return res.redirect(`/folders/${folderId}`);
        }
    
      } catch (err) {
        console.error("❌ Error uploading file:", err);
        return res.status(500).send("Error uploading file");
      }
}

exports.deleteFile = async(req,res) => {
    const {id,parentId} = req.body;
    try {
        const file = await prisma.file.findUnique({ where: { id: Number(id) } });

        if (!file) return res.status(404).send('File not found');

        if (file.publicId) {
            // Delete from Cloudinary
            await cloudinary.uploader.destroy(file.publicId);
          }

        await prisma.file.delete({
            where: {id:Number(id)}
        });

        if(parentId === 'root'){
            res.redirect("/folders/root");
        }else{
            res.redirect(`/folders/${parentId}`);
        }
    }catch (err) {
        console.error(err);
        res.status(500).send("Error loading folder");
    }
}

exports.editFileName = async(req,res) => {
    const {id,name,parentId} = req.body;
    //console.log(`File name is `,name);
    try{
        await prisma.file.update({
            where: {id:Number(id)},
            data: {filename:name}
        });
        if(parentId === 'root'){
            res.redirect("/folders/root");
        }else{
            res.redirect(`/folders/${parentId}`);
        }
        
    }catch (err){
        res.status(500).send("Error updating folder");
    }
}

exports.downloadFile = async (req,res) => {
    const {id} = req.params;
    try{
        const file = await prisma.file.findUnique({
            where: {id:Number(id)}
        });

        if (!file){
            return res.status(404).send("File not found");
        }

        const response = await axios.get(file.path, { responseType: 'arraybuffer' });

        res.setHeader('Content-Disposition', `attachment; filename="${file.filename}"`);
        res.setHeader('Content-Type', file.mimetype);

        // Send the file data
        res.send(Buffer.from(response.data, 'binary'));

        
    }catch (err){
        res.status(500).send("Error downloading file");
    }
}

  

