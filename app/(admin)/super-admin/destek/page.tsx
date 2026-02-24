"use client";
import React, { useState, useEffect } from 'react';
import { Mail, MessageSquare, Search, Phone, User, Clock, Filter, Loader2, CheckCircle, XCircle, Globe, Smartphone } from 'lucide-react';

export default function SupportPage() {
    const [leads, setLeads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLeads = async () => {
            try {
                setLoading(true);
                const res = await fetch('/api/admin/crm');
                if (!res.ok) throw new Error('Mesajlar yüklenemedi');
                const data = await res.json();
                setLeads(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchLeads();
    }, []);

    const updateLeadStatus = async (id: string, newStatus: string) => {
        try {
            const res = await fetch('/api/admin/crm', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: newStatus })
            });

            if (res.ok) {
                // Refresh list
                const refreshed = await fetch('/api/admin/crm').then(r => r.json());
                setLeads(refreshed);
            }
        } catch (err) {
            console.error('Update status error:', err);
        }
    };

    return (
        <div className="p-4 md:p-8 lg:p-12 w-full max-w-full">
            {/* Page Header Area */}
            <div className="mb-8 md:mb-12 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
                <div className="max-w-3xl">
                    <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Destek & Talepler</h2>
                    <p className="text-gray-500 mt-1 text-sm md:text-base font-medium">Kullanıcı geri bildirimlerini, teknik biletleri ve kurumsal talepleri tek merkezden yönetin.</p>
                </div>
                <div className="w-full lg:w-auto">
                    <div className="relative group">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#ff7a21] transition-colors" />
                        <input
                            type="text"
                            placeholder="Ad, e-posta veya mesaj..."
                            className="w-full lg:w-[320px] pl-12 pr-6 py-3.5 rounded-2xl border-2 border-slate-50 bg-white text-sm font-black text-gray-900 focus:border-[#ff7a21] outline-none transition-all shadow-sm"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-8 items-start">
                <div className="space-y-6">
                    {/* Premium Categories Filter Bar */}
                    <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                        {['Tüm Talepler', 'Teknik Destek', 'Satış/Kurumsal', 'Geri Bildirim'].map((cat, i) => (
                            <button
                                key={i}
                                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${i === 0 ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/20' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300 hover:text-slate-600'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
                        {loading ? (
                            <div className="py-32 text-center">
                                <Loader2 className="animate-spin text-[#ff7a21] mx-auto" size={48} />
                                <p className="mt-6 text-xs font-black text-slate-400 uppercase tracking-widest">Veriler Senkronize Ediliyor...</p>
                            </div>
                        ) : error ? (
                            <div className="p-8 text-center font-black text-rose-500 bg-rose-50 rounded-3xl">{error}</div>
                        ) : leads.length === 0 ? (
                            <div className="py-32 text-center flex flex-col items-center justify-center">
                                <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-6 text-slate-200">
                                    <MessageSquare size={40} />
                                </div>
                                <h4 className="text-lg font-black text-gray-900 mb-2">İletişim Kutusu Boş</h4>
                                <p className="text-sm font-bold text-slate-400 max-w-[280px] leading-relaxed italic">Şu an için herhangi bir aktif destek talebi bulunmuyor.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-50">
                                {leads.map((msg, idx) => (
                                    <div key={msg.id} className={`group p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 items-start transition-all relative ${msg.status === 'PENDING' ? 'bg-white' : 'bg-slate-50/30'}`}>
                                        {msg.status === 'PENDING' && (
                                            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#ff7a21] rounded-r-full"></div>
                                        )}

                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg transition-all duration-500 overflow-hidden relative ${msg.status === 'PENDING' ? 'bg-[#ff7a21] text-white shadow-orange-500/20' : 'bg-slate-100 text-slate-400 shadow-none'}`}>
                                            <MessageSquare size={24} strokeWidth={2.5} className="relative z-10" />
                                            {msg.status === 'PENDING' && <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-600 opacity-50"></div>}
                                        </div>

                                        <div className="flex-1 w-full">
                                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                                                <div>
                                                    <h4 className="text-lg font-black text-gray-900 tracking-tight">{msg.name}</h4>
                                                    <div className="flex flex-wrap gap-4 mt-2">
                                                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                                            <Mail size={12} className="text-[#ff7a21]" /> {msg.email}
                                                        </div>
                                                        {msg.phone && (
                                                            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                                                <Phone size={12} className="text-emerald-500" /> {msg.phone}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
                                                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                                                        <Clock size={12} /> {new Date(msg.createdAt).toLocaleString('tr-TR')}
                                                    </div>
                                                    <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-[0.15em] border ${msg.status === 'PENDING' ? 'bg-emerald-50 text-emerald-500 border-emerald-100' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
                                                        {msg.status === 'PENDING' ? 'YENİ TALEP' : (msg.status === 'LOST' ? 'ARŞİVLENDİ' : 'ÇÖZÜLDÜ')}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="bg-slate-50/50 p-6 rounded-[24px] border border-slate-100 mb-6 group-hover:bg-white transition-colors">
                                                <p className="text-sm text-slate-600 font-medium leading-relaxed italic">
                                                    {msg.notes || 'Herhangi bir bilet açıklama metni tanımlanmamıştır.'}
                                                </p>
                                            </div>

                                            <div className="flex justify-end gap-3">
                                                {msg.status !== 'LOST' && (
                                                    <button
                                                        onClick={() => updateLeadStatus(msg.id, 'LOST')}
                                                        className="px-6 py-2.5 rounded-xl border border-slate-100 bg-white text-[11px] font-black text-slate-400 uppercase tracking-widest hover:bg-rose-50 hover:text-rose-500 hover:border-rose-100 transition-all"
                                                    >
                                                        Arşive Kaldır
                                                    </button>
                                                )}
                                                {msg.status === 'PENDING' && (
                                                    <button
                                                        onClick={() => updateLeadStatus(msg.id, 'CONTACTED')}
                                                        className="px-8 py-2.5 rounded-xl bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest shadow-xl shadow-slate-900/10 hover:bg-[#ff7a21] hover:shadow-orange-500/20 transition-all"
                                                    >
                                                        Çözüldü Olarak İşaretle
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Sidebar Metrics */}
                <div className="xl:sticky xl:top-8 flex flex-col gap-6">
                    <div className="bg-slate-900 rounded-[40px] p-8 text-white shadow-2xl shadow-slate-900/20 relative overflow-hidden group">
                        <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-[#ff7a21]/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000"></div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="bg-orange-500/10 p-3 rounded-2xl">
                                    <MessageSquare size={24} className="text-[#ff7a21]" strokeWidth={3} />
                                </div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">İş Yükü</h3>
                            </div>

                            <div className="flex items-end gap-3 mb-2">
                                <span className="text-6xl font-black tracking-tighter leading-none">{leads.filter(l => l.status === 'PENDING').length}</span>
                                <span className="text-orange-500 text-xs font-black uppercase tracking-widest mb-2">TALEP</span>
                            </div>
                            <p className="text-xs font-bold text-slate-400 italic mb-10">Aktif aksiyon bekleyen bilet sayısı.</p>

                            <div className="bg-white/5 border border-white/5 p-5 rounded-[32px] backdrop-blur-sm group-hover:bg-white/10 transition-all">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Müşteri Memnuniyeti</span>
                                    <span className="text-sm font-black text-emerald-500">%98.4</span>
                                </div>
                                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <div className="w-[98%] h-full bg-emerald-500 rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-100">
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Hız Göstergesi</h4>
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between items-end mb-3">
                                    <span className="text-xs font-black text-slate-500">Ort. Yanıt Süresi</span>
                                    <span className="text-lg font-black text-emerald-500 tabular-nums">14 dk</span>
                                </div>
                                <div className="h-2 bg-slate-50 rounded-full overflow-hidden">
                                    <div className="w-4/5 h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full"></div>
                                </div>
                            </div>
                            <p className="text-[10px] text-slate-400 font-bold italic">Sektör ortalamasından %40 daha hızlı.</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-100">
                        <h5 className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-8">Trafik Kanalları</h5>
                        <div className="space-y-4">
                            {[
                                { label: 'Web Portalı', count: '82%', icon: <Globe size={14} />, color: 'text-blue-500', bg: 'bg-blue-50' },
                                { label: 'Mobile App', count: '12%', icon: <Smartphone size={14} />, color: 'text-violet-500', bg: 'bg-violet-50' },
                                { label: 'E-Posta', count: '6%', icon: <Mail size={14} />, color: 'text-orange-500', bg: 'bg-orange-50' }
                            ].map((channel, idx) => (
                                <div key={idx} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-lg hover:shadow-slate-100 transition-all group/item cursor-default">
                                    <div className="flex items-center gap-3">
                                        <div className={`${channel.bg} ${channel.color} p-2 rounded-lg group-hover/item:scale-110 transition-transform`}>
                                            {channel.icon}
                                        </div>
                                        <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest">{channel.label}</span>
                                    </div>
                                    <span className="text-xs font-black text-gray-900 tabular-nums tracking-tighter">{channel.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
