import axios from "axios";

/* ================= ENV API ================= */
const API = import.meta.env.VITE_API_URL;

/* ================= STATE ================= */
let queue = [];
let isFlushing = false;

/* ================= SESSION ================= */
const getSessionId = () => {
  let sessionId = localStorage.getItem("sessionId");

  if (!sessionId) {
    sessionId = crypto.randomUUID(); // ✅ better than Date.now
    localStorage.setItem("sessionId", sessionId);
  }

  return sessionId;
};

/* ================= FLUSH ================= */
const flushQueue = async () => {
  if (queue.length === 0 || isFlushing) return;

  isFlushing = true;

  const eventsToSend = [...queue];
  queue = [];

  try {
    await axios.post(
      `${API}/api/track/batch`, // ✅ fixed URL
      { events: eventsToSend },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    console.error("Flush failed:", err.message);

    // ✅ retry failed events
    queue = [...eventsToSend, ...queue];
  } finally {
    isFlushing = false;
  }
};

/* ================= INTERVAL ================= */
if (!window.__trackingInterval) {
  window.__trackingInterval = setInterval(flushQueue, 5000);
}

/* ================= TAB CLOSE / BACKGROUND ================= */
window.addEventListener("visibilitychange", () => {
  if (
    document.visibilityState === "hidden" &&
    queue.length > 0 &&
    !isFlushing
  ) {
    try {
      navigator.sendBeacon(
        `${API}/api/track/batch`, // ✅ fixed URL
        JSON.stringify({ events: queue })
      );
      queue = [];
    } catch (e) {
      console.error("Beacon failed:", e);
    }
  }
});

/* ================= PUBLIC FUNCTION ================= */
export const trackEvent = (event) => {
  const sessionId = getSessionId();

  queue.push({
    ...event,
    sessionId,
    timestamp: new Date(),
  });
};