import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const INITIAL_CONTENT = {
    hero: {
        title: "Mükemmel restoran,\npürüzsüz işletme.",
        subtitle: "Siparişleri hızlandırın, maliyetleri düşürün. Zarif, güçlü ve kullanımı kolay altyapımızla restoranınızı geleceğe taşıyın.",
        cta_primary: "Ücretsiz Deneyin",
        cta_secondary: "Özellikleri Keşfet"
    },
    features: [
        { icon: "QrCode", title: "QR Dijital Menü", desc: "Sıfır baskı maliyeti. Müşteriler saniyeler içinde menüye erişir ve sipariş verir." },
        { icon: "Bell", title: "Anında Bildirim", desc: "Siparişler eşzamanlı olarak mutfak ve garson ekranlarına düşer. Gecikme yok." },
        { icon: "BarChart3", title: "Detaylı Analitik", desc: "Zirve saatler, restoran performansı ve en çok satan ürünler gerçek zamanlı raporlanır." },
        { icon: "Truck", title: "Çoklu Sipariş Tipi", desc: "Masada, pakette, odada veya gel-al servis modellerinin tümü tek bir ekranda." },
        { icon: "Users", title: "Ekip Yönetimi", desc: "Detaylı yetkilendirme ve vardiya takibi ile restoran personelinizi kolayca yönetin." },
        { icon: "ShieldCheck", title: "Yüksek Güvenlik", desc: "Tamamen KVKK uyumlu altyapı, düzenli yedeklemeler ve kurum seviyesinde şifreleme." },
    ],
    pricing: [
        {
            name: "Başlangıç", price: "₺590", period: "/ay",
            desc: "Butik kafe & tek şube için dijital menüye geçiş paketi.",
            features: ["QR Menü (Mobil Optimize)", "Sınırsız Ürün Ekleme", "Masa Bazlı Sipariş Takibi", "Günlük Ciro Özeti", "Basit Satış Raporu", "1 Kullanıcı", "Standart Tema (1 adet)"],
            cta: "Ücretsiz Dene", highlight: false
        },
        {
            name: "Profesyonel", price: "₺1.290", period: "/ay",
            desc: "Büyüyen restoranlar için operasyonel kontrol seti.",
            features: ["Tüm Başlangıç Özellikleri", "Garson Çağrı Sistemi", "Ürün Bazlı Satış Analizi", "Saatlik Satış Grafiği", "Masa Doluluk Raporu", "Kampanya Banner Alanı", "WhatsApp Sipariş Yönlendirme", "6+ Premium Tema", "5 Kullanıcı", "Logo & Renk Özelleştirme"],
            cta: "Hemen Başla", highlight: true
        },
        {
            name: "Growth+", price: "₺1.990", period: "/ay",
            desc: "Yoğun çalışan işletmeler için mini Restaurant OS.",
            features: ["Tüm Profesyonel Özellikleri", "Stok Takibi (Ürün Düşümü)", "Rol Bazlı Yetkilendirme", "Çoklu Kasa Raporu", "Şube Açmaya Hazır Altyapı", "API Erişimi", "POS Entegrasyon Altyapısı", "Özel Kampanya Kurguları", "Öncelikli Destek"],
            cta: "Bize Ulaşın", highlight: false
        },
        {
            name: "Kurumsal", price: "₺3.990", period: "/ay",
            desc: "Zincir & franchise yapılar için.",
            features: ["Tüm Growth+ Özellikleri", "Sınırsız Şube", "Merkezi Dashboard (Tüm Şubeler)", "Şube Performans Karşılaştırma", "Özel Domain", "ERP / Muhasebe Entegrasyonu", "SLA Destek", "Özel Onboarding"],
            cta: "İletişime Geç", highlight: false
        },
    ],
    testimonials: [
        { name: "Ahmet Yılmaz", role: "Kapadokya Steakhouse", text: "Kurulumu saniyeler sürdü. Müşterilerimizin sipariş verme hızı %40 arttı, garson hataları tamamen bitti." },
        { name: "Selin Arslan", role: "Café Aroma", text: "Menü güncellemek artık bir zevk. Gelişmiş arayüzü sayesinde her şey çok kolay ve estetik görünüyor." },
        { name: "Emre Kaya", role: "Deniz Restaurant", text: "Raporlama ekranları işletmemizin rotasını belirlememize büyük katkı sağlıyor. Her veriye anında ulaşıyoruz." },
    ],
    stats: [
        { label: "Aktif Restoran", value: "5.000+" },
        { label: "Sistem Uptime", value: "%99.9" },
        { label: "Aylık Sipariş", value: "2M+" },
        { label: "Müşteri Değerlendirmesi", value: "4.9/5" }
    ],
    branding: {
        logoIcon: "UtensilsCrossed",
        siteName: "QRlamenü",
        logoUrl: ""
    },
    corporate: {
        about: {
            title: "Restoranların dijital dönüşüm ortağıyız.",
            content: "2024 yılında, restoran sektöründeki operasyonel zorlukları teknolojiyle çözmek amacıyla yola çıktık. Baskı maliyetleri, hatalı siparişler ve yavaşlayan servis süreçlerini tarihe gömüyoruz."
        },
        contact: {
            email: "destek@qrlamenu.com",
            phone: "+90 212 XXX XX XX",
            address: "Teknokent, İstanbul"
        },
        legal: {
            privacy: "QRlamenü olarak, verilerinizin gizliliği ve güvenliği bizim için en yüksek önceliğe sahiptir.",
            terms: "QRlamenü platformuna hoş geldiniz. Bu hizmeti kullanarak aşağıdaki koşulları kabul etmiş sayılırsınız."
        }
    }
};

export async function GET() {
    try {
        let configRecord = await prisma.systemConfig.findUnique({
            where: { key: 'website_settings' }
        });

        if (!configRecord) {
            configRecord = await prisma.systemConfig.create({
                data: {
                    key: 'website_settings',
                    value: INITIAL_CONTENT
                }
            });
        }

        return NextResponse.json(configRecord.value);
    } catch (error) {
        console.error('Fetch Website Config Error:', error);
        return NextResponse.json({ error: 'Website içerik ayarları alınamadı.' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'Yetkisiz erişim. Bu işlem için Super Admin yetkisi gereklidir.' }, { status: 403 });
        }

        const body = await request.json();

        const updatedConfig = await prisma.systemConfig.upsert({
            where: { key: 'website_settings' },
            update: { value: body },
            create: { key: 'website_settings', value: body }
        });

        return NextResponse.json(updatedConfig.value);
    } catch (error) {
        console.error('Update Website Config Error:', error);
        return NextResponse.json({ error: 'Website ayarları güncellenemedi.' }, { status: 500 });
    }
}
