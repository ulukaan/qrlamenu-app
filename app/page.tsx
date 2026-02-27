"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
    ArrowRight, UtensilsCrossed, QrCode, BarChart3, ShieldCheck,
    Bell, TrendingUp, Star, CheckCircle2, Check,
    Globe, Smartphone, Users, Truck, Menu, X, ChevronRight
} from "lucide-react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";

/* ── Data ─────────────────────────────────────── */
const NAV_LINKS = [
    { href: "#ozellikler", label: "Özellikler" },
    { href: "#nasil-calisir", label: "Nasıl Çalışır" },
    { href: "#fiyatlar", label: "Fiyatlandırma" },
    { href: "#yorumlar", label: "Yorumlar" },
];

const FEATURES = [
    { icon: QrCode, title: "QR Dijital Menü", desc: "Sıfır baskı maliyeti. Müşteriler saniyeler içinde menüye erişir ve sipariş verir." },
    { icon: Bell, title: "Anında Bildirim", desc: "Siparişler eşzamanlı olarak mutfak ve garson ekranlarına düşer. Gecikme yok." },
    { icon: BarChart3, title: "Detaylı Analitik", desc: "Zirve saatler, restoran performansı ve en çok satan ürünler gerçek zamanlı raporlanır." },
    { icon: Truck, title: "Çoklu Sipariş Tipi", desc: "Masada, pakette, odada veya gel-al servis modellerinin tümü tek bir ekranda." },
    { icon: Users, title: "Ekip Yönetimi", desc: "Detaylı yetkilendirme ve vardiya takibi ile restoran personelinizi kolayca yönetin." },
    { icon: ShieldCheck, title: "Yüksek Güvenlik", desc: "Tamamen KVKK uyumlu altyapı, düzenli yedeklemeler ve kurum seviyesinde şifreleme." },
];

const PRICING = [
    {
        name: "Başlangıç", price: "₺590", period: "/ay",
        desc: "Butik kafe & tek şube için dijital menüye geçiş.",
        features: ["QR Menü (Mobil Optimize)", "Sınırsız Ürün Ekleme", "Masa Bazlı Sipariş Takibi", "Günlük Ciro Özeti", "1 Kullanıcı"],
        cta: "Ücretsiz Dene", highlight: false
    },
    {
        name: "Profesyonel", price: "₺1.290", period: "/ay",
        desc: "Büyüyen restoranlar için operasyonel kontrol seti.",
        features: ["Tüm Başlangıç Özellikleri", "Garson Çağrı Sistemi", "Analizler & Kampanyalar", "6+ Premium Tema", "5 Kullanıcı"],
        cta: "Hemen Başla", highlight: true
    },
    {
        name: "Growth+", price: "₺1.990", period: "/ay",
        desc: "Yoğun çalışan işletmeler için.",
        features: ["Stok Takibi", "Çoklu Kasa Raporu", "POS Entegrasyon Altyapısı", "Rol Bazlı Yetkilendirme", "Öncelikli Destek"],
        cta: "Bize Ulaşın", highlight: false
    },
    {
        name: "Kurumsal", price: "Özel", period: "",
        desc: "Zincir & franchise yapılar için.",
        features: ["Sınırsız Şube", "Merkezi Dashboard", "Şube Performans", "ERP / Muhasebe", "Özel Onboarding"],
        cta: "İletişime Geç", highlight: false
    },
];

const TESTIMONIALS = [
    { name: "Ahmet Yılmaz", role: "Kapadokya Steakhouse", text: "Kurulumu saniyeler sürdü. Müşterilerimizin sipariş verme hızı %40 arttı, garson hataları tamamen bitti." },
    { name: "Selin Arslan", role: "Café Aroma", text: "Menü güncellemek artık bir zevk. Gelişmiş arayüzü sayesinde her şey çok kolay ve estetik görünüyor." },
    { name: "Emre Kaya", role: "Deniz Restaurant", text: "Raporlama ekranları işletmemizin rotasını belirlememize büyük katkı sağlıyor. Her veriye anında ulaşıyoruz." },
];

/* ── Animations ───────────────────────────────── */
const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.5, ease: "easeOut" as const }
};

/* ── Components ───────────────────────────────── */

