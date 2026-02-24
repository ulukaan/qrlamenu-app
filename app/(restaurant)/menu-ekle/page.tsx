"use client";
import React, { useState, useEffect, useCallback, useRef } from 'react';
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
                        className={`fixed top-8 left-1/2 -translate-x-1/2 z-[9999] px-8 py-4 rounded-[24px] shadow-2xl flex items-center gap-4 border-2 ${notification.type === 'success'
                            ? 'bg-emerald-50 border-emerald-100 text-emerald-600'
                            : 'bg-rose-50 border-rose-100 text-rose-600'
                            }`}
                    >
                        {notification.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                        <span className="text-xs font-black uppercase tracking-widest leading-none">{notification.message}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header / Sub-Header Area */}
            <div className="bg-white px-8 md:px-12 py-10 border-b-2 border-slate-50 relative z-30 shadow-sm shadow-slate-200/5 transition-all">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3 mb-2">
                            <Link href="/dashboard" className="text-[10px] font-black text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest">PANEL</Link>
                            <span className="text-gray-200">/</span>
                            <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">MENÜ YÖNETİMİ</span>
                        </div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tighter">MENÜ & KATEGORİLER</h1>
                        <p className="text-sm font-black text-gray-400 uppercase tracking-widest">ÜRÜNLERİNİZİ DÜZENLEYİN VE YAYINLAYIN</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="bg-orange-50 px-6 py-4 rounded-[24px] flex items-center gap-4 border-2 border-orange-100/50">
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black text-orange-400 uppercase tracking-widest leading-none mb-1">KATEGORİ</span>
                                <span className="text-lg font-black text-orange-600 uppercase tracking-tighter leading-none">{categories.length}</span>
                            </div>
                            <div className="w-px h-8 bg-orange-200/50 mx-2" />
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black text-orange-400 uppercase tracking-widest leading-none mb-1">ÜRÜN</span>
                                <span className="text-lg font-black text-orange-600 uppercase tracking-tighter leading-none">{totalProducts}</span>
                            </div>
                        </div>
                        <div className="relative group">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-orange-500 transition-colors" size={18} strokeWidth={3} />
                            <input
                                placeholder="MENÜDE ARA..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="pl-14 pr-8 py-4 bg-gray-50 border-2 border-gray-100 rounded-[24px] text-xs font-black placeholder:text-gray-300 focus:border-gray-900 focus:bg-white outline-none transition-all w-64 uppercase"
                            />
                        </div>
                        <button
                            onClick={openAddCategory}
                            className="bg-gray-900 text-white px-8 py-4 rounded-[24px] flex items-center gap-3 text-xs font-black tracking-widest shadow-xl shadow-gray-900/10 hover:bg-orange-600 transition-all active:scale-95 border-b-4 border-black/20"
                        >
                            <Plus size={18} strokeWidth={3} />
                            YENİ KATEGORİ
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-8 md:p-12 lg:p-16">
                <div className="max-w-7xl mx-auto">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-32 space-y-6">
                            <div className="relative">
                                <Loader2 className="w-16 h-16 text-orange-500 animate-spin" strokeWidth={1} />
                                <div className="absolute inset-0 bg-orange-500/10 blur-2xl rounded-full" />
                            </div>
                            <p className="text-sm font-black text-gray-400 uppercase tracking-widest animate-pulse">VERİLER YÜKLENİYOR...</p>
                        </div>
                    ) : filteredCategories.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-[40px] border-2 border-slate-50 p-20 text-center shadow-sm"
                        >
                            <div className="w-24 h-24 bg-orange-50 rounded-[32px] flex items-center justify-center mx-auto mb-8 border-2 border-orange-100/50">
                                <FolderPlus size={40} className="text-orange-500" strokeWidth={1.5} />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tighter uppercase">
                                {searchTerm ? 'SONUÇ BULUNAMADI' : 'MENÜNÜZ HENÜZ BOŞ'}
                            </h3>
                            <p className="text-sm font-black text-gray-400 uppercase tracking-widest mb-10">
                                {searchTerm ? 'FARKLI BİR ARAMA TERİMİ DENEYİN' : 'İLK KATEGORİNİZİ EKLEYEREK BAŞLAYIN'}
                            </p>
                            {!searchTerm && (
                                <button
                                    onClick={openAddCategory}
                                    className="inline-flex items-center gap-3 bg-gray-900 text-white px-10 py-5 rounded-[24px] text-xs font-black tracking-widest hover:bg-orange-600 transition-all shadow-xl shadow-gray-900/10"
                                >
                                    <Plus size={18} strokeWidth={3} />
                                    KATEGORİ OLUŞTUR
                                </button>
                            )}
                        </motion.div>
                    ) : (
                        <div className="space-y-6">
                            {filteredCategories.map((cat, index) => {
                                const isExpanded = expandedCats.has(cat.id);
                                return (
                                    <motion.div
                                        key={cat.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className={`bg-white rounded-[40px] border-2 transition-all duration-500 overflow-hidden ${isExpanded ? 'border-orange-100 shadow-xl shadow-orange-900/5' : 'border-slate-50 hover:border-gray-200 shadow-sm'}`}
                                    >
                                        {/* Category Header */}
                                        <div
                                            onClick={() => toggleCategory(cat.id)}
                                            className="p-6 md:p-8 flex items-center gap-6 cursor-pointer group"
                                        >
                                            <div className="flex items-center gap-4 flex-1">
                                                <div className="hidden md:flex items-center justify-center cursor-grab active:cursor-grabbing p-2 text-gray-300 hover:text-gray-900 transition-colors">
                                                    <GripVertical size={20} />
                                                </div>
                                                <div className="relative">
                                                    {cat.imageUrl ? (
                                                        <img src={cat.imageUrl} alt={cat.name} className="w-16 h-16 rounded-[24px] object-cover border-2 border-gray-50 shadow-sm" />
                                                    ) : (
                                                        <div className="w-16 h-16 rounded-[24px] bg-gray-50 flex items-center justify-center border-2 border-gray-100 group-hover:bg-orange-50 transition-colors">
                                                            <LayoutGrid size={24} className="text-gray-300 group-hover:text-orange-400 transition-colors" />
                                                        </div>
                                                    )}
                                                    <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-sm shadow-orange-500/20">
                                                        {cat.products.length}
                                                    </div>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1 leading-none">KATEGORİ</span>
                                                    <h3 className="text-xl font-black text-gray-900 tracking-tighter uppercase leading-none">{cat.name}</h3>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <div className="hidden sm:flex items-center gap-2 mr-4" onClick={e => e.stopPropagation()}>
                                                    <button
                                                        onClick={() => openAddProduct(cat.id)}
                                                        className="w-11 h-11 bg-emerald-50 text-emerald-600 rounded-[18px] flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all shadow-sm border border-emerald-100"
                                                        title="Ürün Ekle"
                                                    >
                                                        <Plus size={18} strokeWidth={3} />
                                                    </button>
                                                    <button
                                                        onClick={() => openEditCategory(cat)}
                                                        className="w-11 h-11 bg-blue-50 text-blue-600 rounded-[18px] flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm border border-blue-100"
                                                        title="Düzenle"
                                                    >
                                                        <Edit size={16} strokeWidth={2.5} />
                                                    </button>
                                                    <button
                                                        onClick={() => setConfirmDelete({ type: 'category', id: cat.id, name: cat.name })}
                                                        className="w-11 h-11 bg-rose-50 text-rose-600 rounded-[18px] flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all shadow-sm border border-rose-100"
                                                        title="Sil"
                                                    >
                                                        <Trash2 size={16} strokeWidth={2.5} />
                                                    </button>
                                                </div>
                                                <div className={`w-11 h-11 rounded-[18px] flex items-center justify-center transition-all ${isExpanded ? 'bg-orange-500 text-white rotate-180 shadow-lg shadow-orange-500/20' : 'bg-gray-50 text-gray-400'}`}>
                                                    <ChevronDown size={20} strokeWidth={3} />
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
                                                    className="border-t-2 border-slate-50 bg-gray-50/30"
                                                >
                                                    <div className="p-4 md:p-8 space-y-3">
                                                        {cat.products.length === 0 ? (
                                                            <div className="py-12 text-center bg-white/50 rounded-[32px] border-2 border-dashed border-gray-100">
                                                                <Package size={32} className="text-gray-200 mx-auto mb-4" />
                                                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-6">BU KATEGORİDE HENÜZ ÜRÜN YOK</p>
                                                                <button
                                                                    onClick={() => openAddProduct(cat.id)}
                                                                    className="inline-flex items-center gap-3 bg-white text-gray-900 border-2 border-gray-100 px-6 py-3 rounded-[20px] text-[10px] font-black tracking-widest hover:border-orange-500 hover:text-orange-500 transition-all active:scale-95"
                                                                >
                                                                    <Plus size={14} strokeWidth={3} />
                                                                    İLK ÜRÜNÜ EKLE
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            cat.products.map(product => (
                                                                <div
                                                                    key={product.id}
                                                                    className={`group bg-white rounded-[32px] p-4 md:p-5 flex items-center gap-4 md:gap-6 border-2 transition-all hover:shadow-lg hover:shadow-gray-200/40 ${!product.isAvailable ? 'border-gray-50 bg-gray-50/50 grayscale opacity-60' : 'border-gray-50 hover:border-orange-100'}`}
                                                                >
                                                                    {product.imageUrl ? (
                                                                        <img src={product.imageUrl} alt={product.name} className="w-14 h-14 md:w-20 md:h-20 rounded-[22px] object-cover border-2 border-gray-50" />
                                                                    ) : (
                                                                        <div className="w-14 h-14 md:w-20 md:h-20 rounded-[22px] bg-gray-50 flex items-center justify-center border-2 border-gray-100 text-gray-300 group-hover:text-orange-300 transition-colors">
                                                                            <ImageIcon size={28} strokeWidth={1.5} />
                                                                        </div>
                                                                    )}

                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="flex items-center gap-3 mb-1">
                                                                            <h4 className="text-base md:text-lg font-black text-gray-900 tracking-tighter uppercase truncate leading-none">{product.name}</h4>
                                                                            <div className={`px-2 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${product.isAvailable ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-rose-50 border-rose-100 text-rose-600'}`}>
                                                                                {product.isAvailable ? 'STOKTA' : 'TÜKENDİ'}
                                                                            </div>
                                                                        </div>
                                                                        {product.description && (
                                                                            <p className="text-[11px] font-medium text-gray-400 line-clamp-1 h-4">{product.description}</p>
                                                                        )}
                                                                    </div>

                                                                    <div className="flex items-center gap-6">
                                                                        <div className="text-right hidden sm:block">
                                                                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block leading-none mb-1">FİYAT</span>
                                                                            <span className="text-lg font-black text-orange-600 tracking-tighter leading-none">{product.price.toFixed(2)} ₺</span>
                                                                        </div>

                                                                        <div className="flex items-center gap-2">
                                                                            <button
                                                                                onClick={() => toggleAvailability(product)}
                                                                                className={`w-11 h-11 rounded-[18px] flex items-center justify-center transition-all border ${product.isAvailable ? 'bg-orange-50 text-orange-500 border-orange-100 hover:bg-orange-600 hover:text-white' : 'bg-gray-100 text-gray-400 border-gray-200 hover:bg-orange-500 hover:text-white'}`}
                                                                                title={product.isAvailable ? 'Stoktan Kaldır' : 'Stoka Ekle'}
                                                                            >
                                                                                {product.isAvailable ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                                                                            </button>
                                                                            <button
                                                                                onClick={() => openEditProduct(product, cat.id)}
                                                                                className="w-11 h-11 bg-gray-50 text-gray-600 rounded-[18px] flex items-center justify-center hover:bg-gray-900 hover:text-white transition-all border border-gray-100 shadow-sm"
                                                                                title="Düzenle"
                                                                            >
                                                                                <Edit size={16} strokeWidth={2.5} />
                                                                            </button>
                                                                            <button
                                                                                onClick={() => setConfirmDelete({ type: 'product', id: product.id, name: product.name })}
                                                                                className="w-11 h-11 bg-rose-50 text-rose-600 rounded-[18px] flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all border border-rose-100 shadow-sm"
                                                                                title="Sil"
                                                                            >
                                                                                <Trash2 size={16} strokeWidth={2.5} />
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
            <div className="max-w-7xl mx-auto px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-gray-100 mt-20">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">&copy; {new Date().getFullYear()} MESA — TÜM HAKLARI SAKLIDIR</p>
                <div className="flex items-center gap-8">
                    <Link href="#" className="text-[10px] font-black text-gray-300 hover:text-orange-500 transition-colors uppercase tracking-[0.2em]">YARDIM MERKEZİ</Link>
                    <Link href="#" className="text-[10px] font-black text-gray-300 hover:text-orange-500 transition-colors uppercase tracking-[0.2em]">GİZLİLİK</Link>
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
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-gray-900/60 backdrop-blur-xl"
                        onClick={() => setConfirmDelete(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white rounded-[40px] w-full max-w-md p-12 shadow-2xl relative overflow-hidden"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="w-20 h-20 bg-rose-50 rounded-[32px] flex items-center justify-center mb-8 border-2 border-rose-100 mx-auto">
                                <Trash2 size={32} className="text-rose-600" strokeWidth={1.5} />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tighter text-center uppercase">EMİN MİSİNİZ?</h3>
                            <p className="text-sm font-black text-gray-400 uppercase tracking-widest text-center leading-relaxed">
                                <span className="text-orange-600">"{confirmDelete.name}"</span> {confirmDelete.type === 'category' ? 've altındaki tüm ürünler' : ''} kalıcı olarak silinecektir.
                            </p>
                            <div className="grid grid-cols-2 gap-4 mt-10">
                                <button
                                    onClick={() => setConfirmDelete(null)}
                                    className="px-8 py-4 bg-gray-50 text-gray-400 rounded-[24px] text-[10px] font-black tracking-widest hover:bg-gray-100 transition-all border-2 border-transparent"
                                >
                                    VAZGEÇ
                                </button>
                                <button
                                    onClick={() => confirmDelete.type === 'category' ? handleDeleteCategory(confirmDelete.id) : handleDeleteProduct(confirmDelete.id)}
                                    className="px-8 py-4 bg-rose-600 text-white rounded-[24px] text-[10px] font-black tracking-widest hover:bg-rose-700 transition-all shadow-xl shadow-rose-900/20 border-b-4 border-rose-800/40"
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
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-gray-900/80 backdrop-blur-2xl"
                        onClick={() => setShowCatModal(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 40 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 40 }}
                            className="bg-white rounded-[40px] w-full max-w-xl p-10 md:p-14 shadow-2xl relative"
                            onClick={e => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setShowCatModal(false)}
                                className="absolute top-8 right-8 w-12 h-12 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center hover:bg-rose-50 hover:text-rose-600 transition-all border border-gray-100"
                            >
                                <X size={24} strokeWidth={3} />
                            </button>

                            <div className="flex items-center gap-6 mb-12">
                                <div className="w-16 h-16 bg-orange-50 rounded-[24px] flex items-center justify-center border-2 border-orange-100">
                                    <FolderPlus size={32} className="text-orange-500" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1 leading-none">MODÜL</span>
                                    <h3 className="text-3xl font-black text-gray-900 tracking-tighter uppercase leading-none">{editingCat ? 'KATEGORİ DÜZENLE' : 'YENİ KATEGORİ'}</h3>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">KATEGORİ ADI *</label>
                                    <input
                                        placeholder="İÇECEKLER, TATLILAR VB."
                                        value={catForm.name}
                                        onChange={e => setCatForm(p => ({ ...p, name: e.target.value }))}
                                        className="w-full px-8 py-5 bg-gray-50 border-2 border-gray-100 rounded-[24px] text-sm font-black placeholder:text-gray-200 focus:border-gray-900 focus:bg-white outline-none transition-all uppercase"
                                        autoFocus
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">KATEGORİ GÖRSELİ (URL)</label>
                                    <div className="flex gap-4 items-center">
                                        <input
                                            placeholder="HTTPS://..."
                                            value={catForm.imageUrl}
                                            onChange={e => setCatForm(p => ({ ...p, imageUrl: e.target.value }))}
                                            className="flex-1 px-8 py-5 bg-gray-50 border-2 border-gray-100 rounded-[24px] text-sm font-black placeholder:text-gray-200 focus:border-gray-900 focus:bg-white outline-none transition-all"
                                        />
                                        {catForm.imageUrl && (
                                            <div className="w-16 h-16 rounded-[20px] bg-gray-50 border-2 border-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                                                <img src={catForm.imageUrl} className="w-full h-full object-cover" alt="Preview" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-14 pt-8 border-t-2 border-slate-50 flex justify-end">
                                <button
                                    disabled={saving || !catForm.name.trim()}
                                    onClick={handleSaveCategory}
                                    className="px-12 py-5 bg-gray-900 text-white rounded-[24px] text-xs font-black tracking-widest hover:bg-orange-600 transition-all flex items-center gap-3 shadow-xl shadow-gray-900/10 active:scale-95 disabled:opacity-50 border-b-4 border-black/20 uppercase"
                                >
                                    {saving ? <Loader2 className="animate-spin" size={18} /> : (editingCat ? <Save size={18} /> : <Plus size={18} />)}
                                    {editingCat ? 'GÜNCELLE' : 'EKLE'}
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
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-gray-900/80 backdrop-blur-2xl"
                        onClick={() => setShowItemModal(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 40 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 40 }}
                            className="bg-white rounded-[40px] w-full max-w-3xl p-10 md:p-14 shadow-2xl relative"
                            onClick={e => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setShowItemModal(false)}
                                className="absolute top-8 right-8 w-12 h-12 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center hover:bg-rose-50 hover:text-rose-600 transition-all border border-gray-100"
                            >
                                <X size={24} strokeWidth={3} />
                            </button>

                            <div className="flex items-center gap-6 mb-12">
                                <div className="w-16 h-16 bg-blue-50 rounded-[24px] flex items-center justify-center border-2 border-blue-100">
                                    <Package size={32} className="text-blue-500" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1 leading-none">MODÜL</span>
                                    <h3 className="text-3xl font-black text-gray-900 tracking-tighter uppercase leading-none">{editingItem ? 'ÜRÜN DÜZENLE' : 'YENİ ÜRÜN'}</h3>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">ÜRÜN ADI *</label>
                                        <input
                                            placeholder="ADANA KEBAP, AYRAN VB."
                                            value={itemForm.name}
                                            onChange={e => setItemForm(p => ({ ...p, name: e.target.value }))}
                                            className="w-full px-8 py-5 bg-gray-50 border-2 border-gray-100 rounded-[24px] text-sm font-black placeholder:text-gray-200 focus:border-gray-900 focus:bg-white outline-none transition-all uppercase"
                                            autoFocus
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">FİYAT (₺) *</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            value={itemForm.price}
                                            onChange={e => setItemForm(p => ({ ...p, price: e.target.value }))}
                                            className="w-full px-8 py-5 bg-gray-50 border-2 border-gray-100 rounded-[24px] text-sm font-black placeholder:text-gray-200 focus:border-gray-900 focus:bg-white outline-none transition-all uppercase"
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">STOK DURUMU</label>
                                        <button
                                            onClick={() => setItemForm(p => ({ ...p, isAvailable: !p.isAvailable }))}
                                            className={`w-full px-8 py-5 rounded-[24px] flex items-center justify-between border-2 transition-all ${itemForm.isAvailable ? 'bg-emerald-50/30 border-emerald-100 text-emerald-600' : 'bg-rose-50/30 border-rose-100 text-rose-600'}`}
                                        >
                                            <span className="text-xs font-black uppercase tracking-widest">{itemForm.isAvailable ? 'MEVCUT / STOKTA' : 'TÜKENDİ / YOK'}</span>
                                            {itemForm.isAvailable ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">AÇIKLAMA</label>
                                        <textarea
                                            placeholder="İÇERİK, MALZEME BİLGİSİ VB."
                                            value={itemForm.description}
                                            onChange={e => setItemForm(p => ({ ...p, description: e.target.value }))}
                                            rows={4}
                                            className="w-full px-8 py-5 bg-gray-50 border-2 border-gray-100 rounded-[32px] text-sm font-black placeholder:text-gray-200 focus:border-gray-900 focus:bg-white outline-none transition-all uppercase resize-none"
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">GÖRSEL (URL)</label>
                                        <div className="flex gap-4 items-center">
                                            <input
                                                placeholder="HTTPS://..."
                                                value={itemForm.imageUrl}
                                                onChange={e => setItemForm(p => ({ ...p, imageUrl: e.target.value }))}
                                                className="flex-1 px-8 py-5 bg-gray-50 border-2 border-gray-100 rounded-[24px] text-sm font-black placeholder:text-gray-200 focus:border-gray-900 focus:bg-white outline-none transition-all"
                                            />
                                            {itemForm.imageUrl && (
                                                <div className="w-16 h-16 rounded-[20px] bg-gray-50 border-2 border-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                                                    <img src={itemForm.imageUrl} className="w-full h-full object-cover" alt="Preview" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-14 pt-8 border-t-2 border-slate-50 flex justify-end">
                                <button
                                    disabled={saving || !itemForm.name.trim() || !itemForm.price}
                                    onClick={handleSaveProduct}
                                    className="px-12 py-5 bg-gray-900 text-white rounded-[24px] text-xs font-black tracking-widest hover:bg-orange-600 transition-all flex items-center gap-3 shadow-xl shadow-gray-900/10 active:scale-95 disabled:opacity-50 border-b-4 border-black/20 uppercase"
                                >
                                    {saving ? <Loader2 className="animate-spin" size={18} /> : (editingItem ? <Save size={18} /> : <Plus size={18} />)}
                                    {editingItem ? 'GÜNCELLE' : 'KAYDET'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
