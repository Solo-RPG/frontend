import React from "react"
import { DragDropContext, Droppable, Draggable, DropResult }  from "@hello-pangea/dnd"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { X, Plus, GripVertical } from "lucide-react"
import { capitalize } from "@/lib/utils"

interface ListWithDragProps {
  path: string
  value: any
  field: any
  colSpan?: number
  rowSpan?: number
  showLabel?: boolean
  displayName?: string
  updateValue: (path: string, value: any) => void
}

export function ListField({
  path,
  value,
  field,
  colSpan = 1,
  rowSpan = 1,
  showLabel = true,
  displayName = "",
  updateValue,
}: ListWithDragProps) {
  const listValue = Array.isArray(value) ? value : []

  const ensureItemShape = (item: any) => {
    const obj = typeof item === "object" && item !== null ? { ...item } : {}
    field.options.forEach((opt: string) => {
      if (!(opt in obj)) obj[opt] = ""
    })
    return obj
  }

  const normalizedList = listValue.map(ensureItemShape)

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result
    if (!destination) return
    if (source.index === destination.index) return

    const reordered = Array.from(normalizedList)
    const [removed] = reordered.splice(source.index, 1)
    reordered.splice(destination.index, 0, removed)
    updateValue(path, reordered)
  }

  return (
    <div className={`space-y-2 col-span-${colSpan} row-span-${rowSpan}`}>
      {showLabel && <div className="font-semibold">{capitalize(displayName)}</div>}

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId={`${path}-droppable`}>
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-4">
              {normalizedList.map((item, index) => (
                <Draggable key={`${path}-${index}`} draggableId={`${path}-${index}`} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="flex overflow-x-auto gap-3 items-end p-2 border rounded-lg bg-background/40"
                    >
                      <div {...provided.dragHandleProps}>
                        <GripVertical className="h-4 w-4 mb-3 text-gray-400 cursor-grab" />
                      </div>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="w-full">
                            {field.options.map((opt: string) => item[opt])[0] || `Item ${index + 1}`}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg">
                          {field.options.map((opt: string) => (
                            <div key={opt} className="flex flex-col">
                              <DialogTitle>
                                <div className="text-xs mb-1">{opt}</div>
                              </DialogTitle>
                              <Input
                                value={item[opt]}
                                className="mt-2"
                                onChange={(e) => {
                                  const newList = normalizedList.map((it, i) =>
                                    i === index ? { ...it, [opt]: e.target.value } : it
                                  )
                                  updateValue(path, newList)
                                }}
                              />
                            </div>
                          ))}
                        </DialogContent>
                      </Dialog>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-12 h-10"
                        onClick={() => {
                          const newList = normalizedList.filter((_, i) => i !== index)
                          updateValue(path, newList)
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const emptyItem = field.options.reduce((acc: any, opt: string) => {
                    acc[opt] = ""
                    return acc
                  }, {})
                  updateValue(path, [...normalizedList, emptyItem])
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Adicionar
              </Button>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )
}
