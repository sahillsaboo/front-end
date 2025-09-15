"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle, Loader2 } from "lucide-react"

type PaymentMethod = "UPI" | "Card" | "NetBanking"

type Props = {
  status: "idle" | "pending" | "success"
  total: number
  onPay: (method: PaymentMethod) => Promise<void> | void
}

export function PaymentSection({ status, total, onPay }: Props) {
  const [method, setMethod] = useState<PaymentMethod>("UPI")
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvv: "" })
  const [bank, setBank] = useState("")

  const isPending = status === "pending"
  const isSuccess = status === "success"

  // helpers for UPI deep links (best-effort; device/app handling may vary)
  const upiPA = "sahilsanjaysaboo-1@okaxis"
  const upiPN = "Sahil Saboo"
  const upiAmount = total.toFixed(2)
  const upiUrl = `upi://pay?pa=${encodeURIComponent(upiPA)}&pn=${encodeURIComponent(upiPN)}&am=${encodeURIComponent(
    upiAmount,
  )}&cu=INR`

  return (
    <section aria-label="Payment" className="rounded-xl border bg-white p-4 shadow-sm">
      {/* Total Bill Display */}
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-base font-semibold text-gray-900">Payment</h2>
        <div className="text-lg font-bold text-gray-900" aria-label="Total to Pay">
          ₹{total.toFixed(2)}
        </div>
      </div>

      {/* Payment Options */}
      <div className="grid gap-3">
        {/* UPI OPTION */}
        <div
          className={`rounded-lg border p-3 ${method === "UPI" ? "ring-2 ring-emerald-600" : ""}`}
          role="group"
          aria-labelledby="upi-title"
        >
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-gray-900" id="upi-title">
              Pay via UPI
            </div>
            <Button
              size="sm"
              variant={method === "UPI" ? "default" : "outline"}
              onClick={() => setMethod("UPI")}
              aria-label="Select UPI payment"
            >
              {method === "UPI" ? "Selected" : "Select"}
            </Button>
          </div>

          {method === "UPI" && (
            <div className="mt-3 flex flex-col items-center gap-2">
              {/* Provided QR */}
              <img
                src="/images/upi-sahil-saboo.jpg"
                alt="UPI QR code to pay"
                className="w-full max-w-xs rounded-lg border"
              />
              <p className="text-xs text-gray-500">Scan with any UPI app • UPI ID: {upiPA}</p>

              {/* Redirect buttons to UPI apps (best-effort) */}
              <div className="mt-1 grid w-full grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  className="text-xs bg-transparent"
                  onClick={() => (window.location.href = upiUrl)}
                  aria-label="Open Google Pay"
                >
                  Google Pay
                </Button>
                <Button
                  variant="outline"
                  className="text-xs bg-transparent"
                  onClick={() => (window.location.href = upiUrl)}
                  aria-label="Open PhonePe"
                >
                  PhonePe
                </Button>
                <Button
                  variant="outline"
                  className="text-xs bg-transparent"
                  onClick={() => (window.location.href = upiUrl)}
                  aria-label="Open Paytm"
                >
                  Paytm
                </Button>
              </div>

              <Button
                onClick={() => onPay("UPI")}
                disabled={isPending || isSuccess}
                className="mt-1 w-full rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                aria-label="Pay via UPI"
              >
                {isPending ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing…
                  </span>
                ) : isSuccess ? (
                  "Paid"
                ) : (
                  `Pay ₹${total.toFixed(2)} via UPI`
                )}
              </Button>
            </div>
          )}
        </div>

        {/* CARD OPTION */}
        <div
          className={`rounded-lg border p-3 ${method === "Card" ? "ring-2 ring-emerald-600" : ""}`}
          role="group"
          aria-labelledby="card-title"
        >
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-gray-900" id="card-title">
              Debit / Credit Card
            </div>
            <Button
              size="sm"
              variant={method === "Card" ? "default" : "outline"}
              onClick={() => setMethod("Card")}
              aria-label="Select card payment"
            >
              {method === "Card" ? "Selected" : "Select"}
            </Button>
          </div>

          {method === "Card" && (
            <form
              className="mt-3 grid gap-2"
              onSubmit={(e) => {
                e.preventDefault()
                onPay("Card")
              }}
            >
              <input
                type="text"
                inputMode="numeric"
                autoComplete="cc-number"
                placeholder="Card Number"
                className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-600"
                value={card.number}
                onChange={(e) => setCard({ ...card, number: e.target.value })}
                required
                aria-label="Card number"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="MM/YY"
                  className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-600"
                  value={card.expiry}
                  onChange={(e) => setCard({ ...card, expiry: e.target.value })}
                  required
                  aria-label="Expiry date"
                />
                <input
                  type="password"
                  inputMode="numeric"
                  placeholder="CVV"
                  className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-600"
                  value={card.cvv}
                  onChange={(e) => setCard({ ...card, cvv: e.target.value })}
                  required
                  aria-label="CVV"
                />
              </div>
              <input
                type="text"
                placeholder="Cardholder Name"
                className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-600"
                value={card.name}
                onChange={(e) => setCard({ ...card, name: e.target.value })}
                required
                aria-label="Cardholder name"
              />
              <Button
                type="submit"
                disabled={isPending || isSuccess}
                className="mt-1 w-full rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                aria-label="Pay via card"
              >
                {isPending ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing…
                  </span>
                ) : isSuccess ? (
                  "Paid"
                ) : (
                  `Pay ₹${total.toFixed(2)}`
                )}
              </Button>
            </form>
          )}
        </div>

        {/* NET BANKING OPTION */}
        <div
          className={`rounded-lg border p-3 ${method === "NetBanking" ? "ring-2 ring-emerald-600" : ""}`}
          role="group"
          aria-labelledby="nb-title"
        >
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-gray-900" id="nb-title">
              Net Banking
            </div>
            <Button
              size="sm"
              variant={method === "NetBanking" ? "default" : "outline"}
              onClick={() => setMethod("NetBanking")}
              aria-label="Select net banking"
            >
              {method === "NetBanking" ? "Selected" : "Select"}
            </Button>
          </div>

          {method === "NetBanking" && (
            <div className="mt-3 grid gap-2">
              <select
                className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-600"
                value={bank}
                onChange={(e) => setBank(e.target.value)}
                aria-label="Choose bank"
              >
                <option value="" disabled>
                  Select your bank
                </option>
                <option value="SBI">State Bank of India (SBI)</option>
                <option value="HDFC">HDFC Bank</option>
                <option value="ICICI">ICICI Bank</option>
                <option value="AXIS">Axis Bank</option>
                <option value="KOTAK">Kotak Mahindra</option>
              </select>

              <Button
                onClick={() => onPay("NetBanking")}
                disabled={!bank || isPending || isSuccess}
                className="mt-1 w-full rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                aria-label="Proceed to bank"
              >
                {isPending ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing…
                  </span>
                ) : isSuccess ? (
                  "Paid"
                ) : (
                  "Proceed to Bank"
                )}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Payment Status Indicator */}
      <div className="mt-3 flex justify-center">
        <PaymentStatus status={status} />
      </div>
    </section>
  )
}

function PaymentStatus({ status }: { status: "idle" | "pending" | "success" }) {
  if (status === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="inline-flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-xs font-medium text-emerald-700"
      >
        <CheckCircle className="h-4 w-4" aria-hidden />
        Payment Successful
      </div>
    )
  }

  if (status === "pending") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-xs font-medium text-gray-700"
      >
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        Processing Payment…
      </div>
    )
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="inline-flex items-center gap-2 rounded-md border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-xs font-medium text-rose-700"
    >
      Pending Payment
    </div>
  )
}
