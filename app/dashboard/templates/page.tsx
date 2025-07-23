"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Plus, FileText, Upload, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function TemplatesPage() {
  const [templates] = useState([
    {
      id: "1",
      system_name: "D&D 5e",
      version: "5.0",
      description: "Sistema clássico de RPG com classes, raças e magias",
      created_at: "2024-01-10",
    },
    {
      id: "2",
      system_name: "Tormenta 20",
      version: "1.0",
      description: "Sistema brasileiro com magia e tecnologia",
      created_at: "2024-01-08",
    },
    {
      id: "3",
      system_name: "Call of Cthulhu",
      version: "7.0",
      description: "Horror cósmico e investigação sobrenatural",
      created_at: "2024-01-05",
    },
  ])

  const [newTemplateJson, setNewTemplateJson] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

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
      JSON.parse(newTemplateJson) // Validar JSON
      setIsUploading(true)

      // Simular upload
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Template enviado com sucesso!",
        description: "O novo template foi adicionado ao sistema.",
      })

      setNewTemplateJson("")
      setIsDialogOpen(false)
    } catch (error) {
      toast({
        title: "Erro no JSON",
        description: "O JSON fornecido não é válido. Verifique a sintaxe.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

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
        {templates.map((template) => (
          <Card key={template.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-purple-600" />
                  <CardTitle className="text-lg">{template.system_name}</CardTitle>
                </div>
                <Badge variant="secondary">v{template.version}</Badge>
              </div>
              <CardDescription>{template.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm text-muted-foreground">
                  Criado em: {new Date(template.created_at).toLocaleDateString("pt-BR")}
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                    Ver Detalhes
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                    Editar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
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
