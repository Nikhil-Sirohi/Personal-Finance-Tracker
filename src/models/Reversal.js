const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Reversal = sequelize.define(
  "Reversal",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    ledgerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Ledgers",
        key: "id",
      },
    },
    reversalType: {
      type: DataTypes.ENUM("create", "update", "delete"),
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Reversal;
