"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Users, FileText} from "lucide-react"
import { useLocalStorage } from "@/hooks/use-auth"
import { authService } from "@/lib/service/auth-service"
import CharacterService from "@/lib/service/characters-service"
import { getTemplates } from "@/lib/service/templates-service"
import { Character, UserInfo } from "@/lib/service/types"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { QuickActionsCard } from "@/components/cards/quickactionscard"
import { RecentActivityCard } from "@/components/cards/recentactivitycard"
import { RecentCharactersCard } from "@/components/cards/recentcharacterscard"
import { StatCard } from "@/components/cards/statcard"

export default function DashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUserInfo] = useLocalStorage<UserInfo | null>('@solo-rpg:user', null)
  const [stats, setStats] = useState({
    characters: 0,
    templates: 0,
    campaigns: 0,
  })
  const [recentCharacters, setRecentCharacters] = useState<Character[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUserLoading, setIsUserLoading] = useState(true)

  // Load user info
  useEffect(() => {
    if (!user) {
      const info = authService.getUserInfo()
      if (!info) {
        router.push('/login')
        return
      }
      setUserInfo(info)
    }
    setIsUserLoading(false)
  }, [user, setUserInfo, router])

  // Load dashboard data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        
        if (user?.id) {
          const [characters, templates] = await Promise.all([
            CharacterService.getCharactersByOwner(user.id),
            getTemplates()
          ])

          setStats({
            characters: characters.length,
            templates: templates.length || 0,
            campaigns: 0
          })

          // Get last 3 characters ordered by creation date
          setRecentCharacters(
            characters.slice(0, 3) // Mostrar apenas os 3 mais recentes
          )
        }
      } catch (error) {
        console.error("Failed to load dashboard data:", error)
        toast({
          title: "Erro ao carregar",
          description: "Não foi possível carregar os dados do dashboard.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      loadData()
    }
  }, [user, toast])

  if (isUserLoading || isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Dashboard</h1>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse border-0 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
              </CardHeader>
              <CardContent>
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {[...Array(2)].map((_, i) => (
            <Card key={i} className="animate-pulse border-0 shadow-sm">
              <CardHeader>
                <div className="h-5 bg-gray-200 rounded w-1/3 mb-1"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="flex items-center space-x-4 mb-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Dashboard</h1>
          <p className="text-gray-400">Bem-vindo de volta! Gerencie suas fichas de RPG.</p>
        </div>
      </header>

      <section className="grid gap-6 md:grid-cols-3">
        <StatCard 
          title="Personagens" 
          value={stats.characters} 
          description="personagens criados" 
          icon={<Users className="h-4 w-4 text-purple-600" />}
        />
        <StatCard 
          title="Templates" 
          value={stats.templates} 
          description="sistemas disponíveis" 
          icon={<FileText className="h-4 w-4 text-blue-600" />}
        />
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <RecentCharactersCard characters={recentCharacters} />
        <QuickActionsCard />
      </section>

      <RecentActivityCard stats={stats} />
    </div>
  )
}



