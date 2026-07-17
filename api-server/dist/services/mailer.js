"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOtpEmail = sendOtpEmail;
exports.sendTestEmail = sendTestEmail;
exports.sendOtpSms = sendOtpSms;
const nodemailer_1 = __importDefault(require("nodemailer"));
const pool_1 = require("../db/pool");
async function getSmtpConfig() {
    try {
        const rows = await (0, pool_1.query)("SELECT setting_key, setting_value FROM site_settings WHERE setting_key IN ('smtp_host','smtp_port','smtp_user','smtp_pass')");
        const s = {};
        rows.forEach((r) => { s[r.setting_key] = r.setting_value; });
        return {
            host: s.smtp_host || process.env.SMTP_HOST || '',
            port: Number(s.smtp_port || process.env.SMTP_PORT || 587),
            user: s.smtp_user || process.env.SMTP_USER || '',
            pass: s.smtp_pass || process.env.SMTP_PASS || '',
        };
    }
    catch {
        return {
            host: process.env.SMTP_HOST || '',
            port: Number(process.env.SMTP_PORT || 587),
            user: process.env.SMTP_USER || '',
            pass: process.env.SMTP_PASS || '',
        };
    }
}
function createTransporter(cfg) {
    return nodemailer_1.default.createTransport({
        host: cfg.host,
        port: cfg.port,
        secure: cfg.port === 465,
        auth: { user: cfg.user, pass: cfg.pass },
    });
}
async function sendOtpEmail(to, otp, type) {
    const cfg = await getSmtpConfig();
    const subject = type === 'signup' ? 'Verify your SMARTUAE account'
        : type === 'forgot' ? 'Reset your SMARTUAE password'
            : 'Your SMARTUAE login code';
    if (!cfg.user) {
        console.log(`[OTP EMAIL] To: ${to} | Code: ${otp} | Type: ${type}`);
        return;
    }
    await createTransporter(cfg).sendMail({
        from: `"SMARTUAE" <${cfg.user}>`,
        to,
        subject,
        html: `<div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px;border:1px solid #eee;border-radius:8px">
      <h2 style="color:#0067C0;margin-bottom:8px">SMARTUAE</h2>
      <p style="color:#555;margin-bottom:24px">${subject}</p>
      <div style="font-size:36px;font-weight:800;letter-spacing:8px;color:#1a1a1a;text-align:center;padding:20px;background:#F3F3F3;border-radius:6px">${otp}</div>
      <p style="color:#888;font-size:13px;margin-top:20px">This code expires in 10 minutes. Do not share it with anyone.</p>
    </div>`,
    });
}
async function sendTestEmail(to) {
    const cfg = await getSmtpConfig();
    if (!cfg.user || !cfg.host)
        throw new Error('SMTP not configured. Please save your SMTP settings first.');
    await createTransporter(cfg).sendMail({
        from: `"SMARTUAE" <${cfg.user}>`,
        to,
        subject: 'SMARTUAE – SMTP Test',
        html: `<div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px;border:1px solid #eee;border-radius:8px">
      <h2 style="color:#0067C0;margin-bottom:8px">SMARTUAE</h2>
      <p style="color:#2E7D32;font-size:16px;font-weight:600">✅ SMTP is working correctly!</p>
      <p style="color:#555">This is a test email sent from your SMARTUAE admin panel.</p>
    </div>`,
    });
}
async function sendOtpSms(mobile, otp, _type) {
    console.log(`[OTP SMS] To: ${mobile} | Code: ${otp}`);
}
