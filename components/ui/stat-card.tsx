import React from 'react';

export type StatCardProps = {
    title: string;
    value: string | number;
    subtitle?: string;
    statusLabel?: string;
    muted?: boolean;
};

export const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    subtitle,
    statusLabel,
    muted = false,
}) => (
    <div
        className={`bg-white border rounded-[6px] p-4 flex flex-col justify-between min-h-[105px] transition-all duration-150 shadow-sm hover:border-slate-300 ${muted ? 'border-slate-100' : 'border-slate-200/60'
            }`}
    >
        <div className="flex items-center justify-between">
            <h3 className="text-[13px] font-semibold text-slate-500 tracking-tight">
                {title}
            </h3>
            {statusLabel && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-100 text-emerald-600 bg-emerald-50/30">
                    {statusLabel}
                </span>
            )}
        </div>
        <div>
            <p className="text-[28px] font-bold text-slate-900 leading-none tracking-tight">
                {value}
            </p>
            {subtitle && (
                <p className="mt-2 text-[12px] font-medium text-slate-400">
                    {subtitle}
                </p>
            )}
        </div>
    </div>
);

