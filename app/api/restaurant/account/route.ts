import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { validateSession, hashPassword } from '@/lib/auth';
import { validatePassword } from '@/lib/password-policy';

// GET: Fetch account settings
export async function GET() {
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const sessionUser = await validateSession(token);
    if (!sessionUser) {
        return NextResponse.json({ error: 'Session invalid' }, { status: 401 });
    }

    const user = sessionUser as any;

    try {
        const fullUser = await prisma.user.findUnique({
            where: { id: user.id },
            include: { tenant: true },
        });

        if (!fullUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const settings = (fullUser.tenant?.settings as any) || {};

        return NextResponse.json({
            username: fullUser.name || '',
            email: fullUser.email,
            phone: settings.phone || '',
            currency: settings.currency || 'TRY',
            menuLayout: settings.menuLayout || 'both',
            menuLanguages: settings.menuLanguages || [],
            defaultMenuLanguage: settings.defaultMenuLanguage || 'tr',
            languageSelectorPopup: settings.languageSelectorPopup || false,
            // Billing
            billingType: settings.billingType || 'personal',
            billingTcNo: settings.billingTcNo || '',
            billingCompanyName: settings.billingCompanyName || '',
            billingTaxDaire: settings.billingTaxDaire || '',
            billingTaxId: settings.billingTaxId || '',
            billingName: settings.billingName || '',
            billingAddress: settings.billingAddress || '',
            billingCity: settings.billingCity || '',
            billingState: settings.billingState || '',
            billingZipcode: settings.billingZipcode || '',
            billingCountry: settings.billingCountry || 'TR',
        });
    } catch (error: any) {
        console.error('Account fetch error:', error);
        return NextResponse.json({ error: 'Could not fetch account' }, { status: 500 });
    }
}

// POST: Update account settings
export async function POST(request: Request) {
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const sessionUser = await validateSession(token);
    if (!sessionUser) {
        return NextResponse.json({ error: 'Session invalid' }, { status: 401 });
    }

    const user = sessionUser as any;

    try {
        const body = await request.json();
        const { section } = body; // 'account' or 'billing'

        if (section === 'account') {
            const { username, email, password, confirmPassword, phone, currency, menuLayout, menuLanguages, defaultMenuLanguage, languageSelectorPopup } = body;

            // Update user name & email
            const userUpdate: any = {};
            if (username) userUpdate.name = username;
            if (email) userUpdate.email = email;

            // Password change
            if (password) {
                if (password !== confirmPassword) {
                    return NextResponse.json({ error: 'Şifreler eşleşmiyor' }, { status: 400 });
                }
                const passwordCheck = validatePassword(password);
                if (!passwordCheck.valid) {
                    return NextResponse.json({ error: passwordCheck.error }, { status: 400 });
                }
                userUpdate.password = await hashPassword(password);
            }

            if (Object.keys(userUpdate).length > 0) {
                await prisma.user.update({ where: { id: user.id }, data: userUpdate });
            }

            // Update tenant settings (merge)
            const tenant = await prisma.tenant.findFirst({ where: { id: user.tenantId } });
            const existingSettings = (tenant?.settings as any) || {};

            const newSettings = {
                ...existingSettings,
                phone: phone || '',
                currency: currency || 'TRY',
                menuLayout: menuLayout || 'both',
                menuLanguages: menuLanguages || [],
                defaultMenuLanguage: defaultMenuLanguage || 'tr',
                languageSelectorPopup: languageSelectorPopup === true || languageSelectorPopup === '1',
            };

            await prisma.tenant.update({
                where: { id: user.tenantId },
                data: { settings: newSettings },
            });

            return NextResponse.json({ success: true, message: 'Hesap ayarları güncellendi' });
        }

        if (section === 'billing') {
            const { billingType, billingTcNo, billingCompanyName, billingTaxDaire, billingTaxId, billingName, billingAddress, billingCity, billingState, billingZipcode, billingCountry } = body;

            const tenant = await prisma.tenant.findFirst({ where: { id: user.tenantId } });
            const existingSettings = (tenant?.settings as any) || {};

            const newSettings = {
                ...existingSettings,
                billingType: billingType || 'personal',
                billingTcNo: billingTcNo || '',
                billingCompanyName: billingCompanyName || '',
                billingTaxDaire: billingTaxDaire || '',
                billingTaxId: billingTaxId || '',
                billingName: billingName || '',
                billingAddress: billingAddress || '',
                billingCity: billingCity || '',
                billingState: billingState || '',
                billingZipcode: billingZipcode || '',
                billingCountry: billingCountry || 'TR',
            };

            await prisma.tenant.update({
                where: { id: user.tenantId },
                data: { settings: newSettings },
            });

            return NextResponse.json({ success: true, message: 'Fatura bilgileri güncellendi' });
        }

        return NextResponse.json({ error: 'Invalid section' }, { status: 400 });

    } catch (error: any) {
        console.error('Account update error:', error);
        if (error.code === 'P2002') {
            return NextResponse.json({ error: 'Bu e-posta adresi zaten kullanımda' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Güncelleme başarısız', details: error.message }, { status: 500 });
    }
}
