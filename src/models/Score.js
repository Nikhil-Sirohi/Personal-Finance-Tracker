const { Model, DataTypes } = require("sequelize");

class Score extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
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
        score: {
          type: DataTypes.DECIMAL(5, 2),
          allowNull: false,
          validate: {
            min: 0,
            max: 100,
          },
        },
        budgetAdherence: {
          type: DataTypes.DECIMAL(5, 2),
          allowNull: false,
          validate: {
            min: 0,
            max: 100,
          },
        },
        usageFrequency: {
          type: DataTypes.DECIMAL(5, 2),
          allowNull: false,
          validate: {
            min: 0,
            max: 100,
          },
        },
        trackingDiscipline: {
          type: DataTypes.DECIMAL(5, 2),
          allowNull: false,
          validate: {
            min: 0,
            max: 100,
          },
        },
      },
      {
        sequelize,
        modelName: "Score",
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

module.exports = Score;
