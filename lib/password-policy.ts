/**
 * Şifre politikası: tüm kayıt, şifre sıfırlama ve şifre değiştirme akışlarında kullanılır.
 */
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;

export const PASSWORD_POLICY_DESC = `En az ${PASSWORD_MIN_LENGTH} karakter, en az bir büyük harf, bir küçük harf ve bir rakam içermelidir.`;

export interface PasswordValidationResult {
    valid: boolean;
    error?: string;
}

export function validatePassword(password: string): PasswordValidationResult {
    if (typeof password !== 'string') {
        return { valid: false, error: 'Geçerli bir şifre girin.' };
    }
    const p = password.trim();
    if (p.length < PASSWORD_MIN_LENGTH) {
        return { valid: false, error: `Şifre en az ${PASSWORD_MIN_LENGTH} karakter olmalıdır.` };
    }
    if (p.length > PASSWORD_MAX_LENGTH) {
        return { valid: false, error: `Şifre en fazla ${PASSWORD_MAX_LENGTH} karakter olabilir.` };
    }
    if (!/[A-Z]/.test(p)) {
        return { valid: false, error: 'Şifre en az bir büyük harf içermelidir.' };
    }
    if (!/[a-z]/.test(p)) {
        return { valid: false, error: 'Şifre en az bir küçük harf içermelidir.' };
    }
    if (!/[0-9]/.test(p)) {
        return { valid: false, error: 'Şifre en az bir rakam içermelidir.' };
    }
    return { valid: true };
}
