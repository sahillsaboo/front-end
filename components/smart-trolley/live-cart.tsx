"use client"

type CartItem = {
  id: string
  name: string
  quantity: number
  unitPrice: number
}

export function LiveCart({ items, isLoading }: { items: CartItem[]; isLoading?: boolean }) {
  return (
    <section aria-label="Live Cart" className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">Live Cart</h2>
        <span className="text-xs text-gray-500">{isLoading ? "Updating…" : "Live"}</span>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-gray-500">Your cart is empty. Items appear here as you shop.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((it) => {
            const subtotal = it.quantity * it.unitPrice
            return (
              <li key={it.id} className="flex items-center justify-between gap-3 rounded-lg border p-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-gray-900">{it.name}</p>
                  <p className="text-xs text-gray-500">Qty: {it.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-900">₹{it.unitPrice.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">Subtotal: ₹{subtotal.toFixed(2)}</p>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
