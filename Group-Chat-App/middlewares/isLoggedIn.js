const Security = require("../utils/security");
const User = require("../models/user");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    const user = Security.validateToken(token);
    //console.log(user);

    const loggedinUser = await User.findByPk(user.id);
    //console.log(JSON.stringify(loggedinUser));
    if (!loggedinUser) throw "Error";

    req.user = loggedinUser;
    next();
  } catch (err) {
    return res.status(401).json({ message: "User Not Authorized !" });
  }
};
