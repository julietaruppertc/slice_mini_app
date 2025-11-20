"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export interface Transaction {
  id: string
  type: "deposit" | "withdrawal"
  amount: number
  date: number
}

export interface Slice {
  id: string
  name: string
  amount: number
  currency: string
  goal: number
  createdAt: number
  transactions: Transaction[]
}

interface SlicesContextType {
  slices: Slice[]
  addSlice: (slice: Slice) => void
  updateSlice: (id: string, slice: Slice) => void
  deleteSlice: (id: string) => void
  addTransaction: (sliceId: string, transaction: Transaction) => void
}

const SlicesContext = createContext<SlicesContextType | undefined>(undefined)

export function SliceProvider({ children }: { children: ReactNode }) {
  const [slices, setSlices] = useState<Slice[]>(() => {
    if (typeof window === "undefined") return []
    const saved = localStorage.getItem("slices")
    return saved ? JSON.parse(saved) : []
  })

  const addSlice = (slice: Slice) => {
    const updated = [...slices, slice]
    setSlices(updated)
    localStorage.setItem("slices", JSON.stringify(updated))
  }

  const updateSlice = (id: string, updatedSlice: Slice) => {
    const updated = slices.map((s) => (s.id === id ? updatedSlice : s))
    setSlices(updated)
    localStorage.setItem("slices", JSON.stringify(updated))
  }

  const deleteSlice = (id: string) => {
    const updated = slices.filter((s) => s.id !== id)
    setSlices(updated)
    localStorage.setItem("slices", JSON.stringify(updated))
  }

  const addTransaction = (sliceId: string, transaction: Transaction) => {
    const updated = slices.map((s) => {
      if (s.id === sliceId) {
        return { ...s, transactions: [...s.transactions, transaction] }
      }
      return s
    })
    setSlices(updated)
    localStorage.setItem("slices", JSON.stringify(updated))
  }

  return (
    <SlicesContext.Provider value={{ slices, addSlice, updateSlice, deleteSlice, addTransaction }}>
      {children}
    </SlicesContext.Provider>
  )
}

export function useSlices() {
  const context = useContext(SlicesContext)
  if (!context) {
    throw new Error("useSlices must be used within SliceProvider")
  }
  return context
}
