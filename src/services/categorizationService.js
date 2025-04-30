const Category = require("../models/Category");

class CategorizationService {
  static async addCategoryRule(pattern, category) {
    try {
      const rule = await Category.create({
        pattern,
        category,
      });
      return rule;
    } catch (error) {
      console.error("Error adding category rule:", error);
      throw error;
    }
  }

  static async getCategoryRules() {
    try {
      const rules = await Category.findAll({
        order: [["createdAt", "DESC"]],
      });
      return rules;
    } catch (error) {
      console.error("Error getting category rules:", error);
      throw error;
    }
  }

  static async autoCategorize(notes, tags = []) {
    try {
      const rules = await this.getCategoryRules();
      const textToMatch = `${notes} ${tags.join(" ")}`.toLowerCase();

      for (const rule of rules) {
        const pattern = new RegExp(rule.pattern, "i");
        if (pattern.test(textToMatch)) {
          return rule.category;
        }
      }

      return null;
    } catch (error) {
      console.error("Error auto-categorizing:", error);
      return null;
    }
  }

  static async seedDefaultCategories() {
    try {
      const defaultRules = [
        {
          pattern: "lunch|dinner|breakfast|restaurant|cafe|food|meal",
          category: "Food",
        },
        {
          pattern: "uber|lyft|taxi|train|bus|metro|transport",
          category: "Transportation",
        },
        { pattern: "rent|mortgage|housing", category: "Housing" },
        {
          pattern: "electricity|water|gas|utility|internet|phone",
          category: "Utilities",
        },
        { pattern: "grocery|supermarket|market", category: "Groceries" },
        {
          pattern: "movie|cinema|netflix|spotify|entertainment",
          category: "Entertainment",
        },
        { pattern: "gym|fitness|sports|health", category: "Health & Fitness" },
        { pattern: "shopping|clothes|fashion|retail", category: "Shopping" },
        { pattern: "education|course|book|learning", category: "Education" },
        { pattern: "travel|vacation|hotel|flight", category: "Travel" },
      ];

      for (const rule of defaultRules) {
        await Category.findOrCreate({
          where: { pattern: rule.pattern },
          defaults: { category: rule.category },
        });
      }

      return true;
    } catch (error) {
      console.error("Error seeding default categories:", error);
      throw error;
    }
  }
}

module.exports = CategorizationService;
