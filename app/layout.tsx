import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lịch Sử Đảng Việt Nam 1986–1991 | Thời Kỳ Đổi Mới",
  description: "Tìm hiểu lịch sử Đảng Cộng sản Việt Nam giai đoạn Đổi Mới 1986–1991 qua nội dung phong phú, trò chơi tương tác và hỏi đáp AI.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Crimson+Pro:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet" />
      </head>
      <body style={{ fontFamily: "'Crimson Pro', Georgia, serif" }}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
