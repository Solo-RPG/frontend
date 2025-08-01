"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Users, FileText, Dice6, TrendingUp, Loader2 } from "lucide-react"
import Link from "next/link"
import { useLocalStorage } from "@/hooks/use-auth"
import { authService } from "@/lib/service/auth-service"
import CharacterService from "@/lib/service/characters-service"
import { getTemplates } from "@/lib/service/templates-service"
import { Character, UserInfo } from "@/lib/service/types"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

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
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
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
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Bem-vindo de volta! Gerencie suas fichas de RPG.</p>
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

// Componente para cartão de estatísticas
function StatCard({ title, value, description, icon }: {
  title: string
  value: number
  description: string
  icon: React.ReactNode
}) {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <p className="text-xs text-gray-500">{description}</p>
      </CardContent>
    </Card>
  )
}

// Componente para personagens recentes
function RecentCharactersCard({ characters }: { characters: Character[] }) {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-gray-900">Personagens Recentes</CardTitle>
        <CardDescription className="text-gray-600">Seus personagens criados recentemente</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {characters.length > 0 ? (
            characters.map((character) => (
              <Link 
                key={character.id} 
                href={`/dashboard/characters/${character.id}`}
                className="block hover:bg-gray-50 rounded-lg p-2 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{character.nomePersonagem}</p>
                    <p className="text-sm text-gray-500">
                      {character.fichaId ? "Ficha criada" : "Sem ficha vinculada"}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <EmptyState 
              message="Nenhum personagem criado ainda"
              actionText="Criar Primeiro Personagem"
              actionHref="/dashboard/characters/create"
            />
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Componente para ações rápidas
function QuickActionsCard() {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-gray-900">Ações Rápidas</CardTitle>
        <CardDescription className="text-gray-600">
          Acesse rapidamente as funcionalidades principais
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <QuickActionButton 
          href="/dashboard/characters/create"
          icon={<Plus className="mr-2 h-4 w-4" />}
          text="Criar Nova Ficha"
          variant="default"
        />
        <QuickActionButton 
          href="/dashboard/characters"
          icon={<Users className="mr-2 h-4 w-4" />}
          text="Ver Todos os Personagens"
          variant="outline"
        />
        <QuickActionButton 
          href="/dashboard/templates"
          icon={<FileText className="mr-2 h-4 w-4" />}
          text="Gerenciar Templates"
          variant="outline"
        />
      </CardContent>
    </Card>
  )
}

// Componente para atividade recente
function RecentActivityCard({ stats }: { stats: { characters: number, templates: number } }) {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-900">
          <TrendingUp className="h-5 w-5" />
          Atividade Recente
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <ActivityItem 
            color="green" 
            text="Sistema inicializado com sucesso" 
            time="agora" 
          />
          <ActivityItem 
            color="blue" 
            text={`${stats.templates} templates carregados`} 
            time="1 min atrás" 
          />
          <ActivityItem 
            color="purple" 
            text={`${stats.characters} personagens carregados`} 
            time="2 min atrás" 
          />
        </div>
      </CardContent>
    </Card>
  )
}

// Componentes auxiliares
function EmptyState({ message, actionText, actionHref }: {
  message: string
  actionText: string
  actionHref: string
}) {
  return (
    <div className="text-center py-4">
      <p className="text-gray-500 text-sm">{message}</p>
      <Button asChild size="sm" className="mt-2 bg-purple-600 hover:bg-purple-700">
        <Link href={actionHref}>
          <Plus className="mr-2 h-4 w-4" />
          {actionText}
        </Link>
      </Button>
    </div>
  )
}

function QuickActionButton({ href, icon, text, variant = 'default' }: {
  href: string
  icon: React.ReactNode
  text: string
  variant?: 'default' | 'outline'
}) {
  return (
    <Button
      asChild
      variant={variant}
      className={`w-full justify-start ${variant === 'outline' ? 'border-gray-200 hover:bg-gray-50 bg-transparent' : ''}`}
    >
      <Link href={href}>
        {icon}
        {text}
      </Link>
    </Button>
  )
}

function ActivityItem({ color, text, time }: {
  color: 'green' | 'blue' | 'purple'
  text: string
  time: string
}) {
  const colorClasses = {
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500'
  }

  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center space-x-3">
        <div className={`w-2 h-2 rounded-full ${colorClasses[color]}`} />
        <span className="text-sm text-gray-700">{text}</span>
      </div>
      <span className="text-xs text-gray-500">{time}</span>
    </div>
  )
}