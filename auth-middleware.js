const jwt = require("jsonwebtoken");
require("dotenv").config();

// Get JWT secret from environment variable or use fallback
const JWT_SECRET = process.env.JWT_SECRET || "vbc-website-fallback-secret-key";

// Middleware function to handle authentication
const authMiddleware = (req, res, next) => {
  // Skip authentication for GET requests to public endpoints
  if (
    req.method === "GET" &&
    !req.path.includes("/users") &&
    !req.path.includes("/admin")
  ) {
    return next();
  }

  // Skip authentication for login endpoint and membership renewal
  if (
    (req.method === "POST" && req.path === "/login") ||
    (req.method === "POST" && req.path === "/membership/renew")
  ) {
    return next();
  }

  // Check for the authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authentication required" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // In development mode, accept development tokens that start with 'dev-token-'
    if (
      process.env.NODE_ENV === "development" &&
      token.startsWith("dev-token-")
    ) {
      console.log("Development mode: accepting dev token");
      // Add a default admin user for development
      req.user = { id: "dev-admin", username: "admin", role: "admin" };
      return next();
    }

    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Add the user info to the request
    req.user = decoded;

    // Continue to the next middleware
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

module.exports = {
  authMiddleware,
};
