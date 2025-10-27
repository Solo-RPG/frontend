"use client"

import { useState } from "react"

interface AttributeFieldProps {
  label: string
  value: number
  onChange: (value: number) => void
}

export default function AttributeField({ label, value, onChange }: AttributeFieldProps) {
  const modifier = Math.floor((value - 10) / 2)
  const modStr = modifier >= 0 ? `+${modifier}` : `${modifier}`

  const [hover, setHover] = useState(false)

  return (
    <div
      className="relative flex flex-col items-center justify-between w-24 h-32 border-4 border-black rounded-b-3xl bg-white"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Retângulo superior com o modificador */}
      <div className="w-full bg-blue-100 border-b-4 border-black text-center text-lg font-bold py-1">
        {modStr}
      </div>

      {/* Valor principal (editável) */}
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="text-3xl text-center font-bold bg-transparent w-full focus:outline-none"
      />

      {/* Label inferior */}
      <div className="text-sm font-extrabold uppercase tracking-wide mb-1">{label}</div>
    </div>
  )
}
