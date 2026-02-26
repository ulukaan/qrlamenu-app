import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { cookies } from 'next/headers';
import { validateSession, isSuperAdmin } from '@/lib/auth';

async function checkAuth() {
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token')?.value;
    if (!token) return null;
    const session = await validateSession(token);
    if (!isSuperAdmin(session)) return null;
    return session;
}

export async function GET() {
    const session = await checkAuth();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const packageJsonPath = path.join(process.cwd(), 'package.json');
        let pkgVersion = '0.0.0';
        let modules: any[] = [];

        if (fs.existsSync(packageJsonPath)) {
            const pkgData = fs.readFileSync(packageJsonPath, 'utf8');
            const pkg = JSON.parse(pkgData);
            pkgVersion = pkg.version || '0.1.0';

            const deps = pkg.dependencies || {};
            if (deps['next']) modules.push({ name: 'Next.js Routing Engine', ver: deps['next'].replace('^', ''), status: 'Stable' });
            if (deps['@prisma/client']) modules.push({ name: 'Prisma DB ORM', ver: deps['@prisma/client'].replace('^', ''), status: 'Stable' });
            if (deps['pusher']) modules.push({ name: 'Pusher WebSocket', ver: deps['pusher'].replace('^', ''), status: 'Stable' });
            if (deps['react']) modules.push({ name: 'React DOM rendering', ver: deps['react'].replace('^', ''), status: 'Stable' });
        }

        const versionData = {
            id: 'sys-version',
            key: 'system_version',
            value: {
                version: pkgVersion,
                lastUpdate: new Date().toISOString(),
                modules: modules.length > 0 ? modules : [
                    { name: 'Core Booking Engine', ver: '2.4.1', status: 'Stable' },
                    { name: 'Payment Gateway Integration', ver: '1.8.0', status: 'Stable' }
                ]
            }
        };

        return NextResponse.json(versionData);
    } catch (error) {
        console.error('Fetch Version Error:', error);
        return NextResponse.json({ error: 'Versiyon bilgisi alınamadı.' }, { status: 500 });
    }
}