function Navbar({ branding }: { branding?: any }) {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const brand = branding || { siteName: "QRlamenü", logoIcon: "UtensilsCrossed", logoUrl: "" };
    const LogoIcon = ICON_MAP[brand.logoIcon] || UtensilsCrossed;

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? "bg-white/60 backdrop-blur-xl border-b border-white/20 py-4 shadow-[0_8px_32px_-10px_rgba(0,0,0,0.1)]" : "bg-transparent py-6"}`}>
            <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2.5 group">
                    <div className="w-9 h-9 bg-black text-white rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 overflow-hidden">
                        {brand.logoUrl ? (
                            <img src={brand.logoUrl} alt={brand.siteName} className="w-6 h-6 object-contain" />
                        ) : (
                            <LogoIcon size={18} strokeWidth={2.5} />
                        )}
                    </div>
                    <span className="font-extrabold text-xl tracking-tight text-gray-900">{brand.siteName}</span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {NAV_LINKS.map(link => (
                        <a key={link.href} href={link.href} className="text-sm font-medium text-gray-500 hover:text-black transition-colors">
                            {link.label}
                        </a>
                    ))}
                    <div className="flex items-center gap-4 ml-4">
                        <Link href="/iletisim" className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors">
                            Bize Ulaşın
                        </Link>
                        <Link href="/login" className="text-sm font-bold bg-slate-900 text-white px-6 py-2.5 rounded-full hover:bg-black transition-all shadow-lg shadow-slate-900/10 active:scale-[0.98]">
                            Giriş Yap
                        </Link>
                    </div>
                </div>

                {/* Mobile Toggle */}
                <button className="md:hidden text-gray-900 p-2 -mr-2" onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Nav */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
                    >
                        <div className="px-6 py-6 flex flex-col gap-5">
                            {NAV_LINKS.map(link => (
                                <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="text-base font-medium text-gray-600">
                                    {link.label}
                                </a>
                            ))}
                            <div className="h-px bg-gray-100 w-full my-2"></div>
                            <Link href="/login" className="text-center text-base font-medium bg-black text-white px-5 py-3 rounded-xl">
                                Giriş Yap
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}

/* ── Components ───────────────────────────────── */

const ICON_MAP: Record<string, any> = {
    QrCode, UtensilsCrossed, BarChart3, ShieldCheck,
    Bell, TrendingUp, Star, CheckCircle2,
    Globe, Smartphone, Users, Truck, Menu, X, ChevronRight
};

function Hero({ data, onCtaClick }: { data: any, onCtaClick?: () => void }) {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({
                x: (e.clientX / window.innerWidth - 0.5) * 20,
                y: (e.clientY / window.innerHeight - 0.5) * 20
            });
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <section className="relative pt-40 pb-20 md:pt-52 md:pb-32 px-6 overflow-hidden bg-[#fafafa]">
            {/* Ultra Premium Background Elements (Mesh Gradient) with Parallax */}
            <div className="absolute inset-0 z-0">
                <motion.div
                    animate={{ x: mousePos.x, y: mousePos.y }}
                    transition={{ type: "spring", damping: 50, stiffness: 200 }}
                    className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-orange-100/30 blur-[130px]"
                />
                <motion.div
                    animate={{ x: -mousePos.x, y: -mousePos.y }}
                    transition={{ type: "spring", damping: 50, stiffness: 200 }}
                    className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-slate-200/40 blur-[130px]"
                />
            </div>

            {/* Minimal pattern background overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808006_1px,transparent_1px),linear-gradient(to_bottom,#80808006_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-50"></div>

            <div className="max-w-5xl mx-auto flex flex-col items-center text-center relative z-10">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-100 text-[11px] font-bold text-slate-500 mb-8 shadow-sm backdrop-blur-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-[pulse_2s_infinite]"></span>
                    Restoran Yönetiminde Yeni Dönem
                </motion.div>

                <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-6 whitespace-pre-line">
                    {data.title.includes("Mükemmel restoran") ? (
                        <>
                            <span className="text-[#F97316]">Mükemmel restoran</span>,
                            {"\n"}pürüzsüz işletme.
                        </>
                    ) : data.title}
                </motion.h1>

                <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="text-lg md:text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
                    {data.subtitle}
                </motion.p>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
                    <Link href="/kayit-ol" className="w-full sm:w-auto px-10 py-[18px] bg-slate-900 text-white rounded-2xl font-bold text-base hover:bg-black transition-all flex items-center justify-center gap-2.5 group shadow-2xl shadow-slate-900/10 active:scale-[0.98] relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        {data.cta_primary}
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform relative z-10" />
                    </Link>
                    <a href="#ozellikler" className="w-full sm:w-auto px-10 py-[18px] bg-white text-slate-600 border border-slate-200 rounded-2xl font-bold text-base hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center active:scale-[0.98]">
                        {data.cta_secondary}
                    </a>
                </motion.div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-16 flex items-center gap-4 text-sm font-medium text-gray-400">
                    <div className="flex -space-x-2">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white ${['bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 'bg-rose-500'][i - 1]}`}>
                                {['AY', 'SA', 'EK', 'FD'][i - 1]}
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center gap-1">
                        <Star size={16} fill="currentColor" className="text-yellow-400" />
                        <Star size={16} fill="currentColor" className="text-yellow-400" />
                        <Star size={16} fill="currentColor" className="text-yellow-400" />
                        <Star size={16} fill="currentColor" className="text-yellow-400" />
                        <Star size={16} fill="currentColor" className="text-yellow-400" />
                    </div>
                    <span>5.000+ restoran güveniyor</span>
                </motion.div>
            </div>
        </section>
    );
}

