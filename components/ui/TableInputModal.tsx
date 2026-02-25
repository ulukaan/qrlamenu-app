"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hash, X } from 'lucide-react';

interface TableInputModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (tableId: string) => void;
    title?: string;
    description?: string;
}

export default function TableInputModal({
    isOpen,
    onClose,
    onSubmit,
    title = "Masa Numaranız",
    description = "Size hizmet verebilmemiz için lütfen masa numaranızı giriniz."
}: TableInputModalProps) {
    const [tableId, setTableId] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (tableId.trim()) {
            onSubmit(tableId);
            setTableId('');
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-4 right-4 top-1/2 -translate-y-1/2 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-sm bg-white rounded-2xl p-6 z-[70] shadow-xl"
                    >
                        <button
                            onClick={onClose}
                            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                        >
                            <X size={20} />
                        </button>

                        <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-4">
                                <Hash size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
                            <p className="text-sm text-gray-500 mb-6">{description}</p>

                            <form onSubmit={handleSubmit} className="w-full">
                                <input
                                    type="number"
                                    value={tableId}
                                    onChange={(e) => setTableId(e.target.value)}
                                    placeholder="Örn: 5"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-lg font-bold text-center focus:outline-none focus:ring-2 focus:ring-orange-600 mb-4"
                                    autoFocus
                                />
                                <button
                                    type="submit"
                                    disabled={!tableId.trim()}
                                    className="w-full bg-orange-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-700 transition-colors"
                                >
                                    Devam Et
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
