"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2, UtensilsCrossed, ShieldCheck, TrendingUp, BarChart3, Star, Lock, Zap } from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { Suspense } from "react";

/* ─────────── Data ─────────── */
const FEATURES = [
    { icon: UtensilsCrossed, title: "Dijital Menü", desc: "QR kodlu akıllı menü — sıfır baskı maliyeti", color: "#6366f1" },
    { icon: BarChart3, title: "Gelişmiş Analitik", desc: "Gerçek zamanlı gelir, sipariş ve müşteri takibi", color: "#8b5cf6" },
    { icon: ShieldCheck, title: "Güvenli & Kararlı", desc: "256-bit şifreleme + %99.9 SLA garantisi", color: "#06b6d4" },
    { icon: TrendingUp, title: "Gelir Artışı", desc: "Ortalama %32 daha fazla sipariş, daha az personel gideri", color: "#10b981" },
];

const TESTIMONIALS = [
    { name: "Kemal Yılmaz", role: "Kapadokya Steakhouse — İstanbul", avatar: "KY", text: "QRlamenü ile dijital menüye geçtikten sonra garson başına düşen sipariş **40% arttı**. Muhteşem bir sistem." },
    { name: "Selin Arslan", role: "Café Aroma — Ankara", avatar: "SA", text: "QR menü müşterilerimizin siparişe **3× daha hızlı** karar vermesini sağladı." },
    { name: "Emre Kaya", role: "Deniz Restaurant — İzmir", avatar: "EK", text: "Garson çağırma ve sipariş takibi özelliği gerçekten oyunu değiştirdi." },
];

/* ─────────── Floating Particle ─────────── */
function Particle({ delay, size, x, y, duration }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 0.6, 0], scale: [0, 1, 0], y: [0, -80, -160], x: [0, (Math.random() - 0.5) * 60, 0] }}
            transition={{ delay, duration, repeat: Infinity, repeatDelay: Math.random() * 4 + 2, ease: "easeInOut" }}
            style={{ position: "absolute", left: `${x}%`, top: `${y}%`, width: size, height: size, borderRadius: "50%", background: "rgba(99,102,241,0.6)", boxShadow: "0 0 10px rgba(99,102,241,0.8)", pointerEvents: "none", zIndex: 1 }}
        />
    );
}

