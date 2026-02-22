"use client";
import React, { useState, useEffect, useCallback } from 'react';
import {
    Plus,
    GripVertical,
    FolderPlus,
    Edit,
    Trash2,
    ChevronDown,
    ChevronRight,
    X,
    Image as ImageIcon,
    Package,
    AlertTriangle,
    Check,
    Loader2,
    Search,
    ToggleLeft,
    ToggleRight,
    Upload
} from 'lucide-react';

// Types
interface Product {
    id: string;
    name: string;
    description: string | null;
    price: number;
    imageUrl: string | null;
    isAvailable: boolean;
    order: number;
}

interface Category {
    id: string;
    name: string;
    imageUrl: string | null;
    order: number;
    products: Product[];
}

// Toast notification
function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
    useEffect(() => {
        const t = setTimeout(onClose, 3000);
        return () => clearTimeout(t);
    }, [onClose]);

    return (
        <div style={{
            position: 'fixed', top: 24, right: 24, zIndex: 10000,
            background: type === 'success' ? '#10b981' : '#ef4444',
            color: '#fff', padding: '14px 24px', borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
            display: 'flex', alignItems: 'center', gap: '10px',
            animation: 'slideIn 0.3s ease-out',
            fontSize: '0.9rem', fontWeight: 500,
        }}>
            {type === 'success' ? <Check size={18} /> : <AlertTriangle size={18} />}
            {message}
        </div>
    );
}

// Confirm dialog
function ConfirmDialog({ title, message, onConfirm, onCancel }: {
    title: string; message: string; onConfirm: () => void; onCancel: () => void;
}) {
    return (
        <div onClick={onCancel} style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(4px)',
        }}>
            <div onClick={e => e.stopPropagation()} style={{
                background: '#fff', borderRadius: '16px', padding: '32px',
                maxWidth: '420px', width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ width: 44, height: 44, borderRadius: '12px', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <AlertTriangle size={22} color="#ef4444" />
                    </div>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#111' }}>{title}</h3>
                </div>
                <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '24px' }}>{message}</p>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button onClick={onCancel} style={{
                        padding: '10px 20px', borderRadius: '10px', border: '1px solid #e5e7eb',
                        background: '#fff', cursor: 'pointer', fontWeight: 500, color: '#555', fontSize: '0.9rem',
                    }}>İptal</button>
                    <button onClick={onConfirm} style={{
                        padding: '10px 20px', borderRadius: '10px', border: 'none',
                        background: '#ef4444', color: '#fff', cursor: 'pointer', fontWeight: 500, fontSize: '0.9rem',
                    }}>Evet, Sil</button>
                </div>
            </div>
        </div>
    );
}

