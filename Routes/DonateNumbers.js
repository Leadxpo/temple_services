const express = require('express');
const router = express.Router();
const { sequelize } = require('../db');
const DonateNumberModel = require('../Models/DonateNumbers')(sequelize); // 🔁 Updated model
const BlockedNumberModel = require('../Models/BlockedNumbers')(sequelize);
const { successResponse, errorResponse } = require("../Midileware/response");
const { userAuth } = require("../Midileware/Auth");

router.post("/api/create-donate-number", async (req, res) => {
  try {
    console.log("Form Data Received:", req.body);
    const donate = await DonateNumberModel.create(req.body);
    
    return successResponse(res, "Donate number created successfully", donate);
  } catch (error) {
    return errorResponse(res, "Error creating donate number", error);
  }
});


// Get all Donate Numbers
router.get("/api/get-all-donate-numbers",  async (req, res) => {
  try {
    const donateNumbers = await DonateNumberModel.findAll();
    return successResponse(res, "Donate numbers fetched successfully", donateNumbers);
  } catch (error) {
    return errorResponse(res, "Error fetching donate numbers", error);
  }
});

// Get single donate number by ID
router.post("/api/get-by-donateId", userAuth, async (req, res) => {
  try {
    const { donateId } = req.body;
    const donate = await DonateNumberModel.findByPk(donateId);
    console.log(donate)
    if (!donate) {
      return errorResponse(res, "Donate number not found");
    }

    return successResponse(res, "Donate number fetched successfully", donate);
  } catch (error) {
    console.log(error)
    return errorResponse(res, "Error fetching donate number", error);
  }
});


// Get single donate number by donateNumber field
router.post("/api/get-by-donate-number", userAuth, async (req, res) => {
  try {
    const { donateNumber } = req.body;
    console.log('Request donateNumber:', donateNumber);

    const donate = await DonateNumberModel.findOne({ where: { donateNumber } });
    console.log('Donate fetched:', donate);

    if (!donate) {
      return errorResponse(res, "Donate number not found");
    }

    return successResponse(res, "Donate number fetched successfully", donate);
  } catch (error) {
    console.log(error);
    return errorResponse(res, "Error fetching donate number", error);
  }
});

router.patch("/api/update-donate-status/:donateId",  async (req, res) => {
  try {
    const { donateId } = req.params;
    const { status } = req.body;

    // Try using findOne if findByPk fails
    const donate = await DonateNumberModel.findOne({ where: { donateNumber: donateId } });

    if (!donate) {
      return errorResponse(res, "Donate number not found");
    }

    await donate.update({ status });

    return successResponse(res, "Donate number status updated successfully", donate);
  } catch (error) {
    return errorResponse(res, "Error updating donate number status", error);
  }
});

// // Delete donate number
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


router.get("/api/get-all-pending-donates",  async (req, res) => {
  try {
    const pendingDonates = await DonateNumberModel.findAll({
      where: {
        status: 'Pending'
      }
    });

    return successResponse(res, "Pending donate numbers fetched successfully", pendingDonates);
  } catch (error) {
    console.log(error);
    return errorResponse(res, "Error fetching pending donate numbers", error);
  }
});


router.get("/api/count-pending-donates", async (req, res) => {
  try {
    const count = await DonateNumberModel.count();

    return successResponse(res, "Pending donate numbers count fetched successfully", count);
  } catch (error) {
    console.log(error);
    return errorResponse(res, "Error fetching pending donate numbers count", error);
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











