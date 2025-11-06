import { useState } from "react";

interface ColorCircleProps {
  onToggle?: (value: boolean) => void;
  value: boolean;
}

export default function ColorCircle({ onToggle, value }: ColorCircleProps) {
  const [active, setActive] = useState(value);

  const toggle = () => {
    const newValue = !active;
    setActive(newValue);
    onToggle?.(newValue);
  };

  return (
    <div
      onClick={toggle}
      className={`
        w-16 h-16 rounded-full cursor-pointer hover:bg-zinc-600 hover:-translate-y-1 transition-transform transition-colors border-2 border-zinc-700
        ${active ? "bg-red-500" : "bg-transparent"}
      `}
    />
  );
}
