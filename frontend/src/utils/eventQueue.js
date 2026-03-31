let queue = [];
let isFlushing = false;

// ✅ SESSION HANDLING
const getSessionId = () => {
  let sessionId = localStorage.getItem("sessionId");

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem("sessionId", sessionId);
  }

  return sessionId;
};

// ✅ PUSH EVENT
export const pushEvent = (event) => {
  const sessionId = getSessionId();

  queue.push({
    ...event,
    sessionId,
    timestamp: new Date()
  });
};

// ✅ SAFE FLUSH (NO DATA LOSS)
export const flushQueue = async () => {
  if (queue.length === 0 || isFlushing) return;

  isFlushing = true;

  const eventsToSend = [...queue]; // copy
  queue = []; // clear immediately (optimistic)

  try {
    await fetch("http://localhost:5000/api/track/batch", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ events: eventsToSend })
    });
  } catch (err) {
    console.error("Batch send failed", err);

    // ❗ restore events if failed
    queue = [...eventsToSend, ...queue];
  } finally {
    isFlushing = false;
  }
};

// ✅ HANDLE TAB CLOSE / BACKGROUND (CRITICAL FIX)
const handleVisibilityChange = () => {
  if (document.visibilityState === "hidden" && queue.length > 0 && !isFlushing) {
    try {
      navigator.sendBeacon(
        "http://localhost:5000/api/track/batch",
        JSON.stringify({ events: queue })
      );
      queue = [];
    } catch (err) {
      console.error("Beacon failed", err);
    }
  }
};

// ✅ START ONLY ONCE
let started = false;

export const startQueueProcessor = () => {
  if (started) return;

  started = true;

  setInterval(flushQueue, 5000);

  // ✅ attach once
  document.addEventListener("visibilitychange", handleVisibilityChange);
};