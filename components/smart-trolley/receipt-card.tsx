"use client"

import { Button } from "@/components/ui/button"

type Item = {
  id: string
  name: string
  quantity: number
  unitPrice: number
}

type Props = {
  cartId: string
  items: Item[]
  finalTotal: number
  onDownload: () => void
  snapshotSrc?: string
}

export function ReceiptCard({ cartId, items, finalTotal, onDownload, snapshotSrc }: Props) {
  const now = new Date()
  const txnId = `TXN-${now.getTime()}`
  const imgSrc = snapshotSrc || "/esp32-cam-cart-snapshot.png"

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-base font-semibold text-gray-900">Receipt</h2>

      <div className="grid gap-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Cart ID</span>
          <span className="font-medium text-gray-900">{cartId}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Date & Time</span>
          <span className="font-medium text-gray-900">
            {now.toLocaleDateString()} {now.toLocaleTimeString()}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Transaction ID</span>
          <span className="font-medium text-gray-900">{txnId}</span>
        </div>
      </div>

      <hr className="my-3" />

      <ul className="space-y-2">
        {items.map((it) => (
          <li key={it.id} className="flex items-center justify-between text-sm">
            <span className="text-gray-700">
              {it.name} × {it.quantity}
            </span>
            <span className="font-medium text-gray-900">₹{(it.quantity * it.unitPrice).toFixed(2)}</span>
          </li>
        ))}
      </ul>

      <div className="mt-3 flex items-center justify-between rounded-lg bg-gray-50 p-3">
        <span className="text-sm font-semibold text-gray-900">Final Total</span>
        <span className="text-base font-bold text-gray-900">₹{finalTotal.toFixed(2)}</span>
      </div>

      <div className="mt-3">
        <h3 className="mb-2 text-sm font-semibold text-gray-900">Cart snapshot</h3>
        <div className="overflow-hidden rounded-lg border">
          <img
            src={imgSrc || "/placeholder.svg"}
            alt="Cart snapshot captured by ESP32 camera"
            className="block h-auto w-full object-cover"
          />
        </div>
      </div>

      <div className="mt-3">
        <Button
          onClick={onDownload}
          variant="outline"
          className="w-full rounded-lg border-gray-200 text-gray-700 bg-transparent"
          aria-label="Download or save receipt"
        >
          Download / Save Receipt
        </Button>
      </div>
    </div>
  )
}
