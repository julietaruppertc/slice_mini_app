"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useSlices, type Slice } from "@/lib/store"

export default function Editar() {
  const router = useRouter()
  const params = useParams()
  const { slices, updateSlice } = useSlices()
  const sliceId = params.id as string

  const slice = slices.find((s: Slice) => s.id === sliceId)
  const [name, setName] = useState("")
  const [goal, setGoal] = useState("")

  useEffect(() => {
    if (slice) {
      setName(slice.name)
      setGoal(slice.goal.toString())
    }
  }, [slice])

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !goal || Number.parseFloat(goal) <= 0) {
      alert("Por favor completa todos los campos correctamente")
      return
    }

    if (!slice) return

    updateSlice(slice.id, {
      ...slice,
      name,
      goal: Number.parseFloat(goal),
    })

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
        Editar Slice
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
          maxWidth: "400px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <label
          htmlFor="name"
          style={{
            fontSize: "16px",
            color: "#5E2CBA",
            fontFamily: "'Stack Sans Text', sans-serif",
            minWidth: "fit-content",
          }}
        >
          Nombre
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          id="name"
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
          maxWidth: "400px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <label
          htmlFor="goal"
          style={{
            fontSize: "16px",
            color: "#5E2CBA",
            fontFamily: "'Stack Sans Text', sans-serif",
            minWidth: "fit-content",
          }}
        >
          Meta
        </label>
        <input
          type="number"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          step="0.01"
          id="goal"
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            fontFamily: "'Stack Sans Text', sans-serif",
            fontSize: "14px",
            color: "#5E2CBA",
          }}
        />
        <span style={{ fontSize: "14px", color: "#5E2CBA", fontFamily: "'Stack Sans Text', sans-serif" }}>
          {slice.currency}
        </span>
      </div>

      <div style={{ display: "flex", gap: "12px", justifyContent: "center", maxWidth: "400px", margin: "0 auto" }}>
        <button
          onClick={handleEdit}
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
          Guardar cambios
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
