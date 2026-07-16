const express = require("express");
const router = express.Router();
const { protect, authorizeRoles } = require("../middlewares/authMiddleware");
const {
  registerAdmin,
  loginAdmin,
  getAllUsers,
  toggleBlockUser,
  deleteUser,
  getAllSellers,
  approveSeller,
  toggleBlockSeller,
  deleteSeller,
  getAllBooks,
  deleteBook,
  getAllOrders,
} = require("../controllers/AdminControllers");

// Auth
router.post("/signup", registerAdmin);
router.post("/login", loginAdmin);

// Users
router.get("/users", protect, authorizeRoles("admin"), getAllUsers);
router.put("/users/:id/block", protect, authorizeRoles("admin"), toggleBlockUser);
router.delete("/users/:id", protect, authorizeRoles("admin"), deleteUser);

// Sellers
router.get("/sellers", protect, authorizeRoles("admin"), getAllSellers);
router.put("/sellers/:id/approve", protect, authorizeRoles("admin"), approveSeller);
router.put("/sellers/:id/block", protect, authorizeRoles("admin"), toggleBlockSeller);
router.delete("/sellers/:id", protect, authorizeRoles("admin"), deleteSeller);

// Books
router.get("/books", protect, authorizeRoles("admin"), getAllBooks);
router.delete("/books/:id", protect, authorizeRoles("admin"), deleteBook);

// Orders
router.get("/orders", protect, authorizeRoles("admin"), getAllOrders);

module.exports = router;
