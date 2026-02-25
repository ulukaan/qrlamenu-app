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
        <div className="px-6 py-8 w-full max-w-full">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-[6px] shadow-sm border border-slate-200 flex items-center justify-center text-slate-700">
                            <Globe size={20} />
                        </div>
                        <div>
                            <h1 className="text-[20px] font-semibold text-slate-900 tracking-tight leading-none uppercase">Website Yönetimi</h1>
                            <p className="text-[13px] text-slate-500 mt-1 font-medium">Görsel kimliğinizi ve ana sayfa içeriklerinizi buradan yönetin.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <button
                            onClick={handleReset}
                            className="flex-1 md:flex-none h-9 px-4 rounded-[6px] bg-white text-slate-700 font-semibold text-[13px] hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 border border-slate-200 shadow-sm"
                        >
                            <RefreshCcw size={14} /> Varsayılan
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex-1 md:flex-none h-9 px-4 rounded-[6px] bg-slate-900 text-white font-semibold text-[13px] hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                        >
                            {saving ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
                            {saving ? 'Kaydediliyor...' : 'Yayına Al'}
                        </button>
                    </div>
                </div>

                {message && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`p-3 rounded-[6px] mb-6 flex items-center gap-2 border shadow-sm ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}
                    >
                        <div className={`w-6 h-6 rounded-[4px] flex items-center justify-center ${message.type === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                            {message.type === 'success' ? <Check size={14} /> : <AlertCircle size={14} />}
                        </div>
                        <span className="font-medium text-[13px]">{message.text}</span>
                    </motion.div>
                )}

                <div className="grid lg:grid-cols-[1fr_360px] gap-6 items-start">

                    {/* Left Side: Editor */}
                    <div className="bg-white border border-slate-200 rounded-[6px] overflow-hidden shadow-sm flex flex-col">

                        {/* Tabs Navigation */}
                        <div className="flex border-b border-slate-200 bg-slate-50 px-2 pt-2 gap-1 overflow-x-auto hide-scrollbar">
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
                                    className={`relative min-w-max px-4 py-2.5 text-[13px] font-semibold flex items-center gap-2 transition-colors ${activeTab === tab.id ? 'text-slate-900 bg-white border-t border-l border-r border-slate-200 rounded-t-[6px] pb-[11px]' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100/50 rounded-t-[6px] border border-transparent'}`}
                                    style={{ marginBottom: activeTab === tab.id ? '-1px' : '0' }}
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
                                        <div className="space-y-5">
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center justify-between">
                                                    <label className="text-[12px] font-semibold text-slate-700">Ana Başlık (H1)</label>
                                                    <span className="text-[11px] text-slate-400 italic">"\n" ile alt satıra geçebilirsiniz</span>
                                                </div>
                                                <textarea
                                                    value={content.hero.title}
                                                    onChange={(e) => updateContent("hero.title", e.target.value)}
                                                    className="w-full px-3 py-2 rounded-[6px] border border-slate-200 bg-white text-[14px] font-medium text-slate-900 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 outline-none transition-all placeholder:text-slate-400 resize-y min-h-[100px]"
                                                    placeholder="Mükemmel restoran..."
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label className="text-[12px] font-semibold text-slate-700">Alt Açıklama (Subtitle)</label>
                                                <textarea
                                                    value={content.hero.subtitle}
                                                    onChange={(e) => updateContent("hero.subtitle", e.target.value)}
                                                    className="w-full px-3 py-2 rounded-[6px] border border-slate-200 bg-white text-[13px] font-medium text-slate-700 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 outline-none transition-all placeholder:text-slate-400 resize-y min-h-[100px]"
                                                    placeholder="Siparişleri hızlandırın..."
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="flex flex-col gap-2">
                                                    <label className="text-[12px] font-semibold text-slate-700">Giriş Yap / Dene Butonu</label>
                                                    <input
                                                        value={content.hero.cta_primary}
                                                        onChange={(e) => updateContent("hero.cta_primary", e.target.value)}
                                                        className="w-full h-9 px-3 rounded-[6px] border border-slate-200 bg-white text-[13px] font-medium text-slate-900 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 outline-none transition-all"
                                                    />
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <label className="text-[12px] font-semibold text-slate-700">Özellikler Butonu</label>
                                                    <input
                                                        value={content.hero.cta_secondary}
                                                        onChange={(e) => updateContent("hero.cta_secondary", e.target.value)}
                                                        className="w-full h-9 px-3 rounded-[6px] border border-slate-200 bg-white text-[13px] font-medium text-slate-900 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 outline-none transition-all"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Stats Section */}
                                    {activeTab === "stats" && (
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {(content.stats || []).map((stat, idx) => (
                                                    <div key={idx} className="bg-slate-50 p-4 rounded-[6px] border border-slate-200 flex flex-col gap-3">
                                                        <div className="flex flex-col gap-1.5">
                                                            <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-widest">DEĞER (Value)</label>
                                                            <input
                                                                value={stat.value}
                                                                onChange={(e) => {
                                                                    const newS = [...(content.stats || [])];
                                                                    newS[idx].value = e.target.value;
                                                                    setContent({ ...content, stats: newS });
                                                                }}
                                                                className="w-full h-8 px-3 rounded-[4px] border border-slate-200 bg-white font-semibold text-indigo-600 text-[14px] focus:border-indigo-400 outline-none transition-all"
                                                                placeholder="5.000+"
                                                            />
                                                        </div>
                                                        <div className="flex flex-col gap-1.5">
                                                            <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-widest">ETİKET (Label)</label>
                                                            <input
                                                                value={stat.label}
                                                                onChange={(e) => {
                                                                    const newS = [...(content.stats || [])];
                                                                    newS[idx].label = e.target.value;
                                                                    setContent({ ...content, stats: newS });
                                                                }}
                                                                className="w-full h-8 px-3 rounded-[4px] border border-slate-200 bg-white font-medium text-slate-700 text-[13px] focus:border-slate-400 outline-none transition-all"
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
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {content.features.map((feature, idx) => (
                                                    <div key={idx} className="bg-white p-5 rounded-[6px] border border-slate-200 relative group shadow-sm transition-all flex flex-col gap-4">
                                                        <button
                                                            onClick={() => {
                                                                const newF = [...content.features];
                                                                newF.splice(idx, 1);
                                                                setContent({ ...content, features: newF });
                                                            }}
                                                            className="absolute -top-2.5 -right-2.5 w-6 h-6 bg-rose-50 text-rose-600 border border-rose-200 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-10 hover:bg-rose-500 hover:text-white"
                                                        >
                                                            <Trash2 size={12} />
                                                        </button>
                                                        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                                                            {/* Icon Selector Button */}
                                                            <div className="relative group/icon">
                                                                <div className="w-10 h-10 bg-slate-50 rounded-[6px] border border-slate-200 flex items-center justify-center text-slate-700 cursor-pointer hover:bg-slate-100 transition-colors">
                                                                    {(() => {
                                                                        const IconComp = ICON_LIST.find(i => i.name === feature.icon)?.icon || QrCode;
                                                                        return <IconComp size={18} />;
                                                                    })()}
                                                                </div>
                                                                <div className="absolute top-full left-0 mt-2 bg-white border border-slate-200 rounded-[6px] shadow-lg p-2 grid grid-cols-4 gap-1 z-20 opacity-0 pointer-events-none group-focus-within/icon:opacity-100 group-focus-within/icon:pointer-events-auto transition-all w-[180px]">
                                                                    {ICON_LIST.map(ic => (
                                                                        <button
                                                                            key={ic.name}
                                                                            onClick={() => {
                                                                                const newF = [...content.features];
                                                                                newF[idx].icon = ic.name;
                                                                                setContent({ ...content, features: newF });
                                                                            }}
                                                                            className={`p-2 rounded-[4px] hover:bg-slate-50 transition-colors flex justify-center items-center ${feature.icon === ic.name ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500'}`}
                                                                        >
                                                                            <ic.icon size={16} />
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            <div className="flex-1">
                                                                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block mb-0.5">BAŞLIK</label>
                                                                <input
                                                                    value={feature.title}
                                                                    onChange={(e) => {
                                                                        const newF = [...content.features];
                                                                        newF[idx].title = e.target.value;
                                                                        setContent({ ...content, features: newF });
                                                                    }}
                                                                    className="w-full bg-transparent border-none outline-none text-[14px] font-semibold text-slate-900 placeholder:text-slate-400"
                                                                    placeholder="Özellik Başlığı"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col gap-1.5 flex-1">
                                                            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">AÇIKLAMA</label>
                                                            <textarea
                                                                value={feature.desc}
                                                                onChange={(e) => {
                                                                    const newF = [...content.features];
                                                                    newF[idx].desc = e.target.value;
                                                                    setContent({ ...content, features: newF });
                                                                }}
                                                                className="w-full h-full bg-slate-50 px-3 py-2.5 rounded-[4px] border border-slate-200 text-[13px] text-slate-700 font-medium min-h-[80px] outline-none focus:bg-white focus:border-slate-400 transition-colors resize-none"
                                                                placeholder="Özellik açıklaması..."
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                                <button
                                                    onClick={() => setContent({ ...content, features: [...content.features, { icon: "CheckCircle2", title: "Yeni Özellik", desc: "Açıklama giriniz" }] })}
                                                    className="border border-dashed border-slate-300 rounded-[6px] flex flex-col items-center justify-center gap-3 p-8 text-slate-500 hover:border-slate-400 hover:bg-slate-50 hover:text-slate-700 transition-colors font-semibold group min-h-[220px]"
                                                >
                                                    <div className="w-10 h-10 rounded-[6px] bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-slate-700 shadow-sm transition-colors">
                                                        <Plus size={20} />
                                                    </div>
                                                    <span className="text-[13px]">Yeni Özellik Ekle</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Pricing Section */}
                                    {activeTab === "pricing" && (
                                        <div className="space-y-4">
                                            {content.pricing.map((plan, idx) => (
                                                <div key={idx} className={`p-6 rounded-[6px] border shadow-sm transition-all relative overflow-hidden group ${plan.highlight ? 'border-orange-500 bg-orange-50/10' : 'border-slate-200 bg-white'}`}>
                                                    {plan.highlight && (
                                                        <div className="absolute top-4 -right-12 rotate-45 bg-orange-500 text-white text-[10px] font-bold px-12 py-1 shadow-sm tracking-widest z-10">
                                                            POPÜLER
                                                        </div>
                                                    )}

                                                    <div className="flex flex-col md:flex-row gap-6">
                                                        <div className="w-full md:w-1/3 flex flex-col gap-4">
                                                            <div className="space-y-1.5">
                                                                <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-widest">PLAN ADI</label>
                                                                <div className="flex items-center gap-3">
                                                                    <input
                                                                        value={plan.name}
                                                                        onChange={(e) => {
                                                                            const newP = [...content.pricing];
                                                                            newP[idx].name = e.target.value;
                                                                            setContent({ ...content, pricing: newP });
                                                                        }}
                                                                        className="flex-1 h-9 bg-white border border-slate-200 px-3 rounded-[4px] text-[14px] font-semibold text-slate-900 outline-none focus:border-slate-400 transition-colors"
                                                                        placeholder="Plan Adı"
                                                                    />
                                                                    <div className="flex flex-col items-center gap-1 group/toggle shrink-0">
                                                                        <label className="text-[9px] font-semibold text-slate-500 uppercase">ÖNE ÇIKAR</label>
                                                                        <button
                                                                            onClick={() => {
                                                                                const newP = [...content.pricing];
                                                                                newP[idx].highlight = !newP[idx].highlight;
                                                                                setContent({ ...content, pricing: newP });
                                                                            }}
                                                                            className={`w-10 h-5 rounded-full transition-all relative ${plan.highlight ? 'bg-orange-500' : 'bg-slate-300'}`}
                                                                        >
                                                                            <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-[3px] transition-all shadow-sm ${plan.highlight ? 'left-6' : 'left-1'}`} />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="space-y-1.5">
                                                                <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-widest">FİYATLANDIRMA</label>
                                                                <div className="flex gap-2">
                                                                    <div className="relative flex-1">
                                                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-semibold text-[14px]">₺</span>
                                                                        <input
                                                                            value={plan.price.replace('₺', '')}
                                                                            onChange={(e) => {
                                                                                const newP = [...content.pricing];
                                                                                newP[idx].price = '₺' + e.target.value;
                                                                                setContent({ ...content, pricing: newP });
                                                                            }}
                                                                            className="w-full h-9 pl-7 pr-3 bg-white border border-slate-200 rounded-[4px] font-semibold text-[15px] text-slate-900 focus:border-slate-400 outline-none transition-colors placeholder:text-slate-300"
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
                                                                        className="w-16 h-9 px-2 bg-slate-50 border border-slate-200 rounded-[4px] text-[11px] font-semibold text-slate-500 text-center uppercase tracking-widest focus:bg-white focus:border-slate-400 outline-none transition-colors"
                                                                        placeholder="/ay"
                                                                    />
                                                                </div>
                                                            </div>

                                                            <button
                                                                onClick={() => {
                                                                    const newP = [...content.pricing];
                                                                    newP.splice(idx, 1);
                                                                    setContent({ ...content, pricing: newP });
                                                                }}
                                                                className="mt-auto h-8 flex items-center justify-center gap-1.5 rounded-[4px] border border-rose-200 bg-white text-rose-600 text-[11px] font-semibold hover:bg-rose-50 transition-colors"
                                                            >
                                                                <Trash2 size={12} strokeWidth={2} /> Paket Sil
                                                            </button>
                                                        </div>

                                                        <div className="flex-1 flex flex-col gap-4">
                                                            <div className="space-y-1.5">
                                                                <div className="flex justify-between items-center">
                                                                    <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-widest">ÖZELLİK LİSTESİ</label>
                                                                    <span className="text-[10px] text-slate-400 italic font-medium">Her satır bir madde</span>
                                                                </div>
                                                                <textarea
                                                                    value={plan.features.join("\n")}
                                                                    onChange={(e) => {
                                                                        const newP = [...content.pricing];
                                                                        newP[idx].features = e.target.value.split("\n");
                                                                        setContent({ ...content, pricing: newP });
                                                                    }}
                                                                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-[4px] text-[13px] font-medium text-slate-700 min-h-[100px] outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-colors resize-y placeholder:text-slate-300"
                                                                    placeholder="Örn: QR Menü&#10;Sipariş Takibi&#10;7/24 Destek"
                                                                />
                                                            </div>

                                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                                <div className="space-y-1.5">
                                                                    <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-widest">BUTON METNİ</label>
                                                                    <input
                                                                        value={plan.cta}
                                                                        onChange={(e) => {
                                                                            const newP = [...content.pricing];
                                                                            newP[idx].cta = e.target.value;
                                                                            setContent({ ...content, pricing: newP });
                                                                        }}
                                                                        className="w-full h-9 px-3 bg-white border border-slate-200 rounded-[4px] text-[13px] font-medium text-slate-900 focus:border-slate-400 transition-colors"
                                                                        placeholder="Hemen Başla"
                                                                    />
                                                                </div>
                                                                <div className="space-y-1.5">
                                                                    <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-widest">ALT AÇIKLAMA</label>
                                                                    <input
                                                                        value={plan.desc}
                                                                        onChange={(e) => {
                                                                            const newP = [...content.pricing];
                                                                            newP[idx].desc = e.target.value;
                                                                            setContent({ ...content, pricing: newP });
                                                                        }}
                                                                        className="w-full h-9 px-3 bg-white border border-slate-200 rounded-[4px] text-[13px] font-medium text-slate-700 focus:border-slate-400 transition-colors"
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
                                                className="w-full h-12 border border-dashed border-slate-300 rounded-[6px] text-slate-500 font-semibold text-[13px] hover:border-slate-400 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                                            >
                                                <Plus size={16} /> Yeni Fiyat Paketi Ekle
                                            </button>
                                        </div>
                                    )}

                                    {/* Testimonials Section */}
                                    {activeTab === "testimonials" && (
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {content.testimonials.map((t, idx) => (
                                                    <div key={idx} className="bg-white p-5 rounded-[6px] border border-slate-200 shadow-sm relative group transition-colors flex flex-col gap-4">
                                                        <button
                                                            onClick={() => {
                                                                const newT = [...content.testimonials];
                                                                newT.splice(idx, 1);
                                                                setContent({ ...content, testimonials: newT });
                                                            }}
                                                            className="absolute -top-2.5 -right-2.5 w-6 h-6 bg-rose-50 text-rose-600 border border-rose-200 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-10 hover:bg-rose-500 hover:text-white"
                                                        >
                                                            <Trash2 size={12} />
                                                        </button>
                                                        <div className="flex flex-col gap-3 border-b border-slate-100 pb-3">
                                                            <div className="space-y-1">
                                                                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">AD SOYAD</label>
                                                                <input
                                                                    value={t.name}
                                                                    onChange={(e) => {
                                                                        const newT = [...content.testimonials];
                                                                        newT[idx].name = e.target.value;
                                                                        setContent({ ...content, testimonials: newT });
                                                                    }}
                                                                    className="w-full text-[14px] font-semibold text-slate-900 bg-transparent border-none outline-none placeholder:text-slate-400"
                                                                    placeholder="İsim Soyisim"
                                                                />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">İŞLETME / ROL</label>
                                                                <input
                                                                    value={t.role}
                                                                    onChange={(e) => {
                                                                        const newT = [...content.testimonials];
                                                                        newT[idx].role = e.target.value;
                                                                        setContent({ ...content, testimonials: newT });
                                                                    }}
                                                                    className="w-full text-[13px] font-medium text-indigo-600 bg-transparent border-none outline-none placeholder:text-slate-400"
                                                                    placeholder="Örn: Gurme Burger"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col gap-1.5 flex-1">
                                                            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">DENEYİM METNİ</label>
                                                            <textarea
                                                                value={t.text}
                                                                onChange={(e) => {
                                                                    const newT = [...content.testimonials];
                                                                    newT[idx].text = e.target.value;
                                                                    setContent({ ...content, testimonials: newT });
                                                                }}
                                                                className="w-full h-full bg-slate-50 px-3 py-2.5 rounded-[4px] border border-slate-200 text-[13px] text-slate-700 italic font-medium min-h-[90px] outline-none focus:bg-white focus:border-slate-400 transition-colors resize-none"
                                                                placeholder="Yorum metni..."
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                                <button
                                                    onClick={() => setContent({ ...content, testimonials: [...content.testimonials, { name: "Ad Soyad", role: "Restoran Adı", text: "Yorumunuz buraya..." }] })}
                                                    className="border border-dashed border-slate-300 rounded-[6px] flex flex-col items-center justify-center gap-3 p-8 text-slate-500 hover:border-slate-400 hover:bg-slate-50 hover:text-slate-700 transition-colors font-semibold group min-h-[200px]"
                                                >
                                                    <div className="w-10 h-10 rounded-[6px] bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-slate-700 shadow-sm transition-colors">
                                                        <Plus size={20} />
                                                    </div>
                                                    <span className="text-[13px]">Yeni Yorum Ekle</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Branding Section */}
                                    {activeTab === "branding" && (
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="flex flex-col gap-1.5">
                                                    <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-widest">PLATFORM İSMİ</label>
                                                    <input
                                                        value={content.branding?.siteName || ""}
                                                        onChange={(e) => updateContent("branding.siteName", e.target.value)}
                                                        className="w-full h-9 px-3 bg-white border border-slate-200 rounded-[4px] text-[13px] font-medium text-slate-900 focus:border-slate-400 outline-none transition-colors"
                                                        placeholder="QRlamenü"
                                                    />
                                                </div>
                                                <div className="flex flex-col gap-1.5">
                                                    <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-widest">LOGO URL (OPSİYONEL)</label>
                                                    <input
                                                        value={content.branding?.logoUrl || ""}
                                                        onChange={(e) => updateContent("branding.logoUrl", e.target.value)}
                                                        className="w-full h-9 px-3 bg-white border border-slate-200 rounded-[4px] text-[13px] font-medium text-slate-900 focus:border-slate-400 outline-none transition-colors"
                                                        placeholder="https://example.com/logo.png"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-widest">PLATFORM İKONU SEÇİN</label>
                                                <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-11 gap-2 p-3 bg-slate-50 border border-slate-200 rounded-[6px]">
                                                    {ICON_LIST.map(ic => (
                                                        <button
                                                            key={ic.name}
                                                            onClick={() => updateContent("branding.logoIcon", ic.name)}
                                                            className={`h-10 rounded-[6px] flex items-center justify-center transition-colors border ${content.branding?.logoIcon === ic.name ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}
                                                        >
                                                            <ic.icon size={18} />
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === "corporate" && (
                                        <div className="space-y-4">
                                            <div className="p-5 bg-white border border-slate-200 rounded-[6px] shadow-sm flex flex-col gap-4">
                                                <h3 className="text-[11px] font-semibold text-slate-700 uppercase tracking-widest flex items-center gap-2 mb-1">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                                                    HAKKIMIZDA BÖLÜMÜ
                                                </h3>
                                                <div className="flex flex-col gap-3">
                                                    <input
                                                        value={content.corporate?.about?.title || ""}
                                                        onChange={(e) => updateContent("corporate.about.title", e.target.value)}
                                                        className="w-full h-9 px-3 bg-white border border-slate-200 rounded-[4px] text-[13px] font-medium text-slate-900 focus:border-slate-400 outline-none transition-colors"
                                                        placeholder="Başlık (Örn: Restoranların dijital ortağıyız)"
                                                    />
                                                    <textarea
                                                        value={content.corporate?.about?.content || ""}
                                                        onChange={(e) => updateContent("corporate.about.content", e.target.value)}
                                                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-[4px] text-[13px] font-medium text-slate-700 leading-relaxed min-h-[100px] outline-none focus:border-slate-400 resize-y transition-colors"
                                                        placeholder="Vizyon ve misyonunuzdan bahsedin..."
                                                    />
                                                </div>
                                            </div>

                                            <div className="p-5 bg-white border border-slate-200 rounded-[6px] shadow-sm flex flex-col gap-4">
                                                <h3 className="text-[11px] font-semibold text-slate-700 uppercase tracking-widest flex items-center gap-2 mb-1">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                                    İLETİŞİM KANALLARI
                                                </h3>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div className="flex flex-col gap-1.5">
                                                        <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">EMAİL</label>
                                                        <input value={content.corporate?.contact?.email || ""} onChange={(e) => updateContent("corporate.contact.email", e.target.value)} className="w-full h-9 px-3 bg-white border border-slate-200 rounded-[4px] text-[13px] font-medium text-slate-900 focus:border-slate-400 outline-none transition-colors" placeholder="Kurumsal E-posta" />
                                                    </div>
                                                    <div className="flex flex-col gap-1.5">
                                                        <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">TELEFON</label>
                                                        <input value={content.corporate?.contact?.phone || ""} onChange={(e) => updateContent("corporate.contact.phone", e.target.value)} className="w-full h-9 px-3 bg-white border border-slate-200 rounded-[4px] text-[13px] font-medium text-slate-900 focus:border-slate-400 outline-none transition-colors" placeholder="İletişim Telefonu" />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-1.5 mt-2">
                                                    <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">ADRES</label>
                                                    <input value={content.corporate?.contact?.address || ""} onChange={(e) => updateContent("corporate.contact.address", e.target.value)} className="w-full h-9 px-3 bg-white border border-slate-200 rounded-[4px] text-[13px] font-medium text-slate-900 focus:border-slate-400 outline-none transition-colors" placeholder="Fiziksel Ofis Adresi" />
                                                </div>
                                            </div>

                                            <div className="p-5 bg-white border border-slate-200 rounded-[6px] shadow-sm flex flex-col gap-4">
                                                <h3 className="text-[11px] font-semibold text-slate-700 uppercase tracking-widest flex items-center gap-2 mb-1">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                                                    HUKUKİ DAYANAKLAR
                                                </h3>
                                                <div className="flex flex-col gap-4 mt-2">
                                                    <div className="flex flex-col gap-1.5">
                                                        <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">GİZLİLİK POLİTİKASI GİRİŞ</label>
                                                        <textarea value={content.corporate?.legal?.privacy || ""} onChange={(e) => updateContent("corporate.legal.privacy", e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-[4px] text-[13px] font-medium text-slate-700 min-h-[80px] outline-none focus:border-slate-400 resize-y transition-colors" />
                                                    </div>
                                                    <div className="flex flex-col gap-1.5">
                                                        <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">KULLANIM KOŞULLARI GİRİŞ</label>
                                                        <textarea value={content.corporate?.legal?.terms || ""} onChange={(e) => updateContent("corporate.legal.terms", e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-[4px] text-[13px] font-medium text-slate-700 min-h-[80px] outline-none focus:border-slate-400 resize-y transition-colors" />
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
                            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <Eye size={12} /> Canlı Ön İzleme (Mobil)
                            </span>
                            <div className="flex space-x-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-slate-400"></div>
                            </div>
                        </div>

                        <div className="w-full h-[650px] bg-white rounded-[24px] border-[6px] border-slate-800 shadow-xl overflow-hidden relative">
                            {/* Device Notch */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-5 bg-slate-800 rounded-b-[12px] z-30"></div>

                            {/* Preview Content */}
                            <div className="h-full overflow-y-auto hide-scrollbar bg-slate-50">
                                {/* Header Simple */}
                                <div className="p-4 flex items-center justify-between border-b border-slate-200 sticky top-0 bg-white/90 backdrop-blur-md z-20">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 bg-slate-800 rounded-[4px] flex items-center justify-center text-white"><UtensilsCrossed size={12} /></div>
                                        <span className="font-semibold text-xs text-slate-900">QRlamenü</span>
                                    </div>
                                    <div className="w-8 h-8 rounded-[4px] bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center text-slate-700 cursor-pointer"><Menu size={16} /></div>
                                </div>

                                {/* Hero Preview */}
                                <div className="p-6 pt-12 text-center bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:16px_16px]">
                                    <div className="inline-block px-2.5 py-1 rounded-[4px] bg-white text-[9px] font-semibold text-indigo-600 mb-4 tracking-wider border border-indigo-100 shadow-sm uppercase">Restoran Yönetiminde Yeni Dönem</div>
                                    <h2 className="text-xl font-bold text-slate-900 mb-3 leading-tight whitespace-pre-line break-words">{content.hero.title}</h2>
                                    <p className="text-[11px] text-slate-600 mb-6 leading-relaxed line-clamp-3 px-2 font-medium">{content.hero.subtitle}</p>
                                    <div className="flex flex-col gap-2 px-6">
                                        <div className="py-2.5 bg-slate-900 text-white rounded-[6px] text-[10px] font-semibold uppercase tracking-wide cursor-pointer">{content.hero.cta_primary}</div>
                                        <div className="py-2.5 bg-white border border-slate-300 text-slate-700 rounded-[6px] text-[10px] font-semibold uppercase tracking-wide cursor-pointer">{content.hero.cta_secondary}</div>
                                    </div>
                                </div>

                                {/* Features List Preview */}
                                <div className="p-6">
                                    <div className="text-[10px] font-bold text-indigo-600 mb-1 uppercase tracking-widest text-center">Özellikler</div>
                                    <div className="text-[14px] font-semibold text-slate-900 text-center mb-6 leading-tight">İşinizi Profesyonelce Yönetin</div>
                                    <div className="grid gap-3">
                                        {content.features.slice(0, 3).map((f, i) => (
                                            <div key={i} className="p-4 rounded-[6px] border border-slate-200 bg-white shadow-sm flex flex-col items-center text-center">
                                                <div className="w-10 h-10 rounded-[6px] bg-indigo-50 flex items-center justify-center text-indigo-600 mb-3">
                                                    {(() => {
                                                        const IconComp = ICON_LIST.find(ic => ic.name === f.icon)?.icon || QrCode;
                                                        return <IconComp size={18} />;
                                                    })()}
                                                </div>
                                                <div className="font-semibold text-[12px] text-slate-900 mb-1.5">{f.title}</div>
                                                <div className="text-[10px] text-slate-600 leading-relaxed font-medium line-clamp-2">{f.desc}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Pricing List Preview */}
                                <div className="p-6 pt-0">
                                    <div className="text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-widest text-center">Planlar</div>
                                    <div className="grid gap-3 mt-4">
                                        {content.pricing.map((p, i) => (
                                            <div key={i} className={`p-4 rounded-[6px] border ${p.highlight ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-200 text-slate-900'} shadow-sm`}>
                                                <div className={`text-[9px] font-bold mb-1.5 ${p.highlight ? 'text-indigo-300' : 'text-slate-500 uppercase'}`}>{p.name}</div>
                                                <div className="text-xl font-bold">{p.price}<span className={`text-[9px] font-medium ml-1 ${p.highlight ? 'text-slate-400' : 'text-slate-500'}`}>{p.period}</span></div>
                                                <div className={`mt-4 py-2 w-full rounded-[4px] text-[9px] font-bold text-center uppercase tracking-wide cursor-pointer ${p.highlight ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-800'}`}>
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
