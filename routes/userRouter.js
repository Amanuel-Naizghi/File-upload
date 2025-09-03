const express = require('express');
const passport = require('passport');
const router = express.Router();
const userController = require('../controller/userController');
const ensureAuthenticated = require('../middleware/ensureAuthenticated');

router.get('/',(req,res) => {
    res.render('initial');
});

router.post('/createAccount', userController.postAddUser);

router.get('/login',(req,res) => {
    res.render('login');
});

router.post('/login', 
                     passport.authenticate('local',{
                        failureRedirect:'/login',
                        failureFlash:"Wrong user name or password"
                    }),
                    (req,res) => {
                        res.status(200).json({message: "Successful login!"})
                    }                    
);


module.exports = router;