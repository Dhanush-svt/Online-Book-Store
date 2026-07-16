const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: String, required: true },
    itemImage: String,
    description: String,
    price: { type: Number, required: true },
    quantity: { type: Number, default: 0 }, // stock available

    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "Seller", required: true },
    sellerName: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);
