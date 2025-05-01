const express = require("express");
const { body } = require("express-validator");
const {
  register,
  login,
  requestOTP,
  verifyOTP,
} = require("../controllers/authController");

const router = express.Router();

const validateRegistration = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  body("phone").isMobilePhone().withMessage("Invalid phone number"),
];

const validateLogin = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

const validateOTPRequest = [
  body("phone").isMobilePhone().withMessage("Invalid phone number"),
];

const validateOTPVerification = [
  body("phone").isMobilePhone().withMessage("Invalid phone number"),
  body("otp")
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP must be 6 digits")
    .isNumeric()
    .withMessage("OTP must contain only numbers"),
];

router.post("/signup", validateRegistration, register);
router.post("/login", validateLogin, login);
router.post("/send-otp", validateOTPRequest, requestOTP);
router.post("/verify-otp", validateOTPVerification, verifyOTP);

module.exports = router;
