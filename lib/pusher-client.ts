import PusherClient from 'pusher-js';

let client: PusherClient | null = null;

export function getPusherClient(): PusherClient | null {
    if (typeof window === 'undefined') return null;
    if (client) return client;

    const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
    const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'eu';

    if (!key) {
        console.warn('[Pusher] Client anahtarı eksik — canlı bildirimler devre dışı.');
        return null;
    }

    client = new PusherClient(key, { cluster });
    return client;
}
