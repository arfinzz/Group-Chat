const express=require('express');

const chatController=require('../controllers/chat');

const isLoggedIn=require('../middlewares/isLoggedIn')

const router=express.Router();

router.post('/chat',isLoggedIn,chatController.sendChat);
router.get('/chatcount',isLoggedIn,chatController.getChatCount);
router.get('/chat',isLoggedIn,chatController.getChat);
router.get('/newchat',isLoggedIn,chatController.getNewChat);

//router.post('/signup',userController.addUser)

module.exports=router;