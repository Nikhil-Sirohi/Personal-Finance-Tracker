const { OTP, User, AuditLog } = require("../models");
const { Op } = require("sequelize");

class OTPService {
  static async generateOTP(phone) {
    try {
      const user = await User.findOne({ where: { phone } });
      if (!user) {
        throw new Error("User not found");
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      const otpRecord = await OTP.create({
        phone,
        otp,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        userId: user.id,
      });

      await AuditLog.create({
        userId: user.id,
        action: "generate_otp",
        ipAddress: null,
      });

      return otp;
    } catch (error) {
      throw error;
    }
  }

  static async verifyOTP(phone, otp) {
    try {
      const otpRecord = await OTP.findOne({
        where: {
          phone,
          expiresAt: {
            [Op.gt]: new Date(),
          },
        },
        order: [["createdAt", "DESC"]],
      });

      if (!otpRecord) {
        throw new Error("No valid OTP found");
      }

      if (otpRecord.otp !== otp) {
        await otpRecord.increment("attempts");

        if (otpRecord.attempts >= 3) {
          await otpRecord.destroy();
          throw new Error("Maximum attempts reached. OTP expired");
        }

        throw new Error(
          `Invalid OTP. ${3 - otpRecord.attempts} attempts remaining`
        );
      }

      const user = await User.findOne({ where: { phone } });
      if (!user) {
        throw new Error("User not found");
      }

      // Update status to verified before deletion
      await otpRecord.update({ status: "verified" });
      await otpRecord.destroy();

      await AuditLog.create({
        userId: user.id,
        action: "verify_otp",
        ipAddress: null,
      });

      return user;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = OTPService;