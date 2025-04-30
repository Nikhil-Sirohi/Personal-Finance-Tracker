const { validationResult } = require("express-validator");
const OTPService = require("../services/otpService");
const jwt = require("jsonwebtoken");

const sendOTP = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { phone } = req.body;
    const otp = await OTPService.generateOTP(phone);

    res.json({
      message: "OTP sent successfully",
      otp,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
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
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  sendOTP,
  verifyOTP,
};
