"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Search, ShoppingBag, Menu, X, ChevronRight, Bell, Home, LayoutGrid, ShoppingCart } from 'lucide-react';
import { ThemeConfig } from '@/types/theme';
import { motion, AnimatePresence } from 'framer-motion';
import MobileAppsProductCard from './MobileAppsProductCard';

interface MobileAppsLayoutProps {
    restaurant: any;
    theme: ThemeConfig;
    tableId?: string | null;
    campaigns?: any[];
    onProductClick?: (product: any) => void;
    settings?: any;
}

export default function MobileAppsLayout({ restaurant, theme, tableId, campaigns = [], onProductClick, settings: passedSettings }: MobileAppsLayoutProps) {
    const [activeCategory, setActiveCategory] = useState(restaurant.categories[0]?.id);
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('home'); // 'home', 'search', 'cart'

    const categoriesRef = useRef<HTMLDivElement>(null);

    const settings = passedSettings || restaurant.settings || {};
    const hasOrdering = settings.hasOrdering !== false;
    const pColor = settings.pColor || theme.colors.primary;

    const getCategoryProducts = (cat: any) => cat.products || cat.items || [];

    const handleCategoryClick = (id: string) => {
        setActiveCategory(id);
        const el = document.getElementById(`category-${id}`);
        if (el) {
            const offset = 140; // Header + Categories spacer
            const top = el.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    };

    // Filter products based on search
    const allFilteredProducts = restaurant.categories.flatMap((cat: any) =>
        getCategoryProducts(cat).filter((p: any) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', paddingBottom: '100px', fontFamily: theme.fonts.body, position: 'relative' }}>
            {/* ── App Style Header ── */}
            <header style={{
                position: 'sticky',
                top: 0,
                zIndex: 100,
                background: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(20px)',
                borderBottom: '1px solid #f1f5f9',
                padding: '12px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '12px',
                        background: pColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        boxShadow: `0 4px 12px ${pColor}30`
                    }}>
                        {restaurant.logoUrl ? (
                            <img src={restaurant.logoUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="logo" />
                        ) : (
                            <Home color="white" size={20} />
                        )}
                    </div>
                    <div>
                        <h1 style={{ margin: 0, fontWeight: '900', fontSize: '1rem', color: '#0f172a', letterSpacing: '-0.02em' }}>{restaurant.name}</h1>
                        <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '600' }}>{tableId ? `Masa ${tableId}` : 'Hoş Geldiniz'}</span>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        onClick={() => setActiveTab('search')}
                        style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#f1f5f9', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                    >
                        <Search size={18} color="#475569" />
                    </button>
                    {settings.allowCallWaiter && (
                        <button style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#f1f5f9', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                            <Bell size={18} color="#475569" />
                        </button>
                    )}
                </div>
            </header>

            {/* ── Main View ── */}
            <main style={{ padding: '0 20px' }}>
                <AnimatePresence mode="wait">
                    {activeTab === 'home' && (
                        <motion.div
                            key="home"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            {/* Hero / Information Card */}
                            <div style={{
                                marginTop: '20px',
                                background: `linear-gradient(135deg, ${pColor} 0%, ${pColor}dd 100%)`,
                                borderRadius: '24px',
                                padding: '24px',
                                color: 'white',
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                <div style={{ position: 'relative', zIndex: 1 }}>
                                    <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '900', marginBottom: '8px' }}>Günün Lezzetlerini Keşfedin</h2>
                                    <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.9, fontWeight: '600', lineHeight: 1.5 }}>{restaurant.description || 'Sizin için özenle hazırladığımız menümüze göz atın.'}</p>
                                </div>
                                <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', opacity: 0.2 }}>
                                    <ShoppingBag size={120} />
                                </div>
                            </div>

                            {/* Horizontal Categories */}
                            <div style={{
                                display: 'flex',
                                overflowX: 'auto',
                                padding: '20px 0',
                                gap: '12px',
                                scrollbarWidth: 'none',
                                position: 'sticky',
                                top: '64px',
                                zIndex: 90,
                                margin: '0 -20px',
                                paddingLeft: '20px',
                                background: '#f8fafc'
                            }}>
                                {restaurant.categories.map((cat: any) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => handleCategoryClick(cat.id)}
                                        style={{
                                            padding: '10px 20px',
                                            borderRadius: '16px',
                                            border: 'none',
                                            background: activeCategory === cat.id ? pColor : 'white',
                                            color: activeCategory === cat.id ? 'white' : '#64748b',
                                            fontWeight: '800',
                                            fontSize: '0.85rem',
                                            whiteSpace: 'nowrap',
                                            boxShadow: activeCategory === cat.id ? `0 8px 16px ${pColor}30` : '0 4px 8px rgba(0,0,0,0.02)',
                                            transition: 'all 0.2s',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>

                            {/* Products Grid */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                                {restaurant.categories.map((cat: any) => {
                                    const products = getCategoryProducts(cat);
                                    if (!products.length) return null;
                                    return (
                                        <section key={cat.id} id={`category-${cat.id}`} style={{ scrollMarginTop: '160px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '900', color: '#0f172a' }}>{cat.name}</h3>
                                                <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '700' }}>{products.length} Ürün</span>
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                                {products.map((item: any) => (
                                                    <MobileAppsProductCard
                                                        key={item.id}
                                                        product={item}
                                                        theme={theme}
                                                        onAdd={hasOrdering ? () => onProductClick?.(item) : undefined}
                                                        onClick={() => onProductClick?.(item)}
                                                    />
                                                ))}
                                            </div>
                                        </section>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'search' && (
                        <motion.div
                            key="search"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            style={{ paddingTop: '20px' }}
                        >
                            <div style={{ position: 'relative', marginBottom: '24px' }}>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    autoFocus
                                    placeholder="Neye bakmıştınız?"
                                    style={{
                                        width: '100%',
                                        padding: '16px 20px',
                                        paddingLeft: '48px',
                                        background: 'white',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '20px',
                                        fontSize: '1rem',
                                        outline: 'none',
                                        boxSizing: 'border-box',
                                        fontWeight: '600',
                                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.04)'
                                    }}
                                />
                                <Search style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)' }} size={18} color="#94a3b8" />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}
                                    >
                                        <X size={18} color="#94a3b8" />
                                    </button>
                                )}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                {allFilteredProducts.map((item: any) => (
                                    <MobileAppsProductCard
                                        key={item.id}
                                        product={item}
                                        theme={theme}
                                        onAdd={hasOrdering ? () => onProductClick?.(item) : undefined}
                                        onClick={() => onProductClick?.(item)}
                                    />
                                ))}
                                {searchQuery && allFilteredProducts.length === 0 && (
                                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px 0' }}>
                                        <p style={{ color: '#64748b', fontWeight: '600' }}>Sonuç bulunamadı.</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* ── App Style Bottom Nav ── */}
            <nav style={{
                position: 'fixed',
                bottom: '24px',
                left: '20px',
                right: '20px',
                height: '72px',
                background: '#1e293b',
                borderRadius: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-around',
                padding: '0 12px',
                zIndex: 1000,
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)'
            }}>
                <button
                    onClick={() => setActiveTab('home')}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px',
                        background: 'none',
                        border: 'none',
                        padding: '12px',
                        cursor: 'pointer',
                        color: activeTab === 'home' ? pColor : '#94a3b8'
                    }}
                >
                    <Home size={22} color={activeTab === 'home' ? pColor : '#94a3b8'} strokeWidth={activeTab === 'home' ? 2.5 : 2} />
                    <span style={{ fontSize: '0.65rem', fontWeight: '800' }}>Keşfet</span>
                </button>

                <button
                    onClick={() => setActiveTab('search')}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px',
                        background: 'none',
                        border: 'none',
                        padding: '12px',
                        cursor: 'pointer',
                        color: activeTab === 'search' ? pColor : '#94a3b8'
                    }}
                >
                    <Search size={22} color={activeTab === 'search' ? pColor : '#94a3b8'} strokeWidth={activeTab === 'search' ? 2.5 : 2} />
                    <span style={{ fontSize: '0.65rem', fontWeight: '800' }}>Arama</span>
                </button>

                <div style={{ width: '1px', height: '32px', background: 'rgba(255,255,255,0.1)' }}></div>

                <div
                    style={{
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px'
                    }}
                >
                    <button
                        style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '20px',
                            background: pColor,
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: '-40px',
                            boxShadow: `0 8px 16px ${pColor}40`,
                            cursor: 'pointer'
                        }}
                    >
                        <ShoppingCart size={24} color="white" strokeWidth={2.5} />
                    </button>
                    <span style={{ fontSize: '0.65rem', fontWeight: '800', color: '#94a3b8', marginTop: '4px' }}>Sepetim</span>
                </div>
            </nav>
        </div>
    );
}
