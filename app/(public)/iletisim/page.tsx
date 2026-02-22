import Link from "next/link";
import { ArrowLeft, Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="p-1 rounded-md bg-slate-100 group-hover:bg-slate-200 transition-colors">
                            <ArrowLeft className="h-5 w-5 text-slate-600" />
                        </div>
                        <span className="font-bold text-xl text-slate-900">QRlamenü</span>
                    </Link>
                    <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
                        <Link href="/" className="hover:text-blue-600 transition-colors">Ana Sayfa</Link>
                        <Link href="/hakkimizda" className="hover:text-blue-600 transition-colors">Hakkımızda</Link>
                        <Link href="/iletisim" className="text-blue-600">İletişim</Link>
                    </nav>
                </div>
            </header>

            <main className="container mx-auto px-4 py-16">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-slate-900 mb-4">İletişime Geçin</h1>
                        <p className="text-slate-600 text-lg">Sorularınız, önerileriniz veya demo talepleriniz için bize ulaşın.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Contact Info */}
                        <div className="space-y-8">
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                                <h3 className="text-xl font-bold text-slate-900 mb-6">İletişim Bilgileri</h3>
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-blue-100 rounded-lg text-blue-600 shrink-0">
                                            <MapPin className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-900">Adres</p>
                                            <p className="text-slate-600 mt-1">Teknoloji Vadisi, Girişim Plaza No:42<br />İstanbul, Türkiye</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-blue-100 rounded-lg text-blue-600 shrink-0">
                                            <Phone className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-900">Telefon</p>
                                            <p className="text-slate-600 mt-1">+90 (212) 555 00 00</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-blue-100 rounded-lg text-blue-600 shrink-0">
                                            <Mail className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-900">E-posta</p>
                                            <p className="text-slate-600 mt-1">info@qrlamenu.com</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                            <form className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Adınız</label>
                                        <input type="text" id="name" className="w-full rounded-lg border-slate-300 border p-2.5 text-slate-900 text-sm focus:ring-blue-500 focus:border-blue-500" placeholder="Adınız" />
                                    </div>
                                    <div>
                                        <label htmlFor="surname" className="block text-sm font-medium text-slate-700 mb-1">Soyadınız</label>
                                        <input type="text" id="surname" className="w-full rounded-lg border-slate-300 border p-2.5 text-slate-900 text-sm focus:ring-blue-500 focus:border-blue-500" placeholder="Soyadınız" />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">E-posta</label>
                                    <input type="email" id="email" className="w-full rounded-lg border-slate-300 border p-2.5 text-slate-900 text-sm focus:ring-blue-500 focus:border-blue-500" placeholder="ornek@mail.com" />
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">Mesajınız</label>
                                    <textarea id="message" rows={4} className="w-full rounded-lg border-slate-300 border p-2.5 text-slate-900 text-sm focus:ring-blue-500 focus:border-blue-500" placeholder="Bize iletmek istediğiniz mesaj..."></textarea>
                                </div>

                                <button type="submit" className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-bold rounded-lg text-sm px-5 py-3 text-center transition-all hover:scale-[1.01]">
                                    Gönder
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
