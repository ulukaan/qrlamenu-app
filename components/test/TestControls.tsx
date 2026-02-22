"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ChefHat, Bell, Loader2, ArrowRight, Wallet, Users, Zap } from 'lucide-react';

interface TestControlsProps {
    tenantId: string;
    slug: string;
    productCount: number;
}

export default function TestControls({ tenantId, slug, productCount }: TestControlsProps) {
    const [loading, setLoading] = useState<'NONE' | 'ORDER' | 'CALL' | 'BUSY' | 'BILL'>('NONE');
    const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

    const getRandomItem = (items: any[]) => items[Math.floor(Math.random() * items.length)];

    const createOrder = async (isTable: boolean) => {
        const tableId = isTable ? (Math.floor(Math.random() * 20) + 1).toString() : null;

        const menuItems = [
            { name: "Hamburger", price: 250 },
            { name: "Cheeseburger", price: 280 },
            { name: "Pizza Margherita", price: 300 },
            { name: "Cola", price: 50 },
            { name: "Ayran", price: 30 },
            { name: "Tiramisu", price: 150 },
            { name: "Çay", price: 15 },
            { name: "Su", price: 10 }
        ];

        const selectedItems: Record<string, any> = {};
        let total = 0;
        const itemCount = Math.floor(Math.random() * 4) + 1; // 1-4 items

        for (let i = 0; i < itemCount; i++) {
            const item = getRandomItem(menuItems);
            const key = `item-${Date.now()}-${i}-${Math.random()}`;
            selectedItems[key] = {
                name: item.name,
                quantity: 1,
                price: item.price
            };
            total += item.price;
        }

        const res = await fetch('/api/restaurant/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                tenantId,
                tableId,
                items: selectedItems,
                totalAmount: total
            })
        });

        return { res, tableId };
    };

    const simulateOrder = async (type: 'TABLE' | 'PACKAGE') => {
        setLoading('ORDER');
        setResult(null);
        try {
            const { res, tableId } = await createOrder(type === 'TABLE');

            if (res.ok) {
                setResult({
                    success: true,
                    message: type === 'TABLE' ? `Sipariş: Masa ${tableId}` : 'Sipariş: Paket Servis'
                });
            } else {
                setResult({ success: false, message: 'Sipariş Hatası' });
            }
        } catch (error) {
            setResult({ success: false, message: 'Bağlantı Hatası' });
        } finally {
            setLoading('NONE');
        }
    };

    const simulateBusyHour = async () => {
        setLoading('BUSY');
        setResult({ success: true, message: 'Yoğun saat simülasyonu başladı...' });

        let successCount = 0;
        const orderCount = 5;

        try {
            for (let i = 0; i < orderCount; i++) {
                await new Promise(resolve => setTimeout(resolve, 800)); // Delay between orders
                const { res } = await createOrder(true);
                if (res.ok) successCount++;
            }
            setResult({ success: true, message: `Tamamlandı: ${successCount} sipariş oluşturuldu.` });
        } catch (error) {
            setResult({ success: false, message: 'Simülasyon hatası' });
        } finally {
            setLoading('NONE');
        }
    };

    const simulateBillRequest = async () => {
        setLoading('BILL');
        // Re-using waiter call API for now as "Bill Request" is a type of notification
        // In a real app we might have a specific type for this
        try {
            const tableId = Math.floor(Math.random() * 20) + 1;
            // Mocking the request - in reality call the waiter-call API with type='BILL' if supported
            const res = await fetch('/api/restaurant/waiter-calls', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tenantId,
                    tableId: tableId.toString(),
                    type: 'BILL' // Passing extra field, API needs to support or ignore
                })
            });

            if (res.ok) {
                setResult({ success: true, message: `Hesap İstendi: Masa ${tableId}` });
            } else {
                setResult({ success: false, message: 'İstek Hatası' });
            }
        } catch (error) {
            setResult({ success: false, message: 'Bağlantı Hatası' });
        } finally {
            setLoading('NONE');
        }
    };

    return (
        <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex flex-col gap-3">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest flex justify-between">
                    <span>Simülasyon Kontrol</span>
                    <Badge variant="outline" className="text-[10px]">{productCount} Ürün</Badge>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => simulateOrder('TABLE')}
                        disabled={loading !== 'NONE'}
                        className="h-9 text-xs justify-start px-2 border-orange-200 text-orange-700 hover:bg-orange-50"
                    >
                        {loading === 'ORDER' ? <Loader2 size={12} className="animate-spin mr-1" /> : <ChefHat size={12} className="mr-1" />}
                        Masa Siparişi
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => simulateOrder('PACKAGE')}
                        disabled={loading !== 'NONE'}
                        className="h-9 text-xs justify-start px-2 border-purple-200 text-purple-700 hover:bg-purple-50"
                    >
                        {loading === 'ORDER' ? <Loader2 size={12} className="animate-spin mr-1" /> : <ChefHat size={12} className="mr-1" />}
                        Paket Sipariş
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={simulateBusyHour}
                        disabled={loading !== 'NONE'}
                        className="h-9 text-xs justify-start px-2 border-red-200 text-red-700 hover:bg-red-50"
                    >
                        {loading === 'BUSY' ? <Loader2 size={12} className="animate-spin mr-1" /> : <Zap size={12} className="mr-1" />}
                        Yoğun Saat (5x)
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={simulateBillRequest}
                        disabled={loading !== 'NONE'}
                        className="h-9 text-xs justify-start px-2 border-green-200 text-green-700 hover:bg-green-50"
                    >
                        {loading === 'BILL' ? <Loader2 size={12} className="animate-spin mr-1" /> : <Wallet size={12} className="mr-1" />}
                        Hesap İste
                    </Button>
                </div>

                {/* Result Message Area */}
                <div className="min-h-[22px]">
                    {result ? (
                        <div className={`text-[10px] px-2 py-1 rounded border ${result.success ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'} animate-in fade-in slide-in-from-left-1 flex items-center justify-between`}>
                            <span>{result.message}</span>
                            {result.success && <span className="text-[10px]">✓</span>}
                        </div>
                    ) : (
                        <div className="text-[10px] text-gray-300 text-center italic">
                            İşlem bekleniyor...
                        </div>
                    )}
                </div>

                <div className="flex gap-2 pt-2 border-t border-gray-50">
                    <a
                        href="/dashboard"
                        target="_blank"
                        className="flex-1 flex items-center justify-center gap-1 text-xs text-gray-500 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 py-2 rounded-md transition-colors font-medium border border-gray-100"
                    >
                        <span>Panel</span>
                    </a>
                    <a
                        href="/siparisler"
                        target="_blank"
                        className="flex-1 flex items-center justify-center gap-1 text-xs text-gray-500 hover:text-green-600 bg-gray-50 hover:bg-green-50 py-2 rounded-md transition-colors font-medium border border-gray-100"
                    >
                        <span>Siparişler</span>
                    </a>
                </div>
            </div>
        </div>
    );
}
