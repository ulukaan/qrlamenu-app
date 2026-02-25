"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';

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
            const res = await fetch(`/api/admin/themes/${params.id}`); // This endpoint technically needs to be created or I can fetch all and filter, but better to have GET by ID. I'll assume GET /api/admin/themes returns all, checking if I need specific ID GET... 
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

    if (loading) return <div className="p-6">Yükleniyor...</div>;

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-6 transition-colors"
            >
                <ArrowLeft size={18} /> Geri Dön
            </button>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h1 className="text-xl font-bold text-gray-800">Temayı Düzenle</h1>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tema Anahtarı (Key)</label>
                        <input
                            type="text"
                            name="key"
                            required
                            value={formData.key}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 focus:outline-none text-gray-500"
                            readOnly // Key usually shouldn't change
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tema Adı</label>
                        <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-600 focus:border-orange-600 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                        <textarea
                            name="description"
                            rows={3}
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-600 focus:border-orange-600 outline-none"
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Önizleme Görsel URL</label>
                        <input
                            type="url"
                            name="previewUrl"
                            value={formData.previewUrl}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-600 focus:border-orange-600 outline-none"
                        />
                    </div>

                    <div className="flex gap-6">
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isPremium"
                                name="isPremium"
                                checked={formData.isPremium}
                                onChange={handleChange}
                                className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-600"
                            />
                            <label htmlFor="isPremium" className="text-sm font-medium text-gray-700">Premium Tema</label>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isActive"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleChange}
                                className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-600"
                            />
                            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Aktif</label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sıralama</label>
                        <input
                            type="number"
                            name="order"
                            value={formData.order}
                            onChange={handleChange}
                            className="w-24 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-600 focus:border-orange-600 outline-none"
                        />
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex items-center gap-2 bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
                        >
                            <Save size={18} />
                            {saving ? 'Kaydediliyor...' : 'Kaydet'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
