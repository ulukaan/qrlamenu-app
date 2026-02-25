"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Check } from 'lucide-react';

export default function NewThemePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        key: '',
        name: '',
        description: '',
        previewUrl: '',
        isPremium: false,
        isActive: true,
        order: 0
    });

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
        setLoading(true);

        try {
            const res = await fetch('/api/admin/themes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    order: Number(formData.order)
                })
            });

            if (res.ok) {
                router.push('/super-admin/temalar');
            } else {
                alert('Tema oluşturulurken bir hata oluştu.');
            }
        } catch (error) {
            console.error(error);
            alert('Bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

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
                    <h1 className="text-[16px] font-semibold text-slate-900 uppercase tracking-tight">Yeni Tema Ekle</h1>
                </div>

                <form onSubmit={handleSubmit} className="p-5 space-y-5">
                    <div>
                        <label className="block text-[12px] font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">Tema Anahtarı (Key)</label>
                        <input
                            type="text"
                            name="key"
                            required
                            placeholder="Örn: MODERN, OCEAN, DARK"
                            value={formData.key}
                            onChange={handleChange}
                            className="w-full h-9 border border-slate-200 rounded-[4px] px-3 text-[13px] focus:ring-1 focus:ring-slate-400 focus:border-slate-400 outline-none uppercase bg-slate-50 transition-all placeholder:text-slate-400"
                        />
                        <p className="text-[11px] text-slate-500 mt-1.5">Kod içinde kullanılacak benzersiz anahtar. Büyük harf ve İngilizce karakter kullanın.</p>
                    </div>

                    <div>
                        <label className="block text-[12px] font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">Tema Adı</label>
                        <input
                            type="text"
                            name="name"
                            required
                            placeholder="Örn: Modern Tema"
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
                            placeholder="Tema hakkında kısa bilgi..."
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
                            placeholder="https://example.com/image.png"
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
                            disabled={loading}
                            className="flex items-center gap-2 bg-slate-900 text-white px-5 h-9 rounded-[6px] text-[13px] font-semibold hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm uppercase tracking-wide"
                        >
                            <Save size={16} />
                            {loading ? 'Kaydediliyor...' : 'Temayı Kaydet'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
