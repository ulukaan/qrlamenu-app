import nodemailer from "nodemailer";

let etherealTransporter: nodemailer.Transporter | null = null;

const createTestTransporter = async () => {
    if (etherealTransporter) return etherealTransporter;

    // Create a test account dynamically for Ethereal
    const testAccount = await nodemailer.createTestAccount();

    etherealTransporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass, // generated ethereal password
        },
    });

    return etherealTransporter;
};

export const sendVerificationEmail = async (email: string, token: string) => {
    // In production, you would use a real SMTP like Resend/SendGrid and env vars
    // For development, we use Ethereal to preview emails safely.
    const transporter = await createTestTransporter();

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const verificationLink = `${appUrl}/api/auth/verify?token=${token}`;

    const info = await transporter.sendMail({
        from: '"QRlamenü Kurumsal" <noreply@qrlamenu.com>',
        to: email,
        subject: "QRlamenü Yönetim Paneli - E-posta Doğrulama",
        text: `Hoşgeldiniz! Hesabınızı doğrulamak için aşağıdaki linke tıklayın: ${verificationLink}`,
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                <h2 style="color: #ff7a21;">QRlamenü Yönetim Paneline Hoşgeldiniz!</h2>
                <p>E-posta adresinizi doğrulamak ve hesabınızı güvene almak için aşağıdaki butona tıklayın.</p>
                <a href="${verificationLink}" style="display: inline-block; padding: 12px 24px; background-color: #ff7a21; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 10px;">
                    Hesabımı Doğrula
                </a>
                <p style="margin-top: 20px; font-size: 12px; color: #999;">
                    Eğer butona tıklayamıyorsanız şu linki kopyalayıp tarayıcınıza yapıştırın:<br>
                    <a href="${verificationLink}">${verificationLink}</a>
                </p>
            </div>
        `,
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log("-----------------------------------------");
    console.log("📨 E-POSTA GÖNDERİLDİ (ETHEREAL TEST)");
    console.log("Alıcı:", email);
    console.log("Önizleme Linki:", previewUrl);
    console.log("-----------------------------------------");

    return { success: true, previewUrl };
};
