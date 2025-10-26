"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Plus, Trash, ChevronDown, ChevronUp, GripVertical, Edit } from "lucide-react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { updateTemplate } from "@/lib/service/templates-service"
import { toast } from "sonner"
import { redirect } from "next/dist/server/api-utils"

const exampleTemplate = {
  "id": "8160f351-d6f0-4bc1-b372-70cda6ae4242",
  "system_name": "RPG Medieval",
  "version": "1.0",
  "fields": [
    {
      "name": "Informações",
      "type": "object",
      "required": false,
      "default_value": null,
      "flex": "cols-3",
      "span": "2",
      "fields": [
        {
          "name": "Raça",
          "type": "string",
          "required": false,
          "default_value": null
        },
        {
          "name": "Classe",
          "type": "string",
          "required": false,
          "default_value": "Guerreiro",
          "options": [
            "Bárbaro", "Bardo", "Bruxo", "Clérigo", "Druida",
            "Escudeiro", "Feiticeiro", "Guerreiro", "Ladino",
            "Mago", "Monge", "Paladino", "Patrulheiro"
          ]
        },
        {
          "name": "Level",
          "type": "number",
          "required": false,
          "default_value": null
        }
      ]
    },
    {
      "name": "Atributos",
      "type": "object",
      "required": false,
      "flex": "cols-3",
      "fields": [
        {
          "name": "Força",
          "type": "object",
          "flex": "row-2",
          "fields": [
            {
              "name": "Valor",
              "type": "string"
            },
            {
              "name": "Bônus",
              "type": "string"
            }
          ]
        },
        {
          "name": "Destreza",
          "type": "object",
          "flex": "row-2",
          "fields": [
            {
              "name": "Valor",
              "type": "string"
            },
            {
              "name": "Bônus",
              "type": "string"
            }
          ]
        }
      ]
    }
  ]
}

interface props {
  templateJson: any
}

type TemplateEditorModalProps = {
  templateJson: any
}

