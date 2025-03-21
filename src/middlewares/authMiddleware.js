const jwt = require("jsonwebtoken");
const UserModel = require("../models/user");
const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).send("Please Login!");
    }
    const decodedMessage = jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = decodedMessage;
    const user = await UserModel.findById(_id);
    if (!user) {
      throw new Error("user not found");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("something went wrong " + err.message);
  }
};

module.exports = { userAuth };
