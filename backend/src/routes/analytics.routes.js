const express = require("express");
const router = express.Router();

const {
  getDropOff,
  getSessionFlow,
  getFunnel,
  getAnalytics
} = require("../controllers/analytics.controller");

router.get("/", getAnalytics);

router.get("/dropoff", getDropOff);
router.get("/sessions", getSessionFlow);
router.get("/funnel", getFunnel);

module.exports = router;