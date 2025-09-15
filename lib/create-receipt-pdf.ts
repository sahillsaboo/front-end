// Generates and immediately triggers a PDF download for a purchase receipt.

import { jsPDF } from "jspdf"

export type ReceiptItem = {
  name: string
  qty: number
  price: number // per-unit price
}

export type ReceiptData = {
  id: string
  storeName: string
  storeAddress?: string
  date: string // ISO or display string
  items: ReceiptItem[]
  subtotal: number
  tax: number
  total: number
  paymentMethod: string // e.g. "UPI", "Card", etc.
}

// Helper: fetch an image and return a data URL for jsPDF addImage
async function toDataURL(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { cache: "no-store" })
    if (!res.ok) return null
    const blob = await res.blob()
    return await new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.readAsDataURL(blob)
    })
  } catch {
    return null
  }
}

export async function downloadReceiptPdf(receipt: ReceiptData, options?: { snapshotSrc?: string }) {
  const snapshotSrc = options?.snapshotSrc ?? "/esp32-cam-cart-snapshot.png"

  const doc = new jsPDF({ unit: "pt", format: "a4" })
  const marginX = 40
  let y = 50

  // Header
  doc.setFont("helvetica", "bold")
  doc.setFontSize(16)
  doc.text(receipt.storeName, marginX, y)
  y += 18

  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  if (receipt.storeAddress) {
    doc.text(receipt.storeAddress, marginX, y)
    y += 14
  }
  doc.text(`Date: ${receipt.date}`, marginX, y)
  y += 14
  doc.text(`Receipt ID: ${receipt.id}`, marginX, y)
  y += 24

  // Divider
  doc.setDrawColor(200)
  doc.line(marginX, y, 555, y)
  y += 20

  // Items header
  doc.setFont("helvetica", "bold")
  doc.setFontSize(11)
  doc.text("Item", marginX, y)
  doc.text("Qty", 350, y, { align: "right" })
  doc.text("Price", 430, y, { align: "right" })
  doc.text("Total", 555, y, { align: "right" })
  y += 14
  doc.setDrawColor(230)
  doc.line(marginX, y, 555, y)
  y += 12

  // Items
  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  const lineHeight = 14

  receipt.items.forEach((it) => {
    const totalLine = it.qty * it.price
    const nameLines = doc.splitTextToSize(it.name, 280)
    nameLines.forEach((line, i) => {
      doc.text(line, marginX, y + i * lineHeight)
    })
    doc.text(String(it.qty), 350, y, { align: "right" })
    doc.text(`₹${it.price.toFixed(2)}`, 430, y, { align: "right" })
    doc.text(`₹${totalLine.toFixed(2)}`, 555, y, { align: "right" })
    y += Math.max(lineHeight, nameLines.length * lineHeight)
    doc.setDrawColor(245)
    doc.line(marginX, y, 555, y)
    y += 8
  })

  y += 8
  // Summary
  doc.setFont("helvetica", "normal")
  doc.setFontSize(11)
  doc.text("Subtotal", 430, y, { align: "right" })
  doc.text(`₹${receipt.subtotal.toFixed(2)}`, 555, y, { align: "right" })
  y += 16
  doc.text("Tax", 430, y, { align: "right" })
  doc.text(`₹${receipt.tax.toFixed(2)}`, 555, y, { align: "right" })
  y += 16

  doc.setFont("helvetica", "bold")
  doc.text("Total", 430, y, { align: "right" })
  doc.text(`₹${receipt.total.toFixed(2)}`, 555, y, { align: "right" })
  y += 24

  // Payment method
  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  doc.text(`Paid via: ${receipt.paymentMethod}`, marginX, y)
  y += 24

  // Embed ESP32 cart snapshot image if available
  const dataUrl = await toDataURL(snapshotSrc)
  if (dataUrl) {
    // add section header
    doc.setFont("helvetica", "bold")
    doc.setFontSize(11)
    doc.text("Cart snapshot", marginX, y)
    y += 12

    // if near page end, add new page
    const pageHeight = doc.internal.pageSize.getHeight()
    const imgHeight = 180 // pt
    if (y + imgHeight + 40 > pageHeight) {
      doc.addPage()
      y = 50
    }

    // render image (scaled)
    const imgWidth = 300 // pt
    doc.addImage(dataUrl, "PNG", marginX, y, imgWidth, imgHeight)
    y += imgHeight + 18

    // subtle caption
    doc.setFont("helvetica", "italic")
    doc.setFontSize(9)
    doc.setTextColor(120)
    doc.text("Snapshot captured at checkout (ESP32 camera)", marginX, y)
    y += 6

    // reset text color for footer
    doc.setTextColor(0)
  }

  // Footer
  doc.setFont("helvetica", "italic")
  doc.setFontSize(9)
  doc.setTextColor(120)
  doc.text("Thank you for shopping with us!", marginX, y)

  const filename = `receipt-${receipt.id}.pdf`
  doc.save(filename)
}
