"use client";
import React from 'react';

const Logo = ({ size = 40, showText = true }) => {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <svg
                width={size}
                height={size}
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ filter: 'drop-shadow(0px 4px 8px rgba(255, 122, 33, 0.25))' }}
            >
                {/* 
                   QRlamenü Premium Logo
                   Concept: Minimalist Cloche + QR Integration
                */}

                {/* Background Shadow / Depth */}
                <circle cx="50" cy="55" r="40" fill="#0f172a" fillOpacity="0.05" />

                {/* The Cloche (Servis Kapağı) Base Structure */}
                <path
                    d="M15 70C15 70 20 40 50 40C80 40 85 70 85 70H15Z"
                    fill="url(#logo-grad-orange)"
                    stroke="#ea580c"
                    strokeWidth="1"
                />

                {/* Cloche Handle (Top Bit) */}
                <circle cx="50" cy="35" r="6" fill="#ea580c" />
                <path d="M50 35V40" stroke="#ea580c" strokeWidth="3" strokeLinecap="round" />

                {/* QR Matrix Core Integration (Inside the Cloche) */}
                <rect x="35" y="48" width="10" height="10" rx="2" fill="white" />
                <rect x="55" y="48" width="10" height="10" rx="2" fill="white" />
                <rect x="35" y="62" width="10" height="10" rx="2" fill="white" />

                {/* Tech Accents / Scanning Bits */}
                <rect x="55" y="62" width="4" height="4" rx="1" fill="#0f172a" />
                <rect x="61" y="62" width="4" height="4" rx="1" fill="white" />
                <rect x="55" y="68" width="10" height="4" rx="1" fill="white" />

                {/* Bottom Plate Line */}
                <path
                    d="M10 75H90"
                    stroke="#0f172a"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeOpacity="0.8"
                />

                {/* Gradient Definition */}
                <defs>
                    <linearGradient id="logo-grad-orange" x1="15" y1="40" x2="85" y2="70" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#ea580c" />
                        <stop offset="1" stopColor="#f59e0b" />
                    </linearGradient>
                </defs>
            </svg>

            {showText && (
                <span
                    style={{
                        fontSize: `${size * 0.65}px`,
                        fontWeight: '900',
                        color: '#0f172a',
                        letterSpacing: '-0.04em',
                        fontFamily: 'system-ui, -apple-system, sans-serif'
                    }}
                >
                    QRlamenü
                    <span style={{ color: '#ea580c' }}>.</span>
                </span>
            )}
        </div>
    );
};

export default Logo;
