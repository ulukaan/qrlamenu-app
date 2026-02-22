"use client";

import React from 'react';
import { Check, Crown, CreditCard, Calendar, Star, ChevronRight, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

interface Plan {
    id: string;
    name: string;
    price: number;
    features: string[];
    branchLimit: number;
    tableLimit: number;
}

interface PlanSettingsClientProps {
    currentPlan: Plan & {
        startDate?: Date; // Optional for now
        endDate?: Date;   // Optional for now
    };
    allPlans: Plan[];
    tenantName: string;
}

export default function PlanSettingsClient({ currentPlan, allPlans, tenantName }: PlanSettingsClientProps) {
    const formatDate = (date?: Date) => {
        if (!date) return 'Süresiz';
        return new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(date));
    };

    return (
        <div style={{ padding: '0', fontFamily: 'Inter, sans-serif' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 2rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '500', color: '#333', margin: 0 }}>Üyelik Planı</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#666', fontSize: '0.9rem' }}>
                    <Link href="/dashboard" style={{ color: '#666', textDecoration: 'none' }}>Geri</Link>
                    <span>›</span>
                    <span>Üyelik Planı</span>
                </div>
            </div>

            <div style={{ padding: '0 2rem 3rem 2rem' }}>

                {/* Current Plan Status */}
                <div style={{
                    background: 'white',
                    borderRadius: '16px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                    padding: '30px',
                    marginBottom: '40px',
                    border: '1px solid #eaeaea',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '30px',
                    alignItems: 'center'
                }}>
                    <div style={{ flex: '1', minWidth: '300px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                            <div style={{
                                background: '#FFF4E6',
                                color: '#ff7a21',
                                padding: '12px',
                                borderRadius: '12px'
                            }}>
                                <Crown size={32} />
                            </div>
                            <div>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0, color: '#1a1a1a' }}>{currentPlan.name}</h2>
                                <span style={{ color: '#2ecc71', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                                    <span style={{ width: '8px', height: '8px', background: '#2ecc71', borderRadius: '50%', display: 'inline-block' }}></span>
                                    Aktif
                                </span>
                            </div>
                        </div>
                        <p style={{ color: '#666', lineHeight: '1.6', maxWidth: '500px' }}>
                            Şu anda <strong>{currentPlan.name}</strong> planının sunduğu tüm avantajlardan yararlanıyorsunuz.
                            Bir sonraki yenileme tarihi: <strong>{formatDate(currentPlan.endDate)}</strong>
                        </p>
                    </div>

                    <div style={{
                        flex: '1',
                        display: 'flex',
                        gap: '20px',
                        flexWrap: 'wrap',
                        justifyContent: 'flex-start' // Changed to flex-start for better alignment
                    }}>
                        <div className="stat-card">
                            <div className="icon"><CreditCard size={20} /></div>
                            <div className="info">
                                <span className="label">Fiyat</span>
                                <span className="value">{currentPlan.price === 0 ? 'Ücretsiz' : `${currentPlan.price}₺ / Yıl`}</span>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="icon"><Calendar size={20} /></div>
                            <div className="info">
                                <span className="label">Yenileme</span>
                                <span className="value">{formatDate(currentPlan.endDate)}</span>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="icon"><Star size={20} /></div>
                            <div className="info">
                                <span className="label">Şube Hakkı</span>
                                <span className="value">{currentPlan.branchLimit} Şube</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Available Plans */}
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '25px', color: '#1a1a1a' }}>Diğer Plan Seçenekleri</h3>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '25px'
                }}>
                    {allPlans.map((plan) => {
                        const isCurrent = plan.id === currentPlan.id;
                        return (
                            <div key={plan.id} style={{
                                background: isCurrent ? '#fff9f2' : 'white',
                                border: isCurrent ? '2px solid #ff7a21' : '1px solid #eaeaea',
                                borderRadius: '16px',
                                padding: '30px',
                                position: 'relative',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                                display: 'flex',
                                flexDirection: 'column'
                            }}>
                                {isCurrent && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '-12px',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        background: '#ff7a21',
                                        color: 'white',
                                        padding: '4px 12px',
                                        borderRadius: '20px',
                                        fontSize: '0.75rem',
                                        fontWeight: '600'
                                    }}>
                                        MEVCUT PLAN
                                    </div>
                                )}

                                <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                                    <h4 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#1a1a1a', marginBottom: '10px' }}>{plan.name}</h4>
                                    <div style={{ fontSize: '2rem', fontWeight: '800', color: '#ff7a21' }}>
                                        {plan.price === 0 ? 'Ücretsiz' : (
                                            <>
                                                {plan.price}<span style={{ fontSize: '1rem', color: '#666', fontWeight: '500' }}>₺ / Yıl</span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div style={{ flex: 1, marginBottom: '25px' }}>
                                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#555' }}>
                                        <li style={{ display: 'flex', gap: '10px', marginBottom: '12px', alignItems: 'center' }}>
                                            <Check size={16} color="#2ecc71" strokeWidth={3} /> {plan.branchLimit} Şube Oluşturma
                                        </li>
                                        <li style={{ display: 'flex', gap: '10px', marginBottom: '12px', alignItems: 'center' }}>
                                            <Check size={16} color="#2ecc71" strokeWidth={3} /> {plan.tableLimit} Masa Kapasitesi
                                        </li>
                                        {plan.features.slice(0, 5).map((feature, idx) => (
                                            <li key={idx} style={{ display: 'flex', gap: '10px', marginBottom: '12px', alignItems: 'center' }}>
                                                <Check size={16} color="#2ecc71" strokeWidth={3} /> {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <button
                                    className={isCurrent ? 'btn-current' : 'btn-outline'}
                                    disabled={isCurrent}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        fontWeight: '600',
                                        cursor: isCurrent ? 'default' : 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {isCurrent ? 'Kullanımda' : 'Plana Geç'}
                                </button>
                            </div>
                        );
                    })}
                </div>

                <div style={{ marginTop: '40px', background: '#ffebee', borderRadius: '12px', padding: '20px', display: 'flex', gap: '15px', alignItems: 'start' }}>
                    <ShieldAlert color="#e74c3c" style={{ minWidth: '24px' }} />
                    <div>
                        <h4 style={{ margin: '0 0 5px 0', color: '#c0392b', fontWeight: '600' }}>İptal Politikası</h4>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: '#c0392b' }}>
                            Üyeliğinizi iptal ettiğinizde, mevcut dönem sonuna kadar özelliklerden yararlanmaya devam edebilirsiniz.
                            Daha fazla bilgi için <Link href="/iletisim" style={{ textDecoration: 'underline', color: '#c0392b' }}>destek ekibimizle</Link> iletişime geçin.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div style={{ marginTop: '50px', borderTop: '1px solid #eee', paddingTop: '20px', color: '#999', fontSize: '0.85rem' }}>
                    © 2024 QRlamenü Bütün Hakları Saklıdır.
                </div>
            </div>

            <style jsx>{`
                .stat-card {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    background: #f8f9fa;
                    padding: 12px 20px;
                    borderRadius: 10px;
                    minWidth: 160px;
                }
                .stat-card .icon {
                    color: #666;
                    background: white;
                    padding: 8px;
                    border-radius: 8px;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
                }
                .stat-card .info {
                    display: flex;
                    flex-direction: column;
                }
                .stat-card .label {
                    font-size: 0.75rem;
                    color: #888;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    font-weight: 600;
                }
                .stat-card .value {
                    font-size: 0.95rem;
                    color: #333;
                    font-weight: 600;
                }
                .btn-outline {
                    background: transparent;
                    border: 2px solid #ff7a21;
                    color: #ff7a21;
                }
                .btn-outline:hover {
                    background: #ff7a21;
                    color: white;
                }
                .btn-current {
                    background: #e0e0e0;
                    border: 2px solid #e0e0e0;
                    color: #888;
                }
            `}</style>
        </div>
    );
}
