"use client";
import React from 'react';
import { Shield, Lock, Key, Smartphone, Globe, AlertTriangle, Clock, Loader2 } from 'lucide-react';

export default function SecuritySettingsPage() {
    const [settings, setSettings] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [saving, setSaving] = React.useState(false);

    React.useEffect(() => {
        const fetchSettings = async () => {
            try {
                setLoading(true);
                const res = await fetch('/api/admin/security');
                if (!res.ok) throw new Error('Güvenlik ayarları yüklenemedi');
                const data = await res.json();
                setSettings(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const toggleSetting = async (key: string) => {
        try {
            setSaving(true);
            const newSettings = { ...settings, [key]: !settings[key] };
            const res = await fetch('/api/admin/security', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newSettings)
            });
            if (res.ok) {
                setSettings(newSettings);
            }
        } catch (err) {
            console.error('Update Setting Error:', err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div style={{ padding: '40px', textAlign: 'center' }}>
            <Loader2 size={32} className="animate-spin text-gray-400" style={{ margin: '0 auto' }} />
        </div>
    );

    return (
        <div className="p-4 md:p-8 lg:p-12 w-full max-w-full">
            {/* Page Header Area */}
            <div className="mb-8 md:mb-12 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
                <div className="max-w-3xl">
                    <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Güvenlik & Erişim Kontrolü</h2>
                    <p className="text-gray-500 mt-1 text-sm md:text-base font-medium">Platform genelinde kimlik doğrulama, IP kısıtlamaları ve siber güvenlik politikalarını yapılandırın.</p>
                </div>
                <div className="flex items-center gap-4 w-full lg:w-auto">
                    <div className="flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-emerald-500 text-white text-xs font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 border border-emerald-400/20">
                        <Shield size={18} strokeWidth={2.5} /> SİSTEM DURUMU: GÜVENLİ
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-8 items-start">
                <div className="space-y-8">
                    {/* General Security Layers */}
                    <div className="bg-white rounded-[40px] p-8 md:p-10 shadow-sm border border-slate-100">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="bg-sky-50 text-sky-500 p-3.5 rounded-2xl border-2 border-sky-100/50">
                                <Lock size={28} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-gray-900 tracking-tight">Zırhlı Erişim Katmanları</h3>
                                <p className="text-sm font-bold text-slate-400 italic">Aktif güvenlik duvarları ve doğrulama metodları.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {[
                                { id: 'twoFA', title: 'Çift Faktörlü Doğrulama (2FA)', desc: 'Tüm admin ve süper admin hesapları için zorunlu kılındığında oturum güvenliğini maksimize eder.', icon: <Smartphone size={22} />, active: settings?.twoFA },
                                { id: 'ipWhitelist', title: 'IP Beyaz Liste Filtresi', desc: 'Sadece yetkilendirilmiş statik IP adreslerinden gelen talepleri kabul ederek dış saldırıları engeller.', icon: <Globe size={22} />, active: settings?.ipWhitelist },
                                { id: 'sessionTimeout', title: 'Akıllı Oturum Yönetimi', desc: `İnaktiflik durumunda ${settings?.sessionTimeout || 30} dakika sonra oturumu otomatik olarak sonlandırır.`, icon: <Clock size={22} />, active: true, persistent: true },
                            ].map((s, i) => (
                                <div key={i} className={`flex flex-col sm:flex-row sm:items-center gap-6 p-6 rounded-[32px] border-2 transition-all duration-500 ${s.active ? 'bg-slate-50 border-slate-100 shadow-sm' : 'bg-white border-slate-50/50 opacity-60'} ${saving ? 'animate-pulse pointer-events-none' : ''}`}>
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500 ${s.active ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20 rotate-0' : 'bg-slate-100 text-slate-400 rotate-3'}`}>
                                        {React.cloneElement(s.icon as React.ReactElement, { strokeWidth: 2.5 })}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-black text-gray-900 text-lg tracking-tight">{s.title}</p>
                                        <p className="text-xs font-bold text-slate-400 mt-1 leading-relaxed max-w-xl">{s.desc}</p>
                                    </div>
                                    {!s.persistent && (
                                        <button
                                            onClick={() => toggleSetting(s.id)}
                                            className={`relative w-14 h-8 rounded-full transition-all duration-500 focus:outline-none ${s.active ? 'bg-[#ea580c] shadow-lg shadow-orange-500/30' : 'bg-slate-200'}`}
                                        >
                                            <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform duration-500 shadow-sm ${s.active ? 'translate-x-6' : 'translate-x-0'}`} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Password Policy */}
                    <div className="bg-white rounded-[40px] p-8 md:p-10 shadow-sm border border-slate-100">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="bg-indigo-50 text-indigo-500 p-3.5 rounded-2xl border-2 border-indigo-100/50">
                                <Key size={28} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-gray-900 tracking-tight">Karmaşıklık Politikası</h3>
                                <p className="text-sm font-bold text-slate-400 italic">Şifre kriterleri ve rotasyon kuralları.</p>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="p-8 rounded-[32px] bg-slate-50 border-2 border-slate-100">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                                    <span className="text-sm font-black text-gray-900 tracking-tight">Minimum Karakter Uzunluğu</span>
                                    <span className="text-2xl font-black text-[#ea580c] tabular-nums">{settings?.minPasswordLength || 12} Bit/Karakter</span>
                                </div>
                                <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-[#ea580c] to-orange-400 shadow-[0_0_15px_rgba(255,122,33,0.3)] w-3/4 animate-pulse"></div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                                    <div className="flex items-center gap-3 px-6 py-4 bg-white rounded-2xl border-2 border-slate-100">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
                                        <span className="text-xs font-black text-slate-600 uppercase tracking-widest">Büyük/Küçük Harf</span>
                                    </div>
                                    <div className="flex items-center gap-3 px-6 py-4 bg-white rounded-2xl border-2 border-slate-100">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
                                        <span className="text-xs font-black text-slate-600 uppercase tracking-widest">Özel Karakterler</span>
                                    </div>
                                </div>
                            </div>
                            <button className="px-10 py-4 rounded-2xl bg-slate-900 text-white text-xs font-black uppercase tracking-widest shadow-xl shadow-slate-900/20 hover:bg-[#ea580c] transition-all active:scale-95">
                                GÜVENLİK POLİTİKASINI GÜNCELLE
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="xl:sticky xl:top-8 flex flex-col gap-6">
                    {/* Critical Actions */}
                    <div className="bg-rose-950 rounded-[40px] p-8 text-white shadow-2xl shadow-rose-900/20 relative overflow-hidden group">
                        <div className="absolute -right-10 -top-10 w-40 h-40 bg-rose-500/10 rounded-full blur-3xl transition-transform duration-1000 group-hover:scale-125"></div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="bg-rose-500/10 p-3 rounded-2xl border border-rose-500/20">
                                    <AlertTriangle size={24} className="text-rose-500" strokeWidth={3} />
                                </div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-300">Kritik Müdahale</h3>
                            </div>

                            <p className="text-sm font-medium text-rose-200/60 leading-relaxed mb-10 italic">
                                Bu alandaki işlemler platformun tüm erişim trafiğini ve <span className="text-white font-bold">veri güvenliğini</span> anlık olarak etkiler.
                            </p>

                            <div className="space-y-4">
                                <button className="w-full bg-white/5 hover:bg-rose-500/10 border border-white/10 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                                    Tüm Oturumları Sonlandır
                                </button>
                                <button className="w-full bg-rose-600 hover:bg-rose-500 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-rose-900/40 transition-all active:scale-95">
                                    Güvenlik Kilidini Aktif Et
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-100">
                        <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-6">Sistem Sağlık Endeksi</h4>
                        <div className="space-y-4">
                            {[
                                { label: 'SSL Sertifikası', value: 'Aktif', status: 'success' },
                                { label: 'DDoS Koruması', value: '7/24 Devrede', status: 'success' },
                                { label: 'WAF Filtreleri', value: 'Optimize', status: 'info' },
                                { label: 'Data Şifreleme', value: 'AES-256', status: 'primary' }
                            ].map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0">
                                    <span className="text-[11px] font-bold text-slate-400">{item.label}</span>
                                    <span className={`text-[10px] font-black px-3 py-1 rounded-lg border uppercase tracking-widest ${item.status === 'success' ? 'bg-emerald-50 text-emerald-500 border-emerald-100' : item.status === 'info' ? 'bg-sky-50 text-sky-500 border-sky-100' : 'bg-indigo-50 text-indigo-500 border-indigo-100'}`}>
                                        {item.value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
