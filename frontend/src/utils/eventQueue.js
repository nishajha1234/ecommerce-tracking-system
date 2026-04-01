const API = import.meta.env.VITE_API_URL;

let queue = [];
let isFlushing = false;
let started = false;

const getSessionId = () => {
  let sessionId = localStorage.getItem("sessionId");

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem("sessionId", sessionId);
  }

  return sessionId;
};

export const pushEvent = (event) => {
  const sessionId = getSessionId();

  queue.push({
    ...event,
    sessionId,
    timestamp: new Date()
  });
};

export const flushQueue = async () => {
  if (queue.length === 0 || isFlushing) return;

  isFlushing = true;

  const eventsToSend = [...queue];
  queue = [];

  try {
    await fetch(`${API}/api/track/batch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ events: eventsToSend })
    });
  } catch (err) {
    console.error("Batch send failed", err);

    // restore if failed
    queue = [...eventsToSend, ...queue];
  } finally {
    isFlushing = false;
  }
};

const handleVisibilityChange = () => {
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
    } catch (err) {
      console.error("Beacon failed", err);
    }
  }
};

export const startQueueProcessor = () => {
  if (started) return;

  started = true;

  setInterval(flushQueue, 5000);

  document.addEventListener("visibilitychange", handleVisibilityChange);
};