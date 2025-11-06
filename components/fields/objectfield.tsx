import React from "react"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { capitalize } from "@/lib/utils"

interface ObjectWithFieldsProps {
  path: string
  field: any
  colSpan?: number | string
  rowSpan?: number | string
  showLabel?: boolean
  displayName?: string
  renderField: (key: string, subField: any, parentPath: string) => React.ReactNode
  flex?: number | string
  cols?: number | string
}

export function ObjectField({
  path,
  field,
  colSpan = 1,
  rowSpan = 1,
  showLabel = true,
  displayName = "",
  renderField,
  flex = 1,
  cols = 1,
}: ObjectWithFieldsProps) {
  if (!field.fields) return null

  const className = `md:grid-${flex}-${cols}`

  return (
    <Card
      className={`border mt-4 col-span-${colSpan} row-span-${rowSpan} w-full shadow-sm`}
    >
      <CardHeader className="pb-2">
        {showLabel && (
          <CardTitle className="text-base sm:text-lg font-semibold">
            <Label className="text-sm sm:text-base">
              {capitalize(displayName)}
            </Label>
          </CardTitle>
        )}
      </CardHeader>

      <CardContent className="space-y-4 w-full">
        <div className={`grid gap-2 md:gap-4 ${className} overflow-auto`}>
          {Object.entries(field.fields).map(([subKey, subField]) =>
            renderField(subKey, subField, path)
          )}
        </div>
      </CardContent>
    </Card>
  )
}
