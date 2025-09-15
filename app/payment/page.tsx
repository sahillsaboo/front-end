"use client"

import { useMemo, useState } from "react"
import useSWR from "swr"
import Link from "next/link"
import { Header } from "@/components/smart-trolley/header"
import { BillSummary } from "@/components/smart-trolley/bill-summary"
import { PaymentSection } from "@/components/smart-trolley/payment-section"
import { ReceiptCard } from "@/components/smart-trolley/receipt-card"
import { Button } from "@/components/ui/button"
import { downloadReceiptPdf } from "@/lib/create-receipt-pdf"

type CartItem = {
  id: string
  name: string
  quantity: number
  unitPrice: number
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function PaymentPage() {
  const { data, mutate } = useSWR<{ items: CartItem[]; cartId: string }>("/api/cart", fetcher, {
    refreshInterval: 1500,
  })
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "pending" | "success">("idle")
  const [paidMethod, setPaidMethod] = useState<"UPI" | "Card" | "NetBanking">("UPI")

  const totals = useMemo(() => {
    const items = data?.items || []
    const subtotal = items.reduce((sum, it) => sum + it.quantity * it.unitPrice, 0)
    const taxRate = 0.05
    const tax = subtotal * taxRate
    const finalTotal = subtotal + tax
    const totalItems = items.reduce((sum, it) => sum + it.quantity, 0)
    return { subtotal, tax, finalTotal, totalItems }
  }, [data])

  const handlePay = async (method: "UPI" | "Card" | "NetBanking") => {
    setPaidMethod(method)
    setPaymentStatus("pending")
    await new Promise((r) => setTimeout(r, 1200))
    setPaymentStatus("success")
  }

  const handleEndSession = async () => {
    await fetch("/api/cart", { method: "DELETE" })
    await mutate()
    setPaymentStatus("idle")
  }

  const items = data?.items || []
  const showReceipt = paymentStatus === "success"

  return (
    <main className="mx-auto max-w-lg p-4 md:p-6">
      {/* Top bar with back link */}
      <div className="mb-4 flex items-center justify-between">
        <Header storeName="Smart Trolley" tagline="Complete your payment securely." cartId={data?.cartId || "—"} />
        <Button asChild variant="outline" aria-label="Back to cart">
          <Link href="/">Back to cart</Link>
        </Button>
      </div>

      {!showReceipt ? (
        <section className="space-y-4" aria-label="Billing and payment">
          <BillSummary
            totalItems={totals.totalItems}
            subtotal={totals.subtotal}
            tax={totals.tax}
            finalTotal={totals.finalTotal}
          />
          <PaymentSection status={paymentStatus} total={totals.finalTotal} onPay={handlePay} />
          <div className="flex justify-end">
            <Button variant="outline" onClick={handleEndSession} aria-label="End session and reset cart">
              End Session
            </Button>
          </div>
        </section>
      ) : (
        <section aria-label="Receipt" className="mt-2">
          <ReceiptCard
            cartId={data?.cartId || "—"}
            items={items}
            finalTotal={totals.finalTotal}
            onDownload={() => {
              const now = new Date()
              downloadReceiptPdf({
                id: `TXN-${now.getTime()}`,
                storeName: "Smart Trolley",
                storeAddress: "Smart Mall, 1st Floor, Bengaluru",
                date: now.toLocaleString(),
                items: items.map((it) => ({
                  name: it.name,
                  qty: it.quantity,
                  price: it.unitPrice,
                })),
                subtotal: totals.subtotal,
                tax: totals.tax,
                total: totals.finalTotal,
                paymentMethod: paidMethod,
              })
            }}
          />
          <div className="mt-3 flex gap-2">
            <Button asChild variant="outline">
              <Link href="/">Back to cart</Link>
            </Button>
            <Button onClick={handleEndSession}>End Session</Button>
          </div>
        </section>
      )}
    </main>
  )
}
