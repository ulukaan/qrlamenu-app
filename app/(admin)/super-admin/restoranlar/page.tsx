"use client";
import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreVertical, Edit, Trash2, Eye, Plus, Store, PlusCircle, Loader2, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function SuperAdminRestoranlar() {
    const [tenants, setTenants] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchTenants();
    }, []);

    const fetchTenants = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/admin/tenants');
            const data = await res.json();
            if (Array.isArray(data)) {
                setTenants(data);
            }
        } catch (error) {
            console.error('Error fetching tenants:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredTenants = tenants.filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.ownerEmail.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="px-6 py-8 w-full max-w-full">
            {/* Page Header Area */}
            <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">
                        <span>PANEL</span>
                        <ChevronRight size={8} className="text-slate-300" />
                        <span className="text-slate-900">RESTORANLAR</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-[20px] font-semibold text-slate-900 tracking-tight leading-none uppercase">
                            İşletme Portföy Yönetimi
                        </h1>
                    </div>
                    <p className="text-[13px] font-medium text-slate-500">Platformdaki tüm kayıtlı restoranları, aktif abonelikleri ve deneme süreçlerini tek panelden yönetin.</p>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/super-admin/restoranlar/yeni" className="w-full md:w-auto">
                        <button className="h-9 w-full md:w-auto bg-slate-900 text-white px-4 rounded-[6px] text-[13px] font-semibold hover:bg-slate-800 transition-all shadow-sm flex items-center justify-center gap-2">
                            <PlusCircle size={16} />
                            Yeni İşletme Kaydı
                        </button>
                    </Link>
                </div>
            </header>

            <div className="h-px bg-slate-200/60 w-full mb-10" />

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6 items-start">
                {/* Main Table Column */}
                <div className="flex flex-col gap-6 min-w-0">
                    <section className="bg-white rounded-[6px] shadow-sm border border-slate-200/60 overflow-hidden">
                        <div className="px-6 py-5 border-b border-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white">
                            <h3 className="text-[15px] font-bold text-slate-900 tracking-tight flex items-center gap-3">
                                Kayıtlı İşletmeler <span className="text-slate-500 text-[12px] bg-slate-100 px-2 py-0.5 rounded-[4px] font-semibold">{filteredTenants.length} Toplam</span>
                            </h3>
                            <div className="relative w-full md:w-80 group">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-600 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="İşletme adı veya sahip ara..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-9 pr-4 h-9 rounded-[6px] border border-slate-200 bg-white text-[13px] font-semibold text-slate-700 outline-none focus:border-slate-300 focus:ring-1 focus:ring-slate-300 transition-all placeholder:text-slate-400"
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead className="bg-[#f8fafc] border-b border-slate-200/60">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">İşletme Profili</th>
                                        <th className="px-6 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Mülkiyet & İletişim</th>
                                        <th className="px-6 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Durum</th>
                                        <th className="px-6 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Plan</th>
                                        <th className="px-6 py-3 text-right text-[11px] font-bold text-slate-500 uppercase tracking-wider">Yönetim</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={5} className="py-20 text-center">
                                                <div className="flex flex-col items-center gap-4">
                                                    <Loader2 size={32} className="animate-spin text-slate-400" />
                                                    <span className="text-slate-500 font-semibold text-[13px]">Veriler Yükleniyor...</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : filteredTenants.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="py-20 text-center">
                                                <div className="flex flex-col items-center gap-4">
                                                    <div className="w-16 h-16 bg-slate-50 rounded-[6px] flex items-center justify-center text-slate-300 border border-slate-100">
                                                        <Store size={24} strokeWidth={1.5} />
                                                    </div>
                                                    <span className="text-[14px] font-bold text-slate-600">Kayıt Bulunamadı</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : filteredTenants.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-white rounded-[6px] flex items-center justify-center text-slate-400 overflow-hidden border border-slate-200 shadow-sm">
                                                        {item.logoUrl ? <img src={item.logoUrl} alt="" className="w-full h-full object-cover" /> : <Store size={20} />}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-slate-900 text-[14px]">{item.name}</p>
                                                        <p className="mt-1 text-[11px] text-slate-500 font-medium">ID: {item.id.substring(0, 8).toUpperCase()}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-[13px] font-semibold text-slate-900 uppercase">{item.ownerEmail.split('@')[0]}</p>
                                                <p className="text-[12px] text-slate-500 mt-0.5">{item.ownerEmail}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className={`
                                                    inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] text-[11px] font-semibold border
                                                    ${item.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                        item.status === 'TRIAL' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                            'bg-slate-50 text-slate-500 border-slate-200'}
                                                `}>
                                                    <div className={`w-1.5 h-1.5 rounded-full bg-current ${item.status === 'ACTIVE' ? 'animate-pulse' : ''}`}></div>
                                                    {item.status === 'ACTIVE' ? 'AKTİF' : item.status === 'TRIAL' ? 'DENEME' : 'PASİF'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-[13px] font-semibold text-slate-900 uppercase">{item.plan?.name || 'STANDART'}</span>
                                                    <span className="text-[11px] text-slate-400 font-medium mt-0.5">Premium Kurumsal</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Link href={`/super-admin/restoranlar/${item.id}`}>
                                                        <button className="h-8 px-3 rounded-[4px] border border-slate-200 bg-white text-slate-600 text-[12px] font-semibold flex items-center gap-2 hover:border-slate-300 hover:text-slate-900 shadow-sm transition-all">
                                                            <Edit size={14} /> Detay
                                                        </button>
                                                    </Link>
                                                    <button className="w-8 h-8 rounded-[4px] bg-white text-rose-500 flex items-center justify-center hover:bg-rose-50 border border-slate-200 hover:border-rose-200 shadow-sm transition-all">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>

                {/* Right Sidebar Column */}
                <aside className="flex flex-col gap-6 xl:sticky xl:top-8 h-fit">
                    <div className="bg-white rounded-[6px] p-6 shadow-sm border border-slate-200/60">
                        <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
                            <div className="w-8 h-8 bg-slate-50 text-slate-600 rounded-[4px] border border-slate-100 flex items-center justify-center">
                                <Filter size={16} />
                            </div>
                            <h3 className="text-[14px] font-bold text-slate-900 tracking-tight">Akıllı Filtreleme</h3>
                        </div>
                        <div className="flex flex-col gap-5">
                            <div>
                                <label className="block mb-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Operasyonel Durum</label>
                                <select className="w-full px-3 h-9 rounded-[6px] border border-slate-200 bg-white text-[13px] font-semibold text-slate-700 outline-none focus:border-slate-300 transition-all cursor-pointer shadow-sm appearance-none">
                                    <option>Tüm İşletmeler</option>
                                    <option>Sadece Aktifler</option>
                                    <option>Deneme Sürümü</option>
                                    <option>İptal Edilenler</option>
                                </select>
                            </div>
                            <div>
                                <label className="block mb-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Abonelik Paketi</label>
                                <select className="w-full px-3 h-9 rounded-[6px] border border-slate-200 bg-white text-[13px] font-semibold text-slate-700 outline-none focus:border-slate-300 transition-all cursor-pointer shadow-sm appearance-none">
                                    <option>Tüm Paketler</option>
                                    <option>Başlangıç</option>
                                    <option>Profesyonel</option>
                                    <option>Growth+</option>
                                    <option>Enterprise</option>
                                </select>
                            </div>
                            <button className="w-full h-9 bg-slate-100 text-slate-700 rounded-[6px] text-[13px] font-bold border border-slate-200 hover:bg-slate-200 transition-all mt-2">
                                Filtreleri Uygula
                            </button>
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-[6px] p-6 text-white shadow-sm border border-slate-800">
                        <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
                            <h3 className="text-[13px] font-semibold uppercase tracking-tight text-white">Ekosistem Analizi</h3>
                        </div>
                        <div className="flex flex-col gap-6">
                            <div className="flex justify-between items-center">
                                <span className="text-[12px] text-slate-400 font-medium tracking-wide">Toplam Restoran</span>
                                <span className="text-2xl font-bold">{tenants.length}</span>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center bg-white/5 px-4 py-3 rounded-[6px] border border-white/10">
                                    <span className="text-emerald-400 text-[11px] font-bold tracking-wider">Aktif Lisanslar</span>
                                    <span className="text-[14px] font-bold">{tenants.filter(t => t.status === 'ACTIVE').length}</span>
                                </div>
                                <div className="flex justify-between items-center bg-white/5 px-4 py-3 rounded-[6px] border border-white/10">
                                    <span className="text-amber-400 text-[11px] font-bold tracking-wider">Deneme Süreci</span>
                                    <span className="text-[14px] font-bold">{tenants.filter(t => t.status === 'TRIAL').length}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}

