"use client"

import { authService } from "@/lib/service/auth-service"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { DynamicFormRenderer } from "@/components/forms/dynamic-form-renderer"
import SheetService from "@/lib/service/sheets-service"
import CharacterService from "@/lib/service/characters-service"
import { Template } from "@/lib/service/types"

export default function CreateSheetPage({ params }: { params: { id: string } }) {
  const [templates, setTemplates] = useState<Template[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [sheetData, setSheetData] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [templatesLoading, setTemplatesLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()
  const [userInfo, setUserInfo] = useState(authService.getUserInfo())

  useEffect(() => {
    loadTemplates()
  }, [])

  const loadTemplates = async () => {
    setTemplatesLoading(true)
    try {
      const response = await SheetService.getTemplates()
      setTemplates(response.data)
    } catch (error: any) {
      toast({
        title: "Erro ao carregar templates",
        description: error.data?.message || "Não foi possível carregar os templates.",
        variant: "destructive",
      })
    } finally {
      setTemplatesLoading(false)
    }
  }

  const handleCreateSheet = async () => {
    if (!selectedTemplate || !userInfo?.id) {
      toast({
        title: "Dados incompletos",
        description: "Por favor, faça login e selecione um template",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const sheetResponse = await SheetService.createSheet({
        template_id: selectedTemplate.id,
        fields: sheetData,
        owner_id: userInfo.id
      })

      // Associa a ficha ao personagem
      await CharacterService.assignSheetToCharacter(params.id, sheetResponse.data.id)

      toast({
        title: "Ficha criada com sucesso!",
        description: "A ficha foi associada ao personagem.",
      })

      router.push(`/dashboard/characters/${params.id}`)
    } catch (error: any) {
      toast({
        title: "Erro ao criar ficha",
        description: error.message || "Ocorreu um erro ao criar a ficha.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (templatesLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/characters/${params.id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Criar Ficha</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-10 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/dashboard/characters/${params.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {selectedTemplate ? "Preencher Ficha" : "Selecionar Template"}
          </h1>
          <p className="text-muted-foreground">
            {selectedTemplate
              ? "Preencha os dados da ficha"
              : "Escolha um template para sua ficha"}
          </p>
        </div>
      </div>

      {!selectedTemplate ? (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Passo 1: Selecione um Template</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => (
              <Card
                key={template.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedTemplate(template)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{template.system_name}</CardTitle>
                    <Badge variant="secondary">v{template.version}</Badge>
                  </div>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Selecionar Template</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Passo 2: Preencher Ficha</h2>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{selectedTemplate.system_name}</Badge>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Atributos da Ficha</CardTitle>
              <CardDescription>
                Preencha os campos específicos do sistema {selectedTemplate.system_name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DynamicFormRenderer
                fields={selectedTemplate.fields}
                values={sheetData}
                onChange={(data) => setSheetData(data)}
              />
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
              Voltar
            </Button>
            <Button onClick={handleCreateSheet} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : (
                "Finalizar Ficha"
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}