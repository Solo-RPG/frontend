"use client"
import { LoginForm } from "@/components/auth/login-form"
import { RegisterForm } from "@/components/auth/register-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dice6, Sword, Shield, Users, Sparkles, Crown } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex">
      {/* Lado esquerdo - Conteúdo visual */}
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-20"></div>

        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-4 bg-purple-600/20 backdrop-blur-sm rounded-2xl border border-purple-400/30">
                <Dice6 className="h-12 w-12 text-purple-300" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                  RPG Manager
                </h1>
                <p className="text-purple-200">Suas aventuras começam aqui</p>
              </div>
            </div>

            <h2 className="text-3xl font-bold mb-4 leading-tight">Gerencie suas fichas de RPG de forma épica</h2>
            <p className="text-lg text-slate-300 mb-8 leading-relaxed">
              Crie, organize e compartilhe personagens únicos. Suporte a múltiplos sistemas, templates personalizáveis e
              uma interface intuitiva para mestres e jogadores.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
              <div className="p-3 bg-red-500/20 rounded-lg">
                <Sword className="h-6 w-6 text-red-300" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Personagens Únicos</h3>
                <p className="text-sm text-slate-300">Crie fichas detalhadas com atributos dinâmicos</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <Shield className="h-6 w-6 text-blue-300" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Templates Flexíveis</h3>
                <p className="text-sm text-slate-300">Suporte a D&D, Tormenta e sistemas customizados</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <Users className="h-6 w-6 text-green-300" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Colaboração</h3>
                <p className="text-sm text-slate-300">Compartilhe com seu grupo de RPG</p>
              </div>
            </div>
          </div>

          {/* Elementos decorativos */}
          <div className="absolute top-20 right-20 opacity-20">
            <Crown className="h-24 w-24 text-yellow-400 animate-pulse" />
          </div>
          <div className="absolute bottom-32 right-32 opacity-10">
            <Sparkles className="h-16 w-16 text-purple-400 animate-bounce" />
          </div>
        </div>
      </div>

      {/* Lado direito - Formulário */}
      <div className="flex-1 lg:max-w-md xl:max-w-lg flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 lg:hidden">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="p-3 bg-purple-600 rounded-full">
                <Dice6 className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white">RPG Manager</h1>
            </div>
            <p className="text-slate-300">Gerencie suas fichas de RPG</p>
          </div>

          <Card className="backdrop-blur-sm bg-white/10 border-white/20 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-white text-center text-2xl">Bem-vindo</CardTitle>
              <CardDescription className="text-slate-300 text-center">
                Entre ou crie sua conta para começar sua jornada
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-white/10">
                  <TabsTrigger
                    value="login"
                    className="text-white data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                  >
                    Entrar
                  </TabsTrigger>
                  <TabsTrigger
                    value="register"
                    className="text-white data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                  >
                    Cadastrar
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                  <LoginForm />
                </TabsContent>
                <TabsContent value="register">
                  <RegisterForm />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="flex items-center justify-center gap-8 mt-8 text-slate-400">
            <div className="flex items-center gap-2">
              <Sword className="h-5 w-5" />
              <span className="text-sm">Personagens</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <span className="text-sm">Templates</span>
            </div>
            <div className="flex items-center gap-2">
              <Dice6 className="h-5 w-5" />
              <span className="text-sm">Campanhas</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
