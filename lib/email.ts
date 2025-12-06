import nodemailer from 'nodemailer'

interface EmailOptions {
  to: string
  orderNumber: string
  customerName: string
  pdfBuffer: Buffer
}

export async function sendOrderConfirmationEmail({
  to,
  orderNumber,
  customerName,
  pdfBuffer,
}: EmailOptions) {
  // For development/demo purposes, we'll just log the email details
  // In production, configure SMTP settings or use a service like SendGrid
  console.log('📧 Email would be sent to:', to)
  console.log('Order Number:', orderNumber)
  console.log('Customer Name:', customerName)
  console.log('PDF Size:', pdfBuffer?.length, 'bytes')

  // Mock email sending - in production you would configure nodemailer like this:
  /*
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  await transporter.sendMail({
    from: 'ADORIS INVEST GROUP <noreply@adorisgroup.com>',
    to,
    subject: `Order Confirmation - ${orderNumber}`,
    html: `
      <h1>Thank you for your order, ${customerName}!</h1>
      <p>Your order <strong>${orderNumber}</strong> has been received and is being processed.</p>
      <p>Please find your order confirmation attached as a PDF.</p>
      <p>Payment instructions will be provided separately.</p>
      <p>For any questions, contact us at ceo@adorisgroup.com</p>
      <p>Best regards,<br/>ADORIS INVEST GROUP Team</p>
    `,
    attachments: [
      {
        filename: `order-${orderNumber}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
    ],
  })
  */

  // For demo purposes, also send to ceo@adorisgroup.com
  console.log('📧 Copy would also be sent to: ceo@adorisgroup.com')

  return Promise.resolve()
}
