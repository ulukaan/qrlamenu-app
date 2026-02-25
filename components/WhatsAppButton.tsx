"use client";
import React from 'react';
import { Phone } from 'lucide-react';

const WhatsAppButton = () => {
    return (
        <button className="whatsapp-btn flex items-center gap-2 bg-[#25d366] text-white px-4 py-2 rounded-md text-[10px] font-black tracking-widest shadow-lg hover:bg-[#128c7e] transition-all active:scale-95 uppercase">
            <div className="bg-white w-6 h-6 rounded-md flex items-center justify-center">
                <Phone size={14} className="text-[#25d366]" />
            </div>
            <span>BİLGİ ALIN</span>
        </button>
    );
};

export default WhatsAppButton;
