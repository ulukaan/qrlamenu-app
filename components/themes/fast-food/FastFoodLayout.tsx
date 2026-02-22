"use client";

import React, { useState } from 'react';
import { ThemeConfig } from '@/types/theme';
import { motion } from 'framer-motion';
import { Flame, Star, Clock, ShoppingCart, Zap, MapPin, Store } from 'lucide-react';

interface FastFoodLayoutProps {
    restaurant: any;
    theme: ThemeConfig;
    tableId?: string | null;
    campaigns?: any[];
    onProductClick?: (product: any) => void;
    settings?: any;
}

const FastFoodLayout: React.FC<FastFoodLayoutProps> = ({ restaurant, theme, tableId, campaigns = [], onProductClick, settings: passedSettings }) => {
    const [activeCategory, setActiveCategory] = useState(restaurant.categories?.[0]?.id || '');
    const settings = passedSettings || restaurant.settings || {};
    const pColor = settings.pColor || theme.colors.primary;

    return (
        <div style={{ minHeight: '100vh', background: '#fff', fontFamily: theme.fonts.body, paddingBottom: '96px' }}>
            {/* Bold Hero Header */}
            <div style={{ background: `linear-gradient(135deg, ${pColor}, ${pColor}dd)`, padding: 'clamp(32px, 6vw, 60px) 24px clamp(24px, 4vw, 40px)', position: 'relative', overflow: 'hidden', borderBottomLeftRadius: 'clamp(24px, 5vw, 48px)', borderBottomRightRadius: 'clamp(24px, 5vw, 48px)' }}>
                <motion.div initial={{ scale: 2, opacity: 0 }} animate={{ scale: 1, opacity: 0.08 }}
                    style={{ position: 'absolute', right: '-24px', bottom: '-24px', color: 'white' }}>
                    <Flame size={220} />
                </motion.div>
                <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                    {restaurant.logoUrl && (
                        <div style={{ width: 'clamp(60px, 12vw, 90px)', height: 'clamp(60px, 12vw, 90px)', background: 'white', borderRadius: '50%', padding: '4px', flexShrink: 0, boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
                            <img src={restaurant.logoUrl} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} alt="logo" />
                        </div>
                    )}
                    <div>
                        <h1 style={{ fontFamily: theme.fonts.heading, fontSize: 'clamp(1.8rem, 6vw, 3.5rem)', color: 'white', margin: '0 0 8px', lineHeight: 1, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                            {restaurant.name}
                        </h1>
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                            <span style={{ background: 'rgba(255,255,255,0.2)', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Clock size={12} /> 15-25 DK
                            </span>
                            <span style={{ background: 'rgba(255,255,255,0.2)', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Star size={12} fill="currentColor" /> 4.9
                            </span>
                        </div>
                    </div>
                </div>

                {/* Campaigns */}
                {campaigns.length > 0 && (
                    <div style={{ maxWidth: '1200px', margin: '20px auto 0', display: 'flex', gap: '12px', overflowX: 'auto', scrollbarWidth: 'none' }}>
                        {campaigns.map(c => (
                            <div key={c.id} style={{ flexShrink: 0, width: 'min(80vw, 280px)', height: '110px', borderRadius: '20px', overflow: 'hidden', position: 'relative', background: 'rgba(255,255,255,0.15)', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                                {c.imageUrl && <img src={c.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={c.title} />}
                                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(0,0,0,0.6),transparent)', display: 'flex', alignItems: 'flex-end', padding: '10px' }}>
                                    <span style={{ color: 'white', fontWeight: '800', fontSize: '0.78rem' }}>{c.title}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Sticky Category Bar */}
            <div style={{ position: 'sticky', top: 0, zIndex: 30, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)', borderBottom: '1px solid #f0f0f0', padding: '12px 0' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '8px', padding: '0 16px', overflowX: 'auto', scrollbarWidth: 'none' }}>
                    {restaurant.categories?.map((cat: any) => (
                        <button key={cat.id} onClick={() => { setActiveCategory(cat.id); document.getElementById(`ff-cat-${cat.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
                            style={{
                                flexShrink: 0, padding: '8px 18px', borderRadius: '20px', border: '2px solid', cursor: 'pointer', fontSize: '0.82rem', fontWeight: '800', transition: 'all 0.2s',
                                borderColor: activeCategory === cat.id ? pColor : '#e5e7eb',
                                background: activeCategory === cat.id ? pColor : 'white',
                                color: activeCategory === cat.id ? 'white' : '#6b7280'
                            }}>
                            🔥 {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Products */}
            <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' }}>
                {restaurant.categories?.map((cat: any) => {
                    const products = cat.products || cat.items || [];
                    if (!products.length) return null;
                    return (
                        <section key={cat.id} id={`ff-cat-${cat.id}`} style={{ scrollMarginTop: '80px', marginBottom: '40px' }}>
                            <h2 style={{ fontFamily: theme.fonts.heading, fontSize: 'clamp(1.5rem, 4vw, 2rem)', letterSpacing: '0.05em', textTransform: 'uppercase', margin: '0 0 16px', color: '#111' }}>
                                🔥 {cat.name}
                            </h2>
                            {/* 1 col mobile, 2 col sm, 3 col large */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: '14px' }}>
                                {products.map((prod: any) => (
                                    <motion.div key={prod.id} whileTap={{ scale: 0.97 }} onClick={() => onProductClick?.(prod)}
                                        style={{ background: 'white', borderRadius: '24px', overflow: 'hidden', border: '2px solid #f3f4f6', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ aspectRatio: '16/10', overflow: 'hidden', background: '#f9fafb' }}>
                                            <img src={prod.imageUrl || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&auto=format&fit=crop&q=60'}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                                                onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                                                onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                                                alt={prod.name} />
                                        </div>
                                        <div style={{ padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flex: 1 }}>
                                            <div style={{ flex: 1, paddingRight: '12px' }}>
                                                <h3 style={{ margin: '0 0 4px', fontWeight: '900', fontSize: '0.95rem', color: '#111' }}>{prod.name}</h3>
                                                <p style={{ margin: 0, fontSize: '0.78rem', color: '#9ca3af', fontWeight: '600', lineHeight: 1.3 }}>{prod.description}</p>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', flexShrink: 0 }}>
                                                <span style={{ color: pColor, fontWeight: '900', fontSize: '1rem' }}>{prod.price}₺</span>
                                                <div style={{ width: '34px', height: '34px', background: pColor, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <ShoppingCart size={16} color="white" strokeWidth={2.5} />
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </section>
                    );
                })}
            </main>

            {/* Promo Footer */}
            <div style={{ background: '#111', borderRadius: 'clamp(24px, 5vw, 48px) clamp(24px, 5vw, 48px) 0 0', padding: 'clamp(32px, 6vw, 60px)', textAlign: 'center', color: 'white', marginTop: '20px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#ef4444', padding: '5px 14px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '900', marginBottom: '16px' }}>
                    <Zap size={12} fill="currentColor" /> SÜPER FIRSATLAR
                </div>
                <h3 style={{ fontFamily: theme.fonts.heading, fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', margin: '0 0 8px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>ACIKCINDA YANINDAYIZ!</h3>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '24px', opacity: 0.3 }}>
                    <Store size={20} /><Clock size={20} /><MapPin size={20} />
                </div>
            </div>
        </div>
    );
};

export default FastFoodLayout;
