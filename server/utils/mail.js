const nodemailer = require('nodemailer')

function hasSmtpConfig() {
  return !!process.env.SMTP_HOST
}

function createTransporter() {
  if (!hasSmtpConfig()) return null

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
  })
}

async function sendConfirmationEmail(to, code) {
  const from = process.env.EMAIL_FROM || 'no-reply@localhost'
  const subject = 'kNow — Confirmation code'
  const text = `Your kNow confirmation code is: ${code}\nThis code expires in ${process.env.CONFIRMATION_CODE_TTL_MIN || 15} minutes.`

  const transporter = createTransporter()

  if (!transporter) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('SMTP not configured in production')
    } else {
      console.log(`[dev mail fallback] To: ${to} — ${text}`)
      return
    }
  }

  await transporter.sendMail({ from, to, subject, text })
}

module.exports = { sendConfirmationEmail, hasSmtpConfig }
