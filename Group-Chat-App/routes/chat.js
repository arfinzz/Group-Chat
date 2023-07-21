const express=require('express');

const chatController=require('../controllers/chat');

const isLoggedIn=require('../middlewares/isLoggedIn')

const router=express.Router();

router.post('/chat',isLoggedIn,chatController.sendChat);
router.get('/chat',isLoggedIn,chatController.getChat);
//router.post('/signup',userController.addUser)

module.exports=router;