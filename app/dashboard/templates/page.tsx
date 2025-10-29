"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Plus, FileText, Upload, Loader2, Trash, Clipboard } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { uploadTemplate, deleteTemplate, getTemplatesById } from "@/lib/service/templates-service"
import {Template} from "@/lib/service/types"
import Link from "next/link"
import { TemplateEditModal } from "@/components/forms/template-edit-form"

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newTemplateJson, setNewTemplateJson] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  const fetchTemplates = async () => {
    try {
      setIsLoading(true)
      const fetchedTemplates = await getTemplatesById()
      setTemplates(fetchedTemplates)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os templates. Tente novamente mais tarde.",
        variant: "destructive",
      })
      console.error("Erro ao buscar templates:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTemplates()
  }, [])

  const handleUploadTemplate = async () => {
    if (!newTemplateJson.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira o JSON do template.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsUploading(true)
      const templateData = JSON.parse(newTemplateJson)
      const uploadedTemplate = await uploadTemplate(templateData)
      
      // Atualiza a lista de templates após o upload
      setTemplates(prev => [...prev, uploadedTemplate])
      
      toast({
        title: "Template enviado com sucesso!",
        description: "O novo template foi adicionado ao sistema.",
      })

      setNewTemplateJson("")
      setIsDialogOpen(false)
    } catch (error) {
      if (error instanceof SyntaxError) {
        toast({
          title: "Erro no JSON",
          description: "O JSON fornecido não é válido. Verifique a sintaxe.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Erro no envio",
          description: "Ocorreu um erro ao enviar o template. Por favor, tente novamente.",
          variant: "destructive",
        })
        console.error("Erro detalhado:", error)
      }
    } finally {
      setIsUploading(false)
    }
  };

  const exampleJson = `{
  "system_name": "Meu Sistema",
  "version": "1.0",
  "description": "Descrição do sistema",
  "fields": [
    "attributes": {
      "type": "object",
      "required": true,
      "fields": [
        "strength": {
          "type": "number",
          "required": true,
          "min": 1,
          "max": 20
        },
        "dexterity": {
          "type": "number",
          "required": true,
          "min": 1,
          "max": 20
        }
      ]
    },
    "class": {
      "type": "string",
      "required": true,
      "options": ["Guerreiro", "Mago", "Ladino"]
    },
    "level": {
      "type": "number",
      "required": true,
      "min": 1,
      "max": 20
    },
    "skills": {
      "type": "list",
      "itemType": "string",
      "options": ["Acrobacia", "Atletismo", "História"]
    }
  ]
  }`

  const handleCloneTemplate = async (template: Template) => {
    try {
      const cloneData = {
        ...template,
        id: undefined, // backend deve gerar novo id
        nome_template: `${template.system_name } (Cópia)`,
        createdAt: new Date().toISOString(),
      }

      const newTemplate = await uploadTemplate(cloneData)
      setTemplates(prev => [newTemplate, ...prev])

      toast({
        title: "Template clonado",
        description: `"${template.nome_template}" foi duplicado com sucesso.`,
      })
    } catch (error) {
      console.error(error)
      toast({
        title: "Erro ao clonar",
        description: "Não foi possível duplicar o personagem.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Templates de Sistema</h1>
          <p className="text-muted-foreground">Gerencie os seus templates de sistemas de RPG</p>
        </div>
        <div className="justify-self-end ml-auto flex space-x-2">
          <Button href="/dashboard/templates/create" asChild className="justify-self-auto" >
            <a><Plus className="mr-2 h-4 w-4" />
            Novo Template</a>
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Novo Template por JSON
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Enviar Novo Template</DialogTitle>
                <DialogDescription>
                  Cole o JSON do template do sistema de RPG abaixo. O template define a estrutura das fichas.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="template-json">JSON do Template</Label>
                  <Textarea
                    id="template-json"
                    value={newTemplateJson}
                    onChange={(e) => setNewTemplateJson(e.target.value)}
                    placeholder="Cole o JSON do template aqui..."
                    rows={15}
                    className="font-mono text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Exemplo de Template</Label>
                  <div className="bg-muted p-4 rounded-lg">
                    <pre className="text-sm overflow-x-auto">
                      <code>{exampleJson}</code>
                    </pre>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleUploadTemplate} disabled={isUploading}>
                    {isUploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Enviar Template
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {isLoading ? (
        <div className="col-span-full flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : templates.length === 0 ? (
        <div className="col-span-full text-center py-8">
          <p className="text-muted-foreground">Nenhum template encontrado</p>
        </div>
      ) : (
        templates.map((template) => (
          <Card key={template.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-purple-600" />
                  <CardTitle className="text-lg">{template.system_name || 'Sem nome'}</CardTitle>
                </div>
                {template.version && (
                  <Badge variant="secondary">v{template.version}</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {template.created_at && (
                  <div className="text-sm text-muted-foreground">
                    Criado em: {new Date(template.created_at).toLocaleDateString("pt-BR")}
                  </div>
                )}
                <div className="flex space-x-2">
                  <Link 
                    href={`/dashboard/templates/${template.id}`}
                    passHref
                  >
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1 bg-transparent"
                      asChild
                    >
                      <p>Editar</p>
                    </Button>
                  </Link>
                  <CardContent>
                    <div className="flex space-x-2">
                      <TemplateEditModal 
                        template={template}
                        onSuccess={fetchTemplates}
                      >
                        <Button size="sm" variant="outline" className="flex-1">
                          Editar JSON
                        </Button>
                      </TemplateEditModal>
                    </div>
                  </CardContent>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-600 hover:bg-red-600 hover:text-white"
                    onClick={async () => {
                      const confirmed = confirm("Tem certeza que deseja deletar este template?");
                      if (!confirmed) return;

                      try {
                        await deleteTemplate(template.id);
                        setTemplates(prev => prev.filter(t => t.id !== template.id));
                        toast({
                          title: "Template deletado",
                          description: "O template foi removido com sucesso.",
                        });
                      } catch (error) {
                        toast({
                          title: "Erro ao deletar",
                          description: "Não foi possível deletar o template.",
                          variant: "destructive",
                        });
                        console.error(error);
                      }
                    }}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-gray-600 hover:bg-gray-600 hover:text-white"
                    onClick={() => handleCloneTemplate(template)}
                  >
                    <Clipboard className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>

      <Card>
        <CardHeader>
          <CardTitle>Sobre Templates</CardTitle>
          <CardDescription>Como funcionam os templates de sistema no RPG Manager</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <h4 className="font-medium mb-2">Estrutura do Template</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>
                  • <strong>Nome do Sistema:</strong> Nome do sistema de RPG
                </li>
                <li>
                  • <strong>Versão:</strong> Versão do sistema
                </li>
                <li>
                  • <strong>Descrição:</strong> Descrição do sistema
                </li>
                <li>
                  • <strong>Campos:</strong> Estrutura dos campos da ficha
                </li>
                <li>
                  • <strong>Número de Colunas da Página:</strong> Define quantas colunas a ficha terá na interface
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Tipos de Campo Suportados</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>
                  • <strong>Texto:</strong> Texto simples ou com opções
                </li>
                <li>
                  • <strong>Número:</strong> Números simples
                </li>
                <li>
                  • <strong>Verdadeiro/Falso:</strong> Caixinha de Verdadeiro ou Falso
                </li>
                <li>
                  • <strong>Lista:</strong> Lista de elementos editaveis, como inventário ou perícias, use opções para as colunas da lista
                </li>
                <li>
                  • <strong>Grupo de Campos:</strong> Um campo que agrupa outros campos, útil para agrupar atributos, status, etc.
                </li>
                <li>
                  • <strong>Lista de Objetos:</strong> Lista de Objetos que pode ser adicionado ou removido, útil para skills e armas.
                </li>
                <li>
                  • <strong>Área de Texto:</strong> Campo de texto expandido para entradas maiores, útil para descrições ou anotações.
                </li>
                <li>
                  • <strong>Status</strong> Campo especial para representar status com valores numéricos e máximos, útil para vida, mana, etc.
                </li>
                <li>
                  • <strong>Atributos</strong> Campo especial para representar atributos com valores numéricos, e modificadores, útil para força, destreza, etc.
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Propiedades de Campos</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>
                  • <strong>Nome do Campo:</strong> Nome do campo na ficha
                </li>
                <li>
                  • <strong>Revelar o Titulo:</strong> Se o nome do campo deve ser mostrado na ficha
                </li>
                <li>
                  • <strong>Tipo do Campo:</strong> Define o tipo de dado do campo
                </li>
                <li>
                  • <strong>Valor Padrão:</strong> Define o valor padrão do campo
                </li> 
                <li>
                  • <strong>Largura do Campo:</strong> Define quantas colunas o campo ocupa na ficha
                </li>
                <li>
                  • <strong>Forma de Distribuição dos sub-campos:</strong> Para grupos de campos, define se os sub-campos são mostrados em colunas ou em linha
                </li>
                <li>
                  • <strong>Colunas:</strong> Caso a forma de distribuição seja em colunas, define quantas colunas internas o grupo terá
                </li>
                <li>
                  • <strong>Opções:</strong> Exclusivo de campos do tipo Texto ou Lista, no texto define um menu de opções, na lista define as colunas da lista
                </li>
                <li>
                  • <strong>Cor:</strong> Exclusivo de campos do tipo Status, define a cor do indicador visual do status
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
  }
