import { useEffect, useRef, useState } from "react";
import OutputLine from "./OutputLine";
import BootMessage from "./BootMessage";
import { runCommand, getCwd, resetTerminalState, setInitialCwd, getCompletions } from "../data/commands";
import { useSearchParams } from "react-router-dom";
import { useCommandHistory } from "../hooks/useCommandHistory";
import { useTerminalSize } from "../hooks/useTerminalSize";

const PROMPT_USER = "guest";
const PROMPT_HOST = "portfolio-server";

/**
 * Each entry in `entries` is either:
 *   { type: 'command', value: string, path: string }
 *   { type: 'output', lines: [{text, variant}] }
 */
export default function Terminal({ onExit }) {
  const [entries, setEntries] = useState([]);
  const [input, setInput] = useState("");
  const [cursorPos, setCursorPos] = useState(0);
  const [promptPath, setPromptPath] = useState("~");
  const bodyRef = useRef(null);
  const inputRef = useRef(null);
  const terminalRef = useRef(null);
  const dragState = useRef(null);
  const history = useCommandHistory();
  const { mode, width, height, isMaximized, isMobile, setManualSize, toggleMaximize } = useTerminalSize();
  const [searchParams] = useSearchParams();
  const [connectState, setConnectState] = useState(
    searchParams.get("startDir") ? "connecting" : "connected"
  );

  useEffect(() => {
    if (connectState === "connecting") {
      const t1 = setTimeout(() => setConnectState("authenticating"), 600);
      return () => clearTimeout(t1);
    } else if (connectState === "authenticating") {
      const t2 = setTimeout(() => setConnectState("connected"), 800);
      return () => clearTimeout(t2);
    }
  }, [connectState]);

  // Reset filesystem state on mount
  useEffect(() => {
    resetTerminalState();
    const startDir = searchParams.get("startDir");
    if (startDir) {
      setInitialCwd(startDir);
    }
    setPromptPath(getCwd());
  }, [searchParams]);

  // Keep the view scrolled to the latest line whenever entries change.
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [entries]);

  function focusInput() {
    inputRef.current?.focus();
  }

  function handleSubmit(e) {
    e.preventDefault();
    const raw = input.trim();
    // Exit command handling
    if (raw === "exit") {
      if (onExit) onExit();
      setEntries([]);
      setInput("");
      return;
    }
    history.push(raw);

    const currentPath = getCwd();
    const result = runCommand(raw);

    setEntries((prev) => {
      const withCommand = [...prev, { type: "command", value: raw, path: currentPath }];
      if (result && result.clear) {
        return [];
      }
      return [...withCommand, { type: "output", lines: result }];
    });

    // Update prompt path after command (cd may have changed it)
    setPromptPath(getCwd());
    setInput("");
    setCursorPos(0);
  }

  function handleKeyDown(e) {
    if (e.ctrlKey) {
      if (e.key === "c") {
        e.preventDefault();
        setEntries((prev) => [
          ...prev,
          { type: "command", value: input + "^C", path: getCwd(), interrupt: true },
        ]);
        setInput("");
        setCursorPos(0);
        return;
      } else if (e.key === "l") {
        e.preventDefault();
        setEntries([]);
        return;
      } else if (e.key === "a") {
        e.preventDefault();
        setCursorPos(0);
        setTimeout(() => inputRef.current?.setSelectionRange(0, 0), 0);
        return;
      } else if (e.key === "e") {
        e.preventDefault();
        setCursorPos(input.length);
        setTimeout(() => inputRef.current?.setSelectionRange(input.length, input.length), 0);
        return;
      } else if (e.key === "u") {
        e.preventDefault();
        setInput(input.slice(cursorPos));
        setCursorPos(0);
        return;
      } else if (e.key === "k") {
        e.preventDefault();
        setInput(input.slice(0, cursorPos));
        return;
      } else if (e.key === "w") {
        e.preventDefault();
        const before = input.slice(0, cursorPos);
        const after = input.slice(cursorPos);
        const match = before.match(/\\S+\\s*$/);
        if (match) {
          const newBefore = before.slice(0, match.index);
          setInput(newBefore + after);
          setCursorPos(newBefore.length);
        }
        return;
      }
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      const prevCmd = history.previous();
      if (prevCmd !== null) {
        setInput(prevCmd);
        setCursorPos(prevCmd.length);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextCmd = history.next();
      if (nextCmd !== null) {
        setInput(nextCmd);
        setCursorPos(nextCmd.length);
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const completed = getCompletions(input);
      if (completed && completed !== input) {
        setInput(completed);
        setCursorPos(completed.length);
      }
    }
  }

  function handleInputSelect(e) {
    setCursorPos(e.target.selectionStart || 0);
  }

  function handleInputChange(e) {
    setInput(e.target.value);
    setCursorPos(e.target.selectionStart || 0);
  }

  function handlePointerDown(e, edge) {
    e.preventDefault();
    e.stopPropagation();
    if (!terminalRef.current) return;
    
    const rect = terminalRef.current.getBoundingClientRect();
    dragState.current = {
      edge,
      startX: e.clientX,
      startY: e.clientY,
      startWidth: rect.width,
      startHeight: rect.height,
    };
    
    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp);
  }

  function handlePointerMove(e) {
    if (!dragState.current) return;
    
    const { edge, startX, startY, startWidth, startHeight } = dragState.current;
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;
    
    let newWidth = startWidth;
    let newHeight = startHeight;
    
    if (edge === "right" || edge === "corner") {
      newWidth = startWidth + deltaX;
    }
    if (edge === "bottom" || edge === "corner") {
      newHeight = startHeight + deltaY;
    }
    
    setManualSize(newWidth, newHeight);
  }

  function handlePointerUp() {
    dragState.current = null;
    document.removeEventListener("pointermove", handlePointerMove);
    document.removeEventListener("pointerup", handlePointerUp);
  }

  const dynamicStyles = {
    width: width || undefined,
    height: height || undefined,
    borderRadius: isMaximized || isMobile ? "0" : undefined,
  };

  return (
    <div className="terminal-window" ref={terminalRef} style={dynamicStyles} onClick={focusInput}>
      <div className="terminal-titlebar" onDoubleClick={toggleMaximize}>
        <div
          className="terminal-window-controls"
          onDoubleClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className="terminal-control terminal-control-close"
            onClick={(e) => {
              e.stopPropagation();
              onExit && onExit();
            }}
            aria-label="Close terminal"
            title="Close"
          />
          <span
            className="terminal-control terminal-control-minimize"
            aria-hidden="true"
          />
          <button
            type="button"
            className="terminal-control terminal-control-maximize"
            onClick={(e) => {
              e.stopPropagation();
              toggleMaximize();
            }}
            aria-label={isMaximized ? "Restore terminal" : "Maximize terminal"}
            title={isMaximized ? "Restore" : "Maximize"}
          />
        </div>

        <span className="title-text">
          {PROMPT_USER}@{PROMPT_HOST}: {promptPath}
        </span>

        <button
          type="button"
          className="terminal-home-button"
          onClick={(e) => { e.stopPropagation(); onExit && onExit(); }}
          aria-label="Return to Console Home"
        >
          Console Home
        </button>
      </div>

      <div className="terminal-body" ref={bodyRef}>
        {(connectState === "connecting" || connectState === "authenticating") && (
          <OutputLine text="Connecting to i-0a3f..." variant="dim" />
        )}
        {connectState === "authenticating" && (
          <OutputLine text="Authenticating..." variant="dim" />
        )}

        {connectState === "connected" && (
          <>
            <BootMessage />

            {entries.map((entry, i) =>
              entry.type === "command" ? (
                <p className="line command-line" key={i}>
                  <span className="prompt" style={{ marginRight: "6px" }}>
                    <span className="prompt-user">{PROMPT_USER}@{PROMPT_HOST}</span>:<span className="prompt-path">{entry.path}</span>$
                  </span>
                  {entry.value}
                </p>
              ) : (
                <div key={i}>
                  {entry.lines.map((l, j) => (
                    <OutputLine key={j} text={l.text} variant={l.variant} />
                  ))}
                </div>
              )
            )}

            <form onSubmit={handleSubmit} className="input-row">
              <span className="prompt" style={{ marginRight: "6px" }}>
                <span className="prompt-user">{PROMPT_USER}@{PROMPT_HOST}</span>:<span className="prompt-path">{promptPath}</span>$
              </span>
              <div className="terminal-input-wrapper">
                <div className="terminal-input-display">
                  {input.slice(0, cursorPos)}
                  <span className="terminal-cursor">
                    {input[cursorPos] || " "}
                  </span>
                  {input.slice(cursorPos + 1)}
                </div>
                <input
                  ref={inputRef}
                  className="terminal-input"
                  type="text"
                  value={input}
                  autoFocus
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  onSelect={handleInputSelect}
                  onKeyUp={handleInputSelect}
                  onClick={handleInputSelect}
                  aria-label="Terminal command input"
                />
              </div>
            </form>
          </>
        )}
      </div>

      {!isMobile && !isMaximized && (
        <>
          <div className="resize-handle right" onPointerDown={(e) => handlePointerDown(e, "right")} />
          <div className="resize-handle bottom" onPointerDown={(e) => handlePointerDown(e, "bottom")} />
          <div className="resize-handle corner" onPointerDown={(e) => handlePointerDown(e, "corner")} />
        </>
      )}
    </div>
  );
}
