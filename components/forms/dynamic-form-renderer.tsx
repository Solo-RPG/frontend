"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, X, GripVertical } from "lucide-react"
import { useState } from "react"

type FieldType = 'string' | 'number' | 'boolean' | 'list' | 'object'

export interface FieldDefinition {
  name: string
  type: FieldType
  required?: boolean
  default?: any
  min?: number
  max?: number
  options?: string[] | null
  fields?: FieldDefinition[] | null
}

interface BlockDefinition {
  titulo: string
  campos: string[]
}

export interface TemplateData {
  id?: string
  system_name: string
  version: string
  description?: string
  fields: FieldDefinition[]
  template_json: {
    blocos: BlockDefinition[]
  }
}

interface TemplateEditorProps {
  data: TemplateData
  onChange: (data: TemplateData) => void
}

export function TemplateEditor({ data, onChange }: TemplateEditorProps) {
  const [activeTab, setActiveTab] = useState<'fields' | 'blocks'>('fields')
  const [draggedField, setDraggedField] = useState<string | null>(null)

  const updateField = (path: number[], newProps: Partial<FieldDefinition>) => {
    const newFields = [...data.fields]
    let current: any = newFields
    
    for (let i = 0; i < path.length - 1; i++) {
      if (current[path[i]].fields) {
        current = current[path[i]].fields
      }
    }
    
    current[path[path.length - 1]] = {
      ...current[path[path.length - 1]],
      ...newProps
    }
    
    onChange({ ...data, fields: newFields })
  }

  const addField = (parentPath?: number[]) => {
    const newField: FieldDefinition = {
      name: `campo_${Date.now()}`,
      type: 'string',
      required: false,
      options: null,
      fields: null
    }

    if (!parentPath) {
      // Adiciona no nível raiz
      onChange({
        ...data,
        fields: [...data.fields, newField]
      })
    } else {
      // Adiciona como subcampo
      const newFields = [...data.fields]
      let current: any = newFields
      
      for (let i = 0; i < parentPath.length; i++) {
        if (!current[parentPath[i]].fields) {
          current[parentPath[i]].fields = []
        }
        current = current[parentPath[i]].fields
      }
      
      current.push(newField)
      onChange({ ...data, fields: newFields })
    }
  }

  const removeField = (path: number[]) => {
    const newFields = [...data.fields]
    
    if (path.length === 1) {
      newFields.splice(path[0], 1)
    } else {
      let current: any = newFields
      
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]].fields
      }
      
      current.splice(path[path.length - 1], 1)
    }
    
    onChange({ ...data, fields: newFields })
  }

  const addBlock = () => {
    const newBlock: BlockDefinition = {
      titulo: `Novo Bloco ${data.template_json.blocos.length + 1}`,
      campos: []
    }
    
    onChange({
      ...data,
      template_json: {
        blocos: [...data.template_json.blocos, newBlock]
      }
    })
  }

  const updateBlock = (index: number, newProps: Partial<BlockDefinition>) => {
    const newBlocks = [...data.template_json.blocos]
    newBlocks[index] = { ...newBlocks[index], ...newProps }
    
    onChange({
      ...data,
      template_json: {
        blocos: newBlocks
      }
    })
  }

  const removeBlock = (index: number) => {
    const newBlocks = [...data.template_json.blocos]
    newBlocks.splice(index, 1)
    
    onChange({
      ...data,
      template_json: {
        blocos: newBlocks
      }
    })
  }

  const handleDragStart = (fieldName: string) => {
    setDraggedField(fieldName)
  }

  const handleDrop = (blockIndex: number) => {
    if (draggedField) {
      const block = data.template_json.blocos[blockIndex]
      if (!block.campos.includes(draggedField)) {
        updateBlock(blockIndex, {
          campos: [...block.campos, draggedField]
        })
      }
      setDraggedField(null)
    }
  }

  const removeFieldFromBlock = (blockIndex: number, fieldIndex: number) => {
    const newBlocks = [...data.template_json.blocos]
    newBlocks[blockIndex].campos.splice(fieldIndex, 1)
    
    onChange({
      ...data,
      template_json: {
        blocos: newBlocks
      }
    })
  }

  const renderField = (field: FieldDefinition, path: number[] = []) => {
    const fieldKey = path.join('-')
    const fieldName = field.name

    return (
      <Card key={fieldKey} className="mb-4 border border-gray-200 shadow-sm">
        <CardHeader className="flex flex-row justify-between items-center p-4 bg-gray-50 rounded-t-lg border-b">
          <div className="flex items-center space-x-2">
            {path.length > 0 && <GripVertical className="h-4 w-4 text-gray-400" />}
            <CardTitle className="text-lg font-semibold text-gray-800">
              {field.name}
            </CardTitle>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => removeField(path)}
            className="text-red-500 hover:bg-red-50 hover:text-red-600"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div className="space-y-2">
            <Label className="text-gray-700">Nome do Campo</Label>
            <Input
              value={field.name}
              placeholder="Digite o nome do campo"
              onChange={(e) => updateField(path, { name: e.target.value })}
              className="bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700">Tipo</Label>
            <Select 
              value={field.type} 
              onValueChange={(val) => updateField(path, { 
                type: val as FieldType,
                ...(val !== 'object' && val !== 'list' ? { fields: null } : {})
              })}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Selecione um tipo" />
              </SelectTrigger>
              <SelectContent>
                {['string','number','boolean','list','object'].map(t => (
                  <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id={`required-${fieldKey}`}
              checked={field.required || false}
              onCheckedChange={(val) => updateField(path, { required: val === true })}
              className="border-gray-300"
            />
            <Label htmlFor={`required-${fieldKey}`} className="text-gray-700">
              Obrigatório
            </Label>
          </div>

          {field.type === 'string' && (
            <div className="space-y-2">
              <Label className="text-gray-700">Valor Padrão</Label>
              <Input
                value={field.default || ''}
                placeholder="Valor padrão"
                onChange={(e) => updateField(path, { default: e.target.value })}
                className="bg-white"
              />
            </div>
          )}

          {field.type === 'number' && (
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-2">
                <Label className="text-gray-700">Padrão</Label>
                <Input 
                  type="number" 
                  placeholder="Valor padrão" 
                  value={field.default || ''} 
                  onChange={(e) => updateField(path, { default: Number(e.target.value) })}
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-700">Mínimo</Label>
                <Input 
                  type="number" 
                  placeholder="Mínimo" 
                  value={field.min || ''} 
                  onChange={(e) => updateField(path, { min: Number(e.target.value) })}
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-700">Máximo</Label>
                <Input 
                  type="number" 
                  placeholder="Máximo" 
                  value={field.max || ''} 
                  onChange={(e) => updateField(path, { max: Number(e.target.value) })}
                  className="bg-white"
                />
              </div>
            </div>
          )}

          {field.type === 'string' && (
            <div className="space-y-2">
              <Label className="text-gray-700">Opções</Label>
              <div className="space-y-2">
                {(field.options || []).map((opt, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <Input 
                      value={opt} 
                      onChange={(e) => {
                        const newOptions = [...(field.options || [])]
                        newOptions[i] = e.target.value
                        updateField(path, { options: newOptions })
                      }}
                      className="bg-white flex-1"
                    />
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => {
                        const newOptions = [...(field.options || [])]
                        newOptions.splice(i, 1)
                        updateField(path, { options: newOptions.length ? newOptions : null })
                      }}
                      className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                    >
                      <X className="h-4 w-4"/>
                    </Button>
                  </div>
                ))}
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => {
                  const newOptions = [...(field.options || []), '']
                  updateField(path, { options: newOptions })
                }}
                className="mt-2 text-blue-600 border-blue-200 hover:bg-blue-50"
              >
                <Plus className="mr-2 h-4 w-4" /> Adicionar opção
              </Button>
            </div>
          )}

          {(field.type === 'object' || field.type === 'list') && (
            <div className="mt-4 space-y-2">
              <Label className="text-gray-700">
                {field.type === 'object' ? 'Subcampos' : 'Itens da Lista'}
              </Label>
              <div className="ml-4 pl-4 border-l-2 border-gray-100 space-y-4">
                {field.fields?.map((subField, i) => 
                  renderField(subField, [...path, i])
                )}
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => addField(path)}
                  className="text-green-600 border-green-200 hover:bg-green-50"
                >
                  <Plus className="mr-2 h-4 w-4" /> Adicionar {field.type === 'object' ? 'subcampo' : 'item'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  const renderBlock = (block: BlockDefinition, index: number) => {
    return (
      <Card key={index} className="mb-4 border border-gray-200 shadow-sm">
        <CardHeader className="flex flex-row justify-between items-center p-4 bg-gray-50 rounded-t-lg border-b">
          <CardTitle className="text-lg font-semibold text-gray-800">
            {block.titulo}
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => removeBlock(index)}
            className="text-red-500 hover:bg-red-50 hover:text-red-600"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div className="space-y-2">
            <Label className="text-gray-700">Título do Bloco</Label>
            <Input
              value={block.titulo}
              placeholder="Digite o título do bloco"
              onChange={(e) => updateBlock(index, { titulo: e.target.value })}
              className="bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700">Campos no Bloco</Label>
            <div 
              className="min-h-20 p-4 border-2 border-dashed border-gray-200 rounded-md"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(index)}
            >
              {block.campos.length === 0 ? (
                <p className="text-gray-400 text-center py-4">
                  Arraste campos para aqui
                </p>
              ) : (
                <div className="space-y-2">
                  {block.campos.map((fieldName, i) => {
                    const field = data.fields.find(f => f.name === fieldName)
                    return (
                      <div key={i} className="flex items-center justify-between p-2 bg-white border rounded">
                        <div className="flex items-center space-x-2">
                          <GripVertical className="h-4 w-4 text-gray-400" />
                          <span>{field?.name || fieldName}</span>
                        </div>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => removeFieldFromBlock(index, i)}
                          className="text-red-500 hover:bg-red-50 hover:text-red-600"
                        >
                          <X className="h-4 w-4"/>
                        </Button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho fixo */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="bg-gray-50 border-b p-4">
          <CardTitle className="text-lg font-semibold text-gray-800">
            Configurações do Template
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-700">Nome do Sistema</Label>
              <Input
                value={data.system_name}
                onChange={(e) => onChange({ ...data, system_name: e.target.value })}
                className="bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700">Versão</Label>
              <Input
                value={data.version}
                onChange={(e) => onChange({ ...data, version: e.target.value })}
                className="bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700">Descrição</Label>
              <Input
                value={data.description || ''}
                onChange={(e) => onChange({ ...data, description: e.target.value })}
                className="bg-white"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Abas */}
      <div className="flex border-b">
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'fields' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('fields')}
        >
          Campos
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'blocks' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('blocks')}
        >
          Blocos
        </button>
      </div>

      {/* Conteúdo das abas */}
      {activeTab === 'fields' && (
        <div className="space-y-4">
          {data.fields.map((field, index) => (
            <div 
              key={index} 
              draggable 
              onDragStart={() => handleDragStart(field.name)}
              className="cursor-move"
            >
              {renderField(field, [index])}
            </div>
          ))}

          <Button 
            onClick={() => addField()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4"/> Adicionar Campo
          </Button>
        </div>
      )}

      {activeTab === 'blocks' && (
        <div className="space-y-6">
          {/* Seção de Blocos */}
          <div className="space-y-4">
            {data.template_json.blocos.map((block, blockIndex) => {
              // Todos os campos usados em outros blocos
              const usedFields = data.template_json.blocos
                .flatMap((b, idx) => idx !== blockIndex ? b.campos : []);
              
              // Campos disponíveis para este bloco (não usados em nenhum bloco)
              const availableFields = data.fields.filter(
                field => !usedFields.includes(field.name) && !block.campos.includes(field.name)
              );

              return (
                <Card key={blockIndex} className="mb-4 border border-gray-200 shadow-sm">
                  <CardHeader className="flex flex-row justify-between items-center p-4 bg-gray-50 rounded-t-lg border-b">
                    <CardTitle className="text-lg font-semibold text-gray-800">
                      {block.titulo}
                    </CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeBlock(blockIndex)}
                      className="text-red-500 hover:bg-red-50 hover:text-red-600"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="p-4 space-y-4">
                    <div className="space-y-2">
                      <Label className="text-gray-700">Título do Bloco</Label>
                      <Input
                        value={block.titulo}
                        placeholder="Digite o título do bloco"
                        onChange={(e) => updateBlock(blockIndex, { titulo: e.target.value })}
                        className="bg-white"
                      />
                    </div>

                    <div className="space-y-4">
                      <Label className="text-gray-700">Campos no Bloco</Label>
                      
                      {/* Campos já adicionados ao bloco */}
                      {block.campos.length === 0 ? (
                        <p className="text-gray-400 text-center py-4">
                          Nenhum campo adicionado ainda
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {block.campos.map((fieldName, fieldIndex) => {
                            const field = data.fields.find(f => f.name === fieldName);
                            return (
                              <div key={fieldIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded border">
                                <div>
                                  <p className="font-medium">{field?.name || fieldName}</p>
                                  <p className="text-sm text-gray-500">Tipo: {field?.type}</p>
                                </div>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    // Remove o campo do bloco
                                    const newBlocks = [...data.template_json.blocos];
                                    newBlocks[blockIndex].campos.splice(fieldIndex, 1);
                                    
                                    onChange({
                                      ...data,
                                      template_json: {
                                        blocos: newBlocks
                                      }
                                    });
                                  }}
                                  className="text-red-500 hover:bg-red-50"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Seletor para adicionar novos campos */}
                      {availableFields.length > 0 ? (
                        <div className="mt-4">
                          <Select
                            onValueChange={(selectedFieldName) => {
                              // Adiciona o campo selecionado ao bloco
                              const newBlocks = [...data.template_json.blocos];
                              newBlocks[blockIndex].campos.push(selectedFieldName);
                              
                              onChange({
                                ...data,
                                template_json: {
                                  blocos: newBlocks
                                }
                              });
                            }}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Selecione um campo para adicionar" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableFields.map((field) => (
                                <SelectItem key={field.name} value={field.name}>
                                  {field.name} ({field.type})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm mt-2">
                          {data.fields.length === 0 
                            ? "Nenhum campo disponível (adicione campos na aba 'Campos')" 
                            : "Todos os campos disponíveis já estão em uso nos blocos"}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {/* Botão para adicionar novo bloco */}
            <Button 
              onClick={addBlock}
              className="bg-blue-600 hover:bg-blue-700 w-full"
              disabled={data.fields.length === 0}
            >
              <Plus className="mr-2 h-4 w-4" /> Adicionar Novo Bloco
            </Button>
          </div>
        </div>
      )}

      {/* Visualização do JSON */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="bg-gray-50 border-b p-4">
          <CardTitle className="text-lg font-semibold text-gray-800">
            Pré-visualização do JSON
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <pre className="bg-gray-50 p-4 rounded-md text-sm overflow-x-auto border border-gray-200">
            {JSON.stringify(data, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  )
}