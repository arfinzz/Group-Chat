
const { Op } = require("sequelize");


const Security=require('../utils/security');
const User = require("../models/user");
const sequelize = require("../utils/database");






exports.loginUser = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  //console.group(email,password);
  if (Security.isNotValid(email) || Security.isNotValid(password)) {
    return res.status(400).json({ message: "Invaid details !" });
  }

  try {
    const userWithEmail = await User.findAll({
      where: {
        email: email,
      },
    });
    //console.log(userWithEmail)

    if (userWithEmail.length > 0) {
      const passwordMatched = await Security.hashCompare(password,userWithEmail[0].password)
      if (passwordMatched) {

        const token = Security.createToken(userWithEmail[0].id.toString(),email);
        //console.log(token);
        return res
          .status(200)
          .json({ message: "User Login Successfull !", token: token });
      } else {
        return res.status(401).json({ message: "User Not Authorized !" });
      }
    } else {
      return res.status(404).json({ message: "User Not Found !" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({message:err});
  }
};


exports.addUser = async (req, res, next) => {
  const email = req.body.email;
  const name = req.body.name;
  const phoneno = req.body.phoneno;
  const password = req.body.password;
  if (
    Security.isNotValid(email) ||
    Security.isNotValid(name) ||
    Security.isNotValid(password) ||
    Security.isNotValid(phoneno)
  ) {
    return res.status(400).json({ message: "Invaid details !" });
  }
  const t = await sequelize.transaction();
  try {
    const encryptedPassword = await Security.hash(password);
    const userData = {
      email: email,
      name: name,
      phoneno: phoneno,
      password: encryptedPassword,
    };

    const isExistingUser = await User.findAll({
      where: {
        [Op.or]: [{ email: email }, { phoneno: phoneno }],
      },
    });

    if (isExistingUser.length > 0) {
      return res.status(400).json({ message: "Email/PhoneNo Already Exist !" });
    } else {
      const newUser = await User.create(userData, { transaction: t });
      //console.log(newUser);
      await t.commit();
      return res.status(201).json({ message: "Account Created !" });
    }
  } catch (err) {
    console.log(err);
    await t.rollback();
    return res.status(500).json({ message: err });
  }
};
