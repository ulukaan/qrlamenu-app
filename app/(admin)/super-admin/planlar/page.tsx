"use client";
import React, { useState, useEffect } from 'react';
import { CreditCard, CheckCircle, Package, Plus, Edit, Trash2, X, Save, Loader2, Zap, PlusCircle } from 'lucide-react';

export default function SuperAdminPlanlar() {
    const [plans, setPlans] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        code: '',
        price: 0,
        branchLimit: 1,
        tableLimit: 10,
        features: [] as string[]
    });

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/admin/plans');
            const data = await res.json();
            if (Array.isArray(data)) {
                setPlans(data);
            }
        } catch (error) {
            console.error('Error fetching plans:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (plan?: any) => {
        if (plan) {
            setEditingPlan(plan);
            setFormData({
                name: plan.name,
                code: plan.code,
                price: plan.price,
                branchLimit: plan.branchLimit,
                tableLimit: plan.tableLimit,
                features: plan.features || []
            });
        } else {
            setEditingPlan(null);
            setFormData({
                name: '',
                code: '',
                price: 0,
                branchLimit: 1,
                tableLimit: 10,
                features: []
            });
        }
        setModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSaving(true);
            const url = editingPlan ? `/api/admin/plans/${editingPlan.id}` : '/api/admin/plans';
            const method = editingPlan ? 'PATCH' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setModalOpen(false);
                fetchPlans();
            } else {
                const err = await res.json();
                alert(err.error || 'İşlem sırasında hata oluştu');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bu planı silmek istediğinize emin misiniz?')) return;
        try {
            const res = await fetch(`/api/admin/plans/${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchPlans();
            } else {
                const err = await res.json();
                alert(err.error || 'Silme işlemi başarısız');
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div style={{ padding: '2.5rem 3.5rem', width: '100%', maxWidth: '100%' }}>
            {/* Header */}
            <div style={{ marginBottom: '3.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h2 style={{ fontSize: '2rem', fontWeight: '900', color: '#111827', letterSpacing: '-0.04em', margin: 0 }}>Hizmet & Abonelik Katmanları</h2>
                    <p style={{ color: '#64748b', marginTop: '8px', fontSize: '1rem', fontWeight: '500' }}>Platformun gelir modelini, hizmet sınırlarını ve kurumsal paket yapılandırmalarını yönetin.</p>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <button
                        onClick={() => handleOpenModal()}
                        className="hover:scale-105 active:scale-95 transition-all"
                        style={{ background: '#ff7a21', color: '#fff', padding: '14px 32px', borderRadius: '16px', border: 'none', fontSize: '0.95rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 10px 15px -3px rgba(255, 122, 33, 0.3)', cursor: 'pointer' }}
                    >
                        <Plus size={22} strokeWidth={3} /> Yeni Paket Tanımla
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '3rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '120px', background: '#fff', borderRadius: '32px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                            <Loader2 className="animate-spin text-orange-500" size={48} style={{ margin: '0 auto' }} />
                            <p style={{ marginTop: '24px', color: '#64748b', fontWeight: '800', fontSize: '1.1rem' }}>Veriler Senkronize Ediliyor...</p>
                        </div>
                    ) : plans.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '120px', background: '#fff', borderRadius: '32px', border: '2px dashed #e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{ width: '80px', height: '80px', background: '#f8fafc', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                                <Package size={40} style={{ color: '#cbd5e1' }} />
                            </div>
                            <h3 style={{ color: '#111827', fontWeight: '900', fontSize: '1.25rem', marginBottom: '10px' }}>Henüz Tanımlı Paket Yok</h3>
                            <p style={{ color: '#64748b', fontWeight: '500', maxWidth: '300px' }}>Satışa sunulacak paketleri tanımlayarak platformu aktif hale getirin.</p>
                            <button onClick={() => handleOpenModal()} style={{ marginTop: '24px', background: 'none', border: 'none', color: '#3b82f6', fontWeight: '900', cursor: 'pointer', fontSize: '1rem', textDecoration: 'underline' }}>+ İlk Paketi Şimdi Tanımla</button>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '2.5rem' }}>
                            {plans.map((plan: any) => (
                                <div key={plan.id} className="card group" style={{ border: 'none', padding: '48px', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)', background: '#fff' }}>
                                    <div style={{ position: 'absolute', top: '32px', right: '32px', display: 'flex', gap: '12px', zIndex: 10 }}>
                                        <button onClick={() => handleOpenModal(plan)} style={{ width: '40px', height: '40px', borderRadius: '12px', border: 'none', background: '#f8fafc', color: '#3b82f6', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} className="hover:bg-blue-50" title="Yapılandır"><Edit size={18} /></button>
                                        <button onClick={() => handleDelete(plan.id)} style={{ width: '40px', height: '40px', borderRadius: '12px', border: 'none', background: '#fff1f2', color: '#f43f5e', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} className="hover:bg-rose-500 hover:text-white" title="Kalıcı Sil"><Trash2 size={18} /></button>
                                    </div>

                                    {plan.code === 'pro' && (
                                        <div style={{ position: 'absolute', top: '32px', left: '-40px', transform: 'rotate(-45deg)', background: 'linear-gradient(45deg, #ff7a21, #ffb07a)', color: '#fff', fontSize: '0.7rem', fontWeight: '900', padding: '10px 50px', boxShadow: '0 4px 15px rgba(255,122,33,0.3)', zIndex: 5, letterSpacing: '0.05em' }}>POPÜLER</div>
                                    )}

                                    <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: plan.code === 'pro' ? '#fff7ed' : '#eff6ff', color: plan.code === 'pro' ? '#ff7a21' : '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 0 32px 0', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)' }}>
                                        <Zap size={32} />
                                    </div>

                                    <div style={{ marginBottom: '8px' }}>
                                        <h3 style={{ fontSize: '1.6rem', fontWeight: '900', color: '#111827', margin: 0, letterSpacing: '-0.03em' }}>{plan.name}</h3>
                                        <span style={{ fontSize: '0.75rem', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>CODE: {plan.code}</span>
                                    </div>

                                    <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#111827', margin: '24px 0 40px 0', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                                        <span style={{ fontSize: '1.5rem', fontWeight: '800', color: '#374151' }}>₺</span>{plan.price} <span style={{ fontSize: '1rem', color: '#94a3b8', fontWeight: '700' }}>/ ay</span>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', margin: '0 0 48px 0', flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '1rem', color: '#1e293b', fontWeight: '800' }}>
                                            <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CheckCircle size={14} strokeWidth={3} /></div>
                                            {plan.branchLimit} Şube Yönetim Yetkisi
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '1rem', color: '#1e293b', fontWeight: '800' }}>
                                            <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CheckCircle size={14} strokeWidth={3} /></div>
                                            {plan.tableLimit} Masa/QR Menü Kapasitesi
                                        </div>
                                        {plan.features?.map((f: string, i: number) => (
                                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '1rem', color: '#1e293b', fontWeight: '800' }}>
                                                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CheckCircle size={14} strokeWidth={3} /></div>
                                                {f}
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => handleOpenModal(plan)}
                                        style={{ width: '100%', padding: '16px', borderRadius: '16px', background: plan.code === 'pro' ? '#111827' : '#f8fafc', color: plan.code === 'pro' ? '#fff' : '#475569', fontWeight: '900', fontSize: '1rem', cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', border: plan.code === 'pro' ? 'none' : '1px solid #e2e8f0', boxShadow: plan.code === 'pro' ? '0 10px 15px -3px rgba(17, 24, 39, 0.2)' : 'none' }}
                                        className="hover:shadow-lg active:scale-95"
                                    >
                                        Yapılandırmayı Düzenle
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', position: 'sticky', top: '2.5rem', height: 'fit-content' }}>
                    <div className="card" style={{ border: 'none', padding: '40px', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: '#fff', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', borderRadius: '32px', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '150px', height: '150px', background: 'rgba(255,122,33,0.1)', filter: 'blur(60px)', borderRadius: '50%' }}></div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px', position: 'relative' }}>
                            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff7a21', boxShadow: '0 0 10px #ff7a21' }}></div>
                            <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#94a3b8' }}>Platform Gelir Özeti</h3>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', position: 'relative' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                <div>
                                    <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Aktif Paket Sayısı</span>
                                    <span style={{ fontSize: '2.25rem', fontWeight: '900', letterSpacing: '-0.05em' }}>{plans.length}</span>
                                </div>
                                <div style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', padding: '6px 12px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: '900' }}>KARARLI SİSTEM</div>
                            </div>

                            <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)' }}></div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Ücretli Dönüşüm</span>
                                    <div style={{ fontSize: '2rem', fontWeight: '900', color: '#10b981', letterSpacing: '-0.05em' }}>%84.2</div>
                                </div>
                                <div style={{ width: '48px', height: '48px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <CheckCircle size={24} />
                                </div>
                            </div>

                            <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', fontWeight: '600', lineHeight: '1.6' }}>
                                <b style={{ color: '#fff' }}>Hızlı Analiz:</b> PRO paket kullanımı geçen aya oranla %12 artış gösterdi. Fiyatlandırma politikası verimli ilerliyor.
                            </p>
                        </div>
                    </div>

                    <div className="card" style={{ border: 'none', padding: '32px', background: '#fff', borderRadius: '24px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                            <div style={{ background: '#fff7ed', padding: '12px', borderRadius: '14px' }}>
                                <CreditCard size={24} color="#ff7a21" />
                            </div>
                            <div>
                                <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', fontWeight: '900', color: '#111827' }}>SaaS Yönetim İlkesi</h4>
                                <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', lineHeight: '1.6', fontWeight: '500' }}>
                                    Bu alandaki değişiklikler faturalandırma motorunu etkiler. Paket limitlerini düşürmek, mevcut kullanıcıların operasyonel kısıtlamalar yaşamasına neden olabilir.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Editor Modal */}
            {modalOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(15, 23, 42, 0.4)', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(12px)'
                }}>
                    <div className="animate-in fade-in zoom-in duration-300 card" style={{
                        padding: '56px', borderRadius: '32px',
                        width: '100%', maxWidth: '640px', position: 'relative',
                        boxShadow: '0 30px 60px -12px rgba(0,0,0,0.4)', border: 'none', background: '#fff'
                    }}>
                        <button
                            onClick={() => setModalOpen(false)}
                            style={{ position: 'absolute', top: '40px', right: '40px', background: '#f8fafc', border: 'none', cursor: 'pointer', color: '#64748b', width: '48px', height: '48px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                            className="hover:bg-rose-500 hover:text-white"
                        >
                            <X size={24} />
                        </button>

                        <div style={{ marginBottom: '40px' }}>
                            <div style={{ width: '64px', height: '64px', background: '#eff6ff', color: '#3b82f6', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                                <PlusCircle size={32} />
                            </div>
                            <h3 style={{ fontSize: '2rem', fontWeight: '900', color: '#111827', margin: '0 0 8px 0', letterSpacing: '-0.04em' }}>
                                {editingPlan ? 'Paketi Yapılandır' : 'Yeni Paket Oluştur'}
                            </h3>
                            <p style={{ color: '#64748b', fontSize: '1rem', fontWeight: '500' }}>Hizmet limitlerini rafine ederek platform teklifini güncelleyin.</p>
                        </div>

                        <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '900', color: '#374151', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Paket Görünür Adı</label>
                                <input
                                    type="text" required
                                    value={formData.name}
                                    placeholder="Örn: Kurumsal Premier"
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    style={{ width: '100%', padding: '16px 20px', borderRadius: '16px', border: '1px solid #e2e8f0', background: '#fcfcfc', outline: 'none', fontWeight: '800', fontSize: '1rem', color: '#111827' }}
                                    className="focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '900', color: '#374151', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sistem Kodu (Sabit)</label>
                                <input
                                    type="text" required
                                    value={formData.code}
                                    placeholder="premier_v1"
                                    disabled={!!editingPlan}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                    style={{ width: '100%', padding: '16px 20px', borderRadius: '16px', border: '1px solid #e2e8f0', background: editingPlan ? '#f1f5f9' : '#fcfcfc', outline: 'none', fontWeight: '800', fontSize: '1rem', color: editingPlan ? '#64748b' : '#111827', cursor: editingPlan ? 'not-allowed' : 'text' }}
                                    className="focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '900', color: '#374151', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Aylık Maliyet (₺)</label>
                                <div style={{ position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', fontWeight: '900', color: '#94a3b8' }}>₺</span>
                                    <input
                                        type="number" required
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                        style={{ width: '100%', padding: '16px 20px 16px 40px', borderRadius: '16px', border: '1px solid #e2e8f0', background: '#fcfcfc', outline: 'none', fontWeight: '900', fontSize: '1rem', color: '#111827' }}
                                        className="focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all"
                                    />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '900', color: '#374151', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Şube Kotası</label>
                                <input
                                    type="number" required
                                    value={formData.branchLimit}
                                    onChange={(e) => setFormData({ ...formData, branchLimit: parseInt(e.target.value) })}
                                    style={{ width: '100%', padding: '16px 20px', borderRadius: '16px', border: '1px solid #e2e8f0', background: '#fcfcfc', outline: 'none', fontWeight: '800', fontSize: '1rem', color: '#111827' }}
                                    className="focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '900', color: '#374151', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Masa/QR Limiti</label>
                                <input
                                    type="number" required
                                    value={formData.tableLimit}
                                    onChange={(e) => setFormData({ ...formData, tableLimit: parseInt(e.target.value) })}
                                    style={{ width: '100%', padding: '16px 20px', borderRadius: '16px', border: '1px solid #e2e8f0', background: '#fcfcfc', outline: 'none', fontWeight: '800', fontSize: '1rem', color: '#111827' }}
                                    className="focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all"
                                />
                            </div>

                            <div style={{ gridColumn: 'span 2', marginTop: '16px' }}>
                                <button
                                    type="submit" disabled={isSaving}
                                    style={{ width: '100%', padding: '18px', borderRadius: '20px', background: '#111827', color: '#fff', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', cursor: 'pointer', boxShadow: '0 20px 25px -5px rgba(17, 24, 39, 0.2)', border: 'none', fontSize: '1.1rem', transition: 'all 0.3s' }}
                                    className="hover:scale-[1.02] active:scale-95 disabled:opacity-70"
                                >
                                    {isSaving ? <Loader2 size={24} className="animate-spin" /> : <Save size={24} />}
                                    {isSaving ? 'İşleniyor...' : editingPlan ? 'Yapılandırmayı Kaydet' : 'Yeni Paketi Aktifleştir'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
