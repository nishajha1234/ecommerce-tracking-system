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

    timestamp: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  {
    timestamps: false
  }
);

eventSchema.index({ sessionId: 1, timestamp: 1 });

eventSchema.index({ eventType: 1, timestamp: -1 });

eventSchema.index({ productId: 1, eventType: 1 });

eventSchema.index({ page: 1, eventType: 1 });

module.exports = mongoose.model("Event", eventSchema);