"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface Transaction {
    id: string;
    title: string;
    amount: number;
    reward: string | null;
    paymentMethod: string;
    status: 'COMPLETED' | 'PENDING' | 'FAILED' | 'CANCELLED';
    createdAt: string;
}

export default function Islemler() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const res = await fetch('/api/transactions');
                if (res.ok) {
                    const data = await res.json();
                    setTransactions(data);
                }
            } catch (error) {
                console.error("Error fetching transactions:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    const StatusBadge = ({ status }: { status: string }) => {
        const styles: Record<string, { bg: string, color: string, label: string }> = {
            PENDING: { bg: '#fff7ed', color: '#c2410c', label: 'Bekliyor' },
            COMPLETED: { bg: '#f0fdf4', color: '#15803d', label: 'Tamamlandı' },
            FAILED: { bg: '#fef2f2', color: '#b91c1c', label: 'Başarısız' },
            CANCELLED: { bg: '#f3f4f6', color: '#374151', label: 'İptal Edildi' }
        };

        const style = styles[status] || styles.COMPLETED;

        return (
            <span style={{ padding: '4px 10px', borderRadius: '4px', backgroundColor: style.bg, color: style.color, fontSize: '0.8rem', fontWeight: '500', whiteSpace: 'nowrap' }}>
                {style.label}
            </span>
        );
    };

    return (
        <div style={{ padding: '0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 2rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '500', color: '#333' }}>İşlemler</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#666', fontSize: '0.9rem' }}>
                    <Link href="/dashboard" style={{ color: '#666', textDecoration: 'none' }}>Geri</Link>
                    <ChevronRight size={14} />
                    <span>İşlemler</span>
                </div>
            </div>

            <div style={{ padding: '0 2rem', paddingBottom: '3rem' }}>
                <div className="card" style={{ padding: '0', overflow: 'hidden', borderRadius: '8px', border: '1px solid #eee' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.95rem' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #eee', background: '#f9f9f9' }}>
                                    <th style={{ padding: '16px 20px', fontWeight: '600', color: '#333', width: '40px' }}></th>
                                    <th style={{ padding: '16px 20px', fontWeight: '600', color: '#333' }}>Başlık</th>
                                    <th style={{ padding: '16px 20px', fontWeight: '600', color: '#333', width: '100px' }}>Miktar</th>
                                    <th style={{ padding: '16px 20px', fontWeight: '600', color: '#333', width: '100px' }}>Ödül</th>
                                    <th style={{ padding: '16px 20px', fontWeight: '600', color: '#333' }}>Ödeme şekli</th>
                                    <th style={{ padding: '16px 20px', fontWeight: '600', color: '#333' }}>Tarih</th>
                                    <th style={{ padding: '16px 20px', fontWeight: '600', color: '#333', width: '120px' }}>Durum</th>
                                    <th style={{ padding: '16px 20px', fontWeight: '600', color: '#333', width: '40px' }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={8} style={{ padding: '60px', textAlign: 'center', color: '#666', fontSize: '1rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                                                <div style={{ width: '18px', height: '18px', border: '2px solid #ddd', borderTop: '2px solid #333', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                                                Yükleniyor...
                                                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                                            </div>
                                        </td>
                                    </tr>
                                ) : transactions.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} style={{ padding: '60px', textAlign: 'center', color: '#666', fontSize: '1rem' }}>
                                            Sonuç bulunamadı.
                                        </td>
                                    </tr>
                                ) : (
                                    transactions.map(t => (
                                        <tr key={t.id} style={{ borderBottom: '1px solid #eee' }}>
                                            <td style={{ padding: '16px 20px' }}></td>
                                            <td style={{ padding: '16px 20px', color: '#333', fontWeight: '500' }}>{t.title}</td>
                                            <td style={{ padding: '16px 20px', color: '#666' }}>{t.amount}₺</td>
                                            <td style={{ padding: '16px 20px', color: '#666' }}>{t.reward || '-'}</td>
                                            <td style={{ padding: '16px 20px', color: '#666' }}>{t.paymentMethod}</td>
                                            <td style={{ padding: '16px 20px', color: '#666' }}>
                                                {new Date(t.createdAt).toLocaleDateString('tr-TR')}
                                            </td>
                                            <td style={{ padding: '16px 20px' }}>
                                                <StatusBadge status={t.status} />
                                            </td>
                                            <td style={{ padding: '16px 20px' }}></td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
