const Sequelize=require('sequelize');

const sequelize=require('../utils/database');

const Chat=sequelize.define('chat',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        allowNull:false,
        autoIncrement:true
    },
    chatData:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    
});

module.exports=Chat;