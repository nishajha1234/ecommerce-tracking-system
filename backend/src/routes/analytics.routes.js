const express = require("express");
const router = express.Router();

const {
  getStats,   // 🔥 USE THIS
  getDropOff,
  getSessionFlow,
  getFunnel,
  getAnalytics
} = require("../controllers/analytics.controller");

// ✅ MAIN DASHBOARD API (FIXED)
router.get("/", getAnalytics);

// ✅ Advanced analytics (optional but good)
router.get("/dropoff", getDropOff);
router.get("/sessions", getSessionFlow);
router.get("/funnel", getFunnel);

module.exports = router;