import axios from "axios";

const API = import.meta.env.VITE_API_URL;

let queue = [];
let isFlushing = false;

const getSessionId = () => {
  let sessionId = localStorage.getItem("sessionId");

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem("sessionId", sessionId);
  }

  return sessionId;
};

const flushQueue = async () => {
  if (queue.length === 0 || isFlushing) return;

  isFlushing = true;

  const eventsToSend = [...queue];
  queue = [];

  try {
    await axios.post(
      `${API}/api/track/batch`,
      { events: eventsToSend },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    console.error("Flush failed:", err.message);

    queue = [...eventsToSend, ...queue];
  } finally {
    isFlushing = false;
  }
};

if (!window.__trackingInterval) {
  window.__trackingInterval = setInterval(flushQueue, 5000);
}

window.addEventListener("visibilitychange", () => {
  if (
    document.visibilityState === "hidden" &&
    queue.length > 0 &&
    !isFlushing
  ) {
    try {
      navigator.sendBeacon(
        `${API}/api/track/batch`,
        JSON.stringify({ events: queue })
      );
      queue = [];
    } catch (e) {
      console.error("Beacon failed:", e);
    }
  }
});

export const trackEvent = (event) => {
  const sessionId = getSessionId();

  queue.push({
    ...event,
    sessionId,
    timestamp: new Date(),
  });
};