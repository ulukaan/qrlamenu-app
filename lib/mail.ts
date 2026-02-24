import nodemailer from "nodemailer";

// Hostinger SMTP ayarları
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.hostinger.com",
    port: parseInt(process.env.SMTP_PORT || "465", 10),
    secure: true, // Port 465 için true
    auth: {
        user: process.env.SMTP_USER || "info@qrlamenu.com",
        pass: process.env.SMTP_PASSWORD, // Vercel'den gelecek şifre
    },
});

const sendMail = async (to: string, subject: string, html: string) => {
    try {
        if (!process.env.SMTP_PASSWORD) {
            console.warn("⚠️ SMTP_PASSWORD tanımlanmamış. E-posta gönderilmeyecek.");
            return { success: false, error: "SMTP şifresi eksik." };
        }

        const info = await transporter.sendMail({
            from: '"QRlamenü Yönetim Paneli" <info@qrlamenu.com>',
            to,
            subject,
            html,
        });

        console.log(`📨 E-posta başarıyla gönderildi: ${info.messageId}`);
        return { success: true };
    } catch (error) {
        console.error("❌ E-posta gönderim hatası:", error);
        return { success: false, error };
    }
}

export const sendWelcomeEmail = async (email: string, unhashedPassword: string, restaurantName: string) => {
    const loginUrl = process.env.NEXT_PUBLIC_APP_URL ? `${process.env.NEXT_PUBLIC_APP_URL}/login` : "https://qrlamenu.com/login";

    const html = `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc; padding: 40px 20px; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 30px;">
            <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); border-radius: 12px; display: inline-block; padding: 10px 15px;">
                <span style="color: white; font-size: 24px; font-weight: 900; letter-spacing: -1px;">QRlamenü</span>
            </div>
        </div>
        
        <div style="background-color: #ffffff; padding: 40px; border-radius: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
            <h2 style="color: #0f172a; font-size: 24px; font-weight: 800; margin-top: 0; margin-bottom: 20px; text-align: center;">Aramıza Hoş Geldiniz! 🎉</h2>
            
            <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                Sayın <strong>${restaurantName}</strong> yetkilisi,<br><br>
                Restoranınızın yeni nesil dijital menü ve sipariş yönetim paneline erişimi başarıyla oluşturuldu. İşletmenizi dijital çağa taşımaya hazırız!
            </p>
            
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 30px;">
                <p style="margin: 0 0 10px 0; color: #64748b; font-size: 14px; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">Giriş Bilgileriniz</p>
                <div style="margin-bottom: 15px;">
                    <span style="color: #94a3b8; font-size: 13px;">Giriş E-postanız:</span><br>
                    <strong style="color: #0f172a; font-size: 16px;">${email}</strong>
                </div>
                <div>
                    <span style="color: #94a3b8; font-size: 13px;">Geçici Şifreniz:</span><br>
                    <strong style="color: #0f172a; font-size: 18px; letter-spacing: 1.5px;">${unhashedPassword}</strong>
                </div>
            </div>
            
            <div style="text-align: center;">
                <a href="${loginUrl}" style="display: inline-block; background: linear-gradient(135deg, #ff7a21 0%, #ff9d5c 100%); color: #ffffff; text-decoration: none; padding: 16px 36px; border-radius: 12px; font-weight: 800; font-size: 16px; box-shadow: 0 4px 15px rgba(255,122,33,0.3);">
                    Yönetim Paneline Giriş Yap
                </a>
            </div>
            
            <p style="color: #64748b; font-size: 14px; line-height: 1.5; margin-top: 30px; text-align: center;">
                Güvenliğiniz için panele ilk girişinizde sağ üst menüden şifrenizi güncellemenizi önemle rica ederiz.
            </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; color: #94a3b8; font-size: 13px;">
            <p>© ${new Date().getFullYear()} QRlamenü. Tüm hakları saklıdır.</p>
            <p>Bu bağlantı ve şifre yalnızca size özeldir, kimseyle paylaşmayınız.</p>
        </div>
    </div>
    `;

    return sendMail(email, `QRlamenü - ${restaurantName} Yönetici Hesabınız Oluşturuldu`, html);
};

export const sendPasswordResetEmail = async (email: string, unhashedPassword: string, restaurantName: string = "Restoran") => {
    const loginUrl = process.env.NEXT_PUBLIC_APP_URL ? `${process.env.NEXT_PUBLIC_APP_URL}/login` : "https://qrlamenu.com/login";

    const html = `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc; padding: 40px 20px; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 30px;">
            <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); border-radius: 12px; display: inline-block; padding: 10px 15px;">
                <span style="color: white; font-size: 24px; font-weight: 900; letter-spacing: -1px;">QRlamenü</span>
            </div>
        </div>
        
        <div style="background-color: #ffffff; padding: 40px; border-radius: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
            <div style="text-align: center; margin-bottom: 20px;">
                <div style="background-color: #eff6ff; color: #3b82f6; width: 60px; height: 60px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold;">
                    🔒
                </div>
            </div>
            
            <h2 style="color: #0f172a; font-size: 24px; font-weight: 800; margin-top: 0; margin-bottom: 20px; text-align: center;">Şifreniz Sıfırlandı</h2>
            
            <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                Sayın <strong>${restaurantName}</strong> yöneticisi,<br><br>
                Sistem yöneticiniz tarafından hesabınızın şifresi başarıyla sıfırlandı. Hesabınıza erişebilmeniz için geçici şifreniz oluşturulmuştur.
            </p>
            
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 30px;">
                <p style="margin: 0 0 10px 0; color: #64748b; font-size: 14px; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">Yeni Giriş Bilgileriniz</p>
                <div style="margin-bottom: 15px;">
                    <span style="color: #94a3b8; font-size: 13px;">E-posta:</span><br>
                    <strong style="color: #0f172a; font-size: 16px;">${email}</strong>
                </div>
                <div>
                    <span style="color: #94a3b8; font-size: 13px;">Yeni Geçici Şifreniz:</span><br>
                    <strong style="color: #ef4444; font-size: 18px; letter-spacing: 1.5px;">${unhashedPassword}</strong>
                </div>
            </div>
            
            <div style="text-align: center;">
                <a href="${loginUrl}" style="display: inline-block; background: #0f172a; color: #ffffff; text-decoration: none; padding: 16px 36px; border-radius: 12px; font-weight: 800; font-size: 16px; box-shadow: 0 4px 15px rgba(15,23,42,0.3);">
                    Hemen Giriş Yap
                </a>
            </div>
        </div>
        
        <div style="text-align: center; margin-top: 30px; color: #94a3b8; font-size: 13px;">
            <p>© ${new Date().getFullYear()} QRlamenü. Tüm hakları saklıdır.</p>
            <p>Eğer bu şifre sıfırlama işlemini siz talep etmediyseniz, lütfen yetkilinizle iletişime geçin.</p>
        </div>
    </div>
    `;

    return sendMail(email, `QRlamenü - Hesabınızın Şifresi Sıfırlandı`, html);
};

export const sendVerificationEmail = async (email: string, token: string) => {
    const verifyUrl = process.env.NEXT_PUBLIC_APP_URL ? `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}` : `https://qrlamenu.com/verify-email?token=${token}`;

    const html = `
    <div style="font-family: Arial; padding: 20px;">
        <h2>E-posta Doğrulama</h2>
        <p>Hesabınızı doğrulamak için aşağıdaki bağlantıya tıklayın:</p>
        <a href="${verifyUrl}" style="background: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Doğrula</a>
    </div>
    `;

    return sendMail(email, `QRlamenü - E-posta Doğrulama`, html);
};
