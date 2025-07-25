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

interface Template {
  id: string
  system_name: string
  version: string
  description: string
  fields: any
}

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
    // Inicializar storage
    CharactersStorage.init()

    // Simular carregamento de templates
    setTimeout(() => {
      setTemplates([
        {
          id: "1",
          system_name: "D&D 5e",
          version: "5.0",
          description: "Sistema clássico de RPG com classes, raças e magias",
          fields: {
            atributos: {
              type: "object",
              required: true,
              fields: {
                força: { type: "number", required: true, min: 1, max: 20 },
                destreza: { type: "number", required: true, min: 1, max: 20 },
                constituição: { type: "number", required: true, min: 1, max: 20 },
                inteligência: { type: "number", required: true, min: 1, max: 20 },
                sabedoria: { type: "number", required: true, min: 1, max: 20 },
                carisma: { type: "number", required: true, min: 1, max: 20 },
              },
            },
            classe: {
              type: "string",
              required: true,
              options: ["Guerreiro", "Mago", "Ladino", "Clérigo", "Ranger", "Bárbaro"],
            },
            raça: {
              type: "string",
              required: true,
              options: ["Humano", "Elfo", "Anão", "Halfling", "Meio-elfo", "Meio-orc"],
            },
            nível: { type: "number", required: true, min: 1, max: 20 },
            pontosDeVida: { type: "number", required: true },
            classeDeArmadura: { type: "number", required: true },
            habilidades: {
              type: "list",
              itemType: "string",
              options: ["Acrobacia", "Arcanismo", "Atletismo", "Enganação", "História", "Intimidação"],
            },
          },
        },
        {
          id: "2",
          system_name: "Tormenta 20",
          version: "1.0",
          description: "Sistema brasileiro com magia e tecnologia",
          fields: {
            atributos: {
              type: "object",
              required: true,
              fields: {
                força: { type: "number", required: true, min: 0, max: 5 },
                agilidade: { type: "number", required: true, min: 0, max: 5 },
                intelecto: { type: "number", required: true, min: 0, max: 5 },
                presença: { type: "number", required: true, min: 0, max: 5 },
              },
            },
            origem: {
              type: "string",
              required: true,
              options: ["Acadêmico", "Artesão", "Assistente de Laboratório", "Batedor", "Capanga"],
            },
            classe: {
              type: "string",
              required: true,
              options: ["Arcanista", "Bárbaro", "Bardo", "Bucaneiro", "Caçador", "Cavaleiro"],
            },
            nível: { type: "number", required: true, min: 1, max: 20 },
            pontosDeVida: { type: "number", required: true },
            mana: { type: "number", required: false },
            equipamento: {
              type: "list",
              itemType: "string",
            },
          },
        },
        {
          id: "3",
          system_name: "Call of Cthulhu",
          version: "7.0",
          description: "Horror cósmico e investigação sobrenatural",
          fields: {
            atributos: {
              type: "object",
              required: true,
              fields: {
                força: { type: "number", required: true, min: 15, max: 90 },
                destreza: { type: "number", required: true, min: 15, max: 90 },
                inteligência: { type: "number", required: true, min: 40, max: 90 },
                constituição: { type: "number", required: true, min: 15, max: 90 },
                aparência: { type: "number", required: true, min: 15, max: 90 },
                poder: { type: "number", required: true, min: 15, max: 90 },
                tamanho: { type: "number", required: true, min: 40, max: 90 },
                educação: { type: "number", required: true, min: 40, max: 90 },
              },
            },
            ocupação: {
              type: "string",
              required: true,
              options: ["Detetive", "Jornalista", "Professor", "Médico", "Advogado", "Artista"],
            },
            idade: { type: "number", required: true, min: 15, max: 90 },
            sanidade: { type: "number", required: true, min: 0, max: 99 },
            pontosDeMagia: { type: "number", required: true },
            habilidades: {
              type: "list",
              itemType: "string",
              options: ["Investigação", "Psicologia", "Uso de Armas", "Primeiros Socorros", "Biblioteca"],
            },
          },
        },
      ])
      setTemplatesLoading(false)
    }, 1000)
  }, [])

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template)
    setStep(2)
  }

  const handleSubmit = async () => {
    if (!selectedTemplate) return

    setIsLoading(true)
    try {
      // Simular criação do personagem
      await new Promise((resolve) => setTimeout(resolve, 2000))

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
        owner: "Usuário Atual", // Pode ser obtido do contexto de autenticação
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

  // Gerar fallback para avatar baseado no nome
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
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Nova Ficha</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse border-0 shadow-sm">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
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
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Nova Ficha</h1>
          <p className="text-gray-600">{step === 1 ? "Escolha um template" : "Preencha os dados do personagem"}</p>
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Passo 1: Selecione um Template</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => (
              <Card
                key={template.id}
                className="cursor-pointer hover:shadow-md transition-shadow border-0 shadow-sm"
                onClick={() => handleTemplateSelect(template)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-gray-900">{template.system_name}</CardTitle>
                    <Badge variant="secondary">v{template.version}</Badge>
                  </div>
                  <CardDescription className="text-gray-600">{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">Selecionar Template</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {step === 2 && selectedTemplate && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Passo 2: Dados do Personagem</h2>
            <Badge variant="outline">{selectedTemplate.system_name}</Badge>
          </div>

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900">Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <ImageUpload
                value={characterData.photo}
                onChange={(photo) => setCharacterData((prev) => ({ ...prev, photo }))}
                fallback={getAvatarFallback()}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700">
                    Nome do Personagem *
                  </Label>
                  <Input
                    id="name"
                    value={characterData.name}
                    onChange={(e) => setCharacterData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Digite o nome do personagem"
                    required
                    className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="history" className="text-gray-700">
                  História do Personagem
                </Label>
                <Textarea
                  id="history"
                  value={characterData.history}
                  onChange={(e) => setCharacterData((prev) => ({ ...prev, history: e.target.value }))}
                  placeholder="Conte a história do seu personagem..."
                  rows={4}
                  className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900">Atributos da Ficha</CardTitle>
              <CardDescription className="text-gray-600">
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
            <Button variant="outline" onClick={() => setStep(1)} className="border-gray-200 hover:bg-gray-50">
              Voltar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!characterData.name || isLoading}
              className="bg-purple-600 hover:bg-purple-700"
            >
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
