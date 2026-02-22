"use client";

import React, { useState } from 'react';
import { ThemeConfig } from '@/types/theme';
import { motion } from 'framer-motion';
import { Instagram, Facebook, Clock } from 'lucide-react';

interface LuxuryLayoutProps {
    restaurant: any;
    theme: ThemeConfig;
    tableId?: string | null;
    campaigns?: any[];
    onProductClick?: (product: any) => void;
    settings?: any;
}

const LuxuryLayout: React.FC<LuxuryLayoutProps> = ({ restaurant, theme, tableId, campaigns = [], onProductClick, settings: passedSettings }) => {
    const settings = passedSettings || restaurant.settings || {};
    const pColor = settings.pColor || theme.colors.primary;

    return (
        <div style={{ minHeight: '100vh', background: theme.colors.background, color: theme.colors.text, fontFamily: theme.fonts.body, paddingBottom: '96px' }}>
            {/* Fullscreen Splash Hero */}
            <div style={{ height: '100vh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'url(https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=1200&auto=format&fit=crop&q=70) center/cover', filter: 'brightness(0.4)' }} />
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.5 }}
                    style={{ position: 'relative', textAlign: 'center', padding: '0 24px' }}>
                    <div style={{ width: '1px', height: '80px', background: `linear-gradient(to bottom, transparent, ${pColor})`, margin: '0 auto 32px' }} />
                    <h1 style={{ fontFamily: theme.fonts.heading, fontSize: 'clamp(2.5rem, 10vw, 6rem)', fontWeight: '900', margin: '0 0 16px', lineHeight: 1, letterSpacing: '-0.02em', fontStyle: 'italic' }}>
                        {restaurant.name}
                    </h1>
                    <p style={{ fontSize: '10px', letterSpacing: '0.4em', textTransform: 'uppercase', opacity: 0.5, marginBottom: '40px' }}>EXQUISITE DINING EXPERIENCE</p>
                    <motion.button animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 3 }}
                        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                        style={{ background: 'none', border: 'none', color: pColor, cursor: 'pointer', fontSize: '10px', letterSpacing: '0.3em', fontWeight: '900', textTransform: 'uppercase' }}>
                        MENÜYÜ KEŞFET ↓
                    </motion.button>
                </motion.div>
            </div>

            {/* Menu Content */}
            <div style={{ maxWidth: '900px', margin: '0 auto', padding: '64px 24px' }}>
                {restaurant.categories?.map((cat: any, catIdx: number) => {
                    const products = cat.products || cat.items || [];
                    if (!products.length) return null;
                    return (
                        <section key={cat.id} style={{ marginBottom: '100px' }}>
                            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                                <h2 style={{ fontFamily: theme.fonts.heading, fontSize: 'clamp(2rem, 6vw, 3.5rem)', fontStyle: 'italic', margin: '0 0 12px' }}>{cat.name}</h2>
                                <div style={{ width: '60px', height: '1px', background: pColor, margin: '0 auto' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '80px' }}>
                                {products.map((prod: any, idx: number) => (
                                    <motion.div key={prod.id} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                                        onClick={() => onProductClick?.(prod)}
                                        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '40px', alignItems: 'center', cursor: 'pointer' }}>
                                        {/* Image — alternate sides on desktop */}
                                        <div style={{ order: idx % 2 === 0 ? 0 : 1, aspectRatio: '4/5', overflow: 'hidden', position: 'relative' }}>
                                            <img src={prod.imageUrl || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&auto=format&fit=crop&q=60'}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(30%)', transition: 'filter 0.8s' }}
                                                onMouseEnter={e => (e.currentTarget.style.filter = 'grayscale(0%)')}
                                                onMouseLeave={e => (e.currentTarget.style.filter = 'grayscale(30%)')} alt={prod.name} />
                                            <div style={{ position: 'absolute', inset: '16px', border: `1px solid rgba(255,255,255,0.1)`, pointerEvents: 'none' }} />
                                        </div>
                                        {/* Text */}
                                        <div style={{ order: idx % 2 === 0 ? 1 : 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                            <h3 style={{ fontFamily: theme.fonts.heading, fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontStyle: 'italic', margin: 0, lineHeight: 1.1 }}>{prod.name}</h3>
                                            <p style={{ opacity: 0.5, fontSize: '0.9rem', lineHeight: 1.7, fontStyle: 'italic', margin: 0 }}>{prod.description || 'Lüks sunumumuzla hazırlanan özel bir lezzet.'}</p>
                                            <p style={{ fontSize: '1.4rem', fontWeight: '300', letterSpacing: '0.1em', margin: 0, color: pColor }}>{prod.price}₺</p>
                                            <button onClick={e => { e.stopPropagation(); onProductClick?.(prod); }}
                                                style={{ background: 'none', border: 'none', borderBottom: `1px solid ${pColor}`, paddingBottom: '4px', color: 'inherit', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.3em', fontWeight: '900', cursor: 'pointer', width: 'fit-content', transition: 'opacity 0.2s' }}>
                                                SİPARİŞ EKLE
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </section>
                    );
                })}
            </div>

            {/* Footer */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '48px', textAlign: 'center' }}>
                <h4 style={{ fontFamily: theme.fonts.heading, fontSize: '1.5rem', fontStyle: 'italic', margin: '0 0 20px', opacity: 0.7 }}>L'Art de Vivre</h4>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', opacity: 0.2 }}>
                    <Instagram size={18} /><Facebook size={18} /><Clock size={18} />
                </div>
            </div>
        </div>
    );
};

export default LuxuryLayout;
