"use client";

import React, { useState, useEffect } from 'react';
import {
    Megaphone,
    Plus,
    PlusCircle,
    Trash2,
    Save,
    X,
    Loader2,
    CheckCircle2,
    AlertCircle,
    Calendar,
    Image as ImageIcon,
    Layout
} from 'lucide-react';

export default function CampaignsPage() {
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editingCampaign, setEditingCampaign] = useState<any>(null);

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        imageUrl: '',
        isActive: true,
        startDate: '',
        endDate: ''
    });

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
            } else {
                const errorData = await res.json();
                alert(`Hata: ${errorData.details || errorData.error || 'İşlem başarısız oldu'}`);
            }
        } catch (error: any) {
            console.error('Error saving campaign:', error);
            alert('Sunucuyla iletişim kurulurken bir hata oluştu.');
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
            }
        } catch (error) {
            console.error('Error toggling status:', error);
        }
    };

    const deleteCampaign = async (id: string) => {
        if (!confirm('Bu kampanyayı silmek istediğinize emin misiniz?')) return;
        try {
            const res = await fetch(`/api/restaurant/campaigns?id=${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                fetchCampaigns();
            }
        } catch (error) {
            console.error('Error deleting campaign:', error);
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
        <div style={{ padding: '2rem', background: '#f9fafb', minHeight: 'calc(100vh - 80px)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#111827', margin: 0 }}>Kampanya & Duyuru Yönetimi</h2>
                    <p style={{ color: '#6b7280', marginTop: '4px' }}>Müşterilerinizin menüde göreceği bannerları ve kampanyaları yönetin.</p>
                </div>
                <button
                    onClick={() => {
                        setEditingCampaign(null);
                        setFormData({ title: '', content: '', imageUrl: '', isActive: true, startDate: '', endDate: '' });
                        setModalOpen(true);
                    }}
                    style={{
                        padding: '12px 24px',
                        background: '#111827',
                        color: 'white',
                        border: 'none',
                        borderRadius: '10px',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                >
                    <PlusCircle size={20} />
                    Yeni Kampanya
                </button>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '100px', color: '#9ca3af' }}>
                    <Loader2 size={40} className="animate-spin" style={{ margin: '0 auto' }} />
                    <p style={{ marginTop: '16px' }}>Yükleniyor...</p>
                </div>
            ) : campaigns.length === 0 ? (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '80px',
                    background: 'white',
                    borderRadius: '20px',
                    border: '2px dashed #e5e7eb'
                }}>
                    <div style={{ background: '#f3f4f6', padding: '24px', borderRadius: '50%', marginBottom: '24px' }}>
                        <Megaphone size={48} color="#9ca3af" />
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>Henüz Kampanya Yok</h3>
                    <p style={{ color: '#6b7280', textAlign: 'center', maxWidth: '400px', marginBottom: '24px' }}>
                        Menünüzde görünecek duyurular, indirimler veya kampanyalar oluşturarak satışlarınızı artırabilirsiniz.
                    </p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '24px' }}>
                    {campaigns.map((campaign) => (
                        <div key={campaign.id} style={{
                            background: 'white',
                            borderRadius: '16px',
                            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                            border: '1px solid #e5e7eb',
                            overflow: 'hidden',
                            position: 'relative',
                            transition: 'transform 0.2s'
                        }}>
                            <div style={{
                                height: '140px',
                                background: campaign.imageUrl ? `url(${campaign.imageUrl}) center/cover` : '#f3f4f6',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {!campaign.imageUrl && <Megaphone size={48} color="#d1d5db" />}
                                <div style={{
                                    position: 'absolute',
                                    top: '12px',
                                    right: '12px',
                                    display: 'flex',
                                    gap: '8px'
                                }}>
                                    <span style={{
                                        padding: '4px 10px',
                                        borderRadius: '20px',
                                        background: campaign.isActive ? '#f0fdf4' : '#fef2f2',
                                        color: campaign.isActive ? '#15803d' : '#b91c1c',
                                        fontSize: '0.75rem',
                                        fontWeight: '700',
                                        border: `1px solid ${campaign.isActive ? '#bbf7d0' : '#fecaca'}`
                                    }}>
                                        {campaign.isActive ? 'AKTİF' : 'PASİF'}
                                    </span>
                                </div>
                            </div>

                            <div style={{ padding: '20px' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>{campaign.title}</h3>
                                <p style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '16px', minHeight: '40px' }}>
                                    {campaign.content || 'Açıklama belirtilmedi.'}
                                </p>

                                <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', fontSize: '0.8rem', color: '#9ca3af' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Calendar size={14} />
                                        {campaign.startDate ? new Date(campaign.startDate).toLocaleDateString('tr-TR') : 'Belirtilmedi'}
                                    </div>
                                    <span>-</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Calendar size={14} />
                                        {campaign.endDate ? new Date(campaign.endDate).toLocaleDateString('tr-TR') : 'Belirtilmedi'}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #f3f4f6', paddingTop: '16px' }}>
                                    <button
                                        onClick={() => toggleStatus(campaign)}
                                        style={{
                                            flex: 1,
                                            padding: '8px',
                                            borderRadius: '8px',
                                            background: campaign.isActive ? '#f3f4f6' : '#111827',
                                            color: campaign.isActive ? '#374151' : 'white',
                                            border: 'none',
                                            fontSize: '0.85rem',
                                            fontWeight: '600',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {campaign.isActive ? 'Durdur' : 'Yayınla'}
                                    </button>
                                    <button
                                        onClick={() => openEditModal(campaign)}
                                        style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #e5e7eb', background: 'white', cursor: 'pointer' }}
                                    >
                                        Düzenle
                                    </button>
                                    <button
                                        onClick={() => deleteCampaign(campaign.id)}
                                        style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #fee2e2', background: '#fef2f2', color: '#dc2626', cursor: 'pointer' }}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {modalOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
                    <div style={{ background: 'white', borderRadius: '20px', width: '100%', maxWidth: '500px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
                        <div style={{ padding: '24px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800' }}>
                                {editingCampaign ? 'Kampanyayı Düzenle' : 'Yeni Kampanya Oluştur'}
                            </h3>
                            <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}>
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '8px' }}>Kampanya Başlığı</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="Örn: Hafta Sonu Fırsatı"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '1rem' }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '8px' }}>İçerik / Açıklama</label>
                                    <textarea
                                        placeholder="Kampanya detaylarını buraya yazın..."
                                        rows={3}
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '1rem', resize: 'none' }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '8px' }}>Resim URL</label>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <div style={{ flex: 1, position: 'relative' }}>
                                            <input
                                                type="text"
                                                placeholder="https://..."
                                                value={formData.imageUrl}
                                                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                                style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '10px', border: '1px solid #e5e7eb' }}
                                            />
                                            <ImageIcon size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: '#9ca3af' }} />
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '8px' }}>Başlangıç Tarihi</label>
                                        <input
                                            type="date"
                                            value={formData.startDate}
                                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                            style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e5e7eb' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '8px' }}>Bitiş Tarihi</label>
                                        <input
                                            type="date"
                                            value={formData.endDate}
                                            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                            style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e5e7eb' }}
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <input
                                        type="checkbox"
                                        id="isActive"
                                        checked={formData.isActive}
                                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                        style={{ width: '20px', height: '20px', accentColor: '#ff7a21' }}
                                    />
                                    <label htmlFor="isActive" style={{ fontSize: '0.9rem', fontWeight: '600' }}>Hemen Yayınla</label>
                                </div>
                            </div>

                            <div style={{ marginTop: '32px', display: 'flex', gap: '12px' }}>
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '1px solid #e5e7eb', background: 'white', fontWeight: '700', cursor: 'pointer' }}
                                >
                                    Vazgeç
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    style={{
                                        flex: 2,
                                        padding: '14px',
                                        borderRadius: '12px',
                                        background: '#ff7a21',
                                        color: 'white',
                                        border: 'none',
                                        fontWeight: '700',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '10px'
                                    }}
                                >
                                    {isSaving ? <Loader2 size={20} className="animate-spin" /> : <PlusCircle size={20} />}
                                    {editingCampaign ? 'Değişiklikleri Kaydet' : 'Kampanyayı Oluştur'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
