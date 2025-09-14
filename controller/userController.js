const prisma = require('../index');
const bcrypt = require("bcryptjs");
const {body,validationResult} = require("express-validator");
const userControllerHelper = require("./userControllerHelper");

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
                errors:errors.array(),
                old:req.body
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
        console.log(`All users are here men`, findAllUsers);
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
        res.redirect('/folders/root');
    }catch (err) {
        console.error(err);
        res.status(500).json({success:false,error:err.message});
    }
}

exports.getFolderContent = async (req, res) => {
    const folderId = req.params.id || 'root';
  
    try {
      if (folderId === 'root') {
        const folders = await prisma.folder.findMany({
          where: { userId: req.user.id, parentId: null },
          include: { children: true, files: true }
        });
  
        return res.render('folders', { folder: null, folders, files: [] });
      }
  
      const folder = await prisma.folder.findUnique({
        where: { id: Number(folderId) },
        include: { children: true, files: true }
      });
  
      if (!folder) {
        return res.status(404).send("Folder not found");
      }
  
      res.render('folders', {
        folder,
        folders: folder.children,
        files: folder.files
      });
  
    } catch (err) {
      console.error(err);
      res.status(500).send("Error loading folder");
    }
};
  

