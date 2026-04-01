import { useEffect, useRef } from "react";
import { pushEvent, startQueueProcessor } from "../utils/eventQueue";

let isQueueStarted = false;

export const useTracking = (page) => {
  const startTimeRef = useRef(null);
  const sentRef = useRef(false);

  useEffect(() => {
    if (!isQueueStarted) {
      startQueueProcessor();
      isQueueStarted = true;
    }

    let sessionId = localStorage.getItem("sessionId");

    if (!sessionId) {
      sessionId = crypto.randomUUID(); // ✅ production-level
      localStorage.setItem("sessionId", sessionId);
    }

    startTimeRef.current = Date.now();
    sentRef.current = false;

    pushEvent({
      eventType: "PAGE_VIEW",
      page,
      sessionId
    });

    const sendTimeSpent = () => {
      if (!startTimeRef.current || sentRef.current) return;

      const duration = Math.round(
        (Date.now() - startTimeRef.current) / 1000
      );

      if (duration < 2) {
        startTimeRef.current = null;
        return;
      }

      pushEvent({
        eventType: "TIME_SPENT",
        page,
        duration,
        sessionId
      });

      sentRef.current = true;
      startTimeRef.current = null;
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        sendTimeSpent();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      sendTimeSpent();
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, [page]);
};