export default function MenuEkle() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set());
    const [searchTerm, setSearchTerm] = useState('');

    // Toast
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const showToast = (message: string, type: 'success' | 'error') => setToast({ message, type });

    // Modals
    const [showCatModal, setShowCatModal] = useState(false);
    const [editingCat, setEditingCat] = useState<Category | null>(null);
    const [catForm, setCatForm] = useState({ name: '', imageUrl: '' });

    const [showItemModal, setShowItemModal] = useState(false);
    const [editingItem, setEditingItem] = useState<Product | null>(null);
    const [itemCatId, setItemCatId] = useState('');
    const [itemForm, setItemForm] = useState({ name: '', description: '', price: '', imageUrl: '', isAvailable: true });

    // Delete confirm
    const [confirmDelete, setConfirmDelete] = useState<{ type: 'category' | 'product'; id: string; name: string } | null>(null);

    // Save loading
    const [saving, setSaving] = useState(false);

    const fetchCategories = useCallback(async () => {
        try {
            const res = await fetch('/api/restaurant/categories');
            if (res.ok) {
                const data = await res.json();
                setCategories(data);
            }
        } catch (error) {
            console.error('Kategoriler yüklenirken hata:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchCategories(); }, [fetchCategories]);

    const toggleCategory = (id: string) => {
        setExpandedCats(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id); else next.add(id);
            return next;
        });
    };

    // ============ CATEGORY CRUD ============

    const openAddCategory = () => {
        setEditingCat(null);
        setCatForm({ name: '', imageUrl: '' });
        setShowCatModal(true);
    };

    const openEditCategory = (cat: Category) => {
        setEditingCat(cat);
        setCatForm({ name: cat.name, imageUrl: cat.imageUrl || '' });
        setShowCatModal(true);
    };

    const handleSaveCategory = async () => {
        if (!catForm.name.trim()) return;
        setSaving(true);
        try {
            const url = '/api/restaurant/categories';
            const method = editingCat ? 'PATCH' : 'POST';
            const body = editingCat
                ? { id: editingCat.id, name: catForm.name, imageUrl: catForm.imageUrl || null }
                : { name: catForm.name, imageUrl: catForm.imageUrl || null };

            const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
            if (res.ok) {
                showToast(editingCat ? 'Kategori güncellendi!' : 'Kategori eklendi!', 'success');
                setShowCatModal(false);
                fetchCategories();
            } else {
                showToast('Hata oluştu', 'error');
            }
        } catch { showToast('Bağlantı hatası', 'error'); }
        finally { setSaving(false); }
    };

    const handleDeleteCategory = async (id: string) => {
        try {
            const res = await fetch(`/api/restaurant/categories?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                showToast('Kategori silindi!', 'success');
                fetchCategories();
            } else {
                showToast('Silinemedi', 'error');
            }
        } catch { showToast('Bağlantı hatası', 'error'); }
        setConfirmDelete(null);
    };

    // ============ PRODUCT CRUD ============

    const openAddProduct = (categoryId: string) => {
        setEditingItem(null);
        setItemCatId(categoryId);
        setItemForm({ name: '', description: '', price: '', imageUrl: '', isAvailable: true });
        setShowItemModal(true);
    };

    const openEditProduct = (product: Product, categoryId: string) => {
        setEditingItem(product);
        setItemCatId(categoryId);
        setItemForm({
            name: product.name,
            description: product.description || '',
            price: product.price.toString(),
            imageUrl: product.imageUrl || '',
            isAvailable: product.isAvailable,
        });
        setShowItemModal(true);
    };

    const handleSaveProduct = async () => {
        if (!itemForm.name.trim() || !itemForm.price) return;
        setSaving(true);
        try {
            const url = '/api/restaurant/products';
            const method = editingItem ? 'PATCH' : 'POST';
            const body = editingItem
                ? { id: editingItem.id, ...itemForm, price: itemForm.price }
                : { ...itemForm, price: itemForm.price, categoryId: itemCatId };

            const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
            if (res.ok) {
                showToast(editingItem ? 'Ürün güncellendi!' : 'Ürün eklendi!', 'success');
                setShowItemModal(false);
                fetchCategories();
            } else {
                showToast('Hata oluştu', 'error');
            }
        } catch { showToast('Bağlantı hatası', 'error'); }
        finally { setSaving(false); }
    };

    const handleDeleteProduct = async (id: string) => {
        try {
            const res = await fetch(`/api/restaurant/products?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                showToast('Ürün silindi!', 'success');
                fetchCategories();
            } else {
                showToast('Silinemedi', 'error');
            }
        } catch { showToast('Bağlantı hatası', 'error'); }
        setConfirmDelete(null);
    };

    const toggleAvailability = async (product: Product) => {
        try {
            await fetch('/api/restaurant/products', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: product.id, isAvailable: !product.isAvailable })
            });
            fetchCategories();
        } catch { showToast('Hata', 'error'); }
    };

    // ============ FILTER ============
    const filteredCategories = categories.filter(cat => {
        if (!searchTerm) return true;
        const s = searchTerm.toLowerCase();
        if (cat.name.toLowerCase().includes(s)) return true;
        return cat.products.some(p => p.name.toLowerCase().includes(s));
    });

    const totalProducts = categories.reduce((sum, c) => sum + c.products.length, 0);

    // ============ RENDER ============
    return (
        <div style={{ padding: 0, minHeight: '100vh', background: '#f8f9fb' }}>
            <style>{`
                @keyframes slideIn {
                    from { transform: translateX(40px); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                .menu-card {
                    background: #fff;
                    border-radius: 14px;
                    border: 1px solid #e8ecf1;
                    overflow: hidden;
                    margin-bottom: 12px;
                    transition: box-shadow 0.2s;
                }
                .menu-card:hover {
                    box-shadow: 0 4px 20px rgba(0,0,0,0.06);
                }
                .cat-header {
                    display: flex;
                    align-items: center;
                    padding: 16px 20px;
                    cursor: pointer;
                    gap: 12px;
                    user-select: none;
                    transition: background 0.15s;
                }
                .cat-header:hover {
                    background: #f8f9fb;
                }
                .cat-img {
                    width: 42px;
                    height: 42px;
                    border-radius: 10px;
                    object-fit: cover;
                    background: #f0f1f3;
                    flex-shrink: 0;
                }
                .cat-name {
                    font-weight: 600;
                    font-size: 1rem;
                    color: #1a1a2e;
                    flex: 1;
                }
                .cat-count {
                    font-size: 0.8rem;
                    color: #999;
                    background: #f0f1f3;
                    padding: 3px 10px;
                    border-radius: 20px;
                    white-space: nowrap;
                }
                .action-btn {
                    width: 34px;
                    height: 34px;
                    border-radius: 8px;
                    border: 1px solid #e8ecf1;
                    background: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.15s;
                    flex-shrink: 0;
                }
                .action-btn:hover {
                    background: #f5f5ff;
                    border-color: #c7c7ff;
                }
                .action-btn.danger:hover {
                    background: #fef2f2;
                    border-color: #fca5a5;
                }
                .action-btn.success {
                    background: #f0fdf4;
                    border-color: #86efac;
                }
                .action-btn.success:hover {
                    background: #dcfce7;
                }
                .product-row {
                    display: flex;
                    align-items: center;
                    padding: 12px 20px 12px 56px;
                    gap: 14px;
                    border-top: 1px solid #f3f4f6;
                    transition: background 0.15s;
                }
                .product-row:hover {
                    background: #fafbfc;
                }
                .product-img {
                    width: 48px;
                    height: 48px;
                    border-radius: 10px;
                    object-fit: cover;
                    background: #f0f1f3;
                    flex-shrink: 0;
                }
                .product-name {
                    font-weight: 500;
                    font-size: 0.92rem;
                    color: #1a1a2e;
                }
                .product-desc {
                    font-size: 0.8rem;
                    color: #999;
                    margin-top: 2px;
                    display: -webkit-box;
                    -webkit-line-clamp: 1;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                .product-price {
                    font-weight: 700;
                    font-size: 0.95rem;
                    color: #ff6e01;
                    white-space: nowrap;
                }
                .unavailable {
                    opacity: 0.5;
                }
                .modal-overlay {
                    position: fixed;
                    inset: 0;
                    z-index: 9990;
                    background: rgba(0,0,0,0.5);
                    backdrop-filter: blur(4px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .modal-box {
                    background: #fff;
                    border-radius: 18px;
                    max-width: 520px;
                    width: 92%;
                    box-shadow: 0 25px 80px rgba(0,0,0,0.2);
                    overflow: hidden;
                }
                .modal-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 20px 24px;
                    border-bottom: 1px solid #f0f1f3;
                }
                .modal-header h3 {
                    margin: 0;
                    font-size: 1.1rem;
                    color: #111;
                }
                .modal-body {
                    padding: 24px;
                }
                .form-group {
                    margin-bottom: 18px;
                }
                .form-group label {
                    display: block;
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: #444;
                    margin-bottom: 6px;
                }
                .form-input {
                    width: 100%;
                    padding: 11px 14px;
                    border: 1px solid #e0e0e0;
                    border-radius: 10px;
                    font-size: 0.9rem;
                    outline: none;
                    transition: border 0.2s;
                    background: #fafafa;
                    box-sizing: border-box;
                }
                .form-input:focus {
                    border-color: #ff6e01;
                    background: #fff;
                }
                .form-textarea {
                    min-height: 80px;
                    resize: vertical;
                }
                .modal-footer {
                    padding: 16px 24px;
                    border-top: 1px solid #f0f1f3;
                    display: flex;
                    gap: 10px;
                    justify-content: flex-end;
                }
                .btn-primary {
                    padding: 11px 24px;
                    border-radius: 10px;
                    border: none;
                    background: #ff6e01;
                    color: #fff;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 0.9rem;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    transition: all 0.2s;
                }
                .btn-primary:hover {
                    background: #e56300;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(255,110,1,0.3);
                }
                .btn-primary:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    transform: none;
                }
                .btn-secondary {
                    padding: 11px 24px;
                    border-radius: 10px;
                    border: 1px solid #e5e7eb;
                    background: #fff;
                    color: #555;
                    cursor: pointer;
                    font-weight: 500;
                    font-size: 0.9rem;
                }
                .btn-secondary:hover {
                    background: #f9fafb;
                }
                .toggle-btn {
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .toggle-btn:hover {
                    transform: scale(1.1);
                }
                .header-bar {
                    background: #fff;
                    border-bottom: 1px solid #e8ecf1;
                    padding: 20px 28px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 16px;
                    flex-wrap: wrap;
                }
                .stats-pill {
                    display: flex;
                    gap: 16px;
                    align-items: center;
                }
                .stat-chip {
                    background: #f5f3ff;
                    color: #6d28d9;
                    padding: 6px 14px;
                    border-radius: 20px;
                    font-size: 0.8rem;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }
                .search-box {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background: #f8f9fb;
                    border: 1px solid #e8ecf1;
                    border-radius: 10px;
                    padding: 8px 14px;
                    max-width: 280px;
                    width: 100%;
                }
                .search-box input {
                    border: none;
                    outline: none;
                    background: transparent;
                    font-size: 0.875rem;
                    width: 100%;
                    color: #333;
                }
                .empty-state {
                    text-align: center;
                    padding: 60px 20px;
                    color: #aaa;
                }
                .empty-state-icon {
                    width: 80px;
                    height: 80px;
                    background: #f5f3ff;
                    border-radius: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 16px;
                }
                .image-preview {
                    width: 80px;
                    height: 80px;
                    border-radius: 12px;
                    object-fit: cover;
                    border: 2px solid #f0f1f3;
                }
                .badge-available {
                    font-size: 0.7rem;
                    padding: 2px 8px;
                    border-radius: 12px;
                    font-weight: 600;
                }
            `}</style>

            {/* Toast */}
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            {/* Confirm Dialog */}
            {confirmDelete && (
                <ConfirmDialog
                    title="Silme Onayı"
                    message={`"${confirmDelete.name}" ${confirmDelete.type === 'category' ? 'kategorisini ve altındaki tüm ürünleri' : 'ürününü'} silmek istediğinize emin misiniz?`}
                    onConfirm={() => confirmDelete.type === 'category' ? handleDeleteCategory(confirmDelete.id) : handleDeleteProduct(confirmDelete.id)}
                    onCancel={() => setConfirmDelete(null)}
                />
            )}

            {/* Header Bar */}
            <div className="header-bar">
                <div>
                    <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, color: '#1a1a2e' }}>Menüyü Yönet</h1>
                    <div className="stats-pill" style={{ marginTop: '8px' }}>
                        <div className="stat-chip">
                            <FolderPlus size={14} />
                            {categories.length} Kategori
                        </div>
                        <div className="stat-chip" style={{ background: '#fff7ed', color: '#c2410c' }}>
                            <Package size={14} />
                            {totalProducts} Ürün
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div className="search-box">
                        <Search size={16} color="#999" />
                        <input
                            placeholder="Kategori veya ürün ara..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="btn-primary" onClick={openAddCategory}>
                        <Plus size={18} /> Kategori Ekle
                    </button>
                </div>
            </div>

            {/* Content */}
            <div style={{ padding: '20px 28px' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '60px', color: '#999' }}>
                        <Loader2 size={32} style={{ animation: 'spin 1s linear infinite' }} />
                        <p>Yükleniyor...</p>
                        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    </div>
                ) : filteredCategories.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">
                            <FolderPlus size={36} color="#7c3aed" />
                        </div>
                        <h3 style={{ color: '#555', marginBottom: '8px' }}>
                            {searchTerm ? 'Sonuç bulunamadı' : 'Henüz kategori eklenmemiş'}
                        </h3>
                        <p style={{ fontSize: '0.9rem', marginBottom: '20px' }}>
                            {searchTerm ? 'Farklı bir arama terimi deneyin.' : 'İlk kategorinizi ekleyerek menünüzü oluşturmaya başlayın.'}
                        </p>
                        {!searchTerm && (
                            <button className="btn-primary" onClick={openAddCategory} style={{ margin: '0 auto' }}>
                                <Plus size={18} /> Kategori Ekle
                            </button>
                        )}
                    </div>
                ) : (
                    filteredCategories.map(cat => {
                        const isExpanded = expandedCats.has(cat.id);
                        return (
                            <div key={cat.id} className="menu-card">
                                {/* Category Header */}
                                <div className="cat-header" onClick={() => toggleCategory(cat.id)}>
                                    <GripVertical size={18} color="#ccc" style={{ flexShrink: 0 }} />
                                    {cat.imageUrl ? (
                                        <img src={cat.imageUrl} alt={cat.name} className="cat-img" />
                                    ) : (
                                        <div className="cat-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <ImageIcon size={20} color="#ccc" />
                                        </div>
                                    )}
                                    <span className="cat-name">{cat.name}</span>
                                    <span className="cat-count">{cat.products.length} ürün</span>

                                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }} onClick={e => e.stopPropagation()}>
                                        <button className="action-btn" title="Ürün Ekle"
                                            onClick={() => openAddProduct(cat.id)}>
                                            <Plus size={16} color="#6d28d9" />
                                        </button>
                                        <button className="action-btn" title="Kategoriyi Düzenle"
                                            onClick={() => openEditCategory(cat)}>
                                            <Edit size={15} color="#0ea5e9" />
                                        </button>
                                        <button className="action-btn danger" title="Kategoriyi Sil"
                                            onClick={() => setConfirmDelete({ type: 'category', id: cat.id, name: cat.name })}>
                                            <Trash2 size={15} color="#ef4444" />
                                        </button>
                                    </div>

                                    {isExpanded
                                        ? <ChevronDown size={20} color="#999" style={{ flexShrink: 0 }} />
                                        : <ChevronRight size={20} color="#999" style={{ flexShrink: 0 }} />}
                                </div>

                                {/* Products */}
                                {isExpanded && (
                                    <div>
                                        {cat.products.length === 0 ? (
                                            <div style={{ textAlign: 'center', padding: '30px 20px', color: '#bbb', borderTop: '1px solid #f3f4f6' }}>
                                                <Package size={24} style={{ marginBottom: '8px' }} />
                                                <p style={{ margin: 0, fontSize: '0.85rem' }}>Bu kategoride henüz ürün yok</p>
                                                <button onClick={() => openAddProduct(cat.id)} style={{
                                                    marginTop: '12px', padding: '8px 16px', border: '1px dashed #ccc',
                                                    borderRadius: '8px', background: 'transparent', cursor: 'pointer',
                                                    color: '#888', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '6px'
                                                }}>
                                                    <Plus size={14} /> İlk ürünü ekle
                                                </button>
                                            </div>
                                        ) : (
                                            cat.products.map(product => (
                                                <div key={product.id} className={`product-row ${!product.isAvailable ? 'unavailable' : ''}`}>
                                                    {product.imageUrl ? (
                                                        <img src={product.imageUrl} alt={product.name} className="product-img" />
                                                    ) : (
                                                        <div className="product-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            <ImageIcon size={20} color="#ddd" />
                                                        </div>
                                                    )}
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                            <span className="product-name">{product.name}</span>
                                                            <span className="badge-available" style={{
                                                                background: product.isAvailable ? '#f0fdf4' : '#fef2f2',
                                                                color: product.isAvailable ? '#16a34a' : '#dc2626',
                                                            }}>
                                                                {product.isAvailable ? 'Mevcut' : 'Tükendi'}
                                                            </span>
                                                        </div>
                                                        {product.description && <p className="product-desc">{product.description}</p>}
                                                    </div>
                                                    <span className="product-price">{product.price.toFixed(2)} ₺</span>

                                                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                                        <div className="toggle-btn" title={product.isAvailable ? 'Stoktan Kaldır' : 'Stoka Ekle'}
                                                            onClick={() => toggleAvailability(product)}>
                                                            {product.isAvailable
                                                                ? <ToggleRight size={24} color="#16a34a" />
                                                                : <ToggleLeft size={24} color="#ccc" />}
                                                        </div>
                                                        <button className="action-btn" title="Düzenle"
                                                            onClick={() => openEditProduct(product, cat.id)}>
                                                            <Edit size={15} color="#0ea5e9" />
                                                        </button>
                                                        <button className="action-btn danger" title="Sil"
                                                            onClick={() => setConfirmDelete({ type: 'product', id: product.id, name: product.name })}>
                                                            <Trash2 size={15} color="#ef4444" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {/* Footer */}
            <div style={{ padding: '0 28px 28px', textAlign: 'center', color: '#bbb', fontSize: '0.8rem' }}>
                {new Date().getFullYear()} QRlamenü — Tüm Hakları Saklıdır.
            </div>

            {/* ============ CATEGORY MODAL ============ */}
            {showCatModal && (
                <div className="modal-overlay" onClick={() => setShowCatModal(false)}>
                    <div className="modal-box" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{editingCat ? 'Kategori Düzenle' : 'Kategori Ekle'}</h3>
                            <button onClick={() => setShowCatModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999' }}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Kategori Adı</label>
                                <input
                                    className="form-input"
                                    placeholder="Örn: İçecekler, Ana Yemekler..."
                                    value={catForm.name}
                                    onChange={e => setCatForm(p => ({ ...p, name: e.target.value }))}
                                    autoFocus
                                />
                            </div>
                            <div className="form-group">
                                <label>Resim URL (opsiyonel)</label>
                                <input
                                    className="form-input"
                                    placeholder="https://... veya boş bırakın"
                                    value={catForm.imageUrl}
                                    onChange={e => setCatForm(p => ({ ...p, imageUrl: e.target.value }))}
                                />
                                {catForm.imageUrl && (
                                    <div style={{ marginTop: '10px' }}>
                                        <img src={catForm.imageUrl} alt="Önizleme" className="image-preview" />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={() => setShowCatModal(false)}>İptal</button>
                            <button className="btn-primary" disabled={saving || !catForm.name.trim()} onClick={handleSaveCategory}>
                                {saving ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Check size={16} />}
                                {editingCat ? 'Güncelle' : 'Kaydet'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ============ PRODUCT MODAL ============ */}
            {showItemModal && (
                <div className="modal-overlay" onClick={() => setShowItemModal(false)}>
                    <div className="modal-box" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{editingItem ? 'Ürün Düzenle' : 'Ürün Ekle'}</h3>
                            <button onClick={() => setShowItemModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999' }}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Ürün Başlığı *</label>
                                <input
                                    className="form-input"
                                    placeholder="Örn: Türk Kahvesi, Adana Kebap..."
                                    value={itemForm.name}
                                    onChange={e => setItemForm(p => ({ ...p, name: e.target.value }))}
                                    autoFocus
                                />
                            </div>
                            <div className="form-group">
                                <label>Ürün Açıklaması</label>
                                <textarea
                                    className="form-input form-textarea"
                                    placeholder="Ürün hakkında kısa bir açıklama..."
                                    value={itemForm.description}
                                    onChange={e => setItemForm(p => ({ ...p, description: e.target.value }))}
                                />
                            </div>
                            <div className="form-group">
                                <label>Fiyat (₺) *</label>
                                <input
                                    className="form-input"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="0.00"
                                    value={itemForm.price}
                                    onChange={e => setItemForm(p => ({ ...p, price: e.target.value }))}
                                />
                            </div>
                            <div className="form-group">
                                <label>Resim URL (opsiyonel)</label>
                                <input
                                    className="form-input"
                                    placeholder="https://... veya boş bırakın"
                                    value={itemForm.imageUrl}
                                    onChange={e => setItemForm(p => ({ ...p, imageUrl: e.target.value }))}
                                />
                                {itemForm.imageUrl && (
                                    <div style={{ marginTop: '10px' }}>
                                        <img src={itemForm.imageUrl} alt="Önizleme" className="image-preview" />
                                    </div>
                                )}
                            </div>
                            <div className="form-group">
                                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                                    <div onClick={() => setItemForm(p => ({ ...p, isAvailable: !p.isAvailable }))}
                                        style={{ display: 'flex', alignItems: 'center' }}>
                                        {itemForm.isAvailable
                                            ? <ToggleRight size={28} color="#16a34a" />
                                            : <ToggleLeft size={28} color="#ccc" />}
                                    </div>
                                    <span style={{ fontWeight: 500, color: itemForm.isAvailable ? '#16a34a' : '#999' }}>
                                        {itemForm.isAvailable ? 'Mevcut (Stokta)' : 'Tükendi (Stok Dışı)'}
                                    </span>
                                </label>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={() => setShowItemModal(false)}>İptal</button>
                            <button
                                className="btn-primary"
                                disabled={saving || !itemForm.name.trim() || !itemForm.price}
                                onClick={handleSaveProduct}
                            >
                                {saving ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Check size={16} />}
                                {editingItem ? 'Güncelle' : 'Kaydet'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
