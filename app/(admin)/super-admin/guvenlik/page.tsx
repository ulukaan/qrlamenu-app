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
        <div className="px-6 py-8 w-full max-w-full">
            {/* Page Header Area */}
            <div className="mb-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                    <h1 className="text-[20px] font-semibold text-slate-900 tracking-tight leading-none uppercase">Güvenlik & Erişim Kontrolü</h1>
                    <p className="text-[13px] text-slate-500 mt-1 font-medium">Platform genelinde kimlik doğrulama, IP kısıtlamaları ve siber güvenlik politikalarını yapılandırın.</p>
                </div>
                <div className="flex items-center gap-4 w-full lg:w-auto">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-[4px] bg-emerald-50 text-emerald-600 text-[11px] font-bold uppercase tracking-widest border border-emerald-200">
                        <Shield size={14} /> Sistem Durumu: Güvenli
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6 items-start">
                <div className="space-y-6">
                    {/* General Security Layers */}
                    <div className="bg-white rounded-[6px] p-6 shadow-sm border border-slate-200">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-sky-50 text-sky-600 p-2 rounded-[4px] border border-sky-100">
                                <Lock size={20} />
                            </div>
                            <div>
                                <h3 className="text-[15px] font-semibold text-gray-900 tracking-tight">Zırhlı Erişim Katmanları</h3>
                                <p className="text-[12px] text-slate-500 font-medium mt-0.5">Aktif güvenlik duvarları ve doğrulama metodları.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            {[
                                { id: 'twoFA', title: 'Çift Faktörlü Doğrulama (2FA)', desc: 'Tüm admin hesapları için zorunlu kılındığında oturum güvenliğini maksimize eder.', icon: <Smartphone size={18} />, active: settings?.twoFA },
                                { id: 'ipWhitelist', title: 'IP Beyaz Liste Filtresi', desc: 'Sadece yetkilendirilmiş IP adreslerinden gelen talepleri kabul ederek dış saldırıları engeller.', icon: <Globe size={18} />, active: settings?.ipWhitelist },
                                { id: 'sessionTimeout', title: 'Akıllı Oturum Yönetimi', desc: `İnaktiflik durumunda ${settings?.sessionTimeout || 30} dakika sonra oturumu otomatik olarak sonlandırır.`, icon: <Clock size={18} />, active: true, persistent: true },
                            ].map((s, i) => (
                                <div key={i} className={`flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-[6px] border transition-colors ${s.active ? 'bg-slate-50 border-slate-200' : 'bg-white border-slate-100 opacity-70'} ${saving ? 'animate-pulse pointer-events-none' : ''}`}>
                                    <div className={`w-10 h-10 rounded-[4px] flex items-center justify-center shrink-0 transition-colors ${s.active ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                        {s.icon}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-900 text-[14px] leading-tight">{s.title}</p>
                                        <p className="text-[12px] text-slate-500 mt-0.5 leading-relaxed">{s.desc}</p>
                                    </div>
                                    {!s.persistent && (
                                        <button
                                            onClick={() => toggleSetting(s.id)}
                                            className={`relative w-10 h-5 rounded-full transition-colors focus:outline-none ${s.active ? 'bg-indigo-600' : 'bg-slate-200'}`}
                                        >
                                            <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${s.active ? 'translate-x-5' : 'translate-x-0'}`} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Password Policy */}
                    <div className="bg-white rounded-[6px] p-6 shadow-sm border border-slate-200">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-indigo-50 text-indigo-600 p-2 rounded-[4px] border border-indigo-100">
                                <Key size={20} />
                            </div>
                            <div>
                                <h3 className="text-[15px] font-semibold text-gray-900 tracking-tight">Karmaşıklık Politikası</h3>
                                <p className="text-[12px] text-slate-500 font-medium mt-0.5">Şifre kriterleri ve rotasyon kuralları.</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="p-5 rounded-[6px] bg-slate-50 border border-slate-200">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                                    <span className="text-[13px] font-semibold text-gray-900">Minimum Karakter Uzunluğu</span>
                                    <span className="text-[16px] font-bold text-indigo-600 tabular-nums">{settings?.minPasswordLength || 12} Karakter</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-500 w-3/4"></div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
                                    <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-[4px] border border-slate-200">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                        <span className="text-[11px] font-bold text-slate-600 uppercase tracking-widest">Büyük/Küçük Harf</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-[4px] border border-slate-200">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                        <span className="text-[11px] font-bold text-slate-600 uppercase tracking-widest">Özel Karakterler</span>
                                    </div>
                                </div>
                            </div>
                            <button className="h-9 px-4 rounded-[6px] bg-slate-900 text-white font-semibold text-[13px] hover:bg-slate-800 transition-colors w-full sm:w-auto">
                                Politikayı Güncelle
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="xl:sticky xl:top-8 flex flex-col gap-6">
                    {/* Critical Actions */}
                    <div className="bg-rose-50 rounded-[6px] p-5 shadow-sm border border-rose-200">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-white p-1.5 rounded-[4px] border border-rose-100">
                                <AlertTriangle size={16} className="text-rose-600" />
                            </div>
                            <h3 className="text-[12px] font-bold uppercase tracking-widest text-rose-700">Kritik Müdahale</h3>
                        </div>

                        <p className="text-[12px] font-medium text-rose-700/80 leading-relaxed mb-5">
                            Bu alandaki işlemler platformun tüm erişim trafiğini ve <span className="text-rose-800 font-bold">veri güvenliğini</span> anlık olarak etkiler.
                        </p>

                        <div className="space-y-2.5">
                            <button className="w-full h-8 bg-white hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-[4px] text-[11px] font-bold uppercase tracking-widest transition-colors">
                                Tüm Oturumları Sonlandır
                            </button>
                            <button className="w-full h-8 bg-rose-600 hover:bg-rose-700 text-white rounded-[4px] text-[11px] font-bold uppercase tracking-widest transition-colors">
                                Güvenlik Kilidi Aktif
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-[6px] p-5 shadow-sm border border-slate-200">
                        <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4">Sistem Sağlık Endeksi</h4>
                        <div className="space-y-3">
                            {[
                                { label: 'SSL Sertifikası', value: 'Aktif', status: 'success' },
                                { label: 'DDoS Koruması', value: '7/24 Devrede', status: 'success' },
                                { label: 'WAF Filtreleri', value: 'Optimize', status: 'info' },
                                { label: 'Data Şifreleme', value: 'AES-256', status: 'primary' }
                            ].map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
                                    <span className="text-[12px] font-medium text-slate-600">{item.label}</span>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-[4px] border uppercase tracking-widest ${item.status === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : item.status === 'info' ? 'bg-sky-50 text-sky-600 border-sky-200' : 'bg-indigo-50 text-indigo-600 border-indigo-200'}`}>
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
