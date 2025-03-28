const { default: mongoose } = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    paymentId: {
      type: String,
    },
    orderId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    reciept: {
      type: String,
      required: true,
    },
    notes: {
      firstName: { type: String },
      lastName: { type: String },
      membershipType: { type: String },
    },
  },
  { timestamps: true }
);

const paymentModel = mongoose.model("paymentModel", paymentSchema);

module.exports = paymentModel;
