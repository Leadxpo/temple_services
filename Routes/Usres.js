const { sequelize } = require('../db');
const UserModel = require('../Models/Users')(sequelize);
const { Op } = require("sequelize");
const express = require('express');
const router = express.Router();
const multer = require('multer'); 
const jwt = require("jsonwebtoken");
const path = require('path');
const bcrypt = require("bcrypt");
const { successResponse, errorResponse } = require("../Midileware/response");
const { deleteImage } = require("../Midileware/deleteimages");
const { userAuth } = require("../Midileware/Auth");
const fs = require('fs');
const DonateNumbers = require('../Models/DonateNumbers');

// Ensure the directory exists
const uploadDir = path.join(__dirname, "../storege/userdp");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer image configuration
const imageconfig = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, uploadDir);
  },
  filename: (req, file, callback) => {
    callback(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: imageconfig,
  limits: { fileSize: 1000000000 }
});

router.post("/api/register", upload.single("profilePic"), async (req, res) => {
  try {
    console.log("Received Data:", req.body);

    const { phoneNumber, aadharNumber } = req.body;

    // Check if phone number already exists
    const existingPhone = await UserModel.findOne({ where: { phoneNumber } });
    if (existingPhone) {
      return errorResponse(res, "Phone number already exists");
    }

    // Check if aadhar number already exists
    const existingAadhar = await UserModel.findOne({ where: { aadharNumber } });
    if (existingAadhar) {
      return errorResponse(res, "Aadhar number already exists");
    }

    // Hash password
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    // Attach uploaded file
    if (req.file) {
      req.body.profilePic = req.file.filename;
      console.log("Uploaded File:", req.file.filename);
    }

    // Create User
    const user = await UserModel.create(req.body);
    return successResponse(res, "User added successfully", user);
  } catch (error) {
    console.error("Error Saving User:", error);
    return errorResponse(res, "Error saving user", error);
  }
});

// Login Route
router.post("/api/login", async (req, res) => {
  try {
    const { userId, password } = req.body;
    
    const user = await UserModel.findOne({ where: { userId } });

    if (!user) {
      return errorResponse(res, "User not found");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return errorResponse(res, "Invalid password");
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.userId, email: user.email, userName: user.userName },
      "vamsi@1998", // Move this to environment variable in production!
      { expiresIn: "2h" }
    );

    // Return token in response body (no cookies)
    return successResponse(res, "Login successful", {
      token,
      user: {
        id: user.id,
        userId: user.userId,
        password: user.password,
        userName: user.userName,
        gender: user.gender,
        email: user.email,
        phoneNumber: user.phoneNumber,
        aadharNumber: user.aadharNumber,
        address: user.address,
        donateNumber: user.donateNumber,
        dob: user.dob,
        gothram: user.gothram,
        marriage_status: user.marriage_status,
        profilePic: user.profilePic,
      }
    });

  } catch (error) {
    console.error("Login Error:", error);
    return errorResponse(res, "Login failed", error);
  }
});



// Profile Route
router.post("/api/get-user", async (req, res) => {
  console.log("ggg",req.body)
  try {
    const { id } = req.body; // ✅ Correctly extract id
    console.log("ggg id",id)
    if (!id) {
      return res.status(400).json({ success: false, message: "id is required" });
    }

    const user = await UserModel.findOne({ where: { id } }); // ✅ Await this

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "User profile fetched successfully",
      data: user,
      error: null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
      data: null,
      error: error.message,
    });
  }
});


router.get("/api/all-user", async (req, res) => {
  try {
    const users = await UserModel.findAll(); // ⬅️ await is necessary
    return successResponse(res, "All users fetched successfully", users);
  } catch (error) {
    return errorResponse(res, "Failed to fetch users", error);
  }
});

router.patch("/api/user-update", userAuth, upload.single("profilePic"), async (req, res) => {
  try {
    const { id } = req.body;

    const user = await UserModel.findOne({ where: { id } });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (req.file) {
      if (user.profilePic) {
        try {
          await deleteImage(user.profilePic); // Now it works fine
        } catch (err) {
          console.error("File delete failed:", err);
          // Optional: don't block update even if delete fails
        }
      }
      req.body.profilePic = req.file.filename;
    }

    await user.update(req.body);
    return successResponse(res, "Profile updated successfully", user);
  } catch (error) {
    console.error("Update error:", error);
    return errorResponse(res, "Profile update failed", error);
  }
});



// Logout
router.post("/api/logout", (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  return successResponse(res, "Logged out successfully");
});

router.delete("/api/delete-user/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const user = await UserModel.findOne({ where: { id } });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    await user.destroy();
    return res.status(200).json({ success: true, message: "User deleted" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Forgot Password
router.post("/api/forgot-password", async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const user = UserModel.findOne({ where: { email } });

    if (!user) {
      return errorResponse(res, "User does not exist");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashedPassword });

    return successResponse(res, "Password updated successfully");
  } catch (error) {
    return errorResponse(res, "Error updating password", error);
  }
});

// Reset Password
router.post("/api/reset-password", userAuth, async (req, res) => {
  try {
    const { password, newPassword } = req.body;
    const user = req.user;

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return errorResponse(res, "Invalid current password");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashedPassword });

    return successResponse(res, "Password updated successfully");
  } catch (error) {
    return errorResponse(res, "Error resetting password", error);
  }
});

module.exports = router;
