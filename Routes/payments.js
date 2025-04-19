const express = require('express');
const router = express.Router();
const { sequelize } = require('../db');
const PaymentModel = require('../Models/Payments')(sequelize);
const { successResponse, errorResponse } = require("../Midileware/response");
const { userAuth } = require("../Midileware/Auth");
const fs = require('fs');
const path = require('path');
const multer = require('multer'); 




// Ensure the directory exists
const uploadDir = path.join(__dirname, "../storege/payments");
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




router.post("/api/create-payment", upload.single("paymentRecept"), userAuth, async (req, res) => {
  try {
    const {
      userId,
      userName,
      gothram,
      amount,
      paymentMethod,
      donateNumber
    } = req.body;

    const payment = await PaymentModel.create({
      userId,
      userName,
      gothram,
      amount,
      paymentMethod,
      donateNumber,
      paymentRecept: req.file?.filename || null,
    });

    return successResponse(res, "Payment created successfully", payment);
  } catch (error) {
    return errorResponse(res, "Error creating payment", error);
  }
});

// Get all payments
router.get("/api/get-all-payments",  async (req, res) => {
  try {
    const payments = await PaymentModel.findAll();
    return successResponse(res, "Payments fetched successfully", payments);
  } catch (error) {
    return errorResponse(res, "Error fetching payments", error);
  }
});


// Get pending payments only
router.get("/api/get-pending-payments", async (req, res) => {
  try {
    const pendingPayments = await PaymentModel.findAll({
      where: { status: "pending" },
    });
    return successResponse(res, "Pending payments fetched successfully", pendingPayments);
  } catch (error) {
    return errorResponse(res, "Error fetching pending payments", error);
  }
});



// Get single payment by ID
router.get("/api/get-payment/:id", userAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await PaymentModel.findByPk(id);

    if (!payment) {
      return errorResponse(res, "Payment not found");
    }

    return successResponse(res, "Payment fetched successfully", payment);
  } catch (error) {
    return errorResponse(res, "Error fetching payment", error);
  }
});

// Update payment

router.patch("/api/update-payment/:id", userAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, paymentMethod, paymentStatus, transactionId } = req.body;

    const payment = await PaymentModel.findByPk(id);

    if (!payment) {
      return errorResponse(res, "Payment not found");
    }

    await payment.update({
      amount,
      paymentMethod,
      paymentStatus,
      transactionId,
    });

    return successResponse(res, "Payment updated successfully", payment);
  } catch (error) {
    return errorResponse(res, "Error updating payment", error);
  }
});

// Delete payment
router.delete("/api/delete-payment/:id", userAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await PaymentModel.findByPk(id);

    if (!payment) {
      return errorResponse(res, "Payment not found");
    }

    await payment.destroy();

    return successResponse(res, "Payment deleted successfully");
  } catch (error) {
    return errorResponse(res, "Error deleting payment", error);
  }
});



router.patch("/api/update-payment-status/:paymentId", async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { status } = req.body;

    // Find payment by paymentNumber (formerly donateNumber)
    const payment = await DonateNumberModel.findOne({ where: { donateNumber: paymentId } });

    if (!payment) {
      return errorResponse(res, "Payment not found");
    }

    await payment.update({ status });

    return successResponse(res, "Payment status updated successfully", payment);
  } catch (error) {
    return errorResponse(res, "Error updating payment status", error);
  }
});



router.put("/api/update-payment-status/:donateNumber", 
  async (req, res) => {
  console.log("Received request to update payment status:", req.params);

  try {
    const { donateNumber } = req.params;
    const { status } = req.body;
    console.log("Received request to update payment status: donateNumber", donateNumber);

    
    const payment = await PaymentModel.findOne({ where: {donateNumber: donateNumber } });

    if (!payment) {
      console.log("Payment not found for donateNumber:", donateNumber);
      return errorResponse(res, "Payment not found");
    }

    await payment.update({ status });

    console.log("Payment status updated successfully");
    return successResponse(res, "Payment status updated successfully", payment);
  } catch (error) {
    console.error("❌ Error updating payment status:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating payment status",
      error: error.message || error.toString(),
    });
  }
});


router.get("/api/total-payments",  async (req, res) => {
  try {
    const totalPayments = await PaymentModel.count();

    return successResponse(res, "Total payments count fetched", {
      totalPayments,
    });
  } catch (error) {
    return errorResponse(res, "Error fetching total payments count", error);
  }
});




module.exports = router;
