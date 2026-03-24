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
        <source src="/mln.mp4" type="video/mp4" onError={() => setVideoFailed(true)} />
      </video>
    );
  }
  if (threeReady) return <ThreeBackground />;
  return <div style={{ position:"absolute", inset:0, zIndex:0, background:"linear-gradient(160deg,#3D0A07,#6B1410,#1A0504)" }}/>;
}


const MILESTONES = [
  {
    year: "Đoàn kết là sức mạnh",
    title: "Đại đoàn kết",
    image: "/pictures/pic11a.png",
    desc: "Lấy cảm hứng từ tư tưởng đại đoàn kết dân tộc, thiết kế thể hiện sự gắn kết giữa các tầng lớp nhân dân trong cùng một mục tiêu chung. Trong bối cảnh thời kỳ quá độ, khi đất nước đối mặt với nhiều khó khăn về kinh tế và cơ cấu xã hội, tinh thần đoàn kết trở thành nền tảng để huy động sức mạnh tổng hợp. Mẫu sản phẩm không chỉ mang ý nghĩa lịch sử mà còn phản ánh một nguyên lý phát triển bền vững của Việt Nam.",
    accent: "#B5261E",
  },
  {
    year: "Sức mạnh dân tộc",
    title: "Sức mạnh dân tộc",
    image: "/pictures/pic12.png",
    desc: "Thiết kế tái hiện hình ảnh con người Việt Nam trong cả chiến đấu và lao động, biểu trưng cho sức mạnh nội sinh của dân tộc. Đây là nguồn lực quan trọng giúp Việt Nam lựa chọn con đường phát triển rút ngắn, không phụ thuộc hoàn toàn vào các yếu tố bên ngoài. Mẫu móc khóa thể hiện sự kết hợp giữa truyền thống lịch sử, ý chí tự cường và khả năng thích ứng – những yếu tố then chốt trong thời kỳ quá độ.",
    accent: "#D4982A",
  },
  {
    year: "Biểu tượng Đảng Cộng Sản Việt Nam",
    title: "Biểu tượng Đảng",
    image: "/pictures/pic13.png",
    desc: "Thiết kế khắc họa biểu tượng búa liềm – đại diện cho Đảng Cộng sản Việt Nam, lực lượng lãnh đạo toàn diện trong sự nghiệp cách mạng. Trong thời kỳ quá độ lên chủ nghĩa xã hội, vai trò của Đảng không chỉ định hướng chính trị mà còn dẫn dắt quá trình phát triển kinh tế, xã hội và văn hóa. Mẫu móc khóa này nhấn mạnh tính tất yếu của sự lãnh đạo tập trung, thống nhất, là yếu tố cốt lõi bảo đảm cho con đường phát triển rút ngắn của Việt Nam.",
    accent: "#1B5E35",
  },
  {
    year: "Đội quân tóc dài",
    title: "Lực lượng đấu tranh chính trị đặc biệt của phụ nữ miền Nam Việt Nam",
    image: "/pictures/pic14.png",
    desc: "Hình tượng “Đội quân tóc dài” đại diện cho vai trò của quần chúng nhân dân, đặc biệt là phụ nữ Việt Nam trong lịch sử cách mạng. Không chỉ tham gia chiến đấu, lực lượng này còn góp phần vào công tác hậu cần, chính trị và xã hội. Trong thời kỳ quá độ, vai trò của nhân dân tiếp tục được khẳng định như một chủ thể trung tâm của phát triển. Thiết kế mang ý nghĩa tôn vinh sự đóng góp toàn diện của con người trong tiến trình xây dựng đất nước.",
    accent: "#132D52",
  },
  {
    year: "Đường Trường Sơn 559",
    title: "Tuyến chi viện chiến lược huyết mạch từ miền Bắc vào miền Nam trong chiến tranh Việt Nam",
    image: "/pictures/pic15.png",
    desc: "Lấy cảm hứng từ tuyến đường Trường Sơn – hệ thống chi viện chiến lược trong kháng chiến, mẫu thiết kế thể hiện tinh thần bền bỉ, tự lực và tổ chức hiệu quả. Đây là minh chứng rõ nét cho khả năng huy động và phân bổ nguồn lực trong điều kiện khó khăn. Trong bối cảnh thời kỳ quá độ, tinh thần đó được chuyển hóa thành nền tảng cho việc xây dựng mô hình phát triển độc lập, sáng tạo và mang tính rút ngắn.",
    accent: "#B5261E",
  },
  {
    year: "Giải phóng 1975",
    title: "Ngày Giải phóng miền Nam, thống nhất đất nước",
    image: "/pictures/pic16.png",
    desc: "Thiết kế tái hiện hình ảnh biểu tượng của ngày 30/4/1975 – cột mốc lịch sử đánh dấu thắng lợi hoàn toàn của cuộc kháng chiến chống Mỹ và sự giải phóng miền Nam. Đây không chỉ là một chiến thắng quân sự, mà còn là bước ngoặt mang tính quyết định, tạo tiền đề để Việt Nam bước vào thời kỳ quá độ lên chủ nghĩa xã hội trong điều kiện hòa bình và thống nhất. Mẫu móc khóa thể hiện sự chuyển mình từ đấu tranh giải phóng sang xây dựng và phát triển đất nước, đồng thời phản ánh khát vọng độc lập, tự chủ và con đường phát triển rút ngắn của dân tộc.",
    accent: "#B5261E",
  },
];

