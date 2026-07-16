const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/Users/UserSchema");
const Book = require("../models/Seller/BookSchema");
const MyOrder = require("../models/Users/MyOrders");

const generateToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });

// @route POST /api/users/signup
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route POST /api/users/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (user.isBlocked) {
      return res.status(403).json({ success: false, message: "Your account has been blocked" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const token = generateToken(user._id, "user");
    res.status(200).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route GET /api/users/profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route PUT /api/users/profile
const updateProfile = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const updateData = { name, email };
    if (password) updateData.password = await bcrypt.hash(password, 10);

    const user = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
    }).select("-password");

    res.status(200).json({ success: true, message: "Profile updated", user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route GET /api/users/books  (browse + search + filter by genre)
const getAllBooks = async (req, res) => {
  try {
    const { search, genre } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
      ];
    }
    if (genre) filter.genre = genre;

    const books = await Book.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: books.length, books });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route GET /api/users/books/:id
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ success: false, message: "Book not found" });
    res.status(200).json({ success: true, book });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route POST /api/users/cart  { bookId, quantity }
const addToCart = async (req, res) => {
  try {
    const { bookId, quantity } = req.body;
    const user = await User.findById(req.user.id);

    const existingItem = user.cart.find((item) => item.bookId.toString() === bookId);
    if (existingItem) {
      existingItem.quantity += quantity || 1;
    } else {
      user.cart.push({ bookId, quantity: quantity || 1 });
    }

    await user.save();
    const populatedUser = await User.findById(req.user.id).populate("cart.bookId");
    res.status(200).json({ success: true, cart: populatedUser.cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route GET /api/users/cart
const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("cart.bookId");
    res.status(200).json({ success: true, cart: user.cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route DELETE /api/users/cart/:bookId
const removeFromCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.cart = user.cart.filter((item) => item.bookId.toString() !== req.params.bookId);
    await user.save();
    res.status(200).json({ success: true, message: "Item removed from cart", cart: user.cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route POST /api/users/checkout  -> creates order(s) from cart, updates stock, clears cart
const checkout = async (req, res) => {
  try {
    const { flatno, pincode, city, state } = req.body;
    const user = await User.findById(req.user.id).populate("cart.bookId");

    if (!user.cart.length) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    const createdOrders = [];

    for (const item of user.cart) {
      const book = item.bookId;
      if (!book) continue;

      if (book.quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Not enough stock for "${book.title}". Available: ${book.quantity}`,
        });
      }

      const order = await MyOrder.create({
        flatno,
        pincode,
        city,
        state,
        totalamount: book.price * item.quantity,
        bookId: book._id,
        booktitle: book.title,
        bookauthor: book.author,
        bookgenre: book.genre,
        itemImage: book.itemImage,
        description: book.description,
        quantity: item.quantity,
        userId: user._id,
        userName: user.name,
        sellerId: book.sellerId,
        sellerName: book.sellerName,
      });

      book.quantity -= item.quantity;
      await book.save();

      createdOrders.push(order);
    }

    user.cart = [];
    await user.save();

    res.status(201).json({ success: true, message: "Order placed successfully", orders: createdOrders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route GET /api/users/orders
const getMyOrders = async (req, res) => {
  try {
    const orders = await MyOrder.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
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
};
