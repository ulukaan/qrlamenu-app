import Pusher from 'pusher';

// Server-side Pusher instance (API routes'da kullanılır)
let pusherServer: Pusher | null = null;

function getServer(): Pusher | null {
    if (pusherServer) return pusherServer;

    const appId = process.env.PUSHER_APP_ID;
    const key = process.env.PUSHER_KEY;
    const secret = process.env.PUSHER_SECRET;
    const cluster = process.env.PUSHER_CLUSTER || 'eu';

    if (!appId || !key || !secret) {
        console.warn('[Pusher] Server anahtarları eksik — bildirimler devre dışı.');
        return null;
    }

    pusherServer = new Pusher({ appId, key, secret, cluster, useTLS: true });
    return pusherServer;
}

/**
 * Belirtilen kanala event gönderir.
 * Pusher yapılandırılmamışsa sessizce atlar (hata fırlatmaz).
 */
export async function triggerEvent(channel: string, event: string, data: any) {
    const server = getServer();
    if (!server) return;

    try {
        await server.trigger(channel, event, data);
    } catch (err) {
        console.error(`[Pusher] Trigger hatası (${channel}/${event}):`, err);
    }
}

/**
 * Restoran kanalına event yollar.
 * Yardımcı fonksiyon — tüm restoran eventleri buradan geçer.
 */
export async function triggerRestaurantEvent(tenantId: string, event: string, data: any) {
    await triggerEvent(`restaurant-${tenantId}`, event, data);
}
