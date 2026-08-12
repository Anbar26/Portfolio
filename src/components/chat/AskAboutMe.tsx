"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * "Ask about me" — a small portfolio assistant.
 *
 * Mounted in layout.tsx as a sibling of <SmoothScroll>, deliberately OUTSIDE
 * #smooth-content. ScrollSmoother keeps that element transformed, and a
 * transformed ancestor becomes the containing block for `position: fixed`, so
 * anything fixed inside it scrolls away with the page.
 *
 * State is per-session and in memory only: closing the tab forgets it. Nothing
 * is stored, and no visitor information is collected.
 */

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Tell me about her experience",
  "What projects has she built?",
  "What are her main skills?",
  "Tell me about RedTeam AI",
];

const GREETING =
  "Hi! I'm Anbar's portfolio assistant ✦ Ask me anything about her projects, experience, skills, or certifications.";

const FALLBACK = "Sorry, I couldn't answer that right now. Please try again.";

export default function AskAboutMe() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Keep the newest message in view as the thread grows.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, pending]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Escape closes; clicking outside closes. Neither traps the reader.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    const onDown = (e: PointerEvent) => {
      if (!panelRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    // pointerdown on the document, deferred so the opening click is not caught
    const t = window.setTimeout(() => document.addEventListener("pointerdown", onDown), 0);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  const send = useCallback(
    async (text: string) => {
      const question = text.trim();
      if (!question || pending) return;

      const next: Msg[] = [...messages, { role: "user", content: question }];
      setMessages(next);
      setDraft("");
      setPending(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "content-type": "application/json" },
          // The whole thread goes up, so follow-ups like "which one uses RL?"
          // resolve against what was just said.
          body: JSON.stringify({ messages: next.slice(-12) }),
        });
        const data = await res.json().catch(() => null);
        const reply =
          typeof data?.reply === "string" && data.reply.trim()
            ? data.reply.trim()
            : typeof data?.error === "string"
              ? data.error
              : FALLBACK;
        setMessages([...next, { role: "assistant", content: reply }]);
      } catch {
        setMessages([...next, { role: "assistant", content: FALLBACK }]);
      } finally {
        setPending(false);
        inputRef.current?.focus();
      }
    },
    [messages, pending]
  );

  return (
    <div className="ask-root">
      {!open && (
        <button
          type="button"
          className="ask-launcher"
          onClick={() => setOpen(true)}
          aria-label="Ask about Anbar"
        >
          <span className="ask-launcher-star" aria-hidden>
            {"✦"}
          </span>
          <span className="ask-launcher-text">Ask about me</span>
        </button>
      )}

      {open && (
        <div
          ref={panelRef}
          className="ask-panel"
          role="dialog"
          aria-label="Ask about Anbar"
        >
          <header className="ask-head">
            <span className="ask-head-title">
              <span aria-hidden>{"✦"}</span> Ask about Anbar
            </span>
            <button
              type="button"
              className="ask-close"
              onClick={() => setOpen(false)}
              aria-label="Close"
            >
              {"✕"}
            </button>
          </header>

          <div className="ask-scroll" ref={scrollRef}>
            <p className="ask-bubble ask-bot ask-greeting">{GREETING}</p>

            {messages.map((m, i) => (
              <p
                key={i}
                className={`ask-bubble ${m.role === "user" ? "ask-user" : "ask-bot"}`}
              >
                {m.content}
              </p>
            ))}

            {pending && (
              <p className="ask-bubble ask-bot ask-typing" aria-live="polite">
                <span className="ask-dot" />
                <span className="ask-dot" />
                <span className="ask-dot" />
                <span className="sr-only">Thinking</span>
              </p>
            )}

            {messages.length === 0 && !pending && (
              <div className="ask-suggestions">
                {SUGGESTIONS.map((s) => (
                  <button key={s} type="button" className="ask-chip" onClick={() => send(s)}>
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form
            className="ask-form"
            onSubmit={(e) => {
              e.preventDefault();
              send(draft);
            }}
          >
            <input
              ref={inputRef}
              className="ask-input"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Ask something..."
              maxLength={800}
              aria-label="Ask a question about Anbar"
              disabled={pending}
            />
            <button
              type="submit"
              className="ask-send"
              disabled={pending || !draft.trim()}
              aria-label="Send"
            >
              {"→"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
