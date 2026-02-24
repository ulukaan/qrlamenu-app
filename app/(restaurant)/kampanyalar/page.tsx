"use client";

import React, { useState, useEffect } from 'react';
import {
    Megaphone,
    Plus,
    Trash2,
    Save,
    X,
    Loader2,
    Calendar,
    Image as ImageIcon,
    LayoutGrid,
    CheckCircle2,
    AlertCircle,
    Activity,
    Edit,
    ToggleLeft,
    ToggleRight,
    Search,
    ChevronRight,
    MoreVertical,
    Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function CampaignsPage() {
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editingCampaign, setEditingCampaign] = useState<any>(null);
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<{ id: string; title: string } | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        imageUrl: '',
        isActive: true,
        startDate: '',
        endDate: ''
    });

    const showMessage = (message: string, type: 'success' | 'error' = 'success') => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 3000);
    };

    const fetchCampaigns = async () => {
        try {
            const res = await fetch('/api/restaurant/campaigns');
            if (res.ok) {
                const data = await res.json();
                setCampaigns(data);
            }
        } catch (error) {
            console.error('Error fetching campaigns:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const url = '/api/restaurant/campaigns';
            const method = editingCampaign ? 'PATCH' : 'POST';
            const body = editingCampaign ? { ...formData, id: editingCampaign.id } : formData;

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (res.ok) {
                setModalOpen(false);
                fetchCampaigns();
                setEditingCampaign(null);
                setFormData({ title: '', content: '', imageUrl: '', isActive: true, startDate: '', endDate: '' });
                showMessage(editingCampaign ? 'Kampanya başarıyla güncellendi' : 'Yeni kampanya başarıyla oluşturuldu');
            } else {
                const errorData = await res.json();
                showMessage(errorData.details || errorData.error || 'İşlem başarısız oldu', 'error');
            }
        } catch (error: any) {
            console.error('Error saving campaign:', error);
            showMessage('Sunucuyla iletişim kurulurken bir hata oluştu.', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const toggleStatus = async (campaign: any) => {
        try {
            const res = await fetch('/api/restaurant/campaigns', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: campaign.id, isActive: !campaign.isActive })
            });

            if (res.ok) {
                fetchCampaigns();
                showMessage(`Kampanya ${!campaign.isActive ? 'yayınlandı' : 'durduruldu'}`);
            }
        } catch (error) {
            console.error('Error toggling status:', error);
            showMessage('Durum güncellenemedi', 'error');
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/restaurant/campaigns?id=${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                fetchCampaigns();
                setConfirmDelete(null);
                showMessage('Kampanya başarıyla silindi');
            } else {
                showMessage('Silme işlemi başarısız', 'error');
            }
        } catch (error) {
            console.error('Error deleting campaign:', error);
            showMessage('Bir hata oluştu', 'error');
        }
    };

    const openEditModal = (campaign: any) => {
        setEditingCampaign(campaign);
        setFormData({
            title: campaign.title,
            content: campaign.content || '',
            imageUrl: campaign.imageUrl || '',
            isActive: campaign.isActive,
            startDate: campaign.startDate ? new Date(campaign.startDate).toISOString().split('T')[0] : '',
            endDate: campaign.endDate ? new Date(campaign.endDate).toISOString().split('T')[0] : ''
        });
        setModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            {/* Notifications */}
            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, x: '-50%' }}
                        animate={{ opacity: 1, y: 20 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`fixed top-0 left-1/2 z-[9999] flex items-center gap-3 px-8 py-4 rounded-[24px] shadow-2xl backdrop-blur-md border ${notification?.type === 'success' ? 'bg-emerald-500/90 text-white border-emerald-400/50' : 'bg-rose-500/90 text-white border-rose-400/50'}`}
                    >
                        {notification?.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                        <span className="text-xs font-black tracking-widest uppercase">{notification?.message}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header Area */}
            <div className="bg-white border-b-2 border-gray-50 pt-16 pb-12 px-8 md:px-12">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="space-y-4">
                            {/* Breadcrumbs */}
                            <div className="flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                <Link href="/dashboard" className="hover:text-orange-500 transition-colors">PANEL</Link>
                                <ChevronRight size={10} className="text-gray-300" />
                                <span className="text-orange-500">KAMPANYALAR</span>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 bg-orange-500 rounded-[32px] flex items-center justify-center shadow-2xl shadow-orange-500/20 rotate-3 transform-gpu hover:rotate-0 transition-transform duration-500">
                                    <Megaphone size={36} className="text-white" strokeWidth={1.5} />
                                </div>
                                <div className="space-y-1">
                                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase leading-none">KAMPANYALAR</h1>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">RESTORAN DUYURULARI</span>
                                        <div className="h-1 w-1 bg-gray-300 rounded-full" />
                                        <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] bg-orange-50 px-3 py-1 rounded-full border border-orange-100">{campaigns.length} ADET</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <div className="relative group w-full sm:w-72">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-orange-500 transition-colors" size={18} />
                                <input
                                    type="text"
                                    placeholder="KAMPANYA ARA..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-16 pr-8 py-5 bg-gray-50 border-2 border-gray-100 rounded-[24px] text-xs font-black placeholder:text-gray-300 focus:border-orange-500 focus:bg-white outline-none transition-all uppercase"
                                />
                            </div>
                            <button
                                onClick={() => {
                                    setEditingCampaign(null);
                                    setFormData({ title: '', content: '', imageUrl: '', isActive: true, startDate: '', endDate: '' });
                                    setModalOpen(true);
                                }}
                                className="w-full sm:w-auto flex items-center justify-center gap-4 bg-gray-900 text-white px-10 py-5 rounded-[24px] text-xs font-black tracking-widest hover:bg-orange-600 transition-all shadow-xl shadow-gray-900/10 active:scale-95 border-b-4 border-black/20"
                            >
                                <Plus size={18} strokeWidth={3} />
                                YENİ KAMPANYA
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="p-8 md:p-12 lg:p-16">
                <div className="max-w-7xl mx-auto">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-32 space-y-6">
                            <div className="relative">
                                <Loader2 className="w-16 h-16 text-orange-500 animate-spin" strokeWidth={1} />
                                <div className="absolute inset-0 bg-orange-500/10 blur-2xl rounded-full" />
                            </div>
                            <p className="text-sm font-black text-gray-400 uppercase tracking-widest animate-pulse">VERİLER YÜKLENİYOR...</p>
                        </div>
                    ) : campaigns.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-[40px] border-2 border-slate-50 p-20 text-center shadow-sm"
                        >
                            <div className="w-24 h-24 bg-orange-50 rounded-[32px] flex items-center justify-center mx-auto mb-8 border-2 border-orange-100/50">
                                <Megaphone size={40} className="text-orange-500" strokeWidth={1.5} />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tighter uppercase">HENÜZ KAMPANYA YOK</h3>
                            <p className="text-sm font-black text-gray-400 uppercase tracking-widest mb-10">MÜŞTERİLERİNİZ İÇİN İLK DUYURUNUZU OLUŞTURUN</p>
                            <button
                                onClick={() => setModalOpen(true)}
                                className="inline-flex items-center gap-3 bg-gray-900 text-white px-10 py-5 rounded-[24px] text-xs font-black tracking-widest hover:bg-orange-600 transition-all shadow-xl shadow-gray-900/10"
                            >
                                <Plus size={18} strokeWidth={3} />
                                KAMPANYA OLUŞTUR
                            </button>
                        </motion.div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {campaigns.filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase())).map((campaign, index) => (
                                <motion.div
                                    key={campaign.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="group bg-white rounded-[40px] border-2 border-slate-50 hover:border-gray-200 transition-all duration-500 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-gray-900/5"
                                >
                                    <div className="relative h-60 overflow-hidden">
                                        {campaign.imageUrl ? (
                                            <img src={campaign.imageUrl} alt={campaign.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        ) : (
                                            <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                                                <Megaphone size={48} className="text-gray-200" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                        <div className="absolute top-6 right-6 flex gap-2">
                                            <div className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border-2 ${campaign.isActive ? 'bg-emerald-500/90 border-emerald-400 text-white' : 'bg-gray-900/90 border-gray-800 text-white'}`}>
                                                {campaign.isActive ? 'AKTİF' : 'PASİF'}
                                            </div>
                                        </div>

                                        <div className="absolute bottom-6 left-6 right-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 flex gap-2">
                                            <button
                                                onClick={() => toggleStatus(campaign)}
                                                className="flex-1 bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-3 rounded-[18px] text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-gray-900 transition-all"
                                            >
                                                {campaign.isActive ? 'DURDUR' : 'YAYINLA'}
                                            </button>
                                            <button
                                                onClick={() => openEditModal(campaign)}
                                                className="w-12 h-12 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-[18px] flex items-center justify-center hover:bg-white hover:text-gray-900 transition-all"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => setConfirmDelete({ id: campaign.id, title: campaign.title })}
                                                className="w-12 h-12 bg-rose-500/20 backdrop-blur-md border border-rose-500/30 text-rose-500 rounded-[18px] flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-8 space-y-4">
                                        <div>
                                            <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-2 block">KAMPANYA BAŞLIĞI</span>
                                            <h3 className="text-2xl font-black text-gray-900 tracking-tighter uppercase leading-tight line-clamp-1">{campaign.title}</h3>
                                        </div>

                                        <p className="text-xs font-medium text-gray-400 leading-relaxed line-clamp-2 h-8">
                                            {campaign.content || 'AÇIKLAMA BELİRTİLMEDİ.'}
                                        </p>

                                        <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                                            <div className="flex items-center gap-3 text-gray-400">
                                                <Calendar size={16} />
                                                <span className="text-[10px] font-black uppercase tracking-widest">
                                                    {campaign.startDate ? new Date(campaign.startDate).toLocaleDateString('tr-TR') : '...'} - {campaign.endDate ? new Date(campaign.endDate).toLocaleDateString('tr-TR') : '...'}
                                                </span>
                                            </div>
                                            <div className="flex -space-x-2">
                                                <div className="w-8 h-8 rounded-full bg-orange-100 border-2 border-white flex items-center justify-center">
                                                    <span className="text-[8px] font-black text-orange-600">M</span>
                                                </div>
                                                <div className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center">
                                                    <span className="text-[8px] font-black text-blue-600">E</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Campaign Modal */}
            <AnimatePresence>
                {modalOpen && (
                    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 md:p-8">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setModalOpen(false)}
                            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="p-8 md:p-10 border-b-2 border-slate-50 flex items-center justify-between bg-gray-50/30">
                                <div>
                                    <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] mb-2 block">KAMPANYA YÖNETİMİ</span>
                                    <h3 className="text-3xl font-black text-gray-900 tracking-tighter uppercase leading-none">
                                        {editingCampaign ? 'KAMPANYAYI DÜZENLE' : 'YENİ KAMPANYA'}
                                    </h3>
                                </div>
                                <button
                                    onClick={() => setModalOpen(false)}
                                    className="w-12 h-12 bg-white text-gray-400 rounded-[20px] flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all shadow-sm border border-gray-100"
                                >
                                    <X size={20} strokeWidth={3} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">KAMPANYA BAŞLIĞI</label>
                                        <input
                                            required
                                            type="text"
                                            placeholder="ÖRN: HAFTA SONU FIRSATI"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full px-8 py-5 bg-gray-50 border-2 border-gray-100 rounded-[24px] text-xs font-black placeholder:text-gray-300 focus:border-orange-500 focus:bg-white outline-none transition-all uppercase"
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">İÇERİK / AÇIKLAMA</label>
                                        <textarea
                                            placeholder="KAMPANYA DETAYLARINI BURAYA YAZIN..."
                                            rows={3}
                                            value={formData.content}
                                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                            className="w-full px-8 py-5 bg-gray-50 border-2 border-gray-100 rounded-[24px] text-xs font-black placeholder:text-gray-300 focus:border-orange-500 focus:bg-white outline-none transition-all resize-none uppercase"
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">RESİM URL</label>
                                        <div className="relative group">
                                            <ImageIcon size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-orange-500 transition-colors" />
                                            <input
                                                type="text"
                                                placeholder="HTTPS://..."
                                                value={formData.imageUrl}
                                                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                                className="w-full pl-16 pr-8 py-5 bg-gray-50 border-2 border-gray-100 rounded-[24px] text-xs font-black placeholder:text-gray-300 focus:border-orange-500 focus:bg-white outline-none transition-all uppercase"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">BAŞLANGIÇ TARİHİ</label>
                                            <div className="relative">
                                                <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                                <input
                                                    type="date"
                                                    value={formData.startDate}
                                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                                    className="w-full pl-16 pr-8 py-5 bg-gray-50 border-2 border-gray-100 rounded-[24px] text-xs font-black focus:border-orange-500 focus:bg-white outline-none transition-all uppercase"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">BİTİŞ TARİHİ</label>
                                            <div className="relative">
                                                <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                                <input
                                                    type="date"
                                                    value={formData.endDate}
                                                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                                    className="w-full pl-16 pr-8 py-5 bg-gray-50 border-2 border-gray-100 rounded-[24px] text-xs font-black focus:border-orange-500 focus:bg-white outline-none transition-all uppercase"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                                        className="flex items-center justify-between p-6 bg-gray-50 rounded-[32px] cursor-pointer hover:bg-orange-50 transition-colors border-2 border-transparent hover:border-orange-100"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-[18px] flex items-center justify-center transition-all ${formData.isActive ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-gray-200 text-gray-400'}`}>
                                                <Activity size={20} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest">KAMPANYA DURUMU</p>
                                                <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">
                                                    {formData.isActive ? 'HEMEN YAYINLA' : 'TASLAK OLARAK KAYDET'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 flex items-center ${formData.isActive ? 'bg-orange-500' : 'bg-gray-200'}`}>
                                            <motion.div
                                                layout
                                                className="w-6 h-6 bg-white rounded-full shadow-md"
                                                animate={{ x: formData.isActive ? 24 : 0 }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setModalOpen(false)}
                                        className="flex-1 px-8 py-5 rounded-[24px] text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-2 border-gray-100 hover:bg-gray-50 transition-all"
                                    >
                                        VAZGEÇ
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="flex-[2] flex items-center justify-center gap-3 bg-orange-500 text-white px-10 py-5 rounded-[24px] text-[10px] font-black tracking-[0.2em] hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/20 disabled:opacity-50 border-b-4 border-orange-700/20 active:scale-95"
                                    >
                                        {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                        {editingCampaign ? 'DEĞİŞİKLİKLERİ KAYDET' : 'KAMPANYAYI BAŞLAT'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {confirmDelete && (
                    <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setConfirmDelete(null)}
                            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative bg-white w-full max-w-sm rounded-[40px] shadow-2xl overflow-hidden p-10 text-center"
                        >
                            <div className="w-20 h-20 bg-rose-50 rounded-[32px] flex items-center justify-center mx-auto mb-8 border-2 border-rose-100/50">
                                <Trash2 size={36} className="text-rose-500" strokeWidth={1.5} />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tighter uppercase whitespace-normal">KAMPANYAYI SİL?</h3>
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-10 leading-relaxed px-4">
                                <span className="text-gray-900 font-bold">{confirmDelete?.title}</span> SİLİNECEK. BU İŞLEM GERİ ALINAMAZ.
                            </p>
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => confirmDelete && handleDelete(confirmDelete.id)}
                                    className="w-full bg-rose-500 text-white px-8 py-5 rounded-[24px] text-[10px] font-black tracking-[0.2em] hover:bg-rose-600 transition-all shadow-xl shadow-rose-500/20 active:scale-95"
                                >
                                    SİLMEYİ ONAYLA
                                </button>
                                <button
                                    onClick={() => setConfirmDelete(null)}
                                    className="w-full bg-gray-50 text-gray-400 px-8 py-5 rounded-[24px] text-[10px] font-black tracking-[0.2em] hover:bg-gray-200 transition-all border-2 border-gray-100"
                                >
                                    VAZGEÇ
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Footer Style Adjustments */}
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e2e8f0;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #cbd5e1;
                }
            `}</style>
        </div>
    );
}
