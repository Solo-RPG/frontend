import type React from "react"
import { MinimalSidebar } from "@/components/layout/minimal-sidebar"
import { useTheme } from "next-themes" // Adicionado para controle de tema

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Adicione esta linha se precisar acessar o tema atual
  // const { theme } = useTheme()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <MinimalSidebar />
      <div className="ml-16">
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              SOLO RPG
            </h1>
            {/* Adicione o ThemeToggle aqui se desejar */}
          </div>
        </header>
        <main className="p-6 bg-gray-50 dark:bg-gray-900">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}