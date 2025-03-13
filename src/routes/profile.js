const express = require("express");
const { userAuth } = require("../middlewares/authMiddleware");
const {
  validateProfileEditData,
  validateCurrentPassword,
} = require("../utils/validation");
const profileRouter = express.Router();
const bcrypt = require("bcrypt");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const { user } = req;
    res.status(200).json(user);
  } catch (err) {
    res.status(400).send("something went wrong " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    validateProfileEditData(req);
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((item) => {
      loggedInUser[item] = req.body[item];
    });

    await loggedInUser.save();
    res.json({
      message: `${loggedInUser.firstName}, your profile updated successful`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("update failed " + err.message);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    await validateCurrentPassword(req);
    // if (!isValid) throw new Error("invalid credentials");
    const loggedInUser = req.user;
    loggedInUser.password = await bcrypt.hash(req.body.newPassword, 10);
    await loggedInUser.save();
    res.send("password saved successfully");
  } catch (err) {
    res.status(400).send("password update failed " + err.message);
  }
});
module.exports = profileRouter;
