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
            <div className="bg-white border-b-2 border-gray-50 pt-16 pb-12 px-8 md:px-12">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="space-y-4">
                            {/* Breadcrumbs */}
                            <div className="flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                <Link href="/dashboard" className="hover:text-orange-500 transition-colors">PANEL</Link>
                                <ChevronRight size={10} className="text-gray-300" />
                                <span className="text-orange-500">ÜYELİK PLANI</span>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 bg-gray-900 rounded-[32px] flex items-center justify-center shadow-2xl shadow-gray-900/20 transform-gpu hover:scale-110 transition-transform duration-500">
                                    <Crown size={36} className="text-orange-500" strokeWidth={1.5} />
                                </div>
                                <div className="space-y-1">
                                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase leading-none">ÜYELİK & PLAN</h1>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">ABONELİK YÖNETİMİ</span>
                                        <div className="h-1 w-1 bg-gray-300 rounded-full" />
                                        <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] bg-orange-50 px-3 py-1 rounded-full border border-orange-100">{tenantName.toUpperCase()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <Link
                                href="/yardim"
                                className="flex items-center justify-center gap-3 bg-white border-2 border-gray-100 text-gray-900 px-8 py-5 rounded-[24px] text-[10px] font-black tracking-widest hover:border-orange-500 hover:text-orange-500 transition-all active:scale-95"
                            >
                                <ShieldAlert size={16} />
                                DESTEK AL
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-8 md:p-12 lg:p-16">
                <div className="max-w-7xl mx-auto space-y-12">
                    {/* Current Plan Elite Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-[40px] border-2 border-orange-100 p-8 md:p-12 shadow-2xl shadow-orange-900/5 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 blur-[100px] -mr-32 -mt-32 rounded-full" />

                        <div className="relative flex flex-col lg:flex-row items-center gap-12">
                            <div className="flex-1 space-y-8">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 bg-orange-500 rounded-[24px] flex items-center justify-center shadow-xl shadow-orange-500/20 rotate-3 transform-gpu group-hover:rotate-0 transition-transform duration-500">
                                        <Zap size={28} className="text-white" fill="white" />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] mb-1 block">MEVCUT ABONELİĞİNİZ</span>
                                        <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase leading-none">{currentPlan.name}</h2>
                                    </div>
                                </div>

                                <p className="text-sm font-medium text-gray-400 leading-relaxed max-w-xl uppercase tracking-wider">
                                    {currentPlan.name} planının tüm ayrıcalıklı özelliklerinden faydalanıyorsunuz.
                                    Bir sonraki yenileme tarihiniz <span className="text-gray-900 font-black">{formatDate(currentPlan.endDate)}</span> olarak belirlenmiştir.
                                </p>

                                <div className="flex flex-wrap gap-4">
                                    <div className="flex items-center gap-3 bg-emerald-50 text-emerald-600 px-5 py-3 rounded-[18px] border border-emerald-100">
                                        <CheckCircle2 size={16} strokeWidth={3} />
                                        <span className="text-[10px] font-black uppercase tracking-widest leading-none">PLAN AKTİF</span>
                                    </div>
                                    <div className="flex items-center gap-3 bg-blue-50 text-blue-600 px-5 py-3 rounded-[18px] border border-blue-100">
                                        <Clock size={16} strokeWidth={3} />
                                        <span className="text-[10px] font-black uppercase tracking-widest leading-none">YILLIK ÖDEME</span>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full lg:w-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="bg-gray-50/50 p-6 rounded-[32px] border-2 border-transparent hover:border-gray-100 transition-all group/stat min-w-[180px]">
                                    <CreditCard className="text-gray-300 group-hover/stat:text-orange-500 transition-colors mb-4" size={24} />
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">FİYAT</p>
                                    <p className="text-xl font-black text-gray-900 tracking-tighter uppercase">
                                        {currentPlan.price === 0 ? 'ÜCRETSİZ' : `${currentPlan.price}₺ / Y`}
                                    </p>
                                </div>
                                <div className="bg-gray-50/50 p-6 rounded-[32px] border-2 border-transparent hover:border-gray-100 transition-all group/stat min-w-[180px]">
                                    <Calendar className="text-gray-300 group-hover/stat:text-orange-500 transition-colors mb-4" size={24} />
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">YENİLEME</p>
                                    <p className="text-xl font-black text-gray-900 tracking-tighter uppercase">
                                        {formatDate(currentPlan.endDate).split(' ')[1] || 'SÜRESİZ'}
                                    </p>
                                </div>
                                <div className="bg-gray-50/50 p-6 rounded-[32px] border-2 border-transparent hover:border-gray-100 transition-all group/stat min-w-[180px]">
                                    <LayoutGrid className="text-gray-300 group-hover/stat:text-orange-500 transition-colors mb-4" size={24} />
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">KAPASİTE</p>
                                    <p className="text-xl font-black text-gray-900 tracking-tighter uppercase">{currentPlan.branchLimit} ŞUBE</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <div className="space-y-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="space-y-1">
                                <h3 className="text-2xl font-black text-gray-900 tracking-tighter uppercase leading-none">DİĞER PLAN SEÇENEKLERİ</h3>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">RESTORANINIZI BİR ÜST SEVİYEYE TAŞIYIN</p>
                            </div>
                            <div className="flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-full border border-orange-100">
                                <Star size={14} className="text-orange-500 fill-orange-500" />
                                <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">YILLIK %20 TASARRUF</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {allPlans.map((plan, index) => {
                                const isCurrent = plan.id === currentPlan.id;
                                return (
                                    <motion.div
                                        key={plan.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 + (index * 0.1) }}
                                        className={`group relative bg-white rounded-[40px] p-10 border-2 transition-all duration-500 flex flex-col ${isCurrent ? 'border-orange-500 shadow-2xl shadow-orange-900/10' : 'border-slate-50 hover:border-gray-200 shadow-sm'}`}
                                    >
                                        {isCurrent && (
                                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-500 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl shadow-orange-500/30">
                                                MEVCUT PLAN
                                            </div>
                                        )}

                                        <div className="text-center space-y-4 mb-10">
                                            <h4 className="text-xl font-black text-gray-900 tracking-tighter uppercase leading-none">{plan.name}</h4>
                                            <div className="text-4xl font-black text-orange-500 tracking-tighter uppercase leading-none">
                                                {plan.price === 0 ? 'ÜCRETSİZ' : (
                                                    <>
                                                        {plan.price}<span className="text-lg text-gray-300 font-black ml-1">₺</span>
                                                        <span className="text-[10px] text-gray-400 font-black tracking-widest block mt-2">YILLIK ÖDEME</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex-1 space-y-6 mb-10">
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-4 group/item">
                                                    <div className="w-8 h-8 rounded-[12px] bg-emerald-50 flex items-center justify-center text-emerald-500 group-hover/item:bg-emerald-500 group-hover/item:text-white transition-all">
                                                        <Check size={14} strokeWidth={4} />
                                                    </div>
                                                    <span className="text-[11px] font-black text-gray-500 uppercase tracking-widest">{plan.branchLimit} ŞUBE OLUŞTURMA</span>
                                                </div>
                                                <div className="flex items-center gap-4 group/item">
                                                    <div className="w-8 h-8 rounded-[12px] bg-emerald-50 flex items-center justify-center text-emerald-500 group-hover/item:bg-emerald-500 group-hover/item:text-white transition-all">
                                                        <Check size={14} strokeWidth={4} />
                                                    </div>
                                                    <span className="text-[11px] font-black text-gray-500 uppercase tracking-widest">{plan.tableLimit} MASA KAPASİTESİ</span>
                                                </div>
                                                {plan.features.slice(0, 5).map((feature, idx) => (
                                                    <div key={idx} className="flex items-center gap-4 group/item">
                                                        <div className="w-8 h-8 rounded-[12px] bg-emerald-50 flex items-center justify-center text-emerald-500 group-hover/item:bg-emerald-500 group-hover/item:text-white transition-all">
                                                            <Check size={14} strokeWidth={4} />
                                                        </div>
                                                        <span className="text-[11px] font-black text-gray-500 uppercase tracking-widest leading-tight">{feature.toUpperCase()}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <button
                                            disabled={isCurrent}
                                            className={`w-full py-5 rounded-[24px] text-[10px] font-black tracking-[0.2em] transition-all active:scale-95 ${isCurrent ? 'bg-gray-50 text-gray-300 border-2 border-gray-100 cursor-default' : 'bg-gray-900 text-white hover:bg-orange-500 shadow-xl shadow-gray-900/10 border-b-4 border-black/20'}`}
                                        >
                                            {isCurrent ? 'KULLANIMDA' : 'PLANA GEÇ'}
                                        </button>
                                    </motion.div>
                                );
                            })}
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-rose-50 rounded-[40px] p-10 border-2 border-rose-100/50 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 blur-[50px] -mr-16 -mt-16 rounded-full" />

                            <div className="w-20 h-20 bg-white rounded-[32px] flex items-center justify-center shadow-xl shadow-rose-500/10">
                                <ShieldAlert size={32} className="text-rose-500" strokeWidth={1.5} />
                            </div>

                            <div className="flex-1 space-y-2 text-center md:text-left">
                                <h4 className="text-xl font-black text-rose-900 tracking-tighter uppercase leading-none">İPTAL POLİTİKASI</h4>
                                <p className="text-xs font-medium text-rose-600/80 uppercase tracking-widest leading-relaxed">
                                    Üyeliğinizi iptal ettiğinizde, mevcut dönem sonuna kadar özelliklerden yararlanmaya devam edebilirsiniz.
                                    Destek için <Link href="/iletisim" className="text-rose-700 font-black underline decoration-2 underline-offset-4 decoration-rose-200 hover:decoration-rose-500 transition-all">DESTEK EKİBİ</Link> ile iletişime geçin.
                                </p>
                            </div>
                        </motion.div>

                        {/* Footer Area */}
                        <div className="pt-12 border-t-2 border-gray-50 flex flex-col md:flex-row items-center justify-between gap-6 opacity-30">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-gray-900 rounded-[14px] flex items-center justify-center">
                                    <span className="text-white font-black text-xs">Q</span>
                                </div>
                                <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">QRLAMENÜ © 2024</span>
                            </div>
                            <div className="flex items-center gap-8">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest cursor-pointer hover:text-orange-500 transition-colors">GÜVENLİK</span>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest cursor-pointer hover:text-orange-500 transition-colors">KOŞULLAR</span>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest cursor-pointer hover:text-orange-500 transition-colors">GİZLİLİK</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
