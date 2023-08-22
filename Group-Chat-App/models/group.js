const Sequelize=require('sequelize');

const sequelize=require('../utils/database');

const Group=sequelize.define('group',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        allowNull:false,
        autoIncrement:true
    },
    name:{
        type:Sequelize.STRING,
        allowNull:false
    }
    
});

module.exports=Group;