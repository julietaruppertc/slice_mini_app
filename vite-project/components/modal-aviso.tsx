"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface ModalContextType {
  showModal: boolean
  message: string
  showSuccessModal: (message: string) => void
  hideSuccessModal: () => void
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

export function ModalProvider({ children }: { children: ReactNode }) {
  const [showModal, setShowModal] = useState(false)
  const [message, setMessage] = useState("")

  const showSuccessModal = (msg: string) => {
    setMessage(msg)
    setShowModal(true)
    setTimeout(() => setShowModal(false), 2000)
  }

  const hideSuccessModal = () => setShowModal(false)

  return (
    <ModalContext.Provider value={{ showModal, message, showSuccessModal, hideSuccessModal }}>
      {children}
    </ModalContext.Provider>
  )
}

export function useModal() {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error("useModal must be used within ModalProvider")
  }
  return context
}

export function ModalAviso() {
  const { showModal, message } = useModal()

  if (!showModal) return null

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "16px",
          padding: "32px",
          textAlign: "center",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
          maxWidth: "300px",
          animation: "slideUp 0.3s ease-out",
        }}
      >
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>✓</div>
        <h2
          style={{
            fontSize: "24px",
            color: "#5E2CBA",
            fontFamily: "'Stack Sans Headline', sans-serif",
            fontWeight: "bold",
            marginBottom: "8px",
          }}
        >
          ¡Éxito!
        </h2>
        <p
          style={{
            fontSize: "16px",
            color: "#806CF2",
            fontFamily: "'Stack Sans Text', sans-serif",
          }}
        >
          {message}
        </p>
        <style>{`
          @keyframes slideUp {
            from {
              transform: translateY(20px);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
        `}</style>
      </div>
    </div>
  )
}
