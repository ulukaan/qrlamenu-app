"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
    const router = useRouter();

    useEffect(() => {
        const performLogout = async () => {
            try {
                await fetch('/api/auth/logout', { method: 'POST' });
            } catch (error) {
                console.error('Logout failed', error);
            } finally {
                router.push('/login');
                router.refresh(); // Clear client cache
            }
        };

        performLogout();
    }, [router]);

    return (
        <div className="flex items-center justify-center h-screen bg-slate-50">
            <div className="text-center">
                <h2 className="text-xl font-semibold text-slate-700 mb-2">Çıkış Yapılıyor...</h2>
                <p className="text-slate-500">Lütfen bekleyin, ana sayfaya yönlendiriliyorsunuz.</p>
            </div>
        </div>
    );
}
