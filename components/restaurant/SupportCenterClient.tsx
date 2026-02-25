"use client";
import React, { useState, useEffect, useRef } from 'react';
import {
    MessageCircle,
    Plus,
    Search,
    Send,
    History,
    User,
    ShieldCheck,
    ChevronRight,
    Clock,
    AlertCircle,
    CheckCircle2,
    LifeBuoy,
    Filter,
    ArrowLeft,
    Sparkles,
    Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { MobileMenuToggle, ProfileDropdown } from '@/components/HeaderActions';
import { formatDate, formatTime, formatDateTime, formatSmartDate } from '@/lib/date-utils';

interface Message {
    id: string;
    message: string;
    isAdmin: boolean;
    createdAt: string | Date;
}

interface Ticket {
    id: string;
    subject: string;
    status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    category: 'TECHNICAL' | 'BILLING' | 'FEATURE_REQUEST' | 'GENERAL';
    createdAt: string | Date;
    updatedAt: string | Date;
    messages?: Message[];
    _count?: {
        messages: number;
    };
}

interface SupportCenterClientProps {
    initialTickets: Ticket[];
    tenantName: string;
    tenantId: string;
}

export default function SupportCenterClient({ initialTickets, tenantName, tenantId }: SupportCenterClientProps) {
    const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [loading, setLoading] = useState(false);
    const [messageLoading, setMessageLoading] = useState(false);
    const [newMessage, setNewMessage] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('ALL');
    const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Pusher integration
    useEffect(() => {
        const { getPusherClient } = require('@/lib/pusher-client');
        const pusher = getPusherClient();
        if (!pusher) return;

        const channel = pusher.subscribe(`restaurant-${tenantId}`);

        channel.bind('new-message', (data: { ticketId: string, message: Message }) => {
            // Update selected ticket if it's the one receiving the message
            setSelectedTicket(current => {
                if (current?.id === data.ticketId) {
                    return {
                        ...current,
                        messages: [...(current.messages || []), data.message],
                        status: 'IN_PROGRESS'
                    };
                }
                return current;
            });

            // Update ticket in list
            setTickets(current => current.map(t =>
                t.id === data.ticketId
                    ? { ...t, status: 'IN_PROGRESS', updatedAt: new Date().toISOString() }
                    : t
            ));
        });

        return () => {
            pusher.unsubscribe(`restaurant-${tenantId}`);
        };
    }, [tenantId]);

    // Form states for new ticket
    const [newTicketData, setNewTicketData] = useState({
        subject: '',
        category: 'GENERAL',
        priority: 'MEDIUM',
        message: ''
    });

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (selectedTicket) {
            scrollToBottom();
        }
    }, [selectedTicket, selectedTicket?.messages?.length]);

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const handleCreateTicket = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/restaurant/tickets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTicketData)
            });
            const data = await res.json();
            if (res.ok) {
                setTickets([data, ...tickets]);
                setIsCreating(false);
                setNewTicketData({ subject: '', category: 'GENERAL', priority: 'MEDIUM', message: '' });
                setSelectedTicket(data);
                setNotification({ message: 'Bilet başarıyla oluşturuldu.', type: 'success' });
            }
        } catch (error) {
            console.error('Error creating ticket:', error);
            setNotification({ message: 'Bilet oluşturulamadı.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTicket = async (id: string) => {
        if (!window.confirm('Bu bileti silmek istediğinize emin misiniz? Bu işlem geri alınamaz.')) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/restaurant/tickets/${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                setSelectedTicket(null);
                // Refresh list
                setTickets(tickets.filter(t => t.id !== id));
                setNotification({ message: 'Bilet başarıyla silindi.', type: 'success' });
            } else {
                const data = await res.json();
                setNotification({ message: data.error || 'Bilet silinirken bir hata oluştu.', type: 'error' });
            }
        } catch (error) {
            console.error('Error deleting ticket:', error);
            setNotification({ message: 'İstek başarısız oldu.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedTicket) return;

        setMessageLoading(true);
        try {
            const res = await fetch(`/api/restaurant/tickets/${selectedTicket.id}/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: newMessage })
            });
            const data = await res.json();
            if (res.ok) {
                const updatedTicket = {
                    ...selectedTicket,
                    messages: [...(selectedTicket.messages || []), data]
                };
                setSelectedTicket(updatedTicket);
                setNewMessage('');

                // Update in list
                setTickets(tickets.map(t => t.id === selectedTicket.id ? { ...t, updatedAt: new Date().toISOString() } : t));

                setTimeout(scrollToBottom, 100);
            }
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setMessageLoading(false);
        }
    };

    const fetchTicketDetail = async (id: string) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/restaurant/tickets/${id}`);
            const data = await res.json();
            if (res.ok) {
                setSelectedTicket(data);
            }
        } catch (error) {
            console.error('Error fetching ticket:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'OPEN': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'IN_PROGRESS': return 'bg-orange-50 text-orange-600 border-orange-100';
            case 'RESOLVED': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'CLOSED': return 'bg-slate-50 text-slate-400 border-slate-100';
            default: return 'bg-slate-50 text-slate-600 border-slate-200';
        }
    };

    const getPriorityIcon = (priority: string) => {
        switch (priority) {
            case 'URGENT': return <AlertCircle size={12} className="text-rose-500" />;
            case 'HIGH': return <AlertCircle size={12} className="text-orange-500" />;
            default: return <Clock size={12} className="text-slate-400" />;
        }
    };


    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col">
            {/* Header Area */}
            <div className="bg-white border-b border-slate-200 py-5 px-6 relative z-30">
                <div className="w-full mx-auto">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-start md:items-center gap-4 md:gap-6">
                            <MobileMenuToggle />
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                    <Link href="/dashboard" className="hover:text-slate-900 transition-colors">PANEL</Link>
                                    <ChevronRight size={8} className="text-slate-300" />
                                    <span className="text-slate-900 uppercase tracking-[0.2em]">DESTEK MERKEZİ</span>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="bg-slate-900 text-white p-3 rounded-[6px] shadow-sm">
                                        <LifeBuoy size={20} className="text-white" strokeWidth={2.5} />
                                    </div>
                                    <div className="space-y-1">
                                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight leading-none uppercase">DESTEK & YARDIM</h1>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">AKTİF TALEPLER</span>
                                            <div className="h-0.5 w-0.5 bg-slate-200 rounded-full" />
                                            <span className="text-[9px] font-bold text-slate-900 px-2 py-0.5 bg-slate-100 border border-slate-200 rounded-[4px] uppercase tracking-widest">
                                                {tickets.filter(t => t.status !== 'CLOSED').length} AÇIK BİLET
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsCreating(true)}
                                className="h-9 bg-slate-900 text-white px-6 rounded-[6px] flex items-center gap-2 text-[10px] font-bold tracking-widest hover:bg-slate-800 transition-all active:scale-95 uppercase shadow-md shadow-slate-200"
                            >
                                <Plus size={14} strokeWidth={2.5} />
                                YENİ DESTEK TALEBİ
                            </button>
                            <ProfileDropdown />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Tickets Sidebar/List */}
                <div className={`w-full lg:w-[400px] border-r border-slate-200 bg-white flex flex-col ${selectedTicket ? 'hidden lg:flex' : 'flex'}`}>
                    <div className="p-4 border-b border-slate-50 bg-slate-50/30">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-slate-900" size={14} />
                            <input
                                type="text"
                                placeholder="BİLETLERDE ARA..."
                                className="w-full h-10 bg-white border border-slate-200 rounded-[6px] pl-10 pr-4 text-[11px] font-bold uppercase tracking-widest focus:outline-none focus:border-slate-900 transition-all shadow-sm"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto scrollbar-hide divide-y divide-slate-50">
                        {tickets.length === 0 ? (
                            <div className="p-12 text-center space-y-4">
                                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                                    <MessageCircle size={24} />
                                </div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">HENÜZ BİLETİNİZ BULUNMUYOR</p>
                            </div>
                        ) : (
                            tickets.map((ticket) => (
                                <button
                                    key={ticket.id}
                                    onClick={() => fetchTicketDetail(ticket.id)}
                                    className={`w-full p-6 text-left hover:bg-slate-50/80 transition-all border-l-4 ${selectedTicket?.id === ticket.id ? 'bg-slate-50/50 border-slate-900' : 'border-transparent'}`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className={`px-2 py-0.5 rounded-[4px] border text-[8px] font-bold uppercase tracking-widest ${getStatusColor(ticket.status)}`}>
                                            {ticket.status.replace('_', ' ')}
                                        </span>
                                        <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">
                                            {formatSmartDate(ticket.updatedAt)}
                                        </span>
                                    </div>
                                    <h4 className="text-[13px] font-bold text-slate-900 uppercase tracking-tight mb-3 line-clamp-1">{ticket.subject}</h4>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1.5">
                                            {getPriorityIcon(ticket.priority)}
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{ticket.priority}</span>
                                        </div>
                                        <div className="h-1 w-1 bg-slate-200 rounded-full" />
                                        <div className="flex items-center gap-1.5">
                                            <MessageCircle size={10} className="text-slate-400" />
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{ticket._count?.messages || 0} MESAJ</span>
                                        </div>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Ticket Detail / Chat Area */}
                <div className={`flex-1 bg-white relative flex flex-col ${!selectedTicket ? 'hidden lg:flex items-center justify-center' : 'flex'}`}>
                    {selectedTicket ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-6 border-b border-slate-200 flex items-center justify-between z-10 bg-white">
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setSelectedTicket(null)}
                                        className="lg:hidden p-2 -ml-2 text-slate-400 hover:text-slate-900"
                                    >
                                        <ArrowLeft size={20} />
                                    </button>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h2 className="text-lg font-bold text-slate-900 uppercase tracking-tight line-clamp-1">{selectedTicket.subject}</h2>
                                            <span className={`px-2 py-0.5 rounded-[4px] border text-[8px] font-bold uppercase tracking-widest ${getStatusColor(selectedTicket.status)}`}>
                                                {selectedTicket.status.replace('_', ' ')}
                                            </span>
                                        </div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bilet ID: {selectedTicket.id}</p>
                                    </div>
                                </div>
                                <div className="hidden sm:flex items-center gap-3">
                                    <button
                                        onClick={() => handleDeleteTicket(selectedTicket.id)}
                                        className="h-9 w-9 border border-red-100 bg-red-50 text-red-500 rounded-[6px] flex items-center justify-center hover:bg-red-100 transition-all transition-colors"
                                        title="Bileti Sil"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                    <div className="w-px h-6 bg-slate-100 mx-1" />
                                    <div className="text-right">
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">KATEGORİ</p>
                                        <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded-[4px] text-[8px] font-bold uppercase tracking-widest text-slate-900">
                                            {selectedTicket.category.replace('_', ' ')}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Chat Messages */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-[#fdfdfd] scrollbar-hide">
                                <AnimatePresence initial={false}>
                                    {selectedTicket.messages?.map((msg, idx) => (
                                        <motion.div
                                            key={msg.id || idx}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`flex ${msg.isAdmin ? 'justify-start' : 'justify-end'}`}
                                        >
                                            <div className={`max-w-[80%] flex items-start gap-4 ${msg.isAdmin ? 'flex-row' : 'flex-row-reverse'}`}>
                                                <div className={`w-8 h-8 rounded-[6px] flex items-center justify-center flex-shrink-0 shadow-sm ${msg.isAdmin ? 'bg-slate-900 text-white' : 'bg-[#ff6e01] text-white'}`}>
                                                    {msg.isAdmin ? <ShieldCheck size={16} /> : <User size={16} />}
                                                </div>
                                                <div className="space-y-2">
                                                    <div className={`p-4 rounded-[8px] shadow-sm text-[13px] leading-relaxed font-medium ${msg.isAdmin ? 'bg-white border border-slate-200 text-slate-900' : 'bg-slate-900 text-white'}`}>
                                                        {msg.isAdmin && (
                                                            <div className="flex items-center gap-1.5 mb-2 pb-2 border-b border-slate-100">
                                                                <Sparkles size={10} className="text-amber-500" />
                                                                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">DESTEK EKİBİ</span>
                                                            </div>
                                                        )}
                                                        {msg.message}
                                                    </div>
                                                    <p className={`text-[8px] font-bold text-slate-300 uppercase tracking-widest ${msg.isAdmin ? 'text-left' : 'text-right'}`}>
                                                        {formatTime(msg.createdAt)}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                                <div ref={chatEndRef} />
                            </div>

                            {/* Chat Input */}
                            {selectedTicket.status !== 'CLOSED' ? (
                                <div className="p-6 border-t border-slate-100 bg-white">
                                    <form onSubmit={handleSendMessage} className="relative group">
                                        <textarea
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            placeholder="MESAJINIZI YAZIN..."
                                            className="w-full min-h-[100px] bg-slate-50/50 border border-slate-200 rounded-[6px] p-4 pr-16 text-[12px] font-medium placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:bg-white transition-all resize-none shadow-sm"
                                        />
                                        <button
                                            type="submit"
                                            disabled={messageLoading || !newMessage.trim()}
                                            className="absolute right-4 bottom-4 w-10 h-10 bg-slate-900 text-white rounded-[6px] flex items-center justify-center hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50 disabled:scale-100 shadow-lg shadow-slate-200"
                                        >
                                            <Send size={18} strokeWidth={2.5} />
                                        </button>
                                    </form>
                                </div>
                            ) : (
                                <div className="p-6 bg-slate-50 text-center border-t border-slate-100">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2">
                                        <CheckCircle2 size={14} className="text-emerald-500" />
                                        BU BİLET KALICI OLARAK KAPATILMIŞTIR
                                    </p>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center space-y-6 max-w-sm px-6">
                            <div className="w-20 h-20 bg-slate-50 rounded-[12px] flex items-center justify-center mx-auto shadow-inner text-slate-200">
                                <LifeBuoy size={40} strokeWidth={1.5} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight">MESA DESTEK MERKEZİ</h3>
                                <p className="text-[11px] font-bold text-slate-400 leading-relaxed uppercase tracking-widest">
                                    SOL TARAFTAN BİR BİLET SEÇEBİLİR VEYA YUKARIDAN YENİ BİR DESTEK TALEBİ OLUŞTURABİLİRSİNİZ.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* New Ticket Drawer/Modal */}
            <AnimatePresence>
                {isCreating && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsCreating(false)}
                            className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100]"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed right-0 inset-y-0 w-full max-w-lg bg-white z-[101] shadow-2xl p-8 flex flex-col"
                        >
                            <div className="flex items-center justify-between mb-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-slate-900 text-white rounded-[6px] flex items-center justify-center shadow-lg">
                                        <LifeBuoy size={20} strokeWidth={2.5} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight leading-none">YENİ TALEB</h2>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 px-1">Mesa Ekibi ile İletişime Geçin</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsCreating(false)}
                                    className="w-10 h-10 border border-slate-200 rounded-[6px] flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-all"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleCreateTicket} className="flex-1 flex flex-col space-y-8">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">KONU BAŞLIĞI</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Örn: Fatura Problemi Hakkında"
                                        value={newTicketData.subject}
                                        onChange={e => setNewTicketData({ ...newTicketData, subject: e.target.value })}
                                        className="w-full h-12 bg-white border border-slate-200 rounded-[6px] px-4 text-[13px] font-bold focus:outline-none focus:border-slate-900 transition-all shadow-sm"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">KATEGORİ</label>
                                        <select
                                            value={newTicketData.category}
                                            onChange={e => setNewTicketData({ ...newTicketData, category: e.target.value })}
                                            className="w-full h-12 bg-white border border-slate-200 rounded-[6px] px-4 text-[11px] font-bold uppercase tracking-widest focus:outline-none focus:border-slate-900 transition-all shadow-sm flex items-center"
                                        >
                                            <option value="GENERAL">GENEL SORU</option>
                                            <option value="TECHNICAL">TEKNİK DESTEK</option>
                                            <option value="BILLING">FATURA & ÖDEME</option>
                                            <option value="FEATURE_REQUEST">ÖZELLİK TALEBİ</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">ÖNCELİK</label>
                                        <select
                                            value={newTicketData.priority}
                                            onChange={e => setNewTicketData({ ...newTicketData, priority: e.target.value })}
                                            className="w-full h-12 bg-white border border-slate-200 rounded-[6px] px-4 text-[11px] font-bold uppercase tracking-widest focus:outline-none focus:border-slate-900 transition-all shadow-sm flex items-center"
                                        >
                                            <option value="LOW">DÜŞÜK</option>
                                            <option value="MEDIUM">ORTA</option>
                                            <option value="HIGH">YÜKSEK</option>
                                            <option value="URGENT">ACİL</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex-1 space-y-1.5 flex flex-col">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">DETAYLI MESAJINIZ</label>
                                    <textarea
                                        required
                                        placeholder="Probleminizi veya talebinizi detaylıca açıklayın..."
                                        value={newTicketData.message}
                                        onChange={e => setNewTicketData({ ...newTicketData, message: e.target.value })}
                                        className="flex-1 w-full bg-white border border-slate-200 rounded-[6px] p-4 text-[13px] font-medium focus:outline-none focus:border-slate-900 transition-all resize-none shadow-sm"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-12 bg-slate-900 text-white rounded-[6px] text-[11px] font-bold tracking-[0.2em] shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50 disabled:scale-100 uppercase mt-4"
                                >
                                    {loading ? 'BİLET OLUŞTURULUYOR...' : 'TALEBİ GÖNDER'}
                                </button>
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Notifications */}
            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className={`fixed bottom-6 right-6 px-6 py-3 rounded-[6px] shadow-lg z-[200] border text-[11px] font-bold uppercase tracking-widest flex items-center gap-3 ${notification.type === 'success'
                            ? 'bg-emerald-50 border-emerald-100 text-emerald-600'
                            : 'bg-rose-50 border-rose-100 text-rose-600'
                            }`}
                    >
                        {notification.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                        {notification.message}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
