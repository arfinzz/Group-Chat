const moment = require("moment");

const Chat = require("../models/chat");
const sequelize = require("../utils/database");

exports.sendChat = async (req, res, next) => {
  try {
    const chatData = req.body.chatData;
    const dbResp = await req.user.createChat({ chatData: chatData });
    res.status(201).json({ message: "Sent !"});
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

exports.getChat = async (req, res, next) => {
  try {
    const firstId = req.headers.firstid;
    
    //console.log(req.headers)
    const limit = 10;

    const [fetchedChats, metadata] =
      await sequelize.query(`SELECT chats.id as id, name, chatData, chats.createdAt as time
      FROM users
      INNER JOIN chats
      ON chats.userId = users.id
      WHERE chats.id<${firstId}
      ORDER BY chats.id DESC
      LIMIT ${limit} OFFSET 0`);
    //console.log(exp);

    fetchedChats.forEach((chat) => {
      chat.time = moment(chat.time).format("MMMM Do YYYY, h:mm a");
    });

    fetchedChats.reverse();

    return res.status(200).json({ chats: fetchedChats });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

exports.getNewChat = async (req, res, next) => {
  try {
    const lastId = Number(req.headers.lastid);
    const [fetchedChats, metadata]=await sequelize.query(`SELECT chats.id as id, name, chatData, chats.createdAt as time
      FROM users
      INNER JOIN chats
      ON chats.userId = users.id
      WHERE chats.id>${lastId}
      LIMIT 1000 OFFSET 0`);

    fetchedChats.forEach((chat) => {
      chat.time = moment(chat.time).format("MMMM Do YYYY, h:mm a");
    });

    return res.status(200).json({ chats: fetchedChats });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};
