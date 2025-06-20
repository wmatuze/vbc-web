import React, { useState, useEffect } from "react";
import {
  getFoundationClassSessionById,
  getFoundationClassSessions,
} from "../../../services/api/foundation-classes";

/**
 * Component to display foundation class session information
 * Fetches and displays actual session details with fallback strategies
 */
const SessionDisplay = ({ sessionId }) => {
  const [sessionInfo, setSessionInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchSessionInfo = async () => {
      // If it's not a valid MongoDB ID, display as is
      if (
        !sessionId ||
        typeof sessionId !== "string" ||
        sessionId.length !== 24
      ) {
        setSessionInfo(sessionId || "Not specified");
        return;
      }

      setLoading(true);
      setError(false);

      try {
        console.log(`Fetching session details for ID: ${sessionId}`);

        // First try to get the specific session
        try {
          const session = await getFoundationClassSessionById(sessionId);
          console.log("Session data received:", session);

          // Format the session info
          const formatDate = (date) => {
            const options = { year: "numeric", month: "short", day: "numeric" };
            return new Date(date).toLocaleDateString("en-US", options);
          };

          const dateRange = `${formatDate(session.startDate)} - ${formatDate(session.endDate)}`;
          const formattedInfo = `${session.day} ${session.time} (${dateRange})`;

          setSessionInfo(formattedInfo);
          return;
        } catch (specificError) {
          console.log(
            "Specific session fetch failed, trying to find in all sessions..."
          );

          // If specific fetch fails, try to find it in all sessions
          const allSessions = await getFoundationClassSessions();
          console.log("All sessions received:", allSessions);

          const matchingSession = allSessions.find(
            (session) => session.id === sessionId || session._id === sessionId
          );

          if (matchingSession) {
            console.log("Found matching session:", matchingSession);

            const formatDate = (date) => {
              const options = {
                year: "numeric",
                month: "short",
                day: "numeric",
              };
              return new Date(date).toLocaleDateString("en-US", options);
            };

            const dateRange = `${formatDate(matchingSession.startDate)} - ${formatDate(matchingSession.endDate)}`;
            const formattedInfo = `${matchingSession.day} ${matchingSession.time} (${dateRange})`;

            setSessionInfo(formattedInfo);
            return;
          }

          // If still not found, throw error to be caught below
          throw new Error("Session not found in any available sessions");
        }
      } catch (err) {
        console.error("Error fetching session details:", err);
        setError(true);
        // Show a more user-friendly message for invalid/deleted sessions
        setSessionInfo("Foundation Class Session (Details Unavailable)");
      } finally {
        setLoading(false);
      }
    };

    fetchSessionInfo();
  }, [sessionId]);

  if (loading) {
    return <span className="text-gray-500">Loading session...</span>;
  }

  if (error) {
    return (
      <span
        className="text-orange-600"
        title={`Could not load session details for ID: ${sessionId}`}
      >
        {sessionInfo}
      </span>
    );
  }

  return <span>{sessionInfo}</span>;
};

export default SessionDisplay;
