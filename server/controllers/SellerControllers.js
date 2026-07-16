const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Seller = require("../models/Seller/SellerSchema");
const Book = require("../models/Seller/BookSchema");
const MyOrder = require("../models/Users/MyOrders");

const generateToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });

// @route POST /api/sellers/signup
const registerSeller = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const existingSeller = await Seller.findOne({ email });
    if (existingSeller) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const seller = await Seller.create({ name, email, password: hashedPassword });

    res.status(201).json({
      success: true,
      message: "Seller registered. Waiting for admin approval.",
      seller: { id: seller._id, name: seller.name, email: seller.email },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route POST /api/sellers/login
const loginSeller = async (req, res) => {
  try {
    const { email, password } = req.body;
    const seller = await Seller.findOne({ email });
    if (!seller) return res.status(404).json({ success: false, message: "Seller not found" });

    if (seller.isBlocked) {
      return res.status(403).json({ success: false, message: "Your account has been blocked" });
    }
    if (!seller.isApproved) {
      return res.status(403).json({ success: false, message: "Your account is pending admin approval" });
    }

    const isMatch = await bcrypt.compare(password, seller.password);
    if (!isMatch) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const token = generateToken(seller._id, "seller");
    res.status(200).json({
      success: true,
      token,
      seller: { id: seller._id, name: seller.name, email: seller.email },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route GET /api/sellers/profile
const getProfile = async (req, res) => {
  try {
    const seller = await Seller.findById(req.user.id).select("-password");
    res.status(200).json({ success: true, seller });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route PUT /api/sellers/profile
const updateProfile = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const updateData = { name, email };
    if (password) updateData.password = await bcrypt.hash(password, 10);

    const seller = await Seller.findByIdAndUpdate(req.user.id, updateData, { new: true }).select(
      "-password"
    );
    res.status(200).json({ success: true, message: "Profile updated", seller });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route POST /api/sellers/books  (Create Item)
const addBook = async (req, res) => {
  try {
    const { title, author, genre, description, price, quantity } = req.body;
    const seller = await Seller.findById(req.user.id);

    const book = await Book.create({
      title,
      author,
      genre,
      description,
      price,
      quantity,
      itemImage: req.file ? `/uploads/${req.file.filename}` : "",
      sellerId: seller._id,
      sellerName: seller.name,
    });

    res.status(201).json({ success: true, message: "Book added successfully", book });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route GET /api/sellers/books  (Get all items belonging to this seller)
const getMyBooks = async (req, res) => {
  try {
    const books = await Book.find({ sellerId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: books.length, books });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route PUT /api/sellers/books/:id  (Update item)
const updateBook = async (req, res) => {
  try {
    const book = await Book.findOne({ _id: req.params.id, sellerId: req.user.id });
    if (!book) return res.status(404).json({ success: false, message: "Book not found" });

    const { title, author, genre, description, price, quantity } = req.body;
    if (title) book.title = title;
    if (author) book.author = author;
    if (genre) book.genre = genre;
    if (description) book.description = description;
    if (price) book.price = price;
    if (quantity !== undefined) book.quantity = quantity;
    if (req.file) book.itemImage = `/uploads/${req.file.filename}`;

    await book.save();
    res.status(200).json({ success: true, message: "Book updated successfully", book });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route DELETE /api/sellers/books/:id
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findOneAndDelete({ _id: req.params.id, sellerId: req.user.id });
    if (!book) return res.status(404).json({ success: false, message: "Book not found" });
    res.status(200).json({ success: true, message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route GET /api/sellers/orders  (orders placed for this seller's books)
const getSellerOrders = async (req, res) => {
  try {
    const orders = await MyOrder.find({ sellerId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route PUT /api/sellers/orders/:id  { status }
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await MyOrder.findOne({ _id: req.params.id, sellerId: req.user.id });
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    order.status = status;
    await order.save();
    res.status(200).json({ success: true, message: "Order status updated", order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
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
};
