const express = require('express');
const router = express.Router();
const { sequelize } = require('../db');
const BlockedNumberModel = require('../Models/BlockedNumbers')(sequelize);
const { successResponse, errorResponse } = require("../Midileware/response");
const { userAuth } = require("../Midileware/Auth");

// Create Blocked Number
router.post("/api/create-blocked-number", userAuth, async (req, res) => {
  try {
    const { phoneNumber, reason } = req.body;

    const blocked = await BlockedNumberModel.create({ phoneNumber, reason });

    return successResponse(res, "Blocked number created successfully", blocked);
  } catch (error) {
    return errorResponse(res, "Error creating blocked number", error);
  }
});

// Get all blocked numbers
router.get("/api/get-all-blocked-numbers", userAuth, async (req, res) => {
  try {
    const blockedNumbers = await BlockedNumberModel.findAll();
    return successResponse(res, "Blocked numbers fetched successfully", blockedNumbers);
  } catch (error) {
    return errorResponse(res, "Error fetching blocked numbers", error);
  }
});

// Get single blocked number by ID
router.get("/api/get-blocked-number/:id", userAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const blocked = await BlockedNumberModel.findByPk(id);

    if (!blocked) {
      return errorResponse(res, "Blocked number not found");
    }

    return successResponse(res, "Blocked number fetched successfully", blocked);
  } catch (error) {
    return errorResponse(res, "Error fetching blocked number", error);
  }
});

// Update blocked number
router.patch("/api/update-blocked-number/:id", userAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { phoneNumber, reason } = req.body;

    const blocked = await BlockedNumberModel.findByPk(id);

    if (!blocked) {
      return errorResponse(res, "Blocked number not found");
    }

    await blocked.update({ phoneNumber, reason });

    return successResponse(res, "Blocked number updated successfully", blocked);
  } catch (error) {
    return errorResponse(res, "Error updating blocked number", error);
  }
});

// Delete blocked number
router.delete("/api/delete-blocked-number/:id", userAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const blocked = await BlockedNumberModel.findByPk(id);

    if (!blocked) {
      return errorResponse(res, "Blocked number not found");
    }

    await blocked.destroy();

    return successResponse(res, "Blocked number deleted successfully");
  } catch (error) {
    return errorResponse(res, "Error deleting blocked number", error);
  }
});

module.exports = router;
