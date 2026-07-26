import { useState, useEffect, useCallback } from "react";

const MIN_WIDTH = 500;
const MIN_HEIGHT = 350;
const STORAGE_KEY = "terminalPreferences";

function getViewportSize() {
  return {
    width: window.visualViewport ? window.visualViewport.width : window.innerWidth,
    height: window.visualViewport ? window.visualViewport.height : window.innerHeight,
  };
}

export function useTerminalSize() {
  const [prefs, setPrefs] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      // ignore parse errors
    }
    return {
      mode: "AUTO",
      width: null,
      height: null,
      maximized: false,
    };
  });

  const [isMobile, setIsMobile] = useState(false);
  const [viewport, setViewport] = useState(getViewportSize());

  useEffect(() => {
    function handleResize() {
      setViewport(getViewportSize());
      setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleResize);
    }
    return () => {
      window.removeEventListener("resize", handleResize);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", handleResize);
      }
    };
  }, []);

  // Save to localStorage when prefs change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  }, [prefs]);

  const setManualSize = useCallback((w, h) => {
    setPrefs((prev) => ({
      ...prev,
      mode: "MANUAL",
      width: w,
      height: h,
      maximized: false,
    }));
  }, []);

  const toggleMaximize = useCallback(() => {
    setPrefs((prev) => ({
      ...prev,
      maximized: !prev.maximized,
    }));
  }, []);

  const resetSize = useCallback(() => {
    setPrefs({
      mode: "AUTO",
      width: null,
      height: null,
      maximized: false,
    });
  }, []);

  let effectiveWidth = null;
  let effectiveHeight = null;
  let isMaximized = false;

  if (isMobile) {
    effectiveWidth = "100%";
    effectiveHeight = "100%";
  } else if (prefs.maximized) {
    isMaximized = true;
    effectiveWidth = "100%";
    effectiveHeight = "100%";
  } else if (prefs.mode === "MANUAL" && prefs.width && prefs.height) {
    const safeMarginX = 32; // 16px padding on sides
    const safeMarginY = 48; // padding top/bottom

    const maxWidth = Math.max(MIN_WIDTH, viewport.width - safeMarginX);
    const maxHeight = Math.max(MIN_HEIGHT, viewport.height - safeMarginY);

    const clampedW = Math.min(Math.max(prefs.width, MIN_WIDTH), maxWidth);
    const clampedH = Math.min(Math.max(prefs.height, MIN_HEIGHT), maxHeight);

    effectiveWidth = clampedW + "px";
    effectiveHeight = clampedH + "px";
  }

  return {
    mode: prefs.mode,
    width: effectiveWidth,
    height: effectiveHeight,
    isMaximized,
    isMobile,
    setManualSize,
    toggleMaximize,
    resetSize,
  };
}
