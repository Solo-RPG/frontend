"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Upload, Loader2, Save } from "lucide-react"
import Link from "next/link"
import { DynamicFormRenderer } from "@/components/forms/dynamic-form-renderer"

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
    // Simular carregamento do personagem
    setTimeout(() => {
      const characterData = {
        id: params.id as string,
        name: "Aragorn",
        system: "D&D 5e",
        level: "Nível 5 Ranger",
        owner: "João Silva",
        history:
          "Aragorn é um Dúnadan do Norte, herdeiro de Isildur e legítimo rei de Gondor. Criado em Valfenda pelos elfos, ele se tornou um Ranger experiente, protegendo as terras selvagens. Conhecido como Passolargo, ele guia e protege os hobbits em sua jornada para destruir o Um Anel.",
        lastModified: "2024-01-15",
        fields: {
          atributos: {
            força: 16,
            destreza: 14,
            constituição: 15,
            inteligência: 12,
            sabedoria: 15,
            carisma: 14,
          },
          classe: "Ranger",
          raça: "Humano",
          nível: 5,
          pontosDeVida: 58,
          classeDeArmadura: 16,
          habilidades: ["Sobrevivência", "Rastreamento", "Furtividade", "Percepção"],
        },
      }

      setCharacter(characterData)

      // Simular carregamento do template
      setTemplate({
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
        },
      })

      setIsLoading(false)
    }, 1000)
  }, [params.id])

  const handleSubmit = async () => {
    if (!character) return

    setIsSaving(true)
    try {
      // Simular atualização do personagem
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Personagem atualizado com sucesso!",
        description: `${character.name} foi atualizado.`,
      })

      router.push(`/dashboard/characters/${character.id}`)
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
          <Card className="animate-pulse">
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
            <h1 className="text-3xl font-bold tracking-tight">Editar {character.name}</h1>
            <p className="text-muted-foreground">{character.system}</p>
          </div>
        </div>
        <Button onClick={handleSubmit} disabled={isSaving}>
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

      <Card>
        <CardHeader>
          <CardTitle>Informações Básicas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={character.image || "/placeholder.svg"} />
              <AvatarFallback>
                {character.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <Button variant="outline" size="sm">
                <Upload className="mr-2 h-4 w-4" />
                Alterar Foto
              </Button>
              <p className="text-sm text-muted-foreground">Formatos aceitos: JPG, PNG (máx. 2MB)</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Personagem *</Label>
              <Input
                id="name"
                value={character.name}
                onChange={(e) => setCharacter({ ...character, name: e.target.value })}
                placeholder="Digite o nome do personagem"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Sistema</Label>
              <div className="flex items-center h-10">
                <Badge>{character.system}</Badge>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="history">História do Personagem</Label>
            <Textarea
              id="history"
              value={character.history}
              onChange={(e) => setCharacter({ ...character, history: e.target.value })}
              placeholder="Conte a história do seu personagem..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Atributos da Ficha</CardTitle>
          <CardDescription>Edite os campos específicos do sistema {character.system}</CardDescription>
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
