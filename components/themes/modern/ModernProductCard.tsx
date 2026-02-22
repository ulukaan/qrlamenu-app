"use client";

import React from 'react';
import { Plus, Heart, Info } from 'lucide-react';
import { ThemeConfig } from '@/types/theme';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface ModernProductCardProps {
    product: any;
    theme: ThemeConfig;
    onAdd?: () => void;
    onClick?: () => void;
    pColor?: string;
}

const ModernProductCard: React.FC<ModernProductCardProps> = ({ product, theme, onAdd, onClick, pColor }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            onClick={onClick}
            className="group relative bg-white rounded-[24px] shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100 flex flex-col h-full cursor-pointer"
        >
            {/* Image Area */}
            <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                {product.imageUrl ? (
                    <motion.img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300">
                        <span className="text-4xl">🍽️</span>
                    </div>
                )}

                {/* Overlay & Actions */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                    <Button size="icon" variant="glass" className="rounded-full">
                        <Info size={18} />
                    </Button>
                </div>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {product.isPopular && (
                        <Badge variant="premium" className="shadow-lg">POPÜLER</Badge>
                    )}
                    {product.name.includes("Acı") && (
                        <Badge variant="destructive" className="bg-red-500 text-white border-0">HOT</Badge>
                    )}
                </div>

                {/* Favorite Button */}
                <button className="absolute top-4 right-4 p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 transition-colors">
                    <Heart size={16} />
                </button>
            </div>

            {/* Content Area */}
            <div className="p-5 flex flex-col flex-1">
                <div className="flex justify-between items-start gap-2 mb-2">
                    <h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-orange-600 transition-colors">
                        {product.name}
                    </h3>
                    <span className="text-lg font-bold text-orange-600 whitespace-nowrap bg-orange-50 px-2.5 py-1 rounded-lg">
                        ₺{product.price}
                    </span>
                </div>

                <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1 leading-relaxed">
                    {product.description}
                </p>

                {/* Add to Cart Button */}
                <div className="mt-auto">
                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            onAdd?.();
                        }}
                        className="w-full rounded-xl font-bold bg-gray-900 hover:bg-black text-white group-hover:shadow-lg transition-all"
                    >
                        <Plus size={16} className="mr-2" />
                        Sepete Ekle
                    </Button>
                </div>
            </div>
        </motion.div>
    );
};

export default ModernProductCard;
