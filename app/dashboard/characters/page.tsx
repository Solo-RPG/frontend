"use client"

import { authService } from "@/lib/service/auth-service"
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
import characterService from '@/lib/service/characters-service'
import { Character } from "@/lib/service/types"

export default function CharactersPage() {
  const { toast } = useToast()
  const [userInfo, setUserInfo] = useState(authService.getUserInfo())
  const [characters, setCharacters] = useState<Character[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterSystem, setFilterSystem] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [characterToDelete, setCharacterToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    // Simular carregamento de personagens
    setTimeout(async () => {
      const loadedCharacters = characterService.getCharactersByOwner(userInfo?.id || "")
      setCharacters(await loadedCharacters)
      setIsLoading(false)
    }, 1000)
  }, [])

  const filteredCharacters = characters.filter((character) => {
    const matchesSearch =
      character.nomePersonagem.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const getSystemColor = (system: string) => {
    const colors: Record<string, string> = {
      "D&D 5e": "bg-red-50 text-red-700 border-red-200",
      "Tormenta 20": "bg-blue-50 text-blue-700 border-blue-200",
      "Call of Cthulhu": "bg-green-50 text-green-700 border-green-200",
    }
    return colors[system] || "bg-gray-50 text-gray-700 border-gray-200"
  }

  const handleDeleteCharacter = async (id: string) => {
    const confirmed = confirm("Tem certeza que deseja deletar este personagem?");
    if (!confirmed) return;

    try {
      setIsDeleting(true);
      await characterService.deleteCharacter(id);
      
      setCharacters(prev => prev.filter(c => c.id !== id));
      toast({
        title: "Personagem deletado",
        description: "O personagem foi removido com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao deletar",
        description: "Não foi possível deletar o personagem.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsDeleting(false);
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
          <p className="text-gray-600">Gerencie seus personagens de RPG</p>
        </div>
        <Button asChild className="bg-purple-600 hover:bg-purple-700">
          <Link href="/dashboard/characters/create">
            <Plus className="mr-2 h-4 w-4" />
            Novo Personagem
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
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredCharacters.map((character) => (
          <Link 
            key={character.id} 
            href={`/dashboard/characters/details/${character.id}`}
            className="hover:shadow-md transition-shadow"
          >
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={character.imagem || "/placeholder.svg"} />
                    <AvatarFallback className="bg-purple-100 text-purple-600">
                      {character.nomePersonagem
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-lg text-gray-900">{character.nomePersonagem}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex space-x-2">
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="flex-1 border-gray-200 hover:bg-gray-50 bg-transparent"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Link href={`/dashboard/characters/details/${character.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        Ver
                      </Link>
                    </Button>
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="flex-1 border-gray-200 hover:bg-gray-50 bg-transparent"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Link href={`/dashboard/characters/${character.id}/edit`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-600 hover:bg-red-50"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteCharacter(character.id)
                      }}
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
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
    </div>
  )
}