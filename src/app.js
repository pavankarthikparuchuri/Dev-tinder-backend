const express = require("express");
const { connectDB } = require("./config/database");
const UserModel = require("./models/user");
const app = express(); //ceating an express application instance.
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/authMiddleware");

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  //validation of data
  // encrypt the password
  //creating a new instance of the user model
  try {
    //creating a new instance of the UserModel
    // validateSignUpData(req);

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

app.post("/login", async (req, res) => {
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
        expires: new Date(Date.now() + 900000),
        httpOnly: true,
      });
      res.status(200).send("login successful");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send("Error " + err.message);
  }
});

// Get user by email
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const user = await UserModel.find({ emailId: userEmail });
    if (!user.length) {
      res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("Something went wrong!");
  }
});

app.get("/getOneUser", async (req, res) => {
  try {
    const data = await UserModel.findOne({ emailId: req.body.emailId });
    if (!data) {
      res.status(404).send("User not found");
    } else {
      res.send(data);
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});
//Feed API - Get /feed
app.get("/feed", async (req, res) => {
  try {
    const data = await UserModel.find({});
    res.send(data);
  } catch (err) {
    res.send(400).send("Something went wrong!");
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await UserModel.findByIdAndDelete(userId);
    res.send("userDeleted");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const body = req.body;
  const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];
  try {
    const isUpdateAllowed = Object.keys(body).every((item) =>
      ALLOWED_UPDATES.includes(item)
    );
    if (req.body?.skills.length > 5) {
      throw new Error("skills limit exceeded");
    }
    if (!isUpdateAllowed) {
      throw new Error("update not allowed");
    }
    const user = await UserModel.findByIdAndUpdate(userId, req.body, {
      returnDocument: "after",
      runValidators: true,
    });
    res.send("user updated successfully");
  } catch (err) {
    res.status(400).send("something went wrong " + err.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const { user } = req;
    res.send(user);
  } catch (err) {
    res.status(400).send("something went wrong " + err.message);
  }
});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  console.log("sending a connection request");
  const { user } = req;
  res.send("Hey " + user.firstName + "!");
});
connectDB()
  .then(() => {
    console.log("Database connection established...");
    app.listen(7777, () => {
      console.log("Server is successfully listening on port 7777...");
    });
  })
  .catch((err) => console.log("database connection failed"));
