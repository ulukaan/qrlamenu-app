"use client";

import React, { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
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
} from 'lucide-react';
import Link from 'next/link';

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
        <div style={{ padding: '0' }}>
            {/* Header */}
            <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 2rem'
            }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '500', color: '#333', margin: 0 }}>
                    QR Oluşturucu
                </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#666', fontSize: '0.9rem' }}>
                    <Link href="/dashboard" style={{ color: '#666', textDecoration: 'none' }}>
                        Geri
                    </Link>
                    <span>›</span>
                    <span>QR Oluşturucu</span>
                </div>
            </div>

            {/* Content Area */}
            <div style={{ padding: '0 2rem', paddingBottom: '3rem' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
                    gap: '18px',
                }}>

                    {/* ========== COL 1: Ayarlar ========== */}
                    <div style={cardStyle}>
                        <div style={cardHeaderStyle}>
                            <Settings size={17} color="#ff6e01" />
                            <h3 style={cardTitleStyle}>QR Kodu Ayarları</h3>
                        </div>
                        <div style={{ ...cardBodyStyle, maxHeight: 'calc(100vh - 160px)', overflowY: 'auto' }}>
                            {/* Ön plan rengi */}
                            <div style={fieldStyle}>
                                <div style={colorRowStyle}>
                                    <span style={labelStyle}>Ön plan rengi</span>
                                    <input type="color" value={fgColor}
                                        onChange={e => setFgColor(e.target.value)}
                                        style={colorInputStyle} />
                                </div>
                            </div>

                            {/* Arka plan rengi */}
                            <div style={fieldStyle}>
                                <div style={colorRowStyle}>
                                    <span style={labelStyle}>Arka plan rengi</span>
                                    <input type="color" value={bgColor}
                                        onChange={e => setBgColor(e.target.value)}
                                        style={colorInputStyle} />
                                </div>
                            </div>

                            {/* Dolgu */}
                            <div style={fieldStyle}>
                                <label style={labelStyle}>Dolgu: {padding}</label>
                                <input type="range" min={0} max={5} step={1} value={padding}
                                    onChange={e => setPadding(Number(e.target.value))} style={rangeStyle} />
                            </div>

                            {/* Köşe yarıçapı */}
                            <div style={fieldStyle}>
                                <label style={labelStyle}>Köşe yarıçapı: {cornerRadius}</label>
                                <input type="range" min={0} max={50} step={10} value={cornerRadius}
                                    onChange={e => setCornerRadius(Number(e.target.value))} style={rangeStyle} />
                            </div>

                            {/* Mod */}
                            <div style={fieldStyle}>
                                <label style={labelStyle}>Mod</label>
                                <select value={mode}
                                    onChange={e => setMode(e.target.value as QRMode)}
                                    style={selectStyle}>
                                    <option value="normal">Normal</option>
                                    <option value="text">Metin</option>
                                    <option value="image">Resim</option>
                                </select>
                            </div>

                            {/* TEXT MODE */}
                            {mode === 'text' && (
                                <React.Fragment>
                                    <div style={fieldStyle}>
                                        <label style={labelStyle}>Metin</label>
                                        <input type="text" value={qrText}
                                            onChange={e => setQrText(e.target.value)}
                                            placeholder="QR üzerindeki metin" style={inputStyle} />
                                    </div>
                                    <div style={fieldStyle}>
                                        <div style={colorRowStyle}>
                                            <span style={labelStyle}>Metin Rengi</span>
                                            <input type="color" value={textColor}
                                                onChange={e => setTextColor(e.target.value)}
                                                style={colorInputStyle} />
                                        </div>
                                    </div>
                                </React.Fragment>
                            )}

                            {/* IMAGE MODE */}
                            {mode === 'image' && (
                                <div style={fieldStyle}>
                                    <label style={labelStyle}>Resim</label>
                                    <label style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                                        padding: '9px 16px', border: '1px solid #e0e0e0', borderRadius: '8px',
                                        cursor: 'pointer', fontSize: '0.82rem', color: '#555', background: '#fafafa',
                                    }}>
                                        <Upload size={14} /> Fotoğraf Yükle
                                        <input type="file" accept="image/*" style={{ display: 'none' }}
                                            onChange={handleImageUpload} />
                                    </label>
                                    {customImage && (
                                        <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <img src={customImage} alt="Logo" style={{
                                                width: 42, height: 42, borderRadius: 8,
                                                objectFit: 'cover', border: '2px solid #f0f1f3',
                                            }} />
                                            <button onClick={() => setCustomImage(null)} style={{
                                                background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444',
                                                fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '4px',
                                            }}>
                                                <Trash2 size={13} /> Kaldır
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Common for text/image */}
                            {(mode === 'text' || mode === 'image') && (
                                <React.Fragment>
                                    <div style={fieldStyle}>
                                        <label style={labelStyle}>Boyut: {modeSize}</label>
                                        <input type="range" min={1} max={15} step={1} value={modeSize}
                                            onChange={e => setModeSize(Number(e.target.value))} style={rangeStyle} />
                                    </div>
                                    <div style={fieldStyle}>
                                        <label style={labelStyle}>Pozisyon X: {positionX}%</label>
                                        <input type="range" min={0} max={100} step={1} value={positionX}
                                            onChange={e => setPositionX(Number(e.target.value))} style={rangeStyle} />
                                    </div>
                                    <div style={fieldStyle}>
                                        <label style={labelStyle}>Pozisyon Y: {positionY}%</label>
                                        <input type="range" min={0} max={100} step={1} value={positionY}
                                            onChange={e => setPositionY(Number(e.target.value))} style={rangeStyle} />
                                    </div>
                                </React.Fragment>
                            )}
                        </div>
                    </div>

                    {/* ========== COL 2: Önizleme ========== */}
                    <div style={cardStyle}>
                        <div style={cardHeaderStyle}>
                            <Eye size={17} color="#ff6e01" />
                            <h3 style={cardTitleStyle}>QR Kodunuz</h3>
                        </div>
                        <div style={cardBodyStyle}>
                            {/* Link bar */}
                            <div style={{
                                display: 'flex', border: '1px solid #e0e0e0', borderRadius: '8px',
                                overflow: 'hidden', marginBottom: '16px',
                            }}>
                                <input type="text" value={menuUrl} readOnly style={{
                                    flex: 1, border: 'none', padding: '9px 12px', fontSize: '0.78rem',
                                    color: '#666', outline: 'none', background: '#fafafa', minWidth: 0,
                                    boxSizing: 'border-box',
                                }} />
                                <button onClick={copyLink} title="Kopyala" style={{
                                    padding: '9px 12px', border: 'none', borderLeft: '1px solid #e0e0e0',
                                    background: copied ? '#f0fdf4' : '#fafafa', cursor: 'pointer',
                                    color: copied ? '#10b981' : '#888', display: 'flex', alignItems: 'center',
                                }}>
                                    {copied ? <Check size={15} /> : <Copy size={15} />}
                                </button>
                                <Link href={menuUrl} target="_blank" style={{
                                    padding: '9px 12px', borderLeft: '1px solid #e0e0e0',
                                    display: 'flex', alignItems: 'center', color: '#888', background: '#fafafa',
                                }}>
                                    <ExternalLink size={15} />
                                </Link>
                            </div>

                            {/* QR Preview */}
                            <div style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                minHeight: '320px', background: '#f5f5f5',
                                borderRadius: '10px', padding: '24px', marginBottom: '16px',
                                backgroundImage: 'linear-gradient(45deg, #eee 25%, transparent 25%, transparent 75%, #eee 75%, #eee), linear-gradient(45deg, #eee 25%, transparent 25%, transparent 75%, #eee 75%, #eee)',
                                backgroundSize: '16px 16px',
                                backgroundPosition: '0 0, 8px 8px',
                            }}>
                                <div style={{
                                    background: bgColor, padding: `${padding * 8 + 16}px`,
                                    borderRadius: `${cornerRadius / 3}px`,
                                    boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
                                    position: 'relative', display: 'inline-block',
                                }}>
                                    <QRCodeCanvas
                                        id="qr-canvas"
                                        value={menuUrl}
                                        size={qrSize}
                                        bgColor={bgColor}
                                        fgColor={fgColor}
                                        level="H"
                                        includeMargin={false}
                                        imageSettings={mode === 'image' && activeLogo ? {
                                            src: activeLogo,
                                            x: undefined,
                                            y: undefined,
                                            height: modeSize * 7,
                                            width: modeSize * 7,
                                            excavate: true,
                                            crossOrigin: 'anonymous',
                                        } : undefined}
                                    />
                                    {/* Text overlay */}
                                    {mode === 'text' && qrText && (
                                        <div style={{
                                            position: 'absolute',
                                            left: `${positionX}%`,
                                            top: `${positionY}%`,
                                            transform: 'translate(-50%, -50%)',
                                            color: textColor,
                                            fontSize: `${modeSize * 2.5}px`,
                                            fontWeight: 800,
                                            pointerEvents: 'none',
                                            whiteSpace: 'nowrap',
                                            textShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                        }}>
                                            {qrText}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Restaurant name */}
                            <div style={{
                                textAlign: 'center', marginBottom: '16px',
                                fontSize: '0.75rem', fontWeight: 600, color: '#bbb',
                                textTransform: 'uppercase', letterSpacing: '2px',
                            }}>
                                {tenantName}
                            </div>

                            {/* Actions */}
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                <button onClick={downloadQR} style={{
                                    ...btnPrimary,
                                    background: downloadSuccess ? '#10b981' : '#ff6e01',
                                }}>
                                    {downloadSuccess ? <Check size={15} /> : <Download size={15} />}
                                    {downloadSuccess ? 'İndirildi!' : 'Resmi İndir'}
                                </button>
                                <button onClick={handlePrint} style={btnSecondary}>
                                    <Printer size={15} /> Yazdır
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ========== COL 3: Şablonlar ========== */}
                    <div style={cardStyle}>
                        <div style={cardHeaderStyle}>
                            <FileImage size={17} color="#ff6e01" />
                            <h3 style={cardTitleStyle}>QR Şablonları</h3>
                        </div>
                        <div style={cardBodyStyle}>
                            <p style={{ fontSize: '0.8rem', color: '#888', marginTop: 0, marginBottom: '14px', lineHeight: 1.5 }}>
                                Masa kartı ve menü posteri için hazır şablonları kullanın. Şablonları indirip QR kodunuzu üzerine yerleştirin.
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {templates.map((src, i) => (
                                    <div key={i} onClick={() => setActiveTemplate(i)} style={{
                                        border: activeTemplate === i ? '2px solid #ff6e01' : '2px solid #e8ecf1',
                                        borderRadius: '10px', overflow: 'hidden', cursor: 'pointer',
                                        transition: 'all 0.2s', position: 'relative',
                                        boxShadow: activeTemplate === i ? '0 0 0 3px rgba(255,110,1,0.12)' : 'none',
                                    }}>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={src} alt={`Şablon ${i + 1}`} style={{
                                            width: '100%', height: '130px', objectFit: 'cover', display: 'block',
                                        }} />
                                        {activeTemplate === i && (
                                            <div style={{
                                                position: 'absolute', top: 6, right: 6,
                                                background: '#ff6e01', color: '#fff',
                                                fontSize: '0.65rem', fontWeight: 700,
                                                padding: '3px 8px', borderRadius: '6px',
                                                display: 'flex', alignItems: 'center', gap: '3px',
                                            }}>
                                                <Check size={10} /> Seçili
                                            </div>
                                        )}
                                        <div style={{
                                            padding: '8px 12px', background: '#fafbfc',
                                            fontSize: '0.78rem', fontWeight: 600, color: '#555',
                                        }}>
                                            Şablon {i + 1}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button style={{ ...btnPrimary, width: '100%', justifyContent: 'center', marginTop: '14px' }}
                                onClick={() => alert('Şablon indirme özelliği yakında eklenecek!')}>
                                <Download size={15} /> Şablonları İndir
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div style={{ textAlign: 'center', padding: '16px 24px', color: '#bbb', fontSize: '0.75rem' }}>
                    {new Date().getFullYear()} QRlamenü — Tüm Hakları Saklıdır.
                </div>
            </div>
        </div>
    );
}
