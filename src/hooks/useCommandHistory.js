import { useRef, useState } from "react";

/**
 * useCommandHistory
 * ------------------
 * Tracks previously entered commands and lets the caller cycle through
 * them with arrow keys, matching standard shell behavior.
 */
export function useCommandHistory() {
  const historyRef = useRef([]);
  const [cursor, setCursor] = useState(null); // null = not browsing history

  function push(cmd) {
    if (cmd.trim().length === 0) return;
    historyRef.current.push(cmd);
    setCursor(null);
  }

  function previous() {
    const hist = historyRef.current;
    if (hist.length === 0) return null;
    const nextCursor = cursor === null ? hist.length - 1 : Math.max(0, cursor - 1);
    setCursor(nextCursor);
    return hist[nextCursor];
  }

  function next() {
    const hist = historyRef.current;
    if (cursor === null) return null;
    const nextCursor = cursor + 1;
    if (nextCursor >= hist.length) {
      setCursor(null);
      return "";
    }
    setCursor(nextCursor);
    return hist[nextCursor];
  }

  return { push, previous, next };
}
