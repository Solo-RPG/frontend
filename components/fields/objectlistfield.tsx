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
import StatusCustoField from "./statuscustofield"

export function ObjectListField({
  path,
  value,
  field,
  colSpan = 1,
  rowSpan = 1,
  showLabel = true,
  displayName = "",
  updateValue,
  getValue,
  getAllStatus
}: {
  path: string
  value: any
  field: any
  colSpan?: number | string
  rowSpan?: number | string
  showLabel?: boolean
  displayName?: string
  updateValue: (path: string, value: any) => void
  getValue?: (path: string) => unknown
  getAllStatus?: () => string[]
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
    <div key={path} className={`space-y-2 col-span-${colSpan} row-span-${rowSpan} w-full`}>
      {showLabel && (
        <Label className="font-semibold text-sm sm:text-base">
          {capitalize(displayName)}
        </Label>
      )}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={normalizedList.map((_, i) => i.toString())}
          strategy={rectSortingStrategy}
        >
          {/* Grid ajustável */}
          <div
            className={`
              grid gap-4
              grid-cols-1
              sm:grid-cols-2
              md:grid-cols-${field.cols || 3}
            `}
          >
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
                getValue={getValue}
                getAllStatus={getAllStatus}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Botão adicionar */}
      <div className="pt-2 flex flex-col sm:flex-row gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full sm:w-auto"
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
    </div>
  )
}

function SortableCard({ id, item, index, field, path, normalizedList, updateValue, getValue, getAllStatus }: any) {
  const { attributes, listeners, setNodeRef, transform, transition, isSorting } = useSortable({
    id,
    transition: {
      duration: 150,
      easing: "ease-out",
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isSorting ? transition : undefined,
    zIndex: isSorting ? 999 : "auto",
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="border p-4 relative cursor-default w-full shadow-sm"
    >
      {/* Ícone de drag */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 p-1 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
      >
        <GripVertical className="h-4 md:w-4 mb-3 text-gray-400 cursor-grab" />
      </div>

      {/* Botão remover */}
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

      {/* Conteúdo do card */}
      <div className="grid gap-4 grid-cols-2 mt-6 w-full">
        {field.fields.map((subField: any) => (
          <div key={subField.name} className={`col-span-${subField.span || 1}`}>
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
            ) : subField.type === "textarea" ? (
              <Textarea
                value={item[subField.name]}
                onChange={(e) => {
                  const newList = normalizedList.map((it, i) =>
                    i === index ? { ...it, [subField.name]: e.target.value } : it
                  )
                  updateValue(path, newList)
                }}
              />
            ) : subField.type === "statuscusto" ? (
              <StatusCustoField
                path={path}
                index={index}
                normalizedList={normalizedList}
                field={subField}
                getValue={getValue}
                updateValue={updateValue}
                displayName={subField.name}
                showLabel={false}
                getAllStatus={getAllStatus}
              />
            ) : null}
          </div>
        ))}
      </div>
    </Card>
  )
}
