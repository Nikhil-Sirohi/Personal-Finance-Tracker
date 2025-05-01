const { Model, DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          validate: {
            isEmail: true,
          },
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        phone: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        role: {
          type: DataTypes.ENUM("User", "Admin"),
          defaultValue: "User",
          allowNull: false,
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
        },
        lastLogin: {
          type: DataTypes.DATE,
        },
      },
      {
        sequelize,
        modelName: "User",
        hooks: {
          beforeCreate: async (user) => {
            if (user.password) {
              user.password = await bcrypt.hash(user.password, 10);
            }
          },
          beforeUpdate: async (user) => {
            if (user.changed("password")) {
              user.password = await bcrypt.hash(user.password, 10);
            }
          },
        },
      }
    );
  }

  static associate(models) {
    this.hasMany(models.Expense, { foreignKey: "userId" });
    this.hasMany(models.Budget, { foreignKey: "userId" });
    this.hasMany(models.Score, { foreignKey: "userId" });
    this.hasMany(models.Notification, { foreignKey: "userId" });
    this.hasMany(models.Ledger, { foreignKey: "userId" });
    this.hasMany(models.Reversal, { foreignKey: "userId" });
    this.hasMany(models.OTP, { foreignKey: "userId" });
  }

  async checkPassword(password) {
    return bcrypt.compare(password, this.password);
  }
}

module.exports = User;
