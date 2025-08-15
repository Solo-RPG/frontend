"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Plus, FileText, Trash } from "lucide-react"
import { getTemplates, deleteTemplate } from "@/lib/service/templates-service"
import {Template} from "@/lib/service/types"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { TemplateEditModal } from "@/components/forms/template-edit-form"

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Templates de Sistema</h1>
          <p className="text-muted-foreground">Gerencie os templates de sistemas de RPG disponíveis</p>
        </div>
        <Link href={`/dashboard/templates/create`} passHref legacyBehavior>
          <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Template
            </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <div className="col-span-full flex justify-center py-8">
            Carregando...
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
                    <Link href={`/dashboard/templates/${template.id}`} passHref legacyBehavior>
                      <Button size="sm" variant="outline" className="flex-1" asChild>
                        <a>Ver Detalhes</a>
                      </Button>
                    </Link>
                    <TemplateEditModal template={template} onSuccess={fetchTemplates}>
                      <Button size="sm" variant="outline" className="flex-1">
                        Editar
                      </Button>
                    </TemplateEditModal>
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
    </div>
  )
}