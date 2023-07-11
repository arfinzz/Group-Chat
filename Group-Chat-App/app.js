const express=require('express')
const Sequelize=require('sequelize');
const bodyParser=require('body-parser');

const userRoutes=require('./routes/user')

const sequelize=require('./utils/database');
const User=require('./models/user');



const app=express();
app.use(bodyParser.json());
app.use(userRoutes);

sequelize.sync({force:true})
.then(()=>{
    console.log('Listening at port 3300');
    app.listen(process.env.PORT || 3300);
})
.catch(err=>{
    console.log(err);
});