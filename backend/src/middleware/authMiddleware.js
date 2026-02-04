const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check header exists and starts with Bearer
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ IMPORTANT: force the shape used everywhere else
    req.user = { id: decoded.id };

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
