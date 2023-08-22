
const express=require('express');
const Sequelize=require('sequelize');
const bodyParser=require('body-parser');
const cors = require('cors');

const userRoutes=require('./routes/user');
const chatRoutes=require('./routes/chat');

const sequelize=require('./utils/database');
const User=require('./models/user');
const Chat=require('./models/chat');
const Group=require('./models/group');
const Usergroup=require('./models/usergroup');



const app=express();
process.env.TZ = "Asia/Calcutta";
app.use(cors())
app.use(bodyParser.json());
app.use(userRoutes);
app.use(chatRoutes)


User.hasMany(Chat);
Chat.belongsTo(User);

User.belongsToMany(Group, { through: Usergroup });
Group.belongsToMany(User, { through: Usergroup });

User.hasMany(Usergroup);
Usergroup.belongsTo(User);

Group.hasMany(Usergroup);
Usergroup.belongsTo(Group);

Group.hasMany(Chat);
Chat.belongsTo(Group);

//{force:true}
sequelize.sync()
.then(()=>{
    console.log('Listening at port 3300');
    app.listen(process.env.PORT || 3300);
})
.catch(err=>{
    console.log(err);
});