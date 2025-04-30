const { validationResult } = require("express-validator");
const { Score } = require("../models");
const ScoringService = require("../services/scoringService");
const { Op } = require("sequelize");

const getScore = async (req, res) => {
  try {
    const userId = req.user.id;
    const { month, year } = req.query;

    const now = new Date();
    const currentMonth = month || now.getMonth() + 1;
    const currentYear = year || now.getFullYear();

    let score = await Score.findOne({
      where: { userId, month: currentMonth, year: currentYear },
    });

    if (!score) {
      const scoreData = await ScoringService.calculateScore(
        userId,
        currentMonth,
        currentYear
      );
      score = await Score.create({
        userId,
        month: currentMonth,
        year: currentYear,
        ...scoreData,
      });
    }

    res.json(score);
  } catch (error) {
    console.error("Error in getScore:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getScoreHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { startMonth, startYear, endMonth, endYear } = req.query;

    const where = { userId };
    if (startMonth && startYear && endMonth && endYear) {
      where[Op.and] = [
        {
          [Op.or]: [
            { year: { [Op.gt]: startYear } },
            {
              year: startYear,
              month: { [Op.gte]: startMonth },
            },
          ],
        },
        {
          [Op.or]: [
            { year: { [Op.lt]: endYear } },
            {
              year: endYear,
              month: { [Op.lte]: endMonth },
            },
          ],
        },
      ];
    }

    const scores = await Score.findAll({
      where,
      order: [
        ["year", "DESC"],
        ["month", "DESC"],
      ],
    });

    res.json(scores);
  } catch (error) {
    console.error("Error in getScoreHistory:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getScore,
  getScoreHistory,
};
