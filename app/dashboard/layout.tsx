"use client"

import type React from "react"
import { MinimalSidebar } from "@/components/layout/minimal-sidebar"
import { useTheme } from "next-themes" // Se quiser usar controle de tema global

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // const { theme } = useTheme() // Se quiser acessar o tema

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 flex">
      {/* Sidebar lateral (desktop) / Bottom bar (mobile) */}
      <MinimalSidebar />

      {/* Conteúdo principal */}
      <div className="flex-1 md:ml-16 pb-16 md:pb-0 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              SOLO RPG
            </h1>
            {/* 🔆 Adicione o ThemeToggle aqui se desejar */}
          </div>
        </header>

        {/* Main */}
        <main className="flex-1 sm:p-6 p-2 bg-gray-50 dark:bg-gray-900">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm sm:p-6 p-2 border border-gray-200 dark:border-gray-700">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
