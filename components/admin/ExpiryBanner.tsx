"use client";

import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ExpiryBanner() {
    const [isVisible, setIsVisible] = useState(false);
    const [daysLeft, setDaysLeft] = useState<number | null>(null);

    useEffect(() => {
        const fetchTrialStatus = async () => {
            try {
                const res = await fetch('/api/restaurant/settings');
                if (res.ok) {
                    const data = await res.json();

                    // Note: In a real app, trialExpiresAt would be a date field.
                    // For this boilerplate, let's assume it's in the data.
                    if (data.trialExpiresAt) {
                        const expiry = new Date(data.trialExpiresAt);
                        const today = new Date();
                        const diffTime = expiry.getTime() - today.getTime();
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                        if (diffDays <= 7 && diffDays > 0) {
                            setDaysLeft(diffDays);
                            setIsVisible(true);
                        }
                    } else {
                        // Mock data for demonstration if no expiry is set
                        // setDaysLeft(3);
                        // setIsVisible(true);
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
                className="bg-amber-50 border-b border-amber-200 overflow-hidden"
            >
                <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8 flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                            <Clock size={18} />
                        </div>
                        <p className="text-sm font-medium text-amber-800">
                            Deneme sürenizin bitmesine <span className="font-bold">{daysLeft} gün</span> kaldı. Kesintisiz hizmet için planınızı yükseltin.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => window.location.href = '/uyelik-plan-ayarlari'}
                            className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-colors shadow-sm"
                        >
                            Hemen Yükselt
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
