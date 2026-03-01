import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, createSession } from '@/lib/auth';
import { sendWelcomeEmail } from '@/lib/mail';
import { validatePassword } from '@/lib/password-policy';

function slugify(text: string) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Boşlukları tire (-) yap
        .replace(/[^\w\-]+/g, '')       // Alfanümerik olmayanları sil (Türkçe karakterler dahil değil, o yüzden aşağıda replace ediyoruz)
        .replace(/\-\-+/g, '-')         // Peşpeşe tireleri tek tire yap
        .replace(/^-+/, '')             // Başlangıçtaki tireleri sil
        .replace(/-+$/, '');            // Sondaki tireleri sil
}

function trToEn(text: string) {
    return text.replace(/Ğ/g, 'G')
        .replace(/ğ/g, 'g')
        .replace(/Ü/g, 'U')
        .replace(/ü/g, 'u')
        .replace(/Ş/g, 'S')
        .replace(/ş/g, 's')
        .replace(/I/g, 'I')
        .replace(/ı/g, 'i')
        .replace(/İ/g, 'I')
        .replace(/Ö/g, 'O')
        .replace(/ö/g, 'o')
        .replace(/Ç/g, 'C')
        .replace(/ç/g, 'c');
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { restaurantName, fullName, email, phone, password } = body;

        // Input validasyonları
        if (!restaurantName || !fullName || !email || !phone || !password) {
            return NextResponse.json({ error: 'Lütfen tüm alanları doldurun.' }, { status: 400 });
        }
        const passwordCheck = validatePassword(password);
        if (!passwordCheck.valid) {
            return NextResponse.json({ error: passwordCheck.error }, { status: 400 });
        }

        // Email kontrolü
        const existingUser = await prisma.user.findUnique({ where: { email } });
        const existingSuperAdmin = await prisma.superAdmin.findUnique({ where: { email } });
        if (existingUser || existingSuperAdmin) {
            return NextResponse.json({ error: 'Bu e-posta adresi zaten kullanılıyor.' }, { status: 400 });
        }

        // Başlangıç paketini bul
        let starterPlan = await prisma.subscriptionPlan.findUnique({ where: { code: 'starter' } });
        if (!starterPlan) {
            // Eğer yoksa (hata durumu), ilk bulduğu planı ata
            const fallbackPlan = await prisma.subscriptionPlan.findFirst();
            if (!fallbackPlan) {
                return NextResponse.json({ error: 'Sistemde geçerli bir abonelik paketi bulunamadı.' }, { status: 500 });
            }
            starterPlan = fallbackPlan;
        }

        // Benzersiz slug oluştur (örn: guzel-restoran)
        let baseSlug = slugify(trToEn(restaurantName));
        if (!baseSlug) baseSlug = "restaurant";
        let uniqueSlug = baseSlug;
        let slugCounter = 1;

        while (await prisma.tenant.findUnique({ where: { slug: uniqueSlug } })) {
            uniqueSlug = `${baseSlug}-${slugCounter}`;
            slugCounter++;
        }

        // Parolayı hashle
        const hashedPassword = await hashPassword(password);

        // 14 Günlük Deneme Süresi (Trial)
        const trialExpiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

        // Tenant (Restoran) & User (Admin) oluştur
        const newTenant = await prisma.tenant.create({
            data: {
                name: restaurantName,
                slug: uniqueSlug,
                ownerEmail: email,
                status: 'TRIAL', // Sadece 14 günlük deneme aktif
                trialExpiresAt: trialExpiresAt,
                planId: starterPlan.id,
                theme: 'LITE', // Varsayılan ücretsiz/hafif tema
                users: {
                    create: {
                        email: email.toLowerCase().trim(),
                        password: hashedPassword,
                        name: fullName,
                        role: 'ADMIN'
                    }
                }
            },
            include: {
                users: true // Oluşan user'ı da geri alalım ki session kurabilelim
            }
        });

        const createdUser = newTenant.users[0];

        // Hoş geldin e-postası — şifre mailde yok (kullanıcı kendi belirledi)
        sendWelcomeEmail(email, restaurantName).catch((e) =>
            console.error('Hoş geldin e-postası gönderilemedi:', e)
        );

        // Oturum aç ve Cookie set et (Direkt panele yönlendirme için)
        const session = await createSession(createdUser.id);

        const response = NextResponse.json({
            success: true,
            message: 'Kayıt başarılı, yönlendiriliyorsunuz.',
            tenantId: newTenant.id
        });

        // HttpOnly Cookie oluştur
        response.cookies.set('auth-token', session.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60, // 1 hafta
            path: '/',
        });

        return response;

    } catch (error) {
        console.error("Kayıt Hatası:", error);
        return NextResponse.json({ error: 'Kayıt işlemi sırasında sistemsel bir hata oluştu.' }, { status: 500 });
    }
}
