"use client"

import { useState } from "react"

interface AttributeFieldProps {
  className?: string
  label: string
  value: string
  bonus: string
  onChange: (value: string) => void
  onChangeBonus: (value: string) => void
}

export default function AttributeField({ className, label, value, bonus, onChange, onChangeBonus }: AttributeFieldProps) {
  const modifier = Math.floor((value - 10) / 2)

  const [hover, setHover] = useState(false)

  return (
    <div
      className={`h-36 w-full justify-self-center rounded-lg bg-card text-card-foreground shadow-sm border mt-4 items-start justify-items-center ${className}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="text-sm self-end font-semibold mt-2 uppercase tracking-wide text-foreground">
        {label}
      </div>
      {/* Retângulo superior com o modificador */}

      <input
        type="string"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-4xl text-center mt-2 font-bold mb-3 bg-transparent w-full focus:outline-none text-foreground"
      />

      <div className="w-full bg text-accent-foreground  text-center text-lg font-bold py-1">
       <input
        type="string"
        value={bonus}
        onChange={(e) => onChangeBonus(e.target.value)}
        className="text-2xl text-center text-gray-400 bg font-semibold bg-transparent w-full focus:outline-none text-foreground"
        />
      </div>

      {/* Label inferior */}
    </div>
  )
}
