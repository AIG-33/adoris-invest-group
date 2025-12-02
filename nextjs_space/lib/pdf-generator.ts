import jsPDF from 'jspdf'

export async function generateOrderPDF(order: any, formData: any): Promise<Buffer> {
  const doc = new jsPDF()

  // Colors
  const primaryColor = '#0A2463'
  const accentColor = '#06B6D4'

  // Header
  doc.setFillColor(10, 36, 99)
  doc.rect(0, 0, 210, 40, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(28)
  doc.setFont('helvetica', 'bold')
  doc.text('IVD GROUP', 15, 20)
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text('Medical Laboratory Equipment & Supplies', 15, 28)

  // Order Confirmation Title
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('ORDER CONFIRMATION', 15, 55)

  // Order Info Box
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100, 100, 100)
  doc.text(`Order Number: ${order?.orderNumber || 'N/A'}`, 15, 65)
  doc.text(`Date: ${new Date()?.toLocaleDateString?.('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, 15, 70)
  doc.text(`Payment Method: Bank Transfer (Net 30)`, 15, 75)

  // Billing Information
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(6, 182, 212)
  doc.text('Billing Information', 15, 90)

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(0, 0, 0)
  let y = 98
  doc.text(`Company: ${formData?.company || 'N/A'}`, 15, y)
  y += 5
  doc.text(`VAT ID: ${formData?.vatId || 'N/A'}`, 15, y)
  y += 5
  doc.text(`Contact: ${formData?.firstName || ''} ${formData?.lastName || ''}`, 15, y)
  y += 5
  doc.text(`Email: ${formData?.email || 'N/A'}`, 15, y)
  y += 5
  doc.text(`Phone: ${formData?.phone || 'N/A'}`, 15, y)
  y += 5
  doc.text(`Address: ${formData?.address || ''}, ${formData?.city || ''}, ${formData?.postalCode || ''}`, 15, y)
  y += 5
  doc.text(`Country: ${formData?.country || 'N/A'}`, 15, y)

  // Order Items
  y += 15
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(6, 182, 212)
  doc.text('Order Items', 15, y)

  // Table Header
  y += 8
  doc.setFillColor(240, 240, 240)
  doc.rect(15, y - 5, 180, 8, 'F')
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(0, 0, 0)
  doc.text('Product', 17, y)
  doc.text('SKU', 105, y)
  doc.text('Qty', 135, y)
  doc.text('Price', 155, y)
  doc.text('Total', 175, y)

  // Table Items
  doc.setFont('helvetica', 'normal')
  y += 8
  for (const item of order?.items || []) {
    const product = item?.product
    const productName = product?.name || 'Product'
    const truncatedName = productName?.length > 35 ? productName?.substring(0, 35) + '...' : productName

    doc.text(truncatedName, 17, y)
    doc.text(product?.sku || 'N/A', 105, y)
    doc.text(String(item?.quantity || 0), 135, y)
    doc.text(`€${(item?.price || 0)?.toFixed?.(2)}`, 155, y)
    doc.text(`€${((item?.price || 0) * (item?.quantity || 0))?.toFixed?.(2)}`, 175, y)
    y += 6

    // Check if we need a new page
    if (y > 270) {
      doc.addPage()
      y = 20
    }
  }

  // Totals
  y += 10
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`Subtotal:`, 140, y)
  doc.text(`€${(order?.subtotal || 0)?.toFixed?.(2)}`, 175, y)
  y += 6
  doc.text(`Discount (15% B2B):`, 140, y)
  doc.setTextColor(16, 185, 129)
  doc.text(`-€${(order?.discount || 0)?.toFixed?.(2)}`, 175, y)
  y += 6
  doc.setTextColor(0, 0, 0)
  doc.text(`Subtotal (excl. VAT):`, 140, y)
  doc.text(`€${((order?.subtotal || 0) - (order?.discount || 0))?.toFixed?.(2)}`, 175, y)
  y += 6
  doc.text(`VAT (23%):`, 140, y)
  doc.text(`€${(order?.vat || 0)?.toFixed?.(2)}`, 175, y)
  y += 8
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.text(`Total:`, 140, y)
  doc.text(`€${(order?.total || 0)?.toFixed?.(2)}`, 175, y)

  // Footer
  y += 15
  if (y > 260) {
    doc.addPage()
    y = 20
  }
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100, 100, 100)
  doc.text('Thank you for your order!', 15, y)
  y += 5
  doc.text('Payment Instructions: Bank transfer details will be provided in a separate email.', 15, y)
  y += 5
  doc.text('For questions, contact us at info@ivdgroup.eu or +48 123 456 789', 15, y)

  // Company Footer
  const pageHeight = doc.internal.pageSize.height
  doc.setFillColor(10, 36, 99)
  doc.rect(0, pageHeight - 20, 210, 20, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(8)
  doc.text('IVD Group Sp. z o.o. | info@ivdgroup.eu | www.ivdgroup.eu', 105, pageHeight - 10, {
    align: 'center',
  })

  // Convert to buffer
  const pdfOutput = doc.output('arraybuffer')
  return Buffer.from(pdfOutput)
}
