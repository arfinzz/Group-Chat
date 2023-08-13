const express=require('express');

const chatController=require('../controllers/chat');

const isLoggedIn=require('../middlewares/isLoggedIn')

const router=express.Router();

//router.post('/chat',isLoggedIn,chatController.sendChat);
//router.get('/chat',isLoggedIn,chatController.getChat);
//router.get('/newchat',isLoggedIn,chatController.getNewChat);
router.post('/creategroup',isLoggedIn,chatController.createGroup);
router.get('/getgroups',isLoggedIn,chatController.getGroups);
router.get('/groupchat',isLoggedIn,chatController.getGroupChat);
router.post('/groupchat',isLoggedIn,chatController.postGroupChat);
router.get('/newgroupchat',isLoggedIn,chatController.getNewGroupChat);

//router.post('/signup',userController.addUser)

module.exports=router;