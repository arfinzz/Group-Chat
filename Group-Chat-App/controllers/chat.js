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

exports.getChatCount = async (req, res, next) => {
  try {
    const chatcount = await Chat.count();
    return res.status(200).json({ chatcount:chatcount });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

exports.getChat = async (req, res, next) => {
  try {
    const pageNo = req.headers.pageno;
    const chatCount = req.headers.chatcount;
    //console.log(req.headers)
    const limit = 10;
    const totalPages = Math.ceil(chatCount/limit);
    if (pageNo > totalPages) {
      return res.status(204).json({ message: "No Chats !" });
    }
    //console.log(total)
    const offset = (totalPages - pageNo) * limit;
    const [fetchedChats, metadata] =
      await sequelize.query(`SELECT name, chatData, chats.createdAt as time
      FROM users
      INNER JOIN chats
      ON chats.userId = users.id
      LIMIT ${limit} OFFSET ${offset};`);
    //console.log(exp);

    fetchedChats.forEach((chat) => {
      chat.time = moment(chat.time).format("MMMM Do YYYY, h:mm a");
    });

    return res.status(200).json({ chats: fetchedChats });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

exports.getNewChat = async (req, res, next) => {
  try {
    const offset = Number(req.headers.loadedchatcount);
    const totalChats = await Chat.count();
    if (offset >= totalChats) {
      return res.status(204).json({ message:"No New Chats !"});
    }
    const [fetchedChats, metadata] =
      await sequelize.query(`SELECT name, chatData, chats.createdAt as time
      FROM users
      INNER JOIN chats
      ON chats.userId = users.id
      LIMIT 100 OFFSET ${offset};`);
    //console.log(exp);

    fetchedChats.forEach((chat) => {
      chat.time = moment(chat.time).format("MMMM Do YYYY, h:mm a");
    });

    return res.status(200).json({ chats: fetchedChats, loadedchatcount:totalChats});
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};
