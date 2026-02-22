"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function WhatsAppSiparisi() {
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const [formData, setFormData] = useState({
        quickorder_enable: '0',
        whatsapp_number: '',
        whatsapp_message: 'Yeni Sipariş: (#{ORDER_ID})\n\n{ORDER_DETAILS}\n\nToplam Fiyat: *{ORDER_TOTAL}*\n\n*Müşteri Bilgileri*\n{CUSTOMER_DETAILS}\n\n-----------------------------\nSipariş için teşekkürler.'
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/restaurant/settings');
                if (res.ok) {
                    const data = await res.json();
                    const s = data.settings || {};
                    setFormData(prev => ({
                        ...prev,
                        quickorder_enable: s.whatsappOrderEnabled ? '1' : '0',
                        whatsapp_number: s.whatsappNumber || '',
                        whatsapp_message: s.whatsappMessage || prev.whatsapp_message
                    }));
                }
            } catch (error) {
                console.error("Error fetching settings:", error);
            } finally {
                setPageLoading(false);
            }
        };

        fetchSettings();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setNotification({ type: 'success', message: 'Kısa kod kopyalandı!' });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setNotification(null);

        try {
            const body = {
                whatsappOrderEnabled: formData.quickorder_enable === '1',
                whatsappNumber: formData.whatsapp_number,
                whatsappMessage: formData.whatsapp_message
            };

            const res = await fetch('/api/restaurant/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (res.ok) {
                setNotification({ type: 'success', message: 'WhatsApp sipariş ayarları başarıyla kaydedildi!' });
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                const data = await res.json();
                setNotification({ type: 'error', message: data.error || 'Bir hata oluştu.' });
            }
        } catch (error) {
            setNotification({ type: 'error', message: 'Bağlantı hatası.' });
        } finally {
            setLoading(false);
            setTimeout(() => setNotification(null), 3000);
        }
    };

    // STYLES
    const pageStyle: React.CSSProperties = { padding: '0' };

    const headerStyle: React.CSSProperties = {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 2rem'
    };

    const containerStyle: React.CSSProperties = {
        padding: '0 2rem', paddingBottom: '3rem'
    };

    const dashboardBoxStyle: React.CSSProperties = {
        background: '#fff', borderRadius: '8px', border: '1px solid #eee', padding: '2rem'
    };

    const headlineTitleStyle: React.CSSProperties = {
        margin: '0 0 1.5rem 0', fontSize: '1.25rem', fontWeight: 500, color: '#333',
        display: 'flex', alignItems: 'center', gap: '8px'
    };

    const submitFieldStyle: React.CSSProperties = {
        marginBottom: '1.5rem', width: '100%', maxWidth: '800px'
    };

    const h5Style: React.CSSProperties = {
        margin: '0 0 8px 0', fontSize: '0.9rem', fontWeight: 600, color: '#333'
    };

    const inputStyle: React.CSSProperties = {
        width: '100%', padding: '12px 14px', borderRadius: '4px',
        border: '1px solid #e0e0e0', fontSize: '0.95rem',
        background: '#fff', color: '#333',
        outline: 'none', transition: 'border-color 0.2s',
    };

    const selectStyle: React.CSSProperties = {
        ...inputStyle,
        appearance: 'none',
        backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 14px top 50%',
        backgroundSize: '10px auto',
        paddingRight: '30px'
    };

    const textareaStyle: React.CSSProperties = {
        ...inputStyle,
        minHeight: '200px',
        resize: 'vertical',
        lineHeight: '1.5'
    };

    const codeTableStyle: React.CSSProperties = {
        width: '100%', borderCollapse: 'collapse', marginTop: '10px'
    };

    const codeInputStyle: React.CSSProperties = {
        border: '1px solid #ddd', background: '#f9f9f9', padding: '6px 10px',
        borderRadius: '3px', fontSize: '0.85rem', color: '#d32f2f',
        fontFamily: 'monospace', width: '200px', cursor: 'pointer',
        marginRight: '10px'
    };

    const buttonStyle: React.CSSProperties = {
        background: '#ff6e01', color: '#fff', border: 'none',
        padding: '12px 24px', borderRadius: '4px', fontWeight: 600,
        fontSize: '1rem', cursor: 'pointer',
        boxShadow: '0 4px 6px rgba(255,110,1,0.2)',
        transition: 'all 0.2s', marginTop: '10px', width: '100%',
        opacity: loading ? 0.7 : 1
    };

    if (pageLoading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f8f9fb' }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid #f3f3f3', borderTop: '3px solid #ff6e01', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>;
    }

    return (
        <div style={pageStyle}>
            {/* Header */}
            <div style={headerStyle}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '500', color: '#333', margin: 0 }}>WhatsApp Siparişi</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#666', fontSize: '0.9rem' }}>
                    <Link href="/dashboard" style={{ color: '#666', textDecoration: 'none' }}>Geri</Link>
                    <span>›</span>
                    <span>WhatsApp Siparişi</span>
                </div>
            </div>

            <div style={containerStyle}>
                {notification && (
                    <div style={{
                        padding: '16px', marginBottom: '24px', borderRadius: '4px',
                        background: notification.type === 'success' ? '#e6f4ea' : '#fce8e6',
                        color: notification.type === 'success' ? '#1e8e3e' : '#d93025',
                        borderLeft: `4px solid ${notification.type === 'success' ? '#1e8e3e' : '#d93025'}`
                    }}>
                        {notification.message}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="card" style={dashboardBoxStyle}>
                        <h3 style={headlineTitleStyle}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#25D366' }}>
                                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                            </svg>
                            WhatsApp Sipariş Ayarları
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column' }}>

                            <div style={submitFieldStyle}>
                                <h5 style={h5Style}>Aç/Kapa</h5>
                                <select
                                    name="quickorder_enable"
                                    value={formData.quickorder_enable}
                                    onChange={handleChange}
                                    style={selectStyle}
                                >
                                    <option value="1">Açık</option>
                                    <option value="0">Kapalı</option>
                                </select>
                            </div>

                            <div style={submitFieldStyle}>
                                <h5 style={h5Style}>WhatsApp Numarası (Örnek: +905394682110)</h5>
                                <input
                                    type="text"
                                    name="whatsapp_number"
                                    value={formData.whatsapp_number}
                                    onChange={handleChange}
                                    style={inputStyle}
                                    placeholder="+905551234567"
                                />
                            </div>

                            <div style={submitFieldStyle}>
                                <h5 style={h5Style}>WhatsApp Mesajı</h5>
                                <textarea
                                    name="whatsapp_message"
                                    value={formData.whatsapp_message}
                                    onChange={handleChange}
                                    style={textareaStyle}
                                />
                            </div>

                            <div style={submitFieldStyle}>
                                <h5 style={h5Style}>Kısa kodlar (Kopyalamak için tıklayın)</h5>
                                <table style={codeTableStyle}>
                                    <tbody>
                                        {[
                                            { code: '{ORDER_ID}', desc: 'Sipariş Kimliği' },
                                            { code: '{ORDER_DETAILS}', desc: 'Sipariş detayları' },
                                            { code: '{CUSTOMER_DETAILS}', desc: 'Müşteri detayları' },
                                            { code: '{ORDER_TYPE}', desc: 'Sipariş türü' },
                                            { code: '{ORDER_TOTAL}', desc: 'Sipariş Toplam Fiyatı' }
                                        ].map((item, idx) => (
                                            <tr key={idx}>
                                                <td style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                                                    <input
                                                        value={item.code}
                                                        readOnly
                                                        style={codeInputStyle}
                                                        onClick={() => handleCopy(item.code)}
                                                        title="Kopyalamak için tıkla"
                                                    />
                                                    <span style={{ fontSize: '0.9rem', color: '#666' }}>- {item.desc}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <button
                                type="submit"
                                style={buttonStyle}
                                disabled={loading}
                            >
                                {loading ? 'KAYDEDİLİYOR...' : 'KAYIT ET'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
