"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function SheetTabs({ tabs, active, setActive }: {
  tabs: string[]
  active: string
  setActive: (tab: string) => void
}) {
  const currentIndex = tabs.findIndex(t => t === active)

  const prev = () => {
    const newIndex = (currentIndex - 1 + tabs.length) % tabs.length
    setActive(tabs[newIndex])
  }

  const next = () => {
    const newIndex = (currentIndex + 1) % tabs.length
    setActive(tabs[newIndex])
  }

  return (
    <div className="fixed top-[82%] z-[100] left-0 w-full flex justify-center py-3">
      <div className="flex items-center gap-4 px-4 py-2 rounded-xl bg-black/70">
        <button onClick={prev}>
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="flex gap-2">
          {tabs.map((t) => (
            <div
              key={t}
              className={`h-2 w-2 rounded-full ${
                active === t ? "bg-purple-400" : "bg-gray-500"
              }`}
            />
          ))}
        </div>

        <button onClick={next}>
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  )
}
