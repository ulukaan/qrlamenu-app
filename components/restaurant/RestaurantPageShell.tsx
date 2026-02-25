import React from 'react';
import Link from 'next/link';
import { MobileMenuToggle, ProfileDropdown } from '@/components/HeaderActions';

type BreadcrumbItem = {
    label: string;
    href?: string;
};

type RestaurantPageShellProps = {
    title: string;
    subtitle?: string;
    sectionLabel?: string;
    breadcrumb?: BreadcrumbItem[];
    icon?: React.ReactNode;
    children: React.ReactNode;
    rightActions?: React.ReactNode;
};

export function RestaurantPageShell({
    title,
    subtitle,
    sectionLabel,
    breadcrumb = [],
    icon,
    children,
    rightActions
}: RestaurantPageShellProps) {
    return (
        <div className="min-h-full bg-[#f8fafc]">
            {/* Page Header */}
            <header className="bg-white border-b border-slate-100 py-5 px-6 lg:px-10">
                <div className="w-full mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex items-start lg:items-center gap-4 lg:gap-6">
                        <MobileMenuToggle />
                        <div className="space-y-3">
                            {/* Breadcrumbs */}
                            {breadcrumb.length > 0 && (
                                <nav className="flex items-center gap-2 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                    {breadcrumb.map((item, index) => (
                                        <React.Fragment key={`${item.label}-${index}`}>
                                            {index > 0 && <span className="text-slate-300">/</span>}
                                            {item.href ? (
                                                <Link
                                                    href={item.href}
                                                    className="hover:text-slate-900 transition-colors"
                                                >
                                                    {item.label}
                                                </Link>
                                            ) : (
                                                <span className="text-slate-900">{item.label}</span>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </nav>
                            )}

                            <div className="flex items-center gap-4">
                                {icon && (
                                    <div className="w-11 h-11 bg-slate-900 text-white rounded-md flex items-center justify-center shadow-sm">
                                        {icon}
                                    </div>
                                )}
                                <div className="space-y-1">
                                    <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                                        {title}
                                    </h1>
                                    {(subtitle || sectionLabel) && (
                                        <div className="flex flex-wrap items-center gap-2">
                                            {sectionLabel && (
                                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                                    {sectionLabel}
                                                </span>
                                            )}
                                            {subtitle && (
                                                <span className="text-[11px] text-gray-500 font-medium leading-relaxed">
                                                    {subtitle}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap justify-end">
                        {rightActions}
                        <ProfileDropdown />
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="p-6 lg:p-10 w-full mx-auto">
                <div className="w-full max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}

