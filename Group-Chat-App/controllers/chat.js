const moment = require("moment");
const { Op } = require("sequelize");

const Chat = require("../models/chat");
const Group = require("../models/group");
const User = require("../models/user");
const sequelize = require("../utils/database");

exports.createGroup = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const user = req.user;
    const groupName = req.body.groupData.groupName;
    const memberCredentials = req.body.groupData.memberCredentials;

    const group = await Group.create(
      { name: groupName, adminId: user.id },
      { transaction: t }
    );
    await group.addUser(user, { transaction: t });

    for (let memberCredential of memberCredentials) {
      let member = await User.findOne({
        where: {
          [Op.or]: [{ email: memberCredential }, { phoneno: memberCredential }],
        },
      });

      if (!member) {
        await t.rollback();
        return res.status(404).json({ message: "Group members dont exist !" });
      }

      await group.addUser(member, { transaction: t });
    }

    await t.commit();
    return res.status(201).json({ message: "Group created !" });
  } catch (error) {
    await t.rollback();
    console.log(error);
    return res.status(500).json({ message: error });
  }
};

exports.getGroups = async (req, res, next) => {
  try {
    const user = req.user;
    const groups = await user.getGroups({ attributes: ["id", "name"] });

    return res.status(200).json({ message: "OK", groups: groups });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });
  }
};

exports.getGroupChat = async (req, res, next) => {
  try {
    const groupId = req.headers.groupid;
    const firstId = Number(req.headers.firstid);

    const limit = 10;
    const fetchedChats = await Chat.findAll({
      raw: true,
      attributes: ["id", "chatData", "createdAt", "user.name"],
      where: { id: { [Op.lt]: firstId } },
      include: [
        {
          model: Group,
          required: true,
          where: {
            id: groupId,
          },
          attributes: [],
        },
        {
          model: User,
          require: true,
          attributes: [],
        },
      ],
      order: [["id", "DESC"]],
      offset: 0,
      limit: limit,
    });

    fetchedChats.forEach((chat) => {
      chat.createdAt = moment(chat.createdAt).format("MMMM Do YYYY, h:mm a");
    });

    fetchedChats.reverse();

    return res.status(200).json({ fetchedChats: fetchedChats });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });
  }
};

exports.postGroupChat = async (req, res, next) => {
  try {
    const chatData = req.body.chatData;
    const groupId = req.body.groupId;
    const group = await req.user.getGroups({ where: { id: groupId } });
    const dbResp = await req.user.createChat({ chatData: chatData });
    group[0].addChat(dbResp);
    res.status(201).json({ message: "Sent !" });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

exports.getNewGroupChat=async (req,res,next)=>{
  try {
    const groupId = req.headers.groupid;
    const lastId = Number(req.headers.lastid);

    const limit = 10;
    const fetchedChats = await Chat.findAll({
      raw: true,
      attributes: ["id", "chatData", "createdAt", "user.name"],
      where: { id: { [Op.gt]: lastId } },
      include: [
        {
          model: Group,
          required: true,
          where: {
            id: groupId,
          },
          attributes: [],
        },
        {
          model: User,
          require: true,
          attributes: [],
        },
      ],
      offset: 0,
      limit: limit,
    });

    fetchedChats.forEach((chat) => {
      chat.createdAt = moment(chat.createdAt).format("MMMM Do YYYY, h:mm a");
    });
    return res.status(200).json({ fetchedChats: fetchedChats });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });
  }
}
/*

exports.sendChat = async (req, res, next) => {
  try {
    const chatData = req.body.chatData;
    const dbResp = await req.user.createChat({ chatData: chatData });
    res.status(201).json({ message: "Sent !" });
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
    const [fetchedChats, metadata] =
      await sequelize.query(`SELECT chats.id as id, name, chatData, chats.createdAt as time
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
*/
