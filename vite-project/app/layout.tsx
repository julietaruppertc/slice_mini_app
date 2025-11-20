import type React from "react"
import type { Metadata } from "next"
import { SliceProvider } from "@/lib/store"
import { ModalProvider, ModalAviso } from "@/components/modal-aviso"
import "./globals.css"

export const metadata: Metadata = {
  title: "Crear Slice",
  description: "Manage your cryptocurrency slices",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        <SliceProvider>
          <ModalProvider>
            {children}
            <ModalAviso />
          </ModalProvider>
        </SliceProvider>
      </body>
    </html>
  )
}
