
"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getThemeConfig } from '@/lib/theme-config';
import LiteLayout from '@/components/themes/lite/LiteLayout';
import ClassicLayout from '@/components/themes/classic/ClassicLayout';
import ModernLayout from '@/components/themes/modern/ModernLayout';
import SignatureLayout from '@/components/themes/signature/SignatureLayout';
import LuxuryLayout from '@/components/themes/luxury/LuxuryLayout';
import FastFoodLayout from '@/components/themes/fast-food/FastFoodLayout';
import {
    Loader2, Bell, X, ShoppingCart, Plus, Minus, CheckCircle2,
    Trash2, ArrowRight, MapPin, Package, Home, Hotel, Truck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Script from 'next/script';

interface MenuClientProps { restaurant: any; defaultTheme: string; }

interface CartItem {
    id: string; name: string; price: number;
    quantity: number; imageUrl?: string;
}

type OrderStep = 'idle' | 'cart' | 'type' | 'confirm' | 'success';
type OrderType = 'TABLE' | 'TAKEAWAY' | 'HOTEL' | 'DELIVERY';

const ORDER_TYPE_CONFIG: Record<OrderType, { icon: any; label: string; desc: string; color: string }> = {
    TABLE: { icon: MapPin, label: 'Masada Sipariş', desc: 'Masanıza servis edilir', color: '#ff7a21' },
    TAKEAWAY: { icon: Package, label: 'Gel-Al', desc: 'Hazır olunca sizi ararız', color: '#8b5cf6' },
    HOTEL: { icon: Hotel, label: 'Odaya Servis', desc: 'Oda numaranızı girin', color: '#0891b2' },
    DELIVERY: { icon: Truck, label: 'Adrese Teslimat', desc: 'Adresinize teslim ederiz', color: '#16a34a' },
};

function MenuContent({ restaurant, defaultTheme }: MenuClientProps) {
    const searchParams = useSearchParams();
    const tableId = searchParams.get('table');
    const queryTheme = searchParams.get('theme');

    const [themeName, setThemeName] = useState(queryTheme || defaultTheme || 'LITE');
    const [isCalling, setIsCalling] = useState(false);
    const [callSuccess, setCallSuccess] = useState(false);

    // --- PRODUCT MODAL ---
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [modalQty, setModalQty] = useState(1);

    // --- CART ---
    const [cart, setCart] = useState<CartItem[]>([]);
    const [orderStep, setOrderStep] = useState<OrderStep>('idle');
    const [orderType, setOrderType] = useState<OrderType>('TABLE');
    const [orderNote, setOrderNote] = useState('');
    const [roomNumber, setRoomNumber] = useState('');
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [isOrdering, setIsOrdering] = useState(false);
    const [isAdditionalOrder, setIsAdditionalOrder] = useState(false);

    const [campaigns, setCampaigns] = useState<any[]>([]);

    const settings = restaurant.settings || {};
    // !! ile truthy check — DB'den string "true" gelse de çalışır
    const allowCallWaiter = !!settings.allowCallWaiter;
    const allowTableOrder = settings.allowOnTableOrder !== false;
    const allowTakeaway = !!settings.allowTakeawayOrder;
    const allowHotel = !!settings.allowHotelOrder;
    const allowDelivery = !!settings.allowDeliveryOrder;
    const sendNotification = settings.sendOrderNotification !== false;

    // Yalnızca seçim gerektiren tipler — TABLE her zaman otomatik (QR'dan geldi)
    const nonTableTypes: OrderType[] = [
        ...(allowTakeaway ? ['TAKEAWAY' as OrderType] : []),
        ...(allowHotel ? ['HOTEL' as OrderType] : []),
        ...(allowDelivery ? ['DELIVERY' as OrderType] : []),
    ];
    // Sipariş genel olarak açık mı?
    const hasOrdering = (allowTableOrder && !!tableId) || nonTableTypes.length > 0;

    useEffect(() => { if (queryTheme) setThemeName(queryTheme); }, [queryTheme]);

    useEffect(() => {
        if (nonTableTypes.length > 0) setOrderType(nonTableTypes[0]);
    }, []);

    useEffect(() => {
        fetch(`/api/restaurant/campaigns/public?tenantId=${restaurant.id}`)
            .then(r => r.ok ? r.json() : [])
            .then(d => setCampaigns(d))
            .catch(() => { });
    }, [restaurant.id]);

    useEffect(() => { if (selectedProduct) setModalQty(1); }, [selectedProduct]);

    // --- CART HELPERS ---
    const cartTotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

    const addToCart = (product: any, qty = 1) => {
        setCart(prev => {
            const ex = prev.find(i => i.id === product.id);
            if (ex) return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + qty } : i);
            return [...prev, { id: product.id, name: product.name, price: product.price, quantity: qty, imageUrl: product.imageUrl || product.image }];
        });
        setSelectedProduct(null);
    };

    const removeFromCart = (id: string) => setCart(prev => prev.filter(i => i.id !== id));
    const updateQty = (id: string, d: number) => setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: Math.max(1, i.quantity + d) } : i));

    // --- ORDER SUBMIT ---
    const buildNote = () => {
        let n = isAdditionalOrder ? '🔔 EK SİPARİŞ' : '';
        if (orderType === 'HOTEL' && roomNumber) n += ` | Oda: ${roomNumber}`;
        if (orderType === 'DELIVERY' && deliveryAddress) n += ` | Adres: ${deliveryAddress}`;
        if (orderNote) n += ` | Not: ${orderNote}`;
        return n.replace(/^\s*\|\s*/, '').trim();
    };

    const submitOrder = async () => {
        if (cart.length === 0) return;
        setIsOrdering(true);
        try {
            const res = await fetch('/api/restaurant/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tenantId: restaurant.id,
                    tableId: orderType === 'TABLE' ? (tableId || null) : null,
                    orderType,
                    items: cart.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
                    totalAmount: cartTotal,
                    note: buildNote()
                })
            });
            if (res.ok) {
                setOrderStep('success');
                setCart([]);
                setOrderNote('');
                setRoomNumber('');
                setDeliveryAddress('');
            } else {
                alert('Sipariş gönderilemedi. Lütfen tekrar deneyin.');
            }
        } catch {
            alert('Bağlantı hatası.');
        } finally {
            setIsOrdering(false);
        }
    };

    const handleCallWaiter = async () => {
        setIsCalling(true);
        try {
            const res = await fetch('/api/restaurant/waiter-calls', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tenantId: restaurant.id, tableId: tableId || 'belirsiz' })
            });
            if (res.ok) { setCallSuccess(true); setTimeout(() => setCallSuccess(false), 3000); }
        } catch { } finally { setIsCalling(false); }
    };

    const themeConfig = getThemeConfig(themeName);
    const pColor = settings.primaryColor || themeConfig.colors.primary;

    const commonProps = {
        restaurant, theme: themeConfig, tableId, campaigns,
        onProductClick: (product: any) => setSelectedProduct(product),
        settings: { allowCallWaiter, allowTableOrder, allowTakeaway, allowHotel, allowDelivery, hasOrdering, pColor }
    };

    return (
        <>
            {restaurant.logoUrl && <link rel="icon" href={restaurant.logoUrl} />}
            {settings.fbPixelId && (
                <Script id="fb-pixel" strategy="afterInteractive">
                    {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${settings.fbPixelId}');fbq('track','PageView');`}
                </Script>
            )}

            {/* Theme Layout */}
            {themeName === 'CLASSIC' && <ClassicLayout {...commonProps} />}
            {themeName === 'MODERN' && <ModernLayout {...commonProps} />}
            {themeName === 'SIGNATURE' && <SignatureLayout {...commonProps} />}
            {themeName === 'LUXURY' && <LuxuryLayout {...commonProps} />}
            {themeName === 'FASTFOOD' && <FastFoodLayout {...commonProps} />}
            {(!['CLASSIC', 'MODERN', 'SIGNATURE', 'LUXURY', 'FASTFOOD'].includes(themeName)) && <LiteLayout {...commonProps} />}

            {/* ── Floating Waiter Call Button ── garson çağır açıksa göster */}
            {allowCallWaiter && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                    style={{ position: 'fixed', bottom: '24px', left: '16px', zIndex: 100 }}>
                    <button onClick={handleCallWaiter} disabled={isCalling || callSuccess} style={{
                        width: '52px', height: '52px', borderRadius: '50%',
                        background: callSuccess ? '#22c55e' : '#111827',
                        color: 'white', border: 'none', cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                        justifyContent: 'center', gap: '1px', fontSize: '0.5rem', fontWeight: '800'
                    }}>
                        {isCalling ? <Loader2 size={20} className="animate-spin" /> :
                            callSuccess ? <CheckCircle2 size={20} /> :
                                <><Bell size={18} /><span>GARSON</span></>}
                    </button>
                </motion.div>
            )}

            {/* ── Floating Cart Button ── */}
            <AnimatePresence>
                {hasOrdering && cartCount > 0 && orderStep === 'idle' && (
                    <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        style={{ position: 'fixed', bottom: '24px', right: '16px', zIndex: 100 }}>
                        <button onClick={() => setOrderStep('cart')} style={{
                            background: pColor, color: 'white', border: 'none',
                            padding: '13px 20px', borderRadius: '50px', fontWeight: '800', fontSize: '0.95rem',
                            display: 'flex', alignItems: 'center', gap: '10px',
                            boxShadow: `0 8px 20px ${pColor}60`, cursor: 'pointer'
                        }}>
                            <ShoppingCart size={20} />
                            <span>{cartCount} Ürün</span>
                            <span style={{ background: 'rgba(255,255,255,0.25)', padding: '3px 8px', borderRadius: '30px' }}>
                                {cartTotal.toFixed(2)}₺
                            </span>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Product Detail Modal ── */}
            <AnimatePresence>
                {selectedProduct && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
                        onClick={() => setSelectedProduct(null)}>
                        <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            onClick={e => e.stopPropagation()}
                            style={{ background: 'white', width: '100%', maxWidth: '520px', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', overflow: 'hidden', maxHeight: '90vh', boxSizing: 'border-box' }}>
                            <div style={{ height: '220px', background: `url(${selectedProduct.imageUrl || selectedProduct.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60'}) center/cover`, position: 'relative' }}>
                                <button onClick={() => setSelectedProduct(null)}
                                    style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.85)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <X size={18} />
                                </button>
                            </div>
                            <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                    <h2 style={{ fontSize: '1.25rem', fontWeight: '900', margin: 0, flex: 1, paddingRight: '12px' }}>{selectedProduct.name}</h2>
                                    <span style={{ fontSize: '1.2rem', fontWeight: '900', color: pColor, whiteSpace: 'nowrap' }}>{selectedProduct.price?.toFixed(2)}₺</span>
                                </div>
                                <p style={{ color: '#6b7280', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '20px', overflowY: 'auto', maxHeight: '15vh' }}>{selectedProduct.description || 'Bu ürün için açıklama belirtilmemiş.'}</p>

                                {hasOrdering ? (
                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', background: '#f3f4f6', borderRadius: '12px', padding: '4px', gap: '2px' }}>
                                            <button onClick={() => setModalQty(q => Math.max(1, q - 1))} style={{ width: '36px', height: '36px', background: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '1.3rem', fontWeight: '700' }}>−</button>
                                            <span style={{ width: '32px', textAlign: 'center', fontWeight: '800' }}>{modalQty}</span>
                                            <button onClick={() => setModalQty(q => q + 1)} style={{ width: '36px', height: '36px', background: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '1.3rem', fontWeight: '700', color: pColor }}>+</button>
                                        </div>
                                        <button onClick={() => addToCart(selectedProduct, modalQty)} style={{
                                            flex: 1, padding: '12px', background: pColor, color: 'white', border: 'none',
                                            borderRadius: '12px', fontWeight: '800', cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.95rem'
                                        }}>
                                            <ShoppingCart size={18} /> Ekle — {(selectedProduct.price * modalQty).toFixed(2)}₺
                                        </button>
                                    </div>
                                ) : (
                                    <div style={{ background: '#f3f4f6', padding: '12px', borderRadius: '12px', textAlign: 'center', color: '#6b7280', fontSize: '0.85rem' }}>
                                        QR menü — Sipariş bu kanaldan alınmıyor.
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ── Cart Drawer ── */}
            <AnimatePresence>
                {orderStep === 'cart' && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1100, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
                        onClick={() => setOrderStep('idle')}>
                        <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            onClick={e => e.stopPropagation()}
                            style={{ background: 'white', width: '100%', maxWidth: '520px', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', maxHeight: '85vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxSizing: 'border-box' }}>
                            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h2 style={{ margin: 0, fontWeight: '900', fontSize: '1.1rem' }}>🛒 Sepetim</h2>
                                <button onClick={() => setOrderStep('idle')} style={{ border: 'none', background: '#f1f5f9', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontWeight: '700', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={18} /></button>
                            </div>
                            <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '10px', boxSizing: 'border-box' }}>
                                {cart.map(item => (
                                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderRadius: '12px', background: '#f9fafb', flexWrap: 'wrap' }}>
                                        {item.imageUrl && <img src={item.imageUrl} alt={item.name} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />}
                                        <div style={{ flex: 1, minWidth: '120px' }}>
                                            <p style={{ margin: 0, fontWeight: '800', fontSize: '0.85rem' }}>{item.name}</p>
                                            <p style={{ margin: 0, color: pColor, fontWeight: '700', fontSize: '0.85rem' }}>{(item.price * item.quantity).toFixed(2)}₺</p>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '2px', background: 'white', borderRadius: '10px', padding: '4px', border: '1px solid #e5e7eb' }}>
                                            <button onClick={() => updateQty(item.id, -1)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontWeight: '800', width: '24px' }}>−</button>
                                            <span style={{ fontWeight: '800', minWidth: '16px', textAlign: 'center', fontSize: '0.9rem' }}>{item.quantity}</span>
                                            <button onClick={() => updateQty(item.id, 1)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontWeight: '800', width: '24px', color: pColor }}>+</button>
                                        </div>
                                        <button onClick={() => removeFromCart(item.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444', padding: '4px' }}><Trash2 size={16} /></button>
                                    </div>
                                ))}
                            </div>
                            <div style={{ padding: '16px 20px', borderTop: '1px solid #f1f5f9' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontWeight: '900', fontSize: '1.05rem' }}>
                                    <span>Toplam</span>
                                    <span style={{ color: pColor }}>{cartTotal.toFixed(2)}₺</span>
                                </div>
                                <button onClick={() => {
                                    if (tableId && allowTableOrder) {
                                        setOrderType('TABLE');
                                        setOrderStep('confirm');
                                    } else if (nonTableTypes.length === 1) {
                                        setOrderType(nonTableTypes[0]);
                                        setOrderStep('confirm');
                                    } else {
                                        setOrderStep('type');
                                    }
                                }}
                                    style={{ width: '100%', padding: '14px', background: pColor, color: 'white', border: 'none', borderRadius: '14px', fontWeight: '900', fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                    Devam Et <ArrowRight size={18} />
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ── Order Type Selection ── */}
            <AnimatePresence>
                {orderStep === 'type' && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1150, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
                        onClick={() => setOrderStep('cart')}>
                        <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            onClick={e => e.stopPropagation()}
                            style={{ background: 'white', width: '100%', maxWidth: '520px', borderTopLeftRadius: '28px', borderTopRightRadius: '28px', padding: '28px 24px' }}>
                            <h2 style={{ margin: '0 0 6px', fontWeight: '900', fontSize: '1.2rem' }}>Sipariş Türü Seçin</h2>
                            <p style={{ color: '#64748b', marginBottom: '20px', fontSize: '0.85rem' }}>Siparişinizi nasıl almak istersiniz?</p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                                {nonTableTypes.map((type: OrderType) => {
                                    const cfg = ORDER_TYPE_CONFIG[type];
                                    const Icon = cfg.icon;
                                    const isSelected = orderType === type;
                                    return (
                                        <button key={type} onClick={() => setOrderType(type)} style={{
                                            padding: '16px', borderRadius: '16px', border: `2px solid ${isSelected ? cfg.color : '#e5e7eb'}`,
                                            background: isSelected ? `${cfg.color}10` : 'white', cursor: 'pointer',
                                            textAlign: 'left', transition: 'all 0.2s'
                                        }}>
                                            <Icon size={22} style={{ color: cfg.color, marginBottom: '8px' }} />
                                            <div style={{ fontWeight: '800', fontSize: '0.9rem', color: '#111' }}>{cfg.label}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>{cfg.desc}</div>
                                        </button>
                                    );
                                })}
                            </div>
                            <button onClick={() => setOrderStep('confirm')} style={{
                                width: '100%', padding: '15px', background: pColor, color: 'white', border: 'none',
                                borderRadius: '16px', fontWeight: '900', fontSize: '1rem', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                            }}>
                                Devam Et <ArrowRight size={20} />
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ── Order Confirmation ── */}
            <AnimatePresence>
                {orderStep === 'confirm' && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
                        onClick={() => setOrderStep(nonTableTypes.length > 1 ? 'type' : 'cart')}>
                        <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            onClick={e => e.stopPropagation()}
                            style={{ background: 'white', width: '100%', maxWidth: '520px', borderTopLeftRadius: '28px', borderTopRightRadius: '28px', padding: '28px 24px', maxHeight: '85vh', overflowY: 'auto' }}>
                            <h2 style={{ margin: '0 0 8px', fontWeight: '900' }}>✅ Siparişi Onayla</h2>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '16px' }}>
                                <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '800', background: `${ORDER_TYPE_CONFIG[orderType].color}15`, color: ORDER_TYPE_CONFIG[orderType].color }}>
                                    {ORDER_TYPE_CONFIG[orderType].label}
                                </span>
                                {tableId && orderType === 'TABLE' && (
                                    <span style={{ padding: '4px 12px', background: '#f1f5f9', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '700', color: '#475569' }}>🪑 Masa {tableId}</span>
                                )}
                            </div>
                            <p style={{ color: '#64748b', marginBottom: '16px', fontSize: '0.9rem' }}>
                                {cartCount} ürün — <strong style={{ color: pColor }}>{cartTotal.toFixed(2)}₺</strong>
                            </p>
                            {/* Extra info fields */}
                            {orderType === 'HOTEL' && (
                                <input value={roomNumber} onChange={e => setRoomNumber(e.target.value)}
                                    placeholder="Oda numaranızı girin *"
                                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e5e7eb', marginBottom: '12px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />
                            )}
                            {orderType === 'DELIVERY' && (
                                <textarea value={deliveryAddress} onChange={e => setDeliveryAddress(e.target.value)}
                                    placeholder="Teslimat adresinizi girin *" rows={2}
                                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e5e7eb', marginBottom: '12px', fontSize: '0.9rem', resize: 'none', outline: 'none', boxSizing: 'border-box' }} />
                            )}
                            <textarea value={orderNote} onChange={e => setOrderNote(e.target.value)}
                                placeholder="Özel not (isteğe bağlı)..." rows={2}
                                style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e5e7eb', marginBottom: '16px', fontSize: '0.9rem', resize: 'none', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button onClick={() => setOrderStep(tableId ? 'cart' : nonTableTypes.length > 1 ? 'type' : 'cart')}
                                    style={{ flex: 1, padding: '14px', border: '1px solid #e5e7eb', background: 'white', borderRadius: '14px', fontWeight: '700', cursor: 'pointer' }}>
                                    Geri
                                </button>
                                <button onClick={submitOrder} disabled={isOrdering ||
                                    (orderType === 'HOTEL' && !roomNumber) ||
                                    (orderType === 'DELIVERY' && !deliveryAddress)}
                                    style={{ flex: 2, padding: '14px', background: pColor, color: 'white', border: 'none', borderRadius: '14px', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: (isOrdering || (orderType === 'HOTEL' && !roomNumber) || (orderType === 'DELIVERY' && !deliveryAddress)) ? 0.6 : 1 }}>
                                    {isOrdering ? <Loader2 size={18} className="animate-spin" /> : '🚀'} Siparişi Gönder
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ── Order Success ── */}
            <AnimatePresence>
                {orderStep === 'success' && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
                        <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                            style={{ background: 'white', borderRadius: '28px', padding: '36px 24px', textAlign: 'center', maxWidth: '360px', width: '100%' }}>
                            <div style={{ fontSize: '3.5rem', marginBottom: '12px' }}>{isAdditionalOrder ? '➕' : '🎉'}</div>
                            <h2 style={{ margin: '0 0 8px', fontWeight: '900', fontSize: '1.4rem' }}>
                                {isAdditionalOrder ? 'Ek Sipariş Alındı!' : 'Siparişiniz Alındı!'}
                            </h2>
                            <p style={{ color: '#64748b', marginBottom: '24px', lineHeight: 1.6, fontSize: '0.9rem' }}>
                                Mutfağa iletildi. En kısa sürede servis edilecektir. Afiyet olsun! 🍽️
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <button onClick={() => { setIsAdditionalOrder(true); setOrderStep('idle'); }}
                                    style={{ padding: '13px', background: pColor, color: 'white', border: 'none', borderRadius: '14px', fontWeight: '900', cursor: 'pointer' }}>
                                    ➕ Ek Sipariş Ver
                                </button>
                                <button onClick={() => { setOrderStep('idle'); setIsAdditionalOrder(false); }}
                                    style={{ padding: '11px', background: 'transparent', border: '1px solid #e5e7eb', borderRadius: '14px', fontWeight: '700', cursor: 'pointer', color: '#64748b', fontSize: '0.9rem' }}>
                                    Menüye Dön
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}

export default function MenuClient({ restaurant, defaultTheme }: MenuClientProps) {
    return (
        <Suspense fallback={
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px', background: '#f9fafb' }}>
                <Loader2 style={{ width: 32, height: 32, color: '#ff7a21', animation: 'spin 1s linear infinite' }} />
                <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
                <p style={{ color: '#6b7280', fontWeight: '600' }}>Menü Yükleniyor...</p>
            </div>
        }>
            <MenuContent restaurant={restaurant} defaultTheme={defaultTheme} />
        </Suspense>
    );
}
