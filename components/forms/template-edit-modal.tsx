"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Plus, Trash, ChevronDown, ChevronUp, GripVertical, Edit, Clipboard, CheckCheck } from "lucide-react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { updateTemplate } from "@/lib/service/templates-service"
import { toast } from "@/hooks/use-toast"
import { authService } from "@/lib/service/auth-service"
import { redirect } from "next/navigation"
import { Checkbox } from "../ui/checkbox"
import OptionsEditor from "../fields/optionsfield"
import { capitalize } from "@/lib/utils"

type TemplateEditorModalProps = {
  templateJson: any
}

function TemplateEditorModal({ templateJson }: TemplateEditorModalProps) {
  const [formData, setFormData] = useState({
    id: "",
    system_name: "",
    owner_id: "",
    version: "1.0",
    cols: "2",
    status: [] as any[],
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
      id: templateJson.id || "",
      owner_id: authService.getUserInfo()?.id || templateJson.owner_id,
      system_name: templateJson.system_name || "",
      cols: templateJson.cols || "2",
      status: templateJson.status || [],
      version: templateJson.version || "1.0",
      fields: addIdsToFields(templateJson.fields || [])
    })
  }, [templateJson])

  const updateField = (path, value) => {
    setFormData(prev => {
      const newData = JSON.parse(JSON.stringify(prev))
      const keys = path.split('.')
      let current = newData

      // Navega até o campo alvo
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
      }],
    }))
  }

  const cloneField = (index) => {
    setFormData(prev => {
      const fieldToClone = prev.fields[index]
      const clonedField = {
        ...JSON.parse(JSON.stringify(fieldToClone)),
        id: `field-${Date.now()}`
      }

      return {
        ...prev,
        fields: [...prev.fields.slice(0, index + 1), clonedField, ...prev.fields.slice(index + 1)]
      }
    })
  }

  const cloneNestedField = (parentPath, fromIndex, toIndex) => {
    setFormData(prev => {
      const newData = JSON.parse(JSON.stringify(prev))
      const keys = parentPath.split('.')
      let current = newData

      for (const key of keys) {
        if (key.includes('[')) {
          const arrayKey = key.substring(0, key.indexOf('['))
          const index = parseInt(key.match(/\[(\d+)\]/)[1])
          current = current[arrayKey][index]
        }
        else {
          current = current[key]
        }
      }

      const fieldToClone = current.fields[fromIndex]
      const clonedField = {
        ...JSON.parse(JSON.stringify(fieldToClone)),
        id: `field-${Date.now()}`
      }
      current.fields.splice(toIndex + 1, 0, clonedField)
      return newData
    })
  }

  const removeField = (index) => {
    setFormData(prev => {
      const newData = {
        ...prev,
        fields: prev.fields.filter((_, i) => i !== index)
      }
      return newData
    })
  }

  const moveField = (fromIndex, toIndex) => {
    setFormData(prev => {
      const newFields = [...prev.fields]
      const [moved] = newFields.splice(fromIndex, 1)
      newFields.splice(toIndex, 0, moved)
      return { ...prev, fields: newFields }
    })
  }

  const moveNestedField = (parentPath, fromIndex, toIndex) => {
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
      
      const [moved] = current.fields.splice(fromIndex, 1)
      current.fields.splice(toIndex, 0, moved)
      return newData
    })
  }

  const addNestedField = (parentPath) => {
    const newField = {
      id: `nested-${Date.now()}`,
      name: " ",
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
    updateTemplate(formData.id, formData)
    console.log("Dados salvos:", formData)
    toast({
        title: "Template atualizado com sucesso!",
        description: "O template foi atualizado ao sistema."
      })
    redirect('/dashboard/templates')
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
      <div key={field.id} className={`border dark:border-gray-700 rounded-lg p-4 shadow-sm ${isNested ? 'ml-6 mt-2' : ''}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
     
              <div {...provided.dragHandleProps}>
                <GripVertical className="h-4 w-4 text-gray-400 cursor-grab" />
              </div>

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
              {isNested ? 'Subcampo' : 'Campo'} {index + 1}: {capitalize(field.name) || "Sem nome"}
            </button>
          </div>
          <div className="flex items-center gap-4 space-x-2">
            <button
              type="button"
              onClick={() => {isNested ? cloneNestedField(path, index, index) :
                cloneField(index)
              }}
            
            >
              <Clipboard className="h-4 w-4 text-gray-400 hover:text-gray-600" />
            </button>
            <button
              type="button"
              onClick={() => {
                isNested ? removeNestedField(path, index) : removeField(index)
              }}
              className="text-red-500 hover:text-red-700"
            >
              <Trash className="h-4 w-4" />
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <Label>Nome do Campo</Label>
              <Input
                placeholder="Ex: nome, raça, nível"
                value={capitalize(field.name) || ''}
                onChange={(e) => updateField(`${currentPath}.name`, e.target.value.toLowerCase())}
              />
            </div>

            <div className="mt-1 flex gap-4 flex-col">
              <Label>Revelar o Titulo</Label>
              <Checkbox
                checked={field.show_label}
                onCheckedChange={(checked) => updateField(`${currentPath}.show_label`, checked)}
                defaultChecked={true}
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
                  <SelectItem value="object">Grupo de Campos</SelectItem>
                  <SelectItem value="objectlist">Lista de Objetos</SelectItem>
                  <SelectItem value="list">Lista</SelectItem>
                  <SelectItem value="textarea">Área de Texto</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                  <SelectItem value="attribute">Atributo</SelectItem>
                  <SelectItem value="dadovida">Dado de Vida</SelectItem>
                  <SelectItem value="statuscusto">Custo de Status</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Largura do Campo (Quantas Colunas ocupa)</Label>
              <Input
                placeholder="Ex: 2"
                value={field.span || ''}
                min={1}
                max={formData.cols}
                onChange={(e) => updateField(`${currentPath}.span`, e.target.value)}
              />
            </div>

            <div>
              <Label>Altura do Campo (Quantas Linhas ocupa)</Label>
              <Input
                placeholder="Ex: 2"
                value={field.rows || ''}
                min={1}
                max={3}
                onChange={(e) => updateField(`${currentPath}.rows`, e.target.value)}
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
                <OptionsEditor
                  fieldType={fieldType}
                  field={field}
                  currentPath={currentPath}
                  updateField={updateField}
                />
          )}

          {(fieldType === "object" || fieldType === "objectlist") && (
            <div>
              <Label>Forma de Distribuição dos Objetos</Label>
              <Select
                value={field.flex}
                onValueChange={(value) => updateField(`${currentPath}.flex`, value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o layout" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem defaultChecked value="row">Linhas</SelectItem>
                  <SelectItem value="cols">Colunas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {field.flex === "cols" && (
            <div>
              <Label>Colunas</Label>
              <Input
                placeholder="Ex: 2, 3"
                value={field.cols || 1}
                min={1}
                max={6}
                onChange={(e) => updateField(`${currentPath}.cols`, e.target.value)}
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

              <DragDropContext onDragEnd={(result) => {
                if (!result.destination) return
                moveNestedField(currentPath, result.source.index, result.destination.index)
              }}>
                <Droppable droppableId={`nested-${fieldId}`}>
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                      {field.fields && field.fields.map((nestedField, nestedIndex) => (
                        <Draggable key={nestedField.id} draggableId={nestedField.id} index={nestedIndex}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                            >
                              {renderField(nestedField, nestedIndex, currentPath, true, provided)}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          )}

          {(fieldType === "status") && (
            <div>
              <Label>Cor (Em Inglês)</Label>
              <Select
                value={field.cor}
                onValueChange={
                  (value) => {
                    updateField(`${currentPath}.cor`, value)
                  }
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a cor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem defaultChecked value="red">Vermelho</SelectItem>
                  <SelectItem value="green">Verde</SelectItem>
                  <SelectItem value="blue">Azul</SelectItem>
                  <SelectItem value="yellow">Amarelo</SelectItem>
                  <SelectItem value="purple">Roxo</SelectItem>
                  <SelectItem value="pink">Rosa</SelectItem>
                  <SelectItem value="orange">Laranja</SelectItem>
                  <SelectItem value="cyan">Ciano</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}


          {(fieldType === "dadovida") && (
            <div>
              <Label>Quantidade de Dados de Vida</Label>
              <Input
                placeholder={"4, 8, 12, 16"}
                value={field.quantity || ''}
                onChange={(e) => updateField(`${currentPath}.quantity`, e.target.value)}
              />
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
            <div>
              <Label>Numero de Colunas da Pagina</Label>
              <Input
                placeholder="Ex: 2, 3"
                value={formData.cols}
                onChange={(e) => updateField('cols', e.target.value)}
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
            >
              Cancelar
            </Button>
            <Button type="button" onClick={handleSave}>
              Salvar Alterações
            </Button>
          </div>
        </div>
  )
}

export default TemplateEditorModal