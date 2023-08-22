const Sequelize=require('sequelize');

const sequelize=require('../utils/database');

const Usergroup=sequelize.define('usergroup',{
    isAdmin:{
        type:Sequelize.BOOLEAN,
    },
    
    
});

module.exports=Usergroup;