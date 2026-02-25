"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Check } from 'lucide-react';

export default function EditThemePage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        key: '',
        name: '',
        description: '',
        previewUrl: '',
        isPremium: false,
        isActive: true,
        order: 0
    });

    useEffect(() => {
        fetchTheme();
    }, []);

    const fetchTheme = async () => {
        try {
            const res = await fetch(`/api/admin/themes/${params.id}`);
            // This endpoint technically needs to be created or I can fetch all and filter, but better to have GET by ID. I'll assume GET /api/admin/themes returns all, checking if I need specific ID GET... 
            // Actually I implemented PUT/DELETE on [id], but usually GET is also needed there. I missed GET on [id]. 
            // I will implement GET on [id] in the same file as PUT/DELETE. 
            // For now let's assume I fix the API in the next step or use filter from list.
            // I will fix the API right after this.

            // Temporary workaround if GET [id] not exists: fetch all and find. 
            // But let's assume I will add GET to [id]/route.ts
            const data = await res.json();
            if (data.error) {
                alert('Tema bulunamadı');
                return;
            }
            setFormData({
                key: data.key,
                name: data.name,
                description: data.description || '',
                previewUrl: data.previewUrl || '',
                isPremium: data.isPremium,
                isActive: data.isActive,
                order: data.order
            });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const res = await fetch(`/api/admin/themes/${params.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    order: Number(formData.order)
                })
            });

            if (res.ok) {
                router.push('/super-admin/temalar');
            } else {
                alert('Tema güncellenirken bir hata oluştu.');
            }
        } catch (error) {
            console.error(error);
            alert('Bir hata oluştu.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-6 text-[13px] font-medium text-slate-500">Yükleniyor...</div>;

    return (
        <div className="p-4 md:p-6 lg:p-8 w-full max-w-2xl mx-auto font-sans">
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 transition-colors text-[13px] font-medium"
            >
                <ArrowLeft size={16} /> Geri Dön
            </button>

            <div className="bg-white rounded-[6px] shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-5 border-b border-slate-100">
                    <h1 className="text-[16px] font-semibold text-slate-900 uppercase tracking-tight">Temayı Düzenle</h1>
                </div>

                <form onSubmit={handleSubmit} className="p-5 space-y-5">
                    <div>
                        <label className="block text-[12px] font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">Tema Anahtarı (Key)</label>
                        <input
                            type="text"
                            name="key"
                            required
                            value={formData.key}
                            onChange={handleChange}
                            className="w-full h-9 border border-slate-200 rounded-[4px] px-3 text-[13px] bg-slate-50 cursor-not-allowed text-slate-500 focus:outline-none uppercase"
                            readOnly // Key usually shouldn't change
                        />
                    </div>

                    <div>
                        <label className="block text-[12px] font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">Tema Adı</label>
                        <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full h-9 border border-slate-200 rounded-[4px] px-3 text-[13px] focus:ring-1 focus:ring-slate-400 focus:border-slate-400 outline-none transition-all placeholder:text-slate-400"
                        />
                    </div>

                    <div>
                        <label className="block text-[12px] font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">Açıklama</label>
                        <textarea
                            name="description"
                            rows={3}
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full border border-slate-200 rounded-[4px] px-3 py-2 text-[13px] focus:ring-1 focus:ring-slate-400 focus:border-slate-400 outline-none transition-all min-h-[80px] resize-y placeholder:text-slate-400"
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-[12px] font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">Önizleme Görsel URL</label>
                        <input
                            type="url"
                            name="previewUrl"
                            value={formData.previewUrl}
                            onChange={handleChange}
                            className="w-full h-9 border border-slate-200 rounded-[4px] px-3 text-[13px] focus:ring-1 focus:ring-slate-400 focus:border-slate-400 outline-none transition-all placeholder:text-slate-400"
                        />
                    </div>

                    <div className="flex gap-6">
                        <label className="flex items-center gap-2 cursor-pointer group hover:opacity-80 transition-opacity">
                            <div className="relative flex items-center justify-center">
                                <input
                                    type="checkbox"
                                    id="isPremium"
                                    name="isPremium"
                                    checked={formData.isPremium}
                                    onChange={handleChange}
                                    className="peer appearance-none w-4 h-4 border border-slate-300 rounded-[3px] bg-white checked:bg-slate-900 checked:border-slate-900 focus:outline-none transition-all cursor-pointer"
                                />
                                <Check size={12} className="absolute text-white pointer-events-none opacity-0 peer-checked:opacity-100" strokeWidth={3} />
                            </div>
                            <span className="text-[13px] font-semibold text-slate-600 group-hover:text-slate-900 transition-colors uppercase tracking-wider">Premium Tema</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer group hover:opacity-80 transition-opacity">
                            <div className="relative flex items-center justify-center">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={handleChange}
                                    className="peer appearance-none w-4 h-4 border border-slate-300 rounded-[3px] bg-white checked:bg-emerald-600 checked:border-emerald-600 focus:outline-none transition-all cursor-pointer"
                                />
                                <Check size={12} className="absolute text-white pointer-events-none opacity-0 peer-checked:opacity-100" strokeWidth={3} />
                            </div>
                            <span className="text-[13px] font-semibold text-slate-600 group-hover:text-slate-900 transition-colors uppercase tracking-wider">Aktif</span>
                        </label>
                    </div>

                    <div>
                        <label className="block text-[12px] font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">Sıralama</label>
                        <input
                            type="number"
                            name="order"
                            value={formData.order}
                            onChange={handleChange}
                            className="w-24 h-9 border border-slate-200 rounded-[4px] px-3 text-[13px] focus:ring-1 focus:ring-slate-400 focus:border-slate-400 outline-none transition-all text-center font-medium"
                        />
                    </div>

                    <div className="pt-5 border-t border-slate-100 flex justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex items-center gap-2 bg-slate-900 text-white px-5 h-9 rounded-[6px] text-[13px] font-semibold hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm uppercase tracking-wide"
                        >
                            <Save size={16} />
                            {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
