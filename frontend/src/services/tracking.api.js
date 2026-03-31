import axios from "axios";

const API = "http://localhost:5000/api/track";

let queue = [];
let isFlushing = false;

// ✅ Stable session handling
let sessionId = localStorage.getItem("sessionId");

if (!sessionId) {
  sessionId = Date.now().toString();
  localStorage.setItem("sessionId", sessionId);
}

// ✅ Flush logic (safe + retry)
const flushQueue = async () => {
  if (queue.length === 0 || isFlushing) return;

  isFlushing = true;

  const eventsToSend = [...queue];
  queue = [];

  try {
    await axios.post(
      `${API}/batch`,
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

// ✅ Prevent multiple intervals (React strict mode safe)
if (!window.__trackingInterval) {
  window.__trackingInterval = setInterval(flushQueue, 5000);
}

// ✅ Reliable flush on tab close (better than beforeunload)
window.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden" && queue.length > 0) {
    try {
      navigator.sendBeacon(
        `${API}/batch`,
        JSON.stringify({ events: queue })
      );
      queue = [];
    } catch (e) {
      console.error("Beacon failed:", e);
    }
  }
});

// ✅ Public function
export const trackEvent = (event) => {
  queue.push({
    ...event,
    sessionId,
    timestamp: new Date(),
  });
};