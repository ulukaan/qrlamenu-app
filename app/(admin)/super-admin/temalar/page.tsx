"use client";
import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Check, X, Image as ImageIcon, Zap, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Theme {
    id: string;
    key: string;
    name: string;
    description: string;
    previewUrl: string;
    isPremium: boolean;
    isActive: boolean;
    order: number;
}

export default function ThemesPage() {
    const [themes, setThemes] = useState<Theme[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchThemes();
    }, []);

    const fetchThemes = async () => {
        try {
            const res = await fetch('/api/admin/themes');
            const data = await res.json();
            if (Array.isArray(data)) {
                setThemes(data);
            } else {
                console.error('API returned non-array data:', data);
                setThemes([]);
            }
        } catch (error) {
            console.error('Failed to fetch themes', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bu temayı silmek istediğinize emin misiniz?')) return;

        try {
            const res = await fetch(`/api/admin/themes/${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchThemes();
            } else {
                alert('Silme işlemi başarısız oldu.');
            }
        } catch (error) {
            console.error('Failed to delete theme', error);
        }
    };

    return (
        <div className="p-4 md:p-6 lg:p-8 w-full max-w-full bg-slate-50 min-h-screen font-sans">
            {/* Header Area */}
            <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-[20px] font-semibold text-slate-900 tracking-tight uppercase leading-none">Tema & Tasarım Kütüphanesi</h2>
                    <p className="text-[13px] text-slate-500 mt-1.5 font-medium max-w-2xl">Platformun görsel kimliğini belirleyen mizanpaj seçeneklerini ve stilleri yönetin.</p>
                </div>
                <button
                    onClick={() => router.push('/super-admin/temalar/yeni')}
                    className="w-full sm:w-auto bg-slate-900 text-white h-9 px-4 rounded-[6px] text-[13px] font-semibold flex items-center justify-center gap-2 shadow-sm hover:bg-slate-800 transition-colors"
                >
                    <Plus size={16} /> Yeni Tasarım Oluştur
                </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-8 items-start">
                <div className="flex flex-col gap-8">
                    {loading ? (
                        <div className="bg-white rounded-[6px] p-16 text-center shadow-sm border border-slate-200">
                            <Loader2 className="animate-spin text-indigo-600 mx-auto" size={32} />
                            <p className="mt-4 text-[11px] font-semibold text-slate-500 uppercase tracking-widest">Sistem Senkronize Ediliyor...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-5">
                            {themes.map((theme) => (
                                <div key={theme.id} className="bg-white rounded-[6px] overflow-hidden relative shadow-sm border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-300 group flex flex-col">
                                    <div className="h-[200px] bg-slate-50 relative overflow-hidden border-b border-slate-100">
                                        {theme.previewUrl ? (
                                            <img src={theme.previewUrl} alt={theme.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50 relative">
                                                <ImageIcon size={48} strokeWidth={1.5} className="relative z-10" />
                                            </div>
                                        )}

                                        {/* Status Badges Overlay */}
                                        <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-10">
                                            {theme.isPremium && (
                                                <div className="bg-indigo-600 text-white text-[9px] font-bold px-2.5 py-1 rounded-[4px] shadow-sm tracking-wider uppercase flex items-center gap-1.5">
                                                    <Zap size={10} fill="currentColor" /> PREMIUM
                                                </div>
                                            )}
                                        </div>

                                        <div className="absolute top-3 right-3 z-10">
                                            <div className={`text-[9px] font-bold px-2.5 py-1 rounded-[4px] tracking-wider shadow-sm uppercase ${theme.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                                                {theme.isActive ? 'AKTİF' : 'PASİF'}
                                            </div>
                                        </div>

                                        {/* Actions Overlay */}
                                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-[1px]">
                                            <button
                                                onClick={() => router.push(`/super-admin/temalar/${theme.id}`)}
                                                className="w-10 h-10 rounded-[6px] bg-white text-slate-700 flex items-center justify-center shadow-sm hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                                                title="Tasarımı Düzenle"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(theme.id)}
                                                className="w-10 h-10 rounded-[6px] bg-white text-rose-600 flex items-center justify-center shadow-sm hover:bg-rose-50 transition-colors"
                                                title="Temayı Kaldır"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-5 flex-1 flex flex-col">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <div className="flex items-center gap-1.5 mb-1.5">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                                                    <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-widest">SİSTEM: {theme.key.toUpperCase()}</span>
                                                </div>
                                                <h3 className="text-[15px] font-semibold text-slate-900 tracking-tight leading-none group-hover:text-indigo-600 transition-colors">{theme.name}</h3>
                                            </div>
                                            <div className="text-slate-500 text-[9px] font-semibold px-2 py-1 rounded-[4px] border border-slate-200">
                                                SIRA #{theme.order}
                                            </div>
                                        </div>
                                        <p className="text-[12px] text-slate-500 leading-relaxed font-medium line-clamp-2 min-h-[36px]">
                                            {theme.description || 'Bu tasarım varyasyonu için henüz bir açıklama girilmemiş.'}
                                        </p>
                                        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                                            <div className="flex -space-x-1.5">
                                                {[1, 2, 3].map(i => (
                                                    <div key={i} className="w-6 h-6 rounded-full border border-white bg-slate-100 flex items-center justify-center overflow-hidden">
                                                        <img src={`https://i.pravatar.cc/100?u=${theme.id}${i}`} className="opacity-80 grayscale" alt="user" />
                                                    </div>
                                                ))}
                                                <div className="w-6 h-6 rounded-full border border-white bg-slate-50 flex items-center justify-center text-[7px] font-semibold text-slate-500 tracking-wider">+{themes.length * 2}</div>
                                            </div>
                                            <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                                <Check size={12} className="text-emerald-500" /> FULLY RESPONSIVE
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {themes.length === 0 && (
                                <div className="col-span-full bg-white rounded-[6px] p-16 text-center border border-dashed border-slate-300 flex flex-col items-center">
                                    <div className="w-16 h-16 bg-slate-50 rounded-[6px] flex items-center justify-center mb-5 border border-slate-200">
                                        <ImageIcon size={24} className="text-slate-400" />
                                    </div>
                                    <h4 className="text-[16px] font-semibold text-slate-900 mb-1.5">Kütüphane Henüz Boş</h4>
                                    <p className="text-slate-500 font-medium max-w-sm text-[13px]">Sisteme kayıtlı mizanpaj bulunmuyor. Yeni bir tasarım ekleyerek kataloğu genişletin.</p>
                                    <button
                                        onClick={() => router.push('/super-admin/temalar/yeni')}
                                        className="mt-6 bg-slate-900 text-white h-9 px-4 rounded-[6px] font-semibold text-[13px] shadow-sm hover:bg-slate-800 transition-colors"
                                    >İlk Tasarımı Başlat</button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Sidebar Metrics */}
                <div className="flex flex-col gap-6 xl:sticky xl:top-8 h-fit">
                    <div className="bg-slate-900 rounded-[6px] p-6 text-white shadow-sm border border-slate-800 flex flex-col gap-6 group">
                        <h3 className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Genel Özet</h3>

                        <div className="flex flex-col gap-5">
                            <div className="flex justify-between items-end pb-5 border-b border-slate-800">
                                <div>
                                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block mb-1">Toplam Tema</span>
                                    <span className="text-2xl font-semibold tracking-tight">{themes.length}</span>
                                </div>
                                <div className="bg-slate-800 text-emerald-400 px-2 py-1 rounded-[4px] text-[10px] font-bold border border-slate-700">AKTİF PLATFORM</div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block mb-1">Premium</span>
                                    <div className="text-lg font-semibold text-white">{themes.filter(t => t.isPremium).length} <span className="text-[9px] text-slate-500 font-medium ml-1">ADET</span></div>
                                </div>
                                <div>
                                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block mb-1">Standart</span>
                                    <div className="text-lg font-semibold text-white">{themes.filter(t => !t.isPremium).length} <span className="text-[9px] text-slate-500 font-medium ml-1">ADET</span></div>
                                </div>
                            </div>

                            <div className="bg-slate-800/50 p-4 rounded-[4px] border border-slate-800 mt-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Kullanılabilir Tema</span>
                                    <span className="text-[14px] font-semibold text-emerald-400">%{Math.round((themes.filter(t => t.isActive).length / (themes.length || 1)) * 100)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[6px] p-5 shadow-sm border border-slate-200 border-l-4 border-l-slate-900">
                        <div className="flex gap-3">
                            <div className="text-slate-900 shrink-0 mt-0.5">
                                <Zap size={16} fill="currentColor" />
                            </div>
                            <div>
                                <h4 className="text-[12px] font-semibold text-slate-900 uppercase tracking-wider mb-1">Tasarım İlkesi</h4>
                                <p className="text-[12px] text-slate-600 leading-relaxed font-medium">
                                    Yeni mizanpajlar eklerken mobil odaklı (Mobile-First) prensibine sadık kalın. Karanlık ve aydınlık mod uyumlarını sağlayın.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
