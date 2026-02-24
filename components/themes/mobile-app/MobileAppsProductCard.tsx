"use client";

import React from 'react';
import { Plus, ShoppingCart } from 'lucide-react';
import { ThemeConfig } from '@/types/theme';
import { motion } from 'framer-motion';

interface ProductCardProps {
    product: any;
    theme: ThemeConfig;
    onAdd?: () => void;
    onClick?: () => void;
}

export default function MobileAppsProductCard({ product, theme, onAdd, onClick }: ProductCardProps) {
    const pColor = theme.colors.primary;

    return (
        <motion.div
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            style={{
                background: 'white',
                borderRadius: '20px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                border: '1px solid #f1f5f9',
                position: 'relative',
                cursor: 'pointer'
            }}
        >
            <div style={{ position: 'relative', paddingTop: '75%', width: '100%' }}>
                <img
                    src={product.imageUrl || product.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60'}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                    alt={product.name}
                />
                {!product.isAvailable && (
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ background: '#ef4444', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: '800' }}>TÜKENDİ</span>
                    </div>
                )}
            </div>

            <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '800', color: '#111', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.3' }}>
                    {product.name}
                </h3>
                {product.description && (
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.4' }}>
                        {product.description}
                    </p>
                )}

                <div style={{ marginTop: 'auto', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '1rem', fontWeight: '900', color: pColor }}>
                        {product.price?.toFixed(2)}₺
                    </span>
                    {onAdd && product.isAvailable && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onAdd(); }}
                            style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '10px',
                                background: pColor,
                                color: 'white',
                                border: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                boxShadow: `0 4px 8px ${pColor}40`
                            }}
                        >
                            <Plus size={18} strokeWidth={3} />
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
