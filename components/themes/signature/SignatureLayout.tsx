"use client";

import React, { useState } from 'react';
import { ThemeConfig } from '@/types/theme';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Instagram, Twitter, ArrowRight } from 'lucide-react';

interface SignatureLayoutProps {
    restaurant: any;
    theme: ThemeConfig;
    tableId?: string | null;
    campaigns?: any[];
    onProductClick?: (product: any) => void;
    settings?: any;
}

const SignatureLayout: React.FC<SignatureLayoutProps> = ({ restaurant, theme, tableId, campaigns = [], onProductClick, settings: passedSettings }) => {
    const [activeCategory, setActiveCategory] = useState(restaurant.categories?.[0]?.id || '');
    const settings = passedSettings || restaurant.settings || {};
    const pColor = settings.pColor || theme.colors.primary;

    const activeProducts = restaurant.categories?.find((c: any) => c.id === activeCategory)?.products || [];

    return (
        <div className="min-h-screen bg-white text-gray-900" style={{ fontFamily: theme.fonts.body, paddingBottom: '96px' }}>
            {/* Fixed Header */}
            <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(16px)', borderBottom: '1px solid #f0f0f0' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: theme.fonts.heading, fontSize: '1.3rem', fontWeight: '900', letterSpacing: '-0.03em' }}>{restaurant.name}</span>
                    <span style={{ fontSize: '9px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.2em', background: '#111', color: 'white', padding: '5px 10px', borderRadius: '20px' }}>SIGNATURE MENU</span>
                </div>
                {/* Category Tabs */}
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 12px', display: 'flex', gap: '8px', overflowX: 'auto', scrollbarWidth: 'none' }}>
                    {restaurant.categories?.map((cat: any) => (
                        <button key={cat.id} onClick={() => setActiveCategory(cat.id)} style={{
                            padding: '8px 20px', borderRadius: '30px', border: 'none', cursor: 'pointer', fontWeight: '800', fontSize: '0.82rem', whiteSpace: 'nowrap', transition: 'all 0.2s',
                            background: activeCategory === cat.id ? '#111' : '#f3f4f6',
                            color: activeCategory === cat.id ? 'white' : '#6b7280'
                        }}>{cat.name}</button>
                    ))}
                </div>
            </header>

            {/* Hero */}
            <div style={{ paddingTop: '110px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px 20px' }}>
                    <div style={{ height: 'min(40vw, 380px)', borderRadius: '32px', overflow: 'hidden', position: 'relative' }}>
                        <img src={restaurant.coverUrl || 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200&auto=format&fit=crop&q=70'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 'clamp(16px, 4vw, 40px)' }}>
                            <motion.h2 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                                style={{ fontFamily: theme.fonts.heading, fontSize: 'clamp(1.5rem, 5vw, 3rem)', color: 'white', fontWeight: '900', margin: 0, lineHeight: 1.1 }}>
                                Keşfetmeye<br />Hazır mısınız?
                            </motion.h2>
                        </div>
                    </div>

                    {/* Campaigns Row */}
                    {campaigns.length > 0 && (
                        <div style={{ display: 'flex', gap: '12px', marginTop: '16px', overflowX: 'auto', scrollbarWidth: 'none' }}>
                            {campaigns.map(c => (
                                <div key={c.id} style={{ flexShrink: 0, width: 'min(75vw, 280px)', height: '100px', borderRadius: '20px', overflow: 'hidden', position: 'relative', background: '#f3f4f6' }}>
                                    {c.imageUrl && <img src={c.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={c.title} />}
                                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(0,0,0,0.6),transparent)', display: 'flex', alignItems: 'flex-end', padding: '10px' }}>
                                        <p style={{ color: 'white', fontWeight: '700', fontSize: '0.8rem', margin: 0, lineClamp: 1 }}>{c.title}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Products Grid */}
            <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
                <AnimatePresence mode="wait">
                    <motion.div key={activeCategory} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))', gap: '20px', paddingBottom: '24px' }}>
                        {activeProducts.map((prod: any) => (
                            <div key={prod.id} onClick={() => onProductClick?.(prod)} style={{ cursor: 'pointer' }} className="group">
                                <div style={{ aspectRatio: '16/9', borderRadius: '24px', overflow: 'hidden', background: '#f3f4f6', marginBottom: '14px', position: 'relative' }}>
                                    <img src={prod.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=60'} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                                        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                                        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')} alt={prod.name} />
                                    <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', padding: '6px 12px', borderRadius: '20px', fontWeight: '900', fontSize: '0.9rem' }}>
                                        {prod.price}₺
                                    </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                                    <div>
                                        <h3 style={{ fontFamily: theme.fonts.heading, fontSize: '1.1rem', fontWeight: '900', margin: '0 0 4px' }}>{prod.name}</h3>
                                        <p style={{ margin: 0, fontSize: '0.82rem', color: '#9ca3af', lineHeight: 1.4 }}>{prod.description}</p>
                                    </div>
                                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid #e5e7eb', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', cursor: 'pointer' }}
                                        onMouseEnter={e => { e.currentTarget.style.background = '#111'; e.currentTarget.style.color = 'white'; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'inherit'; }}>
                                        <ArrowRight size={16} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Footer */}
            <footer style={{ borderTop: '1px solid #f0f0f0', padding: '32px 24px', textAlign: 'center' }}>
                <p style={{ fontFamily: theme.fonts.heading, fontSize: '1.1rem', fontWeight: '900', margin: '0 0 16px' }}>{restaurant.name}</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', color: '#d1d5db' }}>
                    <Globe size={18} /><Instagram size={18} /><Twitter size={18} />
                </div>
                <p style={{ fontSize: '9px', color: '#d1d5db', marginTop: '16px', fontWeight: '800', letterSpacing: '0.2em', textTransform: 'uppercase' }}>POWERED BY QRlamenü SIGNATURE</p>
            </footer>
        </div>
    );
};

export default SignatureLayout;
