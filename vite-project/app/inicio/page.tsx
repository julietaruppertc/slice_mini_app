"use client"

import { useRouter } from "next/navigation"
import { useSlices, type Slice } from "@/lib/store"

export default function Inicio() {
  const router = useRouter()
  const { slices } = useSlices()

  const handleNavigateToCreateSlice = () => {
    router.push("/crear-slice")
  }

  const handleNavigateToSliceInfo = (slice: Slice) => {
    router.push(`/info-slice/${slice.id}`)
  }

  return (
    <div className="min-h-screen p-4" style={{ backgroundColor: "#806CF2" }}>
      {/* Create Slice Button */}
      <div className="flex justify-center mb-8 mt-4">
        <button
          onClick={handleNavigateToCreateSlice}
          style={{
            backgroundColor: "#F0EE00",
            color: "#5E2CBA",
            width: "200px",
            height: "50px",
            borderRadius: "12px",
            fontSize: "20px",
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

      {/* Slices List */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          maxWidth: "100%",
        }}
      >
        {slices.map((slice) => (
          <button
            key={slice.id}
            onClick={() => handleNavigateToSliceInfo(slice)}
            style={{
              backgroundColor: "white",
              borderRadius: "16px",
              width: "100%",
              height: "164px",
              padding: "16px",
              border: "none",
              cursor: "pointer",
              display: "flex",
              flexDirection: "row",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              transition: "transform 0.2s",
            }}
            className="hover:scale-105"
          >
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div
                style={{
                  fontSize: "16px",
                  color: "#806CF2",
                  fontFamily: "'Stack Sans Text', sans-serif",
                  fontWeight: "500",
                }}
              >
                {slice.name}
              </div>
              <div
                style={{
                  fontSize: "40px",
                  color: "#5E2CBA",
                  fontFamily: "'Stack Sans Text', sans-serif",
                  fontWeight: "bold",
                }}
              >
                {slice.amount} {slice.currency}
              </div>
              <div style={{ fontSize: "12px", color: "#806CF2", fontFamily: "'Stack Sans Serif', sans-serif" }}>
                {Math.round((slice.amount / slice.goal) * 100)}% de la meta
              </div>
            </div>
            {slice.currency !== "ARS" && slice.currency !== "USD" && (
              <div
                style={{
                  fontSize: "18px",
                  color: "#5E2CBA",
                  fontFamily: "'Stack Sans Text', sans-serif",
                  marginLeft: "auto",
                  paddingLeft: "16px",
                }}
              >
                ≈ $23,120
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
