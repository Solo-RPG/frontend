import type React from "react"
import { MinimalSidebar } from "@/components/layout/minimal-sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <MinimalSidebar />
      <div className="ml-16">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-gray-900">RPG Character Manager</h1>
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
