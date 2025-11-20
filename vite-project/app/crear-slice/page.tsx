"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSlices, type Slice } from "@/lib/store"
import { useModal } from "@/components/modal-aviso"

const currencies: ("ARS" | "USD" | "ETH" | "BTC" | "USDC" | "USDT" | "DAI" | "POL")[] = [
  "ARS",
  "USD",
  "ETH",
  "BTC",
  "USDC",
  "USDT",
  "DAI",
  "POL",
]

export default function CrearSlice() {
  const router = useRouter()
  const { addSlice } = useSlices()
  const { showSuccessModal } = useModal()

  const [name, setName] = useState("")
  const [currency, setCurrency] = useState<"ARS" | "USD" | "ETH" | "BTC" | "USDC" | "USDT" | "DAI" | "POL">("USD")
  const [amount, setAmount] = useState("")
  const [goal, setGoal] = useState("")

  const handleCreateSlice = () => {
    if (!name || !amount || !goal) {
      alert("Por favor completa todos los campos")
      return
    }

    const newSlice: Slice = {
      id: Date.now().toString(),
      name,
      amount: Number.parseFloat(amount),
      currency,
      goal: Number.parseFloat(goal),
      createdAt: Date.now(),
      transactions: [],
    }

    addSlice(newSlice)
    showSuccessModal("Slice creado exitosamente")

    setTimeout(() => {
      router.push("/inicio")
    }, 2000)
  }

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: "#806CF2" }}>
      <h1
        style={{
          fontSize: "36px",
          fontWeight: "bold",
          color: "#F0EE00",
          fontFamily: "'Stack Sans Text', sans-serif",
          marginBottom: "24px",
          textAlign: "center",
        }}
      >
        Crear Slice
      </h1>

      {/* Name Field */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "12px 16px",
          marginBottom: "16px",
          height: "60px",
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <label
          htmlFor="name"
          style={{
            fontSize: "18px",
            color: "#5E2CBA",
            fontFamily: "'Stack Sans Text', sans-serif",
            minWidth: "fit-content",
          }}
        >
          Nombre
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre del slice"
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            fontFamily: "'Stack Sans Text', sans-serif",
            fontSize: "14px",
            color: "#5E2CBA",
          }}
        />
      </div>

      {/* Currency Dropdown */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "12px 16px",
          marginBottom: "16px",
          height: "60px",
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <label
          htmlFor="currency"
          style={{
            fontSize: "18px",
            color: "#5E2CBA",
            fontFamily: "'Stack Sans Text', sans-serif",
            minWidth: "fit-content",
          }}
        >
          Moneda
        </label>
        <select
          id="currency"
          value={currency}
          onChange={(e) => setCurrency(e.target.value as typeof currency)}
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            fontFamily: "'Stack Sans Text', sans-serif",
            fontSize: "14px",
            color: "#5E2CBA",
            backgroundColor: "transparent",
          }}
        >
          {currencies.map((curr) => (
            <option key={curr} value={curr}>
              {curr}
            </option>
          ))}
        </select>
      </div>

      {/* Amount Field */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "12px 16px",
          marginBottom: "16px",
          height: "60px",
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <label
          htmlFor="amount"
          style={{
            fontSize: "18px",
            color: "#5E2CBA",
            fontFamily: "'Stack Sans Text', sans-serif",
            minWidth: "fit-content",
          }}
        >
          Monto
        </label>
        <input
          id="amount"
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
            fontSize: "14px",
            color: "#5E2CBA",
          }}
        />
      </div>

      {/* Goal Field */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "12px 16px",
          marginBottom: "24px",
          height: "60px",
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <label
          htmlFor="goal"
          style={{
            fontSize: "18px",
            color: "#5E2CBA",
            fontFamily: "'Stack Sans Text', sans-serif",
            minWidth: "fit-content",
          }}
        >
          Meta
        </label>
        <input
          id="goal"
          type="number"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="0.00"
          step="0.01"
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            fontFamily: "'Stack Sans Text', sans-serif",
            fontSize: "14px",
            color: "#5E2CBA",
          }}
        />
      </div>

      {/* Create Button */}
      <div className="flex justify-center">
        <button
          onClick={handleCreateSlice}
          style={{
            backgroundColor: "#F0EE00",
            color: "#5E2CBA",
            width: "200px",
            height: "50px",
            borderRadius: "12px",
            fontSize: "18px",
            fontFamily: "'Stack Sans Headline', sans-serif",
            fontWeight: "600",
            border: "none",
            cursor: "pointer",
            transition: "transform 0.2s",
          }}
          className="hover:scale-105"
        >
          Crear Slice
        </button>
      </div>
    </div>
  )
}
