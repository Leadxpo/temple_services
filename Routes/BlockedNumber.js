const express = require('express');
const router = express.Router();
const { sequelize } = require('../db');
const BlockedNumberModel = require('../Models/BlockedNumbers')(sequelize);
const DonateModel = require('../Models/DonateNumbers')(sequelize); // import Donate model
const { successResponse, errorResponse } = require("../Midileware/response");
const { userAuth } = require("../Midileware/Auth");

// POST /donate/api/block-single
router.post('/api/block-single', async (req, res) => {
  try {
    const { blockedNumber, description,status } = req.body;

    if (!blockedNumber) {
      return res.status(400).json({ message: "Blocked number is required" });
    }

    // ✅ Check if number already exists in Donate table (correct field name!)
    const donated = await DonateModel.findOne({ where: { donateNumber: blockedNumber } });

    if (donated) {
      return res.status(400).json({ message: "This number already exists in the donated list" });
    }

    // ✅ If not donated, block it
    const [record, created] = await BlockedNumberModel.findOrCreate({
      where: { blockedNumber },
      defaults: {
        blockedNumber,
        isBlocked: true,
        description: description || null,
        status: status || null,

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
    const { from, to, description, status } = req.body;

    if (!from || !to || isNaN(from) || isNaN(to)) {
      return res.status(400).json({ message: "Valid 'from' and 'to' numbers are required" });
    }

    const fromNum = parseInt(from);
    const toNum = parseInt(to);

    if (fromNum > toNum) {
      return res.status(400).json({ message: "'From' number must be less than or equal to 'To' number" });
    }

    const skippedNumbers = []; // ⬅️ to collect numbers that are already donated

    for (let i = fromNum; i <= toNum; i++) {
      const blockedNumber = i.toString();

      // ✅ Check first: is this number already donated?
      const donated = await DonateModel.findOne({ where: { donateNumber: blockedNumber } });

      if (donated) {
        // ⬅️ If donated, skip this number and continue
        skippedNumbers.push(blockedNumber);
        continue;
      }

      // ✅ If not donated, then block it
      const [record, created] = await BlockedNumberModel.findOrCreate({
        where: { blockedNumber },
        defaults: {
          isBlocked: true,
          description: description || "",
          status: status || "active"
        }
      });

      if (!created) {
        record.isBlocked = true;
        record.description = description || record.description;
        record.status = status || record.status;
        await record.save();
      }
    }

    res.status(200).json({ 
      message: `Blocked numbers from ${from} to ${to} successfully.`,
      skippedNumbers: skippedNumbers.length > 0 ? skippedNumbers : "No numbers skipped"
    });

  } catch (error) {
    console.error("Error blocking range:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


// Get all blocked numbers sorted from small to big
router.get("/api/get-all-blocked-numbers", async (req, res) => {
  try {
    const blockedNumbers = await BlockedNumberModel.findAll({
      order: [["blockedNumber", "ASC"]],  // Sorting the blocked numbers in ascending order
    });
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

// Delete blocked number using route param
router.delete("/api/delete-blocked-number/:blockedNumber", async (req, res) => {
  try {
    const { blockedNumber } = req.params;

    const blocked = await BlockedNumberModel.findOne({
      where: { blockedNumber }
    });

    if (!blocked) {
      return errorResponse(res, "Blocked number not found");
    }

    await blocked.destroy();

    return successResponse(res, "Blocked number deleted successfully");
  } catch (error) {
    return errorResponse(res, "Error deleting blocked number", error);
  }
});


router.get("/api/blocked-number-count",  async (req, res) => {
  try {
    const blockedCount = await BlockedNumberModel.count();

    return successResponse(res, "Blocked number count fetched", 
      blockedCount,
);
  } catch (error) {
    return errorResponse(res, "Error fetching blocked number count", error);
  }
});



module.exports = router;
