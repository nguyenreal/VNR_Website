"use client";
import { useState, useRef, useEffect } from "react";
import Navbar from "../components/Navbar";

interface Msg { role: "user" | "assistant"; content: string; }

const SUGGESTED = [
  "Đổi Mới là gì? Tại sao Đảng phải đổi mới?",
  "Khoán 10 có tác động thế nào đến nông nghiệp?",
  "Đại hội VI diễn ra trong bối cảnh nào?",
  "Vì sao Việt Nam rút quân khỏi Campuchia năm 1989?",
  "Cương lĩnh 1991 có nội dung cốt lõi gì?",
];

export default function HoiDapPage() {
  const [msgs, setMsgs] = useState<Msg[]>([{
    role: "assistant",
    content: "Xin chào! Tôi là trợ lý AI chuyên về Lịch sử Đảng Cộng sản Việt Nam ",
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const F = { fontFamily: "'Be Vietnam Pro', sans-serif" };

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
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

  return (
    <div style={{ minHeight: "100vh", background: "#F8F1E0", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <div style={{ background: "linear-gradient(to right, #6B1410, #B5261E)", padding: "48px 0 40px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
          <p style={{ ...F, fontWeight: 600, fontSize: "0.72rem", color: "rgba(240,188,74,0.8)", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 12 }}>
            Trí Tuệ Nhân Tạo
          </p>
          <h1 style={{ ...F, fontWeight: 900, fontSize: "clamp(1.8rem,5vw,2.8rem)", color: "white", lineHeight: 1.2 }}>
            Hỏi Đáp Lịch Sử
          </h1>
          <p style={{ ...F, color: "rgba(255,255,255,0.65)", fontSize: "0.95rem", marginTop: 10 }}>
            Đặt câu hỏi về Đảng và giai đoạn Đổi Mới 1986–1991
          </p>
        </div>
      </div>

      <div style={{ flex: 1, maxWidth: 760, width: "100%", margin: "0 auto", padding: "32px 24px", display: "flex", flexDirection: "column", gap: 20 }}>

        {/* Gợi ý câu hỏi */}
        {msgs.length <= 1 && (
          <div>
            <p style={{ ...F, fontWeight: 600, fontSize: "0.8rem", color: "#7A6A54", marginBottom: 10, letterSpacing: "0.05em" }}>
              GỢI Ý CÂU HỎI
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {SUGGESTED.map((s, i) => (
                <button key={i} onClick={() => send(s)} style={{
                  ...F, padding: "8px 16px", borderRadius: 4,
                  border: "1.5px solid #D4982A40", background: "white",
                  fontWeight: 500, fontSize: "0.83rem", color: "#5A4A30",
                  cursor: "pointer", textAlign: "left",
                  transition: "border-color 0.2s, background 0.2s",
                }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Khung chat */}
        <div style={{ flex: 1, background: "white", borderRadius: 12, overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.07)", display: "flex", flexDirection: "column", minHeight: 400 }}>
          <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: 14 }}>
            {msgs.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", gap: 10, alignItems: "flex-start" }}>
                {m.role === "assistant" && (
                  <div style={{ width: 30, height: 30, borderRadius: 4, background: "#B5261E", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ ...F, fontWeight: 800, fontSize: "0.65rem", color: "white" }}>AI</span>
                  </div>
                )}
                <div className={m.role === "user" ? "bbl-u" : "bbl-b"} style={F}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <div style={{ width: 30, height: 30, borderRadius: 4, background: "#B5261E", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ ...F, fontWeight: 800, fontSize: "0.65rem", color: "white" }}>AI</span>
                </div>
                <div className="bbl-b typing-dot"><span /><span /><span /></div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Input */}
          <div style={{ borderTop: "1px solid #EDE0C4", padding: "14px 16px", display: "flex", gap: 10 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send(input)}
              placeholder="Đặt câu hỏi về lịch sử Đổi Mới..."
              disabled={loading}
              style={{
                ...F, flex: 1, border: "1.5px solid #ddd5be",
                borderRadius: 4, padding: "10px 14px",
                fontSize: "0.92rem", outline: "none",
                background: "#F8F1E0", color: "#1C1008",
              }}
            />
            <button
              onClick={() => send(input)}
              disabled={loading || !input.trim()}
              style={{
                ...F, padding: "10px 22px", borderRadius: 4, border: "none",
                background: !input.trim() || loading ? "#ddd" : "#B5261E",
                color: "white", fontWeight: 700, fontSize: "0.9rem",
                cursor: !input.trim() || loading ? "not-allowed" : "pointer",
                flexShrink: 0,
              }}
            >
              Gửi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
