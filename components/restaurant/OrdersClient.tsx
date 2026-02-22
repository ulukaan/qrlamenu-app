"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity,
    Volume2,
    Clock,
    Hash,
    ShoppingBag,
    Bell,
    CheckCircle2,
    XCircle,
    ChefHat,
    Utensils,
    AlertCircle,
    Trash2,
    Eye,
    Printer
} from 'lucide-react';

interface OrderItem {
    name: string;
    quantity: number;
    price: number;
    options?: string[];
}

interface Order {
    id: string;
    tableId: string | null;
    items: Record<string, OrderItem> | any;
    totalAmount: number;
    status: 'PENDING' | 'PREPARING' | 'SERVED' | 'COMPLETED' | 'CANCELLED';
    createdAt: string;
    updatedAt: string;
}

// ... interfaces
interface WaiterCall {
    id: string;
    tableId: string;
    status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
    createdAt: string;
    updatedAt: string;
}

export default function OrdersClient() {
    const [activeTab, setActiveTab] = useState<'orders' | 'waiter'>('orders');
    const [orders, setOrders] = useState<Order[]>([]);
    const [waiterCalls, setWaiterCalls] = useState<WaiterCall[]>([]);
    const [timeTick, setTimeTick] = useState(0); // Force re-render for timers
    const [loading, setLoading] = useState(true);
    const [viewReceiptOrder, setViewReceiptOrder] = useState<Order | null>(null);
    const lastOrderCountRef = useRef(0);
    const lastCallCountRef = useRef(0);

    const [soundEnabled, setSoundEnabled] = useState(false);
    const [statusFilter, setStatusFilter] = useState<string>('ALL');

    // AudioContext-based notification sound
    const playNotificationSound = () => {
        if (!soundEnabled) return;
        try {
            const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioCtx) return;
            const ctx = new AudioCtx();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
            osc.frequency.exponentialRampToValueAtTime(1046.5, ctx.currentTime + 0.1); // C6
            gain.gain.setValueAtTime(0.15, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
            osc.start();
            osc.stop(ctx.currentTime + 0.5);
        } catch (e) {
            console.log('Audio play failed', e);
        }
    };

    const fetchData = async () => {
        try {
            const ordersRes = await fetch('/api/restaurant/orders');
            if (ordersRes.ok) {
                const data = await ordersRes.json();
                setOrders(data);

                const pendingCount = data.filter((o: Order) => o.status === 'PENDING').length;
                if (pendingCount > lastOrderCountRef.current) {
                    playNotificationSound();
                }
                lastOrderCountRef.current = pendingCount;
            }

            const callsRes = await fetch('/api/restaurant/waiter-calls');
            if (callsRes.ok) {
                const data = await callsRes.json();
                setWaiterCalls(data);

                const pendingCalls = data.filter((c: WaiterCall) => c.status === 'PENDING').length;
                if (pendingCalls > lastCallCountRef.current) {
                    playNotificationSound();
                }
                lastCallCountRef.current = pendingCalls;
            }

        } catch (error) {
            console.error('Veri yüklenirken hata:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 4000);
        const timer = setInterval(() => setTimeTick(t => t + 1), 5000);
        return () => {
            clearInterval(interval);
            clearInterval(timer);
        };
    }, []);

    const updateOrderStatus = async (id: string, status: string) => {
        setOrders(prev => prev.map(o => o.id === id ? { ...o, status: status as any } : o));
        try {
            await fetch('/api/restaurant/orders', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status })
            });
        } catch (error) {
            fetchData();
        }
    };

    const deleteOrder = async (id: string) => {
        if (!confirm('Bu siparişi tamamen silmek istediğinize emin misiniz?')) return;
        setOrders(prev => prev.filter(o => o.id !== id));
        try {
            await fetch(`/api/restaurant/orders?id=${id}`, {
                method: 'DELETE',
            });
        } catch (error) {
            fetchData();
        }
    };

    const updateCallStatus = async (id: string, status: string) => {
        setWaiterCalls(prev => prev.map(c => c.id === id ? { ...c, status: status as any } : c));
        try {
            await fetch('/api/restaurant/waiter-calls', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status })
            });
        } catch (error) {
            fetchData();
        }
    };

    // ... existing StatusBadge and helper functions

    const StatusBadge = ({ status }: { status: string }) => {
        const styles: Record<string, { bg: string, color: string, icon: any, label: string }> = {
            PENDING: { bg: '#fff7ed', color: '#c2410c', icon: AlertCircle, label: 'Bekliyor' },
            PREPARING: { bg: '#eff6ff', color: '#1d4ed8', icon: ChefHat, label: 'Hazırlanıyor' },
            SERVED: { bg: '#f0fdf4', color: '#15803d', icon: Utensils, label: 'Servis Edildi' },
            COMPLETED: { bg: '#f3f4f6', color: '#374151', icon: CheckCircle2, label: 'Tamamlandı' },
            CANCELLED: { bg: '#fef2f2', color: '#b91c1c', icon: XCircle, label: 'İptal' }
        };

        const style = styles[status] || styles.COMPLETED;
        const Icon = style.icon;

        return (
            <span style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '20px',
                backgroundColor: style.bg,
                color: style.color,
                fontSize: '0.75rem',
                fontWeight: '600'
            }}>
                <Icon size={14} />
                {style.label}
            </span>
        );
    };

    const filteredOrders = orders.filter(o => {
        // Completed orders drop out of view after 1 minute
        if (o.status === 'COMPLETED') {
            const ageInMs = new Date().getTime() - new Date(o.updatedAt).getTime();
            if (ageInMs > 60000) return false;
        }

        if (statusFilter === 'ALL') return true;
        if (statusFilter === 'ACTIVE') return ['PENDING', 'PREPARING', 'SERVED'].includes(o.status);
        return o.status === statusFilter;
    });

    const getElapsedTime = (dateString: string) => {
        const diff = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / 60000);
        if (diff < 1) return 'Şimdi';
        return `${diff} dk önce`;
    };

    return (
        <div style={{ padding: '0', background: '#f9fafb', minHeight: 'calc(100vh - 80px)' }}>
            {/* Header / Tabs */}
            <div style={{
                background: 'white',
                padding: '1rem 2rem',
                borderBottom: '1px solid #e5e7eb',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'sticky',
                top: 0,
                zIndex: 10
            }}>
                <div style={{ display: 'flex', gap: '24px' }}>
                    <button
                        onClick={() => setActiveTab('orders')}
                        style={{
                            padding: '10px 0',
                            background: 'none',
                            border: 'none',
                            borderBottom: activeTab === 'orders' ? '2px solid #ff7a21' : '2px solid transparent',
                            color: activeTab === 'orders' ? '#ff7a21' : '#6b7280',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        <Utensils size={18} />
                        Siparişler
                        {orders.filter(o => o.status === 'PENDING').length > 0 && (
                            <span style={{
                                background: '#ef4444',
                                color: 'white',
                                fontSize: '10px',
                                padding: '2px 6px',
                                borderRadius: '10px'
                            }}>
                                {orders.filter(o => o.status === 'PENDING').length} Yeni
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('waiter')}
                        style={{
                            padding: '10px 0',
                            background: 'none',
                            border: 'none',
                            borderBottom: activeTab === 'waiter' ? '2px solid #ff7a21' : '2px solid transparent',
                            color: activeTab === 'waiter' ? '#ff7a21' : '#6b7280',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        <Bell size={18} />
                        Garson Çağrıları
                        {waiterCalls.filter(c => c.status === 'PENDING').length > 0 && (
                            <span style={{
                                background: '#ef4444',
                                color: 'white',
                                fontSize: '10px',
                                padding: '2px 6px',
                                borderRadius: '10px'
                            }}>
                                {waiterCalls.filter(c => c.status === 'PENDING').length}
                            </span>
                        )}
                    </button>
                </div>

                {activeTab === 'orders' && (
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            style={{
                                padding: '8px 12px',
                                borderRadius: '6px',
                                border: '1px solid #d1d5db',
                                fontSize: '0.875rem',
                                color: '#374151'
                            }}
                        >
                            <option value="ALL">Tüm Siparişler</option>
                            <option value="ACTIVE">Aktif (Bekleyen/Hazırlanan)</option>
                            <option value="COMPLETED">Tamamlananlar</option>
                            <option value="CANCELLED">İptaller</option>
                        </select>

                        <button
                            onClick={() => setSoundEnabled(!soundEnabled)}
                            style={{
                                background: soundEnabled ? '#fff7ed' : 'white',
                                border: `1px solid ${soundEnabled ? '#ff7a21' : '#d1d5db'}`,
                                padding: '8px 12px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                color: soundEnabled ? '#ff7a21' : '#6b7280',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontSize: '0.85rem',
                                fontWeight: 600
                            }}
                            title={soundEnabled ? 'Sesli Bildirim Açık' : 'Sesli Bildirim Kapalı'}
                        >
                            {soundEnabled ? <Volume2 size={18} /> : <Volume2 size={18} style={{ opacity: 0.5 }} />}
                            {soundEnabled ? 'Ses Açık' : 'Ses Kapalı'}
                        </button>

                        <button
                            onClick={fetchData}
                            style={{
                                background: 'white',
                                border: '1px solid #d1d5db',
                                padding: '8px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                color: '#6b7280'
                            }}
                            title="Yenile"
                        >
                            <Activity size={18} />
                        </button>
                    </div>
                )}
            </div>

            <div style={{ padding: '2rem' }}>
                {activeTab === 'orders' && (
                    <>
                        {loading && orders.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>Yükleniyor...</div>
                        ) : filteredOrders.length === 0 ? (
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '60px',
                                background: 'white',
                                borderRadius: '16px',
                                border: '1px dashed #e5e7eb'
                            }}>
                                <div style={{ background: '#f3f4f6', padding: '20px', borderRadius: '50%', marginBottom: '20px' }}>
                                    <ShoppingBag size={48} color="#9ca3af" />
                                </div>
                                <h3 style={{ margin: '0 0 8px 0', color: '#374151', fontSize: '1.1rem' }}>Sipariş Bulunamadı</h3>
                                <p style={{ margin: 0, color: '#9ca3af', fontSize: '0.9rem' }}>
                                    {statusFilter !== 'ALL' ? 'Bu filtrede görüntülenecek sipariş yok.' : 'Henüz hiç sipariş almadınız.'}
                                </p>
                            </div>
                        ) : (
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                                gap: '20px'
                            }}>
                                <AnimatePresence>
                                    {filteredOrders.map((order) => (
                                        <motion.div
                                            key={order.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            style={{
                                                background: 'white',
                                                borderRadius: '12px',
                                                boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                                                border: '1px solid #e5e7eb',
                                                overflow: 'hidden',
                                                display: 'flex',
                                                flexDirection: 'column'
                                            }}
                                        >
                                            {/* Card Header */}
                                            <div style={{ padding: '16px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: order.status === 'PENDING' ? '#fff7ed' : 'white' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <div style={{ background: '#111827', color: 'white', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.9rem' }}>
                                                        {order.tableId || 'P'}
                                                    </div>
                                                    <div>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 600 }}>
                                                            <span style={{ color: '#6b7280' }}>{order.tableId ? 'Masa' : 'Paket'}</span>
                                                            {(order as any).note?.startsWith('🔔 EK SİPARİŞ') && (
                                                                <span style={{ background: '#7c3aed', color: 'white', fontSize: '9px', fontWeight: '800', padding: '2px 6px', borderRadius: '10px', letterSpacing: '0.5px' }}>🔔 EK SİPARİŞ</span>
                                                            )}
                                                        </div>
                                                        <div style={{ fontSize: '0.75rem', color: '#374151', fontWeight: 600 }}>{getElapsedTime(order.createdAt)}</div>
                                                    </div>
                                                </div>
                                                <StatusBadge status={order.status} />
                                            </div>

                                            {/* Items */}
                                            <div style={{ padding: '16px', flex: 1 }}>
                                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.9rem' }}>
                                                    {order.items && Object.values(order.items).map((item: any, idx: number) => (
                                                        <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'flex-start' }}>
                                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                                <span style={{ color: '#ff7a21', fontWeight: 'bold', minWidth: '20px' }}>{item.quantity}x</span>
                                                                <span style={{ color: '#374151' }}>{item.name}</span>
                                                            </div>
                                                            <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>{(item.price * item.quantity).toFixed(2)}₺</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                                {/* Order Note */}
                                                {(order as any).note && (
                                                    <div style={{ marginTop: '10px', padding: '8px 10px', background: '#f5f3ff', borderRadius: '8px', fontSize: '0.78rem', color: '#6d28d9', fontWeight: 600, borderLeft: '3px solid #7c3aed' }}>
                                                        📝 {(order as any).note}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Footer Actions */}
                                            <div style={{ padding: '16px', background: '#f9fafb', borderTop: '1px solid #f3f4f6' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                                    <span style={{ color: '#6b7280', fontSize: '0.85rem', fontWeight: 500 }}>Toplam Tutar</span>
                                                    <span style={{ color: '#111827', fontSize: '1.1rem', fontWeight: '700' }}>{order.totalAmount.toFixed(2)}₺</span>
                                                </div>
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    {order.status === 'PENDING' && (
                                                        <>
                                                            <button onClick={() => setViewReceiptOrder(order)} title="Fişi Görüntüle" style={{ padding: '8px', borderRadius: '6px', background: '#f3f4f6', color: '#4b5563', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                                                <Eye size={16} />
                                                            </button>
                                                            <button onClick={() => updateOrderStatus(order.id, 'CANCELLED')} style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #fee2e2', background: 'white', color: '#dc2626', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>Reddet</button>
                                                            <button onClick={() => updateOrderStatus(order.id, 'PREPARING')} style={{ flex: 1.5, padding: '8px', borderRadius: '6px', background: '#ff7a21', color: 'white', border: 'none', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                                                <ChefHat size={16} /> Onayla
                                                            </button>
                                                        </>
                                                    )}
                                                    {order.status === 'PREPARING' && (
                                                        <>
                                                            <button onClick={() => setViewReceiptOrder(order)} title="Fişi Görüntüle" style={{ padding: '8px', borderRadius: '6px', background: '#f3f4f6', color: '#4b5563', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                                                <Eye size={16} />
                                                            </button>
                                                            <button onClick={() => updateOrderStatus(order.id, 'SERVED')} style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#22c55e', color: 'white', border: 'none', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                                                <CheckCircle2 size={18} /> Teslim Et / Servis Et
                                                            </button>
                                                        </>
                                                    )}
                                                    {['SERVED', 'COMPLETED', 'CANCELLED'].includes(order.status) && (
                                                        <div style={{ width: '100%', display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                            <button onClick={() => setViewReceiptOrder(order)} title="Fişi Görüntüle" style={{ padding: '8px', borderRadius: '6px', background: '#f3f4f6', color: '#4b5563', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                                                <Eye size={16} />
                                                            </button>
                                                            <div style={{ flex: 1, textAlign: 'center', fontSize: '0.8rem', color: order.status === 'CANCELLED' ? '#ef4444' : '#22c55e', fontWeight: 700, background: order.status === 'CANCELLED' ? '#fef2f2' : '#f0fdf4', padding: '6px', borderRadius: '6px' }}>
                                                                {order.status === 'CANCELLED' ? 'İPTAL EDİLDİ' : (order.status === 'SERVED' ? 'SERVİS EDİLDİ' : 'TAMAMLANDI')}
                                                            </div>
                                                            {order.status === 'SERVED' && (
                                                                <button onClick={() => updateOrderStatus(order.id, 'COMPLETED')} title="Tamamla" style={{ padding: '8px', borderRadius: '6px', background: '#374151', color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                                                    <CheckCircle2 size={16} />
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() => deleteOrder(order.id)}
                                                                title="Siparişi Sil"
                                                                style={{ padding: '8px', borderRadius: '6px', background: '#fee2e2', color: '#dc2626', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </>
                )}

                {activeTab === 'waiter' && (
                    <>
                        {waiterCalls.length === 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px', background: 'white', borderRadius: '16px', border: '1px dashed #e5e7eb' }}>
                                <div style={{ background: '#f3f4f6', padding: '20px', borderRadius: '50%', marginBottom: '20px' }}>
                                    <Bell size={48} color="#9ca3af" />
                                </div>
                                <h3 style={{ margin: '0 0 8px 0', color: '#374151', fontSize: '1.1rem' }}>Çağrı Yok</h3>
                                <p style={{ margin: 0, color: '#9ca3af', fontSize: '0.9rem' }}>Şu an aktif bir garson çağrısı bulunmuyor.</p>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                                <AnimatePresence>
                                    {waiterCalls
                                        .filter(call => {
                                            if (call.status !== 'COMPLETED') return true;
                                            const completedTime = new Date(call.updatedAt || call.createdAt).getTime();
                                            const now = new Date().getTime();
                                            // Hide if completed more than 1 minute ago (60000ms)
                                            return (now - completedTime) < 60000;
                                        })
                                        .map((call) => (
                                            <motion.div
                                                key={call.id}
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                style={{
                                                    background: 'white',
                                                    borderRadius: '12px',
                                                    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                                                    border: call.status === 'PENDING' ? '1px solid #ff7a21' : '1px solid #e5e7eb',
                                                    overflow: 'hidden'
                                                }}
                                            >
                                                <div style={{ padding: '20px', textAlign: 'center' }}>
                                                    <div style={{ marginBottom: '16px' }}>
                                                        <span style={{ fontSize: '0.8rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>Masa No</span>
                                                        <div style={{ fontSize: '3rem', fontWeight: '800', color: '#111827', lineHeight: 1 }}>{call.tableId}</div>
                                                    </div>
                                                    <div style={{ marginBottom: '20px' }}>
                                                        <div style={{ fontSize: '0.85rem', color: '#ef4444', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                                            <Clock size={14} />
                                                            {getElapsedTime(call.createdAt)}
                                                        </div>
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '10px' }}>
                                                        {call.status === 'PENDING' ? (
                                                            <button
                                                                onClick={() => updateCallStatus(call.id, 'COMPLETED')}
                                                                style={{ width: '100%', padding: '12px', background: '#ff7a21', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                                            >
                                                                <CheckCircle2 size={18} />
                                                                İlgilenildi
                                                            </button>
                                                        ) : (
                                                            <button
                                                                disabled
                                                                style={{ width: '100%', padding: '12px', background: '#f3f4f6', color: '#9ca3af', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'not-allowed' }}
                                                            >
                                                                Tamamlandı
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </>
                )}
            </div>
            {/* Receipt Modal */}
            <AnimatePresence>
                {viewReceiptOrder && (
                    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setViewReceiptOrder(null)}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            onClick={e => e.stopPropagation()}
                            style={{ background: 'white', borderRadius: '12px', width: '100%', maxWidth: '380px', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                        >
                            {/* Modal Header */}
                            <div style={{ padding: '16px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f9fafb' }}>
                                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#111827', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <ShoppingBag size={18} /> Sipariş Fişi
                                </h3>
                                <button onClick={() => setViewReceiptOrder(null)} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: '4px' }}>
                                    <XCircle size={20} />
                                </button>
                            </div>

                            {/* Ticket Content */}
                            <div id="receipt-content" style={{ padding: '24px', fontFamily: '"Courier New", Courier, monospace', color: '#111827', background: '#fff' }}>
                                <div style={{ textAlign: 'center', marginBottom: '20px', borderBottom: '2px dashed #d1d5db', paddingBottom: '16px' }}>
                                    <h2 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>SİPARİŞ DETAYI</h2>
                                    <div style={{ fontSize: '0.85rem', color: '#4b5563', marginBottom: '4px' }}>TARİH: {new Date(viewReceiptOrder.createdAt).toLocaleString('tr-TR')}</div>
                                    <div style={{ fontSize: '0.95rem', fontWeight: 700, background: '#111827', color: 'white', display: 'inline-block', padding: '4px 12px', borderRadius: '4px', marginTop: '8px' }}>
                                        {viewReceiptOrder.tableId ? `MASA ${viewReceiptOrder.tableId}` : 'PAKET SERVİS'}
                                    </div>
                                </div>

                                <table style={{ width: '100%', fontSize: '0.9rem', marginBottom: '16px', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                                            <th style={{ textAlign: 'left', paddingBottom: '8px' }}>ÜRÜN</th>
                                            <th style={{ textAlign: 'center', paddingBottom: '8px' }}>MİKTAR</th>
                                            <th style={{ textAlign: 'right', paddingBottom: '8px' }}>TUTAR</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {viewReceiptOrder.items && Object.values(viewReceiptOrder.items).map((item: any, idx: number) => (
                                            <tr key={idx}>
                                                <td style={{ padding: '8px 0', borderBottom: '1px dashed #f3f4f6' }}>
                                                    <div style={{ fontWeight: 600 }}>{item.name}</div>
                                                </td>
                                                <td style={{ padding: '8px 0', textAlign: 'center', borderBottom: '1px dashed #f3f4f6' }}>{item.quantity}</td>
                                                <td style={{ padding: '8px 0', textAlign: 'right', borderBottom: '1px dashed #f3f4f6' }}>{(item.price * item.quantity).toFixed(2)}₺</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                <div style={{ borderTop: '2px solid #111827', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>GENEL TOPLAM</span>
                                    <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>{viewReceiptOrder.totalAmount.toFixed(2)}₺</span>
                                </div>
                                <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.8rem', color: '#6b7280' }}>
                                    Teşekkür Ederiz
                                </div>
                            </div>

                            {/* Modal Footer Actions */}
                            <div style={{ padding: '16px', borderTop: '1px solid #e5e7eb', background: '#f9fafb', display: 'flex', gap: '12px' }}>
                                <button
                                    onClick={() => {
                                        const printContent = document.getElementById('receipt-content');
                                        const originalContents = document.body.innerHTML;
                                        if (printContent) {
                                            const printWindow = window.open('', '_blank');
                                            if (printWindow) {
                                                printWindow.document.write(`
                                                    <html>
                                                        <head>
                                                            <title>Fiş Yazdır</title>
                                                            <style>
                                                                body { font-family: "Courier New", Courier, monospace; color: #000; padding: 10px; margin: 0; width: 80mm; }
                                                                @media print { 
                                                                    body { width: 80mm; padding: 0; margin: 0; }
                                                                    @page { margin: 0; size: 80mm auto; }
                                                                }
                                                                * { box-sizing: border-box; }
                                                                table { width: 100%; border-collapse: collapse; }
                                                                .text-center { textAlign: center; }
                                                                .font-bold { fontWeight: bold; }
                                                            </style>
                                                        </head>
                                                        <body>
                                                            ${printContent.innerHTML}
                                                        </body>
                                                    </html>
                                                `);
                                                printWindow.document.close();
                                                printWindow.focus();
                                                setTimeout(() => {
                                                    printWindow.print();
                                                    printWindow.close();
                                                }, 250);
                                            }
                                        }
                                    }}
                                    style={{ flex: 1, padding: '10px', borderRadius: '6px', background: '#111827', color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', fontWeight: 600 }}
                                >
                                    <Printer size={18} /> Yazdır
                                </button>
                                <button
                                    onClick={() => setViewReceiptOrder(null)}
                                    style={{ flex: 1, padding: '10px', borderRadius: '6px', background: 'white', border: '1px solid #d1d5db', color: '#374151', cursor: 'pointer', fontWeight: 600 }}
                                >
                                    Kapat
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
