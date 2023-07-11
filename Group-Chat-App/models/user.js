const Sequelize=require('sequelize');

const sequelize=require('../utils/database');

const User=sequelize.define('user',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        allowNull:false,
        autoIncrement:true
    },
    email:{
        type:Sequelize.STRING,
        allowNull:false,
        unique:true
    },
    phoneno:{
        type:Sequelize.STRING,
        allowNull:false,
        unique:true
    },
    name:{
        type:Sequelize.STRING,
        allowNull:false
    },
    password:{
        type:Sequelize.STRING,
        allowNull:false
    },
    
});

module.exports=User;