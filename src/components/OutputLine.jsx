const URL_OR_EMAIL = /((https?:\/\/[^\s]+)|([\w.+-]+@[\w-]+\.[\w.-]+))/g;

/**
 * Splits a line of text into plain-text and link segments so URLs/emails
 * become clickable without resorting to dangerouslySetInnerHTML.
 */
function renderWithLinks(text) {
  const parts = text.split(URL_OR_EMAIL).filter((p) => p !== undefined);
  return parts.map((part, i) => {
    if (!part) return null;
    if (/^https?:\/\//.test(part)) {
      return (
        <a key={i} className="term-link" href={part} target="_blank" rel="noopener noreferrer">
          {part}
        </a>
      );
    }
    if (/^[\w.+-]+@[\w-]+\.[\w.-]+$/.test(part)) {
      return (
        <a key={i} className="term-link" href={`mailto:${part}`}>
          {part}
        </a>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

const VARIANT_CLASS = {
  default: "",
  dim: "dim",
  accent: "accent",
  error: "error",
  heading: "section-heading",
};

export default function OutputLine({ text, variant = "default" }) {
  const cls = VARIANT_CLASS[variant] || "";
  return <p className={`line ${cls}`.trim()}>{renderWithLinks(text)}</p>;
}
