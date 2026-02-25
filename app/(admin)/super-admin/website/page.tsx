"use client";
import { useState, useEffect } from "react";
import {
    Save, Globe, Layout, Tag, MessageSquare,
    Plus, Trash2, Check, AlertCircle, Loader2,
    QrCode, UtensilsCrossed, BarChart3,
    ShieldCheck, Bell, Truck, Users, TrendingUp,
    Smartphone, Menu, X, Star, ArrowRight, CheckCircle2,
    RefreshCcw, Eye
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const ICON_LIST = [
    { name: "QrCode", icon: QrCode },
    { name: "Bell", icon: Bell },
    { name: "BarChart3", icon: BarChart3 },
    { name: "Truck", icon: Truck },
    { name: "Users", icon: Users },
    { name: "ShieldCheck", icon: ShieldCheck },
    { name: "TrendingUp", icon: TrendingUp },
    { name: "Smartphone", icon: Smartphone },
    { name: "Menu", icon: Menu },
    { name: "Star", icon: Star },
    { name: "UtensilsCrossed", icon: UtensilsCrossed }
];

const INITIAL_CONTENT = {
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
            desc: "Butik kafe & tek şube için dijital menüye geçiş paketi.",
            features: ["QR Menü (Mobil Optimize)", "Sınırsız Ürün Ekleme", "Masa Bazlı Sipariş Takibi", "Günlük Ciro Özeti", "Basit Satış Raporu", "1 Kullanıcı", "Standart Tema (1 adet)"],
            cta: "Ücretsiz Dene", highlight: false
        },
        {
            name: "Profesyonel", price: "₺1.290", period: "/ay",
            desc: "Büyüyen restoranlar için operasyonel kontrol seti.",
            features: ["Tüm Başlangıç Özellikleri", "Garson Çağrı Sistemi", "Ürün Bazlı Satış Analizi", "Saatlik Satış Grafiği", "Masa Doluluk Raporu", "Kampanya Banner Alanı", "WhatsApp Sipariş Yönlendirme", "6+ Premium Tema", "5 Kullanıcı", "Logo & Renk Özelleştirme"],
            cta: "Hemen Başla", highlight: true
        },
        {
            name: "Growth+", price: "₺1.990", period: "/ay",
            desc: "Yoğun çalışan işletmeler için mini Restaurant OS.",
            features: ["Tüm Profesyonel Özellikleri", "Stok Takibi (Ürün Düşümü)", "Rol Bazlı Yetkilendirme", "Çoklu Kasa Raporu", "Şube Açmaya Hazır Altyapı", "API Erişimi", "POS Entegrasyon Altyapısı", "Özel Kampanya Kurguları", "Öncelikli Destek"],
            cta: "Bize Ulaşın", highlight: false
        },
        {
            name: "Kurumsal", price: "₺3.990", period: "/ay",
            desc: "Zincir & franchise yapılar için.",
            features: ["Tüm Growth+ Özellikleri", "Sınırsız Şube", "Merkezi Dashboard (Tüm Şubeler)", "Şube Performans Karşılaştırma", "Özel Domain", "ERP / Muhasebe Entegrasyonu", "SLA Destek", "Özel Onboarding"],
            cta: "İletişime Geç", highlight: false
        },
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
    ],
    branding: {
        logoIcon: "UtensilsCrossed",
        siteName: "QRlamenü",
        logoUrl: ""
    },
    corporate: {
        about: {
            title: "Restoranların dijital dönüşüm ortağıyız.",
            content: "2024 yılında, restoran sektöründeki operasyonel zorlukları teknolojiyle çözmek amacıyla yola çıktık. Baskı maliyetleri, hatalı siparişler ve yavaşlayan servis süreçlerini tarihe gömüyoruz."
        },
        contact: {
            email: "destek@qrlamenu.com",
            phone: "+90 212 XXX XX XX",
            address: "Teknokent, İstanbul"
        },
        legal: {
            privacy: "QRlamenü olarak, verilerinizin gizliliği ve güvenliği bizim için en yüksek önceliğe sahiptir.",
            terms: "QRlamenü platformuna hoş geldiniz. Bu hizmeti kullanarak aşağıdaki koşulları kabul etmiş sayılırsınız."
        }
    }
};

