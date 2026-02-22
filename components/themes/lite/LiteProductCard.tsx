"use client";

import React from 'react';
import { Plus } from 'lucide-react';
import { ThemeConfig } from '@/types/theme';
import { motion } from 'framer-motion';

interface LiteProductCardProps {
    product: any;
    theme: ThemeConfig;
    onAdd?: () => void;
    onClick?: () => void;
}

const LiteProductCard: React.FC<LiteProductCardProps> = ({ product, theme, onAdd, onClick }) => {
    return (
        <motion.div
            whileTap={{ scale: 0.98 }}
            className="flex gap-4 p-4 bg-white border-b border-gray-50 last:border-0 active:bg-gray-50 transition-colors"
            onClick={onClick}
        >
            {/* Minimal Image or Placeholder */}
            <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                {product.image || product.imageUrl ? (
                    <img
                        src={product.image || product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl">🍽️</div>
                )}
            </div>

            {/* Content optimized for scanability */}
            <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                <div>
                    <h3 className="font-semibold text-gray-900 leading-tight truncate px-0">{product.name}</h3>
                    <p className="text-xs text-gray-500 line-clamp-2 mt-1">{product.description}</p>
                </div>

                <div className="flex items-center justify-between mt-2">
                    <span className="font-bold text-gray-900">₺{product.price}</span>
                    <button
                        className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center active:bg-orange-500 active:text-white transition-colors"
                        onClick={(e) => {
                            e.stopPropagation();
                            onAdd?.();
                        }}
                    >
                        <Plus size={16} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default LiteProductCard;
