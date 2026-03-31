const Event = require("../models/event.model");

// ✅ Allowed event types (centralized)
const VALID_EVENT_TYPES = ["PAGE_VIEW", "PRODUCT_VIEW", "TIME_SPENT"];

/**
 * 🔹 SINGLE EVENT
 */
const trackEvent = async (req, res) => {
  try {
    const { eventType, page, productId, duration } = req.body;
    const sessionId = req.headers["x-session-id"];

    // ✅ Basic validation
    if (!eventType || !VALID_EVENT_TYPES.includes(eventType)) {
      return res.status(400).json({
        success: false,
        error: "Invalid or missing eventType"
      });
    }

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        error: "sessionId is required"
      });
    }

    // ✅ Event-specific validation
    if (eventType === "PRODUCT_VIEW" && !productId) {
      return res.status(400).json({
        success: false,
        error: "productId is required for PRODUCT_VIEW"
      });
    }

    if (eventType === "TIME_SPENT") {
      if (
        duration === undefined ||
        typeof duration !== "number" ||
        duration < 0
      ) {
        return res.status(400).json({
          success: false,
          error: "valid duration is required for TIME_SPENT"
        });
      }
    }

    const event = await Event.create({
      userId: "guest",
      sessionId,
      eventType,
      page: page || "",
      productId: productId || null,
      duration: eventType === "TIME_SPENT" ? duration : 0,
      timestamp: new Date()
    });

    res.status(201).json({
      success: true,
      event
    });
  } catch (err) {
    console.error("trackEvent error:", err);

    res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
};

/**
 * 🔥 BATCH TRACKING (MAIN API)
 */
const trackBatch = async (req, res) => {
  try {
    const { events } = req.body;

    if (!events || !Array.isArray(events)) {
      return res.status(400).json({
        success: false,
        error: "events must be a valid array"
      });
    }

    // ✅ Prevent overload (VERY IMPORTANT)
    if (events.length > 1000) {
      return res.status(400).json({
        success: false,
        error: "Too many events in one request (max 1000)"
      });
    }

    const formattedEvents = events
      .filter((e) => {
        if (!e.eventType || !VALID_EVENT_TYPES.includes(e.eventType)) return false;
        if (!e.sessionId) return false;

        if (e.eventType === "PRODUCT_VIEW" && !e.productId) return false;

        if (e.eventType === "TIME_SPENT") {
          if (
            e.duration === undefined ||
            typeof e.duration !== "number" ||
            e.duration < 0
          ) {
            return false;
          }
        }

        return true;
      })
      .map((e) => ({
        userId: "guest",
        sessionId: e.sessionId,
        eventType: e.eventType,
        page: e.page || "",
        productId: e.productId || null,
        duration: e.eventType === "TIME_SPENT" ? e.duration : 0,
        timestamp: e.timestamp ? new Date(e.timestamp) : new Date()
      }));

    if (formattedEvents.length === 0) {
      return res.status(400).json({
        success: false,
        error: "No valid events to insert"
      });
    }

    await Event.insertMany(formattedEvents);

    res.status(201).json({
      success: true,
      inserted: formattedEvents.length
    });
  } catch (err) {
    console.error("trackBatch error:", err);

    res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
};

module.exports = {
  trackEvent,
  trackBatch
};