const express = require("express");
const router = express.Router();

const {
  trackEvent,
  trackBatch
} = require("../controllers/tracking.controller");

router.post("/", trackEvent);
router.post("/batch", trackBatch);

module.exports = router;