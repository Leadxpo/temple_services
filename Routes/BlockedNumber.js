const express = require('express');
const router = express.Router();
const { sequelize } = require('../db');
const BlockedNumberModel = require('../Models/BlockedNumbers')(sequelize);
const { successResponse, errorResponse } = require("../Midileware/response");
const { userAuth } = require("../Midileware/Auth");

// POST /donate/api/block-single
router.post('/api/block-single', async (req, res) => {
  try {
    const { blockedNumber } = req.body;

    if (!blockedNumber) {
      return res.status(400).json({ message: "Block number is required" });
    }

    const [record, created] = await BlockedNumberModel.findOrCreate({
      where: { blockedNumber: blockedNumber },
      defaults: {
        blockedNumber: blockedNumber,
        isBlocked: true,
        description: req.body.description || null,
      },
    });
    
    if (!created) {
      record.isBlocked = true;
      await record.save();
    }

    res.status(200).json({ message: "Number blocked successfully", data: record });
  } catch (error) {
    console.error("Error blocking single number:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


// POST /donate/api/block-range
router.post('/api/block-range', async (req, res) => {
  try {
    const { from, to } = req.body;

    if (!from || !to || isNaN(from) || isNaN(to)) {
      return res.status(400).json({ message: "Valid 'from' and 'to' numbers are required" });
    }

    const fromNum = parseInt(from);
    const toNum = parseInt(to);

    if (fromNum > toNum) {
      return res.status(400).json({ message: "'From' number must be less than or equal to 'To' number" });
    }

    const promises = [];
    for (let i = fromNum; i <= toNum; i++) {
      const blockedNumber = i.toString();
      promises.push(
        BlockedNumberModel.findOrCreate({
          where: { blockedNumber },
          defaults: { isBlocked: true }
        }).then(([record, created]) => {
          if (!created) {
            record.isBlocked = true;
            return record.save();
          }
        })
      );
    }

    await Promise.all(promises);
    res.status(200).json({ message: `Blocked numbers from ${from} to ${to}` });
  } catch (error) {
    console.error("Error blocking range:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});





// Get all blocked numbers
router.get("/api/get-all-blocked-numbers",  async (req, res) => {
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
