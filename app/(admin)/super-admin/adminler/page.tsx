"use client";
import React, { useState, useEffect } from 'react';
import { Shield, UserPlus, MoreVertical, Key, Mail, Lock, Loader2, X } from 'lucide-react';

export default function AdminlerPage() {
    const [admins, setAdmins] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Modal & Form State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAdmin, setEditingAdmin] = useState<any>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'SUPER_ADMIN'
    });
    const [actionLoading, setActionLoading] = useState(false);

    const fetchAdmins = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/admin/admins');
            if (!res.ok) throw new Error('Yöneticiler yüklenemedi');
            const data = await res.json();
            setAdmins(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdmins();
    }, []);

    const resetForm = () => {
        setFormData({ name: '', email: '', password: '', role: 'SUPER_ADMIN' });
        setEditingAdmin(null);
    };

    const handleOpenAdd = () => {
        resetForm();
        setIsModalOpen(true);
    };

    const handleOpenEdit = (admin: any) => {
        setEditingAdmin(admin);
        setFormData({
            name: admin.name || '',
            email: admin.email,
            password: '', // Password left empty if not updating
            role: admin.role
        });
        setIsModalOpen(true);
    };

    const handleAction = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setActionLoading(true);
            const url = editingAdmin ? `/api/admin/admins/${editingAdmin.id}` : '/api/admin/admins';
            const method = editingAdmin ? 'PATCH' : 'POST';

            const payload: any = {
                name: formData.name,
                email: formData.email,
                role: formData.role
            };

            if (!editingAdmin || formData.password) {
                payload.password = formData.password;
            }

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setIsModalOpen(false);
                fetchAdmins();
            } else {
                const data = await res.json();
                alert(data.error || 'İşlem başarısız.');
            }
        } catch (err) {
            console.error(err);
            alert('Bir hata oluştu.');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`${name || 'Bu kullanıcıyı'} silmek istediğinize emin misiniz?`)) return;

        try {
            setLoading(true);
            const res = await fetch(`/api/admin/admins/${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchAdmins();
            } else {
                alert('Silme işlemi başarısız.');
            }
        } catch (err) {
            console.error(err);
            alert('Bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusToggle = async (admin: any) => {
        try {
            const res = await fetch(`/api/admin/admins/${admin.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ emailVerified: !admin.emailVerified })
            });
            if (res.ok) fetchAdmins();
        } catch (err) {
            console.error(err);
        }
    };

    const handleResetPassword = async (admin: any) => {
        const newPassword = prompt('Yeni şifreyi giriniz:', '123456');
        if (!newPassword) return;

        try {
            const res = await fetch(`/api/admin/admins/${admin.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: newPassword })
            });
            if (res.ok) alert('Şifre başarıyla güncellendi.');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div style={{ padding: '1.5rem 2rem', width: '100%', maxWidth: '100%' }}>
            {/* Page Header Area */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#111827', letterSpacing: '-0.04em', margin: 0 }}>Sistem Yetkili Yönetimi</h2>
                    <p style={{ color: '#64748b', marginTop: '4px', fontSize: '0.9rem', fontWeight: '500' }}>Platform kontrol panelini yöneten, yüksek yetkili yönetici ve denetçi hesapları.</p>
                </div>
                <button
                    onClick={handleOpenAdd}
                    className="hover:scale-105 active:scale-95 transition-all"
                    style={{ background: '#ff7a21', color: '#fff', padding: '12px 24px', borderRadius: '14px', border: 'none', fontSize: '0.9rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 10px 15px -3px rgba(255, 122, 33, 0.3)', cursor: 'pointer' }}
                >
                    <UserPlus size={18} strokeWidth={2.5} /> Yeni Yönetici Yetkilendir
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* Admin List Card */}
                    <div className="card" style={{ border: 'none', padding: 0, overflow: 'hidden', background: '#fff', borderRadius: '24px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)' }}>
                        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '900', margin: 0, color: '#111827', letterSpacing: '-0.02em' }}>Yetkili Personel Listesi</h3>
                            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '900', background: '#f8fafc', padding: '6px 14px', borderRadius: '10px', border: '1px solid #f1f5f9' }}>TOPLAM {admins.length} KAYIT</div>
                        </div>

                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead style={{ background: '#f9fafb' }}>
                                    <tr>
                                        <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.7rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Kimlik & İletişim</th>
                                        <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.7rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Rol / Erişim</th>
                                        <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.7rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Yetki Durumu</th>
                                        <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.7rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Kayıt Tarihi</th>
                                        <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: '0.7rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Yönetim</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan={5} style={{ padding: '80px', textAlign: 'center' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', color: '#64748b' }}>
                                                    <Loader2 size={48} className="animate-spin text-orange-500" />
                                                    <span style={{ fontWeight: '900', fontSize: '1rem', letterSpacing: '-0.02em' }}>ADMIN VERİTABANI TARANIYOR...</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : error ? (
                                        <tr>
                                            <td colSpan={5} style={{ padding: '60px', textAlign: 'center', color: '#f43f5e', fontWeight: '900', fontSize: '1.1rem' }}>{error}</td>
                                        </tr>
                                    ) : admins.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} style={{ padding: '80px', textAlign: 'center' }}>
                                                <div style={{ fontSize: '1.1rem', color: '#94a3b8', fontWeight: '900', letterSpacing: '-0.02em' }}>Henüz yetkilendirilmiş bir hesap bulunamadı.</div>
                                            </td>
                                        </tr>
                                    ) : admins.map((admin) => (
                                        <tr key={admin.id} style={{ borderBottom: '1px solid #f8fafc', transition: 'all 0.3s' }} className="group hover:bg-slate-50/50">
                                            <td style={{ padding: '20px 24px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                                    <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', fontWeight: '900', border: '2px solid #e2e8f0', boxShadow: '0 8px 16px -4px rgba(0,0,0,0.15)', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                                                        {admin.name?.charAt(0) || admin.email.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p style={{ margin: 0, fontWeight: '900', fontSize: '1rem', color: '#111827', letterSpacing: '-0.02em' }}>{admin.name || 'İsimsiz Yönetici'}</p>
                                                        <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#94a3b8', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                            <Mail size={12} strokeWidth={2.5} /> {admin.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ padding: '20px 24px' }}>
                                                <span style={{
                                                    fontSize: '0.75rem',
                                                    fontWeight: '900',
                                                    color: admin.role === 'SUPER_ADMIN' ? '#ff7a21' : '#1e293b',
                                                    background: admin.role === 'SUPER_ADMIN' ? '#fff7ed' : '#f1f5f9',
                                                    padding: '6px 12px',
                                                    borderRadius: '10px',
                                                    border: '1px solid currentColor',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.05em'
                                                }}>{admin.role}</span>
                                            </td>
                                            <td style={{ padding: '20px 24px' }}>
                                                <div
                                                    onClick={() => handleStatusToggle(admin)}
                                                    style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '10px',
                                                        color: admin.emailVerified ? '#10b981' : '#f59e0b',
                                                        cursor: 'pointer',
                                                        padding: '6px 12px',
                                                        background: admin.emailVerified ? '#ecfdf5' : '#fffbeb',
                                                        borderRadius: '10px',
                                                        border: '1px solid currentColor',
                                                        transition: 'all 0.2s'
                                                    }}
                                                    className="hover:scale-105"
                                                >
                                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: admin.emailVerified ? '#10b981' : '#f59e0b', boxShadow: admin.emailVerified ? '0 0 12px rgba(16, 185, 129, 0.4)' : 'none' }} className={admin.emailVerified ? "animate-pulse" : ""} />
                                                    <span style={{ fontSize: '0.75rem', fontWeight: '900', letterSpacing: '0.02em' }}>{admin.emailVerified ? 'TAM YETKİLİ' : 'DOĞRULAMA BEKLİYOR'}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '20px 24px', fontSize: '0.85rem', color: '#64748b', fontWeight: '800', letterSpacing: '-0.01em' }}>
                                                {new Date(admin.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </td>
                                            <td style={{ padding: '20px 24px' }}>
                                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                                    <button
                                                        onClick={() => handleOpenEdit(admin)}
                                                        style={{ width: '38px', height: '38px', borderRadius: '12px', background: '#fff', border: '1px solid #e2e8f0', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}
                                                        className="hover:border-orange-500 hover:text-orange-500 hover:shadow-md active:scale-95"
                                                        title="Hesap Ayarları"
                                                    >
                                                        <Key size={16} strokeWidth={2.5} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleResetPassword(admin)}
                                                        style={{ width: '38px', height: '38px', borderRadius: '12px', background: '#fff', border: '1px solid #e2e8f0', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}
                                                        className="hover:border-indigo-500 hover:text-indigo-500 hover:shadow-md active:scale-95"
                                                        title="Şifre Sıfırla"
                                                    >
                                                        <Lock size={16} strokeWidth={2.5} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(admin.id, admin.name)}
                                                        style={{ height: '38px', padding: '0 16px', borderRadius: '12px', background: '#fef2f2', border: '1px solid #fee2e2', color: '#f43f5e', fontWeight: '900', fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s' }}
                                                        className="hover:bg-red-500 hover:text-white hover:border-red-500 hover:shadow-md active:scale-95"
                                                    >
                                                        SİL
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', position: 'sticky', top: '2rem', height: 'fit-content' }}>
                    <div className="card" style={{ border: 'none', padding: '28px', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#fff', borderRadius: '24px', boxShadow: '0 30px 40px -15px rgba(0, 0, 0, 0.4)', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '120px', height: '120px', background: 'rgba(255,122,33,0.1)', filter: 'blur(50px)', borderRadius: '50%' }}></div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', position: 'relative', zIndex: 1 }}>
                            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <Shield size={24} color="#ff7a21" strokeWidth={2.5} />
                            </div>
                            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Güvenlik Protokolü</h3>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: '#94a3b8', lineHeight: '1.7', fontWeight: '500', position: 'relative', zIndex: 1 }}>
                            Sistemdeki yöneticilerin tamamı <span style={{ color: '#fff', fontWeight: '900' }}>2FA Politikası</span> ve <span style={{ color: '#fff', fontWeight: '900' }}>Donanımsal Kimlik</span> doğrulamasına tabidir. Platform üzerinde yapılan her admin işlemi audit log'una kaydedilir.
                        </p>
                        <button className="hover:scale-105 active:scale-95 transition-all" style={{ width: '100%', marginTop: '28px', padding: '14px', borderRadius: '14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.9rem', fontWeight: '900', cursor: 'pointer', position: 'relative', zIndex: 1, backdropFilter: 'blur(10px)' }}>
                            Güvenlik Loglarını İncele
                        </button>
                    </div>

                    <div className="card" style={{ border: 'none', padding: '28px', background: '#fff', borderRadius: '24px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)' }}>
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                            <div style={{ background: '#f5f3ff', padding: '12px', borderRadius: '14px', border: '1px solid #ede9fe' }}>
                                <Lock size={24} color="#6366f1" strokeWidth={2.5} />
                            </div>
                            <div>
                                <h4 style={{ margin: '0 0 8px 0', fontSize: '1rem', fontWeight: '900', color: '#111827', letterSpacing: '-0.02em' }}>Erişim Koruması</h4>
                                <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', lineHeight: '1.6', fontWeight: '500' }}>
                                    Tanımlanan yöneticiler e-posta onayını tamamlamadan sisteme erişim sağlayamazlar.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Admin Modal */}
            {isModalOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(15, 23, 42, 0.5)',
                    backdropFilter: 'blur(16px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '24px'
                }}>
                    <div className="card" style={{ width: '100%', maxWidth: '500px', padding: '40px', border: 'none', borderRadius: '32px', boxShadow: '0 40px 80px -20px rgba(0,0,0,0.4)', background: '#fff', position: 'relative', animation: 'modalFadeIn 0.3s ease-out' }}>
                        <button
                            onClick={() => setIsModalOpen(false)}
                            style={{ position: 'absolute', top: '24px', right: '24px', background: '#f1f5f9', border: 'none', padding: '8px', borderRadius: '12px', cursor: 'pointer', color: '#64748b' }}
                            className="hover:scale-110 active:scale-90 transition-all"
                        >
                            <X size={18} strokeWidth={3} />
                        </button>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                            <div style={{ background: '#fff7ed', padding: '14px', borderRadius: '16px', border: '1px solid #ffedd5' }}>
                                <UserPlus size={24} color="#ff7a21" strokeWidth={2.5} />
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '900', color: '#111827', letterSpacing: '-0.04em' }}>
                                    {editingAdmin ? 'Yetkilendirme Güncelle' : 'Personel Yetkilendir'}
                                </h3>
                                <p style={{ margin: '4px 0 0', fontSize: '0.9rem', color: '#64748b', fontWeight: '500' }}>Yönetici kimlik ve erişim bilgilerini yapılandırın.</p>
                            </div>
                        </div>

                        <form onSubmit={handleAction} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '12px', fontSize: '0.85rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Tam Personel İsmi</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Örn: Ahmet Yılmaz"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    style={{ width: '100%', padding: '18px 24px', borderRadius: '18px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '1.1rem', fontWeight: '800', transition: 'all 0.2s', background: '#f8fafc' }}
                                    className="focus:border-orange-500 focus:bg-white focus:shadow-lg"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '12px', fontSize: '0.85rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Kurumsal E-posta</label>
                                <input
                                    type="email"
                                    required
                                    placeholder="eposta@qrlamenu.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    style={{ width: '100%', padding: '18px 24px', borderRadius: '18px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '1.1rem', fontWeight: '800', transition: 'all 0.2s', background: '#f8fafc' }}
                                    className="focus:border-orange-500 focus:bg-white focus:shadow-lg"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '12px', fontSize: '0.85rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                    {editingAdmin ? 'Şifre Revizyonu (Opsiyonel)' : 'Panel Giriş Şifresi'}
                                </label>
                                <input
                                    type="password"
                                    required={!editingAdmin}
                                    placeholder={editingAdmin ? "Değiştirmek istemiyorsanız boş bırakın" : "En az 10 karakter önerilir"}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    style={{ width: '100%', padding: '18px 24px', borderRadius: '18px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '1.1rem', fontWeight: '800', transition: 'all 0.2s', background: '#f8fafc' }}
                                    className="focus:border-orange-500 focus:bg-white focus:shadow-lg"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '12px', fontSize: '0.85rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Yetki Seviyesi (Role)</label>
                                <div style={{ position: 'relative' }}>
                                    <select
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        style={{ width: '100%', padding: '18px 24px', borderRadius: '18px', border: '1px solid #e2e8f0', outline: 'none', background: '#f8fafc', fontSize: '1.1rem', fontWeight: '900', cursor: 'pointer', appearance: 'none', transition: 'all 0.2s' }}
                                        className="focus:border-orange-500 focus:bg-white focus:shadow-lg"
                                    >
                                        <option value="SUPER_ADMIN">SUPER_ADMIN (Tam Erişim / Root)</option>
                                        <option value="ADMIN">ADMIN (Standart Yönetici)</option>
                                        <option value="VIEWER">VIEWER (Sadece İzleme Modu)</option>
                                    </select>
                                    <div style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748b' }}>
                                        <MoreVertical size={20} strokeWidth={2.5} />
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '24px', marginTop: '40px' }}>
                                <button
                                    type="button"
                                    disabled={actionLoading}
                                    onClick={() => setIsModalOpen(false)}
                                    className="hover:bg-slate-50 transition-all active:scale-95"
                                    style={{ flex: 1, padding: '18px', borderRadius: '18px', border: '1px solid #e2e8f0', background: '#fff', fontWeight: '900', color: '#64748b', cursor: 'pointer', fontSize: '1.05rem', letterSpacing: '0.05em' }}
                                >
                                    VAZGEÇ
                                </button>
                                <button
                                    type="submit"
                                    disabled={actionLoading}
                                    className="hover:scale-105 active:scale-95 transition-all"
                                    style={{ flex: 1, padding: '18px', borderRadius: '18px', border: 'none', background: '#ff7a21', fontWeight: '900', color: '#fff', cursor: 'pointer', fontSize: '1.05rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', boxShadow: '0 10px 15px -3px rgba(255, 122, 33, 0.3)' }}
                                >
                                    {actionLoading ? <Loader2 size={24} className="animate-spin" /> : (editingAdmin ? 'GÜNCELLE' : 'HESABI TANIMLA')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