const MILESTONE_MODEL_LINKS = [
  "https://www.pacdora.com/share?filter_url=ps5ou9m77i",
  "https://www.pacdora.com/share?filter_url=ps9uih6uct",
  "https://www.pacdora.com/share?filter_url=psyx9s2ew2",
  "https://www.pacdora.com/share?filter_url=ps4sf5034n",
  "https://www.pacdora.com/share?filter_url=psjewkogbq",
  "https://www.pacdora.com/share?filter_url=psvepsysk0",
];

const STATS = [
  { num: "8,02%", label: "Tăng trưởng GDP năm 2022", note: "Thuộc top đầu thế giới sau đại dịch" },
  { num: "16 FTA",           label: "Hiệp định thương mại tự do", note: "Hội nhập sâu rộng nhất khu vực Đông Nam Á" },
  { num: "Top 20",          label: "Nền kinh tế thương mại lớn nhất", note: "Sau hơn 35 năm Đổi Mới và hội nhập" },
  { num: "2045",         label: "Tầm nhìn phát triển", note: "Việt Nam trở thành nước phát triển, thu nhập cao" },
];

const NAV_LINKS = [
  { href: "/",         label: "Trang Chủ" },
  { href: "/noi-dung", label: "Nội Dung"  },
  { href: "/tro-choi", label: "Trò Chơi"  },
  { href: "/hoi-dap",  label: "Hỏi Đáp"   },
];

