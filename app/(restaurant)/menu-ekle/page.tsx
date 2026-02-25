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
    ImageIcon,
    Package,
    AlertTriangle,
    Check,
    Loader2,
    Search,
    ToggleLeft,
    ToggleRight,
    Upload,
    CheckCircle2,
    AlertCircle,
    LayoutGrid,
    MoreVertical,
    Save,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

import { MobileMenuToggle, ProfileDropdown } from '@/components/HeaderActions';
import { LoadingScreen } from '@/components/ui/loading-screen';

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

export default function MenuEkle() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set());
    const [searchTerm, setSearchTerm] = useState('');

    // Notification
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const showMessage = (message: string, type: 'success' | 'error') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

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

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

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
                showMessage(editingCat ? 'Kategori güncellendi!' : 'Kategori eklendi!', 'success');
                setShowCatModal(false);
                fetchCategories();
            } else {
                showMessage('Hata oluştu', 'error');
            }
        } catch { showMessage('Bağlantı hatası', 'error'); }
        finally { setSaving(false); }
    };

    const handleDeleteCategory = async (id: string) => {
        try {
            const res = await fetch(`/api/restaurant/categories?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                showMessage('Kategori silindi!', 'success');
                fetchCategories();
            } else {
                showMessage('Silinemedi', 'error');
            }
        } catch { showMessage('Bağlantı hatası', 'error'); }
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
                showMessage(editingItem ? 'Ürün güncellendi!' : 'Ürün eklendi!', 'success');
                setShowItemModal(false);
                fetchCategories();
            } else {
                showMessage('Hata oluştu', 'error');
            }
        } catch { showMessage('Bağlantı hatası', 'error'); }
        finally { setSaving(false); }
    };

    const handleDeleteProduct = async (id: string) => {
        try {
            const res = await fetch(`/api/restaurant/products?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                showMessage('Ürün silindi!', 'success');
                fetchCategories();
            } else {
                showMessage('Silinemedi', 'error');
            }
        } catch { showMessage('Bağlantı hatası', 'error'); }
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
        } catch { showMessage('Hata', 'error'); }
    };

    // ============ FILTER ============
    const filteredCategories = categories.filter(cat => {
        if (!searchTerm) return true;
        const s = searchTerm.toLowerCase();
        if (cat.name.toLowerCase().includes(s)) return true;
        return cat.products.some(p => p.name.toLowerCase().includes(s));
    });

    const totalProducts = categories.reduce((sum, c) => sum + c.products.length, 0);

    return (
        <div className="p-0 bg-[#f8fafc] min-h-screen pb-20">
            {/* Notification */}
            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, y: -100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -100 }}
                        className={`fixed top-8 left-1/2 -translate-x-1/2 z-[9999] px-6 py-3 rounded-md shadow-2xl flex items-center gap-4 border ${notification.type === 'success'
                            ? 'bg-slate-900 border-slate-800 text-white'
                            : 'bg-rose-600 border-rose-500 text-white'
                            }`}
                    >
                        {notification.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                        <span className="text-xs font-black uppercase tracking-widest leading-none">{notification.message}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header / Sub-Header Area */}
            <div className="bg-white px-4 lg:px-8 py-6 border-b border-slate-200 relative z-30 w-full transition-all">
                <div className="w-full mx-auto flex flex-col xl:flex-row xl:items-center justify-between gap-8">
                    <div className="flex items-start md:items-center gap-4 md:gap-8">
                        <MobileMenuToggle />
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                                <Link href="/dashboard" className="hover:text-slate-900 transition-colors">PANEL</Link>
                                <ChevronRight size={8} className="text-slate-300" />
                                <span className="text-slate-900">MENÜ YÖNETİMİ</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <h1 className="text-2xl font-bold text-slate-900 tracking-tight leading-none uppercase">Kategori & Ürünler</h1>
                                <div className="h-0.5 w-0.5 bg-slate-200 rounded-full" />
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 py-0.5 bg-slate-50 border border-slate-200 rounded-[4px]">Katalog Yönetimi</span>
                            </div>
                        </div>

                        <div className="hidden lg:flex items-center gap-4 ml-4">
                            <div className="bg-slate-50 px-5 py-3 rounded-[6px] flex items-center gap-5 border border-slate-200 shadow-sm">
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1.5">Kategori</span>
                                    <span className="text-[15px] font-bold text-slate-900 tracking-tight leading-none">{categories.length}</span>
                                </div>
                                <div className="w-px h-6 bg-slate-200" />
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1.5">Toplam Ürün</span>
                                    <span className="text-[15px] font-bold text-slate-900 tracking-tight leading-none">{totalProducts}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-600 transition-colors duration-300" size={14} strokeWidth={2.5} />
                            <input
                                placeholder="KATALOGDA ARA..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="pl-10 pr-6 py-3.5 bg-slate-50 border border-slate-200 rounded-[6px] text-[11px] font-bold placeholder:text-slate-300 focus:border-orange-600 focus:bg-white focus:ring-4 focus:ring-orange-500/5 outline-none transition-all w-full sm:w-64 uppercase tracking-widest shadow-inner shadow-slate-900/5"
                            />
                        </div>
                        <button
                            onClick={openAddCategory}
                            className="bg-slate-900 text-white px-8 py-3.5 rounded-[6px] flex items-center gap-3 text-[11px] font-bold tracking-widest shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition-all active:scale-[0.98] uppercase"
                        >
                            <Plus size={16} strokeWidth={2.5} />
                            Yeni Kategori Ekle
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-4 lg:p-6">
                <div className="w-full mx-auto">
                    {loading && <LoadingScreen message="MENÜ VERİLERİ HAZIRLANIYOR" />}
                    {!loading && filteredCategories.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-md border border-slate-100 p-20 text-center shadow-sm"
                        >
                            <div className="w-16 h-16 bg-slate-50 rounded-md flex items-center justify-center mx-auto mb-8 border border-slate-200">
                                <FolderPlus size={32} className="text-slate-400" strokeWidth={1.5} />
                            </div>
                            <h3 className="text-xl font-black text-gray-900 mb-2 tracking-tighter uppercase">
                                {searchTerm ? 'SONUÇ BULUNAMADI' : 'MENÜNÜZ HENÜZ BOŞ'}
                            </h3>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-10">
                                {searchTerm ? 'FARKLI BİR ARAMA TERİMİ DENEYİN' : 'İLK KATEGORİNİZİ EKLEYEREK BAŞLAYIN'}
                            </p>
                            {!searchTerm && (
                                <button
                                    onClick={openAddCategory}
                                    className="inline-flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-md text-[10px] font-black tracking-widest hover:bg-black transition-all shadow-md"
                                >
                                    <Plus size={16} strokeWidth={3} />
                                    KATEGORİ OLUŞTUR
                                </button>
                            )}
                        </motion.div>
                    ) : (
                        <div className="space-y-4">
                            {filteredCategories.map((cat, index) => {
                                const isExpanded = expandedCats.has(cat.id);
                                return (
                                    <motion.div
                                        key={cat.id}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className={`bg-white rounded-[6px] border transition-all duration-300 overflow-hidden ${isExpanded ? 'border-slate-300 shadow-md' : 'border-slate-200 hover:border-slate-300 shadow-sm'}`}
                                    >
                                        {/* Category Header */}
                                        <div
                                            onClick={() => toggleCategory(cat.id)}
                                            className="p-5 lg:p-6 flex items-center gap-6 cursor-pointer group bg-white hover:bg-slate-50/50 transition-colors"
                                        >
                                            <div className="flex items-center gap-5 flex-1">
                                                <div className="hidden md:flex items-center justify-center cursor-grab active:cursor-grabbing p-2 text-slate-300 hover:text-slate-600 transition-colors">
                                                    <GripVertical size={18} />
                                                </div>
                                                <div className="relative">
                                                    {cat.imageUrl ? (
                                                        <img src={cat.imageUrl} alt={cat.name} className="w-14 h-14 rounded-[4px] object-cover border border-slate-200 shadow-sm" />
                                                    ) : (
                                                        <div className="w-14 h-14 rounded-[4px] bg-slate-50 flex items-center justify-center border border-slate-200 group-hover:bg-slate-100 transition-colors">
                                                            <LayoutGrid size={20} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
                                                        </div>
                                                    )}
                                                    <div className="absolute -top-2 -right-2 bg-slate-900 text-white text-[9px] font-bold w-6 h-6 rounded-[4px] flex items-center justify-center border-2 border-white shadow-sm">
                                                        {cat.products.length}
                                                    </div>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1 leading-none">Kategori</span>
                                                    <h3 className="text-lg font-bold text-slate-900 tracking-tight uppercase leading-none">{cat.name}</h3>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <div className="hidden sm:flex items-center gap-2 mr-2" onClick={e => e.stopPropagation()}>
                                                    <button
                                                        onClick={() => openAddProduct(cat.id)}
                                                        className="w-10 h-10 bg-slate-900 text-white rounded-[4px] flex items-center justify-center hover:bg-black transition-all shadow-sm active:scale-95"
                                                        title="Ürün Ekle"
                                                    >
                                                        <Plus size={16} strokeWidth={2.5} />
                                                    </button>
                                                    <button
                                                        onClick={() => openEditCategory(cat)}
                                                        className="w-10 h-10 bg-white text-slate-600 border border-slate-200 rounded-[4px] flex items-center justify-center hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm active:scale-95"
                                                        title="Düzenle"
                                                    >
                                                        <Edit size={16} strokeWidth={2} />
                                                    </button>
                                                    <button
                                                        onClick={() => setConfirmDelete({ type: 'category', id: cat.id, name: cat.name })}
                                                        className="w-10 h-10 bg-white text-slate-300 border border-slate-100 rounded-[4px] flex items-center justify-center hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all shadow-sm active:scale-95"
                                                        title="Sil"
                                                    >
                                                        <Trash2 size={16} strokeWidth={2} />
                                                    </button>
                                                </div>
                                                <div className={`w-10 h-10 rounded-[4px] flex items-center justify-center transition-all ${isExpanded ? 'bg-orange-50 text-orange-600 rotate-180 border border-orange-100' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>
                                                    <ChevronDown size={16} strokeWidth={3} />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Products Area */}
                                        <AnimatePresence>
                                            {isExpanded && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="border-t border-slate-100 bg-slate-50/20"
                                                >
                                                    <div className="p-4 md:p-6 space-y-3">
                                                        {cat.products.length === 0 ? (
                                                            <div className="py-16 text-center bg-white/50 rounded-[4px] border border-dashed border-slate-200">
                                                                <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                                                                    <Package size={28} className="text-slate-300" strokeWidth={1.5} />
                                                                </div>
                                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 px-4">Bu kategoriye henüz ürün eklenmemiş.</p>
                                                                <button
                                                                    onClick={() => openAddProduct(cat.id)}
                                                                    className="inline-flex items-center gap-3 bg-white text-slate-900 border border-slate-200 px-8 py-3.5 rounded-[6px] text-[10px] font-bold tracking-widest hover:border-slate-900 hover:bg-slate-900 hover:text-white transition-all active:scale-95 shadow-sm"
                                                                >
                                                                    <Plus size={14} strokeWidth={3} />
                                                                    İLK ÜRÜNÜ EKLE
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            cat.products.map(product => (
                                                                <div
                                                                    key={product.id}
                                                                    className={`group bg-white rounded-[4px] p-3 md:p-4 flex items-center gap-4 md:gap-6 border transition-all hover:shadow-md ${!product.isAvailable ? 'border-slate-100 bg-slate-50/80 grayscale opacity-75' : 'border-slate-200 hover:border-slate-300'}`}
                                                                >
                                                                    <div className="relative">
                                                                        {product.imageUrl ? (
                                                                            <img src={product.imageUrl} alt={product.name} className="w-14 h-14 md:w-20 md:h-20 rounded-[4px] object-cover border border-slate-100" />
                                                                        ) : (
                                                                            <div className="w-14 h-14 md:w-20 md:h-20 rounded-[4px] bg-slate-50 flex items-center justify-center border border-slate-100 text-slate-300 group-hover:text-slate-400 transition-colors">
                                                                                <ImageIcon size={24} strokeWidth={1.5} />
                                                                            </div>
                                                                        )}
                                                                    </div>

                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-1.5">
                                                                            <h4 className="text-base font-bold text-slate-900 tracking-tight uppercase truncate">{product.name}</h4>
                                                                            <div className={`inline-flex px-2 py-0.5 rounded-[4px] text-[9px] font-bold uppercase tracking-widest border ${product.isAvailable ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-rose-50 border-rose-100 text-rose-600'}`}>
                                                                                {product.isAvailable ? 'STOKTA' : 'TÜKENDİ'}
                                                                            </div>
                                                                        </div>
                                                                        {product.description && (
                                                                            <p className="text-[12px] font-medium text-slate-500 line-clamp-1 leading-relaxed">{product.description}</p>
                                                                        )}
                                                                    </div>

                                                                    <div className="flex items-center gap-6">
                                                                        <div className="text-right hidden md:block">
                                                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block leading-none mb-1">Fiyat</span>
                                                                            <span className="text-xl font-bold text-orange-600 tracking-tight leading-none">{product.price.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺</span>
                                                                        </div>

                                                                        <div className="flex items-center gap-2">
                                                                            <button
                                                                                onClick={() => toggleAvailability(product)}
                                                                                className={`w-10 h-10 rounded-[4px] flex items-center justify-center transition-all border ${product.isAvailable ? 'bg-white text-slate-400 border-slate-200 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50' : 'bg-slate-100 text-slate-300 border-slate-200 hover:text-orange-600 hover:border-orange-200 hover:bg-orange-50'}`}
                                                                                title={product.isAvailable ? 'Stoktan Kaldır' : 'Stoka Ekle'}
                                                                            >
                                                                                {product.isAvailable ? <ToggleRight size={20} strokeWidth={2.5} /> : <ToggleLeft size={20} strokeWidth={2.5} />}
                                                                            </button>
                                                                            <button
                                                                                onClick={() => openEditProduct(product, cat.id)}
                                                                                className="w-10 h-10 bg-white text-slate-600 border border-slate-200 rounded-[4px] flex items-center justify-center hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm active:scale-95"
                                                                                title="Düzenle"
                                                                            >
                                                                                <Edit size={16} strokeWidth={2} />
                                                                            </button>
                                                                            <button
                                                                                onClick={() => setConfirmDelete({ type: 'product', id: product.id, name: product.name })}
                                                                                className="w-10 h-10 bg-white text-slate-300 border border-slate-100 rounded-[4px] flex items-center justify-center hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all shadow-sm active:scale-95"
                                                                                title="Sil"
                                                                            >
                                                                                <Trash2 size={16} strokeWidth={2} />
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Footer Area */}
            <div className="w-full mx-auto px-8 py-16 flex flex-col md:flex-row items-center justify-between gap-8 border-t border-slate-200 mt-20">
                <div className="flex items-center gap-4">
                    <div className="h-px w-8 bg-slate-200" />
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">© {new Date().getFullYear()} MESA — TÜM HAKLARI SAKLIDIR</p>
                </div>
                <div className="flex items-center gap-10">
                    <Link href="#" className="text-[10px] font-bold text-slate-400 hover:text-orange-600 transition-colors uppercase tracking-[0.15em]">YARDIM MERKEZİ</Link>
                    <Link href="#" className="text-[10px] font-bold text-slate-400 hover:text-orange-600 transition-colors uppercase tracking-[0.15em]">GİZLİLİK POLİTİKASI</Link>
                </div>
            </div>

            {/* Modals & Dialogs */}
            <AnimatePresence>
                {/* Delete Confirm */}
                {confirmDelete && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md"
                        onClick={() => setConfirmDelete(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-[6px] w-full max-w-sm p-10 shadow-2xl relative overflow-hidden text-center border border-slate-200"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mb-8 border border-rose-100 mx-auto">
                                <Trash2 size={32} className="text-rose-500" strokeWidth={1.5} />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight uppercase">EMİN MİSİNİZ?</h3>
                            <p className="text-[13px] font-medium text-slate-500 uppercase tracking-tight leading-relaxed">
                                <span className="text-orange-600 font-bold">"{confirmDelete.name}"</span> {confirmDelete.type === 'category' ? 've altındaki tüm ürünler' : ''} kalıcı olarak silinecektir. Bu işlem geri alınamaz.
                            </p>
                            <div className="grid grid-cols-2 gap-4 mt-10">
                                <button
                                    onClick={() => setConfirmDelete(null)}
                                    className="px-6 py-4 bg-slate-50 text-slate-400 rounded-[6px] text-[11px] font-bold tracking-widest hover:bg-slate-100 transition-all uppercase"
                                >
                                    VAZGEÇ
                                </button>
                                <button
                                    onClick={() => confirmDelete.type === 'category' ? handleDeleteCategory(confirmDelete.id) : handleDeleteProduct(confirmDelete.id)}
                                    className="px-6 py-4 bg-rose-600 text-white rounded-[6px] text-[11px] font-bold tracking-widest hover:bg-rose-700 transition-all shadow-lg shadow-rose-600/20 uppercase"
                                >
                                    SİL
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {/* Category Modal */}
                {showCatModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-lg"
                        onClick={() => setShowCatModal(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 40 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 40 }}
                            className="bg-white rounded-[6px] w-full max-w-lg p-8 lg:p-10 shadow-2xl relative border border-slate-200"
                            onClick={e => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setShowCatModal(false)}
                                className="absolute top-8 right-8 w-12 h-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center hover:bg-slate-100 hover:text-slate-900 transition-all border border-slate-100 shadow-sm"
                            >
                                <X size={24} strokeWidth={2.5} />
                            </button>

                            <div className="flex items-center gap-6 mb-12">
                                <div className="w-16 h-16 bg-slate-900 text-white rounded-[6px] flex items-center justify-center shadow-lg shadow-slate-900/20 border border-slate-800">
                                    <FolderPlus size={32} strokeWidth={2} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1.5 leading-none">Menü Modülü</span>
                                    <h3 className="text-3xl font-bold text-slate-900 tracking-tight uppercase leading-none">{editingCat ? 'Kategori Düzenle' : 'Yeni Kategori Ekle'}</h3>
                                </div>
                            </div>

                            <div className="space-y-10">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Kategori Adı *</label>
                                    <input
                                        placeholder="ÖR: İÇECEKLER, ANA YEMEKLER..."
                                        value={catForm.name}
                                        onChange={e => setCatForm(p => ({ ...p, name: e.target.value }))}
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-[6px] text-[13px] font-bold placeholder:text-slate-300 focus:border-slate-900 focus:bg-white focus:ring-4 focus:ring-slate-900/5 outline-none transition-all uppercase tracking-tight"
                                        autoFocus
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Kategori Görseli (URL)</label>
                                    <div className="flex gap-4 items-center">
                                        <div className="relative flex-1">
                                            <ImageIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                            <input
                                                placeholder="HTTPS://..."
                                                value={catForm.imageUrl}
                                                onChange={e => setCatForm(p => ({ ...p, imageUrl: e.target.value }))}
                                                className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-[6px] text-[13px] font-bold placeholder:text-slate-300 focus:border-slate-900 focus:bg-white outline-none transition-all"
                                            />
                                        </div>
                                        {catForm.imageUrl && (
                                            <div className="w-14 h-14 rounded-[4px] bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                                                <img src={catForm.imageUrl} className="w-full h-full object-cover" alt="Preview" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-14 pt-8 border-t border-slate-100 flex justify-end">
                                <button
                                    disabled={saving || !catForm.name.trim()}
                                    onClick={handleSaveCategory}
                                    className="px-10 py-4 bg-slate-900 text-white rounded-[6px] text-[11px] font-bold tracking-widest hover:bg-slate-800 transition-all flex items-center gap-3 shadow-lg shadow-slate-900/10 active:scale-[0.98] disabled:opacity-50 uppercase"
                                >
                                    {saving ? <Loader2 className="animate-spin" size={18} /> : (editingCat ? <Save size={18} /> : <Plus size={18} strokeWidth={2.5} />)}
                                    {editingCat ? 'Güncelle ve Kaydet' : 'Kategori Oluştur'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {/* Product Modal */}
                {showItemModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-lg"
                        onClick={() => setShowItemModal(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 40 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 40 }}
                            className="bg-white rounded-[6px] w-full max-w-2xl p-8 lg:p-10 shadow-2xl relative border border-slate-200"
                            onClick={e => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setShowItemModal(false)}
                                className="absolute top-8 right-8 w-12 h-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center hover:bg-slate-100 hover:text-slate-900 transition-all border border-slate-100 shadow-sm"
                            >
                                <X size={24} strokeWidth={2.5} />
                            </button>

                            <div className="flex items-center gap-6 mb-12">
                                <div className="w-16 h-16 bg-blue-600 text-white rounded-[6px] flex items-center justify-center shadow-lg shadow-blue-600/20 border border-blue-500">
                                    <Package size={32} strokeWidth={2} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1.5 leading-none">Ürün Modülü</span>
                                    <h3 className="text-3xl font-bold text-slate-900 tracking-tight uppercase leading-none">{editingItem ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}</h3>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Ürün Adı *</label>
                                        <input
                                            placeholder="ÖR: ADANA KEBAP, AYRAN..."
                                            value={itemForm.name}
                                            onChange={e => setItemForm(p => ({ ...p, name: e.target.value }))}
                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-[6px] text-[13px] font-bold placeholder:text-slate-300 focus:border-slate-900 focus:bg-white outline-none transition-all uppercase tracking-tight"
                                            autoFocus
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Fiyat (₺) *</label>
                                        <div className="relative">
                                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-orange-600 font-bold text-lg">₺</span>
                                            <input
                                                type="number"
                                                step="0.01"
                                                placeholder="0.00"
                                                value={itemForm.price}
                                                onChange={e => setItemForm(p => ({ ...p, price: e.target.value }))}
                                                className="w-full pl-12 pr-6 py-5 bg-slate-900 text-white rounded-[6px] text-xl font-bold placeholder:text-slate-600 focus:bg-black outline-none transition-all shadow-lg shadow-slate-900/10"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Stok Durumu</label>
                                        <button
                                            onClick={() => setItemForm(p => ({ ...p, isAvailable: !p.isAvailable }))}
                                            className={`w-full px-6 py-4 rounded-[6px] flex items-center justify-between border transition-all duration-300 ${itemForm.isAvailable ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-rose-50 border-rose-100 text-rose-600'}`}
                                        >
                                            <span className="text-[11px] font-bold uppercase tracking-widest">{itemForm.isAvailable ? 'SATIŞTA / AKTİF' : 'TÜKENDİ / PASİF'}</span>
                                            {itemForm.isAvailable ? <ToggleRight size={28} strokeWidth={2.5} /> : <ToggleLeft size={28} strokeWidth={2.5} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Ürün Açıklaması</label>
                                        <textarea
                                            placeholder="ÜRÜN İÇERİĞİ, MALZEME BİLGİSİ VB."
                                            value={itemForm.description}
                                            onChange={e => setItemForm(p => ({ ...p, description: e.target.value }))}
                                            rows={4}
                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-[6px] text-[13px] font-medium placeholder:text-slate-300 focus:border-slate-900 focus:bg-white outline-none transition-all uppercase resize-none tracking-tight leading-relaxed"
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Ürün Görseli (URL)</label>
                                        <div className="flex gap-4 items-center">
                                            <div className="relative flex-1">
                                                <ImageIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                                <input
                                                    placeholder="HTTPS://..."
                                                    value={itemForm.imageUrl}
                                                    onChange={e => setItemForm(p => ({ ...p, imageUrl: e.target.value }))}
                                                    className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-[6px] text-[13px] font-bold placeholder:text-slate-300 focus:border-slate-900 focus:bg-white outline-none transition-all"
                                                />
                                            </div>
                                            {itemForm.imageUrl && (
                                                <div className="w-16 h-16 rounded-[4px] bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 shadow-sm text-slate-300">
                                                    <img src={itemForm.imageUrl} className="w-full h-full object-cover" alt="Preview" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-14 pt-8 border-t border-slate-100 flex justify-end">
                                <button
                                    disabled={saving || !itemForm.name.trim() || !itemForm.price}
                                    onClick={handleSaveProduct}
                                    className="px-10 py-4 bg-slate-900 text-white rounded-[6px] text-[11px] font-bold tracking-widest hover:bg-slate-800 transition-all flex items-center gap-3 shadow-lg shadow-slate-900/10 active:scale-[0.98] disabled:opacity-50 uppercase"
                                >
                                    {saving ? <Loader2 className="animate-spin" size={18} /> : (editingItem ? <Save size={18} /> : <Plus size={18} strokeWidth={2.5} />)}
                                    {editingItem ? 'Güncelle ve Kaydet' : 'Ürünü Kataloğa Ekle'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
