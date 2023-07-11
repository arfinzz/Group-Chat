const express=require('express');

const userController=require('../controllers/user');

const router=express.Router();

router.post('/login',userController.loginUser)
router.post('/signup',userController.addUser)

module.exports=router;