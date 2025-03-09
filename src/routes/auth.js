const express = require("express");
const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const UserModel = require("../models/user");
const validator = require("validator");

authRouter.post("/signup", async (req, res) => {
  //validation of data
  // encrypt the password
  //creating a new instance of the user model
  try {
    //creating a new instance of the UserModel
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    req.body.password = passwordHash;
    const user = new UserModel({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();
    res.status(201).send("created a user");
  } catch (err) {
    res.status(400).send("Error saving the user: " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!validator.isEmail(emailId)) {
      throw new Error("invalid credentials");
    }
    const encryptedPassword = await UserModel.findOne({ emailId: emailId });
    if (!encryptedPassword) {
      throw new Error("Invalid Credentials");
    }
    const isPasswordValid = await encryptedPassword.validatePassword(password);
    if (isPasswordValid) {
      // create a jwt token
      // add the token to cookie and send the response back to the user
      const token = encryptedPassword.getJWT();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.status(200).json(encryptedPassword);
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

authRouter.post("/logout", (req, res) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
    });
    res.send("Logout Successful!!");
  } catch (err) {
    res.status(400).send("Something went wrong " + err.message);
  }
});
module.exports = authRouter;
