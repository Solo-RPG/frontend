"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Loader2, Save } from "lucide-react"
import Link from "next/link"
import { DynamicFormRenderer } from "@/components/forms/dynamic-form-renderer"
import { CharactersStorage } from "@/lib/characters-storage"
import { ImageUpload } from "@/components/ui/image-upload"

interface Character {
  id: string
  name: string
  system: string
  level: string
  owner: string
  image?: string
  history: string
  lastModified: string
  fields: Record<string, any>
}

interface Template {
  id: string
  system_name: string
  version: string
  description: string
  fields: any
}

export default function EditCharacterPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [character, setCharacter] = useState<Character | null>(null)
  const [template, setTemplate] = useState<Template | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    // Inicializar storage
    CharactersStorage.init()

    // Simular carregamento do personagem
    setTimeout(() => {
      const loadedCharacter = CharactersStorage.getById(params.id as string)

      if (loadedCharacter) {
        setCharacter(loadedCharacter)

        // Simular carregamento do template baseado no sistema
        let templateFields = {}

        if (loadedCharacter.system === "D&D 5e") {
          templateFields = {
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
              options: [
                "Acrobacia",
                "Arcanismo",
                "Atletismo",
                "Enganação",
                "História",
                "Intimidação",
                "Sobrevivência",
                "Rastreamento",
                "Furtividade",
                "Percepção",
              ],
            },
          }
        } else if (loadedCharacter.system === "Tormenta 20") {
          templateFields = {
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
          }
        } else if (loadedCharacter.system === "Call of Cthulhu") {
          templateFields = {
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
          }
        }

        setTemplate({
          id: "1",
          system_name: loadedCharacter.system,
          version: "1.0",
          description: "Template do sistema",
          fields: templateFields,
        })
      }

      setIsLoading(false)
    }, 1000)
  }, [params.id])

  const handleSubmit = async () => {
    if (!character) return

    setIsSaving(true)
    try {
      // Simular atualização do personagem
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Atualizar no storage
      const updatedCharacter = CharactersStorage.update(character.id, {
        name: character.name,
        history: character.history,
        image: character.image,
        fields: character.fields,
      })

      if (updatedCharacter) {
        toast({
          title: "Personagem atualizado com sucesso!",
          description: `${character.name} foi atualizado.`,
        })

        router.push(`/dashboard/characters/${character.id}`)
      } else {
        throw new Error("Erro ao atualizar personagem")
      }
    } catch (error) {
      toast({
        title: "Erro ao atualizar personagem",
        description: "Ocorreu um erro. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Gerar fallback para avatar baseado no nome
  const getAvatarFallback = () => {
    if (!character?.name) return "PJ"
    return character.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/characters/${params.id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Link>
          </Button>
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
        <div className="grid gap-6">
          <Card className="animate-pulse border-0 shadow-sm">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!character || !template) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Personagem não encontrado</h2>
        <Button asChild>
          <Link href="/dashboard/characters">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Personagens
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/characters/${character.id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Editar {character.name}</h1>
            <p className="text-gray-600">{character.system}</p>
          </div>
        </div>
        <Button onClick={handleSubmit} disabled={isSaving} className="bg-purple-600 hover:bg-purple-700">
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Salvar Alterações
            </>
          )}
        </Button>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">Informações Básicas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <ImageUpload
            value={character.image || ""}
            onChange={(image) => setCharacter({ ...character, image })}
            fallback={getAvatarFallback()}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700">
                Nome do Personagem *
              </Label>
              <Input
                id="name"
                value={character.name}
                onChange={(e) => setCharacter({ ...character, name: e.target.value })}
                placeholder="Digite o nome do personagem"
                required
                className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700">Sistema</Label>
              <div className="flex items-center h-10">
                <Badge>{character.system}</Badge>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="history" className="text-gray-700">
              História do Personagem
            </Label>
            <Textarea
              id="history"
              value={character.history}
              onChange={(e) => setCharacter({ ...character, history: e.target.value })}
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
            Edite os campos específicos do sistema {character.system}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DynamicFormRenderer
            fields={template.fields}
            values={character.fields}
            onChange={(fields) => setCharacter({ ...character, fields })}
          />
        </CardContent>
      </Card>
    </div>
  )
}
