import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    metadataBase: new URL('https://qrlamenu.com'),
    title: {
        template: '%s | QRlamenü',
        default: 'QRlamenü Yönetici Paneli | Dijital Menü Çözümleri',
    },
    description: "QRlamenü ile dijital menünüzü, siparişlerinizi ve restoran operasyonlarınızı tek bir modern panelden yönetin.",
    keywords: ["dijital menü", "qr menü", "restoran otomasyonu", "cafe sipariş sistemi", "QRlamenü", "QR okut"],
    openGraph: {
        title: 'QRlamenü Yönetici Paneli | Dijital Menü Çözümleri',
        description: 'QRlamenü ile dijital menünüzü, siparişlerinizi ve restoran operasyonlarınızı yeni nesil bir deneyime taşıyın.',
        url: 'https://qrlamenu.com',
        siteName: 'QRlamenü',
        images: [
            {
                url: '/og-image.jpg', // Varsayılan paylaşım resmi (sonradan eklenecek)
                width: 1200,
                height: 630,
                alt: 'QRlamenü Kapak Görseli'
            }
        ],
        locale: 'tr_TR',
        type: 'website',
    },
    robots: {
        index: true,
        follow: true,
    }
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="tr">
            <head>
                <link href="https://fonts.googleapis.com/css2?family=Bangers&family=Playfair+Display:wght@400;700;900&family=Montserrat:wght@400;600;800&family=Outfit:wght@400;600;900&display=swap" rel="stylesheet" />
                {/* Google Analytics Placeholder */}
                <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            window.dataLayer = window.dataLayer || [];
                            function gtag(){dataLayer.push(arguments);}
                            gtag('js', new Date());
                            gtag('config', 'G-XXXXXXXXXX', {
                                page_path: window.location.pathname,
                            });
                        `,
                    }}
                />
            </head>
            <body className={inter.className}>
                {children}
                <SpeedInsights />
            </body>
        </html>
    );
}
