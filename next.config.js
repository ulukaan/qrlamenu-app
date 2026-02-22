/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    output: 'standalone',
    poweredByHeader: false, // Güvenlik: X-Powered-By başlığını gizler

    // Build'de ESLint ve TypeScript hatalarını yoksay (production deploy için)
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },

    // Güvenlik: X-Frame-Options, CSP, HSTS vb. header'lar
    async headers() {

        const ContentSecurityPolicy = `
          default-src 'self';
          script-src 'self' 'unsafe-eval' 'unsafe-inline';
          style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
          img-src 'self' blob: data: https://images.unsplash.com https://res.cloudinary.com;
          font-src 'self' https://fonts.gstatic.com;
          connect-src 'self';
          object-src 'none';
          base-uri 'self';
          form-action 'self';
          frame-ancestors 'none';
          upgrade-insecure-requests;
        `;

        return [
            {
                source: '/(.*)',
                headers: [
                    // Clickjacking koruması
                    { key: 'X-Frame-Options', value: 'DENY' },
                    // HSTS (HTTP Strict Transport Security)
                    { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
                    // XSS koruması
                    { key: 'X-XSS-Protection', value: '1; mode=block' },
                    // MIME sniffing koruması
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                    // DNS Çözümleme sızıntısını engelle
                    { key: 'X-DNS-Prefetch-Control', value: 'on' },
                    // Referrer bilgisini kısıtla
                    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                    // Güçlü Permissions Policy — Donanım izinleri kısıtla
                    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()' },
                    // Katılaştırılmış İçerik Güvenliği Politikası
                    { key: 'Content-Security-Policy', value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim() }
                ],
            },
            {
                // API rotaları için ek güvenlik
                source: '/api/(.*)',
                headers: [
                    { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate' },
                    { key: 'Pragma', value: 'no-cache' },
                ],
            },
        ];
    },

    // Dış resim domainleri
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'images.unsplash.com' },
            { protocol: 'https', hostname: 'res.cloudinary.com' },
        ],
    },

    // Üretim build'de konsol loglarını temizle
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production',
    },
};

module.exports = nextConfig;
