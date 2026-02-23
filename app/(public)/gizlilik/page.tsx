"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    UtensilsCrossed,
    ArrowLeft,
    Shield,
    QrCode, BarChart3, Truck, Users, ShieldCheck, TrendingUp, Smartphone, Menu, Star, Zap
} from "lucide-react";
import Link from "next/link";

const ICON_LIST = [
    { name: "QrCode", icon: QrCode },
    { name: "Bell", icon: Zap },
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

export default function PrivacyPage() {
    const [content, setContent] = useState<any>(null);

    useEffect(() => {
        fetch("/api/super-admin/website-config")
            .then(res => res.json())
            .then(data => {
                if (data && !data.error) setContent(data);
            })
            .catch(err => console.error("Privacy Page Fetch Error:", err));
    }, []);

    const branding = content?.branding || { logoIcon: "UtensilsCrossed", siteName: "QRlamenü" };
    const legal = content?.corporate?.legal || {
        privacy: "QRlamenü olarak, verilerinizin gizliliği ve güvenliği bizim için en yüksek önceliğe sahiptir."
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
                <div className="max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-12"
                    >
                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-black mb-6">
                            <Shield size={24} />
                        </div>
                        <h1 className="text-4xl font-black tracking-tight text-gray-900 mb-4">Gizlilik Politikası</h1>
                        <p className="text-gray-500 font-medium">Son güncelleme: 23 Şubat 2026</p>
                    </motion.div>

                    <div className="prose prose-slate max-w-none space-y-8 text-gray-600 leading-relaxed font-medium">
                        <p className="whitespace-pre-line">
                            {legal.privacy}
                        </p>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-gray-900">1. Toplanan Veriler</h2>
                            <p>
                                Restoran kaydı sırasında sağladığınız isim, e-posta, telefon numarası ve işletme bilgileri, hizmetlerimizi sunabilmemiz adına güvenli sunucularımızda saklanır. Müşterilerinizin QR menü üzerindeki etkileşimleri anonim olarak analiz edilir.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-gray-900">2. Verilerin Kullanımı</h2>
                            <p>
                                Topladığımız bilgiler; platform performansını artırmak, size teknik destek sağlamak ve yasal yükümlülüklerimizi yerine getirmek amacıyla kullanılır. Verileriniz asla üçüncü şahıslara reklam amaçlı satılmaz.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-gray-900">3. KVKK ve Güvenlik</h2>
                            <p>
                                Verileriniz Türkiye Cumhuriyeti sınırları içindeki yüksek güvenlikli veri merkezlerinde saklanmaktadır. Veri şifreleme ve düzenli yedekleme protokolleri ile bilgileriniz koruma altındadır.
                            </p>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}