function TemplateEditorModal({ templateJson }: TemplateEditorModalProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    system_name: "",
    version: "1.0",
    fields: [] as any[]
  })
  const [expandedFields, setExpandedFields] = useState(new Set())

  useEffect(() => {
    if (!templateJson) return

    const addIdsToFields = (fields ) => {
      return fields.map((field, idx) => ({
        ...field,
        id: field.id || `field-${Date.now()}-${idx}`,
        fields: field.fields ? addIdsToFields(field.fields) : []
      }))
    }

    setFormData({
      system_name: templateJson.system_name || "",
      version: templateJson.version || "1.0",
      fields: addIdsToFields(templateJson.fields || [])
    })
  }, [templateJson])

  const updateField = (path, value) => {
    setFormData(prev => {
      const newData = JSON.parse(JSON.stringify(prev))
      const keys = path.split('.')
      let current = newData
      
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i]
        if (key.includes('[')) {
          const arrayKey = key.substring(0, key.indexOf('['))
          const index = parseInt(key.match(/\[(\d+)\]/)[1])
          current = current[arrayKey][index]
        } else {
          current = current[key]
        }
      }
      
      const lastKey = keys[keys.length - 1]
      current[lastKey] = value
      
      return newData
    })
  }

  const addNewField = () => {
    setFormData(prev => ({
      ...prev,
      fields: [...prev.fields, {
        id: `field-${Date.now()}`,
        name: "",
        type: "string",
        required: false
      }]
    }))
  }

  const removeField = (index) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.filter((_, i) => i !== index)
    }))
  }

  const moveField = (fromIndex, toIndex) => {
    setFormData(prev => {
      const newFields = [...prev.fields]
      const [moved] = newFields.splice(fromIndex, 1)
      newFields.splice(toIndex, 0, moved)
      return { ...prev, fields: newFields }
    })
  }

  const addNestedField = (parentPath) => {
    const newField = {
      id: `nested-${Date.now()}`,
      name: "",
      type: "string",
      required: false
    }
    
    setFormData(prev => {
      const newData = JSON.parse(JSON.stringify(prev))
      const keys = parentPath.split('.')
      let current = newData
      
      for (const key of keys) {
        if (key.includes('[')) {
          const arrayKey = key.substring(0, key.indexOf('['))
          const index = parseInt(key.match(/\[(\d+)\]/)[1])
          current = current[arrayKey][index]
        } else {
          current = current[key]
        }
      }
      
      current.fields = [...(current.fields || []), newField]
      return newData
    })
  }

  const removeNestedField = (parentPath, index) => {
    setFormData(prev => {
      const newData = JSON.parse(JSON.stringify(prev))
      const keys = parentPath.split('.')
      let current = newData
      
      for (const key of keys) {
        if (key.includes('[')) {
          const arrayKey = key.substring(0, key.indexOf('['))
          const idx = parseInt(key.match(/\[(\d+)\]/)[1])
          current = current[arrayKey][idx]
        } else {
          current = current[key]
        }
      }
      
      current.fields = current.fields.filter((_, i) => i !== index)
      return newData
    })
  }

  const toggleExpanded = (id) => {
    setExpandedFields(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) newSet.delete(id)
      else newSet.add(id)
      return newSet
    })
  }

  const handleSave = () => {
    updateTemplate(templateData.id, formData)
    console.log("Dados salvos:", formData)
    alert("Template atualizado com sucesso!")
    setOpen(false)
  }

  const getFieldValue = (path) => {
    const keys = path.split('.')
    let current = formData
    
    for (const key of keys) {
      if (key.includes('[')) {
        const arrayKey = key.substring(0, key.indexOf('['))
        const index = parseInt(key.match(/\[(\d+)\]/)[1])
        current = current[arrayKey][index]
      } else {
        current = current[key]
      }
    }
    
    return current
  }

  const renderField = (field, index, path, isNested = false, provided = null) => {
    const fieldId = `${path}-${index}`
    const isExpanded = expandedFields.has(fieldId)
    const currentPath = path ? `${path}.fields[${index}]` : `fields[${index}]`
    const fieldType = getFieldValue(`${currentPath}.type`)

    return (
      <div key={field.id} className={`border rounded-lg p-4 bg-white shadow-sm ${isNested ? 'ml-6 mt-2' : ''}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            {!isNested && provided && (
              <div {...provided.dragHandleProps}>
                <GripVertical className="h-4 w-4 text-gray-400 cursor-grab" />
              </div>
            )}
            <button
              type="button"
              onClick={() => toggleExpanded(fieldId)}
              className="font-medium flex items-center hover:text-purple-600"
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4 mr-1" />
              ) : (
                <ChevronDown className="h-4 w-4 mr-1" />
              )}
              {isNested ? 'Subcampo' : 'Campo'} {index + 1}: {field.name || "Sem nome"}
            </button>
          </div>
          <button
            type="button"
            onClick={() => {
              if (isNested) {
                const parentPath = path
                removeNestedField(parentPath, index)
              } else {
                removeField(index)
              }
            }}
            className="text-red-500 hover:text-red-700"
          >
            <Trash className="h-4 w-4" />
          </button>
        </div>

        {isExpanded && (
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <Label>Nome do Campo</Label>
              <Input
                placeholder="Ex: nome, raça, nível"
                value={field.name || ''}
                onChange={(e) => updateField(`${currentPath}.name`, e.target.value)}
              />
            </div>

            <div>
              <Label>Tipo</Label>
              <Select
                value={fieldType}
                onValueChange={(value) => updateField(`${currentPath}.type`, value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="string">Texto</SelectItem>
                  <SelectItem value="number">Número</SelectItem>
                  <SelectItem value="boolean">Verdadeiro/Falso</SelectItem>
                  <SelectItem value="object">Objeto (Grupo de campos)</SelectItem>
                  <SelectItem value="objectlist">Lista de Objetos</SelectItem>
                  <SelectItem value="list">Lista</SelectItem>
                  <SelectItem value="textarea">Área de Texto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Flex (Layout)</Label>
              <Input
                placeholder="Ex: cols-3, row-2"
                value={field.flex || ''}
                onChange={(e) => updateField(`${currentPath}.flex`, e.target.value)}
              />
            </div>

            <div>
              <Label>Span (Largura)</Label>
              <Input
                placeholder="Ex: 2"
                value={field.span || ''}
                onChange={(e) => updateField(`${currentPath}.span`, e.target.value)}
              />
            </div>

            {(fieldType === "string" || fieldType === "number") && (
              <div>
                <Label>Valor Padrão</Label>
                <Input
                  placeholder={fieldType === "number" ? "Ex: 10" : "Ex: Guerreiro"}
                  value={field.default_value || ''}
                  onChange={(e) => updateField(`${currentPath}.default_value`, e.target.value)}
                />
              </div>
            )}

            {(fieldType === "string" || fieldType === "list") && (
              <div className="col-span-2">
                <Label>Opções (uma por linha)</Label>
                <Textarea
                  placeholder="Humano&#10;Elfo&#10;Anão&#10;..."
                  value={Array.isArray(field.options) ? field.options.join("\n") : ""}
                  onChange={(e) => {
                    const options = e.target.value
                      .split("\n")
                      .filter(opt => opt.trim())
                    updateField(`${currentPath}.options`, options.length > 0 ? options : null)
                  }}
                  rows={3}
                />
              </div>
            )}

            {(fieldType === "object" || fieldType === "objectlist") && (
              <div className="col-span-2">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-medium">Campos do Objeto</h4>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => addNestedField(currentPath)}
                  >
                    <Plus className="mr-2 h-3 w-3" />
                    Adicionar Campo
                  </Button>
                </div>

                {field.fields && field.fields.map((nestedField, nestedIndex) => (
                  renderField(nestedField, nestedIndex, currentPath, true)
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  const onDragEnd = (result) => {
    if (!result.destination) return
    moveField(result.source.index, result.destination.index)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Edit className="mr-2 h-4 w-4" />
          Editar Template
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Template</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Nome do Sistema</Label>
              <Input
                placeholder="Ex: RPG Medieval"
                value={formData.system_name}
                onChange={(e) => updateField('system_name', e.target.value)}
              />
            </div>
            <div>
              <Label>Versão</Label>
              <Input
                placeholder="Ex: 1.0"
                value={formData.version}
                onChange={(e) => updateField('version', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Campos do Template</h3>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="fields">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                    {formData.fields.map((field, index) => (
                      <Draggable key={field.id} draggableId={field.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                          >
                            {renderField(field, index, '', false, provided)}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>

            <Button
              type="button"
              variant="outline"
              onClick={addNewField}
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Campo
            </Button>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="button" onClick={handleSave}>
              Salvar Alterações
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default TemplateEditorModal