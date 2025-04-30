const { Model, DataTypes } = require("sequelize");

class OTP extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        phone: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        otp: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        status: {
          type: DataTypes.ENUM("pending", "verified", "expired"),
          defaultValue: "pending",
        },
        attempts: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
        },
        expiresAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: "OTP",
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: "userId" });
  }
}

module.exports = OTP;
