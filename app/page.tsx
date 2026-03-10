"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Navbar from "./components/Navbar";
import ChatBox from "./components/ChatBox";

function ThreeBackground() {
  const mountRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let animId: number;
    const el = mountRef.current;
    if (!el) return;
    const THREE = (window as any).THREE;
    if (!THREE) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, el.clientWidth / el.clientHeight, 0.1, 1000);
    camera.position.z = 5;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(el.clientWidth, el.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    el.appendChild(renderer.domElement);
    const count = 2000;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i*3]   = (Math.random()-0.5)*22;
      pos[i*3+1] = (Math.random()-0.5)*22;
      pos[i*3+2] = (Math.random()-0.5)*14;
      const t = Math.random();
      col[i*3]   = 0.78 + t*0.22;
      col[i*3+1] = t*0.62;
      col[i*3+2] = 0.04;
    }
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("color",    new THREE.BufferAttribute(col, 3));
    const mat = new THREE.PointsMaterial({ size: 0.06, vertexColors: true, transparent: true, opacity: 0.88, sizeAttenuation: true });
    const points = new THREE.Points(geo, mat);
    scene.add(points);
    const onResize = () => {
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(el.clientWidth, el.clientHeight);
    };
    window.addEventListener("resize", onResize);
    let t = 0;
    const animate = () => {
      t += 0.0005;
      points.rotation.y = t * 0.35;
      points.rotation.x = Math.sin(t*0.7) * 0.12;
      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };
    animate();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);
  return (
    <div ref={mountRef} style={{
      position:"absolute", inset:0, zIndex:0,
      background:"linear-gradient(160deg,#3D0A07 0%,#6B1410 45%,#1A0504 100%)",
    }}/>
  );
}

function HeroBackground() {
  const [videoFailed, setVideoFailed] = useState(false);
  const [threeReady, setThreeReady]   = useState(false);
  useEffect(() => {
    if ((window as any).THREE) { setThreeReady(true); return; }
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
    s.onload = () => setThreeReady(true);
    document.head.appendChild(s);
  }, []);

  if (!videoFailed) {
    return (
      <video autoPlay muted loop playsInline
        onError={() => setVideoFailed(true)}
        style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", zIndex:0 }}
      >
        <source src="/hero.mp4" type="video/mp4" onError={() => setVideoFailed(true)} />
      </video>
    );
  }
  if (threeReady) return <ThreeBackground />;
  return <div style={{ position:"absolute", inset:0, zIndex:0, background:"linear-gradient(160deg,#3D0A07,#6B1410,#1A0504)" }}/>;
}


const MILESTONES = [
  {
    year: "1986",
    title: "Đại hội Đảng lần VI",
    sub: "Khởi xướng Đổi Mới",
    desc: "Tháng 12/1986, Đại hội VI chính thức mở ra công cuộc đổi mới toàn diện với tinh thần nhìn thẳng vào sự thật, đánh giá đúng thực trạng đất nước.",
    accent: "#B5261E",
  },
  {
    year: "1987",
    title: "Luật Đầu tư nước ngoài",
    sub: "Mở cửa kinh tế",
    desc: "Luật Đầu tư nước ngoài đầu tiên được ban hành, tạo nền tảng pháp lý thu hút vốn FDI, công nghệ và kỹ năng quản lý hiện đại.",
    accent: "#D4982A",
  },
  {
    year: "1988",
    title: "Khoán 10",
    sub: "Giải phóng nông nghiệp",
    desc: "Nghị quyết 10 giao quyền sử dụng đất lâu dài cho hộ nông dân. Việt Nam chuyển từ thiếu lương thực sang xuất khẩu gạo trong vòng một năm.",
    accent: "#1B5E35",
  },
  {
    year: "1989",
    title: "Rút quân khỏi Campuchia",
    sub: "Bình thường hóa quan hệ",
    desc: "Hoàn thành rút toàn bộ quân tình nguyện, mở đường bình thường hóa quan hệ với ASEAN, phương Tây và Trung Quốc.",
    accent: "#132D52",
  },
  {
    year: "1991",
    title: "Đại hội Đảng lần VII",
    sub: "Hoàn thiện đường lối",
    desc: "Đại hội VII thông qua Cương lĩnh xây dựng đất nước — văn kiện nền tảng định hướng con đường phát triển lâu dài của dân tộc.",
    accent: "#B5261E",
  },
];

const STATS = [
  { num: "1,4 triệu tấn", label: "Gạo xuất khẩu mỗi năm", note: "Từ thiếu đói đến xuất khẩu (1989)" },
  { num: "~6%",           label: "Tăng trưởng GDP bình quân", note: "Giai đoạn 1987–1991" },
  { num: "200+",          label: "Dự án FDI được cấp phép", note: "Sau Luật Đầu tư nước ngoài 1987" },
  { num: "5 năm",         label: "Từ khủng hoảng đến ổn định", note: "Thành quả giai đoạn Đổi Mới đầu tiên" },
];

