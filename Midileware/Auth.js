const jwt = require("jsonwebtoken");
const systemUserModel = require("../Models/SystemUser");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Invalid token");
    }

    // Verify the token and extract user ID
    const verifyToken = await jwt.verify(token, "vamsi@1998", {
      expiresIn: "10h",
    });
    const { userId } = verifyToken;

    // Find the user by ID
    const user = await systemUserModel.findById(userId);
    if (!user) {
      throw new Error("User does not exist");
    }
    if (!user.role === "Super Admin" ||!user.role === " Admin") {
      throw new Error("Invalid user");
    }
    // Attach user to request object
    req.user = user;
    next(); // Pass control to the next middleware
  } catch (error) {
    // Send the error message in response
    res.status(400).json({ error: error.message });
  }
};

module.exports = { userAuth };
