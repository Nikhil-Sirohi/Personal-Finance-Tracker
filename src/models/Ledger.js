const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Ledger = sequelize.define(
  "Ledger",
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
    entityId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Expenses",
        key: "id",
      },
    },
    entityType: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "expense",
    },
    operation: {
      type: DataTypes.ENUM("create", "update", "delete"),
      allowNull: false,
    },
    data: {
      type: DataTypes.JSONB,
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

module.exports = Ledger;
