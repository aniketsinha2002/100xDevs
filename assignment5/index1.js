// WHEN USER TRYING TO ACCESS THE PROTECTED ROUTE, WE WILL CHECK IF THE TOKEN IS VALID OR NOT BY DEXODING THE TOKEN WITH JWT PASSWORD AND TOKEN - USERNAME => VERIFY(TOKEN, JWT PASSWORD)
const jwt = require('jsonwebtoken');

const userMiddleware = (req, res, next) => 
{
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "Token not found" });
  }

  try {
    const decodedValue = jwt.verify(token, 'secretKey');
    console.log(decodedValue); // Log decoded token payload
    next();
  } catch (error) {
    console.error(error); // Log verification error
    return res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = userMiddleware;
