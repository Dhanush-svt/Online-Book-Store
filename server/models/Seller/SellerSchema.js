const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // business/seller name
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isApproved: { type: Boolean, default: false }, // Admin approves before seller can list books
    isBlocked: { type: Boolean, default: false },
    role: { type: String, default: "seller" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Seller", sellerSchema);
