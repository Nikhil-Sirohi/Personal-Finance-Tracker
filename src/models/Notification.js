const { Model, DataTypes } = require("sequelize");

class Budget extends Model {
  static init(sequelize) {
    super.init(
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
        month: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
            min: 1,
            max: 12,
          },
        },
        year: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
            min: 2000,
            max: 2100,
          },
        },
        totalBudget: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
          validate: {
            min: 0,
          },
        },
        categoryLimits: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
        },
      },
      {
        sequelize,
        modelName: "Budget",
        timestamps: true,
        indexes: [
          {
            unique: true,
            fields: ["userId", "month", "year"],
          },
        ],
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: "userId" });
  }
}

module.exports = Budget;
