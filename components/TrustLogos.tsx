"use client";
import React from 'react';

export default function TrustLogos() {
    return (
        <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-40 flex items-end opacity-40 hover:opacity-100 transition-all duration-500 pointer-events-auto group">

            {/* Yerli Üretim */}
            <div className="hover:-translate-y-1 transition-transform duration-300 cursor-pointer w-[100px] h-[45px]">
                <img
                    src="/yerli-uretim-gray.png"
                    alt="Yerli Üretim"
                    className="w-full h-full object-contain"
                />
            </div>

        </div>
    );
}
