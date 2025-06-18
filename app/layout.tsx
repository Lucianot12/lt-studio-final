import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "LT Studio Design - Architectural Innovation",
  description:
    "Innovative architectural design studio specializing in luxury residential, commercial, and landscape projects.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className} style={{ cursor: "none" }}>
        {children}
      </body>
    </html>
  )
}
