const { sequelize } = require('../db');
const bidModel = require('../Models/Bids')(sequelize);
const userModel = require('../Models/SystemUser')(sequelize);
const { Op } = require("sequelize");
const express = require('express');
const router = express.Router();
const { successResponse, errorResponse } = require("../Midileware/response");

// Create Bid
router.post("/create", async (req, res) => {
  try {
    const bid = await bidModel.create(req.body);
    return successResponse(res, "Bid created successfully", bid);
  } catch (error) {
    return errorResponse(res, "Error creating bid", error);
  }
});

// Update Bid
router.patch("/update/:id", async (req, res) => {
  try {
    const bid = await bidModel.update(req.body, { where: { id: req.params.id } });
    return successResponse(res, "Bid updated successfully", bid);
  } catch (error) {
    return errorResponse(res, "Error updating bid", error);
  }
});

// Delete Bid
router.delete("/delete/:id", async (req, res) => {
  try {
    await bidModel.destroy({ where: { id: req.params.id } });
    return successResponse(res, "Bid deleted successfully");
  } catch (error) {
    return errorResponse(res, "Error deleting bid", error);
  }
});

// Get Bid by User ID
router.get("/user/:userId", async (req, res) => {
  try {
    const bids = await bidModel.findAll({ where: { userId: req.params.userId } });
    return successResponse(res, "Bids fetched successfully", bids);
  } catch (error) {
    return errorResponse(res, "Error fetching bids", error);
  }
});

// Get All Bids
router.get("/all", async (req, res) => {
  try {
    const bids = await bidModel.findAll({ include: userModel });
    return successResponse(res, "All bids fetched successfully", bids);
  } catch (error) {
    return errorResponse(res, "Error fetching all bids", error);
  }
});

// Search by Bid Name
router.get("/search", async (req, res) => {
  try {
    const bids = await bidModel.findAll({
      where: { bidName: { [Op.like]: `%${req.query.name}%` } }
    });
    return successResponse(res, "Search results", bids);
  } catch (error) {
    return errorResponse(res, "Error searching bids", error);
  }
});

// Count Bids
router.get("/count", async (req, res) => {
  try {
    const count = await bidModel.count();
    return successResponse(res, "Bid count fetched successfully", count);
  } catch (error) {
    return errorResponse(res, "Error fetching bid count", error);
  }
});

module.exports = router;