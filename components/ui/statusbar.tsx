import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { set } from "date-fns"

interface StatusBarProps {
  label: string
  value: number
  max: number
  onChange1: (newValue: number) => void
  onChange2: (newMax: number) => void
  color?: string
}

export function StatusBar({ label, value, max, onChange1, onChange2, color }: StatusBarProps) {
  const percentage = Math.min((value / max) * 100, 100)
  const barColor = color || "red"

  return (
    <div className="space-y-1 text-center">
      <Label className="text-xs tracking-wide uppercase text-muted-foreground">{label}</Label>

      <div className="relative w-full bg-zinc-900 rounded-md overflow-hidden">
        <div
          className={`absolute left-0 top-0 h-full bg-${barColor}-600 transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />

        {/* Conteúdo principal */}
        <div className="relative flex items-center justify-between px-2 py-1 text-white text-sm font-medium select-none">
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 text-white hover:bg-transparent hover:text-gray-300"
              onClick={() => onChange1(Math.max(0, value - 5))}
            >
              <ChevronsLeft size={14} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 text-white hover:bg-transparent hover:text-gray-300"
              onClick={() => onChange1(Math.max(0, value - 1))}
            >
              <ChevronLeft size={14} />
            </Button>
          </div>

          <span className="z-10 flex flex-row">
            
            <Input
              className="bg-transparent w-14 h-2 mr-4 text-center border-transparent"
              type="string"
              value={value}
              min={0}
              onChange={(e) => {
                const newVal = Number(e.target.value)
                onChange1(newVal)
              }}
            />
            /
            <Input
              className="bg-transparent w-14 h-2 ml-4 text-center border-transparent "
              type="string"
              value={max}
              min={0}
              onChange={(d) => {
                const val = Number(d.target.value)
                onChange2(val)
              }}
            />
            
            
          </span>

          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 text-white hover:bg-transparent hover:text-gray-300"
              onClick={() => onChange1(Math.min(max, value + 1))}
            >
              <ChevronRight size={14} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 text-white hover:bg-transparent hover:text-gray-300"
              onClick={() => onChange1(Math.min(max, value + 5))}
            >
              <ChevronsRight size={14} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
