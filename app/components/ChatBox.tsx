"use client";
import { useState, useRef, useEffect } from "react";

interface Msg { role: "user" | "assistant"; content: string; }

export default function ChatBox({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  const [msgs, setMsgs] = useState<Msg[]>([{
    role: "assistant",
    content: "Xin chào! Tôi là trợ lý AI về Lịch sử Đảng giai đoạn 1986–1991. Bạn có thể hỏi tôi về Đổi Mới, Khoán 10, các Đại hội Đảng và nhiều chủ đề khác.",
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const text = input.trim();
    setInput("");
    setMsgs(p => [...p, { role: "user", content: text }]);
    setLoading(true);
    try {
      const r = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...msgs, { role: "user", content: text }] }),
      });
      const d = await r.json();
      setMsgs(p => [...p, { role: "assistant", content: d.content }]);
    } catch {
      setMsgs(p => [...p, { role: "assistant", content: "Có lỗi xảy ra. Vui lòng thử lại." }]);
    }
    setLoading(false);
  };

  const F = { fontFamily: "'Be Vietnam Pro', sans-serif" };

  return (
    <>
      <button onClick={onToggle} style={{
        position: "fixed", bottom: 24, right: 24, zIndex: 50,
        width: 52, height: 52, borderRadius: 4,
        background: open ? "#3A2A18" : "#B5261E",
        color: "white", border: "none", cursor: "pointer",
        ...F, fontWeight: 700, fontSize: "0.82rem",
        boxShadow: "0 6px 24px rgba(0,0,0,0.3)",
        transition: "background 0.2s",
      }}>
        {open ? "✕" : "Hỏi"}
      </button>

      {open && (
        <div style={{
          position: "fixed", bottom: 86, right: 24, zIndex: 50,
          width: 340, maxWidth: "calc(100vw - 48px)",
          borderRadius: 12, overflow: "hidden",
          boxShadow: "0 12px 48px rgba(0,0,0,0.25)",
          display: "flex", flexDirection: "column",
          border: "1px solid #ddd5be",
        }}>
          <div style={{ background: "linear-gradient(to right, #6B1410, #B5261E)", padding: "14px 18px" }}>
            <div style={{ ...F, fontWeight: 700, fontSize: "0.95rem", color: "white" }}>
              Trợ Lý Lịch Sử
            </div>
            <div style={{ ...F, fontSize: "0.72rem", color: "rgba(255,255,255,0.55)" }}>
              Đảng CSVN · Giai đoạn 1986–1991
            </div>
          </div>

          <div style={{
            flex: 1, overflowY: "auto", padding: 14,
            background: "#F8F1E0", maxHeight: 320, minHeight: 240,
            display: "flex", flexDirection: "column", gap: 10,
          }}>
            {msgs.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                <div className={m.role === "user" ? "bbl-u" : "bbl-b"} style={F}>{m.content}</div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex" }}>
                <div className="bbl-b typing-dot"><span /><span /><span /></div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div style={{
            padding: "10px 12px", background: "white",
            borderTop: "1px solid #ddd5be",
            display: "flex", gap: 8,
          }}>
            <input value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              placeholder="Nhập câu hỏi..."
              disabled={loading}
              style={{
                ...F, flex: 1, border: "1.5px solid #ddd5be",
                borderRadius: 4, padding: "8px 12px",
                fontSize: "0.88rem", outline: "none",
                background: "#F8F1E0", color: "#1C1008",
              }}
            />
            <button onClick={send} disabled={loading || !input.trim()} style={{
              ...F, width: 36, height: 36, borderRadius: 4, border: "none",
              background: !input.trim() || loading ? "#ddd" : "#B5261E",
              color: "white", cursor: !input.trim() || loading ? "not-allowed" : "pointer",
              fontWeight: 700, fontSize: "0.85rem", flexShrink: 0,
            }}>→</button>
          </div>
        </div>
      )}
    </>
  );
}
