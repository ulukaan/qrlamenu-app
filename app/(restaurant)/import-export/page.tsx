"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, FolderMinus, FolderPlus, Download, FileSpreadsheet, Upload, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

import { MobileMenuToggle, ProfileDropdown } from '@/components/HeaderActions';

export default function ImportExport() {
    // Basic file states for UI purposes
    const [catFile, setCatFile] = useState<File | null>(null);
    const [prodFile, setProdFile] = useState<File | null>(null);

    const handleCatSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Kategori yükleme işlemi yakında eklenecek.");
    };

    const handleProdSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Ürün yükleme işlemi yakında eklenecek.");
    };


    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col">
            {/* Standard Header Area */}
            <div className="bg-white border-b border-slate-200 py-5 px-6 lg:px-8 relative z-30 w-full">
                <div className="w-full mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-start md:items-center gap-4 md:gap-6">
                        <MobileMenuToggle />
                        <div className="space-y-4">
                            {/* Breadcrumbs */}
                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                <Link href="/dashboard" className="hover:text-slate-900 transition-colors">PANEL</Link>
                                <ChevronRight size={8} className="text-slate-300" />
                                <span className="text-slate-900">VERİ YÖNETİMİ</span>
                            </div>

                            <div className="flex items-center gap-4">
                                <h1 className="text-2xl font-bold text-slate-900 tracking-tight leading-none uppercase">İçe / Dışa Aktar</h1>
                                <div className="h-0.5 w-0.5 bg-slate-200 rounded-full" />
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 py-0.5 bg-slate-50 border border-slate-200 rounded-[4px]">Excel Otomasyonu</span>
                            </div>
                        </div>
                    </div>
                    <ProfileDropdown />
                </div>
            </div>

            <div className="p-6 lg:p-8 flex-1 w-full mx-auto space-y-10 flex flex-col">
                {/* Notice Boxes */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-slate-900 text-white p-6 flex items-start gap-4 rounded-[6px] shadow-lg shadow-slate-900/10"
                    >
                        <div className="bg-slate-800 p-3 rounded-[6px]">
                            <AlertCircle size={20} className="text-orange-500" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-400">Toplu Veri Yükleme</p>
                            <p className="text-[13px] font-medium text-slate-100 leading-relaxed">
                                Kategori ve ürünlerinizi excel formatında hazırlayarak saniyeler içinde toplu olarak yükleyebilirsiniz.
                            </p>
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white border border-slate-200 p-6 flex items-start gap-4 shadow-sm rounded-[6px]"
                    >
                        <div className="bg-slate-50 p-3 rounded-[6px] border border-slate-100 text-slate-900">
                            <FileSpreadsheet size={20} strokeWidth={2.5} />
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase">Fiyat Güncelleme</p>
                            <p className="text-[13px] font-medium text-slate-600 leading-relaxed">
                                Mevcut ürünlerinizi dışarı aktarıp, excel üzerinde fiyatları güncelledikten sonra tekrar yükleyerek toplu işlem yapabilirsiniz.
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* Primary Actions Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Kategori Yükle */}
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[6px] shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div className="flex items-center gap-3">
                                <div className="bg-slate-900 text-white p-2 rounded-[4px]">
                                    <FolderPlus size={15} strokeWidth={2.5} />
                                </div>
                                <h3 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">KATEGORİ İÇE AKTAR</h3>
                            </div>
                            <div className="text-[9px] font-bold text-slate-300 tracking-widest">IMPORT</div>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="space-y-3">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Excel Dosyası Seçiniz</label>
                                <form onSubmit={handleCatSubmit} className="flex flex-col gap-4">
                                    <div className="relative group/upload overflow-hidden bg-slate-50 border border-dashed border-slate-200 rounded-[6px] p-8 text-center cursor-pointer hover:bg-slate-100/50 transition-all duration-300 shadow-inner">
                                        <input type="file" accept=".xls,.xlsx" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={e => setCatFile(e.target.files?.[0] || null)} />
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="bg-white p-4 rounded-full shadow-sm border border-slate-100 group-hover/upload:scale-110 transition-transform">
                                                <Upload size={24} className="text-slate-400" />
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-[11px] font-bold text-slate-900 block truncate max-w-xs uppercase tracking-tight">{catFile ? catFile.name : 'Dosya Seçilmedi'}</span>
                                                <span className="text-[9px] font-medium text-slate-400 block uppercase">.xlsx veya .csv formatında</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-[6px] text-[11px] font-bold tracking-widest uppercase hover:bg-slate-800 transition-all shadow-md shadow-slate-900/10 active:scale-[0.98]">YÜKLEMEYE BAŞLAT</button>
                                </form>
                            </div>
                            <a href="/api/restaurant/export/categories" className="inline-flex items-center gap-2 text-[10px] font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-tight group/link">
                                <div className="bg-slate-50 p-1.5 rounded-[4px] group-hover/link:bg-slate-100 transition-colors">
                                    <Download size={14} />
                                </div>
                                Örnek Kategori Şablonunu İndir
                            </a>
                        </div>
                    </motion.div>

                    {/* Ürün Yükle */}
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-[6px] shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div className="flex items-center gap-3">
                                <div className="bg-slate-900 text-white p-2 rounded-[4px]">
                                    <FolderPlus size={15} strokeWidth={2.5} />
                                </div>
                                <h3 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">ÜRÜN İÇE AKTAR</h3>
                            </div>
                            <div className="text-[9px] font-bold text-slate-300 tracking-widest">IMPORT</div>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="space-y-3">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Excel Dosyası Seçiniz</label>
                                <form onSubmit={handleProdSubmit} className="flex flex-col gap-4">
                                    <div className="relative group/upload overflow-hidden bg-slate-50 border border-dashed border-slate-200 rounded-[6px] p-8 text-center cursor-pointer hover:bg-slate-100/50 transition-all duration-300 shadow-inner">
                                        <input type="file" accept=".xls,.xlsx" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={e => setProdFile(e.target.files?.[0] || null)} />
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="bg-white p-4 rounded-full shadow-sm border border-slate-100 group-hover/upload:scale-110 transition-transform">
                                                <Upload size={24} className="text-slate-400" />
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-[11px] font-bold text-slate-900 block truncate max-w-xs uppercase tracking-tight">{prodFile ? prodFile.name : 'Dosya Seçilmedi'}</span>
                                                <span className="text-[9px] font-medium text-slate-400 block uppercase">.xlsx veya .csv formatında</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-[6px] text-[11px] font-bold tracking-widest uppercase hover:bg-slate-800 transition-all shadow-md shadow-slate-900/10 active:scale-[0.98]">YÜKLEMEYE BAŞLAT</button>
                                </form>
                            </div>
                            <a href="/api/restaurant/export/products" className="inline-flex items-center gap-2 text-[10px] font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-tight group/link">
                                <div className="bg-slate-50 p-1.5 rounded-[4px] group-hover/link:bg-slate-100 transition-colors">
                                    <Download size={14} />
                                </div>
                                Örnek Ürün Şablonunu İndir
                            </a>
                        </div>
                    </motion.div>

                    {/* Kategorileri Dışarı Aktar */}
                    <div className="bg-white rounded-[6px] shadow-sm border border-slate-200 p-6 flex items-center justify-between group transition-all hover:border-slate-400 hover:shadow-md">
                        <div className="flex items-center gap-4">
                            <div className="bg-slate-50 text-slate-900 p-4 rounded-[6px] border border-slate-100 group-hover:bg-slate-900 group-hover:text-white transition-all shadow-sm">
                                <FolderMinus size={22} strokeWidth={2.5} />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-[12px] font-bold text-slate-900 uppercase tracking-tight">Kategori Listesi</h3>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">TÜM KATEGORİLERİ EXCEL OLARAK İNDİR</p>
                            </div>
                        </div>
                        <a href="/api/restaurant/export/categories" className="px-6 py-3 bg-slate-100 text-slate-900 rounded-[4px] text-[10px] font-bold tracking-widest uppercase hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                            DIŞA AKTAR
                        </a>
                    </div>

                    {/* Ürünleri Dışarı Aktar */}
                    <div className="bg-white rounded-[6px] shadow-sm border border-slate-200 p-6 flex items-center justify-between group transition-all hover:border-slate-400 hover:shadow-md">
                        <div className="flex items-center gap-4">
                            <div className="bg-slate-50 text-slate-900 p-4 rounded-[6px] border border-slate-100 group-hover:bg-slate-900 group-hover:text-white transition-all shadow-sm">
                                <FileSpreadsheet size={22} strokeWidth={2.5} />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-[12px] font-bold text-slate-900 uppercase tracking-tight">Ürün Kataloğu</h3>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">TÜM ÜRÜN VERİLERİNİ EXCEL OLARAK İNDİR</p>
                            </div>
                        </div>
                        <a href="/api/restaurant/export/products" className="px-6 py-3 bg-slate-100 text-slate-900 rounded-[4px] text-[10px] font-bold tracking-widest uppercase hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                            DIŞA AKTAR
                        </a>
                    </div>
                </div>
            </div>

            {/* Footer Section */}
            <div className="w-full mx-auto mt-auto py-12 text-center space-y-6">
                <div className="flex items-center justify-center gap-4">
                    <div className="h-px w-10 bg-slate-200" />
                    <p className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.3em]">© {new Date().getFullYear()} QRlamenü — ENDÜSTRİYEL MENÜ YÖNETİM SİSTEMİ</p>
                    <div className="h-px w-10 bg-slate-200" />
                </div>
            </div>
        </div >
    );
}
