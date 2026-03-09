import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `Bạn là trợ lý AI chuyên về Lịch sử Đảng Cộng sản Việt Nam giai đoạn 1986–1991 (thời kỳ Đổi Mới).

Nhiệm vụ của bạn là giải đáp các câu hỏi về Lịch sử Đảng Cộng sản Việt Nam

Quy tắc trả lời:
- Trả lời bằng tiếng Việt, rõ ràng, học thuật nhưng dễ hiểu
- Dựa trên giáo trình Lịch sử Đảng Cộng sản Việt Nam chính thống
- Giải thích ý nghĩa lịch sử, không chỉ liệt kê sự kiện
- Nếu câu hỏi không liên quan thì hãy bảo không hỗ trợ
- Câu trả lời vừa phải, khoảng 150-300 từ`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    // Khởi tạo client với API key rõ ràng từ biến môi trường
    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001", // Model ổn định, nhanh, rẻ
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role,
        content: m.content,
      })),
    });

    const content =
      response.content[0].type === "text" ? response.content[0].text : "";
    return NextResponse.json({ content });

  } catch (error: unknown) {
    // Log chi tiết lỗi để debug trên Vercel
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error("Chat API error:", errMsg);

    // Trả lỗi rõ ràng hơn cho client
    return NextResponse.json(
      { content: `Lỗi kết nối AI: ${errMsg}. Kiểm tra ANTHROPIC_API_KEY trên Vercel.` },
      { status: 500 }
    );
  }
}
