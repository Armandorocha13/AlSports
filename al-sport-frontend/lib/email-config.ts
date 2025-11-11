// Configuração para serviços de email em produção
// Escolha um dos serviços abaixo e configure as variáveis de ambiente

export const EMAIL_CONFIG = {
  // Para usar SendGrid
  SENDGRID: {
    apiKey: process.env.SENDGRID_API_KEY,
    fromEmail: process.env.SENDGRID_FROM_EMAIL || 'noreply@alsports.com',
    fromName: 'AlSports'
  },
  
  // Para usar AWS SES
  AWS_SES: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION || 'us-east-1',
    fromEmail: process.env.AWS_FROM_EMAIL || 'noreply@alsports.com'
  },
  
  // Para usar Resend
  RESEND: {
    apiKey: process.env.RESEND_API_KEY,
    fromEmail: process.env.RESEND_FROM_EMAIL || 'noreply@alsports.com'
  },
  
  // Para usar Nodemailer (SMTP)
  SMTP: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    },
    fromEmail: process.env.SMTP_FROM_EMAIL || 'noreply@alsports.com'
  }
}

// Exemplo de implementação com SendGrid
export const sendEmailWithSendGrid = async (emailData: {
  to: string
  subject: string
  html: string
}) => {
  // Implementação com SendGrid
  // const sgMail = require('@sendgrid/mail')
  // sgMail.setApiKey(EMAIL_CONFIG.SENDGRID.apiKey)
  
  // const msg = {
  //   to: emailData.to,
  //   from: EMAIL_CONFIG.SENDGRID.fromEmail,
  //   subject: emailData.subject,
  //   html: emailData.html,
  // }
  
  // return await sgMail.send(msg)
}

// Exemplo de implementação com AWS SES
export const sendEmailWithSES = async (emailData: {
  to: string
  subject: string
  html: string
}) => {
  // Implementação com AWS SES
  // const AWS = require('aws-sdk')
  // const ses = new AWS.SES({
  //   accessKeyId: EMAIL_CONFIG.AWS_SES.accessKeyId,
  //   secretAccessKey: EMAIL_CONFIG.AWS_SES.secretAccessKey,
  //   region: EMAIL_CONFIG.AWS_SES.region
  // })
  
  // const params = {
  //   Destination: { ToAddresses: [emailData.to] },
  //   Message: {
  //     Body: { Html: { Data: emailData.html } },
  //     Subject: { Data: emailData.subject }
  //   },
  //   Source: EMAIL_CONFIG.AWS_SES.fromEmail
  // }
  
  // return await ses.sendEmail(params).promise()
}

// Exemplo de implementação com Resend
export const sendEmailWithResend = async (emailData: {
  to: string
  subject: string
  html: string
}) => {
  // Implementação com Resend
  // const { Resend } = require('resend')
  // const resend = new Resend(EMAIL_CONFIG.RESEND.apiKey)
  
  // return await resend.emails.send({
  //   from: EMAIL_CONFIG.RESEND.fromEmail,
  //   to: [emailData.to],
  //   subject: emailData.subject,
  //   html: emailData.html,
  // })
}
