const jwt = require("jsonwebtoken");

// Verifies the JWT sent in the Authorization header ("Bearer <token>")
const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "No token, authorization denied" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // decoded = { id, role }
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

// Restricts a route to specific roles, e.g. authorizeRoles("admin"), authorizeRoles("seller","admin")
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Access denied for this role" });
    }
    next();
  };
};

module.exports = { protect, authorizeRoles };