/* ─────────── Dashboard Mini Mockup ─────────── */
function DashboardMockup() {
    const bars = [65, 80, 45, 90, 72, 88, 55, 95, 70, 85];
    return (
        <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px", padding: "20px", backdropFilter: "blur(10px)" }}>
            {/* Mockup header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <div>
                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 2px" }}>TOPLAM GELİR</p>
                    <p style={{ color: "white", fontWeight: "900", fontSize: "1.35rem", margin: 0 }}>₺ 84,320</p>
                </div>
                <div style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", color: "#10b981", padding: "5px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "800" }}>
                    ↑ +24.8%
                </div>
            </div>
            {/* Mini bar chart */}
            <div style={{ display: "flex", gap: "4px", alignItems: "flex-end", height: "52px", marginBottom: "12px" }}>
                {bars.map((h, i) => (
                    <motion.div key={i}
                        initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: i * 0.05, duration: 0.5, ease: "backOut" }}
                        style={{ flex: 1, background: i === 9 ? "#6366f1" : `rgba(99,102,241,${0.3 + (h / 100) * 0.4})`, borderRadius: "4px 4px 0 0", height: `${h}%`, transformOrigin: "bottom" }}
                    />
                ))}
            </div>
            {/* Stats row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                {[{ l: "Sipariş", v: "1,284", c: "#8b5cf6" }, { l: "Masa", v: "48", c: "#06b6d4" }, { l: "Mutlu Müşteri", v: "98%", c: "#10b981" }].map(s => (
                    <div key={s.l} style={{ background: "rgba(255,255,255,0.04)", borderRadius: "10px", padding: "10px 8px", textAlign: "center" }}>
                        <p style={{ color: s.c, fontWeight: "900", fontSize: "0.95rem", margin: "0 0 2px" }}>{s.v}</p>
                        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "9px", margin: 0 }}>{s.l}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ─────────── Main Form ─────────── */
function LoginForm() {
    const router = useRouter();
    const params = useSearchParams();
    const redirect = params.get("redirect") || "/dashboard";

    const [email, setEmail] = useState("demo@qrlamenu.com");
    const [password, setPassword] = useState("password123");
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [focused, setFocused] = useState<string | null>(null);
    const [testIdx, setTestIdx] = useState(0);
    const [featIdx, setFeatIdx] = useState(0);

    // Cursor-tracking glow on left panel
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const springX = useSpring(mouseX, { stiffness: 80, damping: 20 });
    const springY = useSpring(mouseY, { stiffness: 80, damping: 20 });
    const leftPanelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMouse = (e: MouseEvent) => {
            if (!leftPanelRef.current) return;
            const rect = leftPanelRef.current.getBoundingClientRect();
            mouseX.set(e.clientX - rect.left);
            mouseY.set(e.clientY - rect.top);
        };
        window.addEventListener("mousemove", handleMouse);
        return () => window.removeEventListener("mousemove", handleMouse);
    }, []);

    useEffect(() => {
        const iv1 = setInterval(() => setTestIdx(p => (p + 1) % TESTIMONIALS.length), 5000);
        const iv2 = setInterval(() => setFeatIdx(p => (p + 1) % FEATURES.length), 3000);
        return () => { clearInterval(iv1); clearInterval(iv2); };
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(""); setLoading(true);
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const contentType = res.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                const data = await res.json();
                if (res.ok) {
                    router.push(data.user?.role === "SUPER_ADMIN" ? "/super-admin" : redirect);
                } else {
                    setError(data.error || "E-posta veya şifre hatalı.");
                }
            } else {
                // JSON dönmediyse muhtemelen bir HTML hata sayfasıdır (500, 404, vb.)
                const text = await res.text();
                console.error("Non-JSON response:", text);
                setError(`Sunucu hatası (${res.status}): Beklenen yanıt alınamadı. Lütfen veritabanı bağlantılarını kontrol edin.`);
            }
        } catch (err: any) {
            console.error("Fetch Error:", err);
            setError(`Bağlantı hatası: ${err.message || 'Sunucuya ulaşılamıyor'}`);
        }
        finally { setLoading(false); }
    };

    const particles = Array.from({ length: 18 }, (_, i) => ({
        delay: i * 0.4, size: `${4 + (i % 4) * 3}px`,
        x: 5 + (i * 5.5) % 90, y: 10 + (i * 7.3) % 80, duration: 4 + (i % 5)
    }));

    return (
        <div style={{ minHeight: "100vh", display: "flex", fontFamily: "'Inter', -apple-system, sans-serif" }}>

            {/* ═══════════ LEFT PANEL ═══════════ */}
            <div ref={leftPanelRef} className="left-panel"
                style={{ flex: 1, background: "linear-gradient(145deg, #0a0a1a 0%, #12122e 40%, #0f172a 100%)", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "clamp(32px, 5vw, 52px)", position: "relative", overflow: "hidden" }}>

                {/* Cursor-following glow */}
                <motion.div style={{ position: "absolute", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.12), transparent 70%)", left: springX, top: springY, transform: "translate(-50%, -50%)", pointerEvents: "none", zIndex: 1 }} />

                {/* Static orbs */}
                <div style={{ position: "absolute", width: "450px", height: "450px", borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.08), transparent)", top: "-80px", right: "-80px", zIndex: 0 }} />
                <div style={{ position: "absolute", width: "300px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle, rgba(6,182,212,0.07), transparent)", bottom: "60px", left: "0", zIndex: 0 }} />

                {/* Grid */}
                <div style={{ position: "absolute", inset: 0, opacity: 0.025, backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "40px 40px", zIndex: 0 }} />

                {/* Floating particles */}
                {particles.map((p, i) => <Particle key={i} {...p} />)}

                {/* LOGO */}
                <div style={{ position: "relative", zIndex: 10, display: "flex", alignItems: "center", gap: "12px" }}>
                    <motion.div whileHover={{ rotate: 10 }} style={{ width: "42px", height: "42px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 20px rgba(99,102,241,0.4)" }}>
                        <UtensilsCrossed size={20} color="white" />
                    </motion.div>
                    <span style={{ color: "white", fontSize: "1.5rem", fontWeight: "900", letterSpacing: "-0.04em" }}>QRlamenü</span>
                    <span style={{ background: "rgba(99,102,241,0.2)", border: "1px solid rgba(99,102,241,0.4)", color: "#a5b4fc", fontSize: "9px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.12em", padding: "3px 8px", borderRadius: "20px" }}>Pro</span>
                </div>

                {/* CENTER CONTENT */}
                <div style={{ position: "relative", zIndex: 10 }}>
                    <h2 style={{ color: "white", fontWeight: "900", fontSize: "clamp(1.4rem, 2.5vw, 2rem)", letterSpacing: "-0.04em", margin: "0 0 10px", lineHeight: 1.2 }}>
                        Restoranınızı<br />
                        <span style={{ background: "linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>dijital çağa taşıyın.</span>
                    </h2>
                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.87rem", margin: "0 0 32px", lineHeight: 1.6 }}>
                        Türkiye'nin en hızlı büyüyen restoran yönetim platformu.
                    </p>

                    {/* Dashboard Mockup */}
                    <div style={{ marginBottom: "28px" }}><DashboardMockup /></div>

                    {/* Feature pills */}
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "28px" }}>
                        {FEATURES.map((f, i) => {
                            const Icon = f.icon;
                            const isActive = featIdx === i;
                            return (
                                <motion.div key={i} animate={{ background: isActive ? `${f.color}22` : "rgba(255,255,255,0.04)", borderColor: isActive ? `${f.color}55` : "rgba(255,255,255,0.08)" }}
                                    style={{ display: "flex", alignItems: "center", gap: "6px", padding: "7px 12px", borderRadius: "30px", border: "1px solid", cursor: "default" }}>
                                    <Icon size={12} color={isActive ? f.color : "rgba(255,255,255,0.3)"} />
                                    <span style={{ fontSize: "11px", fontWeight: "700", color: isActive ? "white" : "rgba(255,255,255,0.3)" }}>{f.title}</span>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Testimonial */}
                    <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "18px" }}>
                        <div style={{ display: "flex", gap: "4px", marginBottom: "10px" }}>
                            {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="#f59e0b" color="#f59e0b" />)}
                        </div>
                        <AnimatePresence mode="wait">
                            <motion.div key={testIdx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }}>
                                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.82rem", lineHeight: 1.6, margin: "0 0 12px", fontStyle: "italic" }}>
                                    "{TESTIMONIALS[testIdx].text.replace(/\*\*(.*?)\*\*/g, '$1')}"
                                </p>
                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: "900", color: "white" }}>
                                        {TESTIMONIALS[testIdx].avatar}
                                    </div>
                                    <div>
                                        <p style={{ color: "white", fontWeight: "700", fontSize: "0.78rem", margin: 0 }}>{TESTIMONIALS[testIdx].name}</p>
                                        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.7rem", margin: 0 }}>{TESTIMONIALS[testIdx].role}</p>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                        {/* Dots */}
                        <div style={{ display: "flex", gap: "5px", marginTop: "12px" }}>
                            {TESTIMONIALS.map((_, i) => (
                                <div key={i} style={{ width: i === testIdx ? "18px" : "5px", height: "5px", borderRadius: "3px", background: i === testIdx ? "#6366f1" : "rgba(255,255,255,0.15)", transition: "width 0.3s" }} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Stats bottom */}
                <div style={{ position: "relative", zIndex: 10, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                    {[{ v: "5K+", l: "Restoran" }, { v: "99.9%", l: "Uptime" }, { v: "32%", l: "↑ Gelir" }].map(s => (
                        <div key={s.l} style={{ textAlign: "center", padding: "14px 8px", background: "rgba(255,255,255,0.04)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.07)" }}>
                            <p style={{ color: "white", fontWeight: "900", fontSize: "1.1rem", margin: "0 0 2px" }}>{s.v}</p>
                            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.68rem", margin: 0, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.l}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ═══════════ RIGHT PANEL ═══════════ */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "clamp(24px, 5vw, 60px)", background: "#f8faff", minHeight: "100vh", overflowY: "auto" }}>
                <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    style={{ width: "100%", maxWidth: "420px" }}>

                    {/* Mobile Logo */}
                    <div className="mobile-logo" style={{ display: "none", alignItems: "center", gap: "10px", marginBottom: "40px" }}>
                        <div style={{ width: "36px", height: "36px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <UtensilsCrossed size={18} color="white" />
                        </div>
                        <span style={{ fontSize: "1.4rem", fontWeight: "900", letterSpacing: "-0.04em", color: "#0f172a" }}>QRlamenü</span>
                    </div>

                    {/* Heading */}
                    <div style={{ marginBottom: "28px" }}>
                        <h1 style={{ fontSize: "clamp(1.5rem, 3vw, 1.9rem)", fontWeight: "900", color: "#0f172a", margin: "0 0 8px", letterSpacing: "-0.04em" }}>
                            Tekrar hoş geldiniz 👋
                        </h1>
                        <p style={{ color: "#64748b", fontSize: "0.88rem", margin: 0, lineHeight: 1.5 }}>
                            Restoranınızı yönetmek için giriş yapın.
                        </p>
                    </div>

                    {/* Trust badges */}
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "24px" }}>
                        {[
                            { icon: Lock, text: "256-bit SSL", color: "#10b981" },
                            { icon: ShieldCheck, text: "Güvenli Giriş", color: "#6366f1" },
                            { icon: Zap, text: "Anında Erişim", color: "#f59e0b" },
                        ].map(b => {
                            const Icon = b.icon;
                            return (
                                <div key={b.text} style={{ display: "flex", alignItems: "center", gap: "5px", padding: "5px 10px", background: "white", border: "1px solid #e5e7eb", borderRadius: "20px", fontSize: "11px", fontWeight: "700", color: "#475569" }}>
                                    <Icon size={11} color={b.color} />{b.text}
                                </div>
                            );
                        })}
                    </div>

                    {/* Error */}
                    <AnimatePresence>
                        {error && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                                style={{ padding: "12px 16px", background: "#fef2f2", borderRadius: "12px", border: "1px solid #fecaca", color: "#dc2626", fontSize: "0.85rem", fontWeight: "600", marginBottom: "16px", overflow: "hidden" }}>
                                ⚠️ {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Form Card */}
                    <div style={{ background: "white", borderRadius: "24px", padding: "28px", boxShadow: "0 4px 24px rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.05)", marginBottom: "20px" }}>
                        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                            {/* Email */}
                            <div>
                                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "700", color: "#374151", marginBottom: "7px", letterSpacing: "0.01em" }}>
                                    E-posta Adresi
                                </label>
                                <motion.div animate={{ boxShadow: focused === "email" ? "0 0 0 3px rgba(99,102,241,0.15)" : "none" }}
                                    style={{ borderRadius: "14px", background: focused === "email" ? "white" : "#f8fafc", border: `1.5px solid ${focused === "email" ? "#6366f1" : "#e5e7eb"}`, transition: "border-color 0.2s, background 0.2s", overflow: "hidden" }}>
                                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email"
                                        onFocus={() => setFocused("email")} onBlur={() => setFocused(null)}
                                        placeholder="ornek@restoran.com"
                                        style={{ width: "100%", padding: "13px 16px", border: "none", background: "transparent", fontSize: "0.92rem", outline: "none", color: "#0f172a", boxSizing: "border-box" }} />
                                </motion.div>
                            </div>

                            {/* Password */}
                            <div>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "7px" }}>
                                    <label style={{ fontSize: "0.8rem", fontWeight: "700", color: "#374151", letterSpacing: "0.01em" }}>Şifre</label>
                                    <a href="#" style={{ fontSize: "0.78rem", color: "#6366f1", fontWeight: "700", textDecoration: "none" }}>Unuttum?</a>
                                </div>
                                <motion.div animate={{ boxShadow: focused === "password" ? "0 0 0 3px rgba(99,102,241,0.15)" : "none" }}
                                    style={{ borderRadius: "14px", background: focused === "password" ? "white" : "#f8fafc", border: `1.5px solid ${focused === "password" ? "#6366f1" : "#e5e7eb"}`, transition: "border-color 0.2s, background 0.2s", overflow: "hidden", display: "flex", alignItems: "center" }}>
                                    <input type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required
                                        onFocus={() => setFocused("password")} onBlur={() => setFocused(null)}
                                        placeholder="••••••••"
                                        style={{ flex: 1, padding: "13px 12px 13px 16px", border: "none", background: "transparent", fontSize: "0.92rem", outline: "none", color: "#0f172a", minWidth: 0 }} />
                                    <button type="button" onClick={() => setShowPass(s => !s)}
                                        style={{ padding: "0 14px", background: "none", border: "none", cursor: "pointer", color: "#9ca3af", display: "flex", alignItems: "center" }}>
                                        {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                                    </button>
                                </motion.div>
                            </div>

                            {/* Submit */}
                            <motion.button type="submit" disabled={loading}
                                whileHover={{ scale: 1.01, boxShadow: "0 12px 28px rgba(99,102,241,0.45)" }}
                                whileTap={{ scale: 0.98 }}
                                style={{ padding: "14px 20px", borderRadius: "14px", border: "none", background: loading ? "#c7d2fe" : "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)", color: "white", fontWeight: "900", fontSize: "0.95rem", cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", boxShadow: "0 8px 20px rgba(99,102,241,0.3)", transition: "background 0.2s", marginTop: "4px", letterSpacing: "0.01em" }}>
                                {loading ? (
                                    <><Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> Giriş Yapılıyor...</>
                                ) : (
                                    <><span>Giriş Yap</span><span style={{ fontSize: "1.1em" }}>→</span></>
                                )}
                            </motion.button>
                        </form>
                    </div>

                    {/* Contact CTA */}
                    <div style={{ textAlign: "center", padding: "18px 20px", background: "white", borderRadius: "18px", border: "1px solid #e5e7eb", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                        <p style={{ margin: "0 0 6px", fontSize: "0.82rem", color: "#94a3b8" }}>Henüz hesabınız yok mu?</p>
                        <a href="/iletisim" style={{ color: "#6366f1", fontWeight: "800", fontSize: "0.88rem", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                            Müşteri temsilcisiyle iletişime geç <span>→</span>
                        </a>
                    </div>

                    {/* Footer */}
                    <p style={{ textAlign: "center", fontSize: "0.7rem", color: "#cbd5e1", marginTop: "24px" }}>
                        © 2025 QRlamenü &nbsp;·&nbsp;
                        <a href="#" style={{ color: "#cbd5e1", textDecoration: "none" }}>Gizlilik Politikası</a>
                        &nbsp;·&nbsp;
                        <a href="#" style={{ color: "#cbd5e1", textDecoration: "none" }}>Kullanım Koşulları</a>
                    </p>
                </motion.div>
            </div>

            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                * { -webkit-font-smoothing: antialiased; box-sizing: border-box; }
                .left-panel { display: flex !important; }
                .mobile-logo { display: none !important; }
                @media (max-width: 1024px) {
                    .left-panel { display: none !important; }
                    .mobile-logo { display: flex !important; }
                }
            `}</style>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8faff" }}>
                <Loader2 size={30} color="#6366f1" style={{ animation: "spin 1s linear infinite" }} />
                <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
            </div>
        }>
            <LoginForm />
        </Suspense>
    );
}
