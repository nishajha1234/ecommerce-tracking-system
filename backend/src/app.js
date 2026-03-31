const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const analyticsRoutes = require("./routes/analytics.routes");

const trackingRoutes = require("./routes/tracking.routes");
const allowedOrigins = [
  "http://localhost:5173", // local frontend
  "https://ecommerce-tracking-system.vercel.app" // deployed frontend
];

const app = express();

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
}));
app.use(express.json());
app.use(morgan("dev"));
app.use("/api/analytics", analyticsRoutes);

app.use("/api/track", trackingRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Ecommerce Tracking API is running 🚀"
  });
});

module.exports = app;