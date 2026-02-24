import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { validateSession } from '@/lib/auth';

export async function POST(request: Request) {
    // Super Admin Yetkilendirme Kontrolü
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token')?.value || cookieStore.get('auth_token')?.value;

    if (!token) {
        return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 });
    }

    const session = await validateSession(token);
    if (!session || session.role !== 'SUPER_ADMIN') {
        return NextResponse.json({ error: 'Sadece Super Admin bu temizliği tetikleyebilir.' }, { status: 403 });
    }

    try {
        const body = await request.json();
        // Parametre olarak gün bilgisi alınabilir (Örn: 30 günden öncekileri temizle)
        const daysToKeep = parseInt(body.daysToKeep) || 30;

        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

        // 1. İşlem: 30 günü geçmiş, durumu tamamlanmış veya iptal edilmiş siparişlerin JSON yükünü (items) buda.
        const updatedOrders = await prisma.order.updateMany({
            where: {
                createdAt: { lt: cutoffDate },
                status: { in: ['COMPLETED', 'CANCELLED'] },
                // JSON boşaltılmamış olanları bulmak için Prisma'nın not özelliğini kullanabilirdik ancak
                // en kesin yol updateMany ile hepsinin items değerini boş dizi yapmaktır.
            },
            data: {
                items: [] // Eski adisyonların iç detaylarını sil, toplam fiyatlarını (ciro) ve tarihlerini koru.
            }
        });

        // 2. İşlem: (Opsiyonel) Sistemde 90 günü geçmiş ve tamamen gereksiz olan Logları vs. silebilirsiniz.
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

        const deletedLogs = await prisma.systemLog.deleteMany({
            where: {
                createdAt: { lt: ninetyDaysAgo }
            }
        });

        return NextResponse.json({
            success: true,
            message: `Veri Budama (Pruning) İşlemi Başarılı`,
            details: {
                clearedOrdersJSONCount: updatedOrders.count,
                deletedSystemLogsCount: deletedLogs.count,
                freedSpaceEstimate: `${(updatedOrders.count * 1.5).toFixed(2)} MB / ${updatedOrders.count} Sipariş` // Yaklaşık tahmini tasarruf (Sipariş başı 1.5 KB varsayarak)
            }
        });
    } catch (error) {
        console.error('Data Pruning Error:', error);
        return NextResponse.json({ error: 'Veri boyut küçültme işlemi sırasında hata oluştu.' }, { status: 500 });
    }
}
