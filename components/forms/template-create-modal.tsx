"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash, ChevronDown, ChevronUp, GripVertical } from "lucide-react"
import { useForm, useFieldArray } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "@/hooks/use-toast"
import { uploadTemplate } from "@/lib/service/templates-service"
import { DragDropContext, Droppable, Draggable, DropResult, DraggableProvided, DroppableProvided } from "@hello-pangea/dnd"
import { FieldConfig } from "@/lib/service/types"
import { authService } from "@/lib/service/auth-service"

interface MultiSelectProps {
  value: string[]
  onChange: (value: string[]) => void
  options: { value: string; label: string }[]
  placeholder?: string
}

function MultiSelect({ value, onChange, options, placeholder = "Selecione..." }: MultiSelectProps) {
  const selectedLabels = value.map(val => {
    const option = options.find(opt => opt.value === val)
    return option ? option.label : val
  }).filter(Boolean)

  return (
    <Select
      value={value.join(",")}
      onValueChange={(val) => onChange(val.split(",").filter(Boolean))}
    >
      <SelectTrigger>
        <SelectValue placeholder={placeholder}>
          {selectedLabels.length > 0 ? selectedLabels.join(", ") : placeholder}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

type FieldConfigWithId = FieldConfig & { 
  id: string
  fields?: FieldConfigWithId[] 
}

const fieldSchema: z.ZodType<FieldConfigWithId> = z.lazy(() =>
  z.object({
    id: z.string(),
    name: z.string().min(1, "Nome do campo é obrigatório"),
    type: z.string().min(1, "Tipo é obrigatório"),
    required: z.boolean().default(false),
    default: z.any().optional(),
    description: z.string().optional(),
    options: z.array(z.string()).optional(),
    min: z.number().optional(),
    max: z.number().optional(),
    fields: z.array(fieldSchema).optional()
  })
)

const formSchema = z.object({
  system_name: z.string().min(1, "Nome do sistema é obrigatório"),
  owner_id: z.string().optional(),
  version: z.string().min(1, "Versão é obrigatória"),
  description: z.string().optional(),
  fields: z.array(fieldSchema).min(1, "Adicione pelo menos um campo"),
  blocks: z.array(
    z.object({
      id: z.string(),
      title: z.string().min(1, "Título do bloco é obrigatório"),
      fields: z.array(z.string()).min(1, "Selecione pelo menos um campo")
    })
  ).min(1, "Adicione pelo menos um bloco")
})

type TemplateFormValues = z.infer<typeof formSchema>

export function TemplateCreatorModal() {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("fields")
  const [expandedField, setExpandedField] = useState<string | null>(null)

  const getOwnerId = () => {
    const userInfo = authService.getUserInfo()
    if (userInfo) {
      return userInfo.id
    }
    return ""
  }

  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      system_name: "",
      owner_id: getOwnerId(),
      version: "1.0",
      description: "",
      fields: [],
      blocks: []
    }
  })

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "fields"
  })

  const { fields: blocks, append: appendBlock, remove: removeBlock } = useFieldArray({
    control: form.control,
    name: "blocks"
  })

  const onSubmit = async (data: TemplateFormValues) => {
    try {
      const templateData = {
        ...data,
        template_json: {
          blocos: data.blocks.map(block => ({
            titulo: block.title,
            campos: block.fields
          }))
        }
      }

      await uploadTemplate(templateData)
      toast({
        title: "Template criado com sucesso!",
        description: "O novo template foi adicionado ao sistema."
      })
      setOpen(false)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao criar o template.",
        variant: "destructive"
      })
    }
  }

  const addNewField = () => {
    append({
      id: `field-${Date.now()}`,
      name: "",
      type: "string",
      required: false
    })
  }

  const addNewBlock = () => {
    appendBlock({
      id: `block-${Date.now()}`,
      title: "",
      fields: []
    })
  }

  const addNestedField = (fieldPath: `fields.${number}` | `fields.${number}.fields.${number}`) => {
    const field = form.getValues(fieldPath)
    const newField = {
      id: `nested-${Date.now()}`,
      name: "",
      type: "string",
      required: false
    }
    
    form.setValue(`${fieldPath}.fields` as any, [...(field.fields || []), newField], { 
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: false
    })
    // Força a re-renderização
    form.trigger(fieldPath as any)
  }

  const removeNestedField = (fieldPath: `fields.${number}` | `fields.${number}.fields.${number}`, index: number) => {
    const field = form.getValues(fieldPath)
    const updatedFields = [...(field.fields || [])]
    updatedFields.splice(index, 1)
    form.setValue(`${fieldPath}.fields` as any, updatedFields, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: false
    })

    // Força a re-renderização
    form.trigger(fieldPath as any)
  }

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return
    move(result.source.index, result.destination.index)
  }

  const getFieldOptions = (): {value: string; label: string}[] => {
    const flattenFields = (fields: FieldConfigWithId[], prefix = ""): {value: string; label: string}[] => {
      return fields.flatMap(field => {
        const currentPath = prefix ? `${prefix}.${field.name}` : field.name
        const result = [{
          value: field.id,
          label: currentPath
        }]

        if (field.fields) {
          result.push(...flattenFields(field.fields, currentPath))
        }

        return result
      })
    }

    return flattenFields(fields)
  }

  const [expandedFields, setExpandedFields] = useState<Set<string>>(new Set())

  const toggleExpanded = (id: string) => {
    setExpandedFields(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) newSet.delete(id)
      else newSet.add(id)
      return newSet
    })
  }

  const renderField = (
    fieldPath: `fields.${number}` | `fields.${number}.fields.${number}`,
    field: FieldConfigWithId,
    index: number,
    provided?: DraggableProvided,
    isNested = false
  ) => {

    const fieldId = fieldPath
    const isExpanded = expandedFields.has(fieldId)
    const fieldType = form.watch(`${fieldPath}.type` as never)

    return (
      <div key={field.id} className={`border rounded-lg p-4 bg-white shadow-sm ${isNested ? 'ml-6 mt-2' : ''}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            {!isNested && provided && (
              <div {...provided.dragHandleProps}>
                <GripVertical className="h-4 w-4 text-gray-400" />
              </div>
            )}
            <button
              type="button"
              onClick={() => toggleExpanded(fieldId)}
              className="font-medium flex items-center"
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
            onClick={() => isNested ? 
              removeNestedField(fieldPath.replace(/\.fields\.\d+$/, '') as `fields.${number}`, parseInt(fieldPath.split('.').pop()!)) : 
              remove(index)}
            className="text-red-500 hover:text-red-700"
          >
            <Trash className="h-4 w-4" />
          </button>
        </div>

        {isExpanded && (
          <div className="grid grid-cols-2 gap-4 mt-4">
            <FormField
              control={form.control}
              name={`${fieldPath}.name` as never}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Campo</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: nome, raça, nível" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`${fieldPath}.type` as never}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="string">Texto</SelectItem>
                      <SelectItem value="number">Número</SelectItem>
                      <SelectItem value="boolean">Verdadeiro/Falso</SelectItem>
                      <SelectItem value="object">Objeto (Grupo de campos)</SelectItem>
                      <SelectItem value="list">Lista</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {(fieldType === "string" || fieldType === "number") && (
              <FormField
                control={form.control}
                name={`${fieldPath}.default` as never}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor Padrão</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={
                          fieldType === "number" 
                            ? "Ex: 10" 
                            : "Ex: Novo Personagem"
                        }
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {(fieldType === "string" || fieldType === "list") && (
              <FormField
                control={form.control}
                name={`${fieldPath}.options` as never}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Opções (uma por linha)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Humano\nElfo\nAnão\n...\n(Deixe vazio para campo livre)"
                        value={Array.isArray(field.value) ? field.value.join("\n") : ""}
                        onChange={(e) => {
                          const options = e.target.value
                            .split("\n")
                            .filter(opt => opt.trim())
                          field.onChange(options)
                        }}
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {fieldType === "object" && (
              <div className="col-span-2">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-medium">Campos do Objeto</h4>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => addNestedField(fieldPath)}
                  >
                    <Plus className="mr-2 h-3 w-3" />
                    Adicionar Campo
                  </Button>
                </div>

                {form.watch(`${fieldPath}.fields`)?.map((nestedField, nestedIndex) => (
                  <div key={nestedField.id}>
                    {renderField(
                      `${fieldPath}.fields.${nestedIndex}` as `fields.${number}.fields.${number}`,
                      nestedField,
                      nestedIndex,
                      undefined,
                      true
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Template
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Novo Template</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="system_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Sistema</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Dungeons & Dragons 5e" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="version"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Versão</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 1.0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex border-b">
              <button
                type="button"
                className={`px-4 py-2 font-medium ${activeTab === "fields" ? "border-b-2 border-purple-600 text-purple-600" : "text-gray-500"}`}
                onClick={() => setActiveTab("fields")}
              >
                Campos
              </button>
              <button
                type="button"
                className={`px-4 py-2 font-medium ${activeTab === "blocks" ? "border-b-2 border-purple-600 text-purple-600" : "text-gray-500"}`}
                onClick={() => setActiveTab("blocks")}
              >
                Blocos
              </button>
            </div>

            {activeTab === "fields" && (
              <div className="space-y-4">
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="fields">
                    {(provided: DroppableProvided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                        {fields.map((field, index) => (
                          <Draggable key={field.id} draggableId={field.id} index={index}>
                            {(provided) => {
                              const fieldPath = `fields.${index}` as const
                              return (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                >
                                  {renderField(fieldPath, field, index, provided)}
                                </div>
                              )
                            }}
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
            )}

            {activeTab === "blocks" && (
              <div className="space-y-4">
                {blocks.map((block, index) => (
                  <div key={block.id} className="border rounded-lg p-4 bg-white shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium">Bloco {index + 1}</h3>
                      <button
                        type="button"
                        onClick={() => removeBlock(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                    <FormField
                      control={form.control}
                      name={`blocks.${index}.title`}
                      render={({ field }) => (
                        <FormItem className="mb-4">
                          <FormLabel>Título do Bloco</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Identidade, Atributos" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`blocks.${index}.fields`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Campos do Bloco</FormLabel>
                          <FormControl>
                            <MultiSelect
                              value={field.value}
                              onChange={field.onChange}
                              options={getFieldOptions()}
                              placeholder="Selecione os campos"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={addNewBlock}
                  className="w-full"
                  disabled={fields.length === 0}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Bloco
                </Button>
                {fields.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center">
                    Adicione campos primeiro para criar blocos
                  </p>
                )}
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">
                Criar Template
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}