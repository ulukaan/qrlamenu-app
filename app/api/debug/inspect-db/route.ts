// ⛔ DEBUG ROTASI KAPATILDI — PRODUCTION'DA AÇIK BIRAKMAYIN
import { NextResponse } from 'next/server';

export async function GET() {
    // Bu endpoint sadece geliştirme ortamında kullanılabilir
    if (process.env.NODE_ENV === 'production') {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Debug endpoint — only available in development' });
}
