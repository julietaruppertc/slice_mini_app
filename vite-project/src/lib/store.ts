import { writable } from "svelte/store"

export interface Transaction {
  id: string
  type: "deposit" | "withdrawal"
  amount: number
  date: number
  description?: string
}

export interface Slice {
  id: string
  name: string
  amount: number
  currency: "ARS" | "USD" | "ETH" | "BTC" | "USDC" | "USDT" | "DAI" | "POL"
  goal: number
  createdAt: number
  deposits?: number
  withdrawals?: number
  transactions: Transaction[]
}

export interface ModalState {
  show: boolean
  message: string
}

export const slices = writable<Slice[]>([])
export const showSuccessModal = writable<boolean>(false)
export const successMessage = writable<string>("")

// Load from localStorage on initialization
if (typeof window !== "undefined") {
  const stored = localStorage.getItem("slices")
  if (stored) {
    try {
      slices.set(JSON.parse(stored))
    } catch (error) {
      console.error("Error parsing stored slices:", error)
    }
  }
}

// Subscribe to changes and save to localStorage
slices.subscribe((value: Slice[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("slices", JSON.stringify(value))
  }
})
