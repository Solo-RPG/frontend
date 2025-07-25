"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Users, FileText, Dice6, TrendingUp } from "lucide-react"
import Link from "next/link"
import { CharactersStorage } from "@/lib/characters-storage"

export default function DashboardPage() {
  const [stats, setStats] = useState({
    characters: 0,
    templates: 0,
    campaigns: 0,
  })
  const [recentCharacters, setRecentCharacters] = useState<any[]>([])

  useEffect(() => {
    // Inicializar storage
    CharactersStorage.init()

    // Simular carregamento de estatísticas
    setTimeout(() => {
      const stats = CharactersStorage.getStats()
      setStats(stats)

      // Carregar personagens recentes (últimos 3)
      const allCharacters = CharactersStorage.getAll()
      const recent = allCharacters
        .sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())
        .slice(0, 3)
        .map((char) => ({
          name: char.name,
          system: char.system,
          level: char.level,
        }))

      setRecentCharacters(recent)
    }, 500)
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Bem-vindo de volta! Gerencie suas fichas de RPG.</p>
        </div>
        <Button asChild className="bg-purple-600 hover:bg-purple-700">
          <Link href="/dashboard/characters/create">
            <Plus className="mr-2 h-4 w-4" />
            Nova Ficha
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Personagens</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.characters}</div>
            <p className="text-xs text-gray-500">fichas criadas</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Templates</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.templates}</div>
            <p className="text-xs text-gray-500">sistemas disponíveis</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Campanhas</CardTitle>
            <Dice6 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.campaigns}</div>
            <p className="text-xs text-gray-500">em andamento</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">Personagens Recentes</CardTitle>
            <CardDescription className="text-gray-600">Suas fichas criadas recentemente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentCharacters.length > 0 ? (
                recentCharacters.map((character, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{character.name}</p>
                      <p className="text-sm text-gray-500">
                        {character.system} • {character.level}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 text-sm">Nenhum personagem criado ainda</p>
                  <Button asChild size="sm" className="mt-2 bg-purple-600 hover:bg-purple-700">
                    <Link href="/dashboard/characters/create">
                      <Plus className="mr-2 h-4 w-4" />
                      Criar Primeiro Personagem
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">Ações Rápidas</CardTitle>
            <CardDescription className="text-gray-600">
              Acesse rapidamente as funcionalidades principais
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full justify-start bg-purple-600 hover:bg-purple-700">
              <Link href="/dashboard/characters/create">
                <Plus className="mr-2 h-4 w-4" />
                Criar Nova Ficha
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full justify-start border-gray-200 hover:bg-gray-50 bg-transparent"
            >
              <Link href="/dashboard/characters">
                <Users className="mr-2 h-4 w-4" />
                Ver Todos os Personagens
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full justify-start border-gray-200 hover:bg-gray-50 bg-transparent"
            >
              <Link href="/dashboard/templates">
                <FileText className="mr-2 h-4 w-4" />
                Gerenciar Templates
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <TrendingUp className="h-5 w-5" />
            Atividade Recente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Sistema inicializado com sucesso</span>
              </div>
              <span className="text-xs text-gray-500">agora</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Templates carregados</span>
              </div>
              <span className="text-xs text-gray-500">1 min atrás</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Dashboard carregado</span>
              </div>
              <span className="text-xs text-gray-500">2 min atrás</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
