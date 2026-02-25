"use client";
import React from 'react';
import { MobileMenuToggle, ProfileDropdown } from './HeaderActions';
import Logo from './Logo';
import Link from 'next/link';

const MobileHeader = () => {
    return (
        <header className="lg:hidden flex items-center justify-between px-4 h-16 bg-white border-b border-slate-200 sticky top-0 z-[100] w-full shadow-sm flex-shrink-0">
            <div className="flex items-center gap-4">
                <MobileMenuToggle />
                <Link href="/dashboard" className="transition-opacity hover:opacity-80">
                    <Logo size={28} />
                </Link>
            </div>
            <ProfileDropdown />
        </header>
    );
};

export default MobileHeader;
