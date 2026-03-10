import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `Bạn là trợ lý AI chuyên về Lịch sử Đảng Cộng sản Việt Nam .

Trả lời các câu hỏi về

QUY TẮC QUAN TRỌNG:
- Trả lời bằng tiếng Việt, rõ ràng, dễ hiểu
- KHÔNG dùng markdown: không dùng **, không dùng ###, không dùng * để liệt kê
- Khi cần liệt kê, dùng dấu gạch ngang — hoặc số thứ tự 1. 2. 3.
- Câu trả lời NGẮN GỌN: tối đa 150 từ
- Viết thành đoạn văn tự nhiên, không chia header
- Dựa trên giáo trình Lịch sử Đảng Cộng sản Việt Nam chính thống`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ content: "Lỗi: Chưa cấu hình GEMINI_API_KEY." }, { status: 500 });
    }

    const geminiContents = messages.map((m: { role: string; content: string }, idx: number) => {
      let text = m.content;
      if (idx === 0 && m.role === "user") {
        text = `${SYSTEM_PROMPT}\n\n---\n\n${m.content}`;
      }
      return {
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text }],
      };
    });

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: geminiContents,
          generationConfig: { maxOutputTokens: 2048, temperature: 0.6 },
        }),
      }
    );

    if (!res.ok) {
      const err = await res.json();
      return NextResponse.json({ content: `Lỗi: ${err?.error?.message || res.statusText}` }, { status: 500 });
    }

    const data = await res.json();
    let content = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Xin lỗi, không có phản hồi.";

    // Xóa markdown còn sót lại
    content = content
      .replace(/\*\*(.+?)\*\*/g, "$1")   // bold
      .replace(/\*(.+?)\*/g, "$1")         // italic
      .replace(/#{1,6}\s+/g, "")           // headers
      .replace(/^\s*\*\s+/gm, "— ")        // bullet * → —
      .trim();

    return NextResponse.json({ content });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ content: `Lỗi server: ${msg}` }, { status: 500 });
  }
}
