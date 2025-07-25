"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Search, Eye, Edit, Trash2, Filter, AlertTriangle, Loader2 } from "lucide-react"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { CharactersStorage } from "@/lib/characters-storage"

interface Character {
  id: string
  name: string
  system: string
  level: string
  owner: string
  image?: string
  lastModified: string
}

export default function CharactersPage() {
  const { toast } = useToast()
  const [characters, setCharacters] = useState<Character[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterSystem, setFilterSystem] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [characterToDelete, setCharacterToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    // Inicializar storage
    CharactersStorage.init()

    // Simular carregamento de personagens
    setTimeout(() => {
      const loadedCharacters = CharactersStorage.getAll()
      setCharacters(loadedCharacters)
      setIsLoading(false)
    }, 1000)
  }, [])

  const filteredCharacters = characters.filter((character) => {
    const matchesSearch =
      character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      character.system.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterSystem === "all" || character.system === filterSystem
    return matchesSearch && matchesFilter
  })

  const systems = Array.from(new Set(characters.map((c) => c.system)))

  const getSystemColor = (system: string) => {
    const colors: Record<string, string> = {
      "D&D 5e": "bg-red-50 text-red-700 border-red-200",
      "Tormenta 20": "bg-blue-50 text-blue-700 border-blue-200",
      "Call of Cthulhu": "bg-green-50 text-green-700 border-green-200",
    }
    return colors[system] || "bg-gray-50 text-gray-700 border-gray-200"
  }

  const handleDeleteCharacter = async () => {
    if (!characterToDelete) return

    setIsDeleting(true)

    try {
      // Simular exclusão
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Remover do storage
      const success = CharactersStorage.remove(characterToDelete)

      if (success) {
        // Atualizar lista local
        setCharacters(characters.filter((c) => c.id !== characterToDelete))

        toast({
          title: "Personagem excluído",
          description: "O personagem foi removido com sucesso.",
        })
      } else {
        throw new Error("Personagem não encontrado")
      }
    } catch (error) {
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o personagem. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setCharacterToDelete(null)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Meus Personagens</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Meus Personagens</h1>
          <p className="text-gray-600">Gerencie suas fichas de RPG</p>
        </div>
        <Button asChild className="bg-purple-600 hover:bg-purple-700">
          <Link href="/dashboard/characters/create">
            <Plus className="mr-2 h-4 w-4" />
            Nova Ficha
          </Link>
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar personagens..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="border-gray-200 hover:bg-gray-50 bg-transparent">
              <Filter className="mr-2 h-4 w-4" />
              {filterSystem === "all" ? "Todos os Sistemas" : filterSystem}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setFilterSystem("all")}>Todos os Sistemas</DropdownMenuItem>
            {systems.map((system) => (
              <DropdownMenuItem key={system} onClick={() => setFilterSystem(system)}>
                {system}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredCharacters.map((character) => (
          <Card key={character.id} className="hover:shadow-md transition-shadow border-0 shadow-sm">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={character.image || "/placeholder.svg"} />
                  <AvatarFallback className="bg-purple-100 text-purple-600">
                    {character.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-lg text-gray-900">{character.name}</CardTitle>
                  <CardDescription className="text-gray-600">{character.level}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge className={`border ${getSystemColor(character.system)}`}>{character.system}</Badge>
                  <span className="text-sm text-gray-500">
                    {new Date(character.lastModified).toLocaleDateString("pt-BR")}
                  </span>
                </div>
                <p className="text-sm text-gray-600">Criado por: {character.owner}</p>
                <div className="flex space-x-2">
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="flex-1 border-gray-200 hover:bg-gray-50 bg-transparent"
                  >
                    <Link href={`/dashboard/characters/${character.id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      Ver
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="flex-1 border-gray-200 hover:bg-gray-50 bg-transparent"
                  >
                    <Link href={`/dashboard/characters/${character.id}/edit`}>
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50 bg-transparent"
                    onClick={() => setCharacterToDelete(character.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCharacters.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Search className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum personagem encontrado</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || filterSystem !== "all"
              ? "Tente ajustar seus filtros de busca"
              : "Você ainda não criou nenhum personagem"}
          </p>
          <Button asChild className="bg-purple-600 hover:bg-purple-700">
            <Link href="/dashboard/characters/create">
              <Plus className="mr-2 h-4 w-4" />
              Criar Primeira Ficha
            </Link>
          </Button>
        </div>
      )}

      <AlertDialog open={!!characterToDelete} onOpenChange={(open) => !open && setCharacterToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Excluir personagem
            </AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este personagem? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCharacter}
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
  )
}
