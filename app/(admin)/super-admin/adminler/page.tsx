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
        <div className="px-6 py-8 w-full max-w-full">
            {/* Page Header Area */}
            <div className="mb-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                    <h1 className="text-[20px] font-semibold text-slate-900 tracking-tight leading-none uppercase">Sistem Yetkili Yönetimi</h1>
                    <p className="text-[13px] text-slate-500 mt-1 font-medium">Platform kontrol panelini yöneten, yüksek yetkili yönetici ve denetçi hesapları.</p>
                </div>
                <button
                    onClick={handleOpenAdd}
                    className="h-9 px-4 rounded-[6px] bg-slate-900 text-white font-semibold text-[13px] hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-sm w-full lg:w-auto justify-center"
                >
                    <UserPlus size={14} /> <span>Yeni Yetkili Tanımla</span>
                </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6 items-start">
                <div className="space-y-6">
                    {/* Admin List Card */}
                    <div className="bg-white rounded-[6px] shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                            <h3 className="text-[14px] font-semibold text-slate-900 tracking-tight flex items-center gap-2">
                                <Shield size={16} className="text-slate-500" />
                                Yetkili Personel Listesi
                            </h3>
                            <span className="text-[11px] font-bold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-[4px] uppercase tracking-widest">
                                Toplam {admins.length} Kayıt
                            </span>
                        </div>

                        <div className="overflow-x-auto custom-scrollbar">
                            <table className="w-full border-collapse text-left text-[13px]">
                                <thead className="bg-white border-b border-slate-200 text-slate-500">
                                    <tr>
                                        <th className="px-5 py-3 font-semibold w-[35%]">Kimlik & İletişim</th>
                                        <th className="px-5 py-3 font-semibold w-[20%] hidden md:table-cell">Rol / Erişim</th>
                                        <th className="px-5 py-3 font-semibold w-[15%]">Durum</th>
                                        <th className="px-5 py-3 font-semibold w-[15%] hidden lg:table-cell">Kayıt</th>
                                        <th className="px-5 py-3 font-semibold w-[15%] text-right">İşlem</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={5} className="py-20 text-center">
                                                <div className="flex flex-col items-center gap-3">
                                                    <Loader2 size={24} className="animate-spin text-indigo-500" />
                                                    <span className="font-medium text-slate-500 text-[13px]">Veriler yükleniyor...</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : error ? (
                                        <tr>
                                            <td colSpan={5} className="py-16 text-center">
                                                <div className="text-rose-500 font-medium text-[13px]">{error}</div>
                                            </td>
                                        </tr>
                                    ) : admins.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="py-20 text-center">
                                                <div className="flex flex-col items-center gap-3">
                                                    <div className="text-slate-400">
                                                        <Shield size={32} />
                                                    </div>
                                                    <h4 className="text-[14px] font-semibold text-slate-900">Kayıtlı Yetkili Bulunamadı</h4>
                                                    <span className="text-slate-500 font-medium text-[13px]">Yeni bir personel tanımlayabilirsiniz.</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : admins.map((admin) => (
                                        <tr key={admin.id} className="group hover:bg-slate-50 transition-colors">
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-[4px] bg-slate-900 border border-slate-800 flex items-center justify-center text-white text-[14px] font-bold shrink-0 transition-colors group-hover:bg-indigo-600 group-hover:border-indigo-500">
                                                        {admin.name?.charAt(0) || admin.email.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-semibold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">{admin.name || 'İsimsiz Yönetici'}</p>
                                                        <p className="text-[11px] text-slate-500 truncate mt-0.5">{admin.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 hidden md:table-cell">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-[4px] uppercase tracking-widest border ${admin.role === 'SUPER_ADMIN' ? 'bg-indigo-50 text-indigo-600 border-indigo-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                                                    {admin.role}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <button
                                                    onClick={() => handleStatusToggle(admin)}
                                                    className={`flex items-center gap-1.5 px-2 py-1 rounded-[4px] border transition-colors ${admin.emailVerified ? 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100'}`}
                                                >
                                                    <div className={`w-1.5 h-1.5 rounded-full ${admin.emailVerified ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                                                    <span className="text-[10px] font-bold uppercase tracking-widest">{admin.emailVerified ? 'Aktif' : 'Beklemede'}</span>
                                                </button>
                                            </td>
                                            <td className="px-5 py-4 hidden lg:table-cell">
                                                <div className="text-[12px] font-medium text-slate-500">
                                                    {new Date(admin.createdAt).toLocaleDateString('tr-TR')}
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-right">
                                                <div className="flex justify-end gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => handleOpenEdit(admin)}
                                                        className="w-8 h-8 flex items-center justify-center rounded-[4px] text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                                                        title="Hesap Ayarları"
                                                    >
                                                        <Key size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleResetPassword(admin)}
                                                        className="w-8 h-8 flex items-center justify-center rounded-[4px] text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                                                        title="Şifre Sıfırla"
                                                    >
                                                        <Lock size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(admin.id, admin.name)}
                                                        className="w-8 h-8 flex items-center justify-center rounded-[4px] text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                                        title="Sil"
                                                    >
                                                        <X size={14} />
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
                    <div className="bg-slate-900 rounded-[6px] p-6 text-white shadow-sm border border-slate-800 relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="bg-slate-800 p-2 rounded-[4px] border border-slate-700">
                                    <Shield size={16} className="text-indigo-400" />
                                </div>
                                <h3 className="text-[12px] font-bold uppercase tracking-widest text-slate-300">Güvenlik Merkezi</h3>
                            </div>

                            <p className="text-[12px] font-medium text-slate-400 leading-relaxed mb-6">
                                Sistemdeki yöneticilerin tamamı <span className="text-white font-semibold">2FA Politikası</span> ve <span className="text-white font-semibold">Denetim Günlüğü</span> doğrulamasına tabidir.
                            </p>

                            <button className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 h-9 rounded-[4px] text-[11px] font-bold uppercase tracking-widest transition-colors">
                                Logları İncele
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-[6px] p-6 shadow-sm border border-slate-200">
                        <div className="flex items-start gap-3">
                            <div className="bg-slate-50 p-2 rounded-[4px] border border-slate-100 shrink-0 mt-0.5">
                                <Lock size={16} className="text-slate-500" />
                            </div>
                            <div>
                                <h4 className="text-[13px] font-bold text-slate-900 uppercase tracking-widest mb-1">Erişim Koruması</h4>
                                <p className="text-[12px] text-slate-500 font-medium leading-relaxed">
                                    Tanımlanan yöneticiler e-posta onayı ve yetkilendirme sistemi eşleşmesi gerçekleşmeden panele giremezler.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Admin Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
                    <div className="bg-white w-full max-w-[500px] rounded-[8px] p-6 shadow-xl relative animate-in zoom-in-95 duration-200 border border-slate-200">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 p-2 rounded-[4px] text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="mb-6">
                            <h3 className="text-[18px] font-bold text-slate-900 tracking-tight">
                                {editingAdmin ? 'Yetki Güncelle' : 'Personel Tanımla'}
                            </h3>
                            <p className="text-[13px] text-slate-500 mt-1 font-medium">Yönetici kimlik ve erişim düzeyini yapılandırın.</p>
                        </div>

                        <form onSubmit={handleAction} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Tam Personel İsmi</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Örn: Ahmet Yılmaz"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 rounded-[6px] border border-slate-200 bg-white text-[13px] font-medium text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Kurumsal E-posta</label>
                                <input
                                    type="email"
                                    required
                                    placeholder="eposta@sirket.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-3 py-2 rounded-[6px] border border-slate-200 bg-white text-[13px] font-medium text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                                    {editingAdmin ? 'Şifre Değişimi (Opsiyonel)' : 'Panele Giriş Şifresi'}
                                </label>
                                <input
                                    type="password"
                                    required={!editingAdmin}
                                    placeholder={editingAdmin ? "Değiştirmeyecekseniz boş bırakın" : "En az 8 karakter..."}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full px-3 py-2 rounded-[6px] border border-slate-200 bg-white text-[13px] font-medium text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Yetki Seviyesi</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full px-3 py-2 rounded-[6px] border border-slate-200 bg-white text-[13px] font-medium text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                                >
                                    <option value="SUPER_ADMIN">SUPER_ADMIN (Tam Erişim)</option>
                                    <option value="ADMIN">ADMIN (Standart Panel)</option>
                                    <option value="VIEWER">VIEWER (Sadece İzleme)</option>
                                </select>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    disabled={actionLoading}
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-2 rounded-[6px] border border-slate-200 text-slate-700 font-semibold text-[13px] hover:bg-slate-50 transition-colors"
                                >
                                    İptal
                                </button>
                                <button
                                    type="submit"
                                    disabled={actionLoading}
                                    className="flex-1 bg-slate-900 text-white py-2 rounded-[6px] font-semibold text-[13px] hover:bg-slate-800 disabled:opacity-70 transition-colors flex items-center justify-center gap-2"
                                >
                                    {actionLoading ? <Loader2 className="animate-spin" size={16} /> : null}
                                    {actionLoading ? 'İşleniyor...' : (editingAdmin ? 'Kaydet' : 'Tanımla')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
