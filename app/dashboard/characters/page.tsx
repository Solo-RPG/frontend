"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, Search, Eye, Edit, Trash2, Loader2, Clipboard } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useLocalStorage } from "@/hooks/use-auth"
import { authService } from "@/lib/service/auth-service"
import characterService from '@/lib/service/characters-service'
import { Character, UserInfo } from "@/lib/service/types"
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Avatar, 
  AvatarFallback, 
  AvatarImage 
} from "@/components/ui/avatar"
import { useRouter } from "next/navigation"

export default function CharactersPage() {
  const { toast } = useToast()
  const [userInfo, setUserInfo] = useLocalStorage<UserInfo | null>('@solo-rpg:user', null)
  const [characters, setCharacters] = useState<Character[]>([])
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isCloning, setIsCloning] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUserLoading, setIsUserLoading] = useState(true)
  const router = useRouter()

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Load user info
  useEffect(() => {
    if (!userInfo) {
      const info = authService.getUserInfo()
      if (!info) {
        router.push('/login')
        return
      }
      setUserInfo(info)
    }
    setIsUserLoading(false)
  }, [userInfo, setUserInfo, router])

  // Load characters
  useEffect(() => {
    if (!userInfo?.id) {
      setIsLoading(false)
      return
    }

    const controller = new AbortController()
    
    const loadCharacters = async () => {
      try {
        setIsLoading(true)
        const loadedCharacters = await characterService.getCharactersByOwner(userInfo.id)
        setCharacters(loadedCharacters)
      } catch (error) {
        console.error("Failed to load characters:", error)
        toast({
          title: "Erro ao carregar",
          description: "Não foi possível carregar os personagens.",
          variant: "destructive",
        })
        setCharacters([])
      } finally {
        setIsLoading(false)
      }
    }

    loadCharacters()

    return () => controller.abort()
  }, [userInfo?.id, toast])
  
  const filteredCharacters = characters.filter((character) => {
    console.log(character)
    return character.nome_personagem.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  })

  const handleCloneCharacter = async (character: Character, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      setIsCloning(true)
      const cloneData = {
        ...character,
        id: undefined, // backend deve gerar novo id
        nome_personagem: `${character.nome_personagem} (Cópia)`,
        createdAt: new Date().toISOString(),
      }

      const newCharacter = await characterService.createCharacter(cloneData)
      setCharacters(prev => [newCharacter, ...prev])

      toast({
        title: "Personagem clonado",
        description: `"${character.nome_personagem}" foi duplicado com sucesso.`,
      })
    } catch (error) {
      console.error(error)
      toast({
        title: "Erro ao clonar",
        description: "Não foi possível duplicar o personagem.",
        variant: "destructive",
      })
    } finally {
      setIsCloning(false)
    }
  } 

  const handleDeleteCharacter = async (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const confirmed = window.confirm("Tem certeza que deseja deletar este personagem?")
    if (!confirmed) return

    try {
      setIsDeleting(true)
      await characterService.deleteCharacter(id)
      
      setCharacters(prev => prev.filter(c => c.id !== id))
      toast({
        title: "Personagem deletado",
        description: "O personagem foi removido com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro ao deletar",
        description: "Não foi possível deletar o personagem.",
        variant: "destructive",
      })
      console.error(error)
    } finally {
      setIsDeleting(false)
    }
  }

  if (isUserLoading || isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Meus Personagens</h1>
          <Button disabled className="bg-purple-600 hover:bg-purple-700">
            <Plus className="mr-2 h-4 w-4" />
            Novo Personagem
          </Button>
        </div>
        
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar personagens..."
            value={searchTerm || ""}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse border-0 shadow-sm">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  <div className="h-9 bg-gray-200 rounded flex-1"></div>
                  <div className="h-9 bg-gray-200 rounded flex-1"></div>
                  <div className="h-9 bg-gray-200 rounded w-9"></div>
                </div>
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
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Meus Personagens</h1>
          <p className="text-gray-600 dark:text-gray-400">Gerencie seus personagens de RPG</p>
        </div>
        <Button asChild className="bg-purple-600 hover:bg-purple-700">
          <Link href="/dashboard/characters/create">
            <Plus className="mr-2 h-4 w-4" />
            Novo Personagem
          </Link>
        </Button>
      </div>

      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Buscar personagens..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
        />
      </div>

      {characters.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCharacters.map((character) => (
            <Link 
              key={character.id} 
              href={`/dashboard/characters/${character.id}`}
              className="hover:shadow-md transition-shadow"
            >
              <Card className="border-0 shadow-sm hover:border-purple-200 transition-colors">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={character.imagem || "/placeholder.svg"} />
                      <AvatarFallback className="bg-purple-100 text-purple-600">
                        {character.nome_personagem
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{character.nome_personagem}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-zinc-900 text-red-600 border-zinc-900 hover:bg-red-600 hover:text-white"
                      onClick={(e) => handleDeleteCharacter(character.id, e)}
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-zinc-900 text-gray-600 border-zinc-900 hover:bg-gray-600 hover:text-white"
                      onClick={(e) => handleCloneCharacter(character, e)}
                      disabled={isCloning}
                    >
                      {isCloning ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Clipboard className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Search className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? "Nenhum personagem encontrado" : "Você ainda não criou nenhum personagem"}
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm ? "Tente ajustar sua busca" : "Comece criando seu primeiro personagem"}
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