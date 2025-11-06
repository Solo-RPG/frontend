"use client";

import { useEffect, useRef } from "react";
import { Label } from "@/components/ui/label";
import { FieldDefinition } from "../forms/dynamic-form-renderer";

export default function TextareaField({
  path,
  field,
  value,
  displayName,
  updateValue,
  showLabel,
  colSpan,
  rowSpan,
}: {
  path: string;
  field: FieldDefinition;
  value: unknown;
  displayName: string;
  updateValue: (path: string, value: unknown) => void;
  showLabel?: boolean;
  colSpan?: string;
  rowSpan?: string;
}) {
  const ref = useRef<HTMLTextAreaElement | null>(null);
  const isTouch = typeof window !== "undefined" && "ontouchstart" in window;

  /* Restore saved height (desktop only) */
  useEffect(() => {
    if (isTouch) return; // skip mobile

    const savedHeight = localStorage.getItem(`ta-h-${path}`);
    if (ref.current && savedHeight) {
      ref.current.style.height = savedHeight;
    }
  }, [path, isTouch]);

  /* Desktop → Persist textarea height */
  const saveHeight = () => {
    if (isTouch) return;
    if (!ref.current) return;
    localStorage.setItem(`ta-h-${path}`, ref.current.style.height);
  };

  /* Mobile → Auto-grow */
  const autoGrow = () => {
    if (!ref.current) return;
    if (!isTouch) return; // desktop keeps manual resize
    ref.current.style.height = "auto";
    ref.current.style.height = `${ref.current.scrollHeight}px`;
  };

  return (
    <div
      key={path}
      className={`space-y-2 col-span-${colSpan} row-span-${rowSpan}`}
    >
      {showLabel && <Label htmlFor={path}>{displayName}</Label>}

      <textarea
        id={path}
        ref={ref}
        value={(value as string) ?? ""}
        onChange={(e) => {
          updateValue(path, e.target.value);
          autoGrow(); // only mobile
        }}
        onMouseUp={saveHeight} // desktop
        placeholder={`Digite ${displayName}`}
        required={field.required}
        className={`
          w-full text-xs bg-background border-input border rounded-md p-2 
          focus:ring-2 focus:ring-ring focus:outline-none

          ${isTouch ? "resize-none" : "resize-y"}
        `}
        rows={4}
      />
    </div>
  );
}
