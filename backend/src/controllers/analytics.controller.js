const Event = require("../models/event.model");

/* =========================================================
   COMMON SORT (STABLE)
========================================================= */
const stableSort = { count: -1, _id: 1 };

/* =========================================================
   1. DASHBOARD STATS (UNCHANGED + SAFE)
========================================================= */
exports.getStats = async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();

    const topProducts = await Event.aggregate([
      { $match: { eventType: "PRODUCT_VIEW" } },
      {
        $group: {
          _id: "$productId",
          count: { $sum: 1 }
        }
      },
      { $sort: stableSort },
      { $limit: 5 }
    ]);

    const pageStats = await Event.aggregate([
      { $match: { eventType: "TIME_SPENT" } },
      {
        $group: {
          _id: "$page",
          totalTime: { $sum: "$duration" },
          visits: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 1,
          totalTime: 1,
          avgTime: {
            $cond: [
              { $eq: ["$visits", 0] },
              0,
              { $divide: ["$totalTime", "$visits"] }
            ]
          }
        }
      },
      { $sort: { totalTime: -1, _id: 1 } }
    ]);

    res.json({
      totalEvents,
      topProducts,
      pageStats
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =========================================================
   2. DROP-OFF (IMPROVED BUT COMPATIBLE)
========================================================= */
exports.getDropOff = async (req, res) => {
  try {
    const dropOff = await Event.aggregate([
      { $match: { eventType: "PAGE_VIEW" } },

      { $sort: { sessionId: 1, timestamp: 1, _id: 1 } },

      {
        $group: {
          _id: "$sessionId",
          pages: { $push: "$page" }
        }
      },

      {
        $project: {
          lastPage: { $arrayElemAt: ["$pages", -1] }
        }
      },

      {
        $group: {
          _id: "$lastPage",
          count: { $sum: 1 }
        }
      },

      {
        $project: {
          name: "$_id",
          value: "$count",
          _id: 0
        }
      },

      { $sort: { value: -1, name: 1 } }
    ]);

    res.set("Cache-Control", "no-store");
    res.json(dropOff);

  } catch (err) {
    console.error("DropOff Error:", err);
    res.status(500).json({ error: err.message });
  }
};

/* =========================================================
   3. SESSION FLOW (LIMITED FOR SAFETY)
========================================================= */
exports.getSessionFlow = async (req, res) => {
  try {
    const sessions = await Event.aggregate([
      { $match: { eventType: "PAGE_VIEW" } },
      { $sort: { sessionId: 1, timestamp: 1 } },
      {
        $group: {
          _id: "$sessionId",
          pages: { $push: "$page" }
        }
      },
      { $limit: 50 } // ✅ prevent heavy response
    ]);

    res.json(sessions);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =========================================================
   4. FUNNEL (OPTIMIZED - SINGLE QUERY)
========================================================= */
exports.getFunnel = async (req, res) => {
  try {
    const steps = ["/home", "/product/1", "/checkout"];

    const funnel = await Event.aggregate([
      { $match: { eventType: "PAGE_VIEW", page: { $in: steps } } },
      {
        $group: {
          _id: { step: "$page", sessionId: "$sessionId" }
        }
      },
      {
        $group: {
          _id: "$_id.step",
          users: { $sum: 1 }
        }
      }
    ]);

    const result = steps.map((step) => {
      const found = funnel.find((f) => f._id === step);
      return {
        step,
        users: found ? found.users : 0
      };
    });

    res.json(result);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =========================================================
   5. MAIN ANALYTICS (UPGRADED WITH INSIGHTS)
========================================================= */
exports.getAnalytics = async (req, res) => {
  try {
    const [
      totalEvents,
      topProducts,
      allProducts,
      pageStats,
      dropOff
    ] = await Promise.all([

      Event.countDocuments(),

      /* TOP PRODUCTS */
      Event.aggregate([
        { $match: { eventType: "PRODUCT_VIEW" } },
        {
          $group: {
            _id: "$productId",
            count: { $sum: 1 }
          }
        },
        { $sort: stableSort },
        { $limit: 5 }
      ]),

      /* ALL PRODUCTS */
      Event.aggregate([
        { $match: { eventType: "PRODUCT_VIEW" } },
        {
          $group: {
            _id: "$productId",
            count: { $sum: 1 }
          }
        },
        { $sort: stableSort }
      ]),

      /* PAGE STATS (FIXED CONSISTENCY) */
      Event.aggregate([
        { $match: { eventType: "TIME_SPENT" } },
        {
          $group: {
            _id: "$page",
            totalTime: { $sum: "$duration" },
            avgTime: { $avg: "$duration" }
          }
        },
        { $sort: { totalTime: -1, _id: 1 } }
      ]),

      /* DROP-OFF */
      Event.aggregate([
        { $match: { eventType: "PAGE_VIEW" } },
        { $sort: { sessionId: 1, timestamp: 1, _id: 1 } },
        {
          $group: {
            _id: "$sessionId",
            lastPage: { $last: "$page" }
          }
        },
        {
          $group: {
            _id: "$lastPage",
            count: { $sum: 1 }
          }
        },
        {
          $project: {
            name: "$_id",
            value: "$count",
            _id: 0
          }
        },
        { $sort: { value: -1, name: 1 } }
      ])
    ]);

    /* =====================================================
       🔥 INSIGHTS LAYER (NO BREAKING CHANGE)
    ===================================================== */
    const insights = {
      mostViewedProduct: topProducts[0]?._id || null,
      mostEngagingPage: pageStats[0]?._id || null,
      highestDropOffPage: dropOff[0]?.name || null
    };

    res.set("Cache-Control", "no-store");

    res.json({
      totalEvents,
      topProducts,
      allProducts,
      pageStats,
      dropOff,
      insights // ✅ NEW (SAFE ADDITION)
    });

  } catch (err) {
    console.error("❌ Analytics Error:", err);
    res.status(500).json({ error: err.message });
  }
};