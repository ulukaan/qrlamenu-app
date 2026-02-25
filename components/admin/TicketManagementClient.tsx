"use client";
import React, { useState, useEffect, useRef } from 'react';
import {
    MessageCircle,
    Search,
    Send,
    User,
    ShieldCheck,
    ChevronRight,
    Clock,
    AlertCircle,
    CheckCircle2,
    LifeBuoy,
    Filter,
    ArrowLeft,
    Building2,
    MoreHorizontal,
    Trash2,
    CheckCircle,
    Inbox
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getPusherClient } from '@/lib/pusher-client';
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
    tenantId: string;
    tenant: {
        name: string;
        slug: string;
        logoUrl: string | null;
    };
    messages?: Message[];
    _count?: {
        messages: number;
    };
}

interface TicketManagementClientProps {
    initialTickets: Ticket[];
}

export default function TicketManagementClient({ initialTickets }: TicketManagementClientProps) {
    console.log('TicketManagementClient Loaded. Tickets:', initialTickets);
    const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [loading, setLoading] = useState(false);
    const [messageLoading, setMessageLoading] = useState(false);
    const [newMessage, setNewMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('ALL');
    const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);

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

    useEffect(() => {
        const pusher = getPusherClient();
        if (!pusher) return;

        const notificationsChannel = pusher.subscribe('admin-notifications');
        const ticketsChannel = pusher.subscribe('admin-tickets');

        notificationsChannel.bind('new-ticket', (data: any) => {
            console.log('New ticket received:', data);
            fetchTicketsList();
        });

        notificationsChannel.bind('update-count', () => {
            // This is primarily for sidebar but we can refresh list too
            fetchTicketsList();
        });

        ticketsChannel.bind('new-message', (data: { ticketId: string, message: Message }) => {
            console.log('New message received:', data);

            // Update selected ticket if it matches
            setSelectedTicket(current => {
                if (current?.id === data.ticketId) {
                    return {
                        ...current,
                        messages: [...(current.messages || []), data.message],
                        updatedAt: new Date().toISOString()
                    };
                }
                return current;
            });

            // Always refresh tickets list to update last message time/count
            fetchTicketsList();
        });

        return () => {
            pusher.unsubscribe('admin-notifications');
            pusher.unsubscribe('admin-tickets');
        };
    }, []);

    const fetchTicketsList = async () => {
        try {
            // Using existing bilet-yonetimi page logic but as client side fetch
            // Need a dedicated API for this or use a simple fetch
            const res = await fetch('/api/admin/tickets/list');
            if (res.ok) {
                const data = await res.json();
                setTickets(data);
            }
        } catch (error) {
            console.error('Error refreshing tickets list:', error);
        }
    };

    const handleDeleteTicket = async (id: string) => {
        if (!window.confirm('Bu bileti silmek istediğinize emin misiniz? Bu işlem geri alınamaz.')) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/admin/tickets/${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                setSelectedTicket(null);
                fetchTicketsList();
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
            const res = await fetch(`/api/admin/tickets/${selectedTicket.id}/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: newMessage })
            });
            const data = await res.json();
            if (res.ok) {
                const updatedTicket = {
                    ...selectedTicket,
                    status: 'IN_PROGRESS' as any,
                    messages: [...(selectedTicket.messages || []), data]
                };
                setSelectedTicket(updatedTicket);
                setNewMessage('');

                // Update in list
                setTickets(tickets.map(t => t.id === selectedTicket.id ? {
                    ...t,
                    status: 'IN_PROGRESS',
                    updatedAt: new Date().toISOString()
                } : t));

                setTimeout(scrollToBottom, 100);
            }
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setMessageLoading(false);
        }
    };

    const updateTicketStatus = async (id: string, newStatus: string) => {
        try {
            const res = await fetch(`/api/admin/tickets`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: newStatus })
            });
            if (res.ok) {
                setTickets(tickets.map(t => t.id === id ? { ...t, status: newStatus as any } : t));
                if (selectedTicket?.id === id) {
                    setSelectedTicket({ ...selectedTicket, status: newStatus as any });
                }
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const fetchTicketDetail = async (id: string) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/tickets/${id}`);
            const data = await res.json();
            if (res.ok) {
                const fullTicket = tickets.find(t => t.id === id);
                setSelectedTicket({ ...data, tenant: fullTicket?.tenant });
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

    const filteredTickets = tickets.filter(t => {
        const matchesSearch = t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.tenant.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="h-screen bg-slate-50 flex flex-col overflow-hidden font-sans">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 py-3 px-6 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                    <div className="bg-slate-900 text-white p-2 rounded-[6px] shadow-sm flex items-center justify-center">
                        <ShieldCheck size={18} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h1 className="text-[16px] font-semibold text-slate-900 uppercase tracking-tight leading-tight">BİLET YÖNETİM MERKEZİ</h1>
                        <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest mt-0.5">Tüm restoran taleplerini yönetin</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-2.5 py-1 bg-emerald-50 border border-emerald-100 rounded-[4px]">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">SİSTEM ÇALIŞIYOR</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Tickets Sidebar */}
                <div className={`w-full lg:w-[400px] border-r border-slate-200 bg-white flex flex-col shrink-0 ${selectedTicket ? 'hidden lg:flex' : 'flex'}`}>
                    <div className="p-5 space-y-4 bg-slate-50/50 border-b border-slate-100">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-slate-900" size={14} />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="RESTORAN VEYA KONU ARA..."
                                className="w-full h-9 bg-white border border-slate-200 rounded-[6px] pl-9 pr-3 text-[11px] font-semibold uppercase tracking-widest focus:outline-none focus:border-slate-400 transition-all shadow-sm placeholder:text-slate-400"
                            />
                        </div>
                        <div className="flex gap-1.5 group overflow-x-auto pb-1 scrollbar-hide">
                            {['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setStatusFilter(s)}
                                    className={`px-2.5 py-1 rounded-[4px] border border-slate-200 text-[9px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${statusFilter === s ? 'bg-slate-900 text-white border-slate-900 shadow-sm' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
                                >
                                    {s === 'ALL' ? 'TÜMÜ' : s.replace('_', ' ')}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto divide-y divide-slate-50 scrollbar-hide">
                        {filteredTickets.length === 0 ? (
                            <div className="p-16 text-center space-y-3">
                                <Inbox size={32} className="mx-auto text-slate-300" strokeWidth={1.5} />
                                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">BİLET BULUNAMADI</p>
                            </div>
                        ) : (
                            filteredTickets.map((ticket) => (
                                <button
                                    key={ticket.id}
                                    onClick={() => fetchTicketDetail(ticket.id)}
                                    className={`w-full p-5 text-left hover:bg-slate-50/80 transition-all border-l-[3px] ${selectedTicket?.id === ticket.id ? 'bg-slate-50/80 border-slate-900' : 'border-transparent'}`}
                                >
                                    <div className="flex items-center justify-between mb-2.5">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-7 h-7 bg-white border border-slate-200 rounded-[4px] flex items-center justify-center text-slate-400 overflow-hidden shrink-0 shadow-sm">
                                                {ticket.tenant.logoUrl ? (
                                                    <img src={ticket.tenant.logoUrl} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <Building2 size={12} />
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-tight leading-none">{ticket.tenant.name}</h4>
                                                <p className="text-[9px] font-medium text-slate-400 uppercase tracking-widest mt-0.5">{ticket.tenant.slug}.mesa.com</p>
                                            </div>
                                        </div>
                                        <span className={`px-2 py-0.5 rounded-[4px] border text-[8px] font-bold uppercase tracking-widest ${getStatusColor(ticket.status)}`}>
                                            {ticket.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                    <h3 className="text-[13px] font-semibold text-slate-800 tracking-tight mb-2.5 line-clamp-1">{ticket.subject}</h3>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-1.5">
                                                <AlertCircle size={10} className={ticket.priority === 'URGENT' || ticket.priority === 'HIGH' ? 'text-rose-500' : 'text-slate-300'} />
                                                <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-widest">{ticket.priority}</span>
                                            </div>
                                            <div className="h-1 w-1 bg-slate-200 rounded-full" />
                                            <div className="flex items-center gap-1.5">
                                                <MessageCircle size={10} className="text-slate-300" />
                                                <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-widest">{ticket._count?.messages || 0}</span>
                                            </div>
                                        </div>
                                        <span className="text-[9px] font-medium text-slate-400 tracking-widest">
                                            {formatSmartDate(ticket.updatedAt)}
                                        </span>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Main Content Areas */}
                <div className={`flex-1 bg-white relative flex flex-col ${!selectedTicket ? 'hidden lg:flex items-center justify-center' : 'flex'}`}>
                    {selectedTicket ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-5 border-b border-slate-200 flex items-center justify-between z-10 bg-white">
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setSelectedTicket(null)}
                                        className="lg:hidden p-1.5 -ml-1 text-slate-400 hover:text-slate-900"
                                    >
                                        <ArrowLeft size={18} />
                                    </button>
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 bg-slate-900 text-white rounded-[6px] flex items-center justify-center shadow-sm">
                                            <MessageCircle size={16} strokeWidth={2.5} />
                                        </div>
                                        <div>
                                            <h2 className="text-[15px] font-semibold text-slate-900 uppercase tracking-tight leading-none">{selectedTicket.subject}</h2>
                                            <div className="flex items-center gap-2.5 mt-1.5">
                                                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">{selectedTicket.tenant.name}</span>
                                                <div className="h-1 w-1 bg-slate-200 rounded-full" />
                                                <span className={`px-2 py-0.5 rounded-[4px] border text-[8px] font-bold uppercase tracking-widest ${getStatusColor(selectedTicket.status)}`}>
                                                    {selectedTicket.status.replace('_', ' ')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {selectedTicket.status !== 'RESOLVED' && (
                                        <button
                                            onClick={() => updateTicketStatus(selectedTicket.id, 'RESOLVED')}
                                            className="h-9 px-4 border border-emerald-200 bg-emerald-50 text-emerald-600 rounded-[6px] text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-100 transition-all flex items-center gap-2"
                                        >
                                            <CheckCircle2 size={14} /> ÇÖZÜLDÜ
                                        </button>
                                    )}
                                    {selectedTicket.status !== 'CLOSED' && (
                                        <button
                                            onClick={() => updateTicketStatus(selectedTicket.id, 'CLOSED')}
                                            className="h-9 px-4 border border-slate-200 bg-white text-slate-400 rounded-[6px] text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 hover:text-slate-900 transition-all"
                                        >
                                            KAPAT
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDeleteTicket(selectedTicket.id)}
                                        className="h-9 w-9 border border-red-100 bg-red-50 text-red-500 rounded-[6px] flex items-center justify-center hover:bg-red-100 transition-all"
                                        title="Bileti Sil"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Ticket Info Bar */}
                            <div className="bg-slate-50/50 border-b border-slate-100 px-8 py-3 flex items-center gap-8 overflow-x-auto scrollbar-hide">
                                <div className="flex items-center gap-2 shrink-0">
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">KATEGORİ:</span>
                                    <span className="text-[10px] font-bold text-slate-900 uppercase tracking-tight">{selectedTicket.category.replace('_', ' ')}</span>
                                </div>
                                <div className="w-px h-3 bg-slate-200 shrink-0" />
                                <div className="flex items-center gap-2 shrink-0">
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">ÖNCELİK:</span>
                                    <span className={`text-[10px] font-bold uppercase tracking-tight ${selectedTicket.priority === 'URGENT' ? 'text-rose-600' : 'text-slate-900'}`}>{selectedTicket.priority}</span>
                                </div>
                                <div className="w-px h-3 bg-slate-200 shrink-0" />
                                <div className="flex items-center gap-2 shrink-0">
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">TARİH:</span>
                                    <span className="text-[10px] font-bold text-slate-900 uppercase tracking-tight">{new Date(selectedTicket.createdAt).toLocaleString('tr-TR')}</span>
                                </div>
                            </div>

                            {/* Chat Messages */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50 scrollbar-hide">
                                <AnimatePresence initial={false}>
                                    {selectedTicket.messages?.map((msg, idx) => (
                                        <motion.div
                                            key={msg.id || idx}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`flex ${!msg.isAdmin ? 'justify-start' : 'justify-end'}`}
                                        >
                                            <div className={`max-w-[70%] flex items-start gap-3 ${!msg.isAdmin ? 'flex-row' : 'flex-row-reverse'}`}>
                                                <div className={`w-8 h-8 rounded-[6px] flex items-center justify-center flex-shrink-0 shadow-sm ${!msg.isAdmin ? 'bg-white border border-slate-200 text-slate-400' : 'bg-slate-900 text-white'}`}>
                                                    {!msg.isAdmin ? <Building2 size={14} /> : <ShieldCheck size={14} />}
                                                </div>
                                                <div className="space-y-1.5">
                                                    <div className={`px-4 py-3 rounded-[6px] shadow-sm text-[13px] leading-relaxed font-medium ${!msg.isAdmin ? 'bg-white border border-slate-200 text-slate-800' : 'bg-slate-900 text-white'}`}>
                                                        {!msg.isAdmin && (
                                                            <div className="flex items-center gap-1.5 mb-1.5 pb-1.5 border-b border-slate-100">
                                                                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">{selectedTicket.tenant.name}</span>
                                                            </div>
                                                        )}
                                                        {msg.message}
                                                    </div>
                                                    <p className={`text-[9px] font-medium text-slate-400 tracking-widest block px-1 ${!msg.isAdmin ? 'text-left' : 'text-right'}`}>
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
                            <div className="p-5 border-t border-slate-200 bg-white">
                                <form onSubmit={handleSendMessage} className="relative group max-w-4xl mx-auto flex items-end gap-3">
                                    <textarea
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Talebe yanıtınızı buraya yazın..."
                                        className="w-full flex-1 min-h-[50px] max-h-[150px] bg-slate-50 border border-slate-200 rounded-[6px] px-4 py-3 text-[13px] font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white transition-all resize-y shadow-sm"
                                    />
                                    <button
                                        type="submit"
                                        disabled={messageLoading || !newMessage.trim()}
                                        className="w-11 h-11 shrink-0 bg-slate-900 text-white rounded-[6px] flex items-center justify-center hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50 disabled:scale-100 shadow-sm disabled:cursor-not-allowed mb-0.5"
                                    >
                                        <Send size={16} strokeWidth={2.5} className="-ml-0.5" />
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="text-center space-y-6 max-w-md px-8">
                            <div className="w-16 h-16 bg-white border border-slate-200 rounded-[6px] shadow-sm flex items-center justify-center mx-auto text-slate-300">
                                <Inbox size={28} strokeWidth={1.5} />
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-[18px] font-semibold text-slate-900 uppercase tracking-tight">ADMIN KONTROL MERKEZİ</h3>
                                <p className="text-[12px] font-medium text-slate-500 leading-relaxed max-w-xs mx-auto">
                                    Restoranlardan gelen tüm destek taleplerini buradan inceleyebilir, yanıtlayabilir ve çözüme kavuşturabilirsiniz.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

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
