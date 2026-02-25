import Link from 'next/link';

export default function NotFound() {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', padding: '20px' }}>
            <div style={{ textAlign: 'center', maxWidth: '500px' }}>
                <h1 style={{ fontSize: '10rem', fontWeight: '900', color: '#ea580c', lineHeight: '1', margin: '0 0 20px 0', letterSpacing: '-0.05em' }}>404</h1>
                <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#1e293b', marginBottom: '16px' }}>Sayfa Bulunamadı</h2>
                <p style={{ fontSize: '1.1rem', color: '#64748b', marginBottom: '40px', lineHeight: '1.6' }}>
                    Aradığınız sayfa silinmiş, bağlantı değiştirilmiş veya geçici olarak ulaşılamıyor olabilir. Dilerseniz güvenli anasayfamıza dönerek baştan başlayabilirsiniz.
                </p>
                <Link href="/" style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '16px 32px',
                    backgroundColor: '#1e293b',
                    color: '#fff',
                    borderRadius: '16px',
                    fontWeight: '800',
                    fontSize: '1rem',
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                    boxShadow: '0 10px 15px -3px rgba(30, 41, 59, 0.2)'
                }}
                    className="hover:scale-105 active:scale-95"
                >
                    Anasayfaya Dön
                </Link>
            </div>
        </div>
    );
}
