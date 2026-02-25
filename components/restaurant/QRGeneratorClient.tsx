"use client";

import React, { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Settings,
    Download,
    ChevronRight,
    Copy,
    Printer,
    Upload,
    Trash2,
    Check,
    Eye,
    FileImage,
    ExternalLink,
    Activity,
} from 'lucide-react';
import Link from 'next/link';

import { MobileMenuToggle, ProfileDropdown } from '@/components/HeaderActions';

const StatusBadge = ({ status }: { status: string }) => {
    return (
        <span className="flex items-center gap-2 px-3 py-1.5 rounded-[4px] border border-emerald-100 bg-emerald-50 text-emerald-600 text-[9px] font-bold tracking-widest uppercase">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            AKTİF
        </span>
    );
};

interface QRGeneratorClientProps {
    slug: string;
    tenantName: string;
    logoUrl?: string | null;
}

type QRMode = 'normal' | 'text' | 'image';

export default function QRGeneratorClient({ slug, tenantName, logoUrl }: QRGeneratorClientProps) {
    const [fgColor, setFgColor] = useState('#000000');
    const [bgColor, setBgColor] = useState('#ffffff');
    const [padding, setPadding] = useState(2);
    const [cornerRadius, setCornerRadius] = useState(0);

    const [mode, setMode] = useState<QRMode>('normal');
    const [qrText, setQrText] = useState(tenantName);
    const [textColor, setTextColor] = useState('#ff6e01');
    const [customImage, setCustomImage] = useState<string | null>(null);
    const [modeSize, setModeSize] = useState(6);
    const [positionX, setPositionX] = useState(50);
    const [positionY, setPositionY] = useState(50);

    const [copied, setCopied] = useState(false);
    const [downloadSuccess, setDownloadSuccess] = useState(false);
    const [activeTemplate, setActiveTemplate] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    // Hydration-safe URL
    const [menuUrl, setMenuUrl] = useState(`/r/${slug}`);
    useEffect(() => {
        setMenuUrl(`${window.location.origin}/r/${slug}`);
        const check = () => setIsMobile(window.innerWidth < 1024);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, [slug]);

    const qrSize = 250;
    const activeLogo = customImage || logoUrl || null;

    const downloadQR = () => {
        const canvas = document.getElementById('qr-canvas') as HTMLCanvasElement;
        if (!canvas) return;
        try {
            const link = document.createElement('a');
            link.download = `${slug}-qr-menu.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            setDownloadSuccess(true);
            setTimeout(() => setDownloadSuccess(false), 2000);
        } catch {
            alert("QR indirilemedi. Lütfen tekrar deneyin.");
        }
    };

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;
        const canvas = document.getElementById('qr-canvas') as HTMLCanvasElement;
        let qrDataUrl = '';
        try {
            qrDataUrl = canvas ? canvas.toDataURL() : '';
        } catch {
            alert("Yazdırma hatası.");
            printWindow.close();
            return;
        }
        printWindow.document.write(`<html><head><title>${tenantName} - QR</title><style>body{font-family:sans-serif;text-align:center;padding:40px}img{max-width:280px}h1{font-size:22px;letter-spacing:2px;color:#222}.f{margin-top:16px;font-size:11px;color:#bbb;text-transform:uppercase;letter-spacing:2px}p{color:#888;font-size:13px}@media print{body{-webkit-print-color-adjust:exact}}</style></head><body><h1>MENÜ</h1><p>QR kodu okutarak menüyü görüntüleyin</p><img src="${qrDataUrl}"/><div class="f">${tenantName}</div><script>window.onload=function(){window.print()}<\/script></body></html>`);
        printWindow.document.close();
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => setCustomImage(ev.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    const copyLink = () => {
        navigator.clipboard.writeText(menuUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const templates = [
        'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300&h=400&fit=crop',
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300&h=400&fit=crop',
        'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=300&h=400&fit=crop',
    ];

    // ====== Shared Styles ======
    const cardStyle: React.CSSProperties = {
        background: '#fff', borderRadius: '14px', border: '1px solid #e8ecf1', overflow: 'hidden',
    };
    const cardHeaderStyle: React.CSSProperties = {
        padding: '14px 18px', borderBottom: '1px solid #f0f1f3',
        display: 'flex', alignItems: 'center', gap: '10px', background: '#fafbfc',
    };
    const cardTitleStyle: React.CSSProperties = {
        margin: 0, fontSize: '0.9rem', fontWeight: 700, color: '#1a1a2e',
    };
    const cardBodyStyle: React.CSSProperties = { padding: '18px' };
    const fieldStyle: React.CSSProperties = { marginBottom: '16px' };
    const labelStyle: React.CSSProperties = {
        display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#555', marginBottom: '7px',
    };
    const inputStyle: React.CSSProperties = {
        width: '100%', padding: '9px 12px', border: '1px solid #e0e0e0', borderRadius: '8px',
        fontSize: '0.85rem', outline: 'none', background: '#fafafa', boxSizing: 'border-box',
    };
    const selectStyle: React.CSSProperties = { ...inputStyle, cursor: 'pointer' };
    const rangeStyle: React.CSSProperties = {
        width: '100%', cursor: 'pointer', accentColor: '#ff6e01',
    };
    const btnPrimary: React.CSSProperties = {
        display: 'inline-flex', alignItems: 'center', gap: '8px',
        padding: '10px 20px', borderRadius: '8px', border: 'none',
        background: '#ff6e01', color: '#fff', fontWeight: 700, fontSize: '0.85rem',
        cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap',
    };
    const btnSecondary: React.CSSProperties = {
        ...btnPrimary, background: '#fff', color: '#555', border: '1px solid #e0e0e0',
    };
    const colorRowStyle: React.CSSProperties = {
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    };
    const colorInputStyle: React.CSSProperties = {
        width: 32, height: 32, border: '2px solid #e0e0e0', borderRadius: 6,
        cursor: 'pointer', padding: 0,
    };

    return (
        <div className="p-0 bg-[#f8fafc] min-h-screen">
            {/* Header Area */}
            <div className="bg-white border-b border-slate-200 py-5 px-6 relative z-30">
                <div className="w-full mx-auto">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-start md:items-center gap-4 md:gap-6">
                            <MobileMenuToggle />
                            <div className="space-y-4">
                                {/* Breadcrumbs */}
                                <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                    <Link href="/dashboard" className="hover:text-slate-900 transition-colors">PANEL</Link>
                                    <ChevronRight size={8} className="text-slate-300" />
                                    <span className="text-slate-900">QR KOD OLUŞTURUCU</span>
                                </div>

                                <div className="flex items-center gap-4">
                                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight uppercase leading-none">QR YÖNETİMİ</h1>
                                    <div className="h-0.5 w-0.5 bg-slate-300 rounded-full" />
                                    <StatusBadge status="active" />
                                </div>
                            </div>
                        </div>
                        <ProfileDropdown />
                    </div>
                </div>
            </div>

            <div className="p-4 lg:p-6">
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start">

                    {/* ========== COL 1: Ayarlar (Customization Panel) ========== */}
                    <div className="xl:col-span-4 space-y-6">
                        <div className="bg-white rounded-[6px] shadow-sm border border-slate-200 overflow-hidden">
                            <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
                                <div className="bg-slate-900 text-white p-2 rounded-[4px]">
                                    <Settings size={15} strokeWidth={2.5} />
                                </div>
                                <h3 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">TASARIM AYARLARI</h3>
                            </div>

                            <div className="p-5 space-y-6 max-h-[calc(100vh-280px)] overflow-y-auto custom-scrollbar">
                                {/* Color Selectors */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">QR RENGİ</label>
                                        <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-[6px] border border-slate-200 group hover:border-slate-900 transition-all">
                                            <input type="color" value={fgColor} onChange={e => setFgColor(e.target.value)} className="w-8 h-8 rounded-[4px] border-none cursor-pointer bg-transparent" />
                                            <span className="text-[11px] font-bold text-slate-900 tracking-tight uppercase">{fgColor}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">ARKA PLAN</label>
                                        <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-[6px] border border-slate-200 group hover:border-slate-900 transition-all">
                                            <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-8 h-8 rounded-[4px] border-none cursor-pointer bg-transparent" />
                                            <span className="text-[11px] font-bold text-slate-900 tracking-tight uppercase">{bgColor}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Sliders */}
                                <div className="space-y-5">
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center px-1">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">DIŞ BOŞLUK (PADDING)</label>
                                            <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-[4px] border border-slate-200">{padding}</span>
                                        </div>
                                        <input type="range" min={0} max={5} step={1} value={padding} onChange={e => setPadding(Number(e.target.value))}
                                            className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-slate-900" />
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center px-1">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">KÖŞE YUMUŞATMA</label>
                                            <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-[4px] border border-slate-200">{cornerRadius}</span>
                                        </div>
                                        <input type="range" min={0} max={50} step={10} value={cornerRadius} onChange={e => setCornerRadius(Number(e.target.value))}
                                            className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-slate-900" />
                                    </div>
                                </div>

                                {/* Mode Selection */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">MERKEZ LOGO / METİN</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {['normal', 'text', 'image'].map((m) => (
                                            <button key={m} onClick={() => setMode(m as QRMode)}
                                                className={`py-3 rounded-[6px] border text-[10px] font-bold uppercase tracking-widest transition-all ${mode === m ? 'bg-slate-900 border-slate-900 text-white shadow-md active:scale-95' : 'bg-white border-slate-100 text-slate-400 hover:bg-slate-50'}`}>
                                                {m === 'normal' ? 'YOK' : m === 'text' ? 'METİN' : 'LOGO'}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Dynamic Mode Controls */}
                                <AnimatePresence mode="wait">
                                    {mode === 'text' && (
                                        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="space-y-5 pt-4 border-t border-slate-100">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">LOGO METNİ</label>
                                                <input type="text" value={qrText} onChange={e => setQrText(e.target.value)} className="w-full bg-white border border-slate-200 rounded-[6px] px-4 py-2.5 text-[11px] font-bold text-slate-900 outline-none focus:border-slate-900 transition-all uppercase tracking-tight" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">METİN RENGİ</label>
                                                <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-[6px] border border-slate-200">
                                                    <input type="color" value={textColor} onChange={e => setTextColor(e.target.value)} className="w-8 h-8 rounded-[4px] border-none cursor-pointer bg-transparent" />
                                                    <span className="text-[11px] font-bold text-slate-900 tracking-tight uppercase">{textColor}</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {mode === 'image' && (
                                        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="space-y-4 pt-4 border-t border-slate-100">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">LOGO GÖRSELİ</label>
                                                <div className="relative group">
                                                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="logo-upload" />
                                                    <label htmlFor="logo-upload" className="flex items-center justify-center gap-3 w-full py-5 bg-slate-50 border border-dashed border-slate-300 rounded-[6px] cursor-pointer hover:bg-slate-100 hover:border-slate-900 transition-all">
                                                        <Upload size={16} className="text-slate-400 group-hover:text-slate-900" strokeWidth={2.5} />
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-slate-900">GÖRSEL SEÇİN</span>
                                                    </label>
                                                </div>
                                                {customImage && (
                                                    <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-[6px] border border-emerald-100 animate-in fade-in slide-in-from-top-1">
                                                        <div className="flex items-center gap-3">
                                                            <img src={customImage} alt="Logo" className="w-10 h-10 rounded-[4px] object-cover border border-white shadow-sm" />
                                                            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">LOGO AKTİF</span>
                                                        </div>
                                                        <button onClick={() => setCustomImage(null)} className="p-1.5 bg-white text-rose-500 rounded-[4px] shadow-sm hover:text-rose-600 transition-all border border-rose-100">
                                                            <Trash2 size={13} strokeWidth={2.5} />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}

                                    {(mode === 'text' || mode === 'image') && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 pt-4 border-t border-slate-100">
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center px-1">
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">LOGO/METİN BOYUTU</label>
                                                    <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-[4px] border border-slate-200">{modeSize}</span>
                                                </div>
                                                <input type="range" min={1} max={15} step={1} value={modeSize} onChange={e => setModeSize(Number(e.target.value))}
                                                    className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-slate-900" />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Link Area */}
                        <div className="bg-white rounded-[6px] p-5 shadow-sm border border-slate-200 space-y-3">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">MENÜ BAĞLANTISI</label>
                            <div className="flex items-center gap-2 p-1.5 bg-slate-50 rounded-[6px] border border-slate-200">
                                <input type="text" value={menuUrl} readOnly className="flex-1 bg-transparent border-none px-3 text-[10px] font-bold text-slate-500 outline-none truncate uppercase tracking-widest" />
                                <button onClick={copyLink} className={`p-2.5 rounded-[4px] transition-all active:scale-95 ${copied ? 'bg-emerald-600 text-white' : 'bg-white text-slate-900 hover:bg-slate-50 border border-slate-200 shadow-sm'}`}>
                                    {copied ? <Check size={14} strokeWidth={2.5} /> : <Copy size={14} strokeWidth={2.5} />}
                                </button>
                                <a href={menuUrl} target="_blank" className="p-2.5 bg-white text-slate-900 rounded-[4px] border border-slate-200 shadow-sm hover:bg-slate-50 transition-all active:scale-95">
                                    <ExternalLink size={14} strokeWidth={2.5} />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* ========== COL 2: Önizleme (The Big Preview) ========== */}
                    <div className="xl:col-span-5 space-y-6">
                        <div className="bg-white rounded-[6px] shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <div className="flex items-center gap-3">
                                    <div className="bg-slate-900 text-white p-2 rounded-[4px] shadow-sm">
                                        <Eye size={16} strokeWidth={2.5} />
                                    </div>
                                    <h3 className="text-[11px] font-bold text-slate-900 uppercase tracking-widest">ÖNİZLEME</h3>
                                </div>
                                <StatusBadge status="ACTIVE" />
                            </div>

                            <div className="p-10 md:p-12 flex flex-col items-center justify-center bg-[#fcfdfe] relative overflow-hidden group">
                                {/* Decorative background elements */}
                                <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none select-none overflow-hidden">
                                    <div className="absolute -top-12 -left-12 w-64 h-64 bg-slate-900 rounded-full blur-[80px]" />
                                    <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-orange-600 rounded-full blur-[80px]" />
                                </div>

                                {/* The QR Card */}
                                <div className="relative z-10 transition-transform duration-500 group-hover:scale-[1.01]">
                                    <div className="bg-white p-10 md:p-12 rounded-[6px] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center gap-8">
                                        <div style={{ backgroundColor: bgColor }} className="p-10 rounded-[6px] border border-slate-50 relative group/qr">
                                            <QRCodeCanvas
                                                id="qr-canvas"
                                                value={menuUrl}
                                                size={280}
                                                bgColor={bgColor}
                                                fgColor={fgColor}
                                                level="H"
                                                includeMargin={false}
                                                imageSettings={mode === 'image' && activeLogo ? {
                                                    src: activeLogo,
                                                    x: undefined, y: undefined,
                                                    height: modeSize * 10, width: modeSize * 10,
                                                    excavate: true, crossOrigin: 'anonymous',
                                                } : undefined}
                                            />
                                            {mode === 'text' && qrText && (
                                                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center select-none pointer-events-none bg-white/80 p-2 rounded-[4px] backdrop-blur-sm"
                                                    style={{ color: textColor, fontSize: `${modeSize * 3}px`, fontWeight: 800 }}>
                                                    {qrText.toUpperCase()}
                                                </div>
                                            )}
                                        </div>

                                        <div className="text-center space-y-2">
                                            <h2 className="text-xl font-bold text-slate-900 tracking-tight uppercase">{tenantName}</h2>
                                            <div className="flex items-center justify-center gap-3">
                                                <div className="h-px w-6 bg-slate-100" />
                                                <span className="text-[9px] font-bold text-slate-400 tracking-[0.2em] uppercase">QR MENÜ</span>
                                                <div className="h-px w-6 bg-slate-100" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row gap-4">
                                <button onClick={downloadQR} className={`flex-1 py-3 px-6 rounded-[6px] font-bold uppercase tracking-tight text-[11px] flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 ${downloadSuccess ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-white hover:bg-slate-800'}`}>
                                    {downloadSuccess ? <Check size={16} strokeWidth={2.5} /> : <Download size={16} strokeWidth={2.5} />}
                                    {downloadSuccess ? 'İNDİRİLDİ' : 'GÖRSELİ İNDİR'}
                                </button>
                                <button onClick={handlePrint} className="flex-1 py-3 px-6 bg-white border border-slate-200 text-slate-900 rounded-[6px] font-bold uppercase tracking-tight text-[11px] flex items-center justify-center gap-2 hover:bg-slate-50 transition-all active:scale-95 shadow-sm">
                                    <Printer size={16} strokeWidth={2.5} /> YAZDIR
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ========== COL 3: Şablonlar (Templetes) ========== */}
                    <div className="xl:col-span-3 space-y-6">
                        <div className="bg-white rounded-[6px] shadow-sm border border-slate-200 overflow-hidden">
                            <div className="p-5 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
                                <div className="bg-slate-900 text-white p-2 rounded-[4px] shadow-sm">
                                    <FileImage size={16} strokeWidth={2.5} />
                                </div>
                                <h3 className="text-[11px] font-bold text-slate-900 uppercase tracking-widest">ŞABLONLAR</h3>
                            </div>

                            <div className="p-5 space-y-5">
                                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-tight leading-relaxed ml-1">
                                    MASA KARTI VE MENÜ POSTERİ İÇİN HAZIR TASARIMLARI KULLANIN.
                                </p>

                                <div className="space-y-4">
                                    {templates.map((src, i) => (
                                        <div key={i} className={`relative p-2 rounded-[6px] border transition-all cursor-pointer flex items-center gap-3 ${activeTemplate === i ? 'border-slate-900 bg-slate-50 shadow-sm' : 'border-slate-100 grayscale hover:grayscale-0 hover:border-slate-200'}`}>
                                            <img src={src} alt={`Template ${i + 1}`} className="w-14 h-14 rounded-[4px] object-cover" />
                                            <div className="flex-1">
                                                <span className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">ŞABLON {i + 1}</span>
                                                <p className="text-[9px] font-medium text-slate-400 uppercase tracking-tight mt-0.5">PREMIUM TASARIM</p>
                                            </div>
                                            {activeTemplate === i && (
                                                <div className="bg-slate-900 text-white p-1 rounded-[4px]">
                                                    <Check size={10} strokeWidth={3} />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <button onClick={() => alert('Premium şablonlar yakında aktif edilecek!')}
                                    className="w-full py-3 bg-slate-900 text-white rounded-[6px] font-bold uppercase tracking-tight text-[11px] flex items-center justify-center gap-2 shadow-md hover:bg-slate-800 transition-all active:scale-95">
                                    <Download size={16} strokeWidth={2.5} /> TÜMÜNÜ İNDİR
                                </button>
                            </div>
                        </div>

                        {/* Tip Box */}
                        <div className="bg-slate-900 rounded-[6px] p-5 border border-slate-800 shadow-xl">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="bg-orange-600 text-white p-1.5 rounded-[4px]">
                                    <Activity size={12} strokeWidth={3} />
                                </div>
                                <span className="text-[10px] font-bold text-white uppercase tracking-widest">İPUCU</span>
                            </div>
                            <p className="text-[11px] font-medium text-slate-300 leading-relaxed uppercase tracking-tight italic">
                                "En iyi okuma performansı için QR kodunuzda yüksek kontrastlı renkler tercih edin."
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

}
