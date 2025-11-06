import React from "react"
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { X, Plus, GripVertical } from "lucide-react"
import { capitalize } from "@/lib/utils"

interface ListWithDragProps {
  path: string
  value: any
  field: any
  colSpan?: string | number
  rowSpan?: string | number
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
    <div
      className={`space-y-2 col-span-${colSpan} row-span-${rowSpan} w-full`}
    >
      {showLabel && (
        <div className="font-semibold text-sm sm:text-base break-words">
          {capitalize(displayName)}
        </div>
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId={`${path}-droppable`}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="space-y-3 max-h-[300px] overflow-y-auto "
            >
              {normalizedList.map((item, index) => (
                <Draggable
                  key={`${path}-${index}`}
                  draggableId={`${path}-${index}`}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:p-3 border rounded-lg bg-background/40 transition-all"
                    >
                      {/* Ícone de drag */}
                      <div
                        {...provided.dragHandleProps}
                        className="flex justify-center sm:justify-start"
                      >
                        <GripVertical className="h-5 w-5 text-gray-400 cursor-grab" />
                      </div>

                      {/* Botão de edição */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 min-w-0 truncate w-full sm:w-auto"
                          >
                            {field.options.map((opt: string) => item[opt])[0] ||
                              `Item ${index + 1}`}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="w-[95vw] sm:max-w-lg p-4">
                          <DialogTitle className="text-lg font-semibold mb-2">
                            Editar Item
                          </DialogTitle>
                          <div className="space-y-3">
                            {field.options.map((opt: string) => (
                              <div key={opt} className="flex flex-col">
                                <label className="text-xs mb-1 text-muted-foreground">
                                  {opt}
                                </label>
                                <Input
                                  value={item[opt]}
                                  onChange={(e) => {
                                    const newList = normalizedList.map((it, i) =>
                                      i === index
                                        ? { ...it, [opt]: e.target.value }
                                        : it
                                    )
                                    updateValue(path, newList)
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                        </DialogContent>
                      </Dialog>

                      {/* Botão de remover */}
                      <div className="flex justify-center sm:justify-end w-full sm:w-auto">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="w-full sm:w-12 h-10"
                          onClick={() => {
                            const newList = normalizedList.filter(
                              (_, i) => i !== index
                            )
                            updateValue(path, newList)
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}

              {provided.placeholder}

              {/* Botão de adicionar novo item */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto"
                  onClick={() => {
                    const emptyItem = field.options.reduce(
                      (acc: any, opt: string) => {
                        acc[opt] = ""
                        return acc
                      },
                      {}
                    )
                    updateValue(path, [...normalizedList, emptyItem])
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar
                </Button>
              </div>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )
}
