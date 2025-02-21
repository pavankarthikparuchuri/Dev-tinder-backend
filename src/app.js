const express = require("express");
const { connectDB } = require("./config/database");
const UserModel = require("./models/user");

const app = express(); //ceating an express application instance.

app.post("/signup", async (req, res) => {
  try {
    const userObj = {
      firstName: "Virat",
      lastName: "kohli",
      emailId: "virat@gmail.com",
      password: "1234",
      age: "38",
      gender: "Male",
    };
    //creating a new instance of the UserModel
    const user = new UserModel(userObj);
    await user.save();
    res.status(201).send("created a user");
  } catch (err) {
    res.status(400).send("Error saving the user: ", err.message);
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
