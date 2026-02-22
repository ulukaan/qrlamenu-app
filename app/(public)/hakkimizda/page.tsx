import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AboutPage() {
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
                        <Link href="/hakkimizda" className="text-blue-600">Hakkımızda</Link>
                        <Link href="/iletisim" className="hover:text-blue-600 transition-colors">İletişim</Link>
                    </nav>
                </div>
            </header>

            <main className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="h-64 bg-slate-900 relative">
                        <div className="absolute inset-0 bg-blue-600/20"></div>
                        <div className="absolute bottom-0 left-0 p-8">
                            <h1 className="text-4xl font-bold text-white mb-2">Hakkımızda</h1>
                            <p className="text-blue-100 text-lg">Teknoloji ve gastronominin buluşma noktası.</p>
                        </div>
                    </div>

                    <div className="p-8 md:p-12 space-y-8 text-slate-700 leading-relaxed">
                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">Biz Kimiz?</h2>
                            <p>
                                QRlamenü, restoran ve kafe işletmecileri için geliştirilmiş, yeni nesil bir yönetim platformudur. Amacımız, işletmelerin dijital dönüşüm süreçlerini hızlandırarak operasyonel verimliliklerini artırmaktır. Geleneksel yöntemlerin karmaşasından uzak, sade ve güçlü bir altyapı sunuyoruz.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">Vizyonumuz</h2>
                            <p>
                                Geleceğin restoran deneyimini bugünden inşa etmek. Veri odaklı kararlar almanızı sağlayan, müşteri memnuniyetini merkeze koyan ve işletmenizin büyümesine katkıda bulunan global bir teknoloji partneri olmak.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">Değerlerimiz</h2>
                            <ul className="grid sm:grid-cols-2 gap-4">
                                <li className="flex items-start gap-3">
                                    <span className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-blue-500"></span>
                                    <span><strong>Şeffaflık:</strong> Tüm süreçlerimizde açık ve dürüstüz.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-blue-500"></span>
                                    <span><strong>Yenilikçilik:</strong> Teknolojiyi sürekli takip eder ve uygularız.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-blue-500"></span>
                                    <span><strong>Müşteri Odaklılık:</strong> Sizin başarınız bizim başarımızdır.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-blue-500"></span>
                                    <span><strong>Güvenlik:</strong> Verileriniz bizim için en değerli emanettir.</span>
                                </li>
                            </ul>
                        </section>
                    </div>
                </div>
            </main>

            <footer className="py-8 bg-white border-t border-slate-200 mt-auto">
                <div className="container px-4 mx-auto text-center text-slate-500 text-sm">
                    © 2024 QRlamenü Restoran Yönetim Sistemleri.
                </div>
            </footer>
        </div>
    );
}
