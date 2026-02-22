"use client";

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { ThemeConfig } from '@/types/theme';
import { motion } from 'framer-motion';
import ClassicProductCard from './ClassicProductCard';

interface ClassicLayoutProps {
    restaurant: any;
    theme: ThemeConfig;
    tableId?: string | null;
    campaigns?: any[];
    onProductClick?: (product: any) => void;
    settings?: any;
}

export default function ClassicLayout({ restaurant, theme, tableId, campaigns = [], onProductClick, settings: passedSettings }: ClassicLayoutProps) {
    const [activeCategory, setActiveCategory] = useState(restaurant.categories[0]?.id);
    const [searchQuery, setSearchQuery] = useState('');

    const settings = passedSettings || restaurant.settings || {};
    const pColor = settings.pColor || theme.colors.primary;

    const getCategoryProducts = (cat: any) => cat.products || cat.items || [];

    return (
        <div style={{ fontFamily: theme.fonts.body, background: '#fdfbf7', minHeight: '100vh', paddingBottom: '80px' }}>
            {/* ── Header ── */}
            <header style={{ position: 'sticky', top: 0, zIndex: 30, background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(10px)', borderBottom: '1px solid #e7e0d8' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {restaurant.logoUrl && <img src={restaurant.logoUrl} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} alt="" />}
                        <div>
                            <h1 style={{ margin: 0, fontWeight: '700', fontSize: '1.1rem', fontFamily: theme.fonts.heading }}>{restaurant.name}</h1>
                            <p style={{ margin: 0, fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#9ca3af' }}>Fine Selection</p>
                        </div>
                    </div>
                    <div style={{ position: 'relative', flex: 1, maxWidth: '260px' }}>
                        <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                        <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Ürün ara..."
                            style={{ width: '100%', paddingLeft: '32px', paddingRight: '12px', paddingTop: '8px', paddingBottom: '8px', borderRadius: '20px', border: '1px solid #e5e7eb', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                </div>
                {/* Category Nav */}
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '4px', padding: '0 20px 4px', overflowX: 'auto', scrollbarWidth: 'none' }}>
                    {restaurant.categories.map((cat: any) => (
                        <button key={cat.id} onClick={() => { setActiveCategory(cat.id); document.getElementById(`classic-cat-${cat.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
                            style={{
                                padding: '8px 16px', borderRadius: '20px', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', fontWeight: '600', fontSize: '0.82rem', transition: 'all 0.2s',
                                background: activeCategory === cat.id ? pColor : 'transparent',
                                color: activeCategory === cat.id ? 'white' : '#6b7280'
                            }}>
                            {cat.name}
                        </button>
                    ))}
                </div>
            </header>

            {/* ── Hero Banner ── */}
            {campaigns.length > 0 && (
                <div style={{ maxWidth: '1200px', margin: '20px auto 0', padding: '0 20px', display: 'flex', gap: '12px', overflowX: 'auto', scrollbarWidth: 'none' }}>
                    {campaigns.map(camp => (
                        <div key={camp.id} style={{ flexShrink: 0, width: 'min(85vw, 320px)', height: '150px', borderRadius: '20px', overflow: 'hidden', position: 'relative', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                            <img src={camp.imageUrl || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&auto=format&fit=crop&q=60'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={camp.title} />
                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)', display: 'flex', alignItems: 'flex-end', padding: '14px' }}>
                                <p style={{ color: 'white', fontWeight: '700', fontSize: '0.9rem', margin: 0 }}>{camp.title}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── Product Grid (responsive) ── */}
            <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 20px' }}>
                {restaurant.categories.map((cat: any) => {
                    const allProducts = getCategoryProducts(cat);
                    const products = searchQuery
                        ? allProducts.filter((p: any) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
                        : allProducts;
                    if (!products.length) return null;
                    return (
                        <section key={cat.id} id={`classic-cat-${cat.id}`} style={{ scrollMarginTop: '120px', marginBottom: '40px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                <h2 style={{ margin: 0, fontFamily: theme.fonts.heading, fontSize: '1.3rem', fontWeight: '700', color: '#111' }}>{cat.name}</h2>
                                <div style={{ flex: 1, height: '1px', background: '#e7e0d8' }} />
                            </div>
                            {/* 1 col on mobile, 2-3 on tablet/desktop */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: '16px' }}>
                                {products.map((item: any) => (
                                    <motion.div key={item.id} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                                        <ClassicProductCard product={item} theme={theme}
                                            onAdd={() => onProductClick?.(item)}
                                            onClick={() => onProductClick?.(item)} />
                                    </motion.div>
                                ))}
                            </div>
                        </section>
                    );
                })}
            </main>
        </div>
    );
}
