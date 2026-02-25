"use client";

import React, { useState, useEffect, useRef } from 'react';
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

import { MobileMenuToggle, ProfileDropdown } from '@/components/HeaderActions';
import { LoadingScreen } from '@/components/ui/loading-screen';

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
                        className={`fixed top-0 left-1/2 z-[9999] flex items-center gap-3 px-6 py-3 rounded-[6px] shadow-lg backdrop-blur-md border ${notification?.type === 'success' ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-rose-600 text-white border-rose-500'}`}
                    >
                        {notification?.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                        <span className="text-[11px] font-bold tracking-tight uppercase">{notification?.message}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header Area */}
            <div className="bg-white border-b border-slate-200 py-6 px-6 relative z-30 shadow-sm">
                <div className="w-full mx-auto">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div className="flex items-start md:items-center gap-4">
                            <MobileMenuToggle />
                            <div className="space-y-4">
                                {/* Breadcrumbs */}
                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    <Link href="/dashboard" className="hover:text-slate-900 transition-colors uppercase">Yönetim</Link>
                                    <ChevronRight size={10} className="text-slate-300" />
                                    <span className="text-orange-600">KAMPANYALAR</span>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-slate-900 rounded-[4px] flex items-center justify-center shadow-md">
                                        <Megaphone size={20} className="text-white" strokeWidth={2} />
                                    </div>
                                    <div className="space-y-1">
                                        <h1 className="text-[20px] font-semibold text-slate-900 tracking-tight leading-none uppercase">KAMPANYALAR</h1>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight bg-slate-50 px-2 py-0.5 rounded-[4px] border border-slate-100">{campaigns.length} AKTİF</span>
                                            <div className="h-1 w-1 bg-slate-200 rounded-full" />
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">MÜŞTERİ DUYURULARI</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-3">
                            <div className="relative group w-full sm:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={14} />
                                <input
                                    type="text"
                                    placeholder="ARA..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full h-9 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-[6px] text-[11px] font-bold placeholder:text-slate-400 focus:border-slate-400 focus:bg-white outline-none transition-all uppercase tracking-tight"
                                />
                            </div>
                            <button
                                onClick={() => {
                                    setEditingCampaign(null);
                                    setFormData({ title: '', content: '', imageUrl: '', isActive: true, startDate: '', endDate: '' });
                                    setModalOpen(true);
                                }}
                                className="w-full sm:w-auto h-9 flex items-center justify-center gap-2 bg-slate-900 text-white px-4 rounded-[6px] text-[11px] font-bold tracking-tight hover:bg-slate-800 transition-all shadow-sm active:scale-95"
                            >
                                <Plus size={14} strokeWidth={2.5} />
                                YENİ EKLE
                            </button>
                            <ProfileDropdown />
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="p-6 md:p-8 lg:p-10">
                <div className="max-w-7xl mx-auto">
                    {loading ? (
                        <LoadingScreen message="KAMPANYALAR HAZIRLANIYOR" />
                    ) : campaigns.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-[6px] border border-slate-200 p-20 text-center shadow-sm"
                        >
                            <div className="w-20 h-20 bg-orange-50 rounded-[6px] flex items-center justify-center mx-auto mb-6 border border-orange-100/50">
                                <Megaphone size={32} className="text-orange-600" strokeWidth={2} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2 tracking-tight uppercase">HENÜZ KAMPANYA YOK</h3>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight mb-8">MÜŞTERİLERİNİZ İÇİN İLK DUYURUNUZU OLUŞTURUN</p>
                            <button
                                onClick={() => setModalOpen(true)}
                                className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-[6px] text-[11px] font-bold tracking-tight hover:bg-slate-800 transition-all shadow-md active:scale-95"
                            >
                                <Plus size={16} strokeWidth={2.5} />
                                KAMPANYA OLUŞTUR
                            </button>
                        </motion.div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {campaigns.filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase())).map((campaign, index) => (
                                <motion.div
                                    key={campaign.id}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="group bg-white rounded-[6px] border border-slate-200 hover:border-slate-300 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-md"
                                >
                                    <div className="relative h-48 overflow-hidden bg-slate-100">
                                        {campaign.imageUrl ? (
                                            <img src={campaign.imageUrl} alt={campaign.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Megaphone size={40} className="text-slate-200" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                        <div className="absolute top-4 right-4 flex gap-2">
                                            <div className={`px-2.5 py-1 rounded-[4px] text-[9px] font-bold uppercase tracking-tight border ${campaign.isActive ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-slate-900 border-slate-800 text-white'}`}>
                                                {campaign.isActive ? 'AKTİF' : 'PASİF'}
                                            </div>
                                        </div>

                                        <div className="absolute bottom-4 left-4 right-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex gap-2">
                                            <button
                                                onClick={() => toggleStatus(campaign)}
                                                className="flex-1 bg-white border border-white text-slate-900 px-3 py-2 rounded-[4px] text-[9px] font-bold uppercase tracking-tight hover:bg-slate-50 transition-all shadow-lg"
                                            >
                                                {campaign.isActive ? 'DURDUR' : 'YAYINLA'}
                                            </button>
                                            <button
                                                onClick={() => openEditModal(campaign)}
                                                className="w-9 h-9 bg-white border border-white text-slate-900 rounded-[4px] flex items-center justify-center hover:bg-slate-50 transition-all shadow-lg"
                                            >
                                                <Edit size={14} strokeWidth={2.5} />
                                            </button>
                                            <button
                                                onClick={() => setConfirmDelete({ id: campaign.id, title: campaign.title })}
                                                className="w-9 h-9 bg-rose-600 border border-white text-white rounded-[4px] flex items-center justify-center hover:bg-rose-700 transition-all shadow-lg"
                                            >
                                                <Trash2 size={14} strokeWidth={2.5} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-4 space-y-3">
                                        <div>
                                            <span className="text-[9px] font-bold text-orange-600 uppercase tracking-widest mb-1 block">YAYINDA</span>
                                            <h3 className="text-[14px] font-bold text-slate-900 tracking-tight uppercase leading-tight line-clamp-1">{campaign.title}</h3>
                                        </div>

                                        <p className="text-[11px] font-medium text-slate-500 leading-relaxed line-clamp-2 h-8">
                                            {campaign.content || 'Açıklama belirtilmedi.'}
                                        </p>

                                        <div className="pt-3 border-t border-slate-50 flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-slate-400">
                                                <Calendar size={12} strokeWidth={2} />
                                                <span className="text-[10px] font-bold uppercase tracking-tight">
                                                    {campaign.startDate ? new Date(campaign.startDate).toLocaleDateString('tr-TR') : '...'} - {campaign.endDate ? new Date(campaign.endDate).toLocaleDateString('tr-TR') : '...'}
                                                </span>
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
                    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setModalOpen(false)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="relative bg-white w-full max-w-xl rounded-[6px] shadow-2xl overflow-hidden"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">YÖNETİM</span>
                                    <h3 className="text-xl font-bold text-slate-900 tracking-tight uppercase leading-none">
                                        {editingCampaign ? 'KAMPANYAYI DÜZENLE' : 'YENİ KAMPANYA'}
                                    </h3>
                                </div>
                                <button
                                    onClick={() => setModalOpen(false)}
                                    className="w-10 h-10 bg-white text-slate-400 rounded-[4px] flex items-center justify-center hover:text-rose-500 transition-all shadow-sm border border-slate-200"
                                >
                                    <X size={18} strokeWidth={2.5} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                                <div className="space-y-5">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">KAMPANYA BAŞLIĞI</label>
                                        <input
                                            required
                                            type="text"
                                            placeholder="ÖRN: HAFTA SONU FIRSATI"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-[6px] text-[12px] font-bold text-slate-900 placeholder:text-slate-300 focus:border-slate-900 outline-none transition-all uppercase tracking-tight"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">İÇERİK / AÇIKLAMA</label>
                                        <textarea
                                            placeholder="KAMPANYA DETAYLARINI BURAYA YAZIN..."
                                            rows={3}
                                            value={formData.content}
                                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-[6px] text-[12px] font-bold text-slate-900 placeholder:text-slate-300 focus:border-slate-900 outline-none transition-all resize-none uppercase tracking-tight"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">RESİM URL</label>
                                        <div className="relative group">
                                            <ImageIcon size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors" />
                                            <input
                                                type="text"
                                                placeholder="RESİM BAĞLANTISI (OPSİYONEL)"
                                                value={formData.imageUrl}
                                                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-[6px] text-[12px] font-bold text-slate-900 placeholder:text-slate-300 focus:border-slate-900 outline-none transition-all uppercase tracking-tight"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">BAŞLANGIÇ TARİHİ</label>
                                            <div className="relative">
                                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                                                <input
                                                    type="date"
                                                    value={formData.startDate}
                                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-[6px] text-[11px] font-bold text-slate-900 focus:border-slate-900 outline-none transition-all uppercase"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">BİTİŞ TARİHİ</label>
                                            <div className="relative">
                                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                                                <input
                                                    type="date"
                                                    value={formData.endDate}
                                                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-[6px] text-[11px] font-bold text-slate-900 focus:border-slate-900 outline-none transition-all uppercase"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                                        className="flex items-center justify-between p-4 bg-slate-50 rounded-[6px] cursor-pointer hover:bg-slate-100 transition-colors border border-slate-200 shadow-sm"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-[4px] flex items-center justify-center transition-all ${formData.isActive ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-400'}`}>
                                                <Activity size={18} strokeWidth={2.5} />
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-bold text-slate-900 uppercase tracking-tight">KAMPANYA DURUMU</p>
                                                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-tight">
                                                    {formData.isActive ? 'YAYINLANACAK' : 'TASLAK OLARAK KALACAK'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 flex items-center ${formData.isActive ? 'bg-emerald-600' : 'bg-slate-300'}`}>
                                            <motion.div
                                                layout
                                                className="w-4 h-4 bg-white rounded-full shadow-sm"
                                                animate={{ x: formData.isActive ? 24 : 0 }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setModalOpen(false)}
                                        className="flex-1 px-6 py-3 rounded-[6px] text-[11px] font-bold text-slate-400 uppercase tracking-tight border border-slate-200 hover:bg-slate-50 transition-all"
                                    >
                                        VAZGEÇ
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="flex-[2] flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-[6px] text-[11px] font-bold tracking-tight hover:bg-slate-800 transition-all shadow-md disabled:opacity-50 active:scale-95"
                                    >
                                        {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} strokeWidth={2.5} />}
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
                    <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4 lg:p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setConfirmDelete(null)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="relative bg-white w-full max-w-sm rounded-[6px] shadow-2xl overflow-hidden p-8 text-center border border-slate-200"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="w-16 h-16 bg-rose-50 rounded-[6px] flex items-center justify-center mx-auto mb-6 border border-rose-100">
                                <Trash2 size={24} className="text-rose-600" strokeWidth={2} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2 tracking-tight uppercase">KAMPANYAYI SİL</h3>
                            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-tight mb-8 leading-relaxed">
                                <span className="text-slate-900 font-bold">"{confirmDelete?.title}"</span> KALICI OLARAK SİLİNECEK.
                            </p>
                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={() => confirmDelete && handleDelete(confirmDelete.id)}
                                    className="w-full bg-rose-600 text-white px-6 py-3 rounded-[6px] text-[11px] font-bold tracking-tight hover:bg-rose-700 transition-all shadow-md active:scale-95"
                                >
                                    SİLMEYİ ONAYLA
                                </button>
                                <button
                                    onClick={() => setConfirmDelete(null)}
                                    className="w-full bg-white text-slate-400 px-6 py-3 rounded-[6px] text-[11px] font-bold tracking-tight hover:bg-slate-50 transition-all border border-slate-200"
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
                ::-webkit-scrollbar {
                    width: 5px;
                    height: 5px;
                }
                ::-webkit-scrollbar-track {
                    background: transparent;
                }
                ::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 10px;
                }
                ::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                }
                body {
                    font-family: 'Plus Jakarta Sans', sans-serif;
                }
            `}</style>
        </div>
    );
}
