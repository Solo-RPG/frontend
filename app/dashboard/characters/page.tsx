"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { useLocalStorage } from "@/hooks/use-auth"
import { authService } from "@/lib/service/auth-service"
import characterService from '@/lib/service/characters-service'
import { Character, UserInfo } from "@/lib/service/types"
import { useRouter } from "next/navigation"
import { CharactersHeader, SearchInput, CharacterCard, EmptyState, LoadingSkeleton } from "@/components/cards/characters-card"

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
    return <LoadingSkeleton />
  }

  return (
    <div className="space-y-6 sm:px-6 md:px-8 pb-8">
      <CharactersHeader />
      <SearchInput searchTerm={searchTerm} onChange={setSearchTerm} />

      {characters.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCharacters.map((character) => (
            <CharacterCard
              key={character.id}
              character={character}
              onDelete={handleDeleteCharacter}
              onClone={handleCloneCharacter}
              isDeleting={isDeleting}
              isCloning={isCloning}
            />
          ))}
        </div>
      ) : (
        <EmptyState searchTerm={searchTerm} />
      )}
    </div>
  )
}
