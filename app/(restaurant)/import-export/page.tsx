"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { FolderPlus, Download } from 'lucide-react';

export default function ImportExport() {
    // Basic file states for UI purposes
    const [catFile, setCatFile] = useState<File | null>(null);
    const [prodFile, setProdFile] = useState<File | null>(null);

    const handleCatSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Kategori yükleme işlemi yakında eklenecek.");
    };

    const handleProdSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Ürün yükleme işlemi yakında eklenecek.");
    };

    // ===== STYLES =====
    const pageStyle: React.CSSProperties = { padding: '0' };

    // Header
    const headerStyle: React.CSSProperties = {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 2rem'
    };

    const containerStyle: React.CSSProperties = {
        padding: '0 2rem', paddingBottom: '3rem'
    };

    // Notice
    const noticeStyle: React.CSSProperties = {
        background: '#e9f7fe', borderLeft: '4px solid #2196f3',
        padding: '16px 20px', borderRadius: '4px', marginBottom: '30px',
        color: '#31708f', fontSize: '0.9rem', lineHeight: '1.6'
    };

    // Grid
    const rowStyle: React.CSSProperties = {
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px'
    };

    // Box
    const dashboardBoxStyle: React.CSSProperties = {
        background: '#fff', borderRadius: '4px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        display: 'flex', flexDirection: 'column',
    };

    const headlineStyle: React.CSSProperties = {
        padding: '16px 20px', borderBottom: '1px solid #e8ecf1',
        display: 'flex', alignItems: 'center', gap: '10px',
        background: '#fcfcfc', borderRadius: '4px 4px 0 0'
    };

    const headlineTitleStyle: React.CSSProperties = {
        margin: 0, fontSize: '1rem', fontWeight: 600, color: '#333',
        display: 'flex', alignItems: 'center', gap: '8px'
    };

    const contentStyle: React.CSSProperties = {
        padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px'
    };

    const submitFieldStyle: React.CSSProperties = {
        marginBottom: '10px'
    };

    const h5Style: React.CSSProperties = {
        margin: '0 0 12px 0', fontSize: '0.9rem', fontWeight: 600, color: '#444'
    };

    const formStyle: React.CSSProperties = {
        display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap'
    };

    const inputFileStyle: React.CSSProperties = {
        fontSize: '0.85rem', color: '#666', border: 'none', padding: 0
    };

    const submitBtnStyle: React.CSSProperties = {
        background: '#666', color: '#fff', border: 'none', padding: '8px 16px',
        borderRadius: '3px', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem',
        textTransform: 'uppercase', transition: 'background 0.2s', height: '36px'
    };

    const linkStyle: React.CSSProperties = {
        color: '#ff6e01', fontSize: '0.85rem', textDecoration: 'none', fontWeight: 700
    };

    const exportBtnContainerStyle: React.CSSProperties = {
        display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px 0'
    };

    const exportBtnStyle: React.CSSProperties = {
        display: 'inline-flex', alignItems: 'center', gap: '8px',
        background: '#f8f9fa', color: '#333', border: '1px solid #ddd',
        padding: '12px 24px', borderRadius: '4px', textDecoration: 'none',
        fontWeight: 600, fontSize: '0.9rem', transition: 'all 0.2s',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
    };

    return (
        <div style={pageStyle}>
            {/* Header / Breadcrumb */}
            <div style={headerStyle}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '500', color: '#333', margin: 0 }}>Import / Export</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#666', fontSize: '0.9rem' }}>
                    <Link href="/dashboard" style={{ color: '#666', textDecoration: 'none' }}>Geri</Link>
                    <span>›</span>
                    <span>Import / Export</span>
                </div>
            </div>

            <div style={containerStyle}>
                {/* Notice */}
                <div style={noticeStyle}>
                    <div>1.) Kategori ve ürünlerinizi excelde hazırlayarak toplu yükleyebilirsiniz.</div>
                    <div>2.) Ürün fiyatlarını <b>Ürünleri Dışarı Aktar</b> diyerek toplu olarak güncelleyebilirsiniz.</div>
                </div>

                {/* Row */}
                <div style={rowStyle}>

                    {/* Kategori Yükle */}
                    <div style={dashboardBoxStyle}>
                        <div style={headlineStyle}>
                            <h3 style={headlineTitleStyle}><FolderPlus size={18} color="#666" /> Kategori Yükle</h3>
                        </div>
                        <div style={contentStyle}>
                            <div style={submitFieldStyle}>
                                <h5 style={h5Style}>Excel dosyası seçiniz:</h5>
                                <form onSubmit={handleCatSubmit} style={formStyle}>
                                    <input type="file" accept=".xls,.xlsx" style={inputFileStyle} onChange={e => setCatFile(e.target.files?.[0] || null)} />
                                    <button type="submit" style={submitBtnStyle}>Yükle</button>
                                </form>
                            </div>
                            <a href="/api/restaurant/export/categories" style={linkStyle}>
                                <b>ÖRNEK KATEGORİ DOSYA İNDİR</b>
                            </a>
                        </div>
                    </div>

                    {/* Ürün Yükle */}
                    <div style={dashboardBoxStyle}>
                        <div style={headlineStyle}>
                            <h3 style={headlineTitleStyle}><FolderPlus size={18} color="#666" /> Ürün Yükle</h3>
                        </div>
                        <div style={contentStyle}>
                            <div style={submitFieldStyle}>
                                <h5 style={h5Style}>Excel dosyası seçiniz:</h5>
                                <form onSubmit={handleProdSubmit} style={formStyle}>
                                    <input type="file" accept=".xls,.xlsx" style={inputFileStyle} onChange={e => setProdFile(e.target.files?.[0] || null)} />
                                    <button type="submit" style={submitBtnStyle}>Yükle</button>
                                </form>
                            </div>
                            <a href="/api/restaurant/export/products" style={linkStyle}>
                                <b>ÖRNEK ÜRÜN DOSYA İNDİR</b>
                            </a>
                        </div>
                    </div>

                    {/* Kategorileri Dışarı Aktar */}
                    <div style={dashboardBoxStyle}>
                        <div style={headlineStyle}>
                            <h3 style={headlineTitleStyle}><FolderPlus size={18} color="#666" /> Kategorileri Dışarı Aktar</h3>
                        </div>
                        <div style={contentStyle}>
                            <div style={exportBtnContainerStyle}>
                                <a href="/api/restaurant/export/categories" style={exportBtnStyle} target="_blank" rel="noreferrer">
                                    Kategorileri Dışarı Aktar
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Ürünleri Dışarı Aktar */}
                    <div style={dashboardBoxStyle}>
                        <div style={headlineStyle}>
                            <h3 style={headlineTitleStyle}><FolderPlus size={18} color="#666" /> Ürünleri Dışarı Aktar</h3>
                        </div>
                        <div style={contentStyle}>
                            <div style={exportBtnContainerStyle}>
                                <a href="/api/restaurant/export/products" style={exportBtnStyle} target="_blank" rel="noreferrer">
                                    Ürünleri Dışarı Aktar
                                </a>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Footer */}
            <div style={{ textAlign: 'center', padding: '24px 0', color: '#999', fontSize: '0.8rem', marginTop: '40px', borderTop: '1px solid #eee' }}>
                © {new Date().getFullYear()} QRlamenü Bütün Hakları Saklıdır.
            </div>
        </div>
    );
}
