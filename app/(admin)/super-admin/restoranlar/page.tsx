"use client";
import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreVertical, Edit, Trash2, Eye, Plus, Store, PlusCircle, Loader2 } from 'lucide-react';
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
        <div className="p-8 md:p-12 lg:p-16 w-full max-w-full">
            {/* Page Header Area */}
            <header className="mb-12 flex flex-col xl:flex-row justify-between items-start xl:items-end gap-8">
                <div className="max-w-3xl">
                    <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight leading-tight">
                        İşletme Portföy Yönetimi
                    </h2>
                    <p className="text-gray-500 mt-3 text-lg font-medium leading-relaxed">
                        Platformdaki tüm kayıtlı restoranları, aktif abonelikleri ve deneme süreçlerini tek panelden yönetin.
                    </p>
                </div>
                <Link href="/super-admin/restoranlar/yeni" className="w-full xl:w-auto">
                    <button className="w-full xl:w-auto bg-[#ea580c] text-white px-10 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 shadow-xl shadow-orange-500/20 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest">
                        <PlusCircle size={20} strokeWidth={3} /> Yeni İşletme Kaydı
                    </button>
                </Link>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-12 items-start">
                {/* Main Table Column */}
                <div className="flex flex-col gap-10 min-w-0">
                    <section className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-10 py-8 border-b border-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-gray-50/50">
                            <h3 className="text-xl font-black text-gray-900 tracking-tight">
                                Kayıtlı İşletmeler <span className="text-[#ea580c] ml-3 text-xs bg-white border border-orange-100 px-3 py-1 rounded-full shadow-sm">({filteredTenants.length} Toplam)</span>
                            </h3>
                            <div className="relative w-full md:w-96 group">
                                <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#ea580c] transition-colors" />
                                <input
                                    type="text"
                                    placeholder="İşletme adı veya sahip ara..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-14 pr-6 py-4 rounded-2xl border-2 border-gray-100 bg-white text-sm font-bold text-gray-700 outline-none focus:border-[#ea580c] focus:ring-4 focus:ring-orange-600/10 transition-all placeholder:text-gray-400"
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead className="bg-gray-50/50">
                                    <tr>
                                        <th className="px-10 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">İşletme Profili</th>
                                        <th className="px-10 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Mülkiyet & İletişim</th>
                                        <th className="px-10 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Durum</th>
                                        <th className="px-10 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Plan</th>
                                        <th className="px-10 py-6 text-right text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Yönetim</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={5} className="py-40 text-center">
                                                <div className="flex flex-col items-center gap-6">
                                                    <Loader2 size={56} className="animate-spin text-[#ea580c]" />
                                                    <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Veriler Senkronize Ediliyor...</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : filteredTenants.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="py-40 text-center">
                                                <div className="flex flex-col items-center gap-8">
                                                    <div className="w-24 h-24 bg-gray-50 rounded-[32px] flex items-center justify-center text-gray-200 border-2 border-gray-100 shadow-inner">
                                                        <Store size={48} strokeWidth={1} />
                                                    </div>
                                                    <span className="text-lg font-black text-gray-900 uppercase tracking-wider">Kayıt Bulunamadı</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : filteredTenants.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50/50 transition-all group">
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-gray-300 overflow-hidden border-2 border-gray-50 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                                                        {item.logoUrl ? <img src={item.logoUrl} alt="" className="w-full h-full object-cover" /> : <Store size={28} />}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-gray-900 text-lg leading-tight group-hover:text-[#ea580c] transition-colors">{item.name}</p>
                                                        <p className="mt-2 text-[10px] text-gray-400 font-black bg-gray-100/50 px-2 py-0.5 rounded-md inline-block tracking-widest uppercase">ID: {item.id.substring(0, 8).toUpperCase()}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <p className="text-sm font-black text-gray-900 uppercase tracking-tight">{item.ownerEmail.split('@')[0]}</p>
                                                <p className="mt-1 text-xs text-gray-400 font-bold">{item.ownerEmail}</p>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className={`
                                                    inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black border-2
                                                    ${item.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-sm shadow-emerald-500/10' :
                                                        item.status === 'TRIAL' ? 'bg-orange-50 text-orange-600 border-orange-100 shadow-sm shadow-orange-500/10' :
                                                            'bg-gray-50 text-gray-400 border-gray-100'}
                                                `}>
                                                    <div className={`w-1.5 h-1.5 rounded-full bg-current ${item.status === 'ACTIVE' ? 'animate-pulse' : ''}`}></div>
                                                    {item.status === 'ACTIVE' ? 'AKTİF' : item.status === 'TRIAL' ? 'DENEME' : 'PASİF'}
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black text-gray-900 uppercase tracking-tight">{item.plan?.name || 'STANDART'}</span>
                                                    <span className="text-[10px] text-gray-400 font-black mt-1 uppercase tracking-widest">Premium Kurumsal</span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                                                    <Link href={`/super-admin/restoranlar/${item.id}`}>
                                                        <button className="h-12 px-6 rounded-xl border-2 border-gray-100 bg-white text-gray-700 text-[10px] font-black flex items-center gap-3 hover:border-orange-200 hover:text-[#ea580c] shadow-sm transition-all uppercase tracking-widest">
                                                            <Edit size={16} strokeWidth={3} /> Detay
                                                        </button>
                                                    </Link>
                                                    <button className="w-12 h-12 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white border-2 border-rose-50 hover:border-rose-500 shadow-sm transition-all">
                                                        <Trash2 size={20} strokeWidth={2.5} />
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
                <aside className="flex flex-col gap-10 xl:sticky xl:top-8 h-fit">
                    <div className="bg-white rounded-[40px] p-10 shadow-sm border-2 border-gray-50 border-l-[6px] border-l-[#ea580c] group">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="bg-orange-50 text-[#ea580c] p-4 rounded-2xl border-2 border-orange-100 group-hover:rotate-12 transition-transform">
                                <Filter size={24} strokeWidth={2.5} />
                            </div>
                            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-900">Akıllı Filtreleme</h3>
                        </div>
                        <div className="flex flex-col gap-8">
                            <div>
                                <label className="block mb-3 text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] ml-1">Operasyonel Durum</label>
                                <select className="w-full px-6 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50 text-xs font-black text-gray-900 outline-none focus:bg-white focus:border-[#ea580c] transition-all cursor-pointer shadow-sm">
                                    <option>Tüm İşletmeler</option>
                                    <option>Sadece Aktifler</option>
                                    <option>Deneme Sürümü</option>
                                    <option>İptal Edilenler</option>
                                </select>
                            </div>
                            <div>
                                <label className="block mb-3 text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] ml-1">Abonelik Paketi</label>
                                <select className="w-full px-6 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50 text-xs font-black text-gray-900 outline-none focus:bg-white focus:border-[#ea580c] transition-all cursor-pointer shadow-sm">
                                    <option>Tüm Paketler</option>
                                    <option>Başlangıç</option>
                                    <option>Profesyonel</option>
                                    <option>Growth+</option>
                                    <option>Enterprise</option>
                                </select>
                            </div>
                            <button className="w-full py-5 bg-gray-900 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-gray-900/20 hover:bg-[#ea580c] hover:shadow-orange-500/40 hover:-translate-y-1 transition-all mt-2">
                                Filtreleri Uygula
                            </button>
                        </div>
                    </div>

                    <div className="bg-[#0f172a] rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden group border border-white/5">
                        <div className="absolute -right-10 -top-10 w-48 h-48 bg-orange-600/10 rounded-full blur-[60px] group-hover:scale-150 transition-transform duration-1000"></div>
                        <div className="flex items-center gap-4 mb-10 relative">
                            <div className="w-2 h-10 bg-emerald-400 rounded-full shadow-[0_0_20px_#10b981]"></div>
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Ekosistem Analizi</h3>
                        </div>
                        <div className="flex flex-col gap-8 relative">
                            <div className="flex justify-between items-end">
                                <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Toplam Restoran</span>
                                <span className="text-5xl font-black tracking-tighter leading-none">{tenants.length}</span>
                            </div>
                            <div className="h-px bg-white/10 w-full"></div>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center bg-white/5 p-5 rounded-[24px] border border-white/5 hover:bg-white/10 transition-colors group/stat">
                                    <span className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em]">Aktif Lisanslar</span>
                                    <span className="text-xl font-black group-hover/stat:scale-110 transition-transform">{tenants.filter(t => t.status === 'ACTIVE').length}</span>
                                </div>
                                <div className="flex justify-between items-center bg-white/5 p-5 rounded-[24px] border border-white/5 hover:bg-white/10 transition-colors group/stat">
                                    <span className="text-[#ea580c] text-[10px] font-black uppercase tracking-[0.2em]">Deneme Süreci</span>
                                    <span className="text-xl font-black group-hover/stat:scale-110 transition-transform">{tenants.filter(t => t.status === 'TRIAL').length}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}

