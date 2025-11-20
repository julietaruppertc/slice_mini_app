"use client"

import { useRouter, useParams } from "next/navigation"
import { useSlices, type Slice, type Transaction } from "@/lib/store"
import { useEffect, useState } from "react"

export default function InfoSlice() {
  const router = useRouter()
  const params = useParams()
  const { slices } = useSlices()
  const [currentSlice, setCurrentSlice] = useState<Slice | undefined>(undefined)
  const sliceId = params.id as string

  useEffect(() => {
    if (sliceId && slices.length > 0) {
      const found = slices.find((s: Slice) => s.id === sliceId)
      setCurrentSlice(found)
    }
  }, [sliceId, slices])

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp)
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (!currentSlice) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#806CF2",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontFamily: "'Stack Sans Text', sans-serif",
        }}
      >
        No se encontró el slice
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4" style={{ backgroundColor: "#806CF2" }}>
      {/* Info Container */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "16px",
          padding: "20px",
          marginBottom: "16px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            fontSize: "18px",
            color: "#806CF2",
            fontFamily: "'Stack Sans Text', sans-serif",
            marginBottom: "8px",
          }}
        >
          {currentSlice.name}
        </div>
        <div
          style={{
            fontSize: "36px",
            color: "#5E2CBA",
            fontFamily: "'Stack Sans Text', sans-serif",
            fontWeight: "bold",
          }}
        >
          {currentSlice.amount} {currentSlice.currency}
        </div>
      </div>

      {/* Goal Progress Container */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "16px",
          padding: "16px",
          marginBottom: "24px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <div
            style={{
              fontSize: "18px",
              color: "#806CF2",
              fontFamily: "'Stack Sans Text', sans-serif",
              fontWeight: "600",
            }}
          >
            {Math.round((currentSlice.amount / currentSlice.goal) * 100)}%
          </div>
          <div style={{ fontSize: "18px", color: "#5E2CBA", fontFamily: "'Stack Sans Text', sans-serif" }}>
            Meta: {currentSlice.goal} {currentSlice.currency}
          </div>
        </div>
        <div
          style={{
            backgroundColor: "#E8E8E8",
            borderRadius: "8px",
            height: "8px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              backgroundColor: "#5E2CBA",
              height: "100%",
              width: `${Math.min((currentSlice.amount / currentSlice.goal) * 100, 100)}%`,
              transition: "width 0.3s",
            }}
          ></div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginBottom: "24px" }}>
        <button
          onClick={() => router.push(`/depositar/${currentSlice.id}`)}
          style={{
            backgroundColor: "#F0EE00",
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "28px",
            transition: "transform 0.2s",
          }}
          className="hover:scale-110"
          title="Ingresar dinero"
        >
          ⬇️
        </button>
        <button
          onClick={() => router.push(`/retirar/${currentSlice.id}`)}
          style={{
            backgroundColor: "white",
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "28px",
            transition: "transform 0.2s",
          }}
          className="hover:scale-110"
          title="Retirar dinero"
        >
          ⬆️
        </button>
        <button
          onClick={() => router.push(`/editar/${currentSlice.id}`)}
          style={{
            backgroundColor: "white",
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "28px",
            transition: "transform 0.2s",
          }}
          className="hover:scale-110"
          title="Editar"
        >
          ✏️
        </button>
      </div>

      {/* Transaction history section */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "16px",
          padding: "16px",
          marginBottom: "16px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          maxHeight: "300px",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            fontSize: "18px",
            color: "#5E2CBA",
            fontFamily: "'Stack Sans Headline', sans-serif",
            fontWeight: "600",
            marginBottom: "12px",
          }}
        >
          Historial de Transacciones
        </div>

        {currentSlice.transactions && currentSlice.transactions.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {currentSlice.transactions.map((transaction: Transaction) => (
              <div
                key={transaction.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px",
                  backgroundColor: "#F5F5F5",
                  borderRadius: "8px",
                  borderLeft: `4px solid ${transaction.type === "deposit" ? "#5E2CBA" : "#F0EE00"}`,
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: "14px",
                      color: "#5E2CBA",
                      fontFamily: "'Stack Sans Headline', sans-serif",
                      fontWeight: "600",
                    }}
                  >
                    {transaction.type === "deposit" ? "➕ Ingreso" : "➖ Retiro"}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#806CF2",
                      fontFamily: "'Stack Sans Text', sans-serif",
                      marginTop: "4px",
                    }}
                  >
                    {formatDate(transaction.date)}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: "16px",
                    color: transaction.type === "deposit" ? "#5E2CBA" : "#F0EE00",
                    fontFamily: "'Stack Sans Headline', sans-serif",
                    fontWeight: "bold",
                    textAlign: "right",
                  }}
                >
                  {transaction.type === "deposit" ? "+" : "-"}
                  {transaction.amount} {currentSlice.currency}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              textAlign: "center",
              color: "#806CF2",
              fontFamily: "'Stack Sans Text', sans-serif",
              padding: "20px 0",
            }}
          >
            No hay transacciones registradas
          </div>
        )}
      </div>

      <div style={{ textAlign: "center", marginTop: "24px" }}>
        <button
          onClick={() => router.push("/inicio")}
          style={{
            backgroundColor: "rgba(255,255,255,0.3)",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontFamily: "'Stack Sans Text', sans-serif",
          }}
        >
          Volver
        </button>
      </div>
    </div>
  )
}
