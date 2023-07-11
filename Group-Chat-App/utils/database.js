require('dotenv').config();
const Sequelize=require('sequelize');

const sequelize=new Sequelize(process.env.MYSQL_DB_NAME,process.env.MYSQL_USER_NAME,process.env.MYSQL_PASSWORD,{
    dialect: 'mysql',
    host: process.env.MYSQL_HOST_NAME
});

module.exports=sequelize;