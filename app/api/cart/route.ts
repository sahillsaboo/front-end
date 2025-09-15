import type { NextRequest } from "next/server"

type Item = { id: string; name: string; quantity: number; unitPrice: number }

let CART_ID = "CART-7421-AB"
let items: Item[] = [
  { id: "p1", name: "Organic Apples (1kg)", quantity: 1, unitPrice: 120 },
  { id: "p2", name: "Whole Wheat Bread", quantity: 2, unitPrice: 45 },
  { id: "p3", name: "Almond Milk (1L)", quantity: 1, unitPrice: 180 },
]

// Randomly simulate RFID removal every ~30 polls
let pollCount = 0

export async function GET() {
  pollCount++
  if (pollCount % 30 === 0 && items.length > 0) {
    // remove last item to simulate auto-disappear behavior
    items = items.slice(0, items.length - 1)
  }

  return Response.json({
    cartId: CART_ID,
    items,
  })
}

export async function DELETE(req: NextRequest) {
  // End session: clear cart and issue a new cart id
  items = []
  CART_ID = `CART-${Math.floor(Math.random() * 9000 + 1000)}-${Math.random().toString(36).slice(2, 4).toUpperCase()}`
  pollCount = 0
  return new Response(null, { status: 204 })
}
