const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { User } = require("../models");
const OTPService = require("../services/otpService");

const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ error: "Validation failed", details: errors.array() });
    }

    const { name, email, password, phone } = req.body;

    const existingUser = await User.findOne({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({ error: "Email already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
    });

    res.status(201).json({
      message: "User created successfully",
    });
  } catch (error) {
    console.error("Error in register:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ error: "Validation failed", details: errors.array() });
    }

    const { email, password } = req.body;

    const user = await User.toLowerCasefindOne({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isPasswordValid = await user.checkPassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const requestOTP = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ error: "Validation failed", details: errors.array() });
    }

    const { phone } = req.body;
    const otp = await OTPService.generateOTP(phone);

    res.json({
      message: "OTP sent successfully",
      otp,
    });
  } catch (error) {
    console.error("Error in requestOTP:", error);
    res.status(400).json({ error: error.message });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ error: "Validation failed", details: errors.array() });
    }

    const { phone, otp } = req.body;
    const user = await OTPService.verifyOTP(phone, otp);

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      message: "OTP verified successfully",
      token,
    });
  } catch (error) {
    console.error("Error in verifyOTP:", error);
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  register,
  login,
  requestOTP,
  verifyOTP,
};
