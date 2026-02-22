"use client";

import React, { useState, useRef } from 'react';
import { Search } from 'lucide-react';
import { ThemeConfig } from '@/types/theme';
import { motion, AnimatePresence } from 'framer-motion';
import LiteProductCard from './LiteProductCard';

interface LiteLayoutProps {
    restaurant: any;
    theme: ThemeConfig;
    tableId?: string | null;
    campaigns?: any[];
    onProductClick?: (product: any) => void;
    settings?: any;
}

export default function LiteLayout({ restaurant, theme, tableId, campaigns = [], onProductClick, settings: passedSettings }: LiteLayoutProps) {
    const [activeCategory, setActiveCategory] = useState(restaurant.categories[0]?.id);
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const categoriesRef = useRef<HTMLDivElement>(null);

    const settings = passedSettings || restaurant.settings || {};
    const hasOrdering = settings.hasOrdering !== false;
    const pColor = settings.pColor || theme.colors.primary;

    const getCategoryProducts = (cat: any) => cat.products || cat.items || [];

    const handleCategoryClick = (id: string) => {
        setActiveCategory(id);
        const el = document.getElementById(`category-${id}`);
        if (el) {
            const offset = 120;
            const top = el.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: '#ffffff', paddingBottom: '80px', fontFamily: theme.fonts.body }}>
            {/* ── Sticky Header ── */}
            <header style={{ position: 'sticky', top: 0, zIndex: 30, background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(8px)', borderBottom: '1px solid #f0f0f0' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {restaurant.logoUrl && <img src={restaurant.logoUrl} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} alt="logo" />}
                        <h1 style={{ margin: 0, fontWeight: '800', fontSize: '1.05rem', color: '#111' }}>{restaurant.name}</h1>
                    </div>
                    <button onClick={() => setShowSearch(s => !s)} style={{ padding: '8px', background: '#f3f4f6', border: 'none', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                        <Search size={18} color="#555" />
                    </button>
                </div>

                {/* Search Bar */}
                <AnimatePresence>
                    {showSearch && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                            <div style={{ padding: '0 16px 12px', maxWidth: '1200px', margin: '0 auto' }}>
                                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} autoFocus
                                    placeholder="Ürünlerde ara..." style={{ width: '100%', padding: '10px 14px', border: '1px solid #e5e7eb', borderRadius: '12px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Category Tabs */}
                <div ref={categoriesRef} style={{ display: 'flex', overflowX: 'auto', padding: '0 16px', gap: '0', borderTop: '1px solid #f0f0f0', scrollbarWidth: 'none', maxWidth: '1200px', margin: '0 auto' }}>
                    {restaurant.categories.map((cat: any) => (
                        <button key={cat.id} onClick={() => handleCategoryClick(cat.id)} style={{
                            padding: '10px 16px', border: 'none', borderBottom: `2px solid ${activeCategory === cat.id ? pColor : 'transparent'}`,
                            background: 'none', color: activeCategory === cat.id ? pColor : '#888', fontWeight: activeCategory === cat.id ? '700' : '500',
                            fontSize: '0.85rem', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s'
                        }}>
                            {cat.name}
                        </button>
                    ))}
                </div>
            </header>

            {/* ── Content ── */}
            <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
                {/* Campaigns */}
                {campaigns.length > 0 && (
                    <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', padding: '16px 0', scrollbarWidth: 'none' }}>
                        {campaigns.map(camp => (
                            <div key={camp.id} style={{ flexShrink: 0, width: '280px', height: '130px', borderRadius: '16px', overflow: 'hidden', position: 'relative' }}>
                                <img src={camp.imageUrl || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&auto=format&fit=crop&q=60'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={camp.title} />
                                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '12px' }}>
                                    <p style={{ color: 'white', fontWeight: '700', fontSize: '0.85rem', margin: 0 }}>{camp.title}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Product Sections */}
                {restaurant.categories.map((cat: any) => {
                    const allProducts = getCategoryProducts(cat);
                    const products = searchQuery
                        ? allProducts.filter((p: any) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
                        : allProducts;
                    if (!products.length) return null;
                    return (
                        <section key={cat.id} id={`category-${cat.id}`} style={{ scrollMarginTop: '130px', paddingTop: '24px' }}>
                            <h2 style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9ca3af', margin: '0 0 12px', paddingBottom: '8px', borderBottom: '1px solid #f3f4f6' }}>
                                {cat.name}
                            </h2>
                            {/* Responsive grid: 1 col mobile, 2-3 col desktop */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))', gap: '1px', background: '#f3f4f6' }}>
                                {products.map((item: any) => (
                                    <LiteProductCard key={item.id} product={item} theme={theme}
                                        onAdd={hasOrdering ? () => onProductClick?.(item) : undefined}
                                        onClick={() => onProductClick?.(item)} />
                                ))}
                            </div>
                        </section>
                    );
                })}
            </main>
        </div>
    );
}
