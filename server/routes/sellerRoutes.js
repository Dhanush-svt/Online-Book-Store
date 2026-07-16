const express = require("express");
const router = express.Router();
const { protect, authorizeRoles } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");
const {
  registerSeller,
  loginSeller,
  getProfile,
  updateProfile,
  addBook,
  getMyBooks,
  updateBook,
  deleteBook,
  getSellerOrders,
  updateOrderStatus,
} = require("../controllers/SellerControllers");

// Auth
router.post("/signup", registerSeller);
router.post("/login", loginSeller);

// Profile
router.get("/profile", protect, authorizeRoles("seller"), getProfile);
router.put("/profile", protect, authorizeRoles("seller"), updateProfile);

// Book (item) management
router.post("/books", protect, authorizeRoles("seller"), upload.single("itemImage"), addBook);
router.get("/books", protect, authorizeRoles("seller"), getMyBooks);
router.put("/books/:id", protect, authorizeRoles("seller"), upload.single("itemImage"), updateBook);
router.delete("/books/:id", protect, authorizeRoles("seller"), deleteBook);

// Orders
router.get("/orders", protect, authorizeRoles("seller"), getSellerOrders);
router.put("/orders/:id", protect, authorizeRoles("seller"), updateOrderStatus);

module.exports = router;
