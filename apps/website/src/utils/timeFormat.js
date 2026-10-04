/**
 * Normalises free-text times coming from the API ("09:30 AM", "6 PM", "18:00")
 * into one display style: "9:30 AM". Anything unrecognised (e.g. "Various")
 * is returned unchanged.
 */
export const formatTimeLabel = (value) => {
  if (typeof value !== "string") return value ?? "";

  const match = value.trim().match(/^(\d{1,2})(?:[:.](\d{2}))?\s*(am|pm)?$/i);
  if (!match) return value;

  const hour = Number(match[1]);
  const minutes = match[2] || "00";
  if (hour > 23 || Number(minutes) > 59) return value;

  const period = match[3]?.toUpperCase() || (hour >= 12 ? "PM" : "AM");
  return `${hour % 12 || 12}:${minutes} ${period}`;
};
