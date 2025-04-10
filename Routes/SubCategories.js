const { sequelize } = require('../db');
const subcategoryModel = require('../Models/SubCategories')(sequelize);
const { Op } = require("sequelize");
const express = require('express');
const router = express.Router();
const { successResponse, errorResponse } = require("../Midileware/response");
const { userAuth } = require("../Midileware/Auth");

// Create Subcategory
router.post("/create", userAuth, async (req, res) => {
  try {
    const subcategory = await subcategoryModel.create(req.body);
    return successResponse(res, "Subcategory created successfully", subcategory);
  } catch (error) {
    return errorResponse(res, "Error creating subcategory", error);
  }
});

// Update Subcategory
router.patch("/update/:id", userAuth, async (req, res) => {
  try {
    const subcategory = await subcategoryModel.update(req.body, { where: { id: req.params.id } });
    return successResponse(res, "Subcategory updated successfully", subcategory);
  } catch (error) {
    return errorResponse(res, "Error updating subcategory", error);
  }
});

// Delete Subcategory
router.delete("/delete/:id", userAuth, async (req, res) => {
  try {
    await subcategoryModel.destroy({ where: { id: req.params.id } });
    return successResponse(res, "Subcategory deleted successfully");
  } catch (error) {
    return errorResponse(res, "Error deleting subcategory", error);
  }
});

// Get Subcategory By ID
router.get("/get/:id", userAuth, async (req, res) => {
  try {
    const subcategory = await subcategoryModel.findOne({ where: { id: req.params.id } });
    return successResponse(res, "Subcategory fetched successfully", subcategory);
  } catch (error) {
    return errorResponse(res, "Error fetching subcategory", error);
  }
});

// Get All Subcategories
router.get("/all", userAuth, async (req, res) => {
  try {
    const subcategories = await subcategoryModel.findAll();
    return successResponse(res, "All subcategories fetched successfully", subcategories);
  } catch (error) {
    return errorResponse(res, "Error fetching subcategories", error);
  }
});

// Search Subcategory By Name
router.get("/search", userAuth, async (req, res) => {
  try {
    const { name } = req.query;
    const subcategories = await subcategoryModel.findAll({ where: { name: { [Op.like]: `%${name}%` } } });
    return successResponse(res, "Subcategories fetched successfully", subcategories);
  } catch (error) {
    return errorResponse(res, "Error searching subcategories", error);
  }
});

// Count Subcategories
router.get("/count", userAuth, async (req, res) => {
  try {
    const count = await subcategoryModel.count();
    return successResponse(res, "Subcategory count fetched successfully", count);
  } catch (error) {
    return errorResponse(res, "Error counting subcategories", error);
  }
});

module.exports = router;