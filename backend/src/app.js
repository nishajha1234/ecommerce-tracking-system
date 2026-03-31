const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const analyticsRoutes = require("./routes/analytics.routes");

const trackingRoutes = require("./routes/tracking.routes");

const app = express();

app.use(cors({
  origin: "*", // later restrict to frontend URL
}));
app.use(express.json());
app.use(morgan("dev"));
app.use("/api/analytics", analyticsRoutes);

app.use("/api/track", trackingRoutes);

module.exports = app;