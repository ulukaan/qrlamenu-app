"use client";
import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Check, X, Image as ImageIcon, Zap, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Theme {
    id: string;
    key: string;
    name: string;
    description: string;
    previewUrl: string;
    isPremium: boolean;
    isActive: boolean;
    order: number;
}

export default function ThemesPage() {
    const [themes, setThemes] = useState<Theme[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchThemes();
    }, []);

    const fetchThemes = async () => {
        try {
            const res = await fetch('/api/admin/themes');
            const data = await res.json();
            if (Array.isArray(data)) {
                setThemes(data);
            } else {
                console.error('API returned non-array data:', data);
                setThemes([]);
            }
        } catch (error) {
            console.error('Failed to fetch themes', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bu temayı silmek istediğinize emin misiniz?')) return;

        try {
            const res = await fetch(`/api/admin/themes/${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchThemes();
            } else {
                alert('Silme işlemi başarısız oldu.');
            }
        } catch (error) {
            console.error('Failed to delete theme', error);
        }
    };

    return (
        <div style={{ padding: '2.5rem 3.5rem', width: '100%', maxWidth: '100%' }}>
            {/* Header Area */}
            <div style={{ marginBottom: '3.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h2 style={{ fontSize: '2rem', fontWeight: '900', color: '#111827', letterSpacing: '-0.04em', margin: 0 }}>Tema & Tasarım Kütüphanesi</h2>
                    <p style={{ color: '#64748b', marginTop: '8px', fontSize: '1rem', fontWeight: '500' }}>Platformun görsel kimliğini belirleyen mizanpaj seçeneklerini ve premium stilleri yönetin.</p>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <button
                        onClick={() => router.push('/super-admin/temalar/yeni')}
                        className="hover:scale-105 active:scale-95 transition-all"
                        style={{ background: '#ff7a21', color: '#fff', padding: '14px 32px', borderRadius: '16px', border: 'none', fontSize: '0.95rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 10px 15px -3px rgba(255, 122, 33, 0.3)', cursor: 'pointer' }}
                    >
                        <Plus size={22} strokeWidth={3} /> Yeni Tasarım Oluştur
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '120px', background: '#fff', borderRadius: '32px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                            <Loader2 className="animate-spin text-orange-500" size={48} style={{ margin: '0 auto' }} />
                            <p style={{ marginTop: '24px', color: '#64748b', fontWeight: '800', fontSize: '1.1rem' }}>Sistem Senkronize Ediliyor...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {themes.map((theme) => (
                                <div key={theme.id} className="card group" style={{ border: 'none', padding: 0, overflow: 'hidden', position: 'relative', background: '#fff', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', borderRadius: '28px' }}>
                                    <div style={{ height: '260px', background: '#f8fafc', position: 'relative', overflow: 'hidden' }}>
                                        {theme.previewUrl ? (
                                            <img src={theme.previewUrl} alt={theme.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)' }} className="group-hover:scale-110" />
                                        ) : (
                                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1', background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
                                                <ImageIcon size={64} strokeWidth={1.2} />
                                            </div>
                                        )}

                                        {/* Status Badges Overlay */}
                                        <div style={{ position: 'absolute', top: '24px', right: '24px', display: 'flex', gap: '10px', zIndex: 10 }}>
                                            {theme.isPremium && (
                                                <div style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)', color: '#fff', fontSize: '0.65rem', fontWeight: '900', padding: '8px 16px', borderRadius: '12px', boxShadow: '0 8px 15px rgba(109,40,217,0.3)', letterSpacing: '0.08em' }}>PREMIUM</div>
                                            )}
                                            <div style={{
                                                background: theme.isActive ? 'rgba(16, 185, 129, 0.9)' : 'rgba(244, 63, 94, 0.9)',
                                                color: '#fff',
                                                fontSize: '0.65rem',
                                                fontWeight: '900',
                                                padding: '8px 16px',
                                                borderRadius: '12px',
                                                backdropFilter: 'blur(8px)',
                                                letterSpacing: '0.08em',
                                                border: '1px solid rgba(255,255,255,0.2)'
                                            }}>
                                                {theme.isActive ? 'AKTİF' : 'DEVRE DIŞI'}
                                            </div>
                                        </div>

                                        {/* Premium Hover Actions Overlay */}
                                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.5)', opacity: 0, transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', backdropFilter: 'blur(8px)' }} className="group-hover:opacity-100">
                                            <button
                                                onClick={() => router.push(`/super-admin/temalar/${theme.id}`)}
                                                style={{ width: '56px', height: '56px', borderRadius: '18px', background: '#fff', color: '#111827', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', boxShadow: '0 15px 30px rgba(0,0,0,0.3)', transition: 'all 0.2s' }}
                                                className="hover:scale-110 active:scale-95"
                                                title="Tasarımı Düzenle"
                                            >
                                                <Edit size={24} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(theme.id)}
                                                style={{ width: '56px', height: '56px', borderRadius: '18px', background: '#f43f5e', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', boxShadow: '0 15px 30px rgba(244,63,94,0.4)', transition: 'all 0.2s' }}
                                                className="hover:scale-110 active:scale-95"
                                                title="Temayı Kaldır"
                                            >
                                                <Trash2 size={24} />
                                            </button>
                                        </div>
                                    </div>

                                    <div style={{ padding: '32px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
                                            <div>
                                                <h3 style={{ fontSize: '1.4rem', fontWeight: '900', margin: 0, color: '#111827', letterSpacing: '-0.03em' }}>{theme.name}</h3>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                                                    <span style={{ fontSize: '0.75rem', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>KEY: {theme.key.toUpperCase()}</span>
                                                </div>
                                            </div>
                                            <div style={{ background: '#f8fafc', color: '#475569', fontSize: '0.85rem', fontWeight: '900', padding: '8px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                                                #{theme.order}
                                            </div>
                                        </div>
                                        <p style={{ margin: 0, fontSize: '0.95rem', color: '#64748b', lineHeight: '1.7', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '48px', fontWeight: '500' }}>
                                            {theme.description || 'Bu tasarım için detaylı bir görsel kurgu ve kullanıcı deneyimi açıklaması henüz tanımlanmamıştır.'}
                                        </p>
                                    </div>
                                </div>
                            ))}

                            {themes.length === 0 && (
                                <div style={{ gridColumn: '1 / -1', padding: '120px', textAlign: 'center', background: '#fff', borderRadius: '32px', border: '2px dashed #e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <div style={{ width: '80px', height: '80px', background: '#f8fafc', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                                        <ImageIcon size={48} style={{ color: '#cbd5e1' }} />
                                    </div>
                                    <h4 style={{ fontWeight: '900', color: '#111827', fontSize: '1.5rem', marginBottom: '12px' }}>Kütüphane Boş Gözüküyor</h4>
                                    <p style={{ color: '#94a3b8', fontWeight: '600', maxWidth: '400px', lineHeight: '1.6' }}>Sisteme kayıtlı herhangi bir tema tasarımı bulunmuyor. Yeni bir mizanpaj ekleyerek restoranlara seçenek sunun.</p>
                                    <button
                                        onClick={() => router.push('/super-admin/temalar/yeni')}
                                        style={{ marginTop: '32px', background: '#ff7a21', color: '#fff', padding: '14px 32px', borderRadius: '16px', border: 'none', fontWeight: '900', fontSize: '1rem', cursor: 'pointer', boxShadow: '0 10px 15px rgba(255,122,33,0.3)' }}
                                    >+ İlk Tasarımı Şimdi Başlat</button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Sidebar Metrics */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', position: 'sticky', top: '2.5rem', height: 'fit-content' }}>
                    <div className="card" style={{ border: 'none', padding: '40px', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: '#fff', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', borderRadius: '32px', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', bottom: '-20%', left: '-20%', width: '180px', height: '180px', background: 'rgba(59,130,246,0.1)', filter: 'blur(60px)', borderRadius: '50%' }}></div>

                        <h3 style={{ fontSize: '0.9rem', fontWeight: '900', marginBottom: '32px', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#94a3b8', position: 'relative' }}>Görsel Envanter Özeti</h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', position: 'relative' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                <div>
                                    <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Toplam Seçenek</span>
                                    <span style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-0.05em' }}>{themes.length}</span>
                                </div>
                                <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '8px 14px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '900' }}>TASARIM AKTİF</div>
                            </div>

                            <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)' }}></div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div>
                                    <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#94a3b8', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>Premium</span>
                                    <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#8b5cf6' }}>{themes.filter(t => t.isPremium).length} <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Adet</span></div>
                                </div>
                                <div>
                                    <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#94a3b8', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>Standart</span>
                                    <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#3b82f6' }}>{themes.filter(t => !t.isPremium).length} <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Adet</span></div>
                                </div>
                            </div>

                            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#94a3b8' }}>Dağıtımdaki Temalar</span>
                                    <span style={{ fontSize: '1.2rem', fontWeight: '900', color: '#10b981' }}>%{Math.round((themes.filter(t => t.isActive).length / (themes.length || 1)) * 100)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card" style={{ border: 'none', padding: '32px', background: '#fff', borderRadius: '28px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                            <div style={{ background: '#fff7ed', padding: '12px', borderRadius: '16px' }}>
                                <Zap size={24} color="#ff7a21" />
                            </div>
                            <div>
                                <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', fontWeight: '900', color: '#111827' }}>Tasarım Rehberi</h4>
                                <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', lineHeight: '1.7', fontWeight: '500' }}>
                                    Tasarım kütüphanesini güncellerken restoran tarafındaki **Branding** ayarlarına dikkat edin. Her yeni mizanpaj tüm renk paletlerini desteklemelidir.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
