const express = require("express");
const { connectDB } = require("./config/database");
const UserModel = require("./models/user");

const app = express(); //ceating an express application instance.

app.use(express.json());
app.post("/signup", async (req, res) => {
  try {
    //creating a new instance of the UserModel
    const user = new UserModel(req.body);
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
