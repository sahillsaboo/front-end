"use client"

type HeaderProps = {
  storeName: string
  tagline: string
  cartId: string
}

export function Header({ storeName, tagline, cartId }: HeaderProps) {
  return (
    <header className="mb-4 space-y-2">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600 text-white">
          {/* Simple monogram logo */}
          <span className="text-sm font-semibold">ST</span>
        </div>
        <div>
          <h1 className="text-pretty text-lg font-semibold text-gray-900">{storeName} — Automated Billing</h1>
          <p className="text-sm text-gray-500">{tagline}</p>
        </div>
      </div>
      <div className="rounded-lg border bg-white p-3 shadow-sm">
        <p className="text-xs text-gray-500">Trolley / Cart ID</p>
        <p className="text-sm font-medium text-gray-900">{cartId}</p>
      </div>
    </header>
  )
}
