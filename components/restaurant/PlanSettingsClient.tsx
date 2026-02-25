"use client";
import {
    Check,
    Crown,
    CreditCard,
    Calendar,
    Star,
    ChevronRight,
    ShieldAlert,
    Zap,
    History,
    ArrowUpRight,
    LayoutGrid,
    CheckCircle2,
    Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

import { MobileMenuToggle, ProfileDropdown } from '@/components/HeaderActions';

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
        startDate?: Date;
        endDate?: Date;
    };
    allPlans: Plan[];
    tenantName: string;
}

export default function PlanSettingsClient({ currentPlan, allPlans, tenantName }: PlanSettingsClientProps) {
    const formatDate = (date?: Date) => {
        if (!date) return 'SÜRESİZ';
        return new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(date)).toUpperCase();
    };

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            {/* Header Area */}
            <div className="bg-white border-b border-slate-200 py-5 px-6 relative z-30">
                <div className="w-full mx-auto">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-start md:items-center gap-4 md:gap-6">
                            <MobileMenuToggle />
                            <div className="space-y-4">
                                {/* Breadcrumbs */}
                                <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                    <Link href="/dashboard" className="hover:text-slate-900 transition-colors">PANEL</Link>
                                    <ChevronRight size={8} className="text-slate-300" />
                                    <span className="text-slate-900 uppercase tracking-[0.2em]">ABONELİK YÖNETİMİ</span>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="bg-slate-900 text-white p-3 rounded-[6px] shadow-sm">
                                        <CreditCard size={20} className="text-white" strokeWidth={2.5} />
                                    </div>
                                    <div className="space-y-1">
                                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight leading-none uppercase">PLAN & ÖDEME</h1>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">ABONELİK DURUMU</span>
                                            <div className="h-0.5 w-0.5 bg-slate-200 rounded-full" />
                                            <span className="text-[9px] font-bold text-slate-900 px-2 py-0.5 bg-slate-100 border border-slate-200 rounded-[4px] uppercase tracking-widest">{tenantName}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Link
                                    href="/yardim"
                                    className="h-9 flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-900 px-5 rounded-[6px] text-[10px] font-bold tracking-widest hover:border-slate-900 transition-all active:scale-95 uppercase shadow-sm"
                                >
                                    <ShieldAlert size={14} strokeWidth={2.5} />
                                    DESTEK AL
                                </Link>
                                <button
                                    className="h-9 bg-slate-100 text-slate-400 px-6 rounded-[6px] flex items-center gap-2 text-[10px] font-bold tracking-widest cursor-not-allowed uppercase grayscale"
                                    disabled
                                >
                                    <CreditCard size={14} strokeWidth={2.5} />
                                    KAYITLI KARTLAR
                                </button>
                            </div>
                        </div>
                        <ProfileDropdown />
                    </div>
                </div>
            </div>

            <div className="p-4 lg:p-6">
                <div className="w-full mx-auto space-y-6">
                    {/* Current Plan Elite Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-[6px] shadow-sm border border-slate-200 overflow-hidden"
                    >
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div className="flex items-center gap-3">
                                <div className="bg-slate-900 text-white p-2 rounded-[4px]">
                                    <Zap size={15} strokeWidth={2.5} />
                                </div>
                                <h3 className="text-[11px] font-bold text-slate-900 uppercase tracking-widest">AKTİF ABONELİK BİLGİLERİ</h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full border border-emerald-100">
                                    <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                                    <span className="text-[9px] font-bold uppercase tracking-widest leading-none">SİSTEM AKTİF</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-8">
                            <div className="relative flex flex-col lg:flex-row items-center gap-10">
                                <div className="flex-1 space-y-6">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3">
                                            <h2 className="text-4xl font-bold text-slate-900 tracking-tighter uppercase leading-none">{currentPlan.name}</h2>
                                            <div className="h-2 w-2 bg-[#ff6e01] rounded-full shadow-[0_0_10px_rgba(255,110,1,0.5)]" />
                                        </div>
                                        <p className="text-[11px] font-bold text-slate-400 leading-relaxed max-w-xl uppercase tracking-widest">
                                            {currentPlan.name} planı ile tüm özellikler kilitsiz. Bir sonraki yenileme: <span className="text-slate-900">{formatDate(currentPlan.endDate)}</span>
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        <div className="flex items-center gap-2 bg-slate-900 text-white px-3 py-1.5 rounded-[4px] shadow-sm">
                                            <Clock size={12} strokeWidth={2.5} />
                                            <span className="text-[9px] font-bold uppercase tracking-widest leading-none">YILLIK DÖNGÜ</span>
                                        </div>
                                        <div className="flex items-center gap-2 bg-slate-50 text-slate-400 px-3 py-1.5 rounded-[4px] border border-slate-100">
                                            <ShieldAlert size={12} strokeWidth={2.5} />
                                            <span className="text-[9px] font-bold uppercase tracking-widest leading-none">GÜVENLİ ÖDEME</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full lg:w-auto grid grid-cols-1 sm:grid-cols-3 gap-0 border border-slate-200 rounded-[6px] shadow-sm overflow-hidden bg-slate-50/50">
                                    <div className="p-6 flex flex-col items-center sm:items-start min-w-[160px]">
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">YILLIK ÜCRET</p>
                                        <p className="text-xl font-bold text-slate-900 tracking-tight uppercase">
                                            {currentPlan.price === 0 ? 'PELİTSİZ' : `${currentPlan.price}₺`}
                                        </p>
                                    </div>
                                    <div className="p-6 flex flex-col items-center sm:items-start border-t sm:border-t-0 sm:border-l border-slate-200 min-w-[160px] bg-white">
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">BAŞLANGIÇ</p>
                                        <p className="text-xl font-bold text-slate-900 tracking-tight uppercase">
                                            {formatDate(currentPlan.startDate).split(' ')[1] || 'BELİRSİZ'}
                                        </p>
                                    </div>
                                    <div className="p-6 flex flex-col items-center sm:items-start border-t sm:border-t-0 sm:border-l border-slate-200 min-w-[160px]">
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">KAPASİTE</p>
                                        <p className="text-xl font-bold text-slate-900 tracking-tight uppercase">{currentPlan.branchLimit} ŞUBE</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <div className="space-y-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="space-y-1">
                                <h3 className="text-2xl font-bold text-slate-900 tracking-tight uppercase leading-none">DİĞER PLAN SEÇENEKLERİ</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">RESTORANINIZI BİR ÜST SEVİYEYE TAŞIYIN</p>
                            </div>
                            <div className="flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-full border border-orange-100">
                                <Star size={14} className="text-orange-600 fill-orange-500" />
                                <span className="text-[10px] font-bold text-orange-600 uppercase tracking-widest leading-none">YILLIK %20 TASARRUF</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {allPlans.map((plan, index) => {
                                const isCurrent = plan.id === currentPlan.id;
                                return (
                                    <motion.div
                                        key={plan.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 + (index * 0.1) }}
                                        className={`group relative bg-white rounded-[6px] p-8 border transition-all duration-300 flex flex-col ${isCurrent ? 'border-[#ff6e01] ring-1 ring-[#ff6e01] shadow-xl bg-orange-50/5' : 'border-slate-200 hover:border-slate-400 shadow-sm'}`}
                                    >
                                        {isCurrent && (
                                            <div className="absolute -top-3 left-6 bg-[#ff6e01] text-white px-3 py-1 rounded-[4px] text-[8px] font-bold uppercase tracking-widest shadow-md">
                                                AKTİF KULLANIM
                                            </div>
                                        )}

                                        <div className="space-y-2 mb-8 border-b border-slate-50 pb-6">
                                            <h4 className="text-lg font-bold text-slate-900 tracking-tight uppercase leading-none">{plan.name}</h4>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-3xl font-bold text-slate-900 tracking-tighter uppercase leading-none">
                                                    {plan.price === 0 ? 'PELİTSİZ' : `${plan.price}₺`}
                                                </span>
                                                <span className="text-[9px] text-slate-400 font-bold tracking-widest">/ YIL</span>
                                            </div>
                                        </div>

                                        <div className="flex-1 space-y-4 mb-8">
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-5 h-5 bg-slate-900 text-white flex items-center justify-center rounded-[2px] shadow-sm">
                                                        <Check size={10} strokeWidth={4} />
                                                    </div>
                                                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{plan.branchLimit} ADET ŞUBE</span>
                                                </div>
                                                <div className="flex items-center gap-3 pb-2 border-b border-slate-50">
                                                    <div className="w-5 h-5 bg-slate-900 text-white flex items-center justify-center rounded-[2px] shadow-sm">
                                                        <Check size={10} strokeWidth={4} />
                                                    </div>
                                                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{plan.tableLimit} MASA KAPASİTESİ</span>
                                                </div>
                                                <div className="space-y-2.5 pt-2">
                                                    {plan.features.slice(0, 6).map((feature, idx) => (
                                                        <div key={idx} className="flex items-center gap-3 group/feat">
                                                            <div className="w-1.5 h-1.5 bg-slate-200 rounded-full group-hover/feat:bg-[#ff6e01] transition-colors" />
                                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight group-hover/feat:text-slate-900 transition-colors">{feature}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            disabled={isCurrent}
                                            className={`h-9 w-full rounded-[6px] text-[10px] font-bold tracking-widest transition-all uppercase ${isCurrent ? 'bg-slate-50 text-slate-300 cursor-default border border-slate-100' : 'bg-slate-900 text-white hover:bg-slate-800 shadow-md active:scale-95'}`}
                                        >
                                            {isCurrent ? 'MEVCUT PAKET' : 'ŞİMDİ YÜKSELT'}
                                        </button>
                                    </motion.div>
                                );
                            })}
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white p-8 rounded-[6px] border border-slate-200 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden shadow-sm"
                        >
                            <div className="w-16 h-16 bg-slate-900 text-white rounded-[6px] flex items-center justify-center shadow-lg">
                                <ShieldAlert size={32} strokeWidth={1.5} />
                            </div>

                            <div className="flex-1 space-y-2 text-center md:text-left relative z-10">
                                <h4 className="text-lg font-bold text-slate-900 tracking-tight uppercase leading-none">İPTAL VE İADE POLİTİKASI</h4>
                                <p className="text-[11px] font-bold leading-relaxed text-slate-400 uppercase tracking-widest max-w-2xl">
                                    Üyeliğinizi dilediğiniz zaman iptal edebilirsiniz. İptal durumunda mevcut dönem sonuna kadar erişiminiz devam eder.
                                    İade süreçleri ve fatura talepleriniz için <Link href="/yardim" className="text-slate-900 underline decoration-slate-200 hover:decoration-slate-900 transition-all underline-offset-4">DESTEK MERKEZİ</Link> üzerinden bizimle iletişime geçebilirsiniz.
                                </p>
                            </div>

                            <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                                <ShieldAlert size={120} className="text-slate-900" />
                            </div>
                        </motion.div>

                        {/* Footer Area */}
                        <div className="w-full mx-auto mt-12 py-12 text-center space-y-4">
                            <div className="flex items-center justify-center gap-4">
                                <div className="h-px w-8 bg-slate-200" />
                                <p className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.4em] leading-none">© {new Date().getFullYear()} MESA DİJİTAL — BULUT TABANLI MENÜ SİSTEMİ</p>
                                <div className="h-px w-8 bg-slate-200" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
