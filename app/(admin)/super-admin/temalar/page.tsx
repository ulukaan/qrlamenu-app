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
        <div className="p-4 md:p-8 lg:p-12 w-full max-w-full">
            {/* Header Area */}
            <div className="mb-8 md:mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                    <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Tema & Tasarım Kütüphanesi</h2>
                    <p className="text-gray-500 mt-1 text-sm md:text-base font-medium max-w-2xl">Platformun görsel kimliğini belirleyen mizanpaj seçeneklerini ve premium stilleri yönetin.</p>
                </div>
                <button
                    onClick={() => router.push('/super-admin/temalar/yeni')}
                    className="w-full sm:w-auto bg-[#ea580c] text-white px-8 py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                    <Plus size={22} strokeWidth={3} /> Yeni Tasarım Oluştur
                </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-8 items-start">
                <div className="flex flex-col gap-8">
                    {loading ? (
                        <div className="bg-white rounded-[32px] p-24 text-center shadow-sm border border-slate-100">
                            <Loader2 className="animate-spin text-[#ea580c] mx-auto" size={48} />
                            <p className="mt-6 text-sm font-black text-slate-400 uppercase tracking-widest">Sistem Senkronize Ediliyor...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
                            {themes.map((theme) => (
                                <div key={theme.id} className="bg-white rounded-[40px] overflow-hidden relative shadow-sm border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/60 hover:-translate-y-2 transition-all duration-500 group">
                                    <div className="h-[280px] bg-slate-50 relative overflow-hidden">
                                        {theme.previewUrl ? (
                                            <img src={theme.previewUrl} alt={theme.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 relative">
                                                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ea580c 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                                                <ImageIcon size={64} strokeWidth={1.2} className="relative z-10" />
                                            </div>
                                        )}

                                        {/* Status Badges Overlay */}
                                        <div className="absolute top-6 left-6 flex flex-wrap gap-2 z-10">
                                            {theme.isPremium && (
                                                <div className="bg-[#ea580c] text-white text-[9px] font-black px-4 py-2 rounded-xl shadow-lg shadow-orange-500/20 tracking-[0.2em] uppercase flex items-center gap-1.5 border border-white/20 backdrop-blur-sm">
                                                    <Zap size={10} fill="currentColor" /> PREMIUM
                                                </div>
                                            )}
                                        </div>

                                        <div className="absolute top-6 right-6 z-10">
                                            <div className={`text-white text-[9px] font-black px-4 py-2 rounded-xl backdrop-blur-md border border-white/20 tracking-[0.2em] shadow-lg uppercase ${theme.isActive ? 'bg-emerald-500/80' : 'bg-rose-500/80'}`}>
                                                {theme.isActive ? 'AKTİF' : 'PASİF'}
                                            </div>
                                        </div>

                                        {/* Actions Overlay */}
                                        <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center gap-5 backdrop-blur-[3px]">
                                            <button
                                                onClick={() => router.push(`/super-admin/temalar/${theme.id}`)}
                                                className="w-16 h-16 rounded-[24px] bg-white text-slate-900 flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all group/btn"
                                                title="Tasarımı Düzenle"
                                            >
                                                <Edit size={28} className="group-hover/btn:text-[#ea580c] transition-colors" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(theme.id)}
                                                className="w-16 h-16 rounded-[24px] bg-rose-500 text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all"
                                                title="Temayı Kaldır"
                                            >
                                                <Trash2 size={28} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-10">
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="w-2 h-2 rounded-full bg-[#ea580c]"></div>
                                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">SİSTEM ANAHTARI: {theme.key.toUpperCase()}</span>
                                                </div>
                                                <h3 className="text-2xl font-black text-gray-900 tracking-tight group-hover:text-[#ea580c] transition-colors leading-none">{theme.name}</h3>
                                            </div>
                                            <div className="bg-slate-50 text-slate-400 text-[10px] font-black px-4 py-2 rounded-xl border border-slate-100 shadow-inner">
                                                SIRA #{theme.order}
                                            </div>
                                        </div>
                                        <p className="text-sm text-slate-400 leading-relaxed font-bold line-clamp-2 italic h-10">
                                            {theme.description || 'Bu tasarım varyasyonu için henüz bir açıklama girilmemiş.'}
                                        </p>
                                        <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                                            <div className="flex -space-x-2">
                                                {[1, 2, 3].map(i => (
                                                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 overflow-hidden">
                                                        <img src={`https://i.pravatar.cc/100?u=${theme.id}${i}`} className="opacity-40 grayscale" alt="user" />
                                                    </div>
                                                ))}
                                                <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-50 flex items-center justify-center text-[8px] font-black text-slate-300 tracking-widest">+12</div>
                                            </div>
                                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
                                                <Check size={14} className="text-emerald-500" /> FULLY RESPONSIVE
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {themes.length === 0 && (
                                <div className="col-span-full bg-white rounded-[40px] p-24 text-center border-2 border-dashed border-slate-200 flex flex-col items-center">
                                    <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-6">
                                        <ImageIcon size={48} className="text-slate-200" />
                                    </div>
                                    <h4 className="text-xl font-black text-gray-900 mb-2">Kütüphane Henüz Boş</h4>
                                    <p className="text-slate-500 font-medium max-w-sm text-sm">Sisteme kayıtlı mizanpaj bulunmuyor. Yeni bir tasarım ekleyerek kataloğu genişletin.</p>
                                    <button
                                        onClick={() => router.push('/super-admin/temalar/yeni')}
                                        className="mt-8 bg-[#ea580c] text-white px-8 py-3.5 rounded-2xl font-black text-sm shadow-xl shadow-orange-500/20 hover:scale-105 transition-all"
                                    >+ İlk Tasarımı Başlat</button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Sidebar Metrics */}
                <div className="flex flex-col gap-8 xl:sticky xl:top-8 h-fit">
                    <div className="bg-slate-900 rounded-[32px] p-10 text-white shadow-2xl shadow-slate-900/10 relative overflow-hidden group">
                        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-10 relative">Görsel Envanter Özeti</h3>

                        <div className="flex flex-col gap-10 relative">
                            <div className="flex justify-between items-end">
                                <div>
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1.5">Toplam Tema</span>
                                    <span className="text-4xl font-black tracking-tighter">{themes.length}</span>
                                </div>
                                <div className="bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-xl text-[10px] font-black tracking-widest">AKTİF PLATFORM</div>
                            </div>

                            <div className="h-px bg-white/5 w-full"></div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest block mb-1.5">Premium</span>
                                    <div className="text-2xl font-black text-violet-400">{themes.filter(t => t.isPremium).length} <span className="text-[10px] text-slate-500">ADET</span></div>
                                </div>
                                <div>
                                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest block mb-1.5">Standart</span>
                                    <div className="text-2xl font-black text-blue-400">{themes.filter(t => !t.isPremium).length} <span className="text-[10px] text-slate-500">ADET</span></div>
                                </div>
                            </div>

                            <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Kullanılabilir Tema</span>
                                    <span className="text-xl font-black text-emerald-400">%{Math.round((themes.filter(t => t.isActive).length / (themes.length || 1)) * 100)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 border-l-4 border-l-[#ea580c]">
                        <div className="flex gap-4">
                            <div className="bg-orange-50 p-3 rounded-2xl shrink-0 text-[#ea580c]">
                                <Zap size={24} />
                            </div>
                            <div>
                                <h4 className="text-sm font-black text-gray-900 uppercase tracking-wide mb-2">Tasarım İlkesi</h4>
                                <p className="text-xs text-slate-500 leading-relaxed font-bold">
                                    Yeni mizanpajlar eklerken **Mobile-First** prensibine sadık kalın. Her temanın karanlık ve aydınlık mod uyumunu kontrol edin.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
