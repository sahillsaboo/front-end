"use client"

import useSWR from "swr"
import Link from "next/link"
import { Header } from "@/components/smart-trolley/header"
import { LiveCart } from "@/components/smart-trolley/live-cart"
import { Button } from "@/components/ui/button"

type CartItem = {
  id: string
  name: string
  quantity: number
  unitPrice: number
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function Page() {
  const { data, isLoading } = useSWR<{ items: CartItem[]; cartId: string }>("/api/cart", fetcher, {
    refreshInterval: 1500,
  })

  const items = data?.items || []
  const cartEmpty = items.length === 0

  return (
    <main className="mx-auto max-w-lg p-4 md:p-6">
      <Header
        storeName="Smart Trolley"
        tagline="Your smart cart updates live as you shop."
        cartId={data?.cartId || "—"}
      />

      <section aria-label="Live cart only" className="space-y-4">
        <LiveCart items={items} isLoading={isLoading} />

        <div className="flex justify-end">
          <Button asChild disabled={cartEmpty} aria-label="Proceed to payment">
            <Link href="/payment">Proceed to payment</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
