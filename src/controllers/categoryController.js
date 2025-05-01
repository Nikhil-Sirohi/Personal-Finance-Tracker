const { validationResult } = require("express-validator");
const CategorizationService = require("../services/categorizationService");
const AuditService = require("../services/auditService");

const addCategoryRule = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ error: "Validation failed", details: errors.array() });
    }

    const { pattern, category } = req.body;
    const rule = await CategorizationService.addCategoryRule(pattern, category);

    await AuditService.logEvent(
      req.user.id,
      "add_category_rule",
      { pattern, category },
      "success",
      req
    );

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
    if (req.user.role !== "Admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    await CategorizationService.seedDefaultCategories();

    await AuditService.logEvent(
      req.user.id,
      "seed_default_categories",
      null,
      "success",
      req
    );

    res.json({ message: "Default categories seeded successfully" });
  } catch (error) {
    await AuditService.logEvent(
      req.user.id,
      "seed_default_categories",
      null,
      "failure",
      req
    );
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  addCategoryRule,
  getCategoryRules,
  seedDefaultCategories,
};
