const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

router.get('/',(req,res) => {
    res.render('initial');
});

router.post('/createAccount', userController.postAddUser);

module.exports = router;