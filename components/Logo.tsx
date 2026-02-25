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
                style={{ filter: 'drop-shadow(0px 8px 16px rgba(255, 110, 1, 0.15))' }}
            >
                {/* Background Glow */}
                <circle cx="50" cy="50" r="45" fill="url(#logo-glow)" fillOpacity="0.6" />

                {/* The Cloche (Servis Kapağı) - Sharper & More Premium */}
                <path
                    d="M15 72C15 72 20 38 50 38C80 38 85 72 85 72H15Z"
                    fill="url(#logo-grad-orange)"
                />

                {/* Cloche Highlight */}
                <path
                    d="M25 65C25 65 30 45 50 45C70 45 75 65 75 65"
                    stroke="white"
                    strokeWidth="0.5"
                    strokeOpacity="0.3"
                    fill="none"
                />

                {/* Cloche Handle */}
                <circle cx="50" cy="32" r="5" fill="#ff6e01" />
                <path d="M50 32V38" stroke="#ff6e01" strokeWidth="2.5" strokeLinecap="round" />

                {/* QR Matrix Core - Minimalist High Tech */}
                <rect x="38" y="52" width="7" height="7" rx="1.5" fill="white" />
                <rect x="55" y="52" width="7" height="7" rx="1.5" fill="white" />
                <rect x="38" y="64" width="7" height="7" rx="1.5" fill="white" />

                <rect x="55" y="64" width="3" height="3" rx="0.5" fill="#0f172a" />
                <rect x="59" y="64" width="3" height="3" rx="0.5" fill="white" />
                <rect x="55" y="68" width="7" height="3" rx="0.5" fill="white" />

                {/* Professional Base Plate */}
                <rect x="10" y="76" width="80" height="3" rx="1.5" fill="#0f172a" />

                <defs>
                    <linearGradient id="logo-grad-orange" x1="15" y1="38" x2="85" y2="72" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#ff6e01" />
                        <stop offset="1" stopColor="#ff8f3f" />
                    </linearGradient>
                    <radialGradient id="logo-glow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(50 50) rotate(90) scale(45)">
                        <stop stopColor="#ff6e01" stopOpacity="0.1" />
                        <stop offset="1" stopColor="#ff6e01" stopOpacity="0" />
                    </radialGradient>
                </defs>
            </svg>

            {showText && (
                <span
                    style={{
                        fontSize: `${size * 0.62}px`,
                        fontWeight: '850',
                        color: '#0f172a',
                        letterSpacing: '-0.035em',
                        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                        textTransform: 'none'
                    }}
                >
                    QRlamenü
                    <span style={{ color: '#ff6e01' }}>.</span>
                </span>
            )}
        </div>
    );
};

export default Logo;
