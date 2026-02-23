"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    UtensilsCrossed,
    ArrowLeft,
    Users,
    Target,
    Zap,
    Heart,
    QrCode,
    BarChart3,
    Truck,
    ShieldCheck,
    TrendingUp,
    Smartphone,
    Menu,
    Star
} from "lucide-react";
import Link from "next/link";

const ICON_LIST = [
    { name: "QrCode", icon: QrCode },
    { name: "Bell", icon: Zap }, // Bell yerine Zap kullanılıyor bazen, uyumluluk için
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

export default function AboutPage() {
    const [content, setContent] = useState<any>(null);

    useEffect(() => {
        fetch("/api/super-admin/website-config")
            .then(res => res.json())
            .then(data => {
                if (data && !data.error) setContent(data);
            })
            .catch(err => console.error("About Page Fetch Error:", err));
    }, []);

    const branding = content?.branding || { logoIcon: "UtensilsCrossed", siteName: "QRlamenü" };
    const about = content?.corporate?.about || {
        title: "Restoranların dijital dönüşüm ortağıyız.",
        content: "QRlamenü, modern restoran işletmeciliğini kolaylaştırmak ve müşteri deneyimini mükemmelleştirmek için kurulmuş bir teknoloji girişimidir."
    };

    const LogoIcon = ICON_LIST.find(i => i.name === branding.logoIcon)?.icon || UtensilsCrossed;

    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-black selection:text-white pb-20">
            {/* Header */}
            <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 py-4">
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-black text-white rounded-xl flex items-center justify-center">
                            {branding.logoUrl ? (
                                <img src={branding.logoUrl} alt={branding.siteName} className="w-5 h-5 object-contain" />
                            ) : (
                                <LogoIcon size={16} strokeWidth={2.5} />
                            )}
                        </div>
                        <span className="font-extrabold text-xl tracking-tight">{branding.siteName}</span>
                    </Link>
                    <Link href="/" className="text-sm font-bold text-gray-500 hover:text-black transition-colors flex items-center gap-2">
                        <ArrowLeft size={16} /> Ana Sayfa
                    </Link>
                </div>
            </nav>

            <main className="pt-32 px-6">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-20 text-center"
                    >
                        <h1 className="text-4xl md:text-7xl font-black tracking-tight text-gray-900 mb-8 leading-[1.1] whitespace-pre-line">
                            {about.title}
                        </h1>
                        <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed whitespace-pre-line">
                            {about.content}
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-16 mb-24">
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold tracking-tight">Biz kimiz?</h2>
                            <p className="text-gray-500 leading-relaxed font-medium">
                                {about.content}
                            </p>
                            <p className="text-gray-500 leading-relaxed font-medium">
                                Ekibimiz, yazılım geliştiriciler, tasarımcılar ve gastronomi uzmanlarından oluşur. Her bir satır kodumuzu, bir restoran sahibinin veya garsonun işini nasıl daha kolaylaştırırız diye düşünerek yazıyoruz.
                            </p>
                        </div>
                        <div className="bg-gray-50 rounded-[3rem] p-8 flex flex-col justify-center gap-8 border border-gray-100 shadow-sm">
                            {[
                                { icon: Users, label: "5,000+", sub: "Aktif Partner" },
                                { icon: Zap, label: "%40", sub: "Servis Hızı Artışı" },
                                { icon: Heart, label: "7/24", sub: "Mutlu Destek" },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-6">
                                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-black shadow-sm border border-gray-200/50">
                                        <item.icon size={24} />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-black text-gray-900 leading-tight">{item.label}</div>
                                        <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">{item.sub}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { title: "Misyonumuz", desc: "Her ölçekteki restoranın en yeni teknolojilere en kolay şekilde erişmesini sağlamak.", icon: Target },
                            { title: "Vizyonumuz", desc: "Dünyanın en sevilen ve en sezgisel restoran yönetim platformu olmak.", icon: Zap },
                            { title: "Değerlerimiz", desc: "Sadelik, hız, güvenilirlik ve müşteri odaklılık her kararımızın merkezindedir.", icon: Heart },
                        ].map((box, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="p-8 rounded-[2.5rem] border border-gray-100 bg-white shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all text-center"
                            >
                                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-black mb-6 mx-auto">
                                    <box.icon size={22} />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{box.title}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed font-medium">{box.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
