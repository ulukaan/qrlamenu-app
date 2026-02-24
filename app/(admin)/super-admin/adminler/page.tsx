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
            const url = '/api/admin/admins';
            const method = editingAdmin ? 'PATCH' : 'POST';

            const payload: any = {
                name: formData.name,
                email: formData.email,
                role: formData.role
            };

            if (editingAdmin) {
                payload.id = editingAdmin.id;
            }

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
            const res = await fetch(`/api/admin/admins?id=${id}`, { method: 'DELETE' });
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
            const res = await fetch(`/api/admin/admins`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: admin.id, emailVerified: !admin.emailVerified })
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
            const res = await fetch(`/api/admin/admins`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: admin.id, password: newPassword })
            });
            if (res.ok) alert('Şifre başarıyla güncellendi.');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="p-4 md:p-8 lg:p-12 w-full max-w-full">
            {/* Page Header Area */}
            <div className="mb-8 md:mb-12 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
                <div className="max-w-3xl">
                    <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Sistem Yetkili Yönetimi</h2>
                    <p className="text-gray-500 mt-1 text-sm md:text-base font-medium">Platform kontrol panelini yöneten, yüksek yetkili yönetici ve denetçi hesapları.</p>
                </div>
                <button
                    onClick={handleOpenAdd}
                    className="w-full lg:w-auto bg-slate-900 hover:bg-[#ff7a21] text-white px-8 py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-3 transition-all shadow-xl shadow-slate-900/10 hover:shadow-orange-500/20 active:scale-95"
                >
                    <UserPlus size={18} strokeWidth={2.5} /> Yeni Yetkili Tanımla
                </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-8 items-start">
                <div className="space-y-6">
                    {/* Admin List Card */}
                    <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-8 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/50 backdrop-blur-sm">
                            <div className="flex items-center gap-4">
                                <h3 className="text-lg font-black text-gray-900 tracking-tight">Yetkili Personel Listesi</h3>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-xl border border-slate-100">
                                    TOPLAM {admins.length} KAYIT
                                </span>
                            </div>
                        </div>

                        <div className="overflow-x-auto custom-scrollbar">
                            <table className="w-full border-collapse">
                                <thead className="bg-slate-50/50">
                                    <tr>
                                        <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Kimlik & İletişim</th>
                                        <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] hidden md:table-cell">Rol / Erişim</th>
                                        <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Durum</th>
                                        <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] hidden lg:table-cell">Kayıt</th>
                                        <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">İşlem</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={5} className="py-32 text-center">
                                                <div className="flex flex-col items-center gap-4">
                                                    <Loader2 size={48} className="animate-spin text-[#ff7a21]" />
                                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Sistem Veritabanı Taranıyor...</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : error ? (
                                        <tr>
                                            <td colSpan={5} className="p-12 text-center">
                                                <div className="bg-rose-50 p-6 rounded-3xl border border-rose-100 text-rose-500 font-black text-sm">{error}</div>
                                            </td>
                                        </tr>
                                    ) : admins.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="py-32 text-center">
                                                <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-200">
                                                    <Shield size={40} />
                                                </div>
                                                <h4 className="text-lg font-black text-gray-900 mb-2">Henüz Personel Bulunmuyor</h4>
                                                <p className="text-sm font-bold text-slate-400 max-w-[280px] mx-auto leading-relaxed italic">Platform yönetimini paylaştıracak ekip üyelerini tanımlayın.</p>
                                            </td>
                                        </tr>
                                    ) : admins.map((admin) => (
                                        <tr key={admin.id} className="group hover:bg-slate-50/50 transition-all border-b border-slate-50 last:border-0">
                                            <td className="px-8 py-7">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-14 h-14 rounded-2xl bg-slate-900 border-2 border-white flex items-center justify-center text-white text-lg font-black shrink-0 shadow-xl shadow-slate-900/10 group-hover:scale-110 group-hover:bg-[#ff7a21] transition-all duration-500">
                                                        {admin.name?.charAt(0) || admin.email.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-black text-gray-900 truncate tracking-tight text-base group-hover:text-[#ff7a21] transition-colors">{admin.name || 'İsimsiz Yönetici'}</p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <div className="bg-orange-100/50 p-1 rounded-md">
                                                                <Mail size={12} className="text-[#ff7a21]" />
                                                            </div>
                                                            <p className="text-xs font-bold text-slate-400 truncate">{admin.email}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-7 hidden md:table-cell">
                                                <span className={`text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest border shadow-sm ${admin.role === 'SUPER_ADMIN' ? 'bg-orange-50 text-orange-500 border-orange-100' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
                                                    {admin.role}
                                                </span>
                                            </td>
                                            <td className="px-8 py-7">
                                                <button
                                                    onClick={() => handleStatusToggle(admin)}
                                                    className={`group/status flex items-center gap-2.5 px-4 py-2 rounded-xl border-2 transition-all hover:scale-[1.02] active:scale-95 ${admin.emailVerified ? 'bg-emerald-50 text-emerald-500 border-emerald-50' : 'bg-amber-50 text-amber-500 border-amber-50'}`}
                                                >
                                                    <div className={`w-2 h-2 rounded-full ${admin.emailVerified ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-500'}`}></div>
                                                    <span className="text-[10px] font-black uppercase tracking-widest">{admin.emailVerified ? 'AKTİF' : 'BEKLEMEDE'}</span>
                                                </button>
                                            </td>
                                            <td className="px-8 py-7 hidden lg:table-cell">
                                                <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
                                                    {new Date(admin.createdAt).toLocaleDateString('tr-TR')}
                                                </div>
                                            </td>
                                            <td className="px-8 py-7 text-right">
                                                <div className="flex justify-end gap-2.5 opacity-0 group-hover:opacity-100 transition-all">
                                                    <button
                                                        onClick={() => handleOpenEdit(admin)}
                                                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-[#ff7a21] hover:border-orange-100 hover:shadow-lg hover:shadow-orange-500/10 transition-all active:scale-90"
                                                        title="Hesap Ayarları"
                                                    >
                                                        <Key size={16} strokeWidth={2.5} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleResetPassword(admin)}
                                                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-indigo-500 hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-500/10 transition-all active:scale-90"
                                                        title="Şifre Sıfırla"
                                                    >
                                                        <Lock size={16} strokeWidth={2.5} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(admin.id, admin.name)}
                                                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-rose-50 border border-rose-100 text-rose-300 hover:text-white hover:bg-rose-500 hover:border-rose-500 hover:shadow-lg hover:shadow-rose-500/20 transition-all active:scale-90"
                                                        title="Sil"
                                                    >
                                                        <X size={16} strokeWidth={3} />
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

                {/* Right Sidebar */}
                <div className="xl:sticky xl:top-8 flex flex-col gap-6">
                    <div className="bg-slate-900 rounded-[40px] p-8 text-white shadow-2xl shadow-slate-900/20 relative overflow-hidden group">
                        <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-[#ff7a21]/10 rounded-full blur-3xl transition-transform duration-1000 group-hover:scale-110"></div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="bg-orange-500/10 p-3 rounded-2xl border border-orange-500/10">
                                    <Shield size={24} className="text-[#ff7a21]" strokeWidth={3} />
                                </div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Güvenlik Merkezi</h3>
                            </div>

                            <p className="text-sm font-medium text-slate-400 leading-relaxed mb-8">
                                Sistemdeki yöneticilerin tamamı <span className="text-white font-black italic">2FA Politikası</span> ve <span className="text-white font-black italic">Denetim Günlüğü</span> doğrulamasına tabidir. Platform üzerindeki her işlem izlenmektedir.
                            </p>

                            <button className="w-full bg-white/5 hover:bg-white/10 border border-white/5 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all backdrop-blur-sm">
                                Güvenlik Loglarını İncele
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-100">
                        <div className="flex items-start gap-4">
                            <div className="bg-indigo-50 p-3 rounded-2xl border border-indigo-100">
                                <Lock size={20} className="text-indigo-500" strokeWidth={2.5} />
                            </div>
                            <div>
                                <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-2">Erişim Koruması</h4>
                                <p className="text-[11px] text-slate-400 font-bold leading-relaxed italic">
                                    Tanımlanan yöneticiler e-posta onayını tamamlamadan ve merkezi veritabanı eşleşmesi gerçekleşmeden panele erişim sağlayamazlar.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Admin Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-2xl flex items-center justify-center z-[1000] p-4 md:p-8">
                    <div className="bg-white w-full max-w-lg rounded-[48px] p-8 md:p-12 shadow-2xl relative animate-in fade-in zoom-in duration-300 overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff7a21]/5 rounded-bl-full -z-0"></div>

                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-8 right-8 p-3 rounded-2xl bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all active:scale-95"
                        >
                            <X size={20} strokeWidth={3} />
                        </button>

                        <div className="relative z-10 mb-10">
                            <div className="bg-orange-50 w-16 h-16 rounded-[24px] flex items-center justify-center mb-6 border-2 border-orange-100">
                                <UserPlus size={32} className="text-[#ff7a21]" strokeWidth={2.5} />
                            </div>
                            <h3 className="text-3xl font-black text-gray-900 tracking-tight">
                                {editingAdmin ? 'Yetki Güncelle' : 'Personel Tanımla'}
                            </h3>
                            <p className="text-gray-400 mt-2 font-bold italic">Yönetici kimlik ve erişim düzeyini yapılandırın.</p>
                        </div>

                        <form onSubmit={handleAction} className="space-y-8 relative z-10">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tam Personel İsmi</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Örn: Ahmet Yılmaz"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 bg-slate-50 text-sm font-black text-gray-900 focus:bg-white focus:border-[#ff7a21] outline-none transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Kurumsal E-posta</label>
                                <input
                                    type="email"
                                    required
                                    placeholder="eposta@qrlamenu.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 bg-slate-50 text-sm font-black text-gray-900 focus:bg-white focus:border-[#ff7a21] outline-none transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                    {editingAdmin ? 'Şifre Revizyonu (Opsiyonel)' : 'Panel Giriş Şifresi'}
                                </label>
                                <input
                                    type="password"
                                    required={!editingAdmin}
                                    placeholder={editingAdmin ? "Değiştirmek istemiyorsanız boş bırakın" : "En az 10 karakter..."}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 bg-slate-50 text-sm font-black text-gray-900 focus:bg-white focus:border-[#ff7a21] outline-none transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Yetki Seviyesi</label>
                                <div className="relative group">
                                    <select
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 bg-slate-50 text-sm font-black text-gray-900 focus:bg-white focus:border-[#ff7a21] outline-none transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="SUPER_ADMIN">SUPER_ADMIN (Tam Erişim)</option>
                                        <option value="ADMIN">ADMIN (Standart Panel)</option>
                                        <option value="VIEWER">VIEWER (Sadece İzleme)</option>
                                    </select>
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-focus-within:text-[#ff7a21]">
                                        <Shield size={20} />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 flex flex-col sm:flex-row gap-4">
                                <button
                                    type="button"
                                    disabled={actionLoading}
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-8 py-4 rounded-2xl bg-slate-50 text-slate-400 text-xs font-black uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-95"
                                >
                                    Vazgeç
                                </button>
                                <button
                                    type="submit"
                                    disabled={actionLoading}
                                    className="flex-[1.5] px-8 py-4 rounded-2xl bg-slate-900 text-white text-xs font-black uppercase tracking-widest shadow-xl shadow-slate-900/20 hover:bg-[#ff7a21] hover:shadow-orange-500/20 transition-all active:scale-90 flex items-center justify-center gap-3"
                                >
                                    {actionLoading ? <Loader2 className="animate-spin" size={20} /> : (editingAdmin ? 'Güncelle' : 'Tanımla')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
