import { writable } from "svelte/store"

export interface Slice {
  id: string
  name: string
  amount: number
  currency: "ARS" | "USD" | "ETH" | "BTC" | "USDC" | "USDT" | "DAI" | "POL"
  goal: number
  createdAt: number
  deposits?: number
  withdrawals?: number
  transactions?: Array<{
    id: string
    type: "deposit" | "withdrawal"
    amount: number
    date: number
    description?: string
  }>
}

export const slices = writable<Slice[]>([])
export const showSuccessModal = writable(false)
export const successMessage = writable("")

// Load from localStorage on initialization
if (typeof window !== "undefined") {
  const stored = localStorage.getItem("slices")
  if (stored) {
    slices.set(JSON.parse(stored))
  }
}

// Subscribe to changes and save to localStorage
slices.subscribe((value) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("slices", JSON.stringify(value))
  }
})
