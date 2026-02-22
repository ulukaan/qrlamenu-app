"use client";

import React, { useState } from 'react';
import { ThemeConfig } from '@/types/theme';
import ModernHero from './ModernHero';
import ModernCategoryList from './ModernCategoryList';
import ModernProductCard from './ModernProductCard';
import { Search, ArrowUp } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';

interface ModernLayoutProps {
    restaurant: any;
    theme: ThemeConfig;
    tableId?: string | null;
    campaigns?: any[];
    onProductClick?: (product: any) => void;
    settings?: any;
}

const ModernLayout: React.FC<ModernLayoutProps> = ({ restaurant, theme, tableId, campaigns = [], onProductClick, settings: passedSettings }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState(restaurant.categories?.[0]?.id || '');
    const [showScroll, setShowScroll] = useState(false);
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

    const settings = passedSettings || restaurant.settings || {};
    const pColor = settings.pColor || theme.colors.primary;

    React.useEffect(() => {
        const handleScroll = () => setShowScroll(window.scrollY > 400);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const filteredCategories = restaurant.categories?.map((cat: any) => ({
        ...cat,
        products: (cat.products || cat.items || []).filter((p: any) =>
            !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter((cat: any) => cat.products.length > 0) || [];

    return (
        <div style={{ background: theme.colors.background, minHeight: '100vh', color: theme.colors.text, fontFamily: theme.fonts.body, paddingBottom: '96px' }}>
            {/* Progress Bar */}
            <motion.div style={{ scaleX, background: pColor, position: 'fixed', top: 0, left: 0, right: 0, height: '3px', transformOrigin: '0%', zIndex: 100 }} />

            {/* Hero */}
            <ModernHero restaurant={restaurant} theme={theme}
                searchQuery={searchQuery} onSearchChange={e => setSearchQuery(e.target.value)}
                pColor={pColor} />

            {/* Sticky Search + Categories */}
            <div style={{ position: 'sticky', top: 0, zIndex: 30, background: theme.colors.background, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '12px 20px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ position: 'relative', flex: 1, maxWidth: '320px' }}>
                        <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                        <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Ürün ara..."
                            style={{ width: '100%', paddingLeft: '32px', paddingRight: '12px', paddingTop: '8px', paddingBottom: '8px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.08)', color: 'white', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                </div>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '6px', padding: '0 20px 10px', overflowX: 'auto', scrollbarWidth: 'none' }}>
                    {restaurant.categories?.map((cat: any) => (
                        <button key={cat.id} onClick={() => { setActiveCategory(cat.id); document.getElementById(`modern-cat-${cat.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
                            style={{
                                padding: '7px 16px', borderRadius: '20px', border: '1px solid', cursor: 'pointer', whiteSpace: 'nowrap', fontWeight: '600', fontSize: '0.8rem', transition: 'all 0.2s',
                                borderColor: activeCategory === cat.id ? pColor : 'rgba(255,255,255,0.15)',
                                background: activeCategory === cat.id ? pColor : 'transparent',
                                color: activeCategory === cat.id ? 'white' : 'rgba(255,255,255,0.5)'
                            }}>
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Products */}
            <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 20px' }}>
                {filteredCategories.map((cat: any) => (
                    <section key={cat.id} id={`modern-cat-${cat.id}`} style={{ scrollMarginTop: '120px', marginBottom: '48px' }}>
                        <h2 style={{ fontFamily: theme.fonts.heading, fontSize: '1.5rem', fontWeight: '800', marginBottom: '20px', color: theme.colors.text, letterSpacing: '-0.02em' }}>
                            {cat.name}
                            <span style={{ fontSize: '0.75rem', marginLeft: '8px', color: 'rgba(255,255,255,0.4)', fontWeight: '400' }}>{cat.products.length} ürün</span>
                        </h2>
                        {/* 1 col mobile, 2 col tablet, 3 col desktop */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))', gap: '16px' }}>
                            {cat.products.map((item: any) => (
                                <ModernProductCard key={item.id} product={item} theme={theme} pColor={pColor}
                                    onClick={() => onProductClick?.(item)} />
                            ))}
                        </div>
                    </section>
                ))}
                {filteredCategories.length === 0 && searchQuery && (
                    <div style={{ textAlign: 'center', padding: '80px 20px', color: 'rgba(255,255,255,0.5)' }}>
                        <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>"{searchQuery}" için sonuç bulunamadı</p>
                        <button onClick={() => setSearchQuery('')} style={{ marginTop: '12px', color: pColor, background: 'none', border: 'none', cursor: 'pointer', fontWeight: '700' }}>Aramayı Temizle</button>
                    </div>
                )}
            </main>

            {/* Scroll to top */}
            <AnimatePresence>
                {showScroll && (
                    <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        style={{ position: 'fixed', bottom: '100px', right: '16px', zIndex: 90, width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }}>
                        <ArrowUp size={18} />
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ModernLayout;
