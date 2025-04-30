const { validationResult } = require("express-validator");
const CategorizationService = require("../services/categorizationService");

const addCategoryRule = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { pattern, category } = req.body;
    const rule = await CategorizationService.addCategoryRule(pattern, category);

    res.status(201).json({
      message: "Category rule added successfully",
      rule,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getCategoryRules = async (req, res) => {
  try {
    const rules = await CategorizationService.getCategoryRules();
    res.json(rules);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const seedDefaultCategories = async (req, res) => {
  try {
    await CategorizationService.seedDefaultCategories();
    res.json({ message: "Default categories seeded successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  addCategoryRule,
  getCategoryRules,
  seedDefaultCategories,
};
