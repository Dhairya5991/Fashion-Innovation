const PDFDocument = require('pdfkit')
const { v4: uuidv4 } = require('uuid')

function generateInvoiceBuffer(order) {
  const doc = new PDFDocument()
  const buffers = []
  doc.on('data', buffers.push.bind(buffers))
  doc.on('end', () => {})

  doc.fontSize(20).text('Invoice', { align: 'center' })
  doc.moveDown()
  doc.text(`Invoice Number: ${order.invoiceNumber || uuidv4()}`)
  doc.text(`Date: ${new Date().toLocaleString()}`)
  doc.moveDown()
  order.items.forEach((it) => {
    doc.text(`${it.qty} x ${it.product.title || it.product} — ₹${it.price}`)
  })
  doc.moveDown()
  doc.text(`Total: ₹${order.totalINR}`)
  doc.end()

  return new Promise((resolve) => {
    doc.on('end', () => {
      resolve(Buffer.concat(buffers))
    })
  })
}

module.exports = { generateInvoiceBuffer }
