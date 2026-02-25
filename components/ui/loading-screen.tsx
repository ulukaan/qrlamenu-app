"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface LoadingScreenProps {
    message?: string;
    fullScreen?: boolean;
    className?: string;
}

export const LoadingScreen = ({
    message = "VERİLER İŞLENİYOR",
    fullScreen = true,
    className = ""
}: LoadingScreenProps) => {
    return (
        <div
            className={`
                flex flex-col items-center justify-center gap-6 
                ${fullScreen ? 'fixed inset-0 z-[9999] bg-white' : 'min-h-[400px] w-full bg-slate-50/50 rounded-[6px]'} 
                ${className}
            `}
        >
            <div className="relative flex items-center justify-center">
                {/* Premium Pulse Effect */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.3, 0.1]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute w-24 h-24 bg-[#ff7a21] rounded-full blur-2xl"
                />

                {/* Modern Spinner / Logo Container */}
                <div className="relative w-12 h-12 flex items-center justify-center">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-10 h-10 border-[3px] border-slate-100 border-t-[#ff7a21] rounded-full shadow-sm"
                    />
                    <div className="absolute w-1.5 h-1.5 bg-[#ff7a21] rounded-full animate-ping" />
                </div>
            </div>

            {/* Typography Discipline: 11px, Bold, Uppercase, Tracking-widest */}
            <div className="flex flex-col items-center gap-1.5">
                <span className="text-[11px] font-bold text-slate-900 uppercase tracking-[0.25em] leading-none">
                    {message}
                </span>
                <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                            className="w-1 h-1 bg-[#ff7a21] rounded-full"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
