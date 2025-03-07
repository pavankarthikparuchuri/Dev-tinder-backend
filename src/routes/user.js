const express = require("express");
const connectionModel = require("../models/connectionRequest");
const { userAuth } = require("../middlewares/authMiddleware");
const UserModel = require("../models/user");

const userRouter = express.Router();

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const data = await connectionModel
      .find({
        toUserId: loggedInUser._id,
        status: "interested",
      })
      .populate(
        "fromUserId",
        "firstName lastName photoUrl age gender about skill"
      );
    res.status(200).json({
      message: `${loggedInUser.firstName} - requests`,
      data: data,
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const data = await connectionModel
      .find({
        $or: [
          {
            toUserId: loggedInUser._id,
            status: "accepted",
          },
          {
            fromUserId: loggedInUser._id,
            status: "accepted",
          },
        ],
      })
      .populate("fromUserId", "firstName lastName skills about age ")
      .populate("toUserId", "firstName lastName skills about age ");
    const finalData = data.map(({ fromUserId, toUserId }) =>
      fromUserId._id.equals(loggedInUser._id) ? toUserId : fromUserId
    );
    res.status(200).json({
      message: `${loggedInUser.firstName} - connections`,
      data: finalData,
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const pageNum = parseInt(req.query?.page) || 1;
    let limit = parseInt(req.query?.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const existingConnections = await connectionModel
      .find({
        $or: [
          {
            toUserId: loggedInUser._id,
          },
          {
            fromUserId: loggedInUser._id,
          },
        ],
      })
      .select("fromUserId toUserId");
    const existingIds = existingConnections.map((item) =>
      item.toUserId.equals(loggedInUser._id)
        ? item.fromUserId.toString()
        : item.toUserId.toString()
    );
    existingIds.push(loggedInUser._id.toString());
    let data = await UserModel.find({ _id: { $nin: existingIds } })
      .select("firstName lastName skills about age ")
      .skip((pageNum - 1) * limit)
      .limit(limit);
    res.status(200).json({
      message: `${loggedInUser.firstName} - feed`,
      data: data,
    });
  } catch (err) {
    res.status(400).send("ERROR: ", +err.message);
  }
});
module.exports = userRouter;
