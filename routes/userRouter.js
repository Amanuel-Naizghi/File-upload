const express = require('express');
const passport = require('passport');
const router = express.Router();
const userController = require('../controller/userController');
const ensureAuthenticated = require('../middleware/ensureAuthenticated');
const upload =require('../config/multer');

router.get('/',(req,res) => {
    res.render('initial');
});

router.post('/createAccount', userController.postAddUser);

router.get('/login',(req,res) => {
    res.render('login');
});

router.post('/login', 
                     passport.authenticate('local',{
                        successRedirect:'/folders/root',
                        failureRedirect:'/login',
                        failureFlash:"Wrong user name or password"
                    }),                  
);

router.post('/delete/:id', ensureAuthenticated, userController.deleteItem);
router.post('/folders', ensureAuthenticated, userController.createFolder);
router.get('/folders/root', ensureAuthenticated, userController.getFolderContent);
router.get('/folders/:id', ensureAuthenticated, userController.getFolderContent);
router.post('/editFolder', ensureAuthenticated, userController.editFolderName);
router.post('/uploadFile', ensureAuthenticated, upload.single("file"), userController.uploadFile);


module.exports = router;