function AnimatedNumber({ value }: { value: string }) {
    const [displayValue, setDisplayValue] = useState(0);
    const target = parseInt(value.replace(/[^0-9]/g, "")) || 0;
    const suffix = value.replace(/[0-9.]/g, "");

    return (
        <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            onViewportEnter={() => {
                let start = 0;
                const duration = 2000;
                const startTime = performance.now();

                const animate = (currentTime: number) => {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 4); // easeOutQuart

                    const current = Math.floor(eased * target);
                    setDisplayValue(current);

                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    } else {
                        setDisplayValue(target);
                    }
                };
                requestAnimationFrame(animate);
            }}
            viewport={{ once: true }}
        >
            {displayValue.toLocaleString()}{suffix}
        </motion.span>
    );
}

function Stats({ data }: { data?: any[] }) {
    const stats = data && data.length > 0 ? data : [
        { label: "Aktif Restoran", value: "5.000+" },
        { label: "Sistem Uptime", value: "%99.9" },
        { label: "Aylık Sipariş", value: "2M+" },
        { label: "Müşteri Değerlendirmesi", value: "4.9/5" }
    ];

    return (
        <section className="py-16 md:py-20 relative z-10">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="p-8 rounded-[32px] bg-white border border-slate-100 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.05)] flex flex-col items-center justify-center text-center group hover:-translate-y-1 transition-all duration-500 overflow-hidden relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <div className="text-4xl md:text-5xl font-black text-slate-900 mb-3 tracking-tight group-hover:text-orange-600 transition-colors relative z-10">
                            <AnimatedNumber value={stat.value} />
                        </div>
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.3em] relative z-10">{stat.label}</div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}

function References() {
    const refs = [
        "STEAKHOUSE", "GURME RESTORAN", "DENİZ ÜRÜNLERİ", "KAFE AROMA", "BİSTRO 34", "TADIM SOFRASI"
    ];

    return (
        <section className="py-20 relative overflow-hidden bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col items-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-12 text-center">
                        5.000'DEN FAZLA İŞLETME TARAFINDAN GÜVENİLİYOR
                    </p>

                    <div className="w-full flex flex-wrap justify-center items-center gap-x-16 gap-y-12 md:gap-x-24 opacity-30 grayscale hover:opacity-60 transition-all duration-700">
                        {refs.map((ref, i) => (
                            <div key={i} className="text-xl md:text-2xl font-black text-slate-900 tracking-tighter hover:text-orange-600 transition-colors cursor-default whitespace-nowrap">
                                {ref}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-100 to-transparent"></div>
        </section>
    );
}

function TiltCard({ children, i }: { children: React.ReactNode, i: number }) {
    const [rotate, setRotate] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setRotate({ x: y * 12, y: -x * 12 });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setRotate({ x: 0, y: 0 })}
            style={{
                transformStyle: "preserve-3d",
                perspective: "1000px"
            }}
            animate={{ rotateX: rotate.x, rotateY: rotate.y }}
            className="p-10 rounded-[40px] bg-white border border-slate-100 hover:border-orange-100/50 hover:shadow-[0_32px_80px_-20px_rgba(249,115,22,0.08)] transition-all duration-300 group relative"
        >
            <div style={{ transform: "translateZ(50px)" }}>
                {children}
            </div>
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-orange-500/0 group-hover:via-orange-500/20 to-transparent transition-all duration-500" />
        </motion.div>
    );
}

function Features({ data }: { data: any[] }) {
    return (
        <section id="ozellikler" className="py-24 md:py-32 px-6 max-w-7xl mx-auto">
            <motion.div {...fadeInUp} className="text-center max-w-2xl mx-auto mb-20">
                <h2 className="text-sm font-bold tracking-widest text-gray-400 uppercase mb-3">Özellikler</h2>
                <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">İhtiyacınız olan her şey,<br />sade ve şık bir panelde.</h3>
                <p className="text-gray-500 text-lg">Karmaşık arayüzlerden kurtulun. Sezgisellikle tasarlanmış araçlarımız, restoranınızı minimum eforla maksimum verime ulaştırır.</p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
                {data.map((f, i) => {
                    const Icon = ICON_MAP[f.icon] || CheckCircle2;
                    return (
                        <TiltCard key={i} i={i}>
                            <div className="w-16 h-16 bg-slate-50 rounded-[24px] flex items-center justify-center mb-8 text-slate-900 group-hover:bg-orange-50 group-hover:text-orange-600 transition-all duration-500 group-hover:rotate-6">
                                <Icon size={28} strokeWidth={1.5} />
                            </div>
                            <h4 className="text-xl font-bold text-slate-900 mb-4 tracking-tight">{f.title}</h4>
                            <p className="text-slate-500 leading-relaxed text-[15px]">{f.desc}</p>
                        </TiltCard>
                    )
                })}
            </div>
        </section>
    );
}

function HowItWorks() {
    const steps = [
        { label: "Kayıt Ol", desc: "Saniyeler içinde hesabınızı oluşturun.", icon: Smartphone },
        { label: "Menü Ekle", desc: "Ürünlerinizi, fiyatları ve görselleri girin.", icon: Menu },
        { label: "QR Oluştur", desc: "Sistem otomatik olarak QR menünüzü hazırlar.", icon: QrCode },
        { label: "Sipariş Al", desc: "Müşterileriniz doğrudan masadan sipariş versin.", icon: TrendingUp },
    ];

    return (
        <section id="nasil-calisir" className="py-24 px-6 bg-gray-50 border-y border-gray-100">
            <div className="max-w-7xl mx-auto">
                <motion.div {...fadeInUp} className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Dört adımda kolay kurulum</h2>
                    <p className="text-gray-500 text-lg">Teknik bilgiye ihtiyacınız yok. Hemen bugün kullanmaya başlayın.</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {steps.map((step, i) => {
                        const Icon = step.icon;
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.4 }}
                                className="relative flex flex-col items-center text-center p-6"
                            >
                                <div className="w-16 h-16 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-900 mb-6 shadow-sm relative z-10">
                                    <Icon size={24} />
                                </div>
                                <h4 className="text-base font-bold text-gray-900 mb-2">{step.label}</h4>
                                <p className="text-sm text-gray-500">{step.desc}</p>

                                {i !== steps.length - 1 && (
                                    <div className="hidden md:block absolute top-[56px] left-[50%] w-full h-[1px] bg-gray-200 z-0"></div>
                                )}
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    );
}

function Pricing({ data }: { data: any[] }) {
    return (
        <section id="fiyatlar" className="py-24 md:py-32 px-6 max-w-7xl mx-auto">
            <motion.div {...fadeInUp} className="text-center max-w-3xl mx-auto mb-16">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-widest mb-4">
                    Paketler & Ücretlendirme
                </div>
                <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">Şeffaf ve net fiyatlandırma</h2>
                <p className="text-gray-500 text-[16px] font-medium max-w-xl mx-auto">Sürpriz ücret yok, kullanım kısıtlaması yok. İhtiyacınıza en uygun planı saniyeler içinde seçin.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
                {data.map((p, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className={`p-8 rounded-[32px] border transition-all duration-500 group relative flex flex-col ${p.highlight ? 'bg-slate-900 text-white border-slate-800 shadow-[0_30px_70px_-20px_rgba(15,23,42,0.4)] scale-105 z-10' : 'bg-white border-slate-100 text-slate-900 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.04)] hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] hover:-translate-y-1'}`}
                    >
                        {p.highlight && (
                            <div className="absolute top-4 right-6">
                                <span className="px-3 py-1 rounded-full bg-orange-500 text-white text-[9px] font-black uppercase tracking-widest shadow-lg shadow-orange-500/20">Popüler</span>
                            </div>
                        )}

                        <div className="mb-8">
                            <h3 className={`text-[10px] font-black uppercase tracking-[0.25em] mb-4 ${p.highlight ? 'text-orange-400' : 'text-slate-400'}`}>{p.name}</h3>
                            <div className="flex items-baseline gap-1">
                                <span className={`text-4xl font-black tracking-tight ${p.price === 'Özel' ? 'text-3xl' : ''}`}>{p.price}</span>
                                <span className={`text-[13px] font-bold ${p.highlight ? 'text-slate-500' : 'text-slate-400'}`}>{p.period}</span>
                            </div>
                            <p className={`mt-4 text-[13px] font-medium leading-relaxed ${p.highlight ? 'text-slate-400' : 'text-slate-500'}`}>{p.desc}</p>
                        </div>

                        <ul className="mb-10 space-y-4 flex-grow">
                            {p.features.map((f: string, j: number) => (
                                <li key={j} className="flex items-start gap-3 text-[12px] font-bold">
                                    <div className={`mt-0.5 p-0.5 rounded-full ${p.highlight ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-50 text-orange-500'}`}>
                                        <Check size={12} strokeWidth={3} />
                                    </div>
                                    <span className={p.highlight ? 'text-slate-300' : 'text-slate-600'}>{f}</span>
                                </li>
                            ))}
                        </ul>

                        <Link href={p.name === 'Kurumsal' ? '/iletisim' : '/kayit-ol'} className={`w-full py-4 rounded-2xl font-black text-[13px] transition-all flex items-center justify-center gap-2 group/btn ${p.highlight ? 'bg-white text-slate-900 hover:bg-orange-500 hover:text-white shadow-xl shadow-white/5' : 'bg-slate-50 text-slate-900 hover:bg-slate-900 hover:text-white border border-slate-100'}`}>
                            {p.cta} <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}

function Testimonials({ data }: { data: any[] }) {
    return (
        <section id="yorumlar" className="py-24 px-6 bg-black text-white">
            <div className="max-w-7xl mx-auto">
                <motion.div {...fadeInUp} className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight">Kusursuz bir deneyim</h2>
                    <p className="text-gray-400 text-lg">QRlamenü ile işini büyüten binlerce mutlu restorandan birkaçı ile tanışın.</p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-6">
                    {data.map((t, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            className="bg-white/5 border border-white/10 p-8 rounded-3xl"
                        >
                            <div className="flex gap-1 mb-6">
                                {[1, 2, 3, 4, 5].map(star => <Star key={star} size={16} fill="currentColor" className="text-yellow-400" />)}
                            </div>
                            <p className="text-gray-300 text-sm leading-relaxed mb-6">"{t.text}"</p>
                            <div className="flex items-center gap-3 mt-auto">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold shrink-0">
                                    {t.name.split(' ').map((n: string) => n[0]).join('')}
                                </div>
                                <div>
                                    <div className="font-bold text-sm">{t.name}</div>
                                    <div className="text-xs text-gray-400">{t.role}</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function CTA() {
    return (
        <section className="py-24 px-6 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-100/20 rounded-full blur-[120px] -z-10" />

            <motion.div {...fadeInUp} className="max-w-6xl mx-auto bg-slate-900 rounded-[64px] p-12 md:p-24 text-center relative overflow-hidden shadow-[0_40px_100px_-20px_rgba(15,23,42,0.3)] border border-slate-800">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-50"></div>

                <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight leading-tight">
                    Gelecek bugünden itibaren <br className="hidden md:block" /> <span className="text-orange-500">masanızda.</span>
                </h2>
                <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
                    Kredi kartı gerekmeden 14 gün ücretsiz deneyin. <br className="hidden sm:block" /> Restoranınızdaki değişimi ilk günden hissedeceksiniz.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-5">
                    <Link href="/kayit-ol" className="px-10 py-5 bg-white text-slate-900 rounded-2xl font-black text-lg hover:bg-slate-100 transition-all flex items-center justify-center gap-2.5 shadow-xl shadow-white/5 active:scale-[0.98]">
                        Ücretsiz Başlayın <ArrowRight size={22} strokeWidth={2.5} />
                    </Link>
                    <Link href="/iletisim" className="px-10 py-5 bg-transparent border-2 border-slate-700 text-white rounded-2xl font-black text-lg hover:bg-slate-800 hover:border-slate-600 transition-all active:scale-[0.98]">
                        Demo Talep Edin
                    </Link>
                </div>

                {/* Internal Decorative Rings */}
                <div className="absolute -bottom-24 -right-24 w-64 h-64 border-8 border-white/5 rounded-full" />
                <div className="absolute -top-12 -left-12 w-32 h-32 border-4 border-orange-500/10 rounded-full" />
            </motion.div>
        </section>
    );
}

function Footer({ branding }: { branding?: any }) {
    const brand = branding || { siteName: "QRlamenü", logoIcon: "UtensilsCrossed", logoUrl: "" };
    const LogoIcon = ICON_MAP[brand.logoIcon] || UtensilsCrossed;

    return (
        <footer className="border-t border-gray-100 py-16 px-6 bg-white">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
                <div>
                    <Link href="/" className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-black text-white rounded-xl flex items-center justify-center overflow-hidden">
                            {brand.logoUrl ? (
                                <img src={brand.logoUrl} alt={brand.siteName} className="w-5 h-5 object-contain" />
                            ) : (
                                <LogoIcon size={16} strokeWidth={2.5} />
                            )}
                        </div>
                        <span className="font-extrabold text-xl text-gray-900 tracking-tight">{brand.siteName}</span>
                    </Link>
                    <p className="text-gray-500 text-sm max-w-xs">Restoranların yeni nesil dijital dönüşüm ortağı. Daha az efor, daha yüksek kazanç.</p>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-10 md:gap-16">
                    <div className="flex flex-col gap-4">
                        <span className="font-black text-slate-900 uppercase tracking-[0.2em] text-[11px] mb-2">Platform</span>
                        <a href="#ozellikler" className="text-[15px] font-bold text-slate-500 hover:text-orange-600 transition-colors">Özellikler</a>
                        <a href="#fiyatlar" className="text-[15px] font-bold text-slate-500 hover:text-orange-600 transition-colors">Fiyatlandırma</a>
                        <a href="#nasil-calisir" className="text-[15px] font-bold text-slate-500 hover:text-orange-600 transition-colors">Nasıl Çalışır?</a>
                    </div>
                    <div className="flex flex-col gap-4">
                        <span className="font-black text-slate-900 uppercase tracking-[0.2em] text-[11px] mb-2">Şirket</span>
                        <Link href="/hakkimizda" className="text-[15px] font-bold text-slate-500 hover:text-orange-600 transition-colors">Hakkımızda</Link>
                        <Link href="/iletisim" className="text-[15px] font-bold text-slate-500 hover:text-orange-600 transition-colors">İletişim</Link>
                    </div>
                    <div className="flex flex-col gap-4 col-span-2 lg:col-span-1 border-t md:border-t-0 pt-8 md:pt-0">
                        <span className="font-black text-slate-900 uppercase tracking-[0.2em] text-[11px] mb-2">Yasal</span>
                        <Link href="/gizlilik" className="text-[15px] font-bold text-slate-500 hover:text-orange-600 transition-colors">Gizlilik Politikası</Link>
                        <Link href="/kullanim" className="text-[15px] font-bold text-slate-500 hover:text-orange-600 transition-colors">Kullanım Koşulları</Link>
                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-medium text-gray-400">
                <p>&copy; {new Date().getFullYear()} {brand.siteName} Yazılım. Tüm hakları saklıdır.</p>
                <div className="flex gap-4">
                    <span>Türkiye'de sevgiyle geliştirildi.</span>
                </div>
            </div>
        </footer>
    );
}

export default function LandingPage() {
    const [content, setContent] = useState<any>(null);
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    useEffect(() => {
        fetch("/api/super-admin/website-config")
            .then(res => res.json())
            .then(data => {
                // Eğer veri varsa ve beklediğimiz 'hero' yapısına sahipse kullan
                if (data && data.hero && !data.error) {
                    setContent(data);
                } else {
                    // Veri yoksa veya beklediğimiz yapıda değilse (örn: error varsa veya boşsa) varsayılanı kullan
                    setContent({
                        hero: {
                            title: "Mükemmel restoran,\npürüzsüz işletme.",
                            subtitle: "Siparişleri hızlandırın, maliyetleri düşürün. Zarif, güçlü ve kullanımı kolay altyapımızla restoranınızı geleceğe taşıyın.",
                            cta_primary: "Ücretsiz Deneyin",
                            cta_secondary: "Özellikleri Keşfet"
                        },
                        features: [
                            { icon: "QrCode", title: "QR Dijital Menü", desc: "Sıfır baskı maliyeti. Müşteriler saniyeler içinde menüye erişir ve sipariş verir." },
                            { icon: "Bell", title: "Anında Bildirim", desc: "Siparişler eşzamanlı olarak mutfak ve garson ekranlarına düşer. Gecikme yok." },
                            { icon: "BarChart3", title: "Detaylı Analitik", desc: "Zirve saatler, restoran performansı ve en çok satan ürünler gerçek zamanlı raporlanır." },
                            { icon: "Truck", title: "Çoklu Sipariş Tipi", desc: "Masada, pakette, odada veya gel-al servis modellerinin tümü tek bir ekranda." },
                            { icon: "Users", title: "Ekip Yönetimi", desc: "Detaylı yetkilendirme ve vardiya takibi ile restoran personelinizi kolayca yönetin." },
                            { icon: "ShieldCheck", title: "Yüksek Güvenlik", desc: "Tamamen KVKK uyumlu altyapı, düzenli yedeklemeler ve kurum seviyesinde şifreleme." },
                        ],
                        pricing: [
                            {
                                name: "Başlangıç", price: "₺590", period: "/ay",
                                desc: "Butik kafe & tek şube için dijital menüye geçiş.",
                                features: ["QR Menü (Mobil Optimize)", "Sınırsız Ürün Ekleme", "Masa Bazlı Sipariş Takibi", "Günlük Ciro Özeti", "1 Kullanıcı"],
                                cta: "Ücretsiz Dene", highlight: false
                            },
                            {
                                name: "Profesyonel", price: "₺1.290", period: "/ay",
                                desc: "Büyüyen restoranlar için operasyonel kontrol seti.",
                                features: ["Tüm Başlangıç Özellikleri", "Garson Çağrı Sistemi", "Analizler & Kampanyalar", "6+ Premium Tema", "5 Kullanıcı"],
                                cta: "Hemen Başla", highlight: true
                            },
                            {
                                name: "Growth+", price: "₺1.990", period: "/ay",
                                desc: "Yoğun çalışan işletmeler için.",
                                features: ["Stok Takibi", "Çoklu Kasa Raporu", "POS Entegrasyon Altyapısı", "Rol Bazlı Yetkilendirme", "Öncelikli Destek"],
                                cta: "Bize Ulaşın", highlight: false
                            },
                            {
                                name: "Kurumsal", price: "Özel", period: "",
                                desc: "Zincir & franchise yapılar için.",
                                features: ["Sınırsız Şube", "Merkezi Dashboard", "Şube Performans", "ERP / Muhasebe", "Özel Onboarding"],
                                cta: "İletişime Geç", highlight: false
                            }
                        ],
                        testimonials: [
                            { name: "Emre Kaya", role: "Deniz Restaurant", text: "Raporlama ekranları işletmemizin rotasını belirlememize büyük katkı sağlıyor. Her veriye anında ulaşıyoruz." },
                        ],
                        stats: [
                            { label: "Aktif Restoran", value: "5.000+" },
                            { label: "Sistem Uptime", value: "%99.9" },
                            { label: "Aylık Sipariş", value: "2M+" },
                            { label: "Müşteri Değerlendirmesi", value: "4.9/5" }
                        ]
                    });
                }
            })
            .catch(() => {
                // İletişim hatası durumunda da varsayılanı kullan
                setContent({
                    hero: {
                        title: "Mükemmel restoran,\npürüzsüz işletme.",
                        subtitle: "Siparişleri hızlandırın, maliyetleri düşürün. Zarif, güçlü ve kullanımı kolay altyapımızla restoranınızı geleceğe taşıyın.",
                        cta_primary: "Ücretsiz Deneyin",
                        cta_secondary: "Özellikleri Keşfet"
                    },
                    features: [
                        { icon: "QrCode", title: "QR Dijital Menü", desc: "Sıfır baskı maliyeti. Müşteriler saniyeler içinde menüye erişir ve sipariş verir." },
                        { icon: "Bell", title: "Anında Bildirim", desc: "Siparişler eşzamanlı olarak mutfak ve garson ekranlarına düşer. Gecikme yok." },
                        { icon: "BarChart3", title: "Detaylı Analitik", desc: "Zirve saatler, restoran performansı ve en çok satan ürünler gerçek zamanlı raporlanır." },
                        { icon: "Truck", title: "Çoklu Sipariş Tipi", desc: "Masada, pakette, odada veya gel-al servis modellerinin tümü tek bir ekranda." },
                        { icon: "Users", title: "Ekip Yönetimi", desc: "Detaylı yetkilendirme ve vardiya takibi ile restoran personelinizi kolayca yönetin." },
                        { icon: "ShieldCheck", title: "Yüksek Güvenlik", desc: "Tamamen KVKK uyumlu altyapı, düzenli yedeklemeler ve kurum seviyesinde şifreleme." },
                    ],
                    pricing: [
                        {
                            name: "Başlangıç", price: "₺590", period: "/ay",
                            desc: "Butik kafe & tek şube için dijital menüye geçiş.",
                            features: ["QR Menü (Mobil Optimize)", "Sınırsız Ürün Ekleme", "Masa Bazlı Sipariş Takibi", "Günlük Ciro Özeti", "1 Kullanıcı"],
                            cta: "Ücretsiz Dene", highlight: false
                        },
                        {
                            name: "Profesyonel", price: "₺1.290", period: "/ay",
                            desc: "Büyüyen restoranlar için operasyonel kontrol seti.",
                            features: ["Tüm Başlangıç Özellikleri", "Garson Çağrı Sistemi", "Analizler & Kampanyalar", "6+ Premium Tema", "5 Kullanıcı"],
                            cta: "Hemen Başla", highlight: true
                        },
                        {
                            name: "Growth+", price: "₺1.990", period: "/ay",
                            desc: "Yoğun çalışan işletmeler için.",
                            features: ["Stok Takibi", "Çoklu Kasa Raporu", "POS Entegrasyon Altyapısı", "Rol Bazlı Yetkilendirme", "Öncelikli Destek"],
                            cta: "Bize Ulaşın", highlight: false
                        },
                        {
                            name: "Kurumsal", price: "Özel", period: "",
                            desc: "Zincir & franchise yapılar için.",
                            features: ["Sınırsız Şube", "Merkezi Dashboard", "Şube Performans", "ERP / Muhasebe", "Özel Onboarding"],
                            cta: "İletişime Geç", highlight: false
                        }
                    ],
                    testimonials: [
                        { name: "Ahmet Yılmaz", role: "Kapadokya Steakhouse", text: "Kurulumu saniyeler sürdü. Müşterilerimizin sipariş verme hızı %40 arttı, garson hataları tamamen bitti." },
                        { name: "Selin Arslan", role: "Café Aroma", text: "Menü güncellemek artık bir zevk. Gelişmiş arayüzü sayesinde her şey çok kolay ve estetik görünüyor." },
                        { name: "Emre Kaya", role: "Deniz Restaurant", text: "Raporlama ekranları işletmemizin rotasını belirlememize büyük katkı sağlıyor. Her veriye anında ulaşıyoruz." },
                    ],
                    stats: [
                        { label: "Aktif Restoran", value: "5.000+" },
                        { label: "Sistem Uptime", value: "%99.9" },
                        { label: "Aylık Sipariş", value: "2M+" },
                        { label: "Müşteri Değerlendirmesi", value: "4.9/5" }
                    ]
                });
            });
    }, []);

    if (!content) return <div className="min-h-screen bg-white" />;

    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-black selection:text-white">
            <motion.div
                className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-400 to-orange-600 origin-left z-[100]"
                style={{ scaleX }}
            />
            <Navbar branding={content.branding} />
            <main>
                <Hero data={content.hero} />
                <Stats data={content.stats} />
                <References />
                <Features data={content.features} />
                <HowItWorks />
                <Pricing data={content.pricing} />
                <Testimonials data={content.testimonials} />
                <CTA />
            </main>
            <Footer branding={content.branding} />
        </div>
    );
}
