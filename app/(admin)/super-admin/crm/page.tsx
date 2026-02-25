"use client";
import React, { useState, useEffect } from 'react';
import { Users, Mail, Phone, Calendar, MessageSquare, Plus, Loader2, TrendingUp, CheckCircle2, X, Check, AlertCircle, MoreVertical, Trash2, Filter } from 'lucide-react';

export default function CRMPage() {
    const [leads, setLeads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeFilter, setActiveFilter] = useState('ALL');

    // Modal & Form State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingLead, setEditingLead] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        restaurant: '',
        email: '',
        phone: '',
        notes: ''
    });

    const fetchLeads = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/admin/crm');
            if (!res.ok) throw new Error('CRM verileri yüklenemedi');
            const data = await res.json();
            setLeads(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    const handleAddLead = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const res = await fetch('/api/admin/crm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                await fetchLeads();
                setIsAddModalOpen(false);
                setFormData({ name: '', restaurant: '', email: '', phone: '', notes: '' });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    const handleUpdateStatus = async (id: string, newStatus: string) => {
        try {
            const res = await fetch('/api/admin/crm', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: newStatus })
            });
            if (res.ok) fetchLeads();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteLead = async (id: string) => {
        if (!confirm('Bu potansiyel müşteriyi silmek istediğinize emin misiniz?')) return;
        try {
            const res = await fetch(`/api/admin/crm?id=${id}`, { method: 'DELETE' });
            if (res.ok) fetchLeads();
        } catch (err) {
            console.error(err);
        }
    };

    const filteredLeads = leads.filter(l => {
        if (activeFilter === 'ALL') return true;
        if (activeFilter === 'PENDING') return l.status === 'PENDING';
        if (activeFilter === 'CONVERTED') return l.status === 'CONVERTED';
        if (activeFilter === 'LOST') return l.status === 'LOST';
        return true;
    });

    const stats = {
        total: leads.length,
        pending: leads.filter(l => l.status === 'PENDING').length,
        converted: leads.filter(l => l.status === 'CONVERTED').length,
        conversionRate: leads.length > 0
            ? ((leads.filter(l => l.status === 'CONVERTED').length / leads.length) * 100).toFixed(1)
            : '0'
    };

    return (
        <div className="px-6 py-8 w-full max-w-full">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-[20px] font-semibold text-slate-900 tracking-tight leading-none uppercase">CRM Müşteri Yönetimi</h1>
                    <p className="text-[12px] text-slate-500 mt-1 font-medium bg-slate-100 px-2 py-0.5 rounded-[4px] inline-block mb-0 uppercase tracking-widest">Aday Akışı ve Dönüşüm Analizi</p>
                </div>
                <div className="w-full sm:w-auto">
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="w-full sm:w-auto h-9 px-4 rounded-[6px] border border-slate-200 bg-white text-slate-700 font-semibold text-[13px] flex items-center justify-center gap-2 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
                    >
                        <Plus size={16} /> Yeni Aday Kaydı
                    </button>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                    { label: 'Toplam Aday', value: stats.total, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
                    { label: 'Bekleyenler', value: stats.pending, icon: Calendar, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
                    { label: 'Dönüşüm Oranı', value: `%${stats.conversionRate}`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
                    { label: 'Dönüşenler', value: stats.converted, icon: CheckCircle2, color: 'text-slate-700', bg: 'bg-slate-100', border: 'border-slate-200' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-5 rounded-[6px] shadow-sm border border-slate-200 hover:border-slate-300 transition-colors flex items-center justify-between">
                        <div>
                            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">{stat.label}</p>
                            <h3 className="text-[24px] font-bold text-slate-900 tracking-tight leading-none">{loading ? '...' : stat.value}</h3>
                        </div>
                        <div className={`${stat.bg} ${stat.color} w-10 h-10 rounded-[6px] border ${stat.border} flex items-center justify-center`}>
                            <stat.icon size={20} />
                        </div>
                    </div>
                ))}
            </div>

            <div className="h-px bg-slate-200/60 w-full mb-8" />

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-8 items-start">
                <div className="space-y-6 min-w-0">
                    <div className="bg-white rounded-[6px] shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-50 gap-4">
                            <div className="flex items-center gap-3">
                                <h3 className="text-[15px] font-bold text-slate-900 tracking-tight">Potansiyel Aday Akışı</h3>
                                <span className="bg-white border border-slate-200 px-2 py-0.5 rounded-[4px] text-[11px] font-bold text-slate-500 tracking-widest uppercase">
                                    {filteredLeads.length} Aday
                                </span>
                            </div>
                        </div>

                        <div className="p-5">
                            {loading ? (
                                <div className="py-20 text-center">
                                    <Loader2 className="animate-spin text-slate-400 mx-auto mb-4" size={32} />
                                    <p className="text-slate-500 font-semibold text-[13px]">Veriler yükleniyor...</p>
                                </div>
                            ) : error ? (
                                <div className="p-6 text-center text-[13px] font-semibold text-rose-600 bg-rose-50 rounded-[6px] border border-rose-200">{error}</div>
                            ) : filteredLeads.length === 0 ? (
                                <div className="py-20 text-center flex flex-col items-center justify-center">
                                    <div className="w-16 h-16 bg-slate-50 rounded-[6px] flex items-center justify-center mb-4 text-slate-400 border border-slate-200">
                                        <Users size={24} />
                                    </div>
                                    <h4 className="text-[15px] font-bold text-slate-900 mb-2">Aday Bulunamadı</h4>
                                    <p className="text-slate-500 text-[13px] font-medium max-w-[280px]">Mevcut filtre kriterlerine uygun bir müşteri adayı bulunmuyor.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {filteredLeads.map((lead) => (
                                        <div key={lead.id} className="bg-white rounded-[6px] border border-slate-200 p-5 hover:border-slate-300 hover:shadow-sm transition-all flex flex-col lg:flex-row gap-5 items-start">

                                            <div className="w-10 h-10 bg-slate-100 text-slate-500 rounded-[6px] border border-slate-200 flex items-center justify-center shrink-0">
                                                <Users size={18} />
                                            </div>

                                            <div className="flex-1 w-full flex flex-col gap-4">
                                                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                                    <div>
                                                        <h4 className="text-[15px] font-bold text-slate-900 flex items-center gap-2">
                                                            {lead.name}
                                                            {lead.restaurant && <span className="text-slate-500 font-medium px-2 py-0.5 bg-slate-50 rounded-[4px] border border-slate-200 text-[12px]">{lead.restaurant}</span>}
                                                        </h4>
                                                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 uppercase tracking-widest mt-1.5">
                                                            <Calendar size={12} className="text-slate-400" />
                                                            {new Date(lead.createdAt).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2 w-full sm:w-auto">
                                                        <select
                                                            value={lead.status}
                                                            onChange={(e) => handleUpdateStatus(lead.id, e.target.value)}
                                                            className={`w-full sm:w-36 text-[11px] font-bold px-3 h-8 rounded-[4px] border transition-all cursor-pointer outline-none shadow-sm ${lead.status === 'CONVERTED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                                                lead.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                                                    lead.status === 'CONTACTED' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                                        'bg-slate-50 text-slate-600 border-slate-200'
                                                                }`}
                                                        >
                                                            <option value="PENDING">BEKLEMEDE</option>
                                                            <option value="CONTACTED">GÖRÜŞÜLDÜ</option>
                                                            <option value="CONVERTED">DÖNÜŞTÜ</option>
                                                            <option value="LOST">KAYBEDİLDİ</option>
                                                        </select>
                                                        <button
                                                            onClick={() => handleDeleteLead(lead.id)}
                                                            className="w-8 h-8 flex items-center justify-center border border-rose-200 bg-white hover:bg-rose-50 text-rose-500 rounded-[4px] transition-colors shrink-0 shadow-sm"
                                                            title="Sil"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </div>

                                                {lead.notes && (
                                                    <div className="bg-slate-50 rounded-[4px] p-3 border border-slate-200">
                                                        <p className="text-[12px] text-slate-600 font-medium leading-relaxed">
                                                            {lead.notes}
                                                        </p>
                                                    </div>
                                                )}

                                                <div className="flex flex-wrap gap-2">
                                                    {lead.email && (
                                                        <div className="flex items-center gap-2 text-[12px] font-semibold text-slate-600 bg-white px-3 h-7 rounded-[4px] border border-slate-200 hover:bg-slate-50 transition-colors">
                                                            <Mail size={12} className="text-slate-400" /> {lead.email}
                                                        </div>
                                                    )}
                                                    {lead.phone && (
                                                        <div className="flex items-center gap-2 text-[12px] font-semibold text-slate-600 bg-white px-3 h-7 rounded-[4px] border border-slate-200 hover:bg-slate-50 transition-colors">
                                                            <Phone size={12} className="text-slate-400" /> {lead.phone}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <aside className="xl:sticky xl:top-8 flex flex-col gap-6">
                    <div className="bg-slate-900 rounded-[6px] p-6 text-white shadow-sm border border-slate-800">
                        <div className="relative">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="bg-slate-800 text-slate-400 p-2 rounded-[4px]">
                                    <Filter size={18} />
                                </div>
                                <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Kategori Filtresi</h3>
                            </div>

                            <div className="flex flex-col gap-2">
                                {[
                                    { id: 'ALL', label: 'Bütün Potansiyeller' },
                                    { id: 'PENDING', label: 'Bekleyen Adaylar' },
                                    { id: 'CONVERTED', label: 'Dönüşen İşletmeler' },
                                    { id: 'LOST', label: 'Arşivlenmiş Kayıtlar' }
                                ].map((filter) => (
                                    <button
                                        key={filter.id}
                                        onClick={() => setActiveFilter(filter.id)}
                                        className={`w-full px-4 h-11 rounded-[6px] text-[12px] font-semibold text-left transition-colors border ${activeFilter === filter.id
                                            ? 'bg-slate-800 border-slate-700 text-white'
                                            : 'bg-transparent border-transparent text-slate-400 hover:bg-slate-800/50 hover:text-white'
                                            }`}
                                    >
                                        {filter.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-emerald-50 rounded-[6px] p-5 border border-emerald-200 shadow-sm flex gap-4 items-start">
                        <div className="bg-emerald-100 p-2 rounded-[4px] shrink-0 text-emerald-600 mt-0.5">
                            <TrendingUp size={18} />
                        </div>
                        <div>
                            <h4 className="text-[13px] font-bold text-emerald-900 mb-1">Dönüşüm Rehberi</h4>
                            <p className="text-[12px] text-emerald-700 font-medium leading-relaxed">
                                Potansiyel adaylara <span className="font-bold underline">ilk 24 saat</span> içinde dönüş yapmak, satış/dönüşüm şansını ortalama %65'e kadar artırır.
                            </p>
                        </div>
                    </div>
                </aside>
            </div>

            {/* Add Lead Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setIsAddModalOpen(false)} />
                    <div className="relative w-full max-w-lg bg-white rounded-[6px] p-6 shadow-xl animate-in zoom-in-95 duration-200 border border-slate-200 flex flex-col max-h-[90vh]">
                        <button
                            onClick={() => setIsAddModalOpen(false)}
                            className="absolute top-6 right-6 w-8 h-8 rounded-[4px] bg-white border border-slate-200 text-slate-500 flex items-center justify-center hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
                        >
                            <X size={16} />
                        </button>

                        <div className="mb-6 flex items-center gap-4">
                            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-[6px] border border-indigo-100 flex items-center justify-center shrink-0">
                                <Plus size={20} />
                            </div>
                            <div>
                                <h3 className="text-[16px] font-bold text-slate-900 tracking-tight leading-tight">Yeni Potansiyel Aday Ekle</h3>
                                <p className="text-[12px] text-slate-500 font-medium">Sisteme yeni bir müşteri adayı tanımlayın.</p>
                            </div>
                        </div>

                        <form onSubmit={handleAddLead} className="grid grid-cols-1 md:grid-cols-2 gap-5 overflow-y-auto pr-2 pb-2">
                            <div className="md:col-span-2">
                                <label className="block text-[12px] font-bold text-slate-700 mb-2">Yetkili Ad Soyad</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Örn: Ahmet Yılmaz"
                                    className="w-full h-10 px-3 rounded-[6px] border border-slate-200 bg-white text-[13px] font-semibold text-slate-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-[12px] font-bold text-slate-700 mb-2">İşletme / Restoran Adı</label>
                                <input
                                    type="text"
                                    value={formData.restaurant}
                                    onChange={(e) => setFormData({ ...formData, restaurant: e.target.value })}
                                    placeholder="Örn: Gurme Burger"
                                    className="w-full h-10 px-3 rounded-[6px] border border-slate-200 bg-white text-[13px] font-semibold text-slate-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-[12px] font-bold text-slate-700 mb-2">Telefon Numarası</label>
                                <input
                                    type="text"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="05..."
                                    className="w-full h-10 px-3 rounded-[6px] border border-slate-200 bg-white text-[13px] font-semibold text-slate-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-[12px] font-bold text-slate-700 mb-2">İletişim E-Posta Adresi</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="ornek@posta.com"
                                    className="w-full h-10 px-3 rounded-[6px] border border-slate-200 bg-white text-[13px] font-semibold text-slate-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-[12px] font-bold text-slate-700 mb-2">Görüşme Notları / Çıktılar</label>
                                <textarea
                                    rows={4}
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    placeholder="İlk görüşme çıktılarını not alın..."
                                    className="w-full p-3 rounded-[6px] border border-slate-200 bg-white text-[13px] font-medium text-slate-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none"
                                />
                            </div>

                            <div className="md:col-span-2 mt-4">
                                <button
                                    type="submit" disabled={isSaving}
                                    className="w-full h-10 rounded-[6px] bg-slate-900 hover:bg-slate-800 text-white font-semibold text-[13px] shadow-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                                >
                                    {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} strokeWidth={2.5} />}
                                    {isSaving ? 'Kaydediliyor...' : 'Adayı Kaydet'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
