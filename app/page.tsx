"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
    ArrowRight, UtensilsCrossed, QrCode, BarChart3, ShieldCheck,
    Bell, TrendingUp, Star, CheckCircle2,
    Globe, Smartphone, Users, Truck, Menu, X, ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
        name: "Başlangıç", price: "₺490", period: "/ay",
        desc: "Butik işletmeler ve tek şubeler için.",
        features: ["QR Menü", "Sipariş Takibi", "Temel Analitik", "1 Kullanıcı"],
        cta: "Ücretsiz Dene", highlight: false
    },
    {
        name: "Profesyonel", price: "₺990", period: "/ay",
        desc: "Büyüyen restoranlar için ideal çözüm.",
        features: ["Tüm Başlangıç özellikleri", "Garson Çağrı Sistemi", "Gelişmiş Analitik", "Seçilebilir Temalar (6+)", "5 Kullanıcı"],
        cta: "Hemen Başla", highlight: true
    },
    {
        name: "Kurumsal", price: "Özel", period: "",
        desc: "Çok şubeli ve zincir restoranlar için.",
        features: ["Sınırsız Şube Yönetimi", "Özel Entegrasyonlar", "Sınırsız Kullanıcı", "7/24 Öncelikli Destek", "Özel Domain Altyapısı"],
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

function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-white/80 backdrop-blur-md border-b border-gray-100 py-3" : "bg-transparent py-5"}`}>
            <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2.5 group">
                    <div className="w-9 h-9 bg-black text-white rounded-xl flex items-center justify-center transition-transform group-hover:scale-105">
                        <UtensilsCrossed size={18} strokeWidth={2.5} />
                    </div>
                    <span className="font-extrabold text-xl tracking-tight text-gray-900">QRlamenü</span>
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
                        <Link href="/login" className="text-sm font-medium bg-black text-white px-5 py-2.5 rounded-full hover:bg-gray-800 transition-colors shadow-sm">
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

function Hero() {
    return (
        <section className="relative pt-40 pb-20 md:pt-52 md:pb-32 px-6 overflow-hidden">
            {/* Minimal pattern background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

            <div className="max-w-5xl mx-auto flex flex-col items-center text-center relative z-10">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-600 mb-8 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-black animate-pulse"></span>
                    Restoran Yönetiminde Yeni Dönem
                </motion.div>

                <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-6">
                    Mükemmel restoran,<br className="hidden md:block" /> pürüzsüz işletme.
                </motion.h1>

                <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="text-lg md:text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
                    Siparişleri hızlandırın, maliyetleri düşürün. Zarif, güçlü ve kullanımı kolay altyapımızla restoranınızı geleceğe taşıyın.
                </motion.p>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
                    <Link href="/login" className="w-full sm:w-auto px-8 py-4 bg-black text-white rounded-full font-medium text-base hover:bg-gray-800 transition-all flex items-center justify-center gap-2 group shadow-lg shadow-black/10">
                        Ücretsiz Deneyin
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <a href="#ozellikler" className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 border border-gray-200 rounded-full font-medium text-base hover:bg-gray-50 transition-all flex items-center justify-center">
                        Özellikleri Keşfet
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

function Stats() {
    return (
        <section className="py-12 border-y border-gray-100 bg-gray-50/50">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8 lg:divide-x divide-gray-200 text-center">
                {[
                    { label: "Aktif Restoran", value: "5.000+" },
                    { label: "Sistem Uptime", value: "%99.9" },
                    { label: "Aylık Sipariş", value: "2M+" },
                    { label: "Müşteri Değerlendirmesi", value: "4.9/5" }
                ].map((stat, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="px-4">
                        <div className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">{stat.value}</div>
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest">{stat.label}</div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}

function Features() {
    return (
        <section id="ozellikler" className="py-24 md:py-32 px-6 max-w-7xl mx-auto">
            <motion.div {...fadeInUp} className="text-center max-w-2xl mx-auto mb-20">
                <h2 className="text-sm font-bold tracking-widest text-gray-400 uppercase mb-3">Özellikler</h2>
                <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">İhtiyacınız olan her şey,<br />sade ve şık bir panelde.</h3>
                <p className="text-gray-500 text-lg">Karmaşık arayüzlerden kurtulun. Sezgisellikle tasarlanmış araçlarımız, restoranınızı minimum eforla maksimum verime ulaştırır.</p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {FEATURES.map((f, i) => {
                    const Icon = f.icon;
                    return (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="p-8 rounded-3xl bg-white border border-gray-100 hover:border-gray-200 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300"
                        >
                            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 text-black">
                                <Icon size={22} strokeWidth={2} />
                            </div>
                            <h4 className="text-lg font-bold text-gray-900 mb-3">{f.title}</h4>
                            <p className="text-gray-500 leading-relaxed text-sm">{f.desc}</p>
                        </motion.div>
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

function Pricing() {
    return (
        <section id="fiyatlar" className="py-24 md:py-32 px-6 max-w-7xl mx-auto">
            <motion.div {...fadeInUp} className="text-center max-w-2xl mx-auto mb-16">
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Şeffaf ve net fiyatlandırma</h2>
                <p className="text-gray-500 text-lg">Sürpriz ücret yok, kullanım kısıtlaması yok. İhtiyacınıza uygun planı seçin.</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 items-center">
                {PRICING.map((p, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1, duration: 0.5 }}
                        className={`p-8 rounded-[2rem] border ${p.highlight ? 'bg-black text-white border-black shadow-2xl scale-100 md:scale-105 z-10' : 'bg-white border-gray-100 text-gray-900 shadow-sm'}`}
                    >
                        <div className="mb-8">
                            <h3 className={`text-sm font-bold uppercase tracking-widest mb-4 ${p.highlight ? 'text-gray-400' : 'text-gray-500'}`}>{p.name}</h3>
                            <div className="flex items-baseline gap-1">
                                <span className={`text-4xl md:text-5xl font-extrabold tracking-tight ${p.price === 'Özel' ? 'text-3xl' : ''}`}>{p.price}</span>
                                <span className={`text-sm font-medium ${p.highlight ? 'text-gray-400' : 'text-gray-500'}`}>{p.period}</span>
                            </div>
                            <p className={`mt-4 text-sm font-medium ${p.highlight ? 'text-gray-400' : 'text-gray-500'}`}>{p.desc}</p>
                        </div>

                        <ul className="mb-10 space-y-4">
                            {p.features.map((f, j) => (
                                <li key={j} className="flex items-start gap-3 text-sm font-medium">
                                    <CheckCircle2 size={18} className={`shrink-0 ${p.highlight ? 'text-white' : 'text-black'}`} />
                                    <span className={p.highlight ? 'text-gray-300' : 'text-gray-600'}>{f}</span>
                                </li>
                            ))}
                        </ul>

                        <Link href={p.name === 'Kurumsal' ? '/iletisim' : '/login'} className={`flex items-center justify-center gap-2 w-full py-4 rounded-xl font-bold text-sm transition-all ${p.highlight ? 'bg-white text-black hover:bg-gray-100' : 'bg-gray-50 text-black hover:bg-gray-100 border border-gray-200'}`}>
                            {p.cta}
                        </Link>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}

function Testimonials() {
    return (
        <section id="yorumlar" className="py-24 px-6 bg-black text-white">
            <div className="max-w-7xl mx-auto">
                <motion.div {...fadeInUp} className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight">Kusursuz bir deneyim</h2>
                    <p className="text-gray-400 text-lg">QRlamenü ile işini büyüten binlerce mutlu restorandan birkaçı ile tanışın.</p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-6">
                    {TESTIMONIALS.map((t, i) => (
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
                                    {t.name.split(' ').map(n => n[0]).join('')}
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
        <section className="py-24 px-6">
            <motion.div {...fadeInUp} className="max-w-5xl mx-auto bg-gray-50 border border-gray-100 rounded-[2.5rem] p-12 md:p-20 text-center relative overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-1 bg-black"></div>
                <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">Gelecek bugünden itibaren masanızda.</h2>
                <p className="text-lg text-gray-500 mb-10 max-w-xl mx-auto">Kredi kartı gerekmeden 14 gün ücretsiz deneyin. Farkı ilk günden hissedeceksiniz.</p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Link href="/login" className="px-8 py-4 bg-black text-white rounded-full font-bold text-base hover:bg-gray-800 transition-all flex items-center justify-center gap-2">
                        Ücretsiz Başlayın <ArrowRight size={18} />
                    </Link>
                    <Link href="/iletisim" className="px-8 py-4 bg-white border border-gray-200 text-gray-900 rounded-full font-bold text-base hover:bg-gray-50 hover:border-gray-300 transition-all">
                        Demo Talep Edin
                    </Link>
                </div>
            </motion.div>
        </section>
    );
}

function Footer() {
    return (
        <footer className="border-t border-gray-100 py-16 px-6 bg-white">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
                <div>
                    <Link href="/" className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-black text-white rounded-xl flex items-center justify-center">
                            <UtensilsCrossed size={16} strokeWidth={2.5} />
                        </div>
                        <span className="font-extrabold text-xl text-gray-900 tracking-tight">QRlamenü</span>
                    </Link>
                    <p className="text-gray-500 text-sm max-w-xs">Restoranların yeni nesil dijital dönüşüm ortağı. Daha az efor, daha yüksek kazanç.</p>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 md:gap-16">
                    <div className="flex flex-col gap-3">
                        <span className="font-bold text-gray-900 mb-2">Platform</span>
                        <a href="#ozellikler" className="text-sm font-medium text-gray-500 hover:text-black transition-colors">Özellikler</a>
                        <a href="#fiyatlar" className="text-sm font-medium text-gray-500 hover:text-black transition-colors">Fiyatlandırma</a>
                        <a href="#nasil-calisir" className="text-sm font-medium text-gray-500 hover:text-black transition-colors">Nasıl Çalışır?</a>
                    </div>
                    <div className="flex flex-col gap-3">
                        <span className="font-bold text-gray-900 mb-2">Şirket</span>
                        <Link href="/hakkimizda" className="text-sm font-medium text-gray-500 hover:text-black transition-colors">Hakkımızda</Link>
                        <Link href="/iletisim" className="text-sm font-medium text-gray-500 hover:text-black transition-colors">İletişim</Link>
                    </div>
                    <div className="flex flex-col gap-3 col-span-2 lg:col-span-1">
                        <span className="font-bold text-gray-900 mb-2">Yasal</span>
                        <Link href="/gizlilik" className="text-sm font-medium text-gray-500 hover:text-black transition-colors">Gizlilik Politikası</Link>
                        <Link href="/kullanim" className="text-sm font-medium text-gray-500 hover:text-black transition-colors">Kullanım Koşulları</Link>
                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-medium text-gray-400">
                <p>&copy; {new Date().getFullYear()} QRlamenü Yazılım. Tüm hakları saklıdır.</p>
                <div className="flex gap-4">
                    <span>Türkiye'de sevgiyle geliştirildi.</span>
                </div>
            </div>
        </footer>
    );
}

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-black selection:text-white">
            <Navbar />
            <main>
                <Hero />
                <Stats />
                <Features />
                <HowItWorks />
                <Pricing />
                <Testimonials />
                <CTA />
            </main>
            <Footer />
        </div>
    );
}