const NAV_LINKS = [
  { href: "/",         label: "Trang Chủ" },
  { href: "/noi-dung", label: "Nội Dung"  },
  { href: "/tro-choi", label: "Trò Chơi"  },
  { href: "/hoi-dap",  label: "Hỏi Đáp"   },
];

export default function Home() {
  const [chat, setChat] = useState(false);

  return (
    <div style={{ fontFamily: "'Be Vietnam Pro', sans-serif", background: "#F8F1E0" }}>
      <Navbar />

      {/* ═══════════════════════════════════════ HERO FULLSCREEN ═══ */}
      <section style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        minHeight: 600,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        {/* Video nền hoặc 3D particles */}
        <HeroBackground />

        {/* Gradient overlay */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 1,
          background: `
            linear-gradient(
              160deg,
              rgba(90,12,8,0.88) 0%,
              rgba(140,30,22,0.78) 40%,
              rgba(30,8,4,0.72) 100%
            )
          `,
        }} />

        {/* Họa tiết lưới mờ */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 1, opacity: 0.04,
          backgroundImage: "linear-gradient(rgba(212,152,42,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(212,152,42,0.8) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />

        {/* Nội dung hero */}
        <div style={{
          position: "relative", zIndex: 2,
          textAlign: "center", padding: "0 24px",
          maxWidth: 860,
        }}>
          {/* Nhãn trên */}
          <p className="anim-up" style={{
            fontWeight: 500, fontSize: "0.78rem",
            color: "rgba(240,188,74,0.85)",
            letterSpacing: "0.3em", textTransform: "uppercase",
            marginBottom: 24,
          }}>
            Lịch Sử Đảng Cộng Sản Việt Nam
          </p>

          {/* Tiêu đề lớn */}
          <h1 className="anim-up-2" style={{
            fontWeight: 900,
            fontSize: "clamp(3rem, 9vw, 7rem)",
            lineHeight: 1.02,
            color: "#FFFFFF",
            letterSpacing: "-0.02em",
            textShadow: "0 6px 40px rgba(0,0,0,0.5)",
            marginBottom: 10,
          }}>
            Thời Kỳ
          </h1>
          <h1 className="anim-up-2" style={{
            fontWeight: 900,
            fontSize: "clamp(3rem, 9vw, 7rem)",
            lineHeight: 1.02,
            color: "#F0BC4A",
            letterSpacing: "-0.02em",
            textShadow: "0 6px 40px rgba(0,0,0,0.4)",
            marginBottom: 28,
          }}>
            Đổi Mới
          </h1>

          {/* Năm */}
          <p className="anim-up-3" style={{
            fontWeight: 300,
            fontSize: "clamp(1.2rem, 3vw, 1.8rem)",
            color: "rgba(255,255,255,0.65)",
            letterSpacing: "0.3em",
            marginBottom: 20,
          }}>
            1986 — 1991
          </p>

          {/* Đường kẻ vàng */}
          <div className="anim-up-3" style={{
            width: 60, height: 2, background: "#D4982A",
            margin: "0 auto 24px", borderRadius: 1,
          }} />

          {/* Mô tả */}
          <p className="anim-up-3" style={{
            fontWeight: 400,
            fontSize: "clamp(0.95rem, 2vw, 1.1rem)",
            color: "rgba(255,255,255,0.72)",
            lineHeight: 1.85, maxWidth: 560, margin: "0 auto 44px",
          }}>
            Giai đoạn bản lề trong lịch sử dân tộc — Đảng khởi xướng công cuộc
            đổi mới toàn diện, đưa đất nước thoát khỏi khủng hoảng, hội nhập thế giới.
          </p>

          {/* Nút CTA */}
          <div className="anim-up-4" style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/noi-dung" style={{
              fontWeight: 700, fontSize: "0.95rem",
              background: "#D4982A", color: "#4A0E08",
              padding: "15px 36px", borderRadius: 4,
              textDecoration: "none",
              boxShadow: "0 8px 28px rgba(0,0,0,0.35)",
              letterSpacing: "0.02em",
            }}>
              Khám Phá Nội Dung
            </Link>
            <Link href="/tro-choi" style={{
              fontWeight: 600, fontSize: "0.95rem",
              background: "transparent", color: "white",
              padding: "15px 36px", borderRadius: 4,
              textDecoration: "none",
              border: "1.5px solid rgba(255,255,255,0.35)",
              backdropFilter: "blur(8px)",
              letterSpacing: "0.02em",
            }}>
              Trò Chơi Lịch Sử
            </Link>
          </div>
        </div>

        {/* Mũi tên cuộn xuống */}
        <div style={{
          position: "absolute", bottom: 32, left: "50%",
          transform: "translateX(-50%)", zIndex: 2, textAlign: "center",
          animation: "bounce-down 2.2s ease-in-out infinite",
        }}>
          <p style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.4)", letterSpacing: "0.15em", marginBottom: 6 }}>
            CUỘN XUỐNG
          </p>
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "1.2rem" }}>↓</div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ THỐNG KÊ ═══ */}
      <section style={{ background: "#7A1710", padding: "64px 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
            gap: 2,
          }}>
            {STATS.map((s, i) => (
              <div key={i} style={{
                textAlign: "center", padding: "32px 24px",
                borderRight: i < STATS.length - 1 ? "1px solid rgba(255,255,255,0.1)" : "none",
              }}>
                <div style={{ fontWeight: 900, fontSize: "2.2rem", color: "#F0BC4A", lineHeight: 1.1, marginBottom: 8 }}>
                  {s.num}
                </div>
                <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "#F8F1E0", marginBottom: 5 }}>
                  {s.label}
                </div>
                <div style={{ fontWeight: 400, fontSize: "0.75rem", color: "rgba(248,241,224,0.5)" }}>
                  {s.note}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ DÒNG THỜI GIAN ═══ */}
      <section style={{ padding: "96px 0", background: "#F8F1E0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px" }}>

          {/* Tiêu đề */}
          <div style={{ textAlign: "center", marginBottom: 72 }}>
            <p style={{
              fontWeight: 600, fontSize: "0.72rem",
              color: "#B5261E", letterSpacing: "0.25em",
              textTransform: "uppercase", marginBottom: 14,
            }}>Hành Trình Lịch Sử</p>
            <h2 style={{
              fontWeight: 800,
              fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
              color: "#1C1008", lineHeight: 1.15,
            }}>
              Dòng Thời Gian Đổi Mới
            </h2>
            <div style={{
              width: 48, height: 3, background: "#D4982A",
              margin: "20px auto 0", borderRadius: 2,
            }} />
          </div>

          {/* Timeline */}
          <div style={{ position: "relative" }}>
            {/* Đường dọc */}
            <div style={{
              position: "absolute", left: "50%", top: 0, bottom: 0,
              width: 1, background: "linear-gradient(to bottom, transparent, #D4982A 10%, #D4982A 90%, transparent)",
              transform: "translateX(-50%)",
            }} className="hidden md:block" />

            <div style={{ display: "flex", flexDirection: "column", gap: 64 }}>
              {MILESTONES.map((m, i) => (
                <div key={i} style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 0,
                  alignItems: "center",
                }} className="tl-row">
                  {/* Nội dung trái/phải */}
                  <div style={{
                    order: i % 2 === 0 ? 1 : 2,
                    padding: i % 2 === 0 ? "0 56px 0 0" : "0 0 0 56px",
                    textAlign: i % 2 === 0 ? "right" : "left",
                  }} className="tl-txt">
                    <div style={{
                      display: "inline-block",
                      fontWeight: 900, fontSize: "0.72rem",
                      color: m.accent, letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      borderBottom: `2px solid ${m.accent}`,
                      paddingBottom: 4, marginBottom: 10,
                    }}>{m.year}</div>
                    <h3 style={{
                      fontWeight: 800, fontSize: "1.3rem",
                      color: "#1C1008", lineHeight: 1.25, marginBottom: 4,
                    }}>{m.title}</h3>
                    <p style={{
                      fontWeight: 600, fontSize: "0.82rem",
                      color: m.accent, marginBottom: 12,
                      textTransform: "uppercase", letterSpacing: "0.05em",
                    }}>{m.sub}</p>
                    <p style={{ fontWeight: 400, fontSize: "0.93rem", color: "#5A4A30", lineHeight: 1.8 }}>
                      {m.desc}
                    </p>
                  </div>

                  {/* Điểm giữa */}
                  <div style={{
                    order: i % 2 === 0 ? 2 : 1,
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    paddingLeft: i % 2 === 0 ? 56 : undefined,
                    paddingRight: i % 2 === 1 ? 56 : undefined,
                  }} className="tl-right">
                    {/* Chấm dòng thời gian */}
                    <div style={{
                      position: "absolute",
                      [i % 2 === 0 ? "left" : "right"]: -1,
                      width: 14, height: 14, borderRadius: "50%",
                      background: m.accent,
                      border: "3px solid #F8F1E0",
                      boxShadow: `0 0 0 4px ${m.accent}40`,
                      zIndex: 2,
                    }} className="tl-dot" />

                    {/* Card thông tin */}
                    <div className="card-hover" style={{
                      background: "white",
                      borderRadius: 12,
                      padding: "28px",
                      borderLeft: `4px solid ${m.accent}`,
                      boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
                      width: "100%",
                    }}>
                      <div style={{
                        fontWeight: 900, fontSize: "3rem",
                        color: m.accent, opacity: 0.12,
                        lineHeight: 1, marginBottom: -12,
                      }}>{m.year}</div>
                      <div style={{ fontWeight: 700, fontSize: "0.88rem", color: m.accent }}>
                        {m.sub}
                      </div>
                      <Link href="/noi-dung" style={{
                        display: "inline-block", marginTop: 14,
                        fontWeight: 700, fontSize: "0.82rem",
                        color: m.accent, textDecoration: "none",
                        borderBottom: `1px solid ${m.accent}`,
                        paddingBottom: 1,
                      }}>Đọc thêm</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ KHÁM PHÁ ═══ */}
      <section style={{ background: "#EDE0C4", padding: "80px 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <h2 style={{
              fontWeight: 800, fontSize: "clamp(1.5rem, 3.5vw, 2.2rem)",
              color: "#1C1008",
            }}>Khám Phá Thêm</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {[
              {
                href: "/noi-dung",
                title: "Nội Dung Học Thuật",
                desc: "Giáo trình lịch sử Đảng giai đoạn Đổi Mới 1986–1991 theo chương trình chính thức.",
                accent: "#B5261E",
              },
              {
                href: "/tro-choi",
                title: "Trò Chơi Lịch Sử",
                desc: "Trắc nghiệm và điền vào chỗ trống — phương pháp học tương tác, ghi nhớ hiệu quả.",
                accent: "#1B5E35",
              },
              {
                href: "/hoi-dap",
                title: "Hỏi Đáp Trí Tuệ Nhân Tạo",
                desc: "Đặt câu hỏi về lịch sử Đảng giai đoạn này, nhận giải đáp chi tiết từ AI ngay lập tức.",
                accent: "#132D52",
              },
            ].map((c, i) => (
              <Link key={i} href={c.href} style={{ textDecoration: "none" }}>
                <div className="card-hover" style={{
                  background: "white", borderRadius: 12,
                  padding: "40px 32px", height: "100%",
                  borderTop: `3px solid ${c.accent}`,
                }}>
                  <div style={{
                    fontWeight: 900, fontSize: "0.65rem",
                    color: c.accent, letterSpacing: "0.2em",
                    textTransform: "uppercase", marginBottom: 16,
                  }}>Tính năng</div>
                  <h3 style={{
                    fontWeight: 800, fontSize: "1.15rem",
                    color: "#1C1008", lineHeight: 1.3, marginBottom: 12,
                  }}>{c.title}</h3>
                  <p style={{ fontWeight: 400, fontSize: "0.9rem", color: "#7A6A54", lineHeight: 1.75 }}>
                    {c.desc}
                  </p>
                  <div style={{
                    marginTop: 24, fontWeight: 700, fontSize: "0.85rem",
                    color: c.accent,
                  }}>Vào ngay →</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ FOOTER ═══ */}
      <footer style={{ background: "#1C1008", padding: "56px 0 36px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px", textAlign: "center" }}>
          <div style={{ fontWeight: 900, fontSize: "1.1rem", color: "#D4982A", marginBottom: 6, letterSpacing: "0.05em" }}>
            LỊCH SỬ ĐẢNG CỘNG SẢN VIỆT NAM
          </div>
          <p style={{ fontWeight: 400, color: "#5A4A30", fontSize: "0.82rem", marginBottom: 28 }}>
            Giai đoạn Đổi Mới 1986–1991 · Tài liệu học tập môn Lịch sử Đảng
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 36, flexWrap: "wrap", marginBottom: 32 }}>
            {NAV_LINKS.map(l => (
              <Link key={l.href} href={l.href} style={{
                fontWeight: 500, fontSize: "0.85rem",
                color: "#7A6A54", textDecoration: "none",
              }}>{l.label}</Link>
            ))}
          </div>
          <div style={{ height: 1, background: "#2C1C08", marginBottom: 20 }} />
          <p style={{ fontWeight: 400, fontSize: "0.72rem", color: "#3A2A18" }}>
            Tài liệu học tập môn Lịch sử Đảng Cộng sản Việt Nam · Dành cho sinh viên đại học
          </p>
        </div>
      </footer>

      <style>{`
        @media (max-width: 768px) {
          .tl-row { grid-template-columns: 1fr !important; }
          .tl-txt { order: 2 !important; padding: 0 !important; text-align: left !important; }
          .tl-right { order: 1 !important; padding: 0 !important; }
          .tl-dot { display: none; }
        }
      `}</style>

      <ChatBox open={chat} onToggle={() => setChat(!chat)} />
    </div>
  );
}
