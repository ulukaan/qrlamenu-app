"use client";
import React, { useState, useEffect } from 'react';
import { Settings, Save, Mail, Globe, Shield, Bell, Loader2, CheckCircle2 } from 'lucide-react';

export default function SystemSettingsPage() {
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                setLoading(true);
                const res = await fetch('/api/admin/settings');
                if (!res.ok) throw new Error('Ayarlar yüklenemedi');
                const data = await res.json();
                setSettings(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSaving(true);
            setMessage(null);
            const res = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });
            if (res.ok) {
                setMessage({ type: 'success', text: 'Ayarlar başarıyla kaydedildi.' });
            } else {
                throw new Error('Kaydedilemedi');
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Ayarlar kaydedilirken bir hata oluştu.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
            <Loader2 size={56} className="animate-spin text-[#ff7a21]" />
            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Sistem Konfigürasyonu Yükleniyor...</p>
        </div>
    );

    if (!settings) return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-8 text-center p-12 bg-white rounded-[40px] border-2 border-dashed border-gray-100">
            <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mb-2 shadow-sm border border-rose-100">
                <Shield size={32} strokeWidth={2.5} />
            </div>
            <div>
                <h3 className="text-xl font-black text-gray-900 mb-2 uppercase tracking-tight">Bağlantı Hatası</h3>
                <p className="text-gray-400 font-bold max-w-xs leading-relaxed italic">Sistem ayarları şu anda sunucudan çekilemiyor.</p>
            </div>
            <button
                onClick={() => window.location.reload()}
                className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-gray-200 hover:bg-[#ff7a21] hover:shadow-orange-500/20 active:scale-95 transition-all"
            >
                Yeniden Dene
            </button>
        </div>
    );

    return (
        <div className="p-8 md:p-12 lg:p-16 w-full max-w-full">
            {/* Page Header Area */}
            <header className="mb-12 flex flex-col xl:flex-row justify-between items-start xl:items-end gap-8">
                <div className="max-w-3xl">
                    <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight leading-tight">
                        Global Sistem Ayarları
                    </h2>
                    <p className="text-gray-500 mt-3 text-lg font-medium leading-relaxed">
                        Platform genelini ilgilendiren teknik, iletişim ve güvenlik yapılandırmalarını gerçek zamanlı yönetin.
                    </p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full xl:w-auto bg-[#ff7a21] text-white px-10 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 shadow-xl shadow-orange-500/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70 uppercase tracking-widest"
                >
                    {saving ? <Loader2 size={20} className="animate-spin" strokeWidth={3} /> : <Save size={20} strokeWidth={3} />}
                    {saving ? 'Güncelleniyor...' : 'Konfigürasyonu Kaydet'}
                </button>
            </header>

            {message && (
                <div className={`p-8 rounded-[32px] mb-12 flex items-center gap-6 font-black transition-all animate-in fade-in slide-in-from-top-6 duration-500 border-2 shadow-sm ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-emerald-500/10' : 'bg-rose-50 text-rose-600 border-rose-100 shadow-rose-500/10'}`}>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${message.type === 'success' ? 'bg-emerald-100' : 'bg-rose-100'}`}>
                        {message.type === 'success' ? <CheckCircle2 size={24} strokeWidth={3} /> : <Settings size={24} strokeWidth={3} />}
                    </div>
                    <span className="text-lg tracking-tight leading-none">{message.text}</span>
                </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-12 items-start">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Platform Kimliği & İletişim */}
                    <div className="bg-white rounded-[40px] p-10 shadow-sm border-2 border-gray-50 transition-all hover:shadow-2xl hover:shadow-gray-200/40 group">
                        <div className="flex items-center gap-5 mb-10">
                            <div className="bg-orange-50 text-[#ff7a21] p-4 rounded-2xl border-2 border-orange-100 group-hover:rotate-12 transition-transform shadow-sm shadow-orange-500/5">
                                <Globe size={24} strokeWidth={3} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-gray-900 tracking-tight">Platform Kimliği</h3>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-[0.2em] mt-1.5">Global Marka & İletişim</p>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="flex flex-col gap-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] ml-2">Platform Başlığı</label>
                                <input
                                    type="text"
                                    value={settings.platformTitle}
                                    onChange={(e) => setSettings({ ...settings, platformTitle: e.target.value })}
                                    className="w-full px-7 py-4.5 rounded-2xl border-2 border-gray-50 bg-gray-50 text-base font-black text-gray-900 focus:bg-white focus:border-[#ff7a21] focus:ring-4 focus:ring-orange-500/5 outline-none transition-all placeholder:text-gray-300 shadow-sm"
                                    placeholder="Örn: QRLA Menü SaaS"
                                />
                            </div>
                            <div className="flex flex-col gap-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] ml-2">Destek E-Posta</label>
                                <div className="relative group/input">
                                    <Mail className="absolute left-7 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within/input:text-[#ff7a21] transition-colors" size={20} strokeWidth={2.5} />
                                    <input
                                        type="email"
                                        value={settings.contactEmail}
                                        onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                                        className="w-full pl-16 pr-7 py-4.5 rounded-2xl border-2 border-gray-50 bg-gray-50 text-base font-black text-gray-900 focus:bg-white focus:border-[#ff7a21] focus:ring-4 focus:ring-orange-500/5 outline-none transition-all placeholder:text-gray-300 shadow-sm"
                                        placeholder="support@domain.com"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Dil & Bölge Ayarları */}
                    <div className="bg-white rounded-[40px] p-10 shadow-sm border-2 border-gray-50 transition-all hover:shadow-2xl hover:shadow-gray-200/40 group">
                        <div className="flex items-center gap-5 mb-10">
                            <div className="bg-emerald-50 text-emerald-500 p-4 rounded-2xl border-2 border-emerald-100 group-hover:rotate-12 transition-transform shadow-sm shadow-emerald-500/5">
                                <Globe size={24} strokeWidth={3} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-gray-900 tracking-tight">Yerelleştirme</h3>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-[0.2em] mt-1.5">Bölgesel Standartlar</p>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="flex flex-col gap-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] ml-2">Sistem Para Birimi</label>
                                <div className="relative">
                                    <select
                                        value={settings.currency}
                                        onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                                        className="w-full px-7 py-4.5 rounded-2xl border-2 border-gray-50 bg-gray-50 text-base font-black text-gray-900 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all appearance-none cursor-pointer shadow-sm"
                                    >
                                        <option value="USD">USD - Amerikan Doları</option>
                                        <option value="EUR">EUR - Euro</option>
                                        <option value="TRY">TRY - Türk Lirası</option>
                                    </select>
                                    <div className="absolute right-7 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SMTP Settings */}
                    <div className="bg-white rounded-[40px] p-10 shadow-sm border-2 border-gray-50 transition-all hover:shadow-2xl hover:shadow-gray-200/40 group md:col-span-2">
                        <div className="flex items-center gap-5 mb-10">
                            <div className="bg-blue-50 text-blue-500 p-4 rounded-2xl border-2 border-blue-100 group-hover:rotate-12 transition-transform shadow-sm shadow-blue-500/5">
                                <Mail size={24} strokeWidth={3} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-gray-900 tracking-tight">SMTP Servisi</h3>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-[0.2em] mt-1.5">E-posta Altyapısı</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 flex flex-col gap-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] ml-2">SMTP Host</label>
                                <input
                                    type="text"
                                    value={settings.smtpHost}
                                    onChange={(e) => setSettings({ ...settings, smtpHost: e.target.value })}
                                    className="w-full px-7 py-4.5 rounded-2xl border-2 border-gray-50 bg-gray-50 text-base font-black text-gray-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all shadow-sm"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="flex flex-col gap-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] ml-2">Port</label>
                                    <input
                                        type="number"
                                        value={settings.smtpPort}
                                        onChange={(e) => setSettings({ ...settings, smtpPort: parseInt(e.target.value) })}
                                        className="w-full px-7 py-4.5 rounded-2xl border-2 border-gray-50 bg-gray-50 text-base font-black text-gray-900 focus:bg-white focus:border-blue-500 outline-none transition-all shadow-sm"
                                    />
                                </div>
                                <div className="flex flex-col gap-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] ml-2">Güvenlik</label>
                                    <div className="relative">
                                        <select
                                            value={settings.smtpSecurity}
                                            onChange={(e) => setSettings({ ...settings, smtpSecurity: e.target.value })}
                                            className="w-full px-7 py-4.5 rounded-2xl border-2 border-gray-50 bg-gray-50 text-sm font-black text-gray-900 outline-none appearance-none cursor-pointer focus:bg-white focus:border-blue-500 transition-all shadow-sm"
                                        >
                                            <option value="TLS">TLS</option>
                                            <option value="SSL">SSL</option>
                                            <option value="NONE">YOK</option>
                                        </select>
                                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* System Toggles */}
                    <div className="bg-white rounded-[40px] p-10 shadow-sm border-2 border-gray-50 transition-all hover:shadow-2xl hover:shadow-gray-200/40 group md:col-span-2">
                        <div className="flex items-center gap-5 mb-10">
                            <div className="bg-rose-50 text-rose-500 p-4 rounded-2xl border-2 border-rose-100 group-hover:rotate-12 transition-transform shadow-sm shadow-rose-500/5">
                                <Shield size={24} strokeWidth={3} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-gray-900 tracking-tight">Kritik Kontroller</h3>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-[0.2em] mt-1.5">Sistem Güvenlik & Erişim</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <button
                                onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
                                className={`flex items-center justify-between p-8 rounded-[32px] border-4 transition-all hover:scale-[1.02] active:scale-95 group/btn ${settings.maintenanceMode ? 'bg-rose-50 border-rose-200 shadow-2xl shadow-rose-500/10' : 'bg-gray-50 border-transparent hover:border-rose-100'}`}
                            >
                                <div className="text-left">
                                    <span className={`text-lg font-black block transition-colors ${settings.maintenanceMode ? 'text-rose-600' : 'text-gray-900'}`}>Bakım Modu</span>
                                    <span className="text-[10px] text-gray-400 font-black tracking-widest uppercase mt-1 block">Erişimi Geçici Olarak Kısıtla</span>
                                </div>
                                <div className={`w-14 h-8 rounded-full relative transition-all duration-500 ${settings.maintenanceMode ? 'bg-rose-500' : 'bg-gray-200'}`}>
                                    <div className={`w-6 h-6 rounded-full bg-white absolute top-1 transition-all duration-500 shadow-md ${settings.maintenanceMode ? 'left-7' : 'left-1'}`} />
                                </div>
                            </button>

                            <button
                                onClick={() => setSettings({ ...settings, RegistrationOpen: !settings.RegistrationOpen })}
                                className={`flex items-center justify-between p-8 rounded-[32px] border-4 transition-all hover:scale-[1.02] active:scale-95 group/btn ${settings.RegistrationOpen ? 'bg-emerald-50 border-emerald-200 shadow-2xl shadow-emerald-500/10' : 'bg-gray-50 border-transparent hover:border-emerald-100'}`}
                            >
                                <div className="text-left">
                                    <span className={`text-lg font-black block transition-colors ${settings.RegistrationOpen ? 'text-emerald-600' : 'text-gray-900'}`}>Yeni Kayıtlar</span>
                                    <span className="text-[10px] text-gray-400 font-black tracking-widest uppercase mt-1 block">Abonelik Satışını Yönet</span>
                                </div>
                                <div className={`w-14 h-8 rounded-full relative transition-all duration-500 ${settings.RegistrationOpen ? 'bg-emerald-500' : 'bg-gray-200'}`}>
                                    <div className={`w-6 h-6 rounded-full bg-white absolute top-1 transition-all duration-500 shadow-md ${settings.RegistrationOpen ? 'left-7' : 'left-1'}`} />
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Backup Widget */}
                <aside className="xl:sticky xl:top-8 flex flex-col gap-10">
                    <div className="bg-[#0f172a] rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden group border border-white/5">
                        <div className="absolute -right-20 -top-20 w-56 h-56 bg-orange-500/10 rounded-full blur-[60px] group-hover:scale-150 transition-transform duration-1000"></div>
                        <div className="flex items-center gap-5 mb-10 relative">
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-[#ff7a21] shadow-xl shadow-orange-500/5 group-hover:rotate-6 transition-transform">
                                <Save size={28} strokeWidth={3} />
                            </div>
                            <div>
                                <h4 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Sistem Yedekleri</h4>
                                <div className="flex items-center gap-2 mt-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]"></div>
                                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">KORUMA AKTİF</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8 relative">
                            <div className="bg-white/5 p-6 rounded-[32px] border border-white/5 hover:bg-white/10 transition-colors">
                                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Son Senkronizasyon</div>
                                <div className="text-2xl font-black text-white tracking-tight">Bugün, 04:00 AM</div>
                            </div>

                            <div className="bg-orange-500/5 rounded-[32px] p-6 border-l-4 border-[#ff7a21]">
                                <p className="text-[11px] text-slate-400 font-bold leading-relaxed italic">
                                    <span className="text-white not-italic block mb-2 text-xs font-black uppercase tracking-widest">Altyapı Güvenliği:</span>
                                    Tüm veriler <span className="text-[#ff7a21]">AES-256</span> standartlarında şifrelenerek AWS S3 (FRA1) üzerine anlık yedeklenmektedir.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[40px] p-10 shadow-sm border-2 border-gray-50 border-l-[6px] border-l-[#ff7a21] group hover:shadow-2xl hover:shadow-orange-500/5 transition-all">
                        <div className="flex gap-6 items-start">
                            <div className="bg-orange-50 p-4 rounded-2xl shrink-0 border-2 border-orange-100 group-hover:rotate-12 transition-transform shadow-sm">
                                <Shield size={28} className="text-[#ff7a21]" strokeWidth={3} />
                            </div>
                            <div>
                                <h4 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-3">Teknik Not</h4>
                                <p className="text-sm text-gray-500 leading-relaxed font-bold italic">
                                    Bu penceredeki değişiklikler <span className="text-[#ff7a21] underline decoration-orange-200 underline-offset-4 font-black">global ölçekte</span> tüm işletme ve kullanıcı süreçlerini etkiler.
                                </p>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}

