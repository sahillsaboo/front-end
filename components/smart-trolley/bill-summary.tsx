"use client"

type Props = {
  totalItems: number
  subtotal: number
  tax: number
  finalTotal: number
}

export function BillSummary({ totalItems, subtotal, tax, finalTotal }: Props) {
  return (
    <section aria-label="Bill Summary" className="rounded-xl border bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-base font-semibold text-gray-900">Bill Summary</h2>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="text-gray-500">Total Items</div>
        <div className="text-right font-medium text-gray-900">{totalItems}</div>

        <div className="text-gray-500">Subtotal</div>
        <div className="text-right font-medium text-gray-900">₹{subtotal.toFixed(2)}</div>

        <div className="text-gray-500">Tax (5%)</div>
        <div className="text-right font-medium text-gray-900">₹{tax.toFixed(2)}</div>
      </div>

      <div className="mt-3 flex items-center justify-between rounded-lg bg-gray-50 p-3">
        <span className="text-sm font-semibold text-gray-900">Final Total</span>
        <span className="text-base font-bold text-gray-900">₹{finalTotal.toFixed(2)}</span>
      </div>
    </section>
  )
}
