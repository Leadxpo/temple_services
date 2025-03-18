const { sequelize } = require('../db');
const userModel = require('../Models/Users')(sequelize);
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

// Image configuration
const imageconfig = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./storege/userdp");
  },
  filename: (req, file, callback) => {
    callback(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: imageconfig,
  limits: { fileSize: 1000000000 }
});

// Register Route
router.post("/register", upload.single("profilePicture"), async (req, res) => {
  try {
    const hashPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashPassword;

    if (req.file) {
      req.body.profilePicture = `${req.file.filename}`;
    }

    const user = await userModel.create(req.body);
    return successResponse(res, "User added successfully", user);

  } catch (error) {
    return errorResponse(res, "Error saving the user", error);
  }
});

// Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ where: { email } });

    if (!user) {
      return errorResponse(res, "User not found");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return errorResponse(res, "Invalid password");
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, firstName: user.firstName },
      "vamsi@1998"
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 2 * 60 * 60 * 1000
    });

    return successResponse(res, "Login successful", {
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        role: user.role
      }
    });

  } catch (error) {
    return errorResponse(res, "Login failed", error);
  }
});

// Profile Route
router.get("/profile", userAuth, async (req, res) => {
  try {
    return successResponse(res, "User profile fetched successfully", req.user);
  } catch (error) {
    return errorResponse(res, "Failed to fetch profile", error);
  }
});

// Get All Profiles
router.get("/all-profiles", userAuth, async (req, res) => {
  try {
    const users = await userModel.findAll();
    return successResponse(res, "All users fetched successfully", users);
  } catch (error) {
    return errorResponse(res, "Failed to fetch users", error);
  }
});

// Update User
router.patch("/user-update", userAuth, upload.single("profilePicture"), async (req, res) => {
  try {
    const loggedinUser = req.user;

    if (userData.file) {
      const getUserDate = await brand_controller.getBrandById(userData.body.brand_id)

      if (getUserDate.brand_image !== null) {
          await deleteImage(getUserDate.brand_image)
          userData.body.brand_image = userData.file.filename
      }
      else {
          userData.body.brand_image = userData.file.filename
      }
  }


    await loggedinUser.update(req.body);

    return successResponse(res, "Profile updated successfully", loggedinUser);
  } catch (error) {
    return errorResponse(res, "Profile update failed", error);
  }
});

// Logout
router.post("/logout", (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  return successResponse(res, "Logged out successfully");
});

// Search User
router.get("/search", userAuth, async (req, res) => {
  try {
    const findUser = await userModel.findOne({ where: req.body });
    return successResponse(res, "User found", findUser);
  } catch (error) {
    return errorResponse(res, "User search failed", error);
  }
});

// Forgot Password
router.post("/forgot-password", async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const user = await userModel.findOne({ where: { email } });

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
router.post("/reset-password", userAuth, async (req, res) => {
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
