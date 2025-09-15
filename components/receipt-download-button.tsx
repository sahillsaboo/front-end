"use client"

import { Button } from "@/components/ui/button"
import { downloadReceiptPdf, type ReceiptData } from "@/lib/create-receipt-pdf"

type Props = {
  receipt: ReceiptData
  className?: string
}

export function ReceiptDownloadButton({ receipt, className }: Props) {
  return (
    <Button
      className={className}
      onClick={async () =>
        // include snapshot in the PDF; defaults are handled but we pass explicitly
        downloadReceiptPdf(receipt, { snapshotSrc: "/esp32-cam-cart-snapshot.png" })
      }
      aria-label="Download receipt as PDF"
    >
      Download PDF
    </Button>
  )
}
