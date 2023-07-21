const moment = require("moment");

const Chat = require("../models/chat");
const sequelize = require("../utils/database");

exports.sendChat = async (req, res, next) => {
  try {
    const chatData = req.body.chatData;
    const dbResp = await req.user.createChat({ chatData: chatData });
    //console.log(req.user);
    //console.log(a);
    //console.log(dbResp)
    const id = dbResp.id;
    const [fetchedChat, metadata] =
      await sequelize.query(`SELECT name, chatData, chats.createdAt as time
      FROM users
      INNER JOIN chats
      ON chats.userId = users.id
      WHERE chats.id=${id}`);
    fetchedChat[0].time = moment(fetchedChat[0].time).format(
      "MMMM Do YYYY, h:mm a"
    );
    res.status(201).json({ message: "Sent !", chat: fetchedChat[0] });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

exports.getChat = async (req, res, next) => {
  try {
    const pageNo = req.headers.pageno;
    //console.log(req.headers)
    const limit = 10;
    const totalChats = await Chat.count();
    const totalPages = Math.ceil(totalChats / limit);
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
