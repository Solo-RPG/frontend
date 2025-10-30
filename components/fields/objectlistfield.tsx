import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  SortableContext,
  useSortable,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { X, Plus, GripVertical } from "lucide-react"
import { capitalize } from "@/lib/utils"

export function ObjectListField({
  path,
  value,
  field,
  colSpan = 1,
  rowSpan = 1,
  showLabel = true,
  displayName = "",
  updateValue,
}: {
  path: string
  value: any
  field: any
  colSpan?: number
  rowSpan?: number
  showLabel?: boolean
  displayName?: string
  updateValue: (path: string, value: any) => void
}) {
  const listValue = Array.isArray(value) ? value : []

  const ensureItemShape = (item: any) => {
    const obj = typeof item === "object" && item !== null ? { ...item } : {}
    field.fields.forEach((subField: any) => {
      if (!(subField.name in obj)) obj[subField.name] = ""
    })
    return obj
  }

  const normalizedList = listValue.map(ensureItemShape)
  const sensors = useSensors(useSensor(PointerSensor))

  const handleDragEnd = (event: any) => {
    const { active, over } = event
    if (!over) return
    if (active.id !== over.id) {
      const oldIndex = normalizedList.findIndex((_, i) => i.toString() === active.id)
      const newIndex = normalizedList.findIndex((_, i) => i.toString() === over.id)
      const reordered = arrayMove(normalizedList, oldIndex, newIndex)
      updateValue(path, reordered)
    }
  }

  return (
    <div key={path} className={`space-y-2 col-span-${colSpan} row-span-${rowSpan}`}>
      {showLabel && <Label>{capitalize(displayName)}</Label>}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={normalizedList.map((_, i) => i.toString())}
          strategy={rectSortingStrategy} // ← permite mover horizontal e vertical ao mesmo tempo
        >
          <div className={`grid grid-cols-${field.cols} gap-4`}>
            {normalizedList.map((item, index) => (
              <SortableCard
                key={index.toString()}
                id={index.toString()}
                item={item}
                index={index}
                field={field}
                normalizedList={normalizedList}
                path={path}
                updateValue={updateValue}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => {
          const emptyItem = field.fields.reduce((acc: any, subField: any) => {
            acc[subField.name] = ""
            return acc
          }, {})
          updateValue(path, [...normalizedList, emptyItem])
        }}
      >
        <Plus className="mr-2 h-4 w-4" />
        Adicionar
      </Button>
    </div>
  )
}

function SortableCard({ id, item, index, field, path, normalizedList, updateValue }: any) {
  const { attributes, listeners, setNodeRef, transform, transition, isSorting } = useSortable({ id, transition: {
    duration: 150,
    easing: 'ease-out',
  }})

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isSorting ? transition : undefined, 
    zIndex: isSorting ? 999 : "auto",
  }

  return (
    <Card ref={setNodeRef} style={style} className="border p-4 relative cursor-default">
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 p-1 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
      >
        <GripVertical className="h-4 w-4 mb-3 text-gray-400 cursor-grab" />
      </div>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="absolute top-2 right-2 z-10"
        onClick={(e) => {
          e.stopPropagation()
          const newList = normalizedList.filter((_, i) => i !== index)
          updateValue(path, newList)
        }}
      >
        <X className="h-4 w-4" />
      </Button>

      <div className="grid gap-4 md:grid-cols-2 mt-6">
        {field.fields.map((subField: any) => (
          <div key={subField.name} className={`col-span-${subField.span}`}>
            <Label className="text-xs mb-1">{capitalize(subField.name)}</Label>
            {subField.type === "string" ? (
              <Input
                value={item[subField.name]}
                onChange={(e) => {
                  const newList = normalizedList.map((it, i) =>
                    i === index ? { ...it, [subField.name]: e.target.value } : it
                  )
                  updateValue(path, newList)
                }}
              />
            ) : (
              <Textarea
                value={item[subField.name]}
                onChange={(e) => {
                  const newList = normalizedList.map((it, i) =>
                    i === index ? { ...it, [subField.name]: e.target.value } : it
                  )
                  updateValue(path, newList)
                }}
              />
            )}
          </div>
        ))}
      </div>
    </Card>
  )
}

