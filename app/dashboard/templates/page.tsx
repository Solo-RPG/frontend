"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Plus, FileText, Upload, Loader2, Trash } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { uploadTemplate, getTemplates, deleteTemplate } from "@/lib/service/templates-service"
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
      const fetchedTemplates = await getTemplates()
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
  "fields": {
    "attributes": {
      "type": "object",
      "required": true,
      "fields": {
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
      }
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
  }
}`

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Templates de Sistema</h1>
          <p className="text-muted-foreground">Gerencie os templates de sistemas de RPG disponíveis</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Template
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
              <CardDescription>
                {template.description || "Sem descrição"}
              </CardDescription>
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
                    legacyBehavior
                  >
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1 bg-transparent"
                      asChild
                    >
                      <a>Ver Detalhes</a>
                    </Button>
                  </Link>
                  <CardContent>
                    <div className="flex space-x-2">
                      <TemplateEditModal 
                        template={template}
                        onSuccess={fetchTemplates}
                      >
                        <Button size="sm" variant="outline" className="flex-1">
                          Editar
                        </Button>
                      </TemplateEditModal>
                    </div>
                  </CardContent>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-600 hover:bg-red-50"
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
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium mb-2">Estrutura do Template</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>
                  • <strong>system_name:</strong> Nome do sistema de RPG
                </li>
                <li>
                  • <strong>version:</strong> Versão do sistema
                </li>
                <li>
                  • <strong>description:</strong> Descrição do sistema
                </li>
                <li>
                  • <strong>fields:</strong> Estrutura dos campos da ficha
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Tipos de Campo Suportados</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>
                  • <strong>string:</strong> Texto simples ou com opções
                </li>
                <li>
                  • <strong>number:</strong> Números com min/max
                </li>
                <li>
                  • <strong>boolean:</strong> Verdadeiro/Falso
                </li>
                <li>
                  • <strong>list:</strong> Lista de itens
                </li>
                <li>
                  • <strong>object:</strong> Grupo de campos aninhados
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
