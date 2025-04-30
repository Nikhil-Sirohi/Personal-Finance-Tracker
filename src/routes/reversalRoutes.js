const express = require("express");
const { check } = require("express-validator");
const auth = require("../middleware/auth");
const reversalController = require("../controllers/reversalController");

const router = express.Router();

router.post("/reverse", auth, reversalController.reverseLastOperation);
router.get("/history", auth, reversalController.getReversalHistory);

module.exports = router;
