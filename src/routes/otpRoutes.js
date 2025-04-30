const express = require("express");
const { body } = require("express-validator");
const { sendOTP, verifyOTP } = require("../controllers/otpController");

const router = express.Router();

const validatePhone = [
  body("phone").isMobilePhone().withMessage("Invalid phone number"),
];

const validateOTP = [
  body("phone").isMobilePhone().withMessage("Invalid phone number"),
  body("otp")
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP must be 6 digits")
    .isNumeric()
    .withMessage("OTP must contain only numbers"),
];

router.post("/send", validatePhone, sendOTP);
router.post("/verify", validateOTP, verifyOTP);

module.exports = router;
