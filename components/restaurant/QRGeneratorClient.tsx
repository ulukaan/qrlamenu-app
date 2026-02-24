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

const StatusBadge = ({ status }: { status: string }) => {
    return (
        <span className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 bg-emerald-50 text-emerald-600 border-emerald-100 text-[10px] font-black tracking-widest">
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
            <div className="p-8 md:p-12 lg:p-16">
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start">

                    {/* ========== COL 1: Ayarlar (Customization Panel) ========== */}
                    <div className="xl:col-span-4 space-y-10">
                        <div className="bg-white rounded-[40px] shadow-sm border-2 border-gray-50 overflow-hidden">
                            <div className="p-8 border-b-2 border-gray-50 flex items-center gap-4 bg-gray-50/30">
                                <div className="bg-gray-900 text-white p-3 rounded-2xl shadow-lg">
                                    <Settings size={20} strokeWidth={3} />
                                </div>
                                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">TASARIM AYARLARI</h3>
                            </div>

                            <div className="p-8 space-y-8 max-h-[calc(100vh-280px)] overflow-y-auto no-scrollbar">
                                {/* Color Selectors */}
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">QR RENGİ</label>
                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border-2 border-gray-100/50 group hover:border-[#ff7a21] transition-all">
                                            <input type="color" value={fgColor} onChange={e => setFgColor(e.target.value)} className="w-10 h-10 rounded-xl border-none cursor-pointer bg-transparent" />
                                            <span className="text-xs font-black text-gray-900 tracking-tighter uppercase">{fgColor}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">ARKA PLAN</label>
                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border-2 border-gray-100/50 group hover:border-[#ff7a21] transition-all">
                                            <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-10 h-10 rounded-xl border-none cursor-pointer bg-transparent" />
                                            <span className="text-xs font-black text-gray-900 tracking-tighter uppercase">{bgColor}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Sliders */}
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center px-1">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">DIŞ BOŞLUK (PADDING)</label>
                                            <span className="bg-orange-50 text-[#ff7a21] text-[10px] font-black px-2 py-0.5 rounded-lg border border-orange-100">{padding}</span>
                                        </div>
                                        <input type="range" min={0} max={5} step={1} value={padding} onChange={e => setPadding(Number(e.target.value))}
                                            className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#ff7a21]" />
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center px-1">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">KÖŞE YUMUŞATMA</label>
                                            <span className="bg-orange-50 text-[#ff7a21] text-[10px] font-black px-2 py-0.5 rounded-lg border border-orange-100">{cornerRadius}</span>
                                        </div>
                                        <input type="range" min={0} max={50} step={10} value={cornerRadius} onChange={e => setCornerRadius(Number(e.target.value))}
                                            className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#ff7a21]" />
                                    </div>
                                </div>

                                {/* Mode Selection */}
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">MERKEZ LOGO / METİN</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {['normal', 'text', 'image'].map((m) => (
                                            <button key={m} onClick={() => setMode(m as QRMode)}
                                                className={`py-4 rounded-2xl border-2 text-[10px] font-black uppercase tracking-widest transition-all ${mode === m ? 'bg-gray-900 border-gray-900 text-white shadow-xl shadow-gray-400/20 scale-[1.05]' : 'bg-gray-50 border-gray-100 text-gray-400 hover:bg-gray-100'}`}>
                                                {m === 'normal' ? 'YOK' : m === 'text' ? 'METİN' : 'LOGO'}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Dynamic Mode Controls */}
                                <AnimatePresence mode="wait">
                                    {mode === 'text' && (
                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6 pt-4 border-t-2 border-gray-50">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">LOGO METNİ</label>
                                                <input type="text" value={qrText} onChange={e => setQrText(e.target.value)} className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 text-xs font-black text-gray-900 outline-none focus:border-[#ff7a21] transition-all" />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">METİN RENGİ</label>
                                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border-2 border-gray-100/50">
                                                    <input type="color" value={textColor} onChange={e => setTextColor(e.target.value)} className="w-10 h-10 rounded-xl border-none cursor-pointer bg-transparent" />
                                                    <span className="text-xs font-black text-gray-900 tracking-tighter uppercase">{textColor}</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {mode === 'image' && (
                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6 pt-4 border-t-2 border-gray-50">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">LOGO GÖRSELİ</label>
                                                <div className="relative group">
                                                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="logo-upload" />
                                                    <label htmlFor="logo-upload" className="flex items-center justify-center gap-3 w-full py-6 bg-gray-50 border-2 border-dashed border-gray-200 rounded-[24px] cursor-pointer hover:bg-gray-100 hover:border-[#ff7a21] transition-all">
                                                        <Upload size={20} className="text-gray-400 group-hover:text-[#ff7a21]" strokeWidth={3} />
                                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-gray-900">GÖRSEL SEÇİN</span>
                                                    </label>
                                                </div>
                                                {customImage && (
                                                    <div className="flex items-center justify-between p-4 bg-orange-50 rounded-[24px] border-2 border-orange-100 animate-in fade-in slide-in-from-top-2">
                                                        <div className="flex items-center gap-4">
                                                            <img src={customImage} alt="Logo" className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-sm" />
                                                            <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">LOGO AKTİF</span>
                                                        </div>
                                                        <button onClick={() => setCustomImage(null)} className="p-3 bg-white text-rose-500 rounded-xl shadow-sm hover:bg-rose-50 transition-all">
                                                            <Trash2 size={16} strokeWidth={3} />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}

                                    {(mode === 'text' || mode === 'image') && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pt-4 border-t-2 border-gray-50">
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center px-1">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">LOGO/METİN BOYUTU</label>
                                                    <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-2 py-0.5 rounded-lg border border-blue-100">{modeSize}</span>
                                                </div>
                                                <input type="range" min={1} max={15} step={1} value={modeSize} onChange={e => setModeSize(Number(e.target.value))}
                                                    className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Link Area */}
                        <div className="bg-white rounded-[40px] p-8 shadow-sm border-2 border-gray-50 space-y-4">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">MENÜ BAĞLANTISI</label>
                            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-[24px] border-2 border-gray-100/50">
                                <input type="text" value={menuUrl} readOnly className="flex-1 bg-transparent border-none px-4 text-xs font-bold text-gray-500 outline-none truncate" />
                                <button onClick={copyLink} className={`p-4 rounded-2xl transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-white text-gray-900 hover:bg-gray-900 hover:text-white shadow-sm'}`}>
                                    {copied ? <Check size={18} strokeWidth={3} /> : <Copy size={18} strokeWidth={3} />}
                                </button>
                                <a href={menuUrl} target="_blank" className="p-4 bg-white text-gray-900 rounded-2xl shadow-sm hover:bg-gray-900 hover:text-white transition-all">
                                    <ExternalLink size={18} strokeWidth={3} />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* ========== COL 2: Önizleme (The Big Preview) ========== */}
                    <div className="xl:col-span-5 space-y-10">
                        <div className="bg-white rounded-[40px] shadow-sm border-2 border-gray-50 overflow-hidden flex flex-col">
                            <div className="p-8 border-b-2 border-gray-50 flex items-center justify-between bg-gray-50/30">
                                <div className="flex items-center gap-4">
                                    <div className="bg-gray-900 text-white p-3 rounded-2xl shadow-lg">
                                        <Eye size={20} strokeWidth={3} />
                                    </div>
                                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">ÖNİZLEME</h3>
                                </div>
                                <StatusBadge status="ACTIVE" />
                            </div>

                            <div className="p-12 md:p-16 flex flex-col items-center justify-center bg-[#fcfdfe] relative overflow-hidden group">
                                {/* Decorative background elements */}
                                <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none select-none overflow-hidden">
                                    <div className="absolute -top-24 -left-24 w-96 h-96 bg-orange-500 rounded-full blur-[100px]" />
                                    <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500 rounded-full blur-[100px]" />
                                </div>

                                {/* The QR Card */}
                                <div className="relative z-10 transition-transform duration-700 group-hover:scale-[1.02] active:scale-[0.98]">
                                    <div className="bg-white p-12 md:p-16 rounded-[48px] shadow-2xl shadow-gray-200/50 border-2 border-gray-50 flex flex-col items-center gap-10">
                                        <div style={{ backgroundColor: bgColor }} className="p-12 rounded-[32px] shadow-inner relative">
                                            <QRCodeCanvas
                                                id="qr-canvas"
                                                value={menuUrl}
                                                size={320}
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
                                                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center select-none pointer-events-none"
                                                    style={{ color: textColor, fontSize: `${modeSize * 3.5}px`, fontWeight: 900, textShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                                                    {qrText.toUpperCase()}
                                                </div>
                                            )}
                                        </div>

                                        <div className="text-center space-y-4">
                                            <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">{tenantName}</h2>
                                            <div className="flex items-center justify-center gap-3">
                                                <div className="h-px w-8 bg-gray-100" />
                                                <span className="text-[10px] font-black text-gray-400 tracking-[0.3em] uppercase">QR MENÜ</span>
                                                <div className="h-px w-8 bg-gray-100" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-10 bg-gray-50 border-t-2 border-gray-100 flex flex-col sm:flex-row gap-6">
                                <button onClick={downloadQR} className={`flex-1 py-5 rounded-[24px] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-xl transition-all active:scale-95 ${downloadSuccess ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-[#ff7a21] text-white shadow-orange-500/20 hover:scale-[1.03]'}`}>
                                    {downloadSuccess ? <Check size={20} strokeWidth={3} /> : <Download size={20} strokeWidth={3} />}
                                    {downloadSuccess ? 'İNDİRİLDİ' : 'GÖRSELİ İNDİR'}
                                </button>
                                <button onClick={handlePrint} className="flex-1 py-5 bg-white border-2 border-gray-200 text-gray-900 rounded-[24px] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:border-gray-900 transition-all active:scale-95 shadow-sm">
                                    <Printer size={20} strokeWidth={3} /> YAZDIR
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ========== COL 3: Şablonlar (Templetes) ========== */}
                    <div className="xl:col-span-3 space-y-10">
                        <div className="bg-white rounded-[40px] shadow-sm border-2 border-gray-50 overflow-hidden">
                            <div className="p-8 border-b-2 border-gray-50 flex items-center gap-4 bg-gray-50/30">
                                <div className="bg-gray-900 text-white p-3 rounded-2xl shadow-lg">
                                    <FileImage size={20} strokeWidth={3} />
                                </div>
                                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">ŞABLONLAR</h3>
                            </div>

                            <div className="p-8 space-y-6">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-loose pl-1">
                                    Masa kartı ve menü posteri için hazır premium tasarımları kullanın.
                                </p>

                                <div className="space-y-6">
                                    {templates.map((src, i) => (
                                        <div key={i} onClick={() => setActiveTemplate(i)}
                                            className={`relative group cursor-pointer overflow-hidden rounded-[24px] border-4 transition-all ${activeTemplate === i ? 'border-[#ff7a21] shadow-xl shadow-orange-500/10' : 'border-gray-50 grayscale-[0.8] hover:grayscale-0 hover:border-gray-100'}`}>
                                            <img src={src} alt={`Template ${i + 1}`} className="w-full h-40 object-cover transition-transform duration-1000 group-hover:scale-110" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-5">
                                                <span className="text-white text-[10px] font-black uppercase tracking-widest">Şablon {i + 1}</span>
                                            </div>
                                            {activeTemplate === i && (
                                                <div className="absolute top-4 right-4 bg-[#ff7a21] text-white p-2 rounded-xl shadow-lg">
                                                    <Check size={14} strokeWidth={4} />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <button onClick={() => alert('Premium şablonlar yakında aktif edilecek!')}
                                    className="w-full py-5 bg-gray-900 text-white rounded-[24px] font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 shadow-xl shadow-gray-900/10 hover:bg-black transition-all">
                                    <Download size={18} strokeWidth={3} /> TÜMÜNÜ PAKET İNDİR
                                </button>
                            </div>
                        </div>

                        {/* Tip Box */}
                        <div className="bg-orange-50 rounded-[40px] p-8 border-2 border-orange-100/50">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="bg-orange-500 text-white p-2 rounded-lg">
                                    <Activity size={12} strokeWidth={4} />
                                </div>
                                <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">PROFESYONEL İPUCU</span>
                            </div>
                            <p className="text-xs font-black text-orange-900/70 leading-relaxed italic">
                                "En iyi okuma performansı için QR kodunuzda yüksek kontrastlı renkler (örneğin koyu lacivert üzerine beyaz) tercih edin."
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

}