export default function WebsiteManagementPage() {
    const [activeTab, setActiveTab] = useState("hero");
    const [content, setContent] = useState(INITIAL_CONTENT);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showPreview, setShowPreview] = useState(true);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const res = await fetch("/api/super-admin/website-config");
                const data = await res.json();
                if (data && !data.error) {
                    // Derin birleştirme (Simple merge) - Gelen veride eksik alan varsa INITIAL_CONTENT'den al
                    const mergedData = {
                        ...INITIAL_CONTENT,
                        ...data,
                        stats: Array.isArray(data.stats) ? data.stats : INITIAL_CONTENT.stats,
                        features: Array.isArray(data.features) ? data.features : INITIAL_CONTENT.features,
                        pricing: Array.isArray(data.pricing) ? data.pricing : INITIAL_CONTENT.pricing,
                        testimonials: Array.isArray(data.testimonials) ? data.testimonials : INITIAL_CONTENT.testimonials,
                        branding: { ...INITIAL_CONTENT.branding, ...(data.branding || {}) },
                        corporate: {
                            ...INITIAL_CONTENT.corporate,
                            ...(data.corporate || {}),
                            about: { ...INITIAL_CONTENT.corporate.about, ...(data.corporate?.about || {}) },
                            contact: { ...INITIAL_CONTENT.corporate.contact, ...(data.corporate?.contact || {}) },
                            legal: { ...INITIAL_CONTENT.corporate.legal, ...(data.corporate?.legal || {}) }
                        }
                    };
                    setContent(mergedData);
                } else if (data && data.error) {
                    setMessage({ type: 'error', text: data.error });
                }
            } catch (error) {
                console.error("Fetch Config Error:", error);
                setMessage({ type: 'error', text: "Ayarlar yüklenirken bir iletişim hatası oluştu." });
            } finally {
                setLoading(false);
            }
        };
        fetchConfig();
    }, []);

    const updateContent = (path: string, value: any) => {
        setContent(prev => {
            const next = { ...prev };
            const keys = path.split('.');
            let current: any = next;

            for (let i = 0; i < keys.length - 1; i++) {
                const key = keys[i];
                if (!current[key] || typeof current[key] !== 'object') {
                    current[key] = {};
                }
                current[key] = { ...current[key] };
                current = current[key];
            }

            current[keys[keys.length - 1]] = value;
            return next;
        });
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage(null);
        try {
            const res = await fetch("/api/super-admin/website-config", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(content)
            });

            const data = await res.json();

            if (res.ok) {
                setMessage({ type: 'success', text: "Değişiklikler başarıyla kaydedildi ve yayına alındı!" });
                setTimeout(() => setMessage(null), 5000);
            } else if (res.status === 401) {
                setMessage({
                    type: 'error',
                    text: data.details || "Oturumunuz kapandığı için kaydedilemedi. Lütfen sayfayı yenileyip tekrar giriş yapın."
                });
            } else {
                setMessage({ type: 'error', text: data.error || data.details || "Kaydedilirken bir hata oluştu." });
            }
        } catch (error: any) {
            console.error("Save Error:", error);
            setMessage({ type: 'error', text: "Bağlantı hatası oluştu." });
        } finally {
            setSaving(false);
        }
    };

    const handleReset = () => {
        if (confirm("Tüm website içeriklerini varsayılan hallerine döndürmek istediğinize emin misiniz?")) {
            setContent(INITIAL_CONTENT);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[600px] gap-4">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-orange-600 rounded-full border-t-transparent animate-spin"></div>
                </div>
                <p className="text-slate-400 font-bold animate-pulse">Konfigürasyon Yükleniyor...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8f9fb] p-4 md:p-8">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 bg-white rounded-[22px] shadow-sm border border-slate-100 flex items-center justify-center text-orange-600">
                            <Globe size={32} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Website Yönetimi</h1>
                            <p className="text-slate-500 font-medium text-sm">Görsel kimliğinizi ve ana sayfa içeriklerinizi buradan yönetin.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleReset}
                            className="bg-white text-slate-500 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-slate-50 hover:text-slate-900 transition-all border border-slate-100 shadow-sm active:scale-95"
                        >
                            <RefreshCcw size={16} /> Varsayılan
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="bg-slate-900 text-white px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-3 hover:bg-[#ea580c] transition-all shadow-xl shadow-slate-900/10 hover:shadow-orange-500/20 active:scale-95 disabled:opacity-50"
                        >
                            {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                            {saving ? 'İşleniyor...' : 'Yayına Al'}
                        </button>
                    </div>
                </div>

                {message && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`p-4 rounded-2xl mb-6 flex items-center gap-3 border shadow-sm ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'}`}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${message.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                            {message.type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
                        </div>
                        <span className="font-bold text-sm">{message.text}</span>
                    </motion.div>
                )}

                <div className="grid lg:grid-cols-[1fr_400px] gap-6 items-start">

                    {/* Left Side: Editor */}
                    <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm flex flex-col">

                        {/* Tabs Navigation */}
                        <div className="flex border-b border-slate-50 bg-slate-50/50 p-1.5 gap-1 overflow-x-auto hide-scrollbar">
                            {[
                                { id: "branding", label: "Branding", icon: Layout },
                                { id: "hero", label: "Hero Alanı", icon: Globe },
                                { id: "stats", label: "İstatistikler", icon: BarChart3 },
                                { id: "features", label: "Özellikler", icon: CheckCircle2 },
                                { id: "pricing", label: "Fiyatlandırma", icon: Tag },
                                { id: "testimonials", label: "Yorumlar", icon: MessageSquare },
                                { id: "corporate", label: "Kurumsal", icon: ShieldCheck },
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex-1 min-w-max py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${activeTab === tab.id ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'}`}
                                >
                                    <tab.icon size={14} />
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Editor Content */}
                        <div className="p-6">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {/* Hero Section */}
                                    {activeTab === "hero" && (
                                        <div className="space-y-8">
                                            <div className="grid gap-6">
                                                <div className="flex flex-col gap-3">
                                                    <div className="flex items-center justify-between">
                                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Ana Başlık (H1)</label>
                                                        <span className="text-[10px] text-slate-300 font-bold italic">"\n" ile alt satıra geçebilirsiniz</span>
                                                    </div>
                                                    <textarea
                                                        value={content.hero.title}
                                                        onChange={(e) => updateContent("hero.title", e.target.value)}
                                                        className="w-full px-6 py-5 rounded-3xl border-2 border-slate-50 bg-slate-50 text-xl font-black text-gray-900 focus:bg-white focus:border-[#ea580c] outline-none transition-all placeholder:text-slate-300 min-h-[140px]"
                                                        placeholder="Mükemmel restoran..."
                                                    />
                                                </div>
                                                <div className="flex flex-col gap-3">
                                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Alt Açıklama (Subtitle)</label>
                                                    <textarea
                                                        value={content.hero.subtitle}
                                                        onChange={(e) => updateContent("hero.subtitle", e.target.value)}
                                                        className="w-full px-6 py-5 rounded-3xl border-2 border-slate-50 bg-slate-50 text-sm font-bold text-slate-600 leading-relaxed focus:bg-white focus:border-[#ea580c] outline-none transition-all placeholder:text-slate-300 min-h-[140px]"
                                                        placeholder="Siparişleri hızlandırın..."
                                                    />
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                                                    <div className="flex flex-col gap-3">
                                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Giriş Yap / Dene Butonu</label>
                                                        <input
                                                            value={content.hero.cta_primary}
                                                            onChange={(e) => updateContent("hero.cta_primary", e.target.value)}
                                                            className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 bg-slate-50 text-sm font-black text-gray-900 focus:bg-white focus:border-[#ea580c] outline-none transition-all"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col gap-3">
                                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Özellikler Butonu</label>
                                                        <input
                                                            value={content.hero.cta_secondary}
                                                            onChange={(e) => updateContent("hero.cta_secondary", e.target.value)}
                                                            className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 bg-slate-50 text-sm font-black text-gray-900 focus:bg-white focus:border-[#ea580c] outline-none transition-all"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Stats Section */}
                                    {activeTab === "stats" && (
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                                {(content.stats || []).map((stat, idx) => (
                                                    <div key={idx} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col gap-4 group hover:shadow-xl hover:shadow-slate-200/40 transition-all">
                                                        <div className="flex flex-col gap-1.5">
                                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">DEĞER (Value)</label>
                                                            <input
                                                                value={stat.value}
                                                                onChange={(e) => {
                                                                    const newS = [...(content.stats || [])];
                                                                    newS[idx].value = e.target.value;
                                                                    setContent({ ...content, stats: newS });
                                                                }}
                                                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-50 bg-slate-50 font-black text-[#ea580c] text-lg focus:bg-white focus:border-[#ea580c] outline-none transition-all"
                                                                placeholder="5.000+"
                                                            />
                                                        </div>
                                                        <div className="flex flex-col gap-1.5">
                                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ETİKET (Label)</label>
                                                            <input
                                                                value={stat.label}
                                                                onChange={(e) => {
                                                                    const newS = [...(content.stats || [])];
                                                                    newS[idx].label = e.target.value;
                                                                    setContent({ ...content, stats: newS });
                                                                }}
                                                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-50 bg-slate-50 font-bold text-slate-500 text-xs focus:bg-white focus:border-[#ea580c] outline-none transition-all uppercase tracking-tighter"
                                                                placeholder="Aktif Restoran"
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {/* Features Section */}
                                    {activeTab === "features" && (
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                {content.features.map((feature, idx) => (
                                                    <div key={idx} className="bg-white p-6 rounded-[32px] border border-slate-100 relative group shadow-sm hover:shadow-xl hover:shadow-slate-200/40 transition-all">
                                                        <button
                                                            onClick={() => {
                                                                const newF = [...content.features];
                                                                newF.splice(idx, 1);
                                                                setContent({ ...content, features: newF });
                                                            }}
                                                            className="absolute -top-3 -right-3 w-8 h-8 bg-rose-500 text-white rounded-xl flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all z-10 hover:scale-110 active:scale-90"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                        <div className="flex flex-col gap-4">
                                                            <div className="flex items-center gap-4">
                                                                {/* Icon Selector Button */}
                                                                <div className="relative group/icon">
                                                                    <div className="w-12 h-12 bg-slate-50 rounded-2xl border-2 border-slate-100 flex items-center justify-center text-[#ea580c] cursor-pointer shadow-sm group-hover/icon:bg-white group-hover/icon:border-[#ea580c] transition-all">
                                                                        {(() => {
                                                                            const IconComp = ICON_LIST.find(i => i.name === feature.icon)?.icon || QrCode;
                                                                            return <IconComp size={24} />;
                                                                        })()}
                                                                    </div>
                                                                    <div className="absolute top-full left-0 mt-3 bg-white border border-slate-100 rounded-[24px] shadow-2xl p-3 grid grid-cols-4 gap-2 z-20 opacity-0 pointer-events-none group-focus-within/icon:opacity-100 group-focus-within/icon:pointer-events-auto transition-all w-[200px]">
                                                                        {ICON_LIST.map(ic => (
                                                                            <button
                                                                                key={ic.name}
                                                                                onClick={() => {
                                                                                    const newF = [...content.features];
                                                                                    newF[idx].icon = ic.name;
                                                                                    setContent({ ...content, features: newF });
                                                                                }}
                                                                                className={`p-2.5 rounded-xl hover:bg-orange-50 hover:text-[#ea580c] transition-all flex justify-center items-center ${feature.icon === ic.name ? 'bg-[#ea580c] text-white shadow-lg shadow-orange-500/20' : 'text-slate-400'}`}
                                                                            >
                                                                                <ic.icon size={18} />
                                                                            </button>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                                <div className="flex-1">
                                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">BAŞLIK</label>
                                                                    <input
                                                                        value={feature.title}
                                                                        onChange={(e) => {
                                                                            const newF = [...content.features];
                                                                            newF[idx].title = e.target.value;
                                                                            setContent({ ...content, features: newF });
                                                                        }}
                                                                        className="w-full bg-transparent border-b-2 border-slate-50 focus:border-[#ea580c] outline-none text-sm font-black text-gray-900 transition-all placeholder:text-slate-300"
                                                                        placeholder="Özellik Başlığı"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="space-y-1.5">
                                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">AÇIKLAMA</label>
                                                                <textarea
                                                                    value={feature.desc}
                                                                    onChange={(e) => {
                                                                        const newF = [...content.features];
                                                                        newF[idx].desc = e.target.value;
                                                                        setContent({ ...content, features: newF });
                                                                    }}
                                                                    className="w-full bg-slate-50 p-4 rounded-2xl border-2 border-slate-50 text-xs text-slate-500 font-bold leading-relaxed min-h-[80px] outline-none focus:bg-white focus:border-[#ea580c] transition-all resize-none"
                                                                    placeholder="Özellik açıklaması..."
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                                <button
                                                    onClick={() => setContent({ ...content, features: [...content.features, { icon: "CheckCircle2", title: "Yeni Özellik", desc: "Açıklama giriniz" }] })}
                                                    className="border-2 border-dashed border-slate-200 rounded-[32px] flex flex-col items-center justify-center gap-4 p-10 text-slate-300 hover:border-[#ea580c] hover:text-[#ea580c] hover:bg-orange-50/30 transition-all font-black group active:scale-95"
                                                >
                                                    <div className="w-14 h-14 rounded-2xl border-2 border-slate-100 group-hover:border-[#ea580c] flex items-center justify-center transition-all bg-white group-hover:scale-110">
                                                        <Plus size={28} strokeWidth={3} />
                                                    </div>
                                                    YENİ ÖZELLİK EKLE
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Pricing Section */}
                                    {activeTab === "pricing" && (
                                        <div className="space-y-8">
                                            {content.pricing.map((plan, idx) => (
                                                <div key={idx} className={`p-8 rounded-[40px] border-2 transition-all relative overflow-hidden group hover:shadow-2xl hover:shadow-slate-200/40 ${plan.highlight ? 'border-[#ea580c] bg-orange-50/10 shadow-xl shadow-orange-500/5' : 'border-slate-50 bg-slate-50/30'}`}>
                                                    {plan.highlight && (
                                                        <div className="absolute top-6 -right-12 rotate-45 bg-[#ea580c] text-white text-[10px] font-black px-12 py-1.5 shadow-lg tracking-widest z-10">
                                                            POPÜLER
                                                        </div>
                                                    )}

                                                    <div className="flex flex-col md:flex-row gap-10">
                                                        <div className="w-full md:w-1/3 flex flex-col gap-6">
                                                            <div className="space-y-2">
                                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">PLAN ADI</label>
                                                                <div className="flex items-center gap-4">
                                                                    <input
                                                                        value={plan.name}
                                                                        onChange={(e) => {
                                                                            const newP = [...content.pricing];
                                                                            newP[idx].name = e.target.value;
                                                                            setContent({ ...content, pricing: newP });
                                                                        }}
                                                                        className="flex-1 bg-white border-2 border-slate-50 p-4 rounded-2xl text-lg font-black text-gray-900 outline-none focus:border-[#ea580c] transition-all"
                                                                        placeholder="Plan Adı"
                                                                    />
                                                                    <div className="flex flex-col items-center gap-1 group/toggle">
                                                                        <label className="text-[9px] font-black text-slate-300 uppercase">ÖNE ÇIKAR</label>
                                                                        <button
                                                                            onClick={() => {
                                                                                const newP = [...content.pricing];
                                                                                newP[idx].highlight = !newP[idx].highlight;
                                                                                setContent({ ...content, pricing: newP });
                                                                            }}
                                                                            className={`w-12 h-6 rounded-full transition-all relative ${plan.highlight ? 'bg-[#ea580c]' : 'bg-slate-200'}`}
                                                                        >
                                                                            <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${plan.highlight ? 'left-7' : 'left-1'}`} />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="space-y-2">
                                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">FİYATLANDIRMA</label>
                                                                <div className="flex gap-3">
                                                                    <div className="relative flex-1">
                                                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ea580c] font-black text-lg">₺</span>
                                                                        <input
                                                                            value={plan.price.replace('₺', '')}
                                                                            onChange={(e) => {
                                                                                const newP = [...content.pricing];
                                                                                newP[idx].price = '₺' + e.target.value;
                                                                                setContent({ ...content, pricing: newP });
                                                                            }}
                                                                            className="w-full pl-9 p-4 bg-white border-2 border-slate-50 rounded-2xl font-black text-2xl text-gray-900 focus:border-[#ea580c] outline-none transition-all placeholder:text-slate-200"
                                                                            placeholder="490"
                                                                        />
                                                                    </div>
                                                                    <input
                                                                        value={plan.period}
                                                                        onChange={(e) => {
                                                                            const newP = [...content.pricing];
                                                                            newP[idx].period = e.target.value;
                                                                            setContent({ ...content, pricing: newP });
                                                                        }}
                                                                        className="w-24 p-4 bg-slate-100/50 border-2 border-slate-50 rounded-2xl text-[10px] font-black text-slate-400 text-center uppercase tracking-widest focus:bg-white focus:border-[#ea580c] outline-none transition-all"
                                                                        placeholder="/AY"
                                                                    />
                                                                </div>
                                                            </div>

                                                            <button
                                                                onClick={() => {
                                                                    const newP = [...content.pricing];
                                                                    newP.splice(idx, 1);
                                                                    setContent({ ...content, pricing: newP });
                                                                }}
                                                                className="mt-6 flex items-center justify-center gap-2 py-3 rounded-xl border border-rose-100 bg-rose-50 text-rose-500 text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all active:scale-95"
                                                            >
                                                                <Trash2 size={14} strokeWidth={3} /> Bu Paketi Arşivle
                                                            </button>
                                                        </div>

                                                        <div className="flex-1 flex flex-col gap-6">
                                                            <div className="space-y-2">
                                                                <div className="flex justify-between items-center ml-1">
                                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ÖZELLİK LİSTESİ</label>
                                                                    <span className="text-[9px] text-slate-300 font-bold italic">Her satır bir madde</span>
                                                                </div>
                                                                <textarea
                                                                    value={plan.features.join("\n")}
                                                                    onChange={(e) => {
                                                                        const newP = [...content.pricing];
                                                                        newP[idx].features = e.target.value.split("\n");
                                                                        setContent({ ...content, pricing: newP });
                                                                    }}
                                                                    className="w-full p-6 bg-white border-2 border-slate-50 rounded-[32px] text-sm font-bold text-slate-600 min-h-[160px] outline-none focus:border-[#ea580c] transition-all resize-none placeholder:text-slate-200"
                                                                    placeholder="Örn: QR Menü&#10;Sipariş Takibi&#10;7/24 Destek"
                                                                />
                                                            </div>

                                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                                <div className="space-y-2">
                                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">BUTON METNİ</label>
                                                                    <input
                                                                        value={plan.cta}
                                                                        onChange={(e) => {
                                                                            const newP = [...content.pricing];
                                                                            newP[idx].cta = e.target.value;
                                                                            setContent({ ...content, pricing: newP });
                                                                        }}
                                                                        className="w-full p-4 bg-slate-50 border-2 border-slate-50 rounded-2xl text-xs font-black text-gray-900 focus:bg-white focus:border-[#ea580c] transition-all"
                                                                        placeholder="Hemen Başla"
                                                                    />
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ALT AÇIKLAMA</label>
                                                                    <input
                                                                        value={plan.desc}
                                                                        onChange={(e) => {
                                                                            const newP = [...content.pricing];
                                                                            newP[idx].desc = e.target.value;
                                                                            setContent({ ...content, pricing: newP });
                                                                        }}
                                                                        className="w-full p-4 bg-slate-50 border-2 border-slate-50 rounded-2xl text-xs font-bold text-slate-400 focus:bg-white focus:border-[#ea580c] transition-all"
                                                                        placeholder="Büyük işletmeler için..."
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            <button
                                                onClick={() => setContent({ ...content, pricing: [...content.pricing, { name: "Yeni Plan", price: "₺0", period: "/ay", desc: "", features: [], cta: "Seç", highlight: false }] })}
                                                className="w-full py-10 border-4 border-dashed border-slate-100 rounded-[40px] text-slate-300 font-black text-sm uppercase tracking-[0.2em] hover:border-[#ea580c] hover:text-[#ea580c] hover:bg-orange-50/30 transition-all flex flex-col items-center justify-center gap-4 group active:scale-[0.98]"
                                            >
                                                <div className="w-16 h-16 rounded-3xl border-2 border-slate-100 group-hover:border-[#ea580c] flex items-center justify-center transition-all bg-white group-hover:scale-110 shadow-sm">
                                                    <Plus size={32} strokeWidth={3} />
                                                </div>
                                                YENİ FİYAT PAKETİ EKLE
                                            </button>
                                        </div>
                                    )}

                                    {/* Testimonials Section */}
                                    {activeTab === "testimonials" && (
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                {content.testimonials.map((t, idx) => (
                                                    <div key={idx} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm relative group hover:shadow-2xl hover:shadow-slate-200/40 transition-all">
                                                        <button
                                                            onClick={() => {
                                                                const newT = [...content.testimonials];
                                                                newT.splice(idx, 1);
                                                                setContent({ ...content, testimonials: newT });
                                                            }}
                                                            className="absolute -top-3 -right-3 w-8 h-8 bg-rose-500 text-white rounded-xl flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all z-10 hover:scale-110 active:scale-90"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                        <div className="flex flex-col gap-6">
                                                            <div className="flex flex-col gap-4">
                                                                <div className="space-y-1">
                                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">AD SOYAD</label>
                                                                    <input
                                                                        value={t.name}
                                                                        onChange={(e) => {
                                                                            const newT = [...content.testimonials];
                                                                            newT[idx].name = e.target.value;
                                                                            setContent({ ...content, testimonials: newT });
                                                                        }}
                                                                        className="w-full text-base font-black text-gray-900 bg-transparent border-b-2 border-slate-50 focus:border-[#ea580c] outline-none transition-all placeholder:text-slate-200"
                                                                        placeholder="İsim Soyisim"
                                                                    />
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">İŞLETME / ROL</label>
                                                                    <input
                                                                        value={t.role}
                                                                        onChange={(e) => {
                                                                            const newT = [...content.testimonials];
                                                                            newT[idx].role = e.target.value;
                                                                            setContent({ ...content, testimonials: newT });
                                                                        }}
                                                                        className="w-full text-xs font-bold text-[#ea580c] bg-transparent border-b-2 border-slate-50 focus:border-[#ea580c] outline-none transition-all placeholder:text-slate-200"
                                                                        placeholder="Örn: Gurme Burger"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="space-y-1.5">
                                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">DENEYİM METNİ</label>
                                                                <textarea
                                                                    value={t.text}
                                                                    onChange={(e) => {
                                                                        const newT = [...content.testimonials];
                                                                        newT[idx].text = e.target.value;
                                                                        setContent({ ...content, testimonials: newT });
                                                                    }}
                                                                    className="w-full text-sm text-slate-500 font-bold italic leading-relaxed min-h-[100px] outline-none border-2 border-slate-50 p-4 rounded-2xl bg-slate-50/50 focus:bg-white focus:border-[#ea580c] transition-all resize-none"
                                                                    placeholder="Yorum metni..."
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                                <button
                                                    onClick={() => setContent({ ...content, testimonials: [...content.testimonials, { name: "Ad Soyad", role: "Restoran Adı", text: "Yorumunuz buraya..." }] })}
                                                    className="border-2 border-dashed border-slate-200 rounded-[32px] flex flex-col items-center justify-center p-12 text-slate-300 hover:border-[#ea580c] hover:text-[#ea580c] hover:bg-orange-50/30 transition-all font-black uppercase tracking-widest active:scale-95 group"
                                                >
                                                    <div className="w-14 h-14 rounded-2xl border-2 border-slate-100 group-hover:border-[#ea580c] flex items-center justify-center transition-all bg-white group-hover:scale-110 mb-3">
                                                        <Plus size={28} strokeWidth={3} />
                                                    </div>
                                                    YENİ YORUM EKLE
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Branding Section */}
                                    {activeTab === "branding" && (
                                        <div className="space-y-10">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">PLATFORM İSMİ</label>
                                                    <input
                                                        value={content.branding?.siteName || ""}
                                                        onChange={(e) => updateContent("branding.siteName", e.target.value)}
                                                        className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 bg-slate-50 text-sm font-black text-gray-900 focus:bg-white focus:border-[#ea580c] outline-none transition-all placeholder:text-slate-300"
                                                        placeholder="QRlamenü"
                                                    />
                                                </div>
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">LOGO URL (OPSİYONEL)</label>
                                                    <input
                                                        value={content.branding?.logoUrl || ""}
                                                        onChange={(e) => updateContent("branding.logoUrl", e.target.value)}
                                                        className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 bg-slate-50 text-sm font-bold text-slate-600 focus:bg-white focus:border-[#ea580c] outline-none transition-all placeholder:text-slate-300"
                                                        placeholder="https://example.com/logo.png"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">PLATFORM İKONU SEÇİN</label>
                                                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-11 gap-3 p-6 bg-slate-50 rounded-[32px] border-2 border-slate-50 shadow-inner">
                                                    {ICON_LIST.map(ic => (
                                                        <button
                                                            key={ic.name}
                                                            onClick={() => updateContent("branding.logoIcon", ic.name)}
                                                            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${content.branding?.logoIcon === ic.name ? 'bg-[#ea580c] text-white shadow-xl shadow-orange-500/30 scale-110' : 'bg-white text-slate-400 hover:text-slate-900 hover:shadow-lg'}`}
                                                        >
                                                            <ic.icon size={20} />
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === "corporate" && (
                                        <div className="space-y-8">
                                            <div className="p-8 bg-white rounded-[40px] border border-slate-100 shadow-sm space-y-6">
                                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-[#ea580c]"></div>
                                                    HAKKIMIZDA BÖLÜMÜ
                                                </h3>
                                                <div className="space-y-4">
                                                    <input
                                                        value={content.corporate?.about?.title || ""}
                                                        onChange={(e) => updateContent("corporate.about.title", e.target.value)}
                                                        className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 bg-slate-50 text-sm font-black text-gray-900 focus:bg-white focus:border-[#ea580c] outline-none transition-all placeholder:text-slate-300"
                                                        placeholder="Başlık (Örn: Restoranların dijital ortağıyız)"
                                                    />
                                                    <textarea
                                                        value={content.corporate?.about?.content || ""}
                                                        onChange={(e) => updateContent("corporate.about.content", e.target.value)}
                                                        className="w-full px-6 py-5 rounded-2xl border-2 border-slate-50 bg-slate-50 text-sm font-bold text-slate-500 leading-relaxed min-h-[140px] focus:bg-white focus:border-[#ea580c] transition-all resize-none outline-none"
                                                        placeholder="Vizyon ve misyonunuzdan bahsedin..."
                                                    />
                                                </div>
                                            </div>

                                            <div className="p-8 bg-white rounded-[40px] border border-slate-100 shadow-sm space-y-6">
                                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                                    İLETİŞİM KANALLARI
                                                </h3>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                    <input value={content.corporate?.contact?.email || ""} onChange={(e) => updateContent("corporate.contact.email", e.target.value)} className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 bg-slate-50 text-sm font-bold text-gray-900 focus:bg-white focus:border-[#ea580c] outline-none transition-all" placeholder="Kurumsal E-posta" />
                                                    <input value={content.corporate?.contact?.phone || ""} onChange={(e) => updateContent("corporate.contact.phone", e.target.value)} className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 bg-slate-50 text-sm font-bold text-gray-900 focus:bg-white focus:border-[#ea580c] outline-none transition-all" placeholder="İletişim Telefonu" />
                                                </div>
                                                <input value={content.corporate?.contact?.address || ""} onChange={(e) => updateContent("corporate.contact.address", e.target.value)} className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 bg-slate-50 text-sm font-bold text-gray-900 focus:bg-white focus:border-[#ea580c] outline-none transition-all" placeholder="Fiziksel Ofis Adresi" />
                                            </div>

                                            <div className="p-8 bg-white rounded-[40px] border border-slate-100 shadow-sm space-y-6">
                                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                                                    HUKUKİ DAYANAKLAR
                                                </h3>
                                                <div className="grid grid-cols-1 gap-6">
                                                    <div className="space-y-2">
                                                        <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest ml-1">GİZLİLİK POLİTİKASI GİRİŞ</label>
                                                        <textarea value={content.corporate?.legal?.privacy || ""} onChange={(e) => updateContent("corporate.legal.privacy", e.target.value)} className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 bg-slate-50 text-sm font-bold text-slate-500 min-h-[80px] focus:bg-white focus:border-[#ea580c] transition-all outline-none resize-none" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest ml-1">KULLANIM KOŞULLARI GİRİŞ</label>
                                                        <textarea value={content.corporate?.legal?.terms || ""} onChange={(e) => updateContent("corporate.legal.terms", e.target.value)} className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 bg-slate-50 text-sm font-bold text-slate-500 min-h-[80px] focus:bg-white focus:border-[#ea580c] transition-all outline-none resize-none" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Right Side: Live Preview Frame */}
                    <div className="sticky top-8 hidden lg:block">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Eye size={12} /> Canlı Ön İzleme (Mobil)
                            </span>
                            <div className="flex space-x-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-400/20"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-amber-400/20"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/20"></div>
                            </div>
                        </div>

                        <div className="w-full h-[650px] bg-white rounded-[40px] border-[8px] border-slate-900 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden relative">
                            {/* Device Notch */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-6 bg-slate-900 rounded-b-3xl z-30"></div>

                            {/* Preview Content */}
                            <div className="h-full overflow-y-auto hide-scrollbar bg-white">
                                {/* Header Simple */}
                                <div className="p-4 flex items-center justify-between border-b border-slate-50 sticky top-0 bg-white/80 backdrop-blur-md z-20">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-6 h-6 bg-black rounded-lg flex items-center justify-center text-white"><UtensilsCrossed size={12} /></div>
                                        <span className="font-black text-xs">QRlamenü</span>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-900"><Menu size={16} /></div>
                                </div>

                                {/* Hero Preview */}
                                <div className="p-6 pt-12 text-center bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:10px_10px]">
                                    <div className="inline-block px-2 py-1 rounded-full bg-slate-100 text-[8px] font-bold text-slate-500 mb-4 tracking-tight border border-slate-200">Restoran Yönetiminde Yeni Dönem</div>
                                    <h2 className="text-xl font-black text-slate-900 mb-3 leading-tight whitespace-pre-line break-words">{content.hero.title}</h2>
                                    <p className="text-[10px] text-slate-500 mb-6 leading-relaxed line-clamp-3">{content.hero.subtitle}</p>
                                    <div className="flex flex-col gap-2 px-6">
                                        <div className="py-2 bg-black text-white rounded-lg text-[9px] font-black">{content.hero.cta_primary}</div>
                                        <div className="py-2 bg-white border border-slate-200 text-slate-900 rounded-lg text-[9px] font-black">{content.hero.cta_secondary}</div>
                                    </div>
                                </div>

                                {/* Features List Preview */}
                                <div className="p-6">
                                    <div className="text-[8px] font-black text-orange-600 mb-1 uppercase tracking-widest text-center">Özellikler</div>
                                    <div className="text-[13px] font-black text-center mb-6 leading-tight">İşinizi Profesyonelce Yönetin</div>
                                    <div className="grid gap-3">
                                        {content.features.slice(0, 3).map((f, i) => (
                                            <div key={i} className="p-4 rounded-2xl border border-slate-50 bg-slate-50/30">
                                                <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-orange-600 mb-3">
                                                    {(() => {
                                                        const IconComp = ICON_LIST.find(ic => ic.name === f.icon)?.icon || QrCode;
                                                        return <IconComp size={16} />;
                                                    })()}
                                                </div>
                                                <div className="font-black text-[11px] mb-1">{f.title}</div>
                                                <div className="text-[9px] text-slate-500 leading-snug line-clamp-2">{f.desc}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Pricing List Preview */}
                                <div className="p-6 pt-0">
                                    <div className="text-[8px] font-black text-slate-400 mb-1 uppercase tracking-widest text-center">Planlar</div>
                                    <div className="grid gap-3 mt-4">
                                        {content.pricing.map((p, i) => (
                                            <div key={i} className={`p-4 rounded-2xl border ${p.highlight ? 'bg-black text-white' : 'bg-white border-slate-100'}`}>
                                                <div className="text-[8px] font-black text-slate-500 mb-1">{p.name}</div>
                                                <div className="text-lg font-black">{p.price}<span className="text-[8px] font-medium opacity-50 ml-0.5">{p.period}</span></div>
                                                <div className="mt-3 py-1.5 bg-orange-600 text-white rounded-lg text-[8px] font-bold text-center">
                                                    {p.cta}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Bar Home Indicator */}
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-900/10 rounded-full z-30"></div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
