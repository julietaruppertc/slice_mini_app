"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useSlices, type Slice, type Transaction } from "@/lib/store"

export default function Depositar() {
  const router = useRouter()
  const params = useParams()
  const { slices, updateSlice } = useSlices()
  const sliceId = params.id as string

  const slice = slices.find((s: Slice) => s.id === sliceId)
  const [amount, setAmount] = useState("")

  const handleDeposit = () => {
    if (!amount || Number.parseFloat(amount) <= 0) {
      alert("Ingresa un monto válido")
      return
    }

    if (!slice) return

    const transaction: Transaction = {
      id: Date.now().toString(),
      type: "deposit",
      amount: Number.parseFloat(amount),
      date: Date.now(),
    }

    const updatedSlice: Slice = {
      ...slice,
      amount: slice.amount + Number.parseFloat(amount),
      transactions: [...(slice.transactions || []), transaction],
    }

    updateSlice(slice.id, updatedSlice)
    router.push(`/info-slice/${slice.id}`)
  }

  if (!slice) {
    return <div>No se encontró el slice</div>
  }

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: "#806CF2" }}>
      <h1
        style={{
          fontSize: "32px",
          fontWeight: "bold",
          color: "#F0EE00",
          fontFamily: "'Stack Sans Text', sans-serif",
          marginBottom: "24px",
          textAlign: "center",
        }}
      >
        Ingresar dinero
      </h1>

      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "16px",
          marginBottom: "24px",
          height: "80px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          maxWidth: "400px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            step="0.01"
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              fontFamily: "'Stack Sans Text', sans-serif",
              fontSize: "18px",
              color: "#5E2CBA",
            }}
          />
          <span
            style={{
              fontSize: "16px",
              color: "#5E2CBA",
              fontFamily: "'Stack Sans Text', sans-serif",
              minWidth: "fit-content",
            }}
          >
            {slice.currency}
          </span>
        </div>
      </div>

      <div style={{ display: "flex", gap: "12px", justifyContent: "center", maxWidth: "400px", margin: "0 auto" }}>
        <button
          onClick={handleDeposit}
          style={{
            backgroundColor: "#F0EE00",
            color: "#5E2CBA",
            flex: 1,
            height: "50px",
            borderRadius: "12px",
            fontSize: "16px",
            fontFamily: "'Stack Sans Headline', sans-serif",
            fontWeight: "600",
            border: "none",
            cursor: "pointer",
          }}
        >
          Cargar fondos
        </button>
        <button
          onClick={() => router.push(`/info-slice/${slice.id}`)}
          style={{
            backgroundColor: "rgba(255,255,255,0.3)",
            color: "white",
            flex: 1,
            height: "50px",
            borderRadius: "12px",
            fontSize: "16px",
            fontFamily: "'Stack Sans Text', sans-serif",
            border: "none",
            cursor: "pointer",
          }}
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}
