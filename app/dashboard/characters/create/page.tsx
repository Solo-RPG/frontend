"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { DynamicFormRenderer } from "@/components/forms/dynamic-form-renderer"
import { CharactersStorage } from "@/lib/characters-storage"
import { ImageUpload } from "@/components/ui/image-upload"
import { getTemplates } from "@/lib/service/templates-service"
import { Template } from "@/lib/service/types"

export default function CreateCharacterPage() {
  const [step, setStep] = useState(1)
  const [templates, setTemplates] = useState<Template[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [characterData, setCharacterData] = useState({
    name: "",
    photo: "",
    history: "",
    fields: {},
  })
  const [isLoading, setIsLoading] = useState(false)
  const [templatesLoading, setTemplatesLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const loadTemplates = async () => {
      CharactersStorage.init()
      try {
        const fetchedTemplates = await getTemplates()
        setTemplates(fetchedTemplates)
      } catch (error) {
        toast({
          title: "Erro ao carregar templates",
          description: "Não foi possível carregar os templates. Tente novamente.",
          variant: "destructive",
        })
        console.error("Erro ao carregar templates:", error)
      } finally {
        setTemplatesLoading(false)
      }
    }

    loadTemplates()
  }, [toast])

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template)
    setStep(2)
  }

  const handleSubmit = async () => {
    if (!selectedTemplate || !characterData.name) return

    setIsLoading(true)
    try {
      // Determinar o nível baseado nos campos
      let level = "Nível 1"
      if (characterData.fields.nível) {
        level = `Nível ${characterData.fields.nível}`
      } else if (characterData.fields.nivel) {
        level = `Nível ${characterData.fields.nivel}`
      } else if (characterData.fields.idade) {
        level = `${characterData.fields.idade} anos`
      }

      // Salvar personagem no storage
      const newCharacter = CharactersStorage.add({
        name: characterData.name,
        system: selectedTemplate.system_name,
        level: level,
        owner: "Usuário Atual",
        image: characterData.photo,
        history: characterData.history,
        fields: characterData.fields,
      })

      toast({
        title: "Personagem criado com sucesso!",
        description: `${characterData.name} foi adicionado às suas fichas.`,
      })

      router.push("/dashboard/characters")
    } catch (error) {
      toast({
        title: "Erro ao criar personagem",
        description: "Ocorreu um erro. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getAvatarFallback = () => {
    if (!characterData.name) return "PJ"
    return characterData.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  if (templatesLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/characters">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Nova Ficha</h1>
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
          <Link href="/dashboard/characters">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nova Ficha</h1>
          <p className="text-muted-foreground">
            {step === 1 ? "Escolha um template" : "Preencha os dados do personagem"}
          </p>
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Passo 1: Selecione um Template</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => (
              <Card
                key={template.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleTemplateSelect(template)}
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
      )}

      {step === 2 && selectedTemplate && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Passo 2: Dados do Personagem</h2>
            <Badge variant="outline">{selectedTemplate.system_name}</Badge>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <ImageUpload
                value={characterData.photo}
                onChange={(photo) => setCharacterData((prev) => ({ ...prev, photo }))}
                fallback={getAvatarFallback()}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Personagem *</Label>
                  <Input
                    id="name"
                    value={characterData.name}
                    onChange={(e) => setCharacterData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Digite o nome do personagem"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="history">História do Personagem</Label>
                <Textarea
                  id="history"
                  value={characterData.history}
                  onChange={(e) => setCharacterData((prev) => ({ ...prev, history: e.target.value }))}
                  placeholder="Conte a história do seu personagem..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

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
                values={characterData.fields}
                onChange={(fields) => setCharacterData((prev) => ({ ...prev, fields }))}
              />
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(1)}>
              Voltar
            </Button>
            <Button onClick={handleSubmit} disabled={!characterData.name || isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : (
                "Criar Personagem"
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}