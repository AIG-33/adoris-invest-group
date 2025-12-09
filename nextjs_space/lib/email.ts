import nodemailer from 'nodemailer'

// Create reusable transporter
function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

interface OrderEmailOptions {
  to: string
  orderNumber: string
  customerName: string
  pdfBuffer: Buffer
}

interface WelcomeEmailOptions {
  to: string
  name: string
}

interface MagicLinkEmailOptions {
  to: string
  url: string
}

// Email template helpers
const getEmailHeader = () => `
  <div style="background: linear-gradient(135deg, #1a8c7c 0%, #20a895 100%); padding: 30px; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 28px;">ADORIS INVEST GROUP</h1>
    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Medical Equipment & Laboratory Solutions</p>
  </div>
`

const getEmailFooter = () => `
  <div style="background: #f5f5f5; padding: 20px; margin-top: 30px; text-align: center; color: #666;">
    <p style="margin: 5px 0;">ADORIS INVEST GROUP OÜ</p>
    <p style="margin: 5px 0;">Harju maakond, Tallinn, Kesklinna linnaosa, Narva mnt 7-634, 10117</p>
    <p style="margin: 5px 0;">Email: <a href="mailto:ceo@adorisgroup.com" style="color: #20a895;">ceo@adorisgroup.com</a></p>
    <p style="margin: 15px 0 5px 0; font-size: 12px; color: #999;">
      © ${new Date().getFullYear()} ADORIS INVEST GROUP. All rights reserved.
    </p>
  </div>
`