export default function Home() {
  const [chat, setChat] = useState(false);
  const timelineVantaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isCancelled = false;
    let vantaEffect: any;

    const loadScript = (src: string) =>
      new Promise<void>((resolve, reject) => {
        const existing = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement | null;
        if (existing) {
          if (existing.getAttribute("data-loaded") === "true") {
            resolve();
            return;
          }
          existing.addEventListener("load", () => resolve(), { once: true });
          existing.addEventListener("error", () => reject(new Error(`Failed to load script: ${src}`)), { once: true });
          return;
        }

        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = () => {
          script.setAttribute("data-loaded", "true");
          resolve();
        };
        script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
        document.head.appendChild(script);
      });

    const initVanta = async () => {
      try {
        if (!(window as any).THREE) {
          await loadScript("https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.min.js");
        }
        if (!(window as any).VANTA?.BIRDS) {
          await loadScript("https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.birds.min.js");
        }

        if (isCancelled || !timelineVantaRef.current || !(window as any).VANTA?.BIRDS) {
          return;
        }

        vantaEffect = (window as any).VANTA.BIRDS({
          el: timelineVantaRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200,
          minWidth: 200,
          scale: 1,
          scaleMobile: 1,
          backgroundColor: 0xf1f2ca,
          color1: 0xf90e0e,
          color2: 0xfff600,
        });
      } catch {
        // Keep the section readable even when external scripts are blocked.
      }
    };

    initVanta();

    return () => {
      isCancelled = true;
      if (vantaEffect && typeof vantaEffect.destroy === "function") {
        vantaEffect.destroy();
      }
    };
  }, []);

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
            CHỦ NGHĨA XÃ HỘI KHOA HỌC
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
            Việt Nam
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
            Thời kỳ Quá Độ
          </h1>

          {/* Năm */}
          <p className="anim-up-3" style={{
            fontWeight: 300,
            fontSize: "clamp(1.2rem, 3vw, 1.8rem)",
            color: "rgba(255,255,255,0.65)",
            letterSpacing: "0.3em",
            marginBottom: 20,
          }}>
            Đặc điểm - Con Đường - Rút ngắn
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
            Quá trình xây dựng chủ nghĩa xã hội bỏ qua chế độ tư bản chủ nghĩa — con đường tất yếu, khách quan và đầy thách thức mà Đảng Cộng sản Việt Nam đã kiên định lựa chọn.
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
          position: "absolute", bottom: 32, left: 0, width: "100%",
          zIndex: 2, textAlign: "center",
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
      <section style={{ padding: "96px 0", background: "#F8F1E0", position: "relative", overflow: "hidden" }}>
        <div ref={timelineVantaRef} style={{ position: "absolute", inset: 0, zIndex: 0 }} />
        <div style={{ position: "absolute", inset: 0, zIndex: 1, background: "rgba(248, 241, 224, 0.88)" }} />
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px", position: "relative", zIndex: 2 }}>

          {/* Tiêu đề */}
          <div style={{ textAlign: "center", marginBottom: 72 }}>
            <p style={{
              fontWeight: 600, fontSize: "0.72rem",
              color: "#B5261E", letterSpacing: "0.25em",
              textTransform: "uppercase", marginBottom: 14,
            }}>Sản Phẩm Sáng Tạo</p>
            <h2 style={{
              fontWeight: 800,
              fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
              color: "#1C1008", lineHeight: 1.15,
            }}>
              Móc Khóa
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
                      color: "#1C1008", lineHeight: 1.25, marginBottom: 12,
                    }}>{m.title}</h3>
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
                      {m.image && (
                        <img
                          src={m.image}
                          alt={`${m.title} ${m.year}`}
                          style={{
                            width: "100%",
                            height: "clamp(140px, 30vh, 320px)",
                            objectFit: "cover",
                            borderRadius: 8,
                            marginBottom: 14,
                            display: "block",
                          }}
                        />
                      )}
                      <div style={{
                        fontWeight: 900, fontSize: "3rem",
                        color: m.accent, opacity: 0.12,
                        lineHeight: 1, marginBottom: -12,
                      }}>{m.year}</div>
                      <a
                        href={MILESTONE_MODEL_LINKS[i]}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 8,
                          marginTop: 16,
                          padding: "11px 18px",
                          fontWeight: 800,
                          fontSize: "0.84rem",
                          letterSpacing: "0.04em",
                          textTransform: "uppercase",
                          color: "#FFFFFF",
                          textDecoration: "none",
                          borderRadius: 10,
                          border: `1px solid ${m.accent}`,
                          background: `linear-gradient(135deg, ${m.accent}, #1C1008)`,
                          boxShadow: `0 10px 22px ${m.accent}45`,
                        }}
                      >
                        Xem mô hình 3D
                        <span style={{ fontSize: "1rem", lineHeight: 1 }}>↗</span>
                      </a>
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
                desc: "Việt Nam Trong Thời Kỳ Quá Độ: Đặc Điểm & Con Đường Phát Triển Rút Ngắn.",
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
                desc: "Đặt câu hỏi về thời kỳ quá độ lên CNXH của Việt Nam, nhận giải đáp chi tiết từ AI ngay lập tức.",
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
            CNXH KHOA HỌC
          </div>
          <p style={{ fontWeight: 400, color: "#5A4A30", fontSize: "0.82rem", marginBottom: 28 }}>
            Giai đoạn quá độ lên CNXH ở Việt Nam · Tài liệu học tập môn MLN131
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
            Tài liệu học tập môn MLN131 · Dành cho sinh viên đại học
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