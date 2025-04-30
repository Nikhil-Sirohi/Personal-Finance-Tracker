const express = require("express");
const { body } = require("express-validator");
const { auth } = require("../middleware/auth");
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
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("phone").trim().notEmpty().withMessage("Phone number is required"),
];

const validateLogin = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

const validateOTPRequest = [
  body("phone").trim().notEmpty().withMessage("Phone number is required"),
];

const validateOTPVerification = [
  body("phone").trim().notEmpty().withMessage("Phone number is required"),
  body("otp").trim().notEmpty().withMessage("OTP is required"),
];

router.post("/register", validateRegistration, register);
router.post("/login", validateLogin, login);
router.post("/request-otp", validateOTPRequest, requestOTP);
router.post("/verify-otp", validateOTPVerification, verifyOTP);

module.exports = router;
