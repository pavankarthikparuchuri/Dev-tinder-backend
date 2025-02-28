const express = require("express");
const { connectDB } = require("./config/database");
const UserModel = require("./models/user");
const app = express(); //ceating an express application instance.

app.use(express.json());
app.post("/signup", async (req, res) => {
  //validation of data
  // encrypt the password
  //creating a new instance of the user model
  try {
    //creating a new instance of the UserModel
    const user = new UserModel(req.body);
    await user.save();
    res.status(201).send("created a user");
  } catch (err) {
    res.status(400).send("Error saving the user: " + err.message);
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
connectDB()
  .then(() => {
    console.log("Database connection established...");
    app.listen(7777, () => {
      console.log("Server is successfully listening on port 7777...");
    });
  })
  .catch((err) => console.log("database connection failed"));
