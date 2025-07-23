"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Edit, Trash2, User, Calendar, Shield, AlertTriangle, Loader2 } from "lucide-react"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"

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

export default function CharacterDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [character, setCharacter] = useState<Character | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    // Simular carregamento do personagem
    setTimeout(() => {
      setCharacter({
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
      })
      setIsLoading(false)
    }, 1000)
  }, [params.id])

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      // Simular exclusão
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Personagem excluído",
        description: `${character?.name} foi removido com sucesso.`,
      })

      router.push("/dashboard/characters")
    } catch (error) {
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o personagem. Tente novamente.",
        variant: "destructive",
      })
      setIsDeleting(false)
    }
  }

  const renderFieldValue = (key: string, value: any): React.ReactNode => {
    if (typeof value === "object" && value !== null) {
      if (Array.isArray(value)) {
        return (
          <div className="flex flex-wrap gap-1">
            {value.map((item, index) => (
              <Badge key={index} variant="secondary">
                {item}
              </Badge>
            ))}
          </div>
        )
      } else {
        return (
          <div className="space-y-2">
            {Object.entries(value).map(([subKey, subValue]) => (
              <div key={subKey} className="flex justify-between">
                <span className="font-medium capitalize">{subKey}:</span>
                <span>{subValue}</span>
              </div>
            ))}
          </div>
        )
      }
    }
    return <span>{value}</span>
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/characters">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Link>
          </Button>
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
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

  if (!character) {
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
            <Link href="/dashboard/characters">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{character.name}</h1>
            <p className="text-muted-foreground">{character.level}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href={`/dashboard/characters/${character.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Link>
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Excluir personagem
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja excluir {character.name}? Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Excluindo...
                    </>
                  ) : (
                    "Sim, excluir"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informações Básicas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={character.image || "/placeholder.svg"} />
                <AvatarFallback>
                  {character.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{character.name}</h3>
                <p className="text-sm text-muted-foreground">{character.level}</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Sistema:</span>
                <Badge>{character.system}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Criado por:</span>
                <span>{character.owner}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Última modificação:</span>
                <span>{new Date(character.lastModified).toLocaleDateString("pt-BR")}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-6">
          {character.history && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  História do Personagem
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{character.history}</p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Atributos da Ficha
              </CardTitle>
              <CardDescription>Dados específicos do sistema {character.system}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(character.fields).map(([key, value]) => (
                  <div key={key}>
                    <h4 className="font-semibold mb-3 capitalize">{key}</h4>
                    <div className="bg-muted/50 p-4 rounded-lg">{renderFieldValue(key, value)}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
