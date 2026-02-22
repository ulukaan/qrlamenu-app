"use client";

import React, { useRef } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { ThemeConfig } from '@/types/theme';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ModernHeroProps {
    restaurant: any;
    theme: ThemeConfig;
    searchQuery: string;
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    pColor?: string; // Added
}

const ModernHero: React.FC<ModernHeroProps> = ({ restaurant, theme, searchQuery, onSearchChange, pColor }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <div ref={ref} className="relative w-full h-[55vh] min-h-[300px] md:min-h-[400px] bg-gray-900 overflow-hidden">
            {/* Parallax Background Image */}
            <motion.div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: `url(${restaurant.coverUrl || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop'})`,
                    y
                }}
            />

            {/* Gradient Overlay & Texture */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-gray-900" />
            <div className="absolute inset-0 bg-black/5 opacity-10" />

            {/* Content & Search */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 pb-12 max-w-5xl mx-auto z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="mb-8"
                >
                    <motion.span
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-3 py-1 backdrop-blur-md border text-xs font-bold rounded-full mb-3 uppercase tracking-widest"
                        style={{
                            backgroundColor: `${pColor || '#f97316'}33`,
                            borderColor: `${pColor || '#f97316'}4d`,
                            color: pColor || '#fdba74'
                        }}
                    >
                        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: pColor || '#fb923c' }} />
                        Premium Dining
                    </motion.span>
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-4 drop-shadow-lg leading-[0.9] tracking-tight">
                        {restaurant.name}
                    </h1>
                    <p className="text-gray-200 text-base md:text-xl max-w-xl font-light leading-relaxed text-opacity-90">
                        {restaurant.description || 'Lezzetin ve kalitenin buluşma noktası.'}
                    </p>
                </motion.div>

                {/* Modern Floating Search Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="relative group max-w-lg"
                >
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400 group-focus-within:transition-colors" style={{ color: pColor }} />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-1 transition-all shadow-2xl text-base"
                        style={{ borderColor: `${pColor}20` }}
                        placeholder="Menüde lezzet arayın..."
                        value={searchQuery}
                        onChange={onSearchChange}
                    />
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    style={{ opacity }}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 animate-bounce"
                >
                    <ChevronDown size={24} />
                </motion.div>
            </div>
        </div>
    );
};

export default ModernHero;
