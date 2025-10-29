import { useState } from "react";

interface ColorCircleProps {
  onToggle?: (value: boolean) => void;
}

export default function ColorCircle({ onToggle }: ColorCircleProps) {
  const [active, setActive] = useState(false);

  const toggle = () => {
    const newValue = !active;
    setActive(newValue);
    onToggle?.(newValue);
  };

  return (
    <div
      onClick={toggle}
      className={`
        w-16 h-16 rounded-full cursor-pointer transition-colors
        ${active ? "bg-green-500" : "bg-red-500"}
      `}
    />
  );
}
