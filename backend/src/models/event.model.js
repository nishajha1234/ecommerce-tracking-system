const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      default: "guest"
    },

    sessionId: {
      type: String,
      required: true,
      index: true
    },

    eventType: {
      type: String,
      enum: ["PAGE_VIEW", "PRODUCT_VIEW", "TIME_SPENT"],
      required: true,
      index: true
    },

    // ✅ Make page required (important for analytics)
    page: {
      type: String,
      required: true
    },

    productId: {
      type: String,
      default: null
    },

    duration: {
      type: Number,
      default: 0,
      min: 0
    },

    metadata: {
      userAgent: String,
      device: {
        type: String,
        enum: ["mobile", "desktop", "tablet"],
        default: "desktop"
      },
      country: String
    },

    // ✅ Keep ONE source of truth
    timestamp: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  {
    // ❌ REMOVE this to avoid confusion
    timestamps: false
  }
);

// 🔥 PERFORMANCE INDEXES

// session flow + ordering
eventSchema.index({ sessionId: 1, timestamp: 1 });

// analytics queries
eventSchema.index({ eventType: 1, timestamp: -1 });

// product analytics
eventSchema.index({ productId: 1, eventType: 1 });

// 🔥 OPTIONAL (INTERVIEW BOOST): compound index for dashboard queries
eventSchema.index({ page: 1, eventType: 1 });

module.exports = mongoose.model("Event", eventSchema);