const express = require("express");
const router = express.Router();
const { protect, authorizeRoles } = require("../middlewares/authMiddleware");
const {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  getAllBooks,
  getBookById,
  addToCart,
  getCart,
  removeFromCart,
  checkout,
  getMyOrders,
} = require("../controllers/UsersController");

// Auth
router.post("/signup", registerUser);
router.post("/login", loginUser);

// Profile
router.get("/profile", protect, authorizeRoles("user"), getProfile);
router.put("/profile", protect, authorizeRoles("user"), updateProfile);

// Browse books (public)
router.get("/books", getAllBooks);
router.get("/books/:id", getBookById);

// Cart
router.get("/cart", protect, authorizeRoles("user"), getCart);
router.post("/cart", protect, authorizeRoles("user"), addToCart);
router.delete("/cart/:bookId", protect, authorizeRoles("user"), removeFromCart);

// Checkout & orders
router.post("/checkout", protect, authorizeRoles("user"), checkout);
router.get("/orders", protect, authorizeRoles("user"), getMyOrders);

module.exports = router;
