// IMPORT JWT_SECRET FROM CONFIG FILE, JSONWEBTOKEN MODULE
const JWT_SECRET = require("./config");
const jwt = require("jsonwebtoken");

// MIDDLEWARE FUNCTION TO VERIFY AUTHENTICATION
const authMiddleware = (req, res, next) => {
  // RETRIEVE AUTHORIZATION HEADER
  const authHeader = req.headers.authorization;

  // CHECK IF AUTHORIZATION HEADER IS MISSING OR DOESN'T START WITH 'Bearer '
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    // RETURN FORBIDDEN STATUS WITH ERROR MESSAGE
    return res.status(403).json({ message: "Invalid Token" });
  }

  // EXTRACT TOKEN FROM AUTHORIZATION HEADER
  const token = authHeader.split(" ")[1];

  // LOG TOKEN AND JWT_SECRET FOR DEBUGGING
  console.log(token);
  console.log(JWT_SECRET);

  try {
    // VERIFY TOKEN USING JWT_SECRET
    const decoded = jwt.verify(token, JWT_SECRET);

    // ASSIGN DECODED USER ID TO REQUEST OBJECT
    req.userId = decoded.userId;

    // PROCEED TO NEXT MIDDLEWARE
    next();
  } catch (err) {
    // RETURN FORBIDDEN STATUS WITH ERROR MESSAGE AND DETAILS
    return res.status(403).json({
      message: "Error",
      error: err,
    });
  }
};

// EXPORT AUTHENTICATION MIDDLEWARE
module.exports = {
  authMiddleware,
};
