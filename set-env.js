const { execSync } = require('child_process');

try {
    const envs = [
        { key: 'SMTP_PASSWORD', val: 'betda7-tohfer-tefVaj' },
        { key: 'SMTP_USER', val: 'info@qrlamenu.com' },
        { key: 'SMTP_HOST', val: 'smtp.hostinger.com' },
        { key: 'SMTP_PORT', val: '465' },
    ];

    for (const e of envs) {
        console.log(`Setting ${e.key}...`);
        // First remove it just in case
        try { execSync(`npx vercel env rm ${e.key} production -y`); } catch (err) { }
        // Then add it using a trick to pass exact string without newline
        execSync(`node -e "process.stdout.write('${e.val}')" | npx vercel env add ${e.key} production`);
    }
    console.log("All envs set!");
} catch (e) {
    console.error(e);
}
