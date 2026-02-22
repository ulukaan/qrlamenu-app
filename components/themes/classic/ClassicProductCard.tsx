"use client";

import React from 'react';
import { Plus } from 'lucide-react';
import { ThemeConfig } from '@/types/theme';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';

interface ClassicProductCardProps {
    product: any;
    theme: ThemeConfig;
    onAdd?: () => void;
    onClick?: () => void;
}

const ClassicProductCard: React.FC<ClassicProductCardProps> = ({ product, theme, onAdd, onClick }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            whileHover={{ y: -4 }}
            onClick={onClick}
            className="group bg-white rounded-lg overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-300 cursor-pointer"
        >
            <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                {product.image || product.imageUrl ? (
                    <img
                        src={product.image || product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300">
                        <span className="text-2xl">🍽️</span>
                    </div>
                )}
                {product.isPopular && (
                    <span className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 text-[10px] font-serif uppercase tracking-widest text-gray-900 border border-gray-200">
                        Popular
                    </span>
                )}
            </div>

            <div className="p-4">
                <div className="flex justify-between items-baseline mb-2">
                    <h3 className="font-serif text-lg text-gray-900 leading-tight group-hover:text-gray-600 transition-colors">
                        {product.name}
                    </h3>
                    <span className="font-serif italic text-lg ml-2" style={{ color: theme.colors.primary }}>
                        ₺{product.price}
                    </span>
                </div>

                <p className="text-xs text-gray-500 line-clamp-2 mb-4 font-light leading-relaxed">
                    {product.description}
                </p>

                <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-gray-200 hover:border-gray-900 hover:bg-gray-900 hover:text-white transition-all font-serif"
                    onClick={() => onAdd?.()}
                >
                    <Plus size={14} className="mr-2" />
                    Add onto Plate
                </Button>
            </div>
        </motion.div>
    );
};

export default ClassicProductCard;
