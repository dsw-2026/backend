import nodemailer from 'nodemailer'
import type { Transporter } from 'nodemailer'

let transporter: Transporter | null = null

function getTransporter(): Transporter | null {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = process.env
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASSWORD) {
    return null
  }
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT ?? 587),
      secure: Number(SMTP_PORT) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
    })
  }
  return transporter
}

interface EmailOptions {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: EmailOptions): Promise<void> {
  const tx = getTransporter()

  if (!tx) {
    console.log(`[email] (modo consola, sin SMTP) Para: ${to} | Asunto: ${subject}`)
    return
  }

  try {
    await tx.sendMail({
      from: process.env.SMTP_FROM ?? '"Fluffy" <no-reply@fluffy.com>',
      to,
      subject,
      html,
    })
  } catch (error) {
    console.error(`[email] No se pudo enviar el email a ${to}:`, error)
  }
}