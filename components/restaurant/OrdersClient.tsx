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
    Printer,
    ChevronRight,
    FileText,
    Search
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
    const [audioUnlocked, setAudioUnlocked] = useState(false);
    const audioContextRef = useRef<AudioContext | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>('ALL');

    // Initialize AudioContext and try to unlock on interaction
    const initAudio = () => {
        if (audioContextRef.current) return;
        try {
            const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioCtx) {
                audioContextRef.current = new AudioCtx();
            }
        } catch (e) {
            console.error('AudioContext initialization failed', e);
        }
    };

    const unlockAudio = async () => {
        initAudio();
        if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
            await audioContextRef.current.resume();
        }
        setAudioUnlocked(true);
        if (!soundEnabled) setSoundEnabled(true);

        // Play a test sound to confirm
        playNotificationSound(true);
    };

    // Improved notification sound (Ding-Dong style)
    const playNotificationSound = (isTest = false) => {
        if (!isTest && !soundEnabled) return;

        try {
            initAudio();
            const ctx = audioContextRef.current;
            if (!ctx) return;

            if (ctx.state === 'suspended') {
                console.warn('AudioContext is suspended. Interaction required.');
                setAudioUnlocked(false);
                return;
            }

            const playTone = (freq: number, start: number, duration: number, volume: number) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
                gain.gain.setValueAtTime(0, ctx.currentTime + start);
                gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + start + 0.05);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(ctx.currentTime + start);
                osc.stop(ctx.currentTime + start + duration);
            };

            // Double bell sound (harmonized)
            // Tone 1: High E
            playTone(659.25, 0, 0.8, 0.1);
            playTone(329.63, 0, 0.8, 0.05);

            // Tone 2: Low E after 0.2s
            playTone(523.25, 0.2, 0.8, 0.1);
            playTone(261.63, 0.2, 0.8, 0.05);

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
        const styles: Record<string, { bg: string, color: string, icon: any, label: string, border: string }> = {
            PENDING: { bg: 'bg-rose-50', color: 'text-rose-600', border: 'border-rose-100', icon: AlertCircle, label: 'BEKLEYEN' },
            PREPARING: { bg: 'bg-blue-50', color: 'text-blue-600', border: 'border-blue-100', icon: ChefHat, label: 'HAZIRLANIYOR' },
            SERVED: { bg: 'bg-emerald-50', color: 'text-emerald-600', border: 'border-emerald-100', icon: Utensils, label: 'SERVİS EDİLDİ' },
            COMPLETED: { bg: 'bg-gray-50', color: 'text-gray-600', border: 'border-gray-100', icon: CheckCircle2, label: 'TAMAMLANDI' },
            CANCELLED: { bg: 'bg-rose-50', color: 'text-rose-600', border: 'border-rose-100', icon: XCircle, label: 'İPTAL' }
        };

        const style = styles[status] || styles.COMPLETED;
        const Icon = style.icon;

        return (
            <span className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 ${style.bg} ${style.color} ${style.border} text-[10px] font-black tracking-widest`}>
                <Icon size={14} strokeWidth={3} />
                {style.label}
            </span>
        );
    };

    const filteredOrders = orders.filter(o => {
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
        if (diff < 1) return 'AZ ÖNCE';
        return `${diff} DK ÖNCE`;
    };

    return (
        <div className="p-0 bg-[#f8fafc] min-h-screen">
            {/* Elite Sub-Header / Filters */}
            <div className="bg-white px-8 md:px-12 py-6 border-b-2 border-slate-50 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8 sticky top-[-1px] z-30 shadow-sm shadow-slate-200/5 transition-all">
                <div className="flex bg-gray-50 p-2 rounded-[24px] border-2 border-gray-100/50 w-full sm:w-auto">
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`flex-1 sm:flex-none flex items-center justify-center gap-3 px-8 py-3.5 rounded-[18px] text-xs font-black tracking-widest transition-all ${activeTab === 'orders' ? 'bg-white text-gray-900 shadow-xl shadow-gray-200/50 scale-[1.02]' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        <ShoppingBag size={18} strokeWidth={activeTab === 'orders' ? 3 : 2.5} />
                        SİPARİŞLER
                        {orders.filter(o => o.status === 'PENDING').length > 0 && (
                            <span className="bg-rose-500 text-white text-[9px] px-2 py-0.5 rounded-full shadow-lg shadow-rose-500/20">
                                {orders.filter(o => o.status === 'PENDING').length}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('waiter')}
                        className={`flex-1 sm:flex-none flex items-center justify-center gap-3 px-8 py-3.5 rounded-[18px] text-xs font-black tracking-widest transition-all ${activeTab === 'waiter' ? 'bg-white text-gray-900 shadow-xl shadow-gray-200/50 scale-[1.02]' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        <Bell size={18} strokeWidth={activeTab === 'waiter' ? 3 : 2.5} />
                        ÇAĞRILAR
                        {waiterCalls.filter(c => c.status === 'PENDING').length > 0 && (
                            <span className="bg-rose-500 text-white text-[9px] px-2 py-0.5 rounded-full shadow-lg shadow-rose-500/20">
                                {waiterCalls.filter(c => c.status === 'PENDING').length}
                            </span>
                        )}
                    </button>
                </div>

                {activeTab === 'orders' && (
                    <div className="flex flex-wrap gap-4 items-center w-full xl:w-auto">
                        <div className="relative group w-full sm:w-[240px]">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-3.5 text-xs font-black text-gray-900 appearance-none outline-none focus:border-[#ff7a21] transition-all cursor-pointer tracking-widest"
                            >
                                <option value="ALL">TÜM SİPARİŞLER</option>
                                <option value="ACTIVE">AKTİF DURUMDAKİLER</option>
                                <option value="COMPLETED">TAMAMLANANLAR</option>
                                <option value="CANCELLED">İPTAL EDİLENLER</option>
                            </select>
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300">
                                <ChevronRight size={16} strokeWidth={3} className="rotate-90" />
                            </div>
                        </div>

                        <button
                            onClick={audioUnlocked ? () => setSoundEnabled(!soundEnabled) : unlockAudio}
                            className={`flex items-center gap-3 px-6 py-3.5 rounded-2xl border-2 transition-all font-black text-[10px] tracking-widest ${soundEnabled ? 'bg-orange-50 border-orange-100 text-[#ff7a21] shadow-lg shadow-orange-500/5' : 'bg-gray-50 border-gray-100 text-gray-400 hover:bg-gray-100'}`}
                        >
                            <Volume2 size={18} strokeWidth={3} className={soundEnabled ? 'animate-pulse' : 'opacity-40'} />
                            {!audioUnlocked ? 'SESİ AKTİF ET' : (soundEnabled ? 'SES AÇIK' : 'SES KAPALI')}
                        </button>

                        <button
                            onClick={fetchData}
                            className="bg-gray-900 text-white p-3.5 rounded-2xl hover:bg-[#ff7a21] transition-all shadow-xl shadow-gray-900/10 active:scale-95 group"
                            title="Yenile"
                        >
                            <Activity size={20} className={loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'} strokeWidth={3} />
                        </button>
                    </div>
                )}
            </div>

            <div className="p-8 md:p-12 lg:p-16">
                {activeTab === 'orders' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-10">
                        <AnimatePresence>
                            {filteredOrders.map((order) => (
                                <motion.div
                                    key={order.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                    className={`bg-white rounded-[40px] shadow-sm border-2 transition-all hover:shadow-2xl hover:shadow-gray-200/40 group overflow-hidden flex flex-col ${order.status === 'PENDING' ? 'border-orange-100 shadow-orange-500/5' : 'border-gray-50'}`}
                                >
                                    {/* Card Header */}
                                    <div className={`p-8 border-b-2 border-gray-50 flex justify-between items-center ${order.status === 'PENDING' ? 'bg-orange-50/30' : 'bg-white'}`}>
                                        <div className="flex items-center gap-5">
                                            <div className="bg-gray-900 text-white w-14 h-14 rounded-2xl flex flex-col items-center justify-center shadow-lg shadow-gray-900/20 group-hover:-rotate-6 transition-transform">
                                                <span className="text-[10px] font-black opacity-50 leading-none">MASA</span>
                                                <span className="text-xl font-black">{order.tableId || 'P'}</span>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{order.tableId ? 'SİPARİŞ' : 'PAKET SİPARİŞ'}</span>
                                                    {(order as any).note?.toUpperCase().includes('EK SİPARİŞ') && (
                                                        <span className="bg-purple-100 text-purple-600 text-[8px] font-black px-2 py-0.5 rounded-lg border border-purple-200 tracking-[0.2em] animate-pulse">🔔 EK</span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock size={12} className="text-[#ff7a21]" strokeWidth={3} />
                                                    <span className="text-xs font-black text-gray-900 tracking-tight">{getElapsedTime(order.createdAt)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <StatusBadge status={order.status} />
                                    </div>

                                    {/* Items Container */}
                                    <div className="p-8 flex-1">
                                        <div className="space-y-4 mb-8">
                                            {order.items && Object.values(order.items).map((item: any, idx: number) => (
                                                <div key={idx} className="flex justify-between items-start group/item">
                                                    <div className="flex gap-4 items-start">
                                                        <div className="bg-orange-50 text-[#ff7a21] text-[11px] font-black w-7 h-7 flex items-center justify-center rounded-lg border border-orange-100 shrink-0">
                                                            {item.quantity}
                                                        </div>
                                                        <div className="pt-0.5">
                                                            <p className="text-sm font-black text-gray-800 tracking-tight leading-tight">{item.name}</p>
                                                            {item.options && (
                                                                <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase italic">{item.options.join(', ')}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <span className="text-sm font-black text-gray-400 tracking-tighter">{(item.price * item.quantity).toFixed(2)}₺</span>
                                                </div>
                                            ))}
                                        </div>

                                        {(order as any).note && (
                                            <div className="bg-rose-50/50 p-5 rounded-3xl border-2 border-rose-100 border-dashed group/note hover:bg-rose-50 transition-colors">
                                                <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                                    <FileText size={12} strokeWidth={3} /> Müşteri Notu
                                                </p>
                                                <p className="text-xs font-black text-rose-600/90 leading-relaxed italic">
                                                    "{(order as any).note}"
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Footer */}
                                    <div className="p-8 bg-gray-50 border-t-2 border-gray-100 space-y-6">
                                        <div className="flex justify-between items-end">
                                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Toplam Hesap</div>
                                            <div className="text-3xl font-black text-gray-900 tracking-tighter">{order.totalAmount.toFixed(2)}<span className="text-base font-black text-gray-400 ml-1">₺</span></div>
                                        </div>

                                        <div className="flex gap-4">
                                            {order.status === 'PENDING' && (
                                                <>
                                                    <button onClick={() => setViewReceiptOrder(order)} className="p-4 rounded-2xl bg-white border-2 border-gray-200 text-gray-400 hover:text-gray-900 hover:border-gray-900 transition-all active:scale-95 shadow-sm">
                                                        <Eye size={20} strokeWidth={3} />
                                                    </button>
                                                    <button onClick={() => updateOrderStatus(order.id, 'CANCELLED')} className="flex-1 py-4 px-6 rounded-2xl border-2 border-rose-100 text-rose-500 text-xs font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all active:scale-95">İptal</button>
                                                    <button onClick={() => updateOrderStatus(order.id, 'PREPARING')} className="flex-[2] py-4 px-6 rounded-2xl bg-[#ff7a21] text-white text-xs font-black uppercase tracking-widest shadow-xl shadow-orange-500/20 hover:scale-[1.05] active:scale-95 transition-all flex items-center justify-center gap-2">
                                                        <ChefHat size={18} strokeWidth={3} /> Hazırla
                                                    </button>
                                                </>
                                            )}
                                            {order.status === 'PREPARING' && (
                                                <>
                                                    <button onClick={() => setViewReceiptOrder(order)} className="p-4 rounded-2xl bg-white border-2 border-gray-200 text-gray-400 hover:text-gray-900 hover:border-gray-900 transition-all active:scale-95 shadow-sm">
                                                        <Eye size={20} strokeWidth={3} />
                                                    </button>
                                                    <button onClick={() => updateOrderStatus(order.id, 'SERVED')} className="flex-1 py-4 px-6 rounded-2xl bg-emerald-500 text-white text-xs font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:scale-[1.05] active:scale-95 transition-all flex items-center justify-center gap-3">
                                                        <CheckCircle2 size={18} strokeWidth={3} /> Servis Edildi
                                                    </button>
                                                </>
                                            )}
                                            {['SERVED', 'COMPLETED', 'CANCELLED'].includes(order.status) && (
                                                <div className="w-full flex gap-4 items-center">
                                                    <button onClick={() => setViewReceiptOrder(order)} className="p-4 rounded-2xl bg-white border-2 border-gray-200 text-gray-400 hover:text-gray-900 hover:border-gray-900 transition-all shadow-sm">
                                                        <Eye size={20} strokeWidth={3} />
                                                    </button>
                                                    <div className={`flex-1 flex flex-col items-center justify-center py-3 rounded-2xl border-2 italic font-black text-[10px] tracking-[0.25em] ${order.status === 'CANCELLED' ? 'bg-rose-50 border-rose-100 text-rose-500' : 'bg-emerald-50 border-emerald-100 text-emerald-500'}`}>
                                                        {order.status === 'CANCELLED' ? '🔴 İPTAL' : '🟢 AKTİF'}
                                                    </div>
                                                    {order.status === 'SERVED' && (
                                                        <button onClick={() => updateOrderStatus(order.id, 'COMPLETED')} className="p-4 rounded-2xl bg-gray-900 text-white hover:bg-black transition-all shadow-xl shadow-gray-400/20">
                                                            <CheckCircle2 size={20} strokeWidth={3} />
                                                        </button>
                                                    )}
                                                    <button onClick={() => deleteOrder(order.id)} className="p-3 bg-rose-50 text-rose-400 rounded-xl hover:bg-rose-100 hover:text-rose-600 transition-colors">
                                                        <Trash2 size={18} strokeWidth={3} />
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

                {activeTab === 'waiter' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                        {waiterCalls.filter(call => {
                            if (call.status !== 'COMPLETED') return true;
                            const ageInMs = new Date().getTime() - new Date(call.updatedAt || call.createdAt).getTime();
                            return ageInMs < 60000;
                        }).map((call) => (
                            <motion.div
                                key={call.id}
                                layout
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={`bg-white rounded-[40px] p-10 shadow-sm border-2 text-center transition-all hover:scale-[1.02] ${call.status === 'PENDING' ? 'border-[#ff7a21] shadow-2xl shadow-orange-500/10' : 'border-gray-50'}`}
                            >
                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">MASA NUMARASI</div>
                                <div className="text-7xl font-black text-gray-900 tracking-tighter mb-8 leading-none">{call.tableId}</div>

                                <div className="flex items-center justify-center gap-2 mb-10 bg-rose-50/50 py-3 px-6 rounded-2xl border border-rose-100 inline-flex mx-auto">
                                    <Clock size={16} className="text-rose-500 animate-pulse" strokeWidth={3} />
                                    <span className="text-[11px] font-black text-rose-600 tracking-wide uppercase">{getElapsedTime(call.createdAt)}</span>
                                </div>

                                {call.status === 'PENDING' ? (
                                    <button
                                        onClick={() => updateCallStatus(call.id, 'COMPLETED')}
                                        className="w-full py-5 bg-[#ff7a21] text-white rounded-[24px] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 active:scale-95 transition-all"
                                    >
                                        <CheckCircle2 size={24} strokeWidth={3} /> İLGİLENİLDİ
                                    </button>
                                ) : (
                                    <div className="w-full py-5 bg-gray-50 border-2 border-gray-100 text-gray-400 rounded-[24px] font-black uppercase tracking-[0.2em] text-[10px] italic">
                                        TAMAMLANDI
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Elite Receipt Modal */}
            <AnimatePresence>
                {viewReceiptOrder && (
                    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-6" onClick={() => setViewReceiptOrder(null)}>
                        <motion.div
                            initial={{ opacity: 0, y: 50, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 50, scale: 0.95 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-white rounded-[48px] w-full max-w-[440px] overflow-hidden shadow-2xl flex flex-col"
                        >
                            <div className="p-8 border-b-2 border-gray-50 flex justify-between items-center bg-gray-50/50">
                                <div className="flex items-center gap-4">
                                    <div className="bg-gray-900 text-white p-3 rounded-2xl shadow-lg">
                                        <Printer size={20} strokeWidth={3} />
                                    </div>
                                    <h3 className="font-black text-gray-900 uppercase tracking-tight text-lg">Sipariş Fişi</h3>
                                </div>
                                <button onClick={() => setViewReceiptOrder(null)} className="w-12 h-12 rounded-2xl bg-white border-2 border-gray-100 flex items-center justify-center text-gray-400 hover:text-rose-500 hover:border-rose-100 transition-all active:scale-90 shadow-sm">
                                    <XCircle size={24} strokeWidth={3} />
                                </button>
                            </div>

                            <div id="receipt-content" className="p-10 text-gray-900 bg-white">
                                <div className="text-center mb-10 border-b-4 border-gray-900 border-double pb-10">
                                    <h2 className="text-3xl font-black tracking-tighter mb-4">MESA RESTORAN</h2>
                                    <div className="text-xs font-black text-gray-400 space-y-2 uppercase tracking-widest">
                                        <div>Fiş No: #{(viewReceiptOrder.id || '').slice(-6).toUpperCase()}</div>
                                        <div>Tarih: {new Date(viewReceiptOrder.createdAt).toLocaleString('tr-TR')}</div>
                                    </div>
                                    <div className="mt-8 bg-gray-900 text-white py-4 px-8 rounded-2xl inline-block text-xl font-black">
                                        {viewReceiptOrder.tableId ? `MASA ${viewReceiptOrder.tableId}` : 'PAKET SERVİS'}
                                    </div>
                                </div>

                                <div className="space-y-6 mb-12">
                                    {viewReceiptOrder.items && Object.values(viewReceiptOrder.items).map((item: any, idx: number) => (
                                        <div key={idx} className="flex justify-between items-start gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3">
                                                    <span className="font-black text-lg">{item.quantity}x</span>
                                                    <span className="font-black text-gray-800 tracking-tight uppercase text-sm leading-tight">{item.name}</span>
                                                </div>
                                                {item.options && (
                                                    <div className="text-[10px] font-bold text-gray-400 ml-9 mt-1 italic leading-none">{item.options.join(' / ')}</div>
                                                )}
                                            </div>
                                            <span className="font-black text-gray-900 text-sm">{(item.price * item.quantity).toFixed(2)}₺</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t-4 border-gray-900 pt-8 flex justify-between items-end">
                                    <div className="text-xs font-black text-gray-400 uppercase tracking-widest pb-1">Genel Toplam</div>
                                    <div className="text-4xl font-black tracking-tighter leading-none">{viewReceiptOrder.totalAmount.toFixed(2)}₺</div>
                                </div>
                            </div>

                            <div className="p-10 bg-gray-50 flex gap-4">
                                <button
                                    onClick={() => {
                                        const printContent = document.getElementById('receipt-content');
                                        if (printContent) {
                                            const printWindow = window.open('', '_blank');
                                            if (printWindow) {
                                                printWindow.document.write(`
                                                    <html>
                                                        <head>
                                                            <style>
                                                                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&display=swap');
                                                                body { font-family: 'Plus Jakarta Sans', sans-serif; padding: 20px; width: 80mm; margin: 0; background: white; }
                                                                * { box-sizing: border-box; }
                                                                .text-center { text-align: center; }
                                                                .font-black { font-weight: 800; }
                                                                .tracking-tighter { letter-spacing: -0.05em; }
                                                                .uppercase { text-transform: uppercase; }
                                                                .text-4xl { font-size: 24pt; }
                                                                .mb-10 { margin-bottom: 30pt; }
                                                                .mt-8 { margin-top: 20pt; }
                                                                .space-y-6 > * + * { margin-top: 15pt; }
                                                                @media print { @page { margin: 0; size: 80mm auto; } body { width: 80mm; } }
                                                                .receipt-box { border: 2px solid #000; padding: 20pt; border-radius: 10pt; }
                                                            </style>
                                                        </head>
                                                        <body>${printContent.innerHTML}</body>
                                                    </html>
                                                `);
                                                printWindow.document.close();
                                                setTimeout(() => { printWindow.print(); printWindow.close(); }, 500);
                                            }
                                        }
                                    }}
                                    className="flex-1 py-5 bg-gray-900 text-white rounded-[24px] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-xl shadow-gray-900/20 active:scale-95 transition-all"
                                >
                                    <Printer size={20} strokeWidth={3} /> YAZDIR
                                </button>
                                <button onClick={() => setViewReceiptOrder(null)} className="flex-1 py-5 bg-white border-2 border-gray-200 text-gray-400 rounded-[24px] font-black uppercase tracking-widest text-[10px] hover:text-gray-900 hover:border-gray-900 transition-all active:scale-95">
                                    KAPAT
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );

}
