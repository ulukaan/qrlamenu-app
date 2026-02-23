"use client";
import { useState } from "react";
import { MessageCircle, X, Info, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function WhatsAppWidget() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="bg-white rounded-2xl shadow-[0_8px_25px_-5px_rgba(45,62,79,0.35)] border border-slate-100 w-[360px] mb-4 overflow-hidden relative"
                    >
                        {/* Kuyruk Efekti */}
                        <div className="absolute -bottom-1.5 right-6 w-4 h-4 bg-white rotate-45 border-r border-b border-slate-100 hidden"></div>

                        {/* Title Bar */}
                        <div className="bg-[#24d064] px-5 py-4 flex items-center gap-3 text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                <path d="M3 21l1.65 -3.8a9 9 0 1 1 3.4 2.9l-5.05 .9"></path>
                                <path d="M9 10a.5 .5 0 0 0 1 0v-1a.5 .5 0 0 0 -1 0v1a5 5 0 0 0 5 5h1a.5 .5 0 0 0 0 -1h-1a.5 .5 0 0 0 0 1"></path>
                            </svg>
                            <span className="font-semibold text-lg flex-1">WhatsApp Destek Merkezi</span>
                            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1.5 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Option List */}
                        <div className="flex flex-col bg-white">
                            <a
                                href="https://wa.me/+908503048854?text=QRlamenü hakkında bilgi almak istiyorum."
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between gap-4 p-4 hover:bg-slate-50/80 border-b border-slate-50 transition-all hover:pl-6 group"
                            >
                                <div className="flex items-center gap-4 flex-1">
                                    <div className="text-[#3597ff]">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                            <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"></path>
                                            <path d="M12 9h.01"></path>
                                            <path d="M11 12h1v4h1"></path>
                                        </svg>
                                    </div>
                                    <div className="flex flex-col flex-1">
                                        <span className="text-[13px] text-slate-600 leading-snug mb-0.5">
                                            QRlamenü sistemi hakkında <b>Bilgi</b> almak istiyorum.
                                        </span>
                                    </div>
                                </div>
                            </a>

                            <a
                                href="https://wa.me/+908503048854?text=QRlamenü'ye kaydoldum, yaşadığım sorunlar hakkında destek almak istiyorum."
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between gap-4 p-4 hover:bg-slate-50/80 transition-all hover:pl-6 group"
                            >
                                <div className="flex items-center gap-4 flex-1">
                                    <div className="text-[#ff9d35]">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                            <path d="M9.103 2h5.794a3 3 0 0 1 2.122 .879l4.101 4.1a3 3 0 0 1 .88 2.125v5.794a3 3 0 0 1 -.879 2.122l-4.1 4.101a3 3 0 0 1 -2.123 .88h-5.795a3 3 0 0 1 -2.122 -.88l-4.101 -4.1a3 3 0 0 1 -.88 -2.124v-5.794a3 3 0 0 1 .879 -2.122l4.1 -4.101a3 3 0 0 1 2.125 -.88z"></path>
                                            <path d="M12 16v.01"></path>
                                            <path d="M12 13a2 2 0 0 0 .914 -3.782a1.98 1.98 0 0 0 -2.414 .483"></path>
                                        </svg>
                                    </div>
                                    <div className="flex flex-col flex-1">
                                        <span className="text-[13px] text-slate-600 leading-snug mb-0.5">
                                            Kayıt oldum, yaşadığım sorunlar hakkında <b>Yardım</b> almak istiyorum.
                                        </span>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bubble Button Container */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="group relative flex items-center h-[55px] bg-white/70 backdrop-blur-md border border-slate-200 shadow-md rounded-full text-slate-700 hover:bg-[#25d366] hover:text-white hover:border-[#25d366] transition-all duration-500 ease-in-out cursor-pointer overflow-hidden z-20"
                style={{ width: "230px" }}
            >
                {/* Sol Text İçerik */}
                <div className="flex-1 flex flex-col justify-center text-left pl-5 pr-14 z-10 overflow-hidden relative h-full py-1.5">
                    <div className="relative w-full h-[22px] overflow-hidden">
                        <div className="absolute inset-0 flex flex-col transition-transform duration-500 group-hover:-translate-y-full">
                            <span className="font-extrabold text-[17px] leading-tight block h-[22px]">Destek</span>
                            <span className="font-extrabold text-[17px] leading-tight block h-[22px] text-white">Mesaj Gönder</span>
                        </div>
                    </div>
                    <span className="font-medium text-[11px] leading-tight group-hover:text-white/90 truncate">Whatsapp Destek Hattı</span>
                </div>

                {/* Sağ İkon Alanı */}
                <div className="absolute right-0 w-[55px] h-[55px] flex items-center justify-center rounded-full bg-white group-hover:bg-[#25d366] transition-colors duration-500 z-20">
                    {/* Ping Rings */}
                    <div className="absolute inset-0 rounded-full border-[5px] border-white z-0 group-hover:border-[#25d366] transition-colors duration-500"></div>
                    <div className="absolute inset-0 rounded-full bg-[#25d366] opacity-0 group-hover:opacity-80 group-hover:animate-ping transition-opacity duration-500" style={{ animationDuration: '2.5s' }}></div>
                    <div className="absolute inset-0 rounded-full bg-[#25d366] opacity-0 group-hover:opacity-80 group-hover:animate-ping transition-opacity duration-500" style={{ animationDelay: '1.2s', animationDuration: '2.5s' }}></div>

                    {/* SVG WhatsApp Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="relative z-30 text-[#25d366] group-hover:text-white transition-colors duration-500" width="28" height="28" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M3 21l1.65 -3.8a9 9 0 1 1 3.4 2.9l-5.05 .9"></path>
                        <path d="M9 10a.5 .5 0 0 0 1 0v-1a.5 .5 0 0 0 -1 0v1a5 5 0 0 0 5 5h1a.5 .5 0 0 0 0 -1h-1a.5 .5 0 0 0 0 1"></path>
                    </svg>
                </div>
            </button>
        </div>
    );
}
