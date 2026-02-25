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
                                    <span className="text-slate-900 uppercase">ÜYELİK PLANI</span>
                                </div>

                                <div className="flex items-center gap-4">
                                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight uppercase leading-none">ABONELİK YÖNETİMİ</h1>
                                    <div className="h-0.5 w-0.5 bg-slate-300 rounded-full" />
                                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest px-2 py-0.5 bg-slate-100 border border-slate-200 rounded-[4px]">{tenantName}</span>
                                </div>
                            </div>

                            <Link
                                href="/yardim"
                                className="flex items-center justify-center gap-3 bg-slate-900 text-white px-6 py-3 rounded-[6px] text-[10px] font-bold tracking-widest hover:bg-slate-800 transition-all active:scale-95 shadow-md uppercase"
                            >
                                <ShieldAlert size={15} />
                                DESTEK & YARDIM
                            </Link>
                        </div>
                        <ProfileDropdown />
                    </div>
                </div>
            </div>

            <div className="p-4 lg:p-6">
                <div className="w-full mx-auto space-y-12">
                    {/* Current Plan Elite Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-[6px] border border-slate-200 p-8 shadow-sm relative overflow-hidden group"
                    >
                        <div className="relative flex flex-col lg:flex-row items-center gap-10">
                            <div className="flex-1 space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="bg-slate-900 text-white p-3.5 rounded-[6px]">
                                        <Zap size={22} strokeWidth={2.5} />
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">AKTİF ABONELİK</span>
                                        <h2 className="text-3xl font-bold text-slate-900 tracking-tight uppercase leading-none">{currentPlan.name}</h2>
                                    </div>
                                </div>

                                <p className="text-[11px] font-medium text-slate-500 leading-relaxed max-w-xl uppercase tracking-tight">
                                    {currentPlan.name} planının tüm özelliklerini kullanıyorsunuz. Bir sonraki yenileme: <span className="text-slate-900 font-bold">{formatDate(currentPlan.endDate)}</span>
                                </p>

                                <div className="flex flex-wrap gap-2">
                                    <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-[4px] border border-emerald-100">
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                        <span className="text-[9px] font-bold uppercase tracking-widest">SİSTEM ÇALIŞIYOR</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-slate-900 text-white px-3 py-1.5 rounded-[4px] shadow-sm">
                                        <Clock size={12} strokeWidth={2.5} />
                                        <span className="text-[9px] font-bold uppercase tracking-widest leading-none">YILLIK DÖNGÜ</span>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full lg:w-auto grid grid-cols-1 sm:grid-cols-3 gap-0 border border-slate-200 rounded-[6px] shadow-sm overflow-hidden">
                                <div className="bg-slate-50 p-6 flex flex-col items-center sm:items-start min-w-[160px]">
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">YILLIK ÜCRET</p>
                                    <p className="text-xl font-bold text-slate-900 tracking-tight uppercase">
                                        {currentPlan.price === 0 ? '0₺' : `${currentPlan.price}₺`}
                                    </p>
                                </div>
                                <div className="bg-white p-6 flex flex-col items-center sm:items-start border-t sm:border-t-0 sm:border-l border-slate-200 min-w-[160px]">
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">BAŞLANGIÇ</p>
                                    <p className="text-xl font-bold text-slate-900 tracking-tight uppercase">
                                        {formatDate(currentPlan.startDate).split(' ')[1] || 'BELİRSİZ'}
                                    </p>
                                </div>
                                <div className="bg-slate-50 p-6 flex flex-col items-center sm:items-start border-t sm:border-t-0 sm:border-l border-slate-200 min-w-[160px]">
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">KAPASİTE</p>
                                    <p className="text-xl font-bold text-slate-900 tracking-tight uppercase">{currentPlan.branchLimit} ŞUBE</p>
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
                                <span className="text-[10px] font-bold text-orange-600 uppercase tracking-widest">YILLIK %20 TASARRUF</span>
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
                                        className={`group relative bg-white rounded-[6px] p-8 border transition-all duration-300 flex flex-col ${isCurrent ? 'border-slate-900 shadow-xl' : 'border-slate-200 hover:border-slate-400 shadow-sm'}`}
                                    >
                                        {isCurrent && (
                                            <div className="absolute -top-3 left-6 bg-slate-900 text-white px-3 py-1 rounded-[4px] text-[8px] font-bold uppercase tracking-widest shadow-md">
                                                MEVCUT PLAN
                                            </div>
                                        )}

                                        <div className="space-y-2 mb-8 border-b border-slate-50 pb-6">
                                            <h4 className="text-lg font-bold text-slate-900 tracking-tight uppercase leading-none">{plan.name}</h4>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-3xl font-bold text-slate-900 tracking-tight uppercase leading-none">
                                                    {plan.price === 0 ? '0₺' : `${plan.price}₺`}
                                                </span>
                                                <span className="text-[9px] text-slate-400 font-bold tracking-widest">/YIL</span>
                                            </div>
                                        </div>

                                        <div className="flex-1 space-y-4 mb-8">
                                            <div className="space-y-3.5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-5 h-5 bg-slate-900 text-white flex items-center justify-center rounded-[2px] shadow-sm">
                                                        <Check size={10} strokeWidth={4} />
                                                    </div>
                                                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">{plan.branchLimit} ADET ŞUBE</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-5 h-5 bg-slate-900 text-white flex items-center justify-center rounded-[2px] shadow-sm">
                                                        <Check size={10} strokeWidth={4} />
                                                    </div>
                                                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">{plan.tableLimit} MASA KAPASİTESİ</span>
                                                </div>
                                                {plan.features.slice(0, 5).map((feature, idx) => (
                                                    <div key={idx} className="flex items-center gap-3 group/feat">
                                                        <div className="w-5 h-5 bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 rounded-[2px] group-hover/feat:text-slate-900 transition-colors">
                                                            <Check size={10} strokeWidth={4} />
                                                        </div>
                                                        <span className="text-[10px] font-medium text-slate-500 uppercase tracking-tight leading-tight group-hover/feat:text-slate-900 transition-colors">{feature}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <button
                                            disabled={isCurrent}
                                            className={`w-full py-3.5 rounded-[6px] text-[10px] font-bold tracking-widest transition-all uppercase ${isCurrent ? 'bg-slate-50 text-slate-300 cursor-default border border-slate-100' : 'bg-white border border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white shadow-sm active:scale-95'}`}
                                        >
                                            {isCurrent ? 'BU PLANI KULLANIYORSUNUZ' : 'ABONELİĞİ YÜKSELT'}
                                        </button>
                                    </motion.div>
                                );
                            })}
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-slate-900 p-8 rounded-[6px] border border-slate-800 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden shadow-xl"
                        >
                            <div className="w-16 h-16 bg-white/10 rounded-[6px] flex items-center justify-center">
                                <ShieldAlert size={32} className="text-white" strokeWidth={1.5} />
                            </div>

                            <div className="flex-1 space-y-2 text-center md:text-left relative z-10">
                                <h4 className="text-lg font-bold text-white tracking-tight uppercase leading-none">İPTAL VE İADE POLİTİKASI</h4>
                                <p className="text-[10px] font-medium leading-relaxed text-slate-400 uppercase tracking-tight max-w-2xl">
                                    Üyeliğinizi iptal ettiğinizde, mevcut faturalandırma dönemi sonuna kadar tüm özelliklerden yararlanmaya devam edebilirsiniz.
                                    İade talepleri için <Link href="/iletisim" className="text-white underline decoration-white/20 hover:decoration-white transition-all underline-offset-4 font-bold">MÜŞTERİ DENEYİMİ EKİBİ</Link> ile irtibata geçiniz.
                                </p>
                            </div>

                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <ShieldAlert size={120} className="text-white" />
                            </div>
                        </motion.div>

                        {/* Footer Area */}
                        <div className="py-12 border-t border-slate-100 text-center">
                            <p className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.3em]">
                                {new Date().getFullYear()} QRlamenü — ENDÜSTRİYEL MENÜ YÖNETİM SİSTEMİ
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
