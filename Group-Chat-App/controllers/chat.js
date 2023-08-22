const moment = require("moment");
const { Op } = require("sequelize");

const Chat = require("../models/chat");
const Group = require("../models/group");
const User = require("../models/user");
const Usergroup = require("../models/usergroup");
const sequelize = require("../utils/database");

exports.createGroup = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const user = req.user;
    const groupName = req.body.groupData.groupName;
    const memberCredentials = req.body.groupData.memberCredentials;

    const group = await Group.create({ name: groupName }, { transaction: t });
    await group.addUser(user, { transaction: t, through: { isAdmin: true } });

    for (let memberCredential of memberCredentials) {
      let member = await User.findOne({
        where: {
          [Op.or]: [{ email: memberCredential }, { phoneno: memberCredential }],
        },
      });

      if (!member) {
        await t.rollback();
        return res.status(404).json({ message: "Group members don't exist !" });
      }

      await group.addUser(member, {
        transaction: t,
        through: { isAdmin: false },
      });
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
    let isAdmin = false;

    const groupData = await Usergroup.findOne({
      where: {
        [Op.and]: [{ groupId: groupId }, { userId: req.user.id }],
      },
    });

    //console.log("thissssssssss", fetchedGroup.createdAt);

    if (groupData.isAdmin) {
      isAdmin = true;
    }

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

    return res
      .status(200)
      .json({ fetchedChats: fetchedChats, isAdmin: isAdmin });
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

exports.getNewGroupChat = async (req, res, next) => {
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
};

exports.addMember = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const user = req.user;

    const groupId = req.body.groupData.groupId;
    const memberCredentials = req.body.groupData.memberCredentials;

    const fetchedGroup = await req.user.getGroups({
      raw: true,
      where: { id: groupId },
    });

    let isAdmin = false;
    if (fetchedGroup[0]["Group_User.isAdmin"]) {
      isAdmin = true;
    } else {
      throw "Not authorized!";
    }

    const group = await Group.findOne({ where: { id: groupId } });

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
    return res
      .status(201)
      .json({ message: "Group created !", groupName: group.name });
  } catch (error) {
    await t.rollback();
    console.log(error);
    return res.status(500).json({ message: error });
  }
};

exports.getMember = async (req, res, next) => {
  try {
    const user = req.user;
    const groupId = req.headers.groupid;
    let isAdmin = false;

    const groupData = await Usergroup.findOne({
      where: {
        [Op.and]: [{ groupId: groupId }, { userId: req.user.id }],
      },
    });

    //console.log("thissssssssss", fetchedGroup.createdAt);

    if (groupData) {
      isAdmin = true;
    }
    else
    {
      throw "Not authorized!";
    }

    const fetchedMembers = await Group.findAll({
      attributes: [
        "users.id",
        "users.email",
        "users.phoneno",
        "users.name",
        "users.usergroup.isAdmin",
      ],
      raw: true,
      where: { id: groupId },
      include: [
        {
          model: User,
          required: true,
          attributes: [],
          where: { id: { [Op.ne]: user.id } },
        },
      ],
    });

    return res.status(201).json({ fetchedMembers: fetchedMembers });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });
  }
};

exports.deleteMember = async (req, res, next) => {
  try {
    const user = req.user;
    const groupId = req.headers.groupid;
    const userId = req.headers.userid;
    let isAdmin = false;

    const groupData = await Usergroup.findOne({
      where: {
        [Op.and]: [{ groupId: groupId }, { userId: req.user.id }],
      },
    });

    //console.log("thissssssssss", fetchedGroup.createdAt);

    if (groupData.isAdmin) {
      isAdmin = true;
    }
    else
    {
      throw "Not authorized!";
    }

    const fetchedMember = await User.findOne({
      where: { id: userId },
    });
    const grp = await Group.findOne({
      where: { id: groupId },
    });

    await grp.removeUser(fetchedMember);

    return res.status(201).json({ message: "Success" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });
  }
};

exports.leaveGroup = async (req, res, next) => {
  try {
    const user = req.user;
    const groupId = req.headers.groupid;
    

    const fetchedMember = await User.findOne({
      where: { id: user.id },
    });
    const grp = await Group.findOne({
      where: { id: groupId },
    });

    await grp.removeUser(fetchedMember);

    return res.status(201).json({ message: "Success" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });
  }
};

exports.toggleAdmin = async (req, res, next) => {
  try {
    const user = req.user;
    const groupId = req.headers.groupid;
    const userId = req.headers.userid;
    let isAdmin = false;

    const groupData = await Usergroup.findOne({
      where: {
        [Op.and]: [{ groupId: groupId }, { userId: req.user.id }],
      },
    });

    if (groupData.isAdmin) {
      isAdmin = false;
    }
    else
    {
      throw "Not authorized!";
    }

    const userData=await Usergroup.findOne({
      where: {
        [Op.and]: [{ groupId: groupId }, { userId: userId }],
      },
    });

    if(userData.isAdmin)
    {
      userData.isAdmin=false;
      await userData.save();
    }
    else{
      userData.isAdmin=true;
      isAdmin=true;
      await userData.save();
    }


    return res.status(201).json({ message: "Success" , isAdmin:isAdmin});
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });
  }
};
