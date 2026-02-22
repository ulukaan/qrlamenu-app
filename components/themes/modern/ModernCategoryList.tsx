"use client";

import React from 'react';
import { ThemeConfig } from '@/types/theme';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ModernCategoryListProps {
    categories: any[];
    activeCategory: string;
    onCategorySelect: (id: string) => void;
    theme: ThemeConfig;
}

const ModernCategoryList: React.FC<ModernCategoryListProps> = ({ categories, activeCategory, onCategorySelect, theme }) => {
    return (
        <div className="sticky top-0 z-30 bg-gray-900/95 backdrop-blur-xl border-b border-white/5 py-4 shadow-2xl">
            <div className="max-w-5xl mx-auto px-6 overflow-x-auto hide-scrollbar flex gap-3">
                {categories.map((category) => {
                    const isActive = activeCategory === category.id;
                    return (
                        <button
                            key={category.id}
                            onClick={() => onCategorySelect(category.id)}
                            className={cn(
                                "relative px-6 py-3 rounded-2xl text-sm font-bold transition-all whitespace-nowrap z-10",
                                isActive ? "text-white" : "text-gray-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeCategory"
                                    className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-500 rounded-2xl -z-10 shadow-lg shadow-orange-500/20"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            {category.name}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default ModernCategoryList;
