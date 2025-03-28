const express = require("express");
const { userAuth } = require("../middlewares/authMiddleware");
const paymentRouter = express.Router();
const instance = require("../utils/razorpay");
const Payment = require("../models/payments");
const { membershipAmount } = require("../utils/constants");
const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");
const UserModel = require("../models/user");

paymentRouter.post("/createOrder", userAuth, async (req, res) => {
  try {
    const { firstName, lastName, emailId } = req.user;
    const {
      notes: { membershipType },
    } = req.body;
    console.log();
    var options = {
      amount: membershipAmount[membershipType] * 100,
      currency: "INR",
      receipt: "receipt#1",
      notes: {
        firstName,
        lastName,
        emailId,
        membershipType,
      },
    };
    const data = await instance.orders.create(options);

    //save it in my database
    const model = new Payment({
      userId: req.user._id,
      orderId: data.id,
      status: data.status,
      amount: data.amount,
      currency: data.currency,
      reciept: data.receipt,
      notes: data.notes,
    });
    // return back my order details to frontend
    const savedPayment = await model.save();
    res
      .status(200)
      .json({ ...savedPayment.toJSON(), keyId: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    console.log(err);
    res.status(400).send("something went wrong");
  }
});

paymentRouter.post("/payment/webhook", async (req, res) => {
  try {
    const webhookSignature = req.get("X-Razorpay-Signature");
    const isWebhookValid = validateWebhookSignature(
      JSON.stringify(req.body),
      webhookSignature,
      process.env.RAZORPAY_WEBHOOK_SIGNATURE
    );
    if (!isWebhookValid) {
      console.log("webhook not valid");
      res.status(400).json({ msg: "webhook not valid" });
    }

    //update my payment status in DB
    //update the user as premium
    //return success response to the razorpay
    const paymentDetails = req.body.payload.payment.entity;
    // console.log(req.body.payload.payment.entity.order_id);
    const payment = await Payment.findOne({
      orderId: paymentDetails.order_id,
    });
    payment.status = paymentDetails.status;
    await payment.save();

    const user = await UserModel.findOne({ _id: payment.userId });
    user.isPremium = true;
    user.memberShipType = payment.notes.membershipType;
    await user.save();
    res.status(200).json({ msg: "webhook recieved successfully" });
  } catch (err) {
    console.log(err.message, "::err");
    res.status(500).json({ msg: err.message });
  }
});
paymentRouter.post("");
module.exports = paymentRouter;
