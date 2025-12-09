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
      subject: `✅ Order Confirmation - ${orderNumber}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Confirmation</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Arial, sans-serif; background: #f4f4f4;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background: #f4f4f4; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
                  
                  <!-- Header with Success Badge -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #1a8c7c 0%, #20a895 100%); padding: 50px 40px; text-align: center;">
                      <div style="background: white; border-radius: 50%; width: 80px; height: 80px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                        <span style="font-size: 48px;">✅</span>
                      </div>
                      <h1 style="color: white; margin: 0; font-size: 32px; font-weight: bold;">Order Confirmed!</h1>
                      <p style="color: rgba(255,255,255,0.95); margin: 12px 0 0 0; font-size: 18px;">Thank you for your order, ${customerName}</p>
                    </td>
                  </tr>

                  <!-- Order Number Highlight -->
                  <tr>
                    <td style="padding: 40px 40px 30px 40px; background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);">
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center">
                            <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Order Number</p>
                            <p style="margin: 0; color: #1a8c7c; font-size: 32px; font-weight: bold; letter-spacing: 2px;">${orderNumber}</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Main Content -->
                  <tr>
                    <td style="padding: 40px 40px;">
                      <p style="font-size: 17px; line-height: 1.7; color: #333; margin: 0 0 25px 0;">
                        Your order has been successfully received and is now being processed. We'll keep you updated on the progress.
                      </p>

                      <!-- Status Timeline -->
                      <div style="background: #f9fafb; border-radius: 10px; padding: 30px; margin: 30px 0;">
                        <h3 style="margin: 0 0 25px 0; color: #1a8c7c; font-size: 20px; text-align: center;">Order Processing Timeline</h3>
                        
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td width="25%" style="text-align: center; padding: 10px;">
                              <div style="width: 50px; height: 50px; border-radius: 50%; background: linear-gradient(135deg, #1a8c7c 0%, #20a895 100%); margin: 0 auto 10px; display: flex; align-items: center; justify-content: center;">
                                <span style="color: white; font-size: 24px; font-weight: bold;">1</span>
                              </div>
                              <p style="margin: 0; font-size: 13px; color: #1a8c7c; font-weight: 600;">Order Received</p>
                              <p style="margin: 5px 0 0 0; font-size: 11px; color: #6b7280;">Now</p>
                            </td>
                            <td width="25%" style="text-align: center; padding: 10px;">
                              <div style="width: 50px; height: 50px; border-radius: 50%; background: #e5e7eb; margin: 0 auto 10px; display: flex; align-items: center; justify-content: center;">
                                <span style="color: #6b7280; font-size: 24px; font-weight: bold;">2</span>
                              </div>
                              <p style="margin: 0; font-size: 13px; color: #6b7280; font-weight: 600;">Payment</p>
                              <p style="margin: 5px 0 0 0; font-size: 11px; color: #9ca3af;">Awaiting</p>
                            </td>
                            <td width="25%" style="text-align: center; padding: 10px;">
                              <div style="width: 50px; height: 50px; border-radius: 50%; background: #e5e7eb; margin: 0 auto 10px; display: flex; align-items: center; justify-content: center;">
                                <span style="color: #6b7280; font-size: 24px; font-weight: bold;">3</span>
                              </div>
                              <p style="margin: 0; font-size: 13px; color: #6b7280; font-weight: 600;">Processing</p>
                              <p style="margin: 5px 0 0 0; font-size: 11px; color: #9ca3af;">Pending</p>
                            </td>
                            <td width="25%" style="text-align: center; padding: 10px;">
                              <div style="width: 50px; height: 50px; border-radius: 50%; background: #e5e7eb; margin: 0 auto 10px; display: flex; align-items: center; justify-content: center;">
                                <span style="color: #6b7280; font-size: 24px; font-weight: bold;">4</span>
                              </div>
                              <p style="margin: 0; font-size: 13px; color: #6b7280; font-weight: 600;">Delivery</p>
                              <p style="margin: 5px 0 0 0; font-size: 11px; color: #9ca3af;">4-7 weeks</p>
                            </td>
                          </tr>
                        </table>
                      </div>

                      <!-- Next Steps -->
                      <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border-left: 4px solid #3b82f6; padding: 25px; border-radius: 8px; margin: 30px 0;">
                        <h3 style="margin: 0 0 15px 0; color: #1e40af; font-size: 18px;">📋 What Happens Next?</h3>
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="padding: 8px 0;">
                              <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                  <td width="30" valign="top">
                                    <span style="font-size: 20px;">📄</span>
                                  </td>
                                  <td style="color: #1e3a8a; font-size: 14px; line-height: 1.6;">
                                    <strong>Review Order Confirmation</strong><br/>
                                    <span style="color: #475569;">Check the attached PDF for complete order details</span>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0;">
                              <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                  <td width="30" valign="top">
                                    <span style="font-size: 20px;">💳</span>
                                  </td>
                                  <td style="color: #1e3a8a; font-size: 14px; line-height: 1.6;">
                                    <strong>Payment Instructions</strong><br/>
                                    <span style="color: #475569;">Detailed payment information will follow in a separate email</span>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0;">
                              <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                  <td width="30" valign="top">
                                    <span style="font-size: 20px;">🚚</span>
                                  </td>
                                  <td style="color: #1e3a8a; font-size: 14px; line-height: 1.6;">
                                    <strong>Order Fulfillment</strong><br/>
                                    <span style="color: #475569;">Expected delivery: 4-7 weeks after payment confirmation</span>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </div>

                      <!-- Important Notice -->
                      <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; border-radius: 8px; margin: 30px 0;">
                        <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.6;">
                          <strong>⚠️ Important:</strong> All products are available by order only and sourced from European manufacturers. Delivery time may vary based on availability.
                        </p>
                      </div>

                      <!-- Contact Section -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin: 35px 0 20px 0;">
                        <tr>
                          <td style="padding: 25px; background: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb;">
                            <h3 style="margin: 0 0 12px 0; color: #1a8c7c; font-size: 18px;">Need Help?</h3>
                            <p style="margin: 0; color: #555; font-size: 14px; line-height: 1.6;">
                              Our team is ready to assist you with any questions about your order.
                            </p>
                            <p style="margin: 12px 0 0 0; color: #555; font-size: 14px;">
                              📧 Email: <a href="mailto:ceo@adorisgroup.com" style="color: #20a895; text-decoration: none; font-weight: 600;">ceo@adorisgroup.com</a><br/>
                              📞 Available: Monday-Friday, 9:00 AM - 6:00 PM EET
                            </p>
                          </td>
                        </tr>
                      </table>

                      <p style="font-size: 16px; color: #555; margin: 35px 0 0 0; line-height: 1.6;">
                        Thank you for choosing ADORIS INVEST GROUP,<br/>
                        <strong style="color: #1a8c7c; font-size: 18px;">Your Trusted Medical Equipment Partner</strong>
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background: #f9fafb; padding: 35px 40px; border-top: 1px solid #e5e7eb;">
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center">
                            <p style="margin: 0 0 8px 0; color: #374151; font-size: 14px; font-weight: 600;">ADORIS INVEST GROUP OÜ</p>
                            <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 13px;">Harju maakond, Tallinn, Kesklinna linnaosa</p>
                            <p style="margin: 0 0 12px 0; color: #6b7280; font-size: 13px;">Narva mnt 7-634, 10117, Estonia</p>
                            <p style="margin: 0; color: #6b7280; font-size: 13px;">
                              Email: <a href="mailto:ceo@adorisgroup.com" style="color: #20a895; text-decoration: none;">ceo@adorisgroup.com</a>
                            </p>
                            <p style="margin: 15px 0 0 0; color: #9ca3af; font-size: 12px;">
                              © ${new Date().getFullYear()} ADORIS INVEST GROUP. All rights reserved.
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
      attachments: [
        {
          filename: `Order-${orderNumber}.pdf`,
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
      subject: `🆕 New Order: ${orderNumber} - ${customerName}`,
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
      subject: '🎉 Welcome to ADORIS INVEST GROUP',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to ADORIS INVEST GROUP</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Arial, sans-serif; background: #f4f4f4;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background: #f4f4f4; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
                  
                  <!-- Header with Gradient -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #1a8c7c 0%, #20a895 100%); padding: 50px 40px; text-align: center;">
                      <h1 style="color: white; margin: 0; font-size: 36px; font-weight: bold;">Welcome to ADORIS! 🎉</h1>
                      <p style="color: rgba(255,255,255,0.95); margin: 12px 0 0 0; font-size: 18px;">Your medical equipment partner</p>
                    </td>
                  </tr>

                  <!-- Main Content -->
                  <tr>
                    <td style="padding: 50px 40px;">
                      <h2 style="color: #1a8c7c; margin: 0 0 20px 0; font-size: 28px;">Hi ${name}! 👋</h2>
                      
                      <p style="font-size: 17px; line-height: 1.7; color: #333; margin: 0 0 25px 0;">
                        Thank you for joining <strong style="color: #20a895;">ADORIS INVEST GROUP</strong>. Your account has been successfully created, and you're now part of our professional medical equipment network.
                      </p>

                      <!-- Features Grid -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin: 35px 0;">
                        <tr>
                          <td style="padding-right: 15px; width: 50%;">
                            <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); padding: 25px; border-radius: 10px; border-left: 4px solid #20a895;">
                              <h3 style="margin: 0 0 10px 0; color: #1a8c7c; font-size: 18px;">📦 Extensive Catalog</h3>
                              <p style="margin: 0; color: #555; font-size: 14px; line-height: 1.6;">
                                Browse 100,000+ medical equipment products from top European manufacturers
                              </p>
                            </div>
                          </td>
                          <td style="padding-left: 15px; width: 50%;">
                            <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); padding: 25px; border-radius: 10px; border-left: 4px solid #20a895;">
                              <h3 style="margin: 0 0 10px 0; color: #1a8c7c; font-size: 18px;">💰 Volume Discounts</h3>
                              <p style="margin: 0; color: #555; font-size: 14px; line-height: 1.6;">
                                Save 5% on orders over €50K, 10% on orders over €100K
                              </p>
                            </div>
                          </td>
                        </tr>
                        <tr><td colspan="2" style="padding: 15px 0;"></td></tr>
                        <tr>
                          <td style="padding-right: 15px; width: 50%;">
                            <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); padding: 25px; border-radius: 10px; border-left: 4px solid #20a895;">
                              <h3 style="margin: 0 0 10px 0; color: #1a8c7c; font-size: 18px;">📋 Bulk Orders</h3>
                              <p style="margin: 0; color: #555; font-size: 14px; line-height: 1.6;">
                                Quick SKU-based ordering for large procurement needs
                              </p>
                            </div>
                          </td>
                          <td style="padding-left: 15px; width: 50%;">
                            <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); padding: 25px; border-radius: 10px; border-left: 4px solid #20a895;">
                              <h3 style="margin: 0 0 10px 0; color: #1a8c7c; font-size: 18px;">🚀 Fast Delivery</h3>
                              <p style="margin: 0; color: #555; font-size: 14px; line-height: 1.6;">
                                4-7 weeks delivery from European suppliers
                              </p>
                            </div>
                          </td>
                        </tr>
                      </table>

                      <!-- CTA Button -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin: 40px 0;">
                        <tr>
                          <td align="center">
                            <a href="${process.env.NEXTAUTH_URL}" 
                               style="display: inline-block; background: linear-gradient(135deg, #1a8c7c 0%, #20a895 100%); 
                                      color: white; padding: 18px 50px; text-decoration: none; border-radius: 8px; 
                                      font-weight: bold; font-size: 18px; box-shadow: 0 4px 15px rgba(32, 168, 149, 0.3);">
                              Start Shopping Now →
                            </a>
                          </td>
                        </tr>
                      </table>

                      <!-- Help Section -->
                      <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; border-radius: 8px; margin: 30px 0;">
                        <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.6;">
                          <strong>💡 Need Help?</strong><br/>
                          Our team is here to assist you with product selection, pricing, or any questions. 
                          Contact us at <a href="mailto:ceo@adorisgroup.com" style="color: #20a895; text-decoration: none; font-weight: bold;">ceo@adorisgroup.com</a>
                        </p>
                      </div>

                      <p style="font-size: 16px; color: #555; margin: 35px 0 0 0; line-height: 1.6;">
                        Best regards,<br/>
                        <strong style="color: #1a8c7c; font-size: 18px;">The ADORIS INVEST GROUP Team</strong>
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background: #f9fafb; padding: 35px 40px; border-top: 1px solid #e5e7eb;">
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center">
                            <p style="margin: 0 0 8px 0; color: #374151; font-size: 14px; font-weight: 600;">ADORIS INVEST GROUP OÜ</p>
                            <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 13px;">Harju maakond, Tallinn, Kesklinna linnaosa</p>
                            <p style="margin: 0 0 12px 0; color: #6b7280; font-size: 13px;">Narva mnt 7-634, 10117, Estonia</p>
                            <p style="margin: 0; color: #6b7280; font-size: 13px;">
                              Email: <a href="mailto:ceo@adorisgroup.com" style="color: #20a895; text-decoration: none;">ceo@adorisgroup.com</a>
                            </p>
                            <p style="margin: 15px 0 0 0; color: #9ca3af; font-size: 12px;">
                              © ${new Date().getFullYear()} ADORIS INVEST GROUP. All rights reserved.
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
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
