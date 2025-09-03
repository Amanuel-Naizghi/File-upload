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
                        res.redirect(`/user/${req.user.id}`)
                    }                    
);

router.get('/user/:id', ensureAuthenticated, async(req,res) => {
    //Is used when user try to by pass the authentication part by typing the url like user/1
    if(req.params.id != req.user.id){
        return res.status(403).send("You cannot view another user's page.");
    }

    res.render('user');
})


module.exports = router;