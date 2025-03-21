const express = require("express");
const requestsRouter = express.Router();
const { userAuth } = require("../middlewares/authMiddleware");
const UserModel = require("../models/user");
const ConnectionModel = require("../models/connectionRequest");
const mongoose = require("mongoose");
const sendEmail = require("../utils/sendemail");

requestsRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const { status, toUserId } = req.params;
      const { user } = req;

      const ALLOWED_STATUS = ["ignored", "interested"];
      if (!ALLOWED_STATUS.includes(status)) {
        throw new Error("invalid status type :" + status);
      }
      const searchUserID = await UserModel.findById(toUserId);
      if (!searchUserID) {
        return res.status(404).json({
          message: "User not found",
        });
      }
      const existedReqestCheck = await ConnectionModel.findOne({
        $or: [
          { fromUserId: toUserId, toUserId: user._id },
          { fromUserId: user._id, toUserId: toUserId },
        ],
      });
      if (existedReqestCheck) {
        return res.status(400).json({
          message: "Connection request already exist",
        });
      }
      const ConnectionRequest = new ConnectionModel({
        fromUserId: user._id,
        toUserId: toUserId,
        status: status,
      });
      const data = await ConnectionRequest.save();
      await sendEmail.run(
        "You got a new friend request",
        `${user.firstName} - ${status} - ${searchUserID.firstName}`
      );
      res.json({
        message: `${user.firstName} - ${status} - ${searchUserID.firstName}`,
        data: data,
      });
    } catch (err) {
      console.log(err, "::err");
      res.status(400).send("something went wrong " + err.message);
    }
  }
);

requestsRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const { user } = req;
      const { status, requestId } = req.params;
      if (!["accepted", "rejected"].includes(status)) {
        return res.status(404).json({
          message: "invalid status",
        });
      }

      if (!mongoose.Types.ObjectId.isValid(requestId)) {
        return res.status(400).json({
          message: "request id not an object id",
        });
      }

      const connReq = await ConnectionModel.findOne({
        _id: requestId,
        toUserId: user._id,
        status: "interested",
      });

      if (!connReq) {
        return res.status(404).json({
          message: "Connection Request Not Found",
        });
      }

      connReq.status = status;
      const data = await connReq.save();
      res.status(200).json({
        message: `Connection Request - ${status}`,
        data: data,
      });
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  }
);

module.exports = requestsRouter;
