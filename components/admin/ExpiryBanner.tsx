"use client";

import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ExpiryBanner() {
    const [isVisible, setIsVisible] = useState(false);
    const [daysLeft, setDaysLeft] = useState<number | null>(null);
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        const fetchTrialStatus = async () => {
            try {
                const res = await fetch('/api/restaurant/settings');
                if (res.ok) {
                    const data = await res.json();

                    if (data.status === 'TRIAL' && data.trialExpiresAt) {
                        const expiry = new Date(data.trialExpiresAt);
                        const today = new Date();
                        const diffTime = expiry.getTime() - today.getTime();
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                        if (diffDays <= 14 && diffDays > 0) {
                            setDaysLeft(diffDays);
                            setIsVisible(true);
                        } else if (diffDays <= 0) {
                            setIsExpired(true);
                            setIsVisible(true);
                        }
                    } else if (data.status === 'EXPIRED') {
                        setIsExpired(true);
                        setIsVisible(true);
                    }
                }
            } catch (err) {
                console.error('Error fetching trial status:', err);
            }
        };
        fetchTrialStatus();
    }, []);

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className={`${isExpired ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'} border-b overflow-hidden`}
            >
                <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8 flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-md ${isExpired ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                            {isExpired ? <AlertTriangle size={16} /> : <Clock size={16} />}
                        </div>
                        <p className={`text-[11px] font-black uppercase tracking-tight ${isExpired ? 'text-red-800' : 'text-amber-800'}`}>
                            {isExpired
                                ? "DENEME SÜRENİZ DOLMUŞTUR! KULLANMAYA DEVAM ETMEK İÇİN ABONELİK PLANINIZI SEÇİN."
                                : <>DENEME SÜRESİNİN BİTMESİNE <span className="font-black underline underline-offset-2">{daysLeft} GÜN</span> KALDI. KESİNTİSİZ HİZMET İÇİN PLANINIZI YÜKSELTİN.</>}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => window.location.href = '/uyelik-plan-ayarlari'}
                            className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md text-[10px] font-black tracking-widest transition-all shadow-sm uppercase"
                        >
                            HEMEN YÜKSELT
                        </button>
                        <button
                            onClick={() => setIsVisible(false)}
                            className="text-amber-400 hover:text-amber-600 transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