// Send order confirmation email
export async function sendOrderConfirmationEmail({
  to,
  orderNumber,
  customerName,
  pdfBuffer,
}: OrderEmailOptions) {
  try {
    const transporter = createTransporter()

    const mailOptions = {
      from: `${process.env.EMAIL_FROM_NAME || 'ADORIS INVEST GROUP'} <${process.env.EMAIL_FROM}>`,
      to,
      subject: `Order Confirmation - ${orderNumber}`,
      html: `
        ${getEmailHeader()}
        <div style="padding: 30px; background: white;">
          <h2 style="color: #1a8c7c; margin-top: 0;">Thank you for your order, ${customerName}!</h2>
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            Your order <strong style="color: #20a895;">${orderNumber}</strong> has been received and is being processed.
          </p>
          <div style="background: #f9f9f9; padding: 20px; border-left: 4px solid #20a895; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1a8c7c;">Next Steps:</h3>
            <ul style="line-height: 1.8; color: #555;">
              <li>Review your order confirmation (attached PDF)</li>
              <li>Payment instructions will be provided separately</li>
              <li>Expected delivery: 4-7 weeks from payment confirmation</li>
            </ul>
          </div>
          <p style="font-size: 14px; color: #666; margin-top: 30px;">
            For any questions, please contact us at 
            <a href="mailto:ceo@adorisgroup.com" style="color: #20a895;">ceo@adorisgroup.com</a>
          </p>
          <p style="font-size: 16px; margin-top: 30px;">
            Best regards,<br/>
            <strong style="color: #1a8c7c;">ADORIS INVEST GROUP Team</strong>
          </p>
        </div>
        ${getEmailFooter()}
      `,
      attachments: [
        {
          filename: `order-${orderNumber}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    }

    await transporter.sendMail(mailOptions)
    console.log('✅ Order confirmation email sent to:', to)

    // Also send copy to CEO
    await transporter.sendMail({
      ...mailOptions,
      to: 'ceo@adorisgroup.com',
      subject: `[New Order] ${orderNumber} - ${customerName}`,
    })
    console.log('✅ Order copy sent to: ceo@adorisgroup.com')

    return { success: true }
  } catch (error) {
    console.error('❌ Error sending order confirmation email:', error)
    // Don't throw error - order should still be created even if email fails
    return { success: false, error }
  }
}

// Send welcome email after registration
export async function sendWelcomeEmail({ to, name }: WelcomeEmailOptions) {
  try {
    const transporter = createTransporter()

    await transporter.sendMail({
      from: `${process.env.EMAIL_FROM_NAME || 'ADORIS INVEST GROUP'} <${process.env.EMAIL_FROM}>`,
      to,
      subject: 'Welcome to ADORIS INVEST GROUP',
      html: `
        ${getEmailHeader()}
        <div style="padding: 30px; background: white;">
          <h2 style="color: #1a8c7c; margin-top: 0;">Welcome, ${name}! 🎉</h2>
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            Thank you for registering with ADORIS INVEST GROUP. Your account has been successfully created.
          </p>
          <div style="background: #f9f9f9; padding: 20px; border-left: 4px solid #20a895; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1a8c7c;">What's Next?</h3>
            <ul style="line-height: 1.8; color: #555;">
              <li>Browse our extensive catalog of medical equipment</li>
              <li>Use bulk order feature for large purchases</li>
              <li>Track your orders in your account dashboard</li>
              <li>Enjoy volume discounts on orders over €50,000</li>
            </ul>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXTAUTH_URL}" 
               style="display: inline-block; background: linear-gradient(135deg, #1a8c7c 0%, #20a895 100%); 
                      color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; 
                      font-weight: bold; font-size: 16px;">
              Start Shopping
            </a>
          </div>
          <p style="font-size: 14px; color: #666; margin-top: 30px;">
            Need help? Contact us at 
            <a href="mailto:ceo@adorisgroup.com" style="color: #20a895;">ceo@adorisgroup.com</a>
          </p>
          <p style="font-size: 16px; margin-top: 30px;">
            Best regards,<br/>
            <strong style="color: #1a8c7c;">ADORIS INVEST GROUP Team</strong>
          </p>
        </div>
        ${getEmailFooter()}
      `,
    })

    console.log('✅ Welcome email sent to:', to)
    return { success: true }
  } catch (error) {
    console.error('❌ Error sending welcome email:', error)
    return { success: false, error }
  }
}

// Send magic link email
export async function sendMagicLinkEmail({ to, url }: MagicLinkEmailOptions) {
  try {
    const transporter = createTransporter()

    await transporter.sendMail({
      from: `${process.env.EMAIL_FROM_NAME || 'ADORIS INVEST GROUP'} <${process.env.EMAIL_FROM}>`,
      to,
      subject: 'Sign in to ADORIS INVEST GROUP',
      html: `
        ${getEmailHeader()}
        <div style="padding: 30px; background: white;">
          <h2 style="color: #1a8c7c; margin-top: 0;">Sign in to your account</h2>
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            Click the button below to sign in to your ADORIS INVEST GROUP account.
          </p>
          <div style="text-align: center; margin: 40px 0;">
            <a href="${url}" 
               style="display: inline-block; background: linear-gradient(135deg, #1a8c7c 0%, #20a895 100%); 
                      color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; 
                      font-weight: bold; font-size: 16px;">
              Sign In
            </a>
          </div>
          <p style="font-size: 14px; color: #666; line-height: 1.6;">
            Or copy and paste this URL into your browser:<br/>
            <a href="${url}" style="color: #20a895; word-break: break-all;">${url}</a>
          </p>
          <div style="background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 5px; margin: 30px 0;">
            <p style="margin: 0; color: #856404; font-size: 14px;">
              ⚠️ <strong>Security Note:</strong> This link will expire in 24 hours. 
              If you didn't request this email, you can safely ignore it.
            </p>
          </div>
          <p style="font-size: 14px; color: #666; margin-top: 30px;">
            Need help? Contact us at 
            <a href="mailto:ceo@adorisgroup.com" style="color: #20a895;">ceo@adorisgroup.com</a>
          </p>
          <p style="font-size: 16px; margin-top: 30px;">
            Best regards,<br/>
            <strong style="color: #1a8c7c;">ADORIS INVEST GROUP Team</strong>
          </p>
        </div>
        ${getEmailFooter()}
      `,
    })

    console.log('✅ Magic link email sent to:', to)
    return { success: true }
  } catch (error) {
    console.error('❌ Error sending magic link email:', error)
    throw error // Magic link should fail if email can't be sent
  }
}
