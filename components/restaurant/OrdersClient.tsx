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

import { MobileMenuToggle, ProfileDropdown } from '@/components/HeaderActions';
import { formatDate, formatTime, formatDateTime, formatSmartDate } from '@/lib/date-utils';

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
            COMPLETED: { bg: 'bg-slate-50', color: 'text-slate-600', border: 'border-slate-100', icon: CheckCircle2, label: 'TAMAMLANDI' },
            CANCELLED: { bg: 'bg-slate-100', color: 'text-slate-400', border: 'border-slate-200', icon: XCircle, label: 'İPTAL' }
        };

        const style = styles[status] || styles.COMPLETED;
        const Icon = style.icon;

        return (
            <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] border ${style.bg} ${style.color} ${style.border} text-[10px] font-bold tracking-tight shadow-sm`}>
                <Icon size={13} strokeWidth={2.5} />
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
            <div className="bg-white px-6 py-4 border-b border-slate-200 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 sticky top-[-1px] z-30 shadow-sm transition-all">
                <div className="flex flex-col md:flex-row md:items-center gap-6 w-full lg:w-auto flex-1">
                    <div className="flex items-center gap-4">
                        <MobileMenuToggle />
                        <div className="h-6 w-px bg-slate-200 hidden md:block" />
                    </div>

                    <div className="flex bg-slate-100 p-1 rounded-[6px] border border-slate-200 w-full sm:w-auto">
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`flex flex-1 sm:flex-none h-9 items-center justify-center gap-2 px-6 rounded-[4px] text-[11px] font-bold tracking-tight transition-all duration-200 ${activeTab === 'orders' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <ShoppingBag size={14} />
                            <span>SİPARİŞLER</span>
                            {orders.filter(o => o.status === 'PENDING').length > 0 && (
                                <span className="bg-rose-600 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold ml-1">
                                    {orders.filter(o => o.status === 'PENDING').length}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('waiter')}
                            className={`flex flex-1 sm:flex-none h-9 items-center justify-center gap-2 px-6 rounded-[4px] text-[11px] font-bold tracking-tight transition-all duration-200 ${activeTab === 'waiter' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <Bell size={14} />
                            <span>ÇAĞRILAR</span>
                            {waiterCalls.filter(c => c.status === 'PENDING').length > 0 && (
                                <span className="bg-rose-600 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold ml-1">
                                    {waiterCalls.filter(c => c.status === 'PENDING').length}
                                </span>
                            )}
                        </button>
                    </div>

                    {activeTab === 'orders' && (
                        <div className="flex flex-wrap gap-2 items-center w-full lg:w-auto">
                            <div className="relative w-full sm:w-[180px]">
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-full h-9 bg-slate-50 border border-slate-200 rounded-[6px] pl-4 pr-10 py-0 text-[11px] font-bold text-slate-900 appearance-none outline-none focus:border-slate-400 transition-all cursor-pointer tracking-tight"
                                >
                                    <option value="ALL">FİLTRE: TÜMÜ</option>
                                    <option value="ACTIVE">AKTİF</option>
                                    <option value="COMPLETED">BİTENLER</option>
                                    <option value="CANCELLED">İPTAL</option>
                                </select>
                                <ChevronRight size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none rotate-90" />
                            </div>

                            <button
                                onClick={audioUnlocked ? () => setSoundEnabled(!soundEnabled) : unlockAudio}
                                className={`flex items-center h-9 gap-2 px-4 rounded-[6px] border transition-all font-bold text-[11px] tracking-tight ${soundEnabled ? 'bg-emerald-50 border-emerald-100 text-emerald-600 shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100'}`}
                            >
                                <Volume2 size={14} strokeWidth={2.5} className={soundEnabled ? 'animate-pulse' : 'opacity-40'} />
                                {!audioUnlocked ? 'SESİ AKTİF ET' : (soundEnabled ? 'SES AÇIK' : 'SES KAPALI')}
                            </button>

                            <button
                                onClick={fetchData}
                                className="bg-slate-900 text-white h-9 w-9 flex items-center justify-center rounded-[6px] hover:bg-slate-800 transition-all shadow-sm active:scale-95 group"
                                title="Yenile"
                            >
                                <Activity size={16} className={loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'} strokeWidth={2.5} />
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex justify-end ml-auto">
                    <ProfileDropdown />
                </div>
            </div>

            <div className="p-6 md:p-8 lg:p-10">
                {activeTab === 'orders' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {filteredOrders.map((order) => (
                                <motion.div
                                    key={order.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                                    className={`bg-white rounded-[6px] shadow-sm border transition-all hover:shadow-md group overflow-hidden flex flex-col ${order.status === 'PENDING' ? 'border-rose-200' : 'border-slate-200'}`}
                                >
                                    {/* Card Header */}
                                    <div className={`p-4 border-b border-slate-100 flex justify-between items-center ${order.status === 'PENDING' ? 'bg-rose-50/30' : 'bg-slate-50/50'}`}>
                                        <div className="flex items-center gap-3">
                                            <div className="bg-slate-900 text-white w-9 h-9 rounded-[4px] flex flex-col items-center justify-center shadow-sm">
                                                <span className="text-[8px] font-bold opacity-60 leading-none">MASA</span>
                                                <span className="text-sm font-bold">{order.tableId || 'P'}</span>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{order.tableId ? 'SİPARİŞ' : 'PAKET'}</span>
                                                    {(order as any).note?.toUpperCase().includes('EK SİPARİŞ') && (
                                                        <span className="bg-amber-100 text-amber-700 text-[8px] font-bold px-1.5 py-0.5 rounded-[2px] border border-amber-200 tracking-tight animate-pulse ml-1">EK SİPARİŞ</span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Clock size={11} className="text-slate-400" />
                                                    <span className="text-[11px] font-bold text-slate-600 tracking-tight">
                                                        {getElapsedTime(order.createdAt)} ({formatTime(order.createdAt)})
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <StatusBadge status={order.status} />
                                    </div>

                                    {/* Items Container */}
                                    <div className="p-4 flex-1">
                                        <div className="space-y-3 mb-6">
                                            {order.items && Object.values(order.items).map((item: any, idx: number) => (
                                                <div key={idx} className="flex justify-between items-start group/item">
                                                    <div className="flex gap-3 items-start">
                                                        <div className="bg-slate-100 text-slate-600 text-[10px] font-bold w-6 h-6 flex items-center justify-center rounded-[4px] border border-slate-200 shrink-0">
                                                            {item.quantity}
                                                        </div>
                                                        <div className="pt-0.5">
                                                            <p className="text-[12px] font-bold text-slate-800 leading-tight">{item.name}</p>
                                                            {item.options && (
                                                                <p className="text-[10px] text-slate-400 font-medium mt-0.5 italic">{item.options.join(', ')}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <span className="text-[11px] font-bold text-slate-400 tracking-tight">{(item.price * item.quantity).toFixed(2)}₺</span>
                                                </div>
                                            ))}
                                        </div>

                                        {(order as any).note && (
                                            <div className="bg-blue-50/50 p-3 rounded-[4px] border border-blue-100 border-dashed group/note hover:bg-blue-50 transition-colors">
                                                <p className="text-[9px] font-bold text-blue-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                                                    <FileText size={10} /> Müşteri Notu
                                                </p>
                                                <p className="text-[11px] font-medium text-blue-700 leading-relaxed italic">
                                                    "{(order as any).note}"
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Footer */}
                                    <div className="p-4 bg-slate-50 border-t border-slate-100 space-y-4">
                                        <div className="flex justify-between items-end">
                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Toplam Tutar</div>
                                            <div className="text-xl font-bold text-slate-900 tracking-tight">{order.totalAmount.toFixed(2)}<span className="text-[12px] font-bold text-slate-400 ml-1">₺</span></div>
                                        </div>

                                        <div className="flex gap-2">
                                            {order.status === 'PENDING' && (
                                                <>
                                                    <button onClick={() => setViewReceiptOrder(order)} className="p-2.5 rounded-[4px] bg-white border border-slate-200 text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-all shadow-sm">
                                                        <Eye size={16} />
                                                    </button>
                                                    <button onClick={() => updateOrderStatus(order.id, 'CANCELLED')} className="flex-1 py-2.5 px-4 rounded-[4px] border border-rose-100 text-rose-500 text-[11px] font-bold uppercase tracking-tight hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all shadow-sm">İptal</button>
                                                    <button onClick={() => updateOrderStatus(order.id, 'PREPARING')} className="flex-[2] py-2.5 px-4 rounded-[4px] bg-slate-900 text-white text-[11px] font-bold uppercase tracking-tight shadow-md hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                                                        <ChefHat size={16} /> Hazırla
                                                    </button>
                                                </>
                                            )}
                                            {order.status === 'PREPARING' && (
                                                <>
                                                    <button onClick={() => setViewReceiptOrder(order)} className="p-2.5 rounded-[4px] bg-white border border-slate-200 text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-all shadow-sm">
                                                        <Eye size={16} />
                                                    </button>
                                                    <button onClick={() => updateOrderStatus(order.id, 'SERVED')} className="flex-1 py-2.5 px-4 rounded-[4px] bg-emerald-600 text-white text-[11px] font-bold uppercase tracking-tight shadow-md hover:bg-emerald-700 transition-all flex items-center justify-center gap-2">
                                                        <CheckCircle2 size={16} /> Servis Edildi
                                                    </button>
                                                </>
                                            )}
                                            {['SERVED', 'COMPLETED', 'CANCELLED'].includes(order.status) && (
                                                <div className="w-full flex gap-3 items-center">
                                                    <button onClick={() => setViewReceiptOrder(order)} className="p-2.5 rounded-[4px] bg-white border border-slate-200 text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-all shadow-sm">
                                                        <Eye size={16} />
                                                    </button>
                                                    <div className={`flex-1 flex flex-col items-center justify-center py-2 rounded-[4px] border italic font-bold text-[10px] tracking-tight ${order.status === 'CANCELLED' ? 'bg-rose-50 border-rose-100 text-rose-500' : 'bg-emerald-50 border-emerald-100 text-emerald-500'}`}>
                                                        {order.status === 'CANCELLED' ? '🔴 İPTAL' : '🟢 AKTİF'}
                                                    </div>
                                                    {order.status === 'SERVED' && (
                                                        <button onClick={() => updateOrderStatus(order.id, 'COMPLETED')} className="p-2.5 rounded-[4px] bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-md">
                                                            <CheckCircle2 size={16} />
                                                        </button>
                                                    )}
                                                    <button onClick={() => deleteOrder(order.id)} className="p-2.5 bg-rose-50 text-rose-400 rounded-[4px] hover:bg-rose-100 hover:text-rose-600 transition-colors border border-rose-100">
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

                {activeTab === 'waiter' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                        {waiterCalls.filter(call => {
                            if (call.status !== 'COMPLETED') return true;
                            const ageInMs = new Date().getTime() - new Date(call.updatedAt || call.createdAt).getTime();
                            return ageInMs < 60000;
                        }).map((call) => (
                            <motion.div
                                key={call.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={`bg-white rounded-[6px] p-6 shadow-sm border transition-all hover:shadow-md text-center ${call.status === 'PENDING' ? 'border-amber-200 bg-amber-50/10' : 'border-slate-200'}`}
                            >
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">MASA NUMARASI</div>
                                <div className="text-4xl font-bold text-slate-900 tracking-tight mb-6 leading-none">{call.tableId}</div>

                                <div className="flex items-center justify-center gap-1.5 mb-8 bg-rose-50/50 py-2 px-4 rounded-[4px] border border-rose-100 inline-flex mx-auto">
                                    <Clock size={12} className="text-rose-500 animate-pulse" />
                                    <span className="text-[10px] font-bold text-rose-600 tracking-tight uppercase">
                                        {getElapsedTime(call.createdAt)} ({formatTime(call.createdAt)})
                                    </span>
                                </div>

                                {call.status === 'PENDING' ? (
                                    <button
                                        onClick={() => updateCallStatus(call.id, 'COMPLETED')}
                                        className="w-full py-3 bg-slate-900 text-white rounded-[4px] font-bold uppercase tracking-tight text-[11px] flex items-center justify-center gap-2 shadow-md hover:bg-slate-800 active:scale-95 transition-all"
                                    >
                                        <CheckCircle2 size={16} /> İLGİLENİLDİ
                                    </button>
                                ) : (
                                    <div className="w-full py-3 bg-slate-50 border border-slate-200 text-slate-400 rounded-[4px] font-bold uppercase tracking-tight text-[10px] italic">
                                        TAMAMLANDI
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            <AnimatePresence>
                {viewReceiptOrder && (
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 lg:p-6" onClick={() => setViewReceiptOrder(null)}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-white rounded-[6px] w-full max-w-[400px] overflow-hidden shadow-2xl flex flex-col border border-slate-200"
                        >
                            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                                <div className="flex items-center gap-3">
                                    <div className="bg-slate-900 text-white p-2 rounded-[4px] shadow-sm">
                                        <Printer size={16} />
                                    </div>
                                    <h3 className="font-bold text-slate-900 uppercase tracking-tight text-sm">Sipariş Fişi</h3>
                                </div>
                                <button onClick={() => setViewReceiptOrder(null)} className="w-8 h-8 rounded-[4px] bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:border-rose-200 transition-all active:scale-90 shadow-sm">
                                    <XCircle size={18} />
                                </button>
                            </div>

                            <div id="receipt-content" className="p-6 text-slate-900 bg-white">
                                <div className="text-center mb-8 border-b-2 border-slate-900 border-dashed pb-8">
                                    <h2 className="text-xl font-bold tracking-tight mb-2 uppercase">MESA RESTORAN</h2>
                                    <div className="text-[10px] font-bold text-slate-400 space-y-1 uppercase tracking-widest">
                                        <div>Fiş No: #{(viewReceiptOrder.id || '').slice(-6).toUpperCase()}</div>
                                        <div>Tarih: {formatDateTime(viewReceiptOrder.createdAt)}</div>
                                    </div>
                                    <div className="mt-6 bg-slate-900 text-white py-2 px-6 rounded-[4px] inline-block text-sm font-bold shadow-sm">
                                        {viewReceiptOrder.tableId ? `MASA ${viewReceiptOrder.tableId}` : 'PAKET SERVİS'}
                                    </div>
                                </div>

                                <div className="space-y-4 mb-8">
                                    {viewReceiptOrder.items && Object.values(viewReceiptOrder.items).map((item: any, idx: number) => (
                                        <div key={idx} className="flex justify-between items-start gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-sm">{item.quantity}x</span>
                                                    <span className="font-bold text-slate-800 tracking-tight uppercase text-[12px] leading-tight">{item.name}</span>
                                                </div>
                                                {item.options && (
                                                    <div className="text-[9px] font-bold text-slate-400 ml-7 mt-0.5 italic leading-none">{item.options.join(' / ')}</div>
                                                )}
                                            </div>
                                            <span className="font-bold text-slate-900 text-[12px]">{(item.price * item.quantity).toFixed(2)}₺</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t-2 border-slate-900 pt-6 flex justify-between items-end">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pb-0.5">Genel Toplam</div>
                                    <div className="text-3xl font-bold tracking-tight leading-none">{viewReceiptOrder.totalAmount.toFixed(2)}₺</div>
                                </div>
                            </div>

                            <div className="p-4 bg-slate-50 flex gap-3 border-t border-slate-100">
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
                                                                .font-bold { font-weight: 700; }
                                                                .tracking-tight { letter-spacing: -0.02em; }
                                                                .uppercase { text-transform: uppercase; }
                                                                .text-3xl { font-size: 18pt; }
                                                                .mb-8 { margin-bottom: 20pt; }
                                                                .mt-6 { margin-top: 15pt; }
                                                                .space-y-4 > * + * { margin-top: 10pt; }
                                                                @media print { @page { margin: 0; size: 80mm auto; } body { width: 80mm; } }
                                                                .receipt-box { border: 1px solid #000; padding: 15pt; border-radius: 4pt; }
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
                                    className="flex-1 py-3 bg-slate-900 text-white rounded-[4px] font-bold uppercase tracking-tight text-[11px] flex items-center justify-center gap-2 shadow-md hover:bg-slate-800 active:scale-95 transition-all"
                                >
                                    <Printer size={16} /> YAZDIR
                                </button>
                                <button onClick={() => setViewReceiptOrder(null)} className="flex-1 py-3 bg-white border border-slate-200 text-slate-400 rounded-[4px] font-bold uppercase tracking-tight text-[11px] hover:text-slate-900 hover:border-slate-400 transition-all active:scale-95 shadow-sm">
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
