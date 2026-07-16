const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    // Shipping address
    flatno: String,
    pincode: String,
    city: String,
    state: String,
    totalamount: Number,

    // Info about the book
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
    booktitle: String,
    bookauthor: String,
    bookgenre: String,
    itemImage: String,
    description: String,
    quantity: { type: Number, default: 1 },

    // Buyer info
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userName: String,

    // Seller info
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "Seller" },
    sellerName: String,

    status: {
      type: String,
      enum: ["Placed", "Shipped", "Out for Delivery", "Delivered", "Cancelled"],
      default: "Placed",
    },

    BookingDate: {
      type: String,
      default: () => new Date().toLocaleDateString("en-IN"),
    },
    Delivery: {
      type: String,
      default: () => {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + 7);
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();
        return `${month}/${day}/${year}`;
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MyOrder", orderSchema);
