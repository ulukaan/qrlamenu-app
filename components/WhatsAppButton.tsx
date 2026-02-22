"use client";
import React from 'react';
import { Phone } from 'lucide-react';

const WhatsAppButton = () => {
    return (
        <button className="whatsapp-btn">
            <div style={{
                background: '#fff',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Phone size={18} style={{ color: '#25d366' }} />
            </div>
            <span>Bilgi Alın</span>
        </button>
    );
};

export default WhatsAppButton;
