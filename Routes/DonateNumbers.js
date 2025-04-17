const express = require('express');
const router = express.Router();
const { sequelize } = require('../db');
const DonateNumberModel = require('../Models/DonateNumbers')(sequelize); // 🔁 Updated model
const BlockedNumberModel = require('../Models/BlockedNumbers')(sequelize);
const { successResponse, errorResponse } = require("../Midileware/response");
const { userAuth } = require("../Midileware/Auth");

// Create Donate Number
router.post("/api/create-donate-number", userAuth, async (req, res) => {
  try {
    const { donateNumber, description} = req.body;

    const donate = await DonateNumberModel.create({ donateNumber, description });

    return successResponse(res, "Donate number created successfully", donate);
  } catch (error) {
    return errorResponse(res, "Error creating donate number", error);
  }
});

// Get all Donate Numbers
router.get("/api/get-all-donate-numbers", userAuth, async (req, res) => {
  try {
    const donateNumbers = await DonateNumberModel.findAll();
    return successResponse(res, "Donate numbers fetched successfully", donateNumbers);
  } catch (error) {
    return errorResponse(res, "Error fetching donate numbers", error);
  }
});

// Get single donate number by ID
router.get("/api/get-donate-number/:id", userAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const donate = await DonateNumberModel.findByPk(id);

    if (!donate) {
      return errorResponse(res, "Donate number not found");
    }

    return successResponse(res, "Donate number fetched successfully", donate);
  } catch (error) {
    return errorResponse(res, "Error fetching donate number", error);
  }
});

// Update donate number
router.patch("/api/update-donate-number/:id", userAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { phoneNumber, reason } = req.body;

    const donate = await DonateNumberModel.findByPk(id);

    if (!donate) {
      return errorResponse(res, "Donate number not found");
    }

    await donate.update({ phoneNumber, reason });

    return successResponse(res, "Donate number updated successfully", donate);
  } catch (error) {
    return errorResponse(res, "Error updating donate number", error);
  }
});

// Delete donate number
router.delete("/api/delete-donate", userAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const donate = await DonateNumberModel.findByPk(id);

    if (!donate) {
      return errorResponse(res, "Donate number not found");
    }

    await donate.destroy();

    return successResponse(res, "Donate number deleted successfully");
  } catch (error) {
    return errorResponse(res, "Error deleting donate number", error);
  }
});


// ✅ Route to check if number exists in either donate or blocked
router.post('/api/check-number',  async (req, res) => {
  try {
    const { number } = req.body;

    if (!number) {
      return res.status(400).json({
        success: false,
        message: "Donate number is required",
        data: null,
        error: null
      });
    }

    const isDonateNumber = await DonateNumberModel.findOne({
      where: { donateNumber: number },
    });

    const isBlockedNumber = await BlockedNumberModel.findOne({
      where: { blockedNumber: number },
    });

    return res.status(200).json({
      success: true,
      message: "Number checked successfully",
      data: {
        isDonateNumber: !!isDonateNumber,
        isBlockedNumber: !!isBlockedNumber,
      },
      error: null,
    });
  } catch (error) {
    return errorResponse(res, "Error checking number", error);
  }
});

module.exports = router;










module.exports = router;
