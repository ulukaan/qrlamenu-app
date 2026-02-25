/**
 * Tarih ve saat yardımcı fonksiyonları.
 * Tüm sistemde Türkiye saat dilimi (Europe/Istanbul - UTC+3) kullanılır.
 */

export const formatDate = (date: string | Date): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('tr-TR', {
        timeZone: 'Europe/Istanbul',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

export const formatTime = (date: string | Date): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleTimeString('tr-TR', {
        timeZone: 'Europe/Istanbul',
        hour: '2-digit',
        minute: '2-digit'
    });
};

export const formatDateTime = (date: string | Date): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleString('tr-TR', {
        timeZone: 'Europe/Istanbul',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

/**
 * Göreli zaman yerine gerçek saat dilimini kullanarak "Bugün 14:30" veya "25.02.2024 14:30" formatında döner.
 */
export const formatSmartDate = (date: string | Date): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();

    const isToday = d.toDateString() === now.toDateString();

    if (isToday) {
        return `Bugün ${formatTime(d)}`;
    }

    return formatDateTime(d);
};
