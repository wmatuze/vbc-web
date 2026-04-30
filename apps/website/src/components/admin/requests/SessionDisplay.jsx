import React, { useState, useEffect } from "react";
import {
  getFoundationClassSessionById,
  getFoundationClassSessions,
} from "../../../services/api/foundation-classes";

const SessionDisplay = ({ sessionId }) => {
  const [sessionInfo, setSessionInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchSessionInfo = async () => {
      if (!sessionId || typeof sessionId !== "string" || sessionId.length !== 24) {
        setSessionInfo(sessionId || "Not specified");
        return;
      }

      setLoading(true);
      setError(false);

      const fmt = (date) =>
        new Date(date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });

      try {
        try {
          const session = await getFoundationClassSessionById(sessionId);
          setSessionInfo(`${session.day} ${session.time} (${fmt(session.startDate)} – ${fmt(session.endDate)})`);
          return;
        } catch {
          const allSessions = await getFoundationClassSessions();
          const match = allSessions.find(
            (s) => s.id === sessionId || s._id === sessionId,
          );
          if (match) {
            setSessionInfo(`${match.day} ${match.time} (${fmt(match.startDate)} – ${fmt(match.endDate)})`);
            return;
          }
          throw new Error("Session not found");
        }
      } catch {
        setError(true);
        setSessionInfo("Session details unavailable");
      } finally {
        setLoading(false);
      }
    };

    fetchSessionInfo();
  }, [sessionId]);

  if (loading) {
    return <span className="text-gray-400 dark:text-gray-500 text-xs">Loading…</span>;
  }

  if (error) {
    return (
      <span
        className="text-orange-500 dark:text-orange-400 text-xs"
        title={`Could not load session details for ID: ${sessionId}`}
      >
        {sessionInfo}
      </span>
    );
  }

  return <span className="text-sm text-gray-700 dark:text-gray-300">{sessionInfo}</span>;
};

export default SessionDisplay;
