'use client';

import { useEffect, useCallback, useRef } from 'react';
import { getPusherClient } from '@/lib/pusher-client';

/**
 * Bir Pusher kanalına abone olur ve event dinler.
 * Bileşen unmount olduğunda otomatik unsubscribe yapar.
 */
export function usePusherEvent(
    channelName: string | null,
    eventName: string,
    callback: (data: any) => void
) {
    const callbackRef = useRef(callback);
    callbackRef.current = callback;

    useEffect(() => {
        if (!channelName) return;
        const client = getPusherClient();
        if (!client) return;

        const channel = client.subscribe(channelName);
        const handler = (data: any) => callbackRef.current(data);
        channel.bind(eventName, handler);

        return () => {
            channel.unbind(eventName, handler);
            client.unsubscribe(channelName);
        };
    }, [channelName, eventName]);
}

/**
 * Yeni sipariş geldiğinde tetiklenir.
 */
export function useNewOrderNotification(
    tenantId: string | null,
    onNewOrder: (order: any) => void
) {
    usePusherEvent(
        tenantId ? `restaurant-${tenantId}` : null,
        'new-order',
        onNewOrder
    );
}

/**
 * Garson çağrısı geldiğinde tetiklenir.
 */
export function useWaiterCallNotification(
    tenantId: string | null,
    onWaiterCall: (call: any) => void
) {
    usePusherEvent(
        tenantId ? `restaurant-${tenantId}` : null,
        'new-waiter-call',
        onWaiterCall
    );
}

/**
 * Sipariş durumu güncellendiğinde tetiklenir.
 */
export function useOrderStatusUpdate(
    tenantId: string | null,
    onUpdate: (data: any) => void
) {
    usePusherEvent(
        tenantId ? `restaurant-${tenantId}` : null,
        'order-status-update',
        onUpdate
    );
}
