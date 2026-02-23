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
                            className="bg-white text-slate-600 px-5 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-all border border-slate-200"
                        >
                            <RefreshCcw size={18} /> Varsayılana Dön
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="bg-orange-600 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-orange-700 transition-all shadow-xl shadow-orange-600/20 disabled:opacity-50"
                        >
                            {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                            {saving ? 'Güncelleniyor...' : 'Yayına Al'}
                        </button>
                    </div>
                </div>

                {message && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`p-5 rounded-3xl mb-8 flex items-center gap-4 border shadow-sm ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'}`}
                    >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${message.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                            {message.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
                        </div>
                        <span className="font-bold">{message.text}</span>
                    </motion.div>
                )}

                <div className="grid lg:grid-cols-[1fr_400px] gap-8 items-start">

                    {/* Left Side: Editor */}
                    <div className="bg-white border border-slate-100 rounded-[32px] overflow-hidden shadow-sm flex flex-col">

                        {/* Tabs Navigation */}
                        <div className="flex border-b border-slate-50 bg-slate-50/50 p-2 gap-1">
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
                                    className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === tab.id ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'}`}
                                >
                                    <tab.icon size={16} />
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Editor Content */}
                        <div className="p-8">
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
                                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Ana Başlık (H1)</label>
                                                        <span className="text-[10px] text-slate-300 font-bold">Harf sonu \n ile alt satıra geçebilirsiniz</span>
                                                    </div>
                                                    <textarea
                                                        value={content.hero.title}
                                                        onChange={(e) => updateContent("hero.title", e.target.value)}
                                                        className="p-5 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-orange-600 transition-all outline-none font-bold text-slate-800 text-xl min-h-[120px]"
                                                        placeholder="Mükemmel restoran..."
                                                    />
                                                </div>
                                                <div className="flex flex-col gap-3">
                                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Alt Açıklama (Subtitle)</label>
                                                    <textarea
                                                        value={content.hero.subtitle}
                                                        onChange={(e) => updateContent("hero.subtitle", e.target.value)}
                                                        className="p-5 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-orange-600 transition-all outline-none font-medium text-slate-600 leading-relaxed min-h-[120px]"
                                                        placeholder="Siparişleri hızlandırın..."
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-6 pt-4">
                                                    <div className="flex flex-col gap-3">
                                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Giris Yap / Dene Butonu</label>
                                                        <input
                                                            value={content.hero.cta_primary}
                                                            onChange={(e) => updateContent("hero.cta_primary", e.target.value)}
                                                            className="p-4 rounded-xl border border-slate-100 bg-slate-50 font-bold text-slate-800"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col gap-3">
                                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Özellikler Butonu</label>
                                                        <input
                                                            value={content.hero.cta_secondary}
                                                            onChange={(e) => updateContent("hero.cta_secondary", e.target.value)}
                                                            className="p-4 rounded-xl border border-slate-100 bg-slate-50 font-bold text-slate-800"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Stats Section */}
                                    {activeTab === "stats" && (
                                        <div className="space-y-6">
                                            <div className="grid md:grid-cols-2 gap-4">
                                                {(content.stats || []).map((stat, idx) => (
                                                    <div key={idx} className="bg-slate-50/50 p-6 rounded-[24px] border border-slate-100 flex flex-col gap-4">
                                                        <div className="flex flex-col gap-2">
                                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">DEĞER (Value)</label>
                                                            <input
                                                                value={stat.value}
                                                                onChange={(e) => {
                                                                    const newS = [...(content.stats || [])];
                                                                    newS[idx].value = e.target.value;
                                                                    setContent({ ...content, stats: newS });
                                                                }}
                                                                className="p-3 rounded-xl border border-slate-100 bg-white font-black text-slate-800 text-xl"
                                                                placeholder="5.000+"
                                                            />
                                                        </div>
                                                        <div className="flex flex-col gap-2">
                                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ETİKET (Label)</label>
                                                            <input
                                                                value={stat.label}
                                                                onChange={(e) => {
                                                                    const newS = [...(content.stats || [])];
                                                                    newS[idx].label = e.target.value;
                                                                    setContent({ ...content, stats: newS });
                                                                }}
                                                                className="p-3 rounded-xl border border-slate-100 bg-white font-bold text-slate-600"
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
                                            <div className="grid md:grid-cols-2 gap-4">
                                                {content.features.map((feature, idx) => (
                                                    <div key={idx} className="bg-slate-50/50 p-6 rounded-[24px] border border-slate-100 relative group">
                                                        <button
                                                            onClick={() => {
                                                                const newF = [...content.features];
                                                                newF.splice(idx, 1);
                                                                setContent({ ...content, features: newF });
                                                            }}
                                                            className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all z-10"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                        <div className="flex flex-col gap-4">
                                                            <div className="flex items-center gap-3">
                                                                {/* Icon Selector Button */}
                                                                <div className="relative group/icon">
                                                                    <div className="w-12 h-12 bg-white rounded-xl border border-slate-100 flex items-center justify-center text-orange-600 cursor-pointer shadow-sm">
                                                                        {(() => {
                                                                            const IconComp = ICON_LIST.find(i => i.name === feature.icon)?.icon || QrCode;
                                                                            return <IconComp size={22} />;
                                                                        })()}
                                                                    </div>
                                                                    <div className="absolute top-full left-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl p-3 grid grid-cols-4 gap-2 z-20 opacity-0 pointer-events-none group-focus-within/icon:opacity-100 group-focus-within/icon:pointer-events-auto transition-all w-[200px]">
                                                                        {ICON_LIST.map(ic => (
                                                                            <button
                                                                                key={ic.name}
                                                                                onClick={() => {
                                                                                    const newF = [...content.features];
                                                                                    newF[idx].icon = ic.name;
                                                                                    setContent({ ...content, features: newF });
                                                                                }}
                                                                                className={`p-2 rounded-lg hover:bg-orange-50 hover:text-orange-600 transition-colors ${feature.icon === ic.name ? 'bg-orange-600 text-white' : 'text-slate-400'}`}
                                                                            >
                                                                                <ic.icon size={18} />
                                                                            </button>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                                <input
                                                                    value={feature.title}
                                                                    onChange={(e) => {
                                                                        const newF = [...content.features];
                                                                        newF[idx].title = e.target.value;
                                                                        setContent({ ...content, features: newF });
                                                                    }}
                                                                    className="flex-1 bg-transparent border-b border-transparent focus:border-orange-600 outline-none text-base font-black text-slate-800"
                                                                    placeholder="Özellik Başlığı"
                                                                />
                                                            </div>
                                                            <textarea
                                                                value={feature.desc}
                                                                onChange={(e) => {
                                                                    const newF = [...content.features];
                                                                    newF[idx].desc = e.target.value;
                                                                    setContent({ ...content, features: newF });
                                                                }}
                                                                className="bg-white/50 p-3 rounded-xl border border-slate-100 text-xs text-slate-500 font-medium min-h-[70px] outline-none focus:border-orange-600"
                                                                placeholder="Özellik açıklaması..."
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                                <button
                                                    onClick={() => setContent({ ...content, features: [...content.features, { icon: "CheckCircle2", title: "Yeni Özellik", desc: "Açıklama giriniz" }] })}
                                                    className="border-2 border-dashed border-slate-200 rounded-[24px] flex flex-col items-center justify-center gap-3 p-8 text-slate-400 hover:border-orange-600 hover:text-orange-600 transition-all font-bold group"
                                                >
                                                    <div className="w-10 h-10 rounded-full border border-slate-200 group-hover:border-orange-600 flex items-center justify-center transition-colors">
                                                        <Plus size={20} />
                                                    </div>
                                                    Yeni Ekle
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Pricing Section */}
                                    {activeTab === "pricing" && (
                                        <div className="space-y-6">
                                            {content.pricing.map((plan, idx) => (
                                                <div key={idx} className={`p-6 rounded-[28px] border-2 transition-all ${plan.highlight ? 'border-orange-600/20 bg-orange-50/10' : 'border-slate-50 bg-slate-50/30'}`}>
                                                    <div className="flex flex-col md:flex-row gap-8">
                                                        <div className="w-full md:w-1/3 flex flex-col gap-4">
                                                            <div className="flex items-center justify-between">
                                                                <input
                                                                    value={plan.name}
                                                                    onChange={(e) => {
                                                                        const newP = [...content.pricing];
                                                                        newP[idx].name = e.target.value;
                                                                        setContent({ ...content, pricing: newP });
                                                                    }}
                                                                    className="bg-transparent text-lg font-black text-slate-800 outline-none w-full"
                                                                    placeholder="Plan Adı"
                                                                />
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-[10px] font-bold text-slate-400">ÖNE ÇIKAR</span>
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={plan.highlight}
                                                                        onChange={(e) => {
                                                                            const newP = [...content.pricing];
                                                                            newP[idx].highlight = e.target.checked;
                                                                            setContent({ ...content, pricing: newP });
                                                                        }}
                                                                        className="w-4 h-4 accent-orange-600"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <div className="relative flex-1">
                                                                    <span className="absolute left-3 top-3.5 text-slate-400 font-bold">₺</span>
                                                                    <input
                                                                        value={plan.price.replace('₺', '')}
                                                                        onChange={(e) => {
                                                                            const newP = [...content.pricing];
                                                                            newP[idx].price = '₺' + e.target.value;
                                                                            setContent({ ...content, pricing: newP });
                                                                        }}
                                                                        className="w-full pl-7 p-3 bg-white border border-slate-200 rounded-xl font-black text-xl text-slate-800"
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
                                                                    className="w-20 p-3 bg-slate-100/50 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 text-center uppercase"
                                                                    placeholder="/AY"
                                                                />
                                                            </div>
                                                            <button
                                                                onClick={() => {
                                                                    const newP = [...content.pricing];
                                                                    newP.splice(idx, 1);
                                                                    setContent({ ...content, pricing: newP });
                                                                }}
                                                                className="mt-4 text-red-500 text-[11px] font-bold hover:bg-red-50 py-2 rounded-lg flex items-center justify-center gap-2"
                                                            >
                                                                <Trash2 size={12} /> Bu Planı Sil
                                                            </button>
                                                        </div>
                                                        <div className="flex-1 flex flex-col gap-4">
                                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Özellikler (Her satır bir madde)</label>
                                                            <textarea
                                                                value={plan.features.join("\n")}
                                                                onChange={(e) => {
                                                                    const newP = [...content.pricing];
                                                                    newP[idx].features = e.target.value.split("\n");
                                                                    setContent({ ...content, pricing: newP });
                                                                }}
                                                                className="p-4 bg-white border border-slate-200 rounded-2xl text-sm font-medium text-slate-600 min-h-[120px] outline-none focus:border-orange-600"
                                                                placeholder="QR Menü\nSipariş Takibi..."
                                                            />
                                                            <div className="flex gap-4">
                                                                <div className="flex-1">
                                                                    <label className="text-[10px] font-black text-slate-400 mb-1 block">BUTON YAZISI</label>
                                                                    <input
                                                                        value={plan.cta}
                                                                        onChange={(e) => {
                                                                            const newP = [...content.pricing];
                                                                            newP[idx].cta = e.target.value;
                                                                            setContent({ ...content, pricing: newP });
                                                                        }}
                                                                        className="w-full p-2 bg-slate-50 border border-slate-100 rounded-lg text-xs font-bold"
                                                                    />
                                                                </div>
                                                                <div className="flex-1">
                                                                    <label className="text-[10px] font-black text-slate-400 mb-1 block">AÇIKLAMA</label>
                                                                    <input
                                                                        value={plan.desc}
                                                                        onChange={(e) => {
                                                                            const newP = [...content.pricing];
                                                                            newP[idx].desc = e.target.value;
                                                                            setContent({ ...content, pricing: newP });
                                                                        }}
                                                                        className="w-full p-2 bg-slate-50 border border-slate-100 rounded-lg text-xs font-bold"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            <button
                                                onClick={() => setContent({ ...content, pricing: [...content.pricing, { name: "Yeni Plan", price: "₺0", period: "/ay", desc: "", features: [], cta: "Seç", highlight: false }] })}
                                                className="w-full py-4 border-2 border-dashed border-slate-200 rounded-[28px] text-slate-400 font-bold hover:border-orange-600 hover:text-orange-600 transition-all flex items-center justify-center gap-2"
                                            >
                                                <Plus size={18} /> Yeni Plan Ekle
                                            </button>
                                        </div>
                                    )}

                                    {/* Testimonials Section */}
                                    {activeTab === "testimonials" && (
                                        <div className="space-y-6">
                                            <div className="grid md:grid-cols-2 gap-4">
                                                {content.testimonials.map((t, idx) => (
                                                    <div key={idx} className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm relative group">
                                                        <button
                                                            onClick={() => {
                                                                const newT = [...content.testimonials];
                                                                newT.splice(idx, 1);
                                                                setContent({ ...content, testimonials: newT });
                                                            }}
                                                            className="absolute top-4 right-4 text-red-400 opacity-0 group-hover:opacity-100 transition-all hover:text-red-600"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                        <div className="flex flex-col gap-4">
                                                            <div className="flex gap-4">
                                                                <input
                                                                    value={t.name}
                                                                    onChange={(e) => {
                                                                        const newT = [...content.testimonials];
                                                                        newT[idx].name = e.target.value;
                                                                        setContent({ ...content, testimonials: newT });
                                                                    }}
                                                                    className="flex-1 text-sm font-black text-slate-800 outline-none border-b border-transparent focus:border-orange-600"
                                                                    placeholder="İsim Soyisim"
                                                                />
                                                                <input
                                                                    value={t.role}
                                                                    onChange={(e) => {
                                                                        const newT = [...content.testimonials];
                                                                        newT[idx].role = e.target.value;
                                                                        setContent({ ...content, testimonials: newT });
                                                                    }}
                                                                    className="flex-1 text-xs font-bold text-slate-400 outline-none border-b border-transparent focus:border-orange-600"
                                                                    placeholder="İşletme / Rol"
                                                                />
                                                            </div>
                                                            <textarea
                                                                value={t.text}
                                                                onChange={(e) => {
                                                                    const newT = [...content.testimonials];
                                                                    newT[idx].text = e.target.value;
                                                                    setContent({ ...content, testimonials: newT });
                                                                }}
                                                                className="text-sm text-slate-600 font-medium italic min-h-[90px] outline-none border border-slate-50 p-3 rounded-xl bg-slate-50/50"
                                                                placeholder="Yorum metni..."
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                                <button
                                                    onClick={() => setContent({ ...content, testimonials: [...content.testimonials, { name: "Ad Soyad", role: "Restoran Adı", text: "Yorumunuz buraya..." }] })}
                                                    className="border-2 border-dashed border-slate-200 rounded-[24px] flex flex-col items-center justify-center p-12 text-slate-400 hover:border-orange-600 hover:text-orange-600 transition-all font-bold"
                                                >
                                                    <Plus size={24} className="mb-2" />
                                                    Yeni Yorum
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Branding Section */}
                                    {activeTab === "branding" && (
                                        <div className="space-y-8">
                                            <div className="grid gap-6">
                                                <div className="flex flex-col gap-3">
                                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Site Adı</label>
                                                    <input
                                                        value={content.branding?.siteName || ""}
                                                        onChange={(e) => updateContent("branding.siteName", e.target.value)}
                                                        className="p-4 rounded-xl border border-slate-100 bg-slate-50 font-bold text-slate-800"
                                                        placeholder="QRlamenü"
                                                    />
                                                </div>
                                                <div className="flex flex-col gap-3">
                                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Logo İkonu Seçin</label>
                                                    <div className="grid grid-cols-6 md:grid-cols-10 gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                                        {ICON_LIST.map(ic => (
                                                            <button
                                                                key={ic.name}
                                                                onClick={() => updateContent("branding.logoIcon", ic.name)}
                                                                className={`p-3 rounded-xl flex items-center justify-center transition-all ${content.branding?.logoIcon === ic.name ? 'bg-orange-600 text-white shadow-lg' : 'bg-white text-slate-400 hover:text-slate-600'}`}
                                                            >
                                                                <ic.icon size={20} />
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-3">
                                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Özel Logo URL (Opsiyonel)</label>
                                                    <input
                                                        value={content.branding?.logoUrl || ""}
                                                        onChange={(e) => updateContent("branding.logoUrl", e.target.value)}
                                                        className="p-4 rounded-xl border border-slate-100 bg-slate-50 font-medium text-slate-600"
                                                        placeholder="https://example.com/logo.png"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Corporate Section */}
                                    {activeTab === "corporate" && (
                                        <div className="space-y-8">
                                            <div className="p-6 bg-slate-50/50 rounded-[32px] border border-slate-100 space-y-4">
                                                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">HAKKIMIZDA SAYFASI</h3>
                                                <input
                                                    value={content.corporate?.about?.title || ""}
                                                    onChange={(e) => updateContent("corporate.about.title", e.target.value)}
                                                    className="w-full p-3 rounded-xl border border-slate-100 font-bold"
                                                    placeholder="Başlık"
                                                />
                                                <textarea
                                                    value={content.corporate?.about?.content || ""}
                                                    onChange={(e) => updateContent("corporate.about.content", e.target.value)}
                                                    className="w-full p-3 rounded-xl border border-slate-100 font-medium min-h-[120px]"
                                                    placeholder="Hakkımızda içeriği..."
                                                />
                                            </div>
                                            <div className="p-6 bg-slate-50/50 rounded-[32px] border border-slate-100 space-y-4">
                                                <div className="grid md:grid-cols-2 gap-4">
                                                    <input value={content.corporate?.contact?.email || ""} onChange={(e) => updateContent("corporate.contact.email", e.target.value)} className="w-full p-3 rounded-xl border border-slate-100" placeholder="E-posta" />
                                                    <input value={content.corporate?.contact?.phone || ""} onChange={(e) => updateContent("corporate.contact.phone", e.target.value)} className="w-full p-3 rounded-xl border border-slate-100" placeholder="Telefon" />
                                                </div>
                                                <input value={content.corporate?.contact?.address || ""} onChange={(e) => updateContent("corporate.contact.address", e.target.value)} className="w-full p-3 rounded-xl border border-slate-100" placeholder="Adres" />
                                            </div>
                                            <div className="p-6 bg-slate-50/50 rounded-[32px] border border-slate-100 space-y-4">
                                                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">YASAL METİNLER</h3>
                                                <textarea value={content.corporate?.legal?.privacy || ""} onChange={(e) => updateContent("corporate.legal.privacy", e.target.value)} className="w-full p-3 rounded-xl border border-slate-100 h-[80px]" placeholder="Gizlilik Politikası Giriş" />
                                                <textarea value={content.corporate?.legal?.terms || ""} onChange={(e) => updateContent("corporate.legal.terms", e.target.value)} className="w-full p-3 rounded-xl border border-slate-100 h-[80px]" placeholder="Kullanım Koşulları Giriş" />
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
