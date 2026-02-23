"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Mail, Phone, MapPin,
    Send, CheckCircle2,
    UtensilsCrossed,
    ArrowLeft,
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

export default function ContactPage() {
    const [sent, setSent] = useState(false);
    const [content, setContent] = useState<any>(null);

    useEffect(() => {
        fetch("/api/super-admin/website-config")
            .then(res => res.json())
            .then(data => {
                if (data && !data.error) setContent(data);
            })
            .catch(err => console.error("Contact Page Fetch Error:", err));
    }, []);

    const branding = content?.branding || { logoIcon: "UtensilsCrossed", siteName: "QRlamenü" };
    const contact = content?.corporate?.contact || {
        email: "destek@qrlamenu.com",
        phone: "+90 212 XXX XX XX",
        address: "Teknokent, İstanbul"
    };

    const LogoIcon = ICON_LIST.find(i => i.name === branding.logoIcon)?.icon || UtensilsCrossed;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSent(true);
    };

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
                <div className="max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-gray-900 mb-6">Bize Ulaşın</h1>
                        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                            Sorularınız, iş birliği talepleriniz veya teknik destek için ekibimiz her zaman yanınızda.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-[1fr_1.5fr] gap-12">
                        {/* Info Cards */}
                        <div className="space-y-6">
                            {[
                                { icon: Mail, title: "E-Posta", value: contact.email, sub: "7/24 Teknik Destek" },
                                { icon: Phone, title: "Telefon", value: contact.phone, sub: "Hafta içi 09:00 - 18:00" },
                                { icon: MapPin, title: "Ofis", value: contact.address, sub: "Gelecek Burada Tasarlanıyor" },
                            ].map((info, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="p-6 bg-gray-50 border border-gray-100 rounded-[2rem]"
                                >
                                    <div className="w-10 h-10 bg-white shadow-sm border border-gray-200/50 rounded-xl flex items-center justify-center text-black mb-4">
                                        <info.icon size={20} />
                                    </div>
                                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{info.title}</h3>
                                    <div className="text-lg font-bold text-gray-900 mb-1">{info.value}</div>
                                    <div className="text-sm font-medium text-gray-400">{info.sub}</div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white border border-gray-100 shadow-2xl shadow-gray-200/50 rounded-[2.5rem] p-8 md:p-12"
                        >
                            {sent ? (
                                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                                    <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-6">
                                        <CheckCircle2 size={40} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Mesajınız Alındı!</h2>
                                    <p className="text-gray-500 font-medium">En kısa sürede size dönüş yapacağız.</p>
                                    <button
                                        onClick={() => setSent(false)}
                                        className="mt-8 text-sm font-bold text-gray-400 hover:text-black transition-colors"
                                    >
                                        Yeni bir mesaj gönder
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">İSİM SOYİSİM</label>
                                            <input required type="text" className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-black transition-all outline-none font-medium" placeholder="Ahmet Yılmaz" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">E-POSTA</label>
                                            <input required type="email" className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-black transition-all outline-none font-medium" placeholder="ahmet@example.com" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">KONU</label>
                                        <input required type="text" className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-black transition-all outline-none font-medium" placeholder="Bilgilendirme talebi" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">MESAJINIZ</label>
                                        <textarea required className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-black transition-all outline-none font-medium min-h-[150px]" placeholder="Size nasıl yardımcı olabiliriz?"></textarea>
                                    </div>
                                    <button type="submit" className="w-full py-5 bg-black text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all shadow-xl shadow-black/10">
                                        Mesajı Gönder <Send size={18} />
                                    </button>
                                </form>
                            )}
                        </motion.div>
                    </div>
                </div>
            </main>
        </div>
    );
